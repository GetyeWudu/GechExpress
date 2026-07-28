from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

from apps.products.models.product import Product
from apps.products.models.attribute import AttributeValue


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
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="cart_items",
        null=True,
        blank=True,
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
    )
    selection_key = models.CharField(
        max_length=255,
        blank=True,
        default="",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["cart", "product", "selection_key"],
                name="unique_cart_item_product_selection",
            ),
            models.CheckConstraint(
                condition=models.Q(quantity__gt=0),
                name="cart_item_quantity_gt_0",
            ),
        ]
        indexes = [
            models.Index(fields=["cart", "product"]),
        ]

    def __str__(self):
        return f"CartItem(cart={self.cart_id}, product={self.product_id})"

    def set_attribute_values(self, attribute_value_ids):
        self.attribute_selections.all().delete()
        for value_id in attribute_value_ids:
            CartItemAttributeSelection.objects.create(
                cart_item=self,
                attribute_value_id=value_id,
            )
        self.selection_key = build_selection_key(attribute_value_ids)
        self.save(update_fields=["selection_key", "updated_at"])


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
