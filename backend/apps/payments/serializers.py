from rest_framework import serializers

from apps.payments.models import Payment


class PaymentReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Payment
        fields = [
            "id",
            "order",
            "amount",
            "currency",
            "status",
            "provider",
            "transaction_id",
            "provider_reference",
            "payment_method",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "transaction_id",
            "provider_reference",
            "payment_method",
        ]


class PaymentInitializeSerializer(
    serializers.Serializer
):
    """
    Used to initialize a payment.
    Provider-specific parameters can be added here.
    """

    provider = serializers.ChoiceField(
        choices=Payment.Provider.choices,
    )

    # Additional provider-specific fields can be added here
    # e.g., payment_method for Stripe, email for PayPal, etc.


class PaymentCallbackSerializer(
    serializers.Serializer
):
    """
    Used to process payment provider callbacks/webhooks.
    Structure depends on provider.
    """

    provider = serializers.ChoiceField(
        choices=Payment.Provider.choices,
    )

    transaction_id = serializers.CharField(
        max_length=255,
    )

    status = serializers.ChoiceField(
        choices=Payment.Status.choices,
    )

    # Optional provider reference
    provider_reference = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
    )

    # Optional error message
    error_message = serializers.CharField(
        required=False,
        allow_blank=True,
    )
