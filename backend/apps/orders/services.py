from decimal import Decimal
import uuid

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.carts.models import Cart
from apps.inventory.models import Inventory
from apps.orders.models import Order, OrderItem


class CheckoutService:

    @staticmethod
    @transaction.atomic
    def checkout(
        *,
        user,
        shipping_full_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_country,
        shipping_cost=Decimal("0.00"),
    ):

        cart = (
            Cart.objects
            .prefetch_related(
                "items__product",
                "items__attribute_selections__attribute_value__attribute",
            )
            .filter(user=user)
            .first()
        )

        if not cart:
            raise ValidationError({"cart": "Cart does not exist."})

        cart_items = list(cart.items.all())

        if not cart_items:
            raise ValidationError({"cart": "Cannot checkout an empty cart."})

        for cart_item in cart_items:
            product = cart_item.product

            if not product.is_active:
                raise ValidationError(
                    {"product": f"{product.name} is inactive."}
                )

        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            subtotal += cart_item.product.price * cart_item.quantity

        total = subtotal + shipping_cost

        order = Order.objects.create(
            user=user,
            order_number=CheckoutService.generate_order_number(),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            shipping_full_name=shipping_full_name,
            shipping_phone=shipping_phone,
            shipping_address=shipping_address,
            shipping_city=shipping_city,
            shipping_country=shipping_country,
        )

        for cart_item in cart_items:
            product = cart_item.product

            Inventory.reserve_for_product(
                product=product,
                quantity=cart_item.quantity,
            )

            selected_options = {
                selection.attribute_value.attribute.name: selection.attribute_value.value
                for selection in cart_item.attribute_selections.select_related(
                    "attribute_value__attribute"
                )
            }

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                sku=product.sku,
                unit_price=product.price,
                quantity=cart_item.quantity,
                subtotal=product.price * cart_item.quantity,
                selected_options=selected_options,
            )

        cart.items.all().delete()

        return order

    @staticmethod
    def generate_order_number():
        return f"ORD-{uuid.uuid4().hex[:12].upper()}"
