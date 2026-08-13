from django.apps import apps as django_apps
from django.db.models import F, IntegerField, Sum


def get_available_stock(product=None, product_variant=None):
    try:
        inventory_model = django_apps.get_model("inventory", "Inventory")
    except LookupError:
        return None

    if product_variant is not None:
        queryset = inventory_model.objects.filter(
            product_variant=product_variant,
            is_deleted=False,
            warehouse__is_active=True,
            warehouse__is_deleted=False,
        )
    elif product is not None:
        variant_model = django_apps.get_model("products", "ProductVariant")
        variant = (
            variant_model.objects.active_available()
            .filter(product=product, is_default=True)
            .first()
            or variant_model.objects.active_available()
            .filter(product=product)
            .order_by("id")
            .first()
        )
        if variant is not None:
            return get_available_stock(product_variant=variant)

        queryset = inventory_model.objects.filter(
            product=product,
            product_variant__isnull=True,
            is_deleted=False,
            warehouse__is_active=True,
            warehouse__is_deleted=False,
        )
    else:
        return 0

    if not queryset.exists():
        return 0

    aggregated = queryset.aggregate(
        total=Sum(
            F("quantity") - F("reserved_quantity"),
            output_field=IntegerField(),
        )
    )
    return aggregated["total"] or 0
