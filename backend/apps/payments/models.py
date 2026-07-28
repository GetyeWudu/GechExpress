from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.orders.models import Order


class Payment(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    class Provider(models.TextChoices):
        STRIPE = "stripe", "Stripe"
        PAYPAL = "paypal", "PayPal"
        CHAPA = "chapa", "Chapa"
        OTHER = "other", "Other"

    order = models.OneToOneField(
        Order,
        on_delete=models.PROTECT,
        related_name="payment",
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
    )

    currency = models.CharField(
        max_length=3,
        default="ETB",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    provider = models.CharField(
        max_length=50,
        choices=Provider.choices,
        default=Provider.OTHER,
    )

    # Provider-specific transaction ID
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    # Provider-specific reference
    provider_reference = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    # Optional payment method details (for display only, not sensitive data)
    payment_method = models.CharField(
        max_length=100,
        blank=True,
    )

    # Error message if payment failed
    error_message = models.TextField(
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
                fields=["transaction_id"]
            ),
        ]

    def __str__(self):
        return (
            f"Payment({self.order.order_number}, "
            f"{self.status})"
        )
