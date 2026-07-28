from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from decimal import Decimal

from apps.orders.models import Order


class ShippingMethod(models.Model):
    """
    Different shipping options/carriers available.
    e.g., Standard Shipping, Express, Overnight, etc.
    """

    name = models.CharField(
        max_length=100,
    )

    code = models.CharField(
        max_length=50,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    base_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(Decimal("0.00"))
        ],
    )

    estimated_days_min = models.PositiveIntegerField(
        default=1,
    )

    estimated_days_max = models.PositiveIntegerField(
        default=5,
    )

    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Shipment(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PREPARING = "preparing", "Preparing"
        SHIPPED = "shipped", "Shipped"
        IN_TRANSIT = "in_transit", "In Transit"
        DELIVERED = "delivered", "Delivered"
        FAILED = "failed", "Failed"
        RETURNED = "returned", "Returned"

    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name="shipment",
    )

    shipping_method = models.ForeignKey(
        ShippingMethod,
        on_delete=models.SET_NULL,
        null=True,
        related_name="shipments",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    # Shipping address (can be different from order shipping address)
    recipient_full_name = models.CharField(
        max_length=255,
    )

    recipient_phone = models.CharField(
        max_length=30,
    )

    recipient_address = models.TextField()

    recipient_city = models.CharField(
        max_length=100,
    )

    recipient_country = models.CharField(
        max_length=100,
    )

    # Tracking information
    tracking_number = models.CharField(
        max_length=100,
        blank=True,
        db_index=True,
    )

    carrier_url = models.URLField(
        blank=True,
    )

    # Timestamps
    shipped_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # Carrier-specific info
    carrier_reference = models.CharField(
        max_length=255,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
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
                fields=["order", "-created_at"]
            ),
            models.Index(
                fields=["status", "-created_at"]
            ),
            models.Index(
                fields=["tracking_number"]
            ),
        ]

    def __str__(self):
        return (
            f"Shipment({self.order.order_number}, "
            f"{self.status})"
        )


class ShipmentItem(models.Model):
    """
    Items included in a shipment.
    Allows partial shipments where an order's items
    may be shipped in multiple batches.
    """

    shipment = models.ForeignKey(
        Shipment,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.PROTECT,
        related_name="shipment_items",
        null=True,
        blank=True,
    )

    quantity = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1)
        ],
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return (
            f"ShipmentItem("
            f"{self.shipment.id}, "
            f"{self.product.sku})"
        )
