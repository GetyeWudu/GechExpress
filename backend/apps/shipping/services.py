from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.orders.models import Order
from apps.shipping.models import (
    Shipment,
    ShipmentItem,
    ShippingMethod,
)
from apps.products.models.product import Product


class ShippingService:
    """
    Service for managing shipments and shipping workflows.
    """

    @staticmethod
    @transaction.atomic
    def create_shipment(
        *,
        order,
        shipping_method_id,
        recipient_full_name,
        recipient_phone,
        recipient_address,
        recipient_city,
        recipient_country,
        tracking_number=None,
        carrier_url=None,
        carrier_reference=None,
        notes=None,
        items_data=None,
    ):
        """
        Create a shipment for an order.
        """

        if not isinstance(order, Order):
            raise ValidationError(
                {
                    "order": (
                        "Invalid order."
                    )
                }
            )

        # Get shipping method
        try:
            shipping_method = (
                ShippingMethod.objects.get(
                    id=shipping_method_id,
                    is_active=True,
                )
            )
        except ShippingMethod.DoesNotExist:
            raise ValidationError(
                {
                    "shipping_method": (
                        "Shipping method not found "
                        "or inactive."
                    )
                }
            )

        # Check if shipment already exists
        if hasattr(order, "shipment"):
            raise ValidationError(
                {
                    "order": (
                        "Shipment already exists "
                        "for this order."
                    )
                }
            )

        # Create shipment
        shipment = Shipment.objects.create(
            order=order,
            shipping_method=shipping_method,
            recipient_full_name=(
                recipient_full_name
            ),
            recipient_phone=(
                recipient_phone
            ),
            recipient_address=(
                recipient_address
            ),
            recipient_city=(
                recipient_city
            ),
            recipient_country=(
                recipient_country
            ),
            tracking_number=(
                tracking_number or ""
            ),
            carrier_url=(
                carrier_url or ""
            ),
            carrier_reference=(
                carrier_reference or ""
            ),
            notes=(
                notes or ""
            ),
        )

        # Add items if provided
        if items_data:
            for item_data in items_data:
                try:
                    product = Product.objects.get(
                        id=item_data.get("product_id")
                    )
                except Product.DoesNotExist:
                    raise ValidationError({"items": "Invalid product."})

                quantity = item_data.get(
                    "quantity",
                    1,
                )

                if quantity <= 0:
                    raise ValidationError(
                        {
                            "items": (
                                "Quantity must be > 0."
                            )
                        }
                    )

                ShipmentItem.objects.create(
                    shipment=shipment,
                    product=product,
                    quantity=quantity,
                )

        return shipment

    @staticmethod
    @transaction.atomic
    def update_shipment_status(
        *,
        shipment_id,
        status,
        tracking_number=None,
        carrier_url=None,
        notes=None,
    ):
        """
        Update shipment status and related fields.
        """

        try:
            shipment = (
                Shipment.objects.get(
                    id=shipment_id
                )
            )
        except Shipment.DoesNotExist:
            raise ValidationError(
                {
                    "shipment": (
                        "Shipment not found."
                    )
                }
            )

        old_status = shipment.status

        shipment.status = status

        if tracking_number is not None:
            shipment.tracking_number = (
                tracking_number
            )

        if carrier_url is not None:
            shipment.carrier_url = (
                carrier_url
            )

        if notes is not None:
            shipment.notes = notes

        # Update timestamps based on status
        if (
            status == Shipment.Status.SHIPPED
            and old_status
            != Shipment.Status.SHIPPED
        ):
            shipment.shipped_at = (
                timezone.now()
            )

        if (
            status == Shipment.Status.DELIVERED
            and old_status
            != Shipment.Status.DELIVERED
        ):
            shipment.delivered_at = (
                timezone.now()
            )

        shipment.save()

        # Update order status based on shipment
        order = shipment.order

        if (
            status == Shipment.Status.SHIPPED
        ):
            if (
                order.status
                == Order.Status.PROCESSING
            ):
                order.status = (
                    Order.Status.SHIPPED
                )
                order.save(skip_validation=True)

        elif (
            status
            == Shipment.Status.DELIVERED
        ):
            if (
                order.status
                == Order.Status.SHIPPED
            ):
                order.status = (
                    Order.Status.DELIVERED
                )
                order.save(skip_validation=True)

        return shipment

    @staticmethod
    @transaction.atomic
    def cancel_shipment(
        *,
        shipment_id,
    ):
        """
        Cancel a shipment.
        """

        try:
            shipment = (
                Shipment.objects.get(
                    id=shipment_id
                )
            )
        except Shipment.DoesNotExist:
            raise ValidationError(
                {
                    "shipment": (
                        "Shipment not found."
                    )
                }
            )

        if (
            shipment.status
            == Shipment.Status.DELIVERED
        ):
            raise ValidationError(
                {
                    "shipment": (
                        "Cannot cancel "
                        "delivered shipment."
                    )
                }
            )

        shipment.status = (
            Shipment.Status.FAILED
        )
        shipment.save()

        # Update order status
        order = shipment.order

        if (
            order.status
            in [
                Order.Status.PROCESSING,
                Order.Status.SHIPPED,
            ]
        ):
            order.status = (
                Order.Status.PENDING
            )
            order.save(skip_validation=True)

        return shipment
