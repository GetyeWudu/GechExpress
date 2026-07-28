from decimal import Decimal

from django.db import models
from django.utils.text import slugify

from apps.products.utils import generate_unique_slug
from .base import SoftDeleteManager, SoftDeleteModel
from .category import Category
from .tag import Tag


class Product(SoftDeleteModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal("0.00"),
    )
    currency = models.CharField(max_length=3, default="ETB")
    shop_name = models.CharField(max_length=255, blank=True)
    categories = models.ManyToManyField(
        Category,
        related_name="products",
        blank=True,
    )
    tags = models.ManyToManyField(
        Tag,
        related_name="products",
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name)
        super().save(*args, **kwargs)

    def get_available_attributes(self):
        """
        Structured attribute options derived ONLY from active, in-stock variants.

        Returns:
            [
              {"name": "Size", "options": ["S", "M", "L"]},
              {"name": "Color", "options": ["Black", "Navy"]},
            ]

        Empty list means the product has no selectable variation UI
        (single SKU / one-size luxury item).
        """
        from apps.products.models.variant import ProductVariant

        variants = (
            ProductVariant.objects.active_available()
            .filter(product=self)
            .prefetch_related(
                "variant_attribute_values__attribute_value__attribute",
            )
        )

        grouped = {}
        for variant in variants:
            assignments = variant.variant_attribute_values.all()
            if not assignments:
                continue

            for assignment in assignments:
                attribute_name = assignment.attribute_value.attribute.name
                value = assignment.attribute_value.value
                grouped.setdefault(attribute_name, set()).add(value)

        return [
            {
                "name": attribute_name,
                "options": sorted(options),
            }
            for attribute_name, options in sorted(grouped.items())
        ]

    def has_selectable_variants(self):
        return bool(self.get_available_attributes())

    def find_variant_by_attribute_values(self, attribute_value_ids):
        """
        Resolve a concrete variant from a set of selected attribute value IDs.
        For products with no attributes, returns the default/active available variant.
        """
        from apps.products.models.variant import ProductVariant

        value_ids = sorted({int(value_id) for value_id in attribute_value_ids or []})
        variants = ProductVariant.objects.active_available().filter(product=self)

        if not value_ids:
            return (
                variants.filter(is_default=True).first()
                or variants.order_by("id").first()
            )

        for variant in variants.prefetch_related("variant_attribute_values"):
            variant_value_ids = sorted(
                assignment.attribute_value_id
                for assignment in variant.variant_attribute_values.all()
            )
            if variant_value_ids == value_ids:
                return variant

        return None
