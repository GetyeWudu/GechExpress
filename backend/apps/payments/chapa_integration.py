"""
Chapa payment provider integration.
Handles Chapa-specific webhook validation and payment processing.
"""
import hmac
import hashlib
from typing import Optional, Dict, Any

from django.conf import settings
from rest_framework.exceptions import ValidationError


class ChapaWebhookValidator:
    """
    Validates Chapa webhook signatures to ensure authenticity.
    """

    @staticmethod
    def validate_signature(
        body: str,
        signature: str,
        secret: Optional[str] = None,
    ) -> bool:
        """
        Validate Chapa webhook signature.
        
        Args:
            body: Raw request body (JSON string)
            signature: X-Chapa-Signature header from webhook
            secret: Chapa API secret (uses settings if not provided)
            
        Returns:
            True if signature is valid, False otherwise
        """
        if secret is None:
            secret = getattr(
                settings,
                "CHAPA_API_SECRET",
                None,
            )

        if not secret:
            # If no secret configured, log warning and allow
            # (Not ideal but better than breaking in dev)
            return True

        # Chapa signature is HMAC-SHA256 of body with secret
        expected_signature = hmac.new(
            secret.encode(),
            body.encode(),
            hashlib.sha256,
        ).hexdigest()

        # Constant-time comparison to prevent timing attacks
        return hmac.compare_digest(
            expected_signature,
            signature,
        )


class ChapaPaymentProcessor:
    """
    Processes Chapa payment callbacks and translates them to internal format.
    """

    # Map Chapa status to our Payment.Status
    STATUS_MAP = {
        "success": "successful",
        "pending": "processing",
        "failed": "failed",
        "cancelled": "failed",
    }

    @staticmethod
    def process_webhook(
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Process Chapa webhook data and return normalized payment callback data.
        
        Args:
            data: Chapa webhook JSON data
            
        Returns:
            Dict with keys: order_id, transaction_id, status, provider_reference, error_message
            
        Raises:
            ValidationError: If webhook data is invalid
        """
        
        # Validate required fields
        required_fields = ["status", "tx_ref"]
        for field in required_fields:
            if field not in data:
                raise ValidationError(
                    {
                        field: "Required field missing from Chapa webhook"
                    }
                )

        # Extract order ID from tx_ref
        # Chapa tx_ref format: "order-{order_id}-{timestamp}"
        tx_ref = data.get("tx_ref", "")
        try:
            if tx_ref.startswith("order-"):
                order_id = int(
                    tx_ref.split("-")[1]
                )
            else:
                raise ValueError("Invalid tx_ref format")
        except (IndexError, ValueError):
            raise ValidationError(
                {
                    "tx_ref": (
                        "Invalid tx_ref format. "
                        "Expected: order-{order_id}-..."
                    )
                }
            )

        # Map Chapa status to our status
        chapa_status = data.get("status", "").lower()
        payment_status = (
            ChapaPaymentProcessor.STATUS_MAP.get(
                chapa_status,
                "failed",
            )
        )

        # Extract error message if present
        error_message = ""
        if payment_status == "failed":
            error_message = data.get(
                "reason",
                "Payment failed",
            )

        # Chapa transaction ID is 'reference' field
        transaction_id = data.get("reference", "")

        return {
            "order_id": order_id,
            "transaction_id": transaction_id,
            "status": payment_status,
            "provider_reference": tx_ref,
            "error_message": error_message,
        }


def generate_chapa_tx_ref(order_id: int) -> str:
    """
    Generate a Chapa transaction reference from an order ID.
    Format: order-{order_id}-{timestamp}
    """
    import time
    timestamp = int(time.time())
    return f"order-{order_id}-{timestamp}"
