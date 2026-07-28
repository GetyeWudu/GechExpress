from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from apps.accounts.permissions import IsStaff
from apps.orders.models import Order
from apps.shipping.models import (
    ShippingMethod,
    Shipment,
)
from apps.shipping.permissions import (
    IsShippingStaff,
    IsOrderOwner,
    IsShippingStaffOrOrderOwner,
)
from apps.shipping.serializers import (
    ShippingMethodSerializer,
    ShipmentReadSerializer,
    ShipmentCreateSerializer,
    ShipmentUpdateStatusSerializer,
)
from apps.shipping.services import ShippingService


class ShippingMethodViewSet(GenericViewSet):
    """
    Publicly accessible shipping methods.
    """

    queryset = ShippingMethod.objects.filter(
        is_active=True
    )

    serializer_class = ShippingMethodSerializer
    permission_classes = []

    def list(
        self,
        request,
        *args,
        **kwargs
    ):
        """List available shipping methods."""

        methods = self.get_queryset()

        serializer = self.serializer_class(
            methods,
            many=True
        )

        return Response(
            serializer.data
        )

    def retrieve(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Retrieve a specific shipping method."""

        method = (
            self.get_queryset()
            .filter(pk=pk)
            .first()
        )

        if not method:
            return Response(
                {
                    "detail": (
                        "Shipping method not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.serializer_class(
            method
        )

        return Response(
            serializer.data
        )


class ShipmentViewSet(GenericViewSet):
    """
    Manage shipments for orders.
    Customers can view their own.
    Staff can create/manage.
    """

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        """
        Customers see only their shipments.
        Staff sees all.
        """

        if (
            self.request.user.role
            == self.request.user.Role.STAFF
        ):
            return (
                Shipment.objects
                .select_related(
                    "order",
                    "shipping_method",
                )
                .prefetch_related("items")
                .order_by("-created_at")
            )

        return (
            Shipment.objects
            .filter(
                order__user=self.request.user
            )
            .select_related(
                "order",
                "shipping_method",
            )
            .prefetch_related("items")
            .order_by("-created_at")
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):
        """List shipments."""

        shipments = self.get_queryset()

        serializer = ShipmentReadSerializer(
            shipments,
            many=True
        )

        return Response(
            serializer.data
        )

    def retrieve(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Retrieve a specific shipment."""

        shipment = (
            self.get_queryset()
            .filter(pk=pk)
            .first()
        )

        if not shipment:
            return Response(
                {
                    "detail": (
                        "Shipment not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check permissions
        if (
            request.user.role
            != request.user.Role.STAFF
            and shipment.order.user != request.user
        ):
            return Response(
                {
                    "detail": (
                        "Permission denied."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                ),
            )

        serializer = ShipmentReadSerializer(
            shipment
        )

        return Response(
            serializer.data
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[
            IsAuthenticated,
            IsStaff,
        ],
    )
    def create_shipment(
        self,
        request,
        *args,
        **kwargs
    ):
        """
        Create a shipment for an order (staff only).
        """

        order_id = request.data.get(
            "order_id"
        )

        if not order_id:
            return Response(
                {
                    "order_id": (
                        "This field is required."
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        try:
            order = Order.objects.get(
                id=order_id
            )
        except Order.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Order not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        serializer = (
            ShipmentCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        shipment = (
            ShippingService
            .create_shipment(
                order=order,
                shipping_method_id=(
                    serializer.validated_data[
                        "shipping_method"
                    ].id
                ),
                recipient_full_name=(
                    serializer.validated_data[
                        "recipient_full_name"
                    ]
                ),
                recipient_phone=(
                    serializer.validated_data[
                        "recipient_phone"
                    ]
                ),
                recipient_address=(
                    serializer.validated_data[
                        "recipient_address"
                    ]
                ),
                recipient_city=(
                    serializer.validated_data[
                        "recipient_city"
                    ]
                ),
                recipient_country=(
                    serializer.validated_data[
                        "recipient_country"
                    ]
                ),
                tracking_number=(
                    serializer.validated_data.get(
                        "tracking_number"
                    )
                ),
                carrier_url=(
                    serializer.validated_data.get(
                        "carrier_url"
                    )
                ),
                carrier_reference=(
                    serializer.validated_data.get(
                        "carrier_reference"
                    )
                ),
                notes=(
                    serializer.validated_data.get(
                        "notes"
                    )
                ),
                items_data=(
                    serializer.validated_data.get(
                        "items"
                    )
                ),
            )
        )

        return Response(
            ShipmentReadSerializer(
                shipment
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="update-status",
        permission_classes=[
            IsAuthenticated,
            IsStaff,
        ],
    )
    def update_status(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Update shipment status (staff only)."""

        shipment = (
            Shipment.objects
            .filter(pk=pk)
            .first()
        )

        if not shipment:
            return Response(
                {
                    "detail": (
                        "Shipment not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        serializer = (
            ShipmentUpdateStatusSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        shipment = (
            ShippingService
            .update_shipment_status(
                shipment_id=pk,
                status=(
                    serializer.validated_data[
                        "status"
                    ]
                ),
                tracking_number=(
                    serializer.validated_data.get(
                        "tracking_number"
                    )
                ),
                carrier_url=(
                    serializer.validated_data.get(
                        "carrier_url"
                    )
                ),
                notes=(
                    serializer.validated_data.get(
                        "notes"
                    )
                ),
            )
        )

        return Response(
            ShipmentReadSerializer(
                shipment
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="cancel",
        permission_classes=[
            IsAuthenticated,
            IsStaff,
        ],
    )
    def cancel_shipment(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Cancel a shipment (staff only)."""

        shipment = (
            Shipment.objects
            .filter(pk=pk)
            .first()
        )

        if not shipment:
            return Response(
                {
                    "detail": (
                        "Shipment not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        shipment = (
            ShippingService
            .cancel_shipment(
                shipment_id=pk,
            )
        )

        return Response(
            ShipmentReadSerializer(
                shipment
            ).data,
            status=status.HTTP_200_OK,
        )
