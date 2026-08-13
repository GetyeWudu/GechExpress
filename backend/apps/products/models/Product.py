
from django.db import models
from .Category import Category
from django.conf import settings
from ..utils import generate_unique_slug
from .Attribute import AttributeValue
from ..managers import SoftDeleteManager, AllObjectsManager


class Product(models.Model):

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )

    name = models.CharField(
        max_length=255,
    )

    slug = models.SlugField(
        max_length=280,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    # --------------------------------------------------------
    # Accountability
    # --------------------------------------------------------

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="created_products",
    )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="updated_products",
        null=True,
        blank=True,
    )

    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="deleted_products",
        null=True,
        blank=True,
    )

    # --------------------------------------------------------
    # Product state
    # --------------------------------------------------------

    is_active = models.BooleanField(
        default=True,
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # --------------------------------------------------------
    # Timestamps
    # --------------------------------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

  # Managers
    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        ordering = ["-created_at"]
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name)
        super().save(*args, **kwargs)    

    def __str__(self):
        return self.name

    
class ProductAttributeValue(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="attribute_values",
    )

    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="product_usages",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "product",
                    "attribute_value",
                ],
                name="unique_product_attribute_value",
            ),
        ]

    def __str__(self):
        return (
            f"{self.product.name} - "
            f"{self.attribute_value.value}"
        )    
