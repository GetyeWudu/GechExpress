from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import F, IntegerField, OuterRef, Subquery, Sum, Value
from django.db.models.functions import Coalesce

from apps.products.models.attribute import AttributeValue
from apps.products.models.base import SoftDeleteManager, SoftDeleteModel, SoftDeleteQuerySet
from apps.products.models.product import Product


class ProductVariantQuerySet(SoftDeleteQuerySet):
    def active(self):
        return self.filter(is_active=True, is_deleted=False)

    def with_available_stock(self):
        from apps.inventory.models import Inventory

        available_subquery = (
            Inventory.objects.filter(
                product_variant_id=OuterRef("pk"),
                is_deleted=False,
                warehouse__is_active=True,
                warehouse__is_deleted=False,
            )
            .values("product_variant_id")
            .annotate(
                total=Sum(
                    F("quantity") - F("reserved_quantity"),
                    output_field=IntegerField(),
                )
            )
            .values("total")[:1]
        )

        return self.annotate(
            available_stock=Coalesce(
                Subquery(available_subquery, output_field=IntegerField()),
                Value(0),
                output_field=IntegerField(),
            )
        )

    def active_available(self):
        """
        Active variants that currently have sellable stock.
        available = quantity - reserved_quantity across active warehouses.
        """
        return self.active().with_available_stock().filter(available_stock__gt=0)


class ProductVariantManager(SoftDeleteManager):
    def get_queryset(self):
        return ProductVariantQuerySet(self.model, using=self._db).filter(is_deleted=False)

    def active_available(self):
        return self.get_queryset().active_available()


class ProductVariant(SoftDeleteModel):
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="variants",
    )
    sku = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="ETB")
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    attribute_values = models.ManyToManyField(
        AttributeValue,
        through="VariantAttributeValue",
        related_name="variants",
        blank=True,
    )

    objects = ProductVariantManager()
    all_objects = models.Manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product"],
                condition=models.Q(is_default=True, is_deleted=False),
                name="one_active_default_variant",
            ),
        ]

    def __str__(self):
        return f"{self.product.name} ({self.sku})"

    @property
    def available_quantity(self):
        from apps.inventory.models import Inventory

        inventories = Inventory.objects.filter(
            product_variant=self,
            is_deleted=False,
            warehouse__is_active=True,
            warehouse__is_deleted=False,
        )
        return sum(item.available_quantity for item in inventories)

    @property
    def is_in_stock(self):
        return self.available_quantity > 0


class VariantAttributeValue(models.Model):
    """One selected attribute value on a concrete sellable variant."""

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="variant_attribute_values",
    )
    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="variant_assignments",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["variant", "attribute_value"],
                name="unique_variant_attribute_value",
            ),
        ]

    def clean(self):
        # Exactly one value per attribute on a given variant (e.g. one Size).
        existing = VariantAttributeValue.objects.filter(
            variant=self.variant,
            attribute_value__attribute=self.attribute_value.attribute,
        ).exclude(pk=self.pk)

        if existing.exists():
            raise ValidationError(
                "A variant can only have one value per attribute."
            )

        # Must be in the product's allowed option pool when configured.
        product = self.variant.product
        allowed = product.product_attribute_values.filter(
            attribute_value=self.attribute_value,
        ).exists()
        has_pool = product.product_attribute_values.exists()
        if has_pool and not allowed:
            raise ValidationError(
                "Attribute value is not configured for this product."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.variant.sku} - "
            f"{self.attribute_value.attribute.name}: "
            f"{self.attribute_value.value}"
        )
