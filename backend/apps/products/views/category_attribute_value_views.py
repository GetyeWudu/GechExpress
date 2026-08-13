from rest_framework import viewsets

from apps.accounts.permissions import IsAdmin

from ..models import (
    CategoryAttributeValue,
)

from ..serializers.category_attribute_value_serializers import (
    CategoryAttributeValueSerializer,
)


class AdminCategoryAttributeValueViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAdmin,
    ]

    queryset = (
        CategoryAttributeValue.objects
        .select_related(
            "category_attribute",
            "category_attribute__category",
            "category_attribute__attribute",
            "attribute_value",
            "attribute_value__attribute",
        )
        .all()
        .order_by("id")
    )

    serializer_class = (
        CategoryAttributeValueSerializer
    )