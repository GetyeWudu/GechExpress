from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.core.exceptions import ValidationError

from apps.products.models.Product import Product


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    # Valid status transitions: from_status -> [allowed_to_status, ...]
    VALID_TRANSITIONS = {
        Status.PENDING: [
            Status.CONFIRMED,
            Status.CANCELLED,
        ],
        Status.CONFIRMED: [
            Status.PROCESSING,
            Status.CANCELLED,
        ],
        Status.PROCESSING: [
            Status.SHIPPED,
            Status.CANCELLED,
        ],
        Status.SHIPPED: [
            Status.DELIVERED,
            Status.CANCELLED,
        ],
        Status.DELIVERED: [
            # Delivered is terminal, but can issue refunds separately
        ],
        Status.CANCELLED: [
            # Cancelled is terminal
        ],
    }

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders",
    )

    order_number = models.CharField(
        max_length=50,
        unique=True,
        editable=False,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    # Historical totals
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    shipping_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    # Snapshot of customer's shipping information
    shipping_full_name = models.CharField(
        max_length=255,
    )

    shipping_phone = models.CharField(
        max_length=30,
    )

    shipping_address = models.TextField()

    shipping_city = models.CharField(
        max_length=100,
    )

    shipping_country = models.CharField(
        max_length=100,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["user", "-created_at"]
            ),
            models.Index(
                fields=["status", "-created_at"]
            ),
        ]

    def __str__(self):
        return self.order_number

    def can_transition_to(self, new_status):
        """
        Check if order can transition from current status to new status.
        """
        allowed_transitions = (
            self.VALID_TRANSITIONS.get(
                self.status,
                [],
            )
        )
        return new_status in allowed_transitions

    def clean(self):
        """
        Validate status transitions before saving.
        """
        if self.pk:  # Only validate on updates
            old_instance = Order.objects.get(pk=self.pk)
            if (
                old_instance.status != self.status
                and not self.can_transition_to(
                    self.status
                )
            ):
                raise ValidationError(
                    {
                        "status": (
                            f"Cannot transition from "
                            f"{old_instance.status} "
                            f"to {self.status}"
                        )
                    }
                )

    def save(self, *args, **kwargs):
        """
        Run validations before saving, but allow bypass for internal operations.
        Use save(skip_validation=True) when called from services that manage status.
        """
        skip_validation = kwargs.pop(
            "skip_validation",
            False,
        )
        
        if not skip_validation:
            self.full_clean()
        
        super().save(*args, **kwargs)


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product_variant = models.ForeignKey(
        "products.ProductVariant",
        on_delete=models.PROTECT,
        related_name="order_items",
        null=True,
        blank=True,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
        null=True,
        blank=True,
    )

    selected_options = models.JSONField(
        default=dict,
        blank=True,
    )

    # Historical snapshots
    product_name = models.CharField(
        max_length=255,
    )

    sku = models.CharField(
        max_length=100,
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1)
        ],
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00"))
        ],
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return (
            f"{self.order.order_number} - "
            f"{self.product_name}"
        )