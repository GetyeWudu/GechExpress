from rest_framework import serializers

from apps.shipping.models import ShippingMethod, Shipment, ShipmentItem


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = [
            "id",
            "name",
            "code",
            "description",
            "base_cost",
            "estimated_days_min",
            "estimated_days_max",
            "is_active",
        ]


class ShipmentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentItem
        fields = ["id", "product", "quantity", "created_at"]


class ShipmentReadSerializer(serializers.ModelSerializer):
    items = ShipmentItemSerializer(many=True, read_only=True)
    shipping_method_name = serializers.CharField(
        source="shipping_method.name",
        read_only=True,
    )

    class Meta:
        model = Shipment
        fields = [
            "id",
            "order",
            "shipping_method",
            "shipping_method_name",
            "status",
            "recipient_full_name",
            "recipient_phone",
            "recipient_address",
            "recipient_city",
            "recipient_country",
            "tracking_number",
            "carrier_url",
            "shipped_at",
            "delivered_at",
            "carrier_reference",
            "notes",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["order", "shipped_at", "delivered_at"]


class ShipmentCreateSerializer(serializers.Serializer):
    shipping_method = serializers.PrimaryKeyRelatedField(
        queryset=ShippingMethod.objects.filter(is_active=True),
    )
    recipient_full_name = serializers.CharField(max_length=255)
    recipient_phone = serializers.CharField(max_length=30)
    recipient_address = serializers.CharField()
    recipient_city = serializers.CharField(max_length=100)
    recipient_country = serializers.CharField(max_length=100)
    tracking_number = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )
    carrier_url = serializers.URLField(required=False, allow_blank=True)
    carrier_reference = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )
    notes = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(child=serializers.DictField(), required=False)


class ShipmentUpdateStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Shipment.Status.choices)
    tracking_number = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
    )
    carrier_url = serializers.URLField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
