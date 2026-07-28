from django.db import models

from apps.products.utils import generate_unique_slug


class Attribute(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="attribute_values",
    )
    value = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["attribute", "value"],
                name="unique_attribute_value",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.value)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class ProductAttribute(models.Model):
    """Declares which attribute types a product supports (e.g. Color, Size)."""

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="product_attributes",
    )
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="product_attributes",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "attribute"],
                name="unique_product_attribute",
            ),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.attribute.name}"


class ProductAttributeValue(models.Model):
    """
    Option pool for a product listing (Etsy-style).

    A product MAY have many values for the same attribute
    (e.g. Color=Black AND Color=Navy). Concrete sellable
    combinations live on ProductVariant / VariantAttributeValue.
    """

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="product_attribute_values",
    )
    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="product_assignments",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "attribute_value"],
                name="unique_product_attribute_value",
            ),
        ]

    def save(self, *args, **kwargs):
        ProductAttribute.objects.get_or_create(
            product=self.product,
            attribute=self.attribute_value.attribute,
        )
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.product.name} - "
            f"{self.attribute_value.attribute.name}: "
            f"{self.attribute_value.value}"
        )
