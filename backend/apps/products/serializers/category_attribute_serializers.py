from rest_framework import serializers

from ..models import (
    CategoryAttribute,
)


class CategoryAttributeSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = CategoryAttribute

        fields = [
            "id",
            "category",
            "attribute",
            "scope",
            "is_required",
            "display_order",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]
