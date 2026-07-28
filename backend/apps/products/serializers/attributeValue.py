from rest_framework import serializers
from apps.products.models import Attribute, AttributeValue


class AttributeValueSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(
        source="attribute.name",
        read_only=True,
    )

    class Meta:
        model = AttributeValue
        fields = ["id", "attribute", "attribute_name", "value", "slug", "is_active"]
        read_only_fields = ["id"]


class AttributeSerializer(serializers.ModelSerializer):
    values = AttributeValueSerializer(
        source="attribute_values",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Attribute
        fields = ["id", "name", "slug", "is_active", "values"]
        read_only_fields = ["id"]


class ProductAttributeValueReadSerializer(serializers.Serializer):
    attribute = serializers.CharField()
    value = serializers.CharField()
    attribute_value_id = serializers.IntegerField()
