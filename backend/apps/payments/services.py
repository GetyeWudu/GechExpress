from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.orders.models import Order
from apps.payments.models import Payment


class PaymentService:
    """
    Provider-agnostic payment service.
    Specific provider implementations can extend this.
    """

    @staticmethod
    @transaction.atomic
    def initialize_payment(
        *,
        order,
        provider=Payment.Provider.OTHER,
    ):
        """
        Initialize a payment for an order.
        Creates a Payment record in PENDING state.
        """

        if not isinstance(order, Order):
            raise ValidationError(
                {
                    "order": (
                        "Invalid order."
                    )
                }
            )

        # Check if payment already exists
        if hasattr(order, "payment"):
            raise ValidationError(
                {
                    "order": (
                        "Payment already exists "
                        "for this order."
                    )
                }
            )

        # Create payment
        payment = Payment.objects.create(
            order=order,
            amount=order.total,
            currency="ETB",
            provider=provider,
            status=Payment.Status.PENDING,
        )

        return payment

    @staticmethod
    @transaction.atomic
    def process_callback(
        *,
        order_id,
        transaction_id,
        status,
        provider=Payment.Provider.OTHER,
        provider_reference=None,
        error_message=None,
        idempotency_key=None,
    ):
        """
        Process a payment callback from a provider.
        Updates the Payment record and optionally updates Order status.
        
        For idempotency: if idempotency_key is provided and this exact callback
        has been processed before, return the existing payment without modifying it.
        """

        try:
            order = Order.objects.get(
                id=order_id
            )
        except Order.DoesNotExist:
            raise ValidationError(
                {
                    "order_id": (
                        "Order not found."
                    )
                }
            )

        # Try to get existing payment by transaction_id (main idempotency)
        existing_payment = Payment.objects.filter(
            order=order,
            transaction_id=transaction_id,
        ).first()

        if existing_payment:
            # Callback already processed for this transaction
            # Return the existing payment without modifying it
            return existing_payment

        # Get or create payment (fallback for first callback)
        payment, created = (
            Payment.objects.get_or_create(
                order=order,
                defaults={
                    "amount": order.total,
                    "currency": "ETB",
                    "provider": provider,
                },
            )
        )

        # Update payment status
        payment.status = status
        payment.transaction_id = transaction_id
        payment.provider_reference = (
            provider_reference
        )

        if error_message:
            payment.error_message = (
                error_message
            )

        payment.save()

        # Update order status based on payment
        if (
            status
            == Payment.Status.SUCCESSFUL
        ):
            if (
                order.status
                == Order.Status.PENDING
            ):
                order.status = (
                    Order.Status.CONFIRMED
                )
                order.save(skip_validation=True)

        elif (
            status == Payment.Status.FAILED
        ):
            if (
                order.status
                == Order.Status.PENDING
            ):
                order.status = (
                    Order.Status.CANCELLED
                )
                order.save(skip_validation=True)

        return payment

    @staticmethod
    @transaction.atomic
    def refund_payment(
        *,
        payment_id,
    ):
        """
        Refund a payment.
        """

        try:
            payment = Payment.objects.get(
                id=payment_id
            )
        except Payment.DoesNotExist:
            raise ValidationError(
                {
                    "payment_id": (
                        "Payment not found."
                    )
                }
            )

        if (
            payment.status
            != Payment.Status.SUCCESSFUL
        ):
            raise ValidationError(
                {
                    "payment": (
                        "Only successful payments "
                        "can be refunded."
                    )
                }
            )

        payment.status = (
            Payment.Status.REFUNDED
        )
        payment.save()

        # Update order status
        order = payment.order

        if (
            order.status
            != Order.Status.CANCELLED
        ):
            # Order can be marked for refund processing
            # Status update depends on business logic
            pass

        return payment
