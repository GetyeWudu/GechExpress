from rest_framework import serializers

from apps.orders.models import Order, OrderItem


class CheckoutSerializer(serializers.Serializer):

    shipping_full_name = serializers.CharField(
        max_length=255
    )

    shipping_phone = serializers.CharField(
        max_length=30
    )

    shipping_address = serializers.CharField()

    shipping_city = serializers.CharField(
        max_length=100
    )

    shipping_country = serializers.CharField(
        max_length=100
    )

    shipping_cost = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0,
        default=0,
    )


class OrderItemReadSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "sku",
            "unit_price",
            "quantity",
            "subtotal",
            "selected_options",
            "created_at",
        ]


class OrderReadSerializer(
    serializers.ModelSerializer
):

    items = OrderItemReadSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "status",
            "subtotal",
            "shipping_cost",
            "total",
            "shipping_full_name",
            "shipping_phone",
            "shipping_address",
            "shipping_city",
            "shipping_country",
            "items",
            "created_at",
            "updated_at",
        ]