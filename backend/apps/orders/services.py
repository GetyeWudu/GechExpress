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
                "items__product_variant__product",
                "items__product_variant__variant_attribute_values__attribute_value__attribute",
            )
            .filter(user=user)
            .first()
        )

        if not cart:
            raise ValidationError({"cart": "Cart does not exist."})

        cart_items = list(cart.items.all())

        if not cart_items:
            raise ValidationError({"cart": "Cannot checkout an empty cart."})

        # Validate that all products and variants are active
        for cart_item in cart_items:
            product_variant = cart_item.product_variant
            product = product_variant.product

            if not product.is_active:
                raise ValidationError(
                    {"product": f"{product.name} is inactive."}
                )
            
            if not product_variant.is_active:
                raise ValidationError(
                    {"product_variant": f"{product_variant.sku} is inactive."}
                )

        # Calculate subtotal using variant prices (the actual price paid per item)
        subtotal = Decimal("0.00")

        for cart_item in cart_items:
            subtotal += cart_item.product_variant.price * cart_item.quantity

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
            product_variant = cart_item.product_variant
            product = product_variant.product

            # Reserve inventory for this specific variant
            Inventory.reserve_for_variant(
                product_variant=product_variant,
                quantity=cart_item.quantity,
            )

            # Build selected_options from variant attribute assignments
            selected_options = {
                assignment.attribute_value.attribute.name: assignment.attribute_value.value
                for assignment in product_variant.variant_attribute_values.select_related(
                    "attribute_value__attribute"
                )
            }

            OrderItem.objects.create(
                order=order,
                product=product,  # Keep for backward compatibility
                product_variant=product_variant,  # New primary reference
                product_name=product.name,
                sku=product_variant.sku,  # SKU from variant
                unit_price=product_variant.price,  # Price from variant
                quantity=cart_item.quantity,
                subtotal=product_variant.price * cart_item.quantity,
                selected_options=selected_options,
            )

        cart.items.all().delete()

        return order

    @staticmethod
    def generate_order_number():
        return f"ORD-{uuid.uuid4().hex[:12].upper()}"
