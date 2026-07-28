from django.contrib import admin
from django.db.models import Count, Sum

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    fields = (
        "product",
        "quantity",
        "created_at",
        "updated_at",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )
    autocomplete_fields = ("product",)
    show_change_link = True


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "user_email",
        "item_count",
        "total_quantity",
        "created_at",
        "updated_at",
    )
    list_select_related = ("user",)
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
        "item_count",
        "total_quantity",
    )
    date_hierarchy = "created_at"
    autocomplete_fields = ("user",)
    inlines = (CartItemInline,)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            _item_count=Count("items", distinct=True),
            _total_quantity=Sum("items__quantity"),
        )

    @admin.display(description="Email")
    def user_email(self, obj):
        return obj.user.email

    @admin.display(description="Items")
    def item_count(self, obj):
        return obj._item_count or 0

    @admin.display(description="Total Qty")
    def total_quantity(self, obj):
        return obj._total_quantity or 0


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart",
        "customer",
        "product",
        "sku",
        "product_name",
        "quantity",
        "created_at",
        "updated_at",
    )
    list_select_related = (
        "cart",
        "cart__user",
        "product",
    )
    search_fields = (
        "cart__user__username",
        "cart__user__email",
        "product__sku",
        "product__name",
    )
    list_filter = (
        "created_at",
        "updated_at",
        "product__is_active",
    )
    autocomplete_fields = (
        "cart",
        "product",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
        "sku",
        "product_name",
        "customer",
    )

    @admin.display(description="Customer")
    def customer(self, obj):
        return obj.cart.user.email

    @admin.display(description="SKU")
    def sku(self, obj):
        return obj.product.sku

    @admin.display(description="Product")
    def product_name(self, obj):
        return obj.product.name