from django.db import models
from jsonschema import ValidationError
from .Attribute import Attribute,AttributeValue
from .Category import Category

class CategoryAttribute(models.Model):

    class Scope(models.TextChoices):
        PRODUCT = "PRODUCT", "Product"
        VARIANT = "VARIANT", "Variant"

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="category_attributes",
    )

    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="category_attributes",
    )

    scope = models.CharField(
        max_length=20,
        choices=Scope.choices,
    )

    is_required = models.BooleanField(
        default=False,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:

        ordering = [
            "display_order",
            "id",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "category",
                    "attribute",
                ],
                name="unique_category_attribute",
            ),
        ]

    def __str__(self):
        return (
            f"{self.category.name} - "
            f"{self.attribute.name}"
        )
# ============================================================
# CATEGORY ATTRIBUTE VALUE
# ============================================================

class CategoryAttributeValue(models.Model):

    category_attribute = models.ForeignKey(
        CategoryAttribute,
        on_delete=models.CASCADE,
        related_name="allowed_values",
    )

    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="category_configurations",
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = [
            "display_order",
            "id",
        ]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "category_attribute",
                    "attribute_value",
                ],
                name="unique_category_attribute_value",
            ),
        ]

    def clean(self):

        if (
            self.category_attribute.attribute_id
            != self.attribute_value.attribute_id
        ):
            raise ValidationError(
                {
                    "attribute_value": (
                        "The attribute value must "
                        "belong to the same attribute "
                        "as the category attribute."
                    )
                }
            )

    def __str__(self):
        return (
            f"{self.category_attribute} - "
            f"{self.attribute_value.value}"
        )