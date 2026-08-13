from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import F, Q

from apps.products.managers import SoftDeleteManager, AllObjectsManager
from apps.products.models.Product import Product
from apps.products.models.ProductVariant import ProductVariant


class Warehouse(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    def __str__(self):
        return f"{self.name} ({self.code})"


class Inventory(models.Model):
    warehouse = models.ForeignKey(
        Warehouse,
        on_delete=models.PROTECT,
        related_name="inventories",
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="inventories",
        null=True,
        blank=True,
    )
    product_variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="inventories",
        null=True,
        blank=True,
    )
    quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        verbose_name_plural = "Inventories"
        constraints = [
            # models.UniqueConstraint(
            #     fields=["warehouse", "product_variant"],
            #     condition=Q(is_deleted=False, product_variant__isnull=False),
            #     name="unique_active_inventory_warehouse_variant",
            # ),
            # models.UniqueConstraint(
            #     fields=["warehouse", "product"],
            #     condition=Q(is_deleted=False, product__isnull=False,
            #                 product_variant__isnull=True),
            #     name="unique_active_inventory_warehouse_product",
            # ),
            models.CheckConstraint(
                condition=Q(quantity__gte=0),
                name="inventory_quantity_gte_0",
            ),
            models.CheckConstraint(
                condition=Q(reserved_quantity__gte=0),
                name="inventory_reserved_quantity_gte_0",
            ),
            models.CheckConstraint(
                condition=Q(quantity__gte=F("reserved_quantity")),
                name="inventory_reserved_lte_quantity",
            ),
        ]

    def __str__(self):
        target = self.product_variant.sku if self.product_variant_id else (
            self.product.name if self.product_id else "unassigned"
        )
        return f"{target} @ {self.warehouse.code}"

    @property
    def available_quantity(self):
        return self.quantity - self.reserved_quantity

    def clean(self):
        if not self.product_id and not self.product_variant_id:
            raise ValidationError(
                "Inventory requires a product or product variant.")
        if self.quantity < 0:
            raise ValidationError(
                {"quantity": "Quantity must be greater than or equal to 0."})
        if self.reserved_quantity < 0:
            raise ValidationError(
                {"reserved_quantity": "Reserved quantity must be greater than or equal to 0."}
            )
        if self.reserved_quantity > self.quantity:
            raise ValidationError(
                {"reserved_quantity": "Reserved quantity cannot be greater than quantity."}
            )
        if self.product_variant_id and not self.product_id:
            self.product = self.product_variant.product

    def reserve(self, quantity):
        if quantity <= 0:
            raise ValidationError(
                {"quantity": "Reserve quantity must be greater than 0."})
        if quantity > self.available_quantity:
            raise ValidationError(
                {"quantity": "Insufficient available stock."})

        self.reserved_quantity += quantity
        self.full_clean()
        self.save(update_fields=["reserved_quantity", "updated_at"])

    def release(self, quantity):
        if quantity <= 0:
            raise ValidationError(
                {"quantity": "Release quantity must be greater than 0."})
        if quantity > self.reserved_quantity:
            raise ValidationError(
                {"quantity": "Release quantity cannot be greater than reserved quantity."}
            )

        self.reserved_quantity -= quantity
        self.full_clean()
        self.save(update_fields=["reserved_quantity", "updated_at"])

    def adjust(self, delta):
        new_quantity = self.quantity + delta
        if new_quantity < 0:
            raise ValidationError(
                {"quantity": "Adjustment would result in negative stock."})
        if self.reserved_quantity > new_quantity:
            raise ValidationError(
                {"quantity": "Quantity cannot be lower than reserved quantity."}
            )

        self.quantity = new_quantity
        self.full_clean()
        self.save(update_fields=["quantity", "updated_at"])

    @classmethod
    @transaction.atomic
    def reserve_for_variant(cls, *, product_variant, quantity):
        if quantity <= 0:
            raise ValidationError(
                {"quantity": "Reserve quantity must be greater than 0."})

        inventories = (
            cls.objects.select_for_update()
            .filter(
                product_variant=product_variant,
                is_deleted=False,
                warehouse__is_active=True,
                warehouse__is_deleted=False,
            )
            .order_by("id")
        )

        total_available = sum(
            inventory.available_quantity for inventory in inventories)
        if total_available < quantity:
            raise ValidationError(
                {"quantity": "Insufficient available stock."})

        remaining = quantity
        reserved_inventories = []
        for inventory in inventories:
            if remaining <= 0:
                break
            available = inventory.available_quantity
            if available <= 0:
                continue
            reserve_quantity = min(available, remaining)
            inventory.reserve(reserve_quantity)
            reserved_inventories.append(inventory)
            remaining -= reserve_quantity

        return reserved_inventories

    @classmethod
    @transaction.atomic
    def reserve_for_product(cls, *, product, quantity):
        """Backward-compatible helper: prefer variant inventory, else product inventory."""
        default_variant = (
            ProductVariant.objects.active_available()
            .filter(product=product, is_default=True)
            .first()
            or ProductVariant.objects.active_available()
            .filter(product=product)
            .order_by("id")
            .first()
        )
        if default_variant:
            return cls.reserve_for_variant(
                product_variant=default_variant,
                quantity=quantity,
            )

        if quantity <= 0:
            raise ValidationError(
                {"quantity": "Reserve quantity must be greater than 0."})

        inventories = (
            cls.objects.select_for_update()
            .filter(
                product=product,
                product_variant__isnull=True,
                is_deleted=False,
                warehouse__is_active=True,
                warehouse__is_deleted=False,
            )
            .order_by("id")
        )
        total_available = sum(
            inventory.available_quantity for inventory in inventories)
        if total_available < quantity:
            raise ValidationError(
                {"quantity": "Insufficient available stock."})

        remaining = quantity
        reserved_inventories = []
        for inventory in inventories:
            if remaining <= 0:
                break
            available = inventory.available_quantity
            if available <= 0:
                continue
            reserve_quantity = min(available, remaining)
            inventory.reserve(reserve_quantity)
            reserved_inventories.append(inventory)
            remaining -= reserve_quantity

        return reserved_inventories
