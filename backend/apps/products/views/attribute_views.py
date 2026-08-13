from rest_framework import viewsets

from apps.accounts.permissions import IsAdmin
from ..models import AttributeValue
from ..models import Attribute
from ..serializers.attribute_serializers import (
    AttributeSerializer,
    AttributeValueSerializer
)


class AdminAttributeViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAdmin,
    ]

    queryset = (
        Attribute.objects
        .all()
        .order_by("name")
    )

    serializer_class = AttributeSerializer

class AdminAttributeValueViewSet(
    viewsets.ModelViewSet
):

    permission_classes = [
        IsAdmin,
    ]

    queryset = (
        AttributeValue.objects
        .select_related("attribute")
        .all()
        .order_by(
            "attribute__name",
            "value",
        )
    )

    serializer_class = (
        AttributeValueSerializer
    )
