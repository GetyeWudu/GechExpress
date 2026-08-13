from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from ..products.models.ProductVariant import ProductVariant
from ..products.models.Attribute import AttributeValue
from ..products.models.Product import Product


def build_selection_key(attribute_value_ids):
    return "-".join(str(value_id) for value_id in sorted(attribute_value_ids))


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart({self.user_id})"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    product_variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="cart_items",
    )
    # Legacy compatibility fields kept for existing migrated schema.
    # product_variant remains the authoritative variant identity.
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="cart_items",
        null=True,
        blank=True,
    )
    selection_key = models.CharField(
        max_length=255,
        default="",
        blank=True,
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "product_variant"],
                name="unique_cart_item_variant",
            ),
            models.CheckConstraint(
                condition=models.Q(quantity__gt=0),
                name="cart_item_quantity_gt_0",
            ),
        ]
        indexes = [
            models.Index(fields=["cart", "product_variant"]),
        ]
        verbose_name_plural = "Cart Items"

    def __str__(self):
        return f"CartItem(cart={self.cart_id}, variant={self.product_variant_id})"


class CartItemAttributeSelection(models.Model):
    cart_item = models.ForeignKey(
        CartItem,
        on_delete=models.CASCADE,
        related_name="attribute_selections",
    )
    attribute_value = models.ForeignKey(
        AttributeValue,
        on_delete=models.PROTECT,
        related_name="cart_item_selections",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart_item", "attribute_value"],
                name="unique_cart_item_attribute_value",
            ),
        ]

    def __str__(self):
        return (
            f"CartItemSelection("
            f"item={self.cart_item_id}, "
            f"value={self.attribute_value_id})"
        )
