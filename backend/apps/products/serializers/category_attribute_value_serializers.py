from rest_framework import serializers

from ..models import (
    CategoryAttributeValue,
)


class CategoryAttributeValueSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = CategoryAttributeValue

        fields = [
            "id",
            "category_attribute",
            "attribute_value",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]

    def validate(self, attrs):

        category_attribute = attrs[
            "category_attribute"
        ]

        attribute_value = attrs[
            "attribute_value"
        ]

        if (
            category_attribute.attribute_id
            != attribute_value.attribute_id
        ):
            raise serializers.ValidationError(
                {
                    "attribute_value": (
                        "This attribute value does not "
                        "belong to the selected attribute."
                    )
                }
            )

        return attrs