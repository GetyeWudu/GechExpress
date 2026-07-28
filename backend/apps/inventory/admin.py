from django.contrib import admin
from django.db.models import Count, Sum

from .models import Inventory, Warehouse


class InventoryInline(admin.TabularInline):
    model = Inventory
    extra = 0
    fields = (
        "product",
        "product_variant",
        "quantity",
        "reserved_quantity",
        "available_quantity",
        "created_at",
        "updated_at",
    )
    readonly_fields = (
        "available_quantity",
        "created_at",
        "updated_at",
    )
    autocomplete_fields = ("product", "product_variant")
    show_change_link = True


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "code",
        "city",
        "country",
        "is_active",
        "inventory_count",
        "total_stock",
        "created_at",
        "updated_at",
    )
    search_fields = ("name", "code", "city", "country")
    list_filter = ("is_active", "city", "country", "created_at")
    readonly_fields = ("created_at", "updated_at", "inventory_count", "total_stock")
    date_hierarchy = "created_at"
    inlines = (InventoryInline,)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            _inventory_count=Count("inventories", distinct=True),
            _total_stock=Sum("inventories__quantity"),
        )

    @admin.display(description="Inventory Items")
    def inventory_count(self, obj):
        return obj._inventory_count or 0

    @admin.display(description="Total Stock")
    def total_stock(self, obj):
        return obj._total_stock or 0


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "warehouse",
        "product",
        "product_variant",
        "product_sku",
        "quantity",
        "reserved_quantity",
        "available_quantity",
        "created_at",
        "updated_at",
    )
    list_select_related = ("warehouse", "product", "product_variant")
    search_fields = (
        "warehouse__name",
        "warehouse__code",
        "product__sku",
        "product__name",
        "product_variant__sku",
    )
    list_filter = (
        "warehouse",
        "warehouse__city",
        "warehouse__country",
        "created_at",
    )
    autocomplete_fields = ("warehouse", "product", "product_variant")
    readonly_fields = (
        "available_quantity",
        "created_at",
        "updated_at",
        "product_sku",
        "product_name",
    )

    @admin.display(description="SKU")
    def product_sku(self, obj):
        if obj.product_variant_id:
            return obj.product_variant.sku
        if obj.product_id:
            return obj.product.sku
        return "—"

    @admin.display(description="Product")
    def product_name(self, obj):
        if obj.product_id:
            return obj.product.name
        if obj.product_variant_id:
            return obj.product_variant.product.name
        return "—"
