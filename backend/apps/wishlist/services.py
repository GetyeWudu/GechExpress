from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.wishlist.models import Wishlist, WishlistItem
from apps.products.models.product import Product


class WishlistService:

    @staticmethod
    def get_or_create_wishlist(user):
        wishlist, _ = Wishlist.objects.get_or_create(user=user)
        return wishlist

    @staticmethod
    @transaction.atomic
    def add_to_wishlist(*, user, product_id):
        wishlist = WishlistService.get_or_create_wishlist(user)

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise ValidationError({"product": "Product not found."})

        existing = WishlistItem.objects.filter(
            wishlist=wishlist,
            product=product,
        ).first()

        if existing:
            raise ValidationError({"wishlist_item": "Item already in wishlist."})

        return WishlistItem.objects.create(
            wishlist=wishlist,
            product=product,
        )

    @staticmethod
    @transaction.atomic
    def remove_from_wishlist(*, user, wishlist_item_id):
        try:
            item = WishlistItem.objects.get(
                id=wishlist_item_id,
                wishlist__user=user,
            )
        except WishlistItem.DoesNotExist:
            raise ValidationError({"wishlist_item": "Wishlist item not found."})

        item.delete()
        return True

    @staticmethod
    @transaction.atomic
    def clear_wishlist(user):
        wishlist = Wishlist.objects.filter(user=user).first()

        if not wishlist:
            raise ValidationError({"wishlist": "Wishlist not found."})

        wishlist.items.all().delete()
        return True
