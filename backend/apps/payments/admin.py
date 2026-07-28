from django.contrib import admin

from apps.payments.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "order",
        "amount",
        "status",
        "provider",
        "transaction_id",
        "created_at",
    ]

    list_filter = [
        "status",
        "provider",
        "created_at",
    ]

    search_fields = [
        "transaction_id",
        "provider_reference",
        "order__order_number",
    ]

    readonly_fields = [
        "order",
        "created_at",
        "updated_at",
    ]

    fieldsets = (
        (
            "Order & Payment",
            {
                "fields": [
                    "order",
                    "amount",
                    "currency",
                ]
            },
        ),
        (
            "Status",
            {
                "fields": [
                    "status",
                    "provider",
                ]
            },
        ),
        (
            "Provider Details",
            {
                "fields": [
                    "transaction_id",
                    "provider_reference",
                    "payment_method",
                ]
            },
        ),
        (
            "Error Information",
            {
                "fields": [
                    "error_message"
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
