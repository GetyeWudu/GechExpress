from rest_framework import viewsets

from apps.accounts.permissions import IsAdmin

from ..models import CategoryAttribute
from ..serializers.category_attribute_serializers import (
    CategoryAttributeSerializer,
)


class AdminCategoryAttributeViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAdmin,
    ]

    queryset = (
        CategoryAttribute.objects
        .select_related(
            "category",
            "attribute",
        )
        .all()
        .order_by(
            "category",
            "display_order",
            "id",
        )
    )

    serializer_class = (
        CategoryAttributeSerializer
    )