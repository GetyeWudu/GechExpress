from django.contrib import admin

from apps.wishlist.models import (
    Wishlist,
    WishlistItem,
)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "user",
        "created_at",
        "updated_at",
    ]

    list_filter = [
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "user__email",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "wishlist",
        "product",
        "created_at",
    ]

    list_filter = [
        "created_at",
    ]

    search_fields = [
        "product__sku",
        "wishlist__user__email",
    ]

    readonly_fields = [
        "created_at",
    ]
