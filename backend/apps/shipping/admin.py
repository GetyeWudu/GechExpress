from django.contrib import admin

from apps.shipping.models import (
    ShippingMethod,
    Shipment,
    ShipmentItem,
)


@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "name",
        "code",
        "base_cost",
        "estimated_days_min",
        "estimated_days_max",
        "is_active",
    ]

    list_filter = [
        "is_active",
        "created_at",
    ]

    search_fields = [
        "name",
        "code",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "order",
        "status",
        "shipping_method",
        "tracking_number",
        "shipped_at",
        "delivered_at",
    ]

    list_filter = [
        "status",
        "shipping_method",
        "created_at",
        "shipped_at",
        "delivered_at",
    ]

    search_fields = [
        "order__order_number",
        "tracking_number",
        "recipient_full_name",
    ]

    readonly_fields = [
        "order",
        "created_at",
        "updated_at",
    ]

    fieldsets = (
        (
            "Order & Shipping",
            {
                "fields": [
                    "order",
                    "shipping_method",
                    "status",
                ]
            },
        ),
        (
            "Recipient Information",
            {
                "fields": [
                    "recipient_full_name",
                    "recipient_phone",
                    "recipient_address",
                    "recipient_city",
                    "recipient_country",
                ]
            },
        ),
        (
            "Tracking & Carrier",
            {
                "fields": [
                    "tracking_number",
                    "carrier_url",
                    "carrier_reference",
                ]
            },
        ),
        (
            "Status Timestamps",
            {
                "fields": [
                    "shipped_at",
                    "delivered_at",
                ]
            },
        ),
        (
            "Notes",
            {
                "fields": [
                    "notes"
                ],
                "classes": ["collapse"],
            },
        ),
        (
            "Timestamps",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    )


@admin.register(ShipmentItem)
class ShipmentItemAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "shipment",
        "product",
        "quantity",
    ]

    list_filter = [
        "created_at",
    ]

    search_fields = [
        "product__sku",
        "shipment__order__order_number",
    ]

    readonly_fields = [
        "shipment",
        "product",
        "created_at",
    ]
