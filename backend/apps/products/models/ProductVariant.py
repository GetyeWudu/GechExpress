from django.db import models
from .Product import Product
from .Attribute import AttributeValue


class ProductVariant(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="variants",
    )

    sku = models.CharField(
        max_length=100,
        unique=True,
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
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
        ordering = ["price", "id"]

    def __str__(self):
        return (
            f"{self.product.name} - "
            f"{self.sku}"
        )

class VariantAttributeValue(models.Model):

    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name="attribute_values",
    )

    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="variant_usages",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "variant",
                    "attribute_value",
                ],
                name="unique_variant_attribute_value",
            ),
        ]

    def __str__(self):
        return (
            f"{self.variant.sku} - "
            f"{self.attribute_value.value}"
        )    