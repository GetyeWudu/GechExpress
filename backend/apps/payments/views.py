from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    BasePermission,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.accounts.permissions import IsStaff
from apps.orders.models import Order
from apps.payments.models import Payment
from apps.payments.permissions import (
    IsPaymentOwner,
    IsPaymentStaffOrOwner,
)
from apps.payments.serializers import (
    PaymentReadSerializer,
    PaymentInitializeSerializer,
    PaymentCallbackSerializer,
)
from apps.payments.services import PaymentService


class PaymentViewSet(GenericViewSet):

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        """
        Customers see only their payments.
        Staff sees all payments.
        """

        if self.request.user.role == self.request.user.Role.STAFF:
            return (
                Payment.objects
                .select_related("order")
                .order_by("-created_at")
            )

        return (
            Payment.objects
            .filter(
                order__user=self.request.user
            )
            .select_related("order")
            .order_by("-created_at")
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):
        """List payments (filtered by user role)."""

        payments = self.get_queryset()

        serializer = PaymentReadSerializer(
            payments,
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
        """Retrieve a specific payment."""

        payment = (
            self.get_queryset()
            .filter(pk=pk)
            .first()
        )

        if not payment:
            return Response(
                {
                    "detail": (
                        "Payment not found."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PaymentReadSerializer(
            payment
        )

        return Response(
            serializer.data
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="initialize",
        permission_classes=[
            IsAuthenticated
        ],
    )
    def initialize(
        self,
        request,
        *args,
        **kwargs
    ):
        """
        Initialize a payment for an order.
        Requires order_id in request body.
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
                id=order_id,
                user=request.user,
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
            PaymentInitializeSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        provider = serializer.validated_data.get(
            "provider",
            Payment.Provider.OTHER,
        )

        payment = (
            PaymentService
            .initialize_payment(
                order=order,
                provider=provider,
            )
        )

        return Response(
            PaymentReadSerializer(
                payment
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="callback",
        permission_classes=[],
    )
    def callback(
        self,
        request,
        *args,
        **kwargs
    ):
        """
        Process payment provider callback.
        This endpoint should be called by payment providers.
        Validates provider signature and processes payment update.
        """

        # For Chapa, validate webhook signature
        provider = request.data.get("provider", "").lower()
        
        if provider == "chapa":
            from apps.payments.chapa_integration import ChapaWebhookValidator
            
            signature = request.META.get(
                "HTTP_X_CHAPA_SIGNATURE",
                "",
            )
            
            if not signature:
                return Response(
                    {
                        "detail": (
                            "Missing Chapa signature"
                        )
                    },
                    status=(
                        status
                        .HTTP_401_UNAUTHORIZED
                    ),
                )

            # Validate signature
            is_valid = (
                ChapaWebhookValidator
                .validate_signature(
                    body=request.body.decode(),
                    signature=signature,
                )
            )
            
            if not is_valid:
                return Response(
                    {
                        "detail": (
                            "Invalid signature"
                        )
                    },
                    status=(
                        status
                        .HTTP_401_UNAUTHORIZED
                    ),
                )

            # Process Chapa-specific payload
            from apps.payments.chapa_integration import (
                ChapaPaymentProcessor,
            )
            
            try:
                callback_data = (
                    ChapaPaymentProcessor
                    .process_webhook(
                        request.data
                    )
                )
            except ValidationError as e:
                return Response(
                    e.detail,
                    status=(
                        status
                        .HTTP_400_BAD_REQUEST
                    ),
                )

            order_id = callback_data["order_id"]
            transaction_id = (
                callback_data["transaction_id"]
            )
            payment_status = (
                callback_data["status"]
            )
            provider_reference = (
                callback_data["provider_reference"]
            )
            error_message = (
                callback_data["error_message"]
            )
        else:
            # Generic callback for other providers
            serializer = (
                PaymentCallbackSerializer(
                    data=request.data
                )
            )

            serializer.is_valid(
                raise_exception=True
            )

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

            transaction_id = (
                serializer.validated_data[
                    "transaction_id"
                ]
            )
            payment_status = (
                serializer.validated_data[
                    "status"
                ]
            )
            provider_reference = (
                serializer.validated_data.get(
                    "provider_reference"
                )
            )
            error_message = (
                serializer.validated_data.get(
                    "error_message"
                )
            )

        payment = (
            PaymentService
            .process_callback(
                order_id=order_id,
                transaction_id=(
                    transaction_id
                ),
                status=payment_status,
                provider=provider,
                provider_reference=(
                    provider_reference
                ),
                error_message=(
                    error_message
                ),
            )
        )

        return Response(
            PaymentReadSerializer(
                payment
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="refund",
        permission_classes=[
            IsAuthenticated,
            IsStaff,
        ],
    )
    def refund(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """
        Refund a payment (staff only).
        """

        payment = (
            Payment.objects
            .filter(pk=pk)
            .first()
        )

        if not payment:
            return Response(
                {
                    "detail": (
                        "Payment not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        payment = (
            PaymentService
            .refund_payment(
                payment_id=pk,
            )
        )

        return Response(
            PaymentReadSerializer(
                payment
            ).data,
            status=status.HTTP_200_OK,
        )
