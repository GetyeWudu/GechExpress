from rest_framework import serializers
from ..models import AttributeValue
from ..models import Attribute


class AttributeSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = Attribute

        fields = [
            "id",
            "name",
            "slug",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "slug",
        ]

class AttributeValueSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = AttributeValue

        fields = [
            "id",
            "attribute",
            "value",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]        