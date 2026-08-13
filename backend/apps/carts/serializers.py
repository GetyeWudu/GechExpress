# from rest_framework import serializers

# from apps.carts.models import Cart, CartItem, CartItemAttributeSelection, build_selection_key
# from apps.carts.stock import get_available_stock
# from apps.products.models.attribute import AttributeValue
# from apps.products.models.product import Product
# from apps.products.models.variant import ProductVariant


# class ProductVariantSummarySerializer(serializers.ModelSerializer):
#     """Serializes ProductVariant with essential cart/order details."""
#     product_name = serializers.CharField(source="product.name", read_only=True)
#     product_id = serializers.IntegerField(source="product.id", read_only=True)
#     selected_attributes = serializers.SerializerMethodField()
#     image_url = serializers.SerializerMethodField()

#     class Meta:
#         model = ProductVariant
#         fields = [
#             "id",
#             "sku",
#             "price",
#             "currency",
#             "product_id",
#             "product_name",
#             "is_in_stock",
#             "available_quantity",
#             "selected_attributes",
#             "image_url",
#         ]

#     def get_selected_attributes(self, obj):
#         """Returns list of {attribute, value} for this variant."""
#         return [
#             {
#                 "attribute": assignment.attribute_value.attribute.name,
#                 "value": assignment.attribute_value.value,
#             }
#             for assignment in obj.variant_attribute_values.select_related(
#                 "attribute_value__attribute"
#             )
#         ]

#     def get_image_url(self, obj):
#         """Returns variant's primary image or falls back to product primary image."""
#         # For now, return product's primary image
#         # Future: support variant-specific images
#         image = obj.product.images.filter(
#             is_primary=True).first() or obj.product.images.first()
#         if not image:
#             return None

#         request = self.context.get("request")
#         if request:
#             return request.build_absolute_uri(image.image.url)
#         return image.image.url


# class CartItemAttributeSelectionSerializer(serializers.ModelSerializer):
#     attribute = serializers.CharField(
#         source="attribute_value.attribute.name",
#         read_only=True,
#     )
#     value = serializers.CharField(
#         source="attribute_value.value",
#         read_only=True,
#     )

#     class Meta:
#         model = CartItemAttributeSelection
#         fields = ["id", "attribute_value", "attribute", "value"]


# class CartItemReadSerializer(serializers.ModelSerializer):
#     """Reads CartItem with full variant and product details."""
#     product_variant = ProductVariantSummarySerializer(read_only=True)
#     subtotal = serializers.SerializerMethodField()

#     class Meta:
#         model = CartItem
#         fields = [
#             "id",
#             "product_variant",
#             "quantity",
#             "subtotal",
#             "created_at",
#             "updated_at",
#         ]

#     def get_subtotal(self, obj):
#         return obj.product_variant.price * obj.quantity


# class CartReadSerializer(serializers.ModelSerializer):
#     items = CartItemReadSerializer(many=True, read_only=True)

#     class Meta:
#         model = Cart
#         fields = ["id", "items", "created_at", "updated_at"]


# class CartItemCreateSerializer(serializers.Serializer):
#     """Creates CartItem from ProductVariant ID."""
#     product_variant = serializers.PrimaryKeyRelatedField(
#         queryset=ProductVariant.objects.filter(is_active=True),
#         required=True,
#     )
#     quantity = serializers.IntegerField(min_value=1)

#     def validate(self, attrs):
#         cart = self.context.get("cart")
#         if not cart:
#             raise serializers.ValidationError(
#                 {"cart": "Cart not found in context."})

#         product_variant = attrs["product_variant"]
#         quantity = attrs["quantity"]

#         if not product_variant.is_active:
#             raise serializers.ValidationError(
#                 {"product_variant": "This variant is no longer available."}
#             )

#         if not product_variant.product.is_active:
#             raise serializers.ValidationError(
#                 {"product_variant": "This product is no longer available."}
#             )

#         available_stock = get_available_stock(product_variant=product_variant)

#         if available_stock <= 0:
#             raise serializers.ValidationError(
#                 {"product_variant": "This variant is out of stock."}
#             )

#         if available_stock < quantity:
#             raise serializers.ValidationError(
#                 {
#                     "quantity": (
#                         f"Only {available_stock} "
#                         f"unit(s) available in stock."
#                     )
#                 }
#             )

#         attrs["cart"] = cart
#         return attrs

#     def create(self, validated_data):
#         cart = validated_data["cart"]
#         product_variant = validated_data["product_variant"]
#         quantity = validated_data["quantity"]

#         # Get or create cart item for this exact variant
#         cart_item, created = CartItem.objects.get_or_create(
#             cart=cart,
#             product_variant=product_variant,
#             defaults={
#                 "quantity": quantity,
#                 "product": product_variant.product,
#                 "selection_key": build_selection_key(
#                     [
#                         assignment.attribute_value_id
#                         for assignment in product_variant.variant_attribute_values.all()
#                     ]
#                 ),
#             },
#         )

#         if not created:
#             # Item already in cart, increase quantity
#             cart_item.quantity += quantity
#             cart_item.save(update_fields=["quantity", "updated_at"])

#         return cart_item


# class CartItemUpdateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CartItem
#         fields = ["id", "quantity"]
#         read_only_fields = ["id"]

#     def validate(self, attrs):
#         quantity = attrs.get("quantity", self.instance.quantity)
#         product_variant = self.instance.product_variant
#         available_stock = get_available_stock(product_variant=product_variant)

#         if not product_variant.is_active or not product_variant.product.is_active:
#             raise serializers.ValidationError(
#                 {"product_variant": "This item is no longer available."}
#             )

#         if available_stock <= 0:
#             raise serializers.ValidationError(
#                 {"product_variant": "This item is now out of stock."}
#             )

#         if available_stock < quantity:
#             raise serializers.ValidationError(
#                 {
#                     "quantity": (
#                         f"Only {available_stock} "
#                         f"unit(s) available in stock."
#                     )
#                 }
#             )

#         return attrs
