from rest_framework import viewsets

from ..models import Category
from ..serializers.category_serializers import (
    CategorySerializer,
)
from apps.accounts.permissions import IsAdmin


class AdminCategoryViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAdmin,
    ]

    queryset = (
        Category.objects
        .all()
        .order_by("name")
    )

    serializer_class = CategorySerializer