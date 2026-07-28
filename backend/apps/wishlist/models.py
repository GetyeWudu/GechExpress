from django.conf import settings
from django.db import models

from apps.products.models.product import Product


class Wishlist(models.Model):
    """
    Customer wishlist (one per user).
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"Wishlist({self.user_id})"


class WishlistItem(models.Model):
    """
    Items in a customer's wishlist.
    """

    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="wishlist_items",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["wishlist", "product"],
                name="unique_wishlist_item_product",
            ),
        ]
        indexes = [
            models.Index(
                fields=["wishlist", "-created_at"]
            ),
        ]

    def __str__(self):
        return (
            f"WishlistItem("
            f"wishlist={self.wishlist_id}, "
            f"product={self.product_id})"
        )
