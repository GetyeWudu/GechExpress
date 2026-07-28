from rest_framework import serializers

from apps.carts.models import Cart, CartItem, CartItemAttributeSelection, build_selection_key
from apps.carts.stock import get_available_stock
from apps.products.models.attribute import AttributeValue
from apps.products.models.product import Product


class CartProductSummarySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "sku",
            "price",
            "currency",
            "shop_name",
            "is_active",
            "image_url",
        ]

    def get_image_url(self, obj):
        # Get primary image or first image
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if not image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url


class CartItemAttributeSelectionSerializer(serializers.ModelSerializer):
    attribute = serializers.CharField(
        source="attribute_value.attribute.name",
        read_only=True,
    )
    value = serializers.CharField(
        source="attribute_value.value",
        read_only=True,
    )

    class Meta:
        model = CartItemAttributeSelection
        fields = ["id", "attribute_value", "attribute", "value"]


class CartItemReadSerializer(serializers.ModelSerializer):
    product = CartProductSummarySerializer(read_only=True)
    attribute_selections = CartItemAttributeSelectionSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "quantity",
            "selection_key",
            "attribute_selections",
            "created_at",
            "updated_at",
        ]


class CartReadSerializer(serializers.ModelSerializer):
    items = CartItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "created_at", "updated_at"]


def resolve_cart_variant(product, attribute_value_ids):
    """
    Resolve an active, in-stock variant for the cart selection.

    - Products with selectable attributes require a matching in-stock variant.
    - Products without selectable attributes use the default/single available SKU.
    """
    selectable = product.get_available_attributes()
    value_ids = list(attribute_value_ids or [])

    if selectable and not value_ids:
        raise serializers.ValidationError(
            {
                "attribute_value_ids": (
                    "Please select options for this product "
                    f"({', '.join(group['name'] for group in selectable)})."
                )
            }
        )

    if value_ids:
        values = AttributeValue.objects.filter(
            id__in=value_ids,
            is_active=True,
        ).select_related("attribute")

        if values.count() != len(set(value_ids)):
            raise serializers.ValidationError(
                {"attribute_value_ids": "One or more attribute values are invalid."}
            )

        attribute_ids = set()
        for value in values:
            if value.attribute_id in attribute_ids:
                raise serializers.ValidationError(
                    {
                        "attribute_value_ids": (
                            "Only one value per attribute can be selected."
                        )
                    }
                )
            attribute_ids.add(value.attribute_id)

        required_names = {group["name"] for group in selectable}
        selected_names = {value.attribute.name for value in values}
        if selectable and selected_names != required_names:
            raise serializers.ValidationError(
                {
                    "attribute_value_ids": (
                        "Please select a value for each available attribute."
                    )
                }
            )

    variant = product.find_variant_by_attribute_values(value_ids)
    if variant is None:
        raise serializers.ValidationError(
            {
                "attribute_value_ids": (
                    "No in-stock variant matches the selected options."
                )
            }
        )
    return variant


class CartItemCreateSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True)
    )
    quantity = serializers.IntegerField(min_value=1)
    attribute_value_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list,
    )

    def validate(self, attrs):
        cart = self.context["cart"]
        product = attrs["product"]
        requested_quantity = attrs["quantity"]
        attribute_value_ids = attrs.get("attribute_value_ids", [])

        if not product.is_active:
            raise serializers.ValidationError(
                {"product": "Inactive products cannot be added to cart."}
            )

        variant = resolve_cart_variant(product, attribute_value_ids)
        selection_key = build_selection_key(attribute_value_ids)

        existing_item = CartItem.objects.filter(
            cart=cart,
            product=product,
            selection_key=selection_key,
        ).first()

        target_quantity = requested_quantity
        if existing_item:
            target_quantity += existing_item.quantity

        available_stock = get_available_stock(product_variant=variant)
        if available_stock is not None and target_quantity > available_stock:
            raise serializers.ValidationError(
                {"quantity": "Requested quantity exceeds available stock."}
            )

        attrs["selection_key"] = selection_key
        attrs["variant"] = variant
        return attrs

    def create(self, validated_data):
        cart = self.context["cart"]
        product = validated_data["product"]
        quantity = validated_data["quantity"]
        attribute_value_ids = validated_data.get("attribute_value_ids", [])
        selection_key = validated_data["selection_key"]

        cart_item = CartItem.objects.filter(
            cart=cart,
            product=product,
            selection_key=selection_key,
        ).first()

        if cart_item:
            cart_item.quantity += quantity
            cart_item.save(update_fields=["quantity", "updated_at"])
            return cart_item

        cart_item = CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=quantity,
            selection_key=selection_key,
        )
        cart_item.set_attribute_values(attribute_value_ids)
        return cart_item


class CartItemUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ["id", "quantity"]
        read_only_fields = ["id"]

    def validate(self, attrs):
        quantity = attrs.get("quantity", self.instance.quantity)
        product = self.instance.product

        if not product or not product.is_active:
            raise serializers.ValidationError(
                {"product": "Inactive products cannot be updated in cart."}
            )

        value_ids = list(
            self.instance.attribute_selections.values_list(
                "attribute_value_id",
                flat=True,
            )
        )
        variant = resolve_cart_variant(product, value_ids)
        available_stock = get_available_stock(product_variant=variant)
        if available_stock is not None and quantity > available_stock:
            raise serializers.ValidationError(
                {"quantity": "Requested quantity exceeds available stock."}
            )

        return attrs
