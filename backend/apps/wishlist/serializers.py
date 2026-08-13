from rest_framework import serializers
from django.db.models import Min

from apps.wishlist.models import Wishlist, WishlistItem
from apps.products.models.product import Product
from apps.products.models.variant import ProductVariant


class WishlistItemBasicSerializer(serializers.ModelSerializer):
    """Basic wishlist item serializer used in add/remove endpoints."""
    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )
    sku = serializers.SerializerMethodField()
    price = serializers.DecimalField(
        source="product.price", max_digits=12, decimal_places=2, read_only=True)
    currency = serializers.CharField(source="product.currency", read_only=True)
    image_url = serializers.SerializerMethodField()
    product_variant = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "product_name",
            "sku",
            "price",
            "currency",
            "image_url",
            "product_variant",
            "created_at",
        ]

    def get_product_variant(self, obj):
        variant = (
            obj.product.variants.filter(
                is_active=True, is_default=True).first()
            or obj.product.variants.filter(is_active=True).order_by("id").first()
        )
        return variant.id if variant else None

    def get_sku(self, obj):
        variant = (
            obj.product.variants.filter(
                is_active=True, is_default=True).first()
            or obj.product.variants.filter(is_active=True).order_by("id").first()
        )
        return variant.sku if variant else ""

    def get_image_url(self, obj):
        image = obj.product.images.filter(
            is_primary=True).first() or obj.product.images.first()
        if not image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url


class WishlistItemSerializer(serializers.ModelSerializer):
    """
    Full product card data serializer for wishlist list endpoint.
    Returns full product data suitable for ProductCard rendering.
    """
    product = serializers.SerializerMethodField()

    class Meta:
        model = WishlistItem
        fields = [
            "id",
            "product",
            "created_at",
        ]

    def get_product(self, obj):
        """
        Return full product data suitable for ProductCard rendering.
        This includes starting price calculation from variants.
        """
        product = obj.product
        
        # Get minimum price from active variants
        min_variant_price = (
            ProductVariant.objects
            .filter(product=product, is_active=True)
            .aggregate(min_price=Min("price"))
            .get("min_price")
        )
        
        starting_price = min_variant_price or product.price
        
        # Get primary image
        primary_image_obj = product.images.filter(is_primary=True).first() or product.images.first()
        primary_image = None
        if primary_image_obj:
            request = self.context.get("request")
            if request:
                primary_image = request.build_absolute_uri(primary_image_obj.image.url)
            else:
                primary_image = primary_image_obj.image.url
        
        # Check if product has selectable variants
        has_selectable_variants = (
            ProductVariant.objects
            .filter(product=product, is_active=True)
            .filter(variant_attribute_values__isnull=False)
            .exists()
        )
        
        # Get default variant ID
        default_variant = (
            ProductVariant.objects
            .filter(product=product, is_active=True, is_default=True)
            .first()
        ) or (
            ProductVariant.objects
            .filter(product=product, is_active=True)
            .order_by("id")
            .first()
        )
        default_variant_id = default_variant.id if default_variant else None
        
        # Check if in stock
        is_in_stock = (
            ProductVariant.objects
            .filter(product=product, is_active=True)
            .exists()
        )
        
        return {
            "id": product.id,
            "name": product.name,
            "slug": product.slug,
            "price": str(product.price),
            "starting_price": str(starting_price),
            "currency": product.currency,
            "shop_name": product.shop_name,
            "primary_image": primary_image,
            "rating": 0,  # Can be enhanced with review data
            "review_count": 0,  # Can be enhanced with review data
            "is_in_stock": is_in_stock,
            "has_selectable_variants": has_selectable_variants,
            "default_variant_id": default_variant_id,
        }


class WishlistReadSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ["id", "items", "created_at", "updated_at"]

    def get_items(self, obj):
        """
        Return wishlist items with full product data.
        """
        items = obj.items.all()
        return WishlistItemSerializer(
            items,
            many=True,
            context=self.context
        ).data


class WishlistItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=False)
    product_variant_id = serializers.IntegerField(required=False)

    def validate(self, attrs):
        product_id = attrs.get("product_id")
        product_variant_id = attrs.get("product_variant_id")

        if not product_id and not product_variant_id:
            raise serializers.ValidationError(
                {"product_id": "product_id is required."}
            )

        if product_variant_id and not product_id:
            variant = ProductVariant.objects.filter(
                id=product_variant_id,
                is_active=True,
                product__is_active=True,
            ).select_related("product").first()
            if not variant:
                raise serializers.ValidationError(
                    {"product_variant_id": "Product variant not found."}
                )
            attrs["product_id"] = variant.product_id

        self.validate_product_id(attrs["product_id"])
        return attrs

    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")
        return value
