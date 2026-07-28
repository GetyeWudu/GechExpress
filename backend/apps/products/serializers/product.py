from rest_framework import serializers

from apps.inventory.models import Inventory
from apps.products.models.attribute import AttributeValue, ProductAttributeValue
from apps.products.models.product import Category, Product, Tag
from apps.products.models.variant import ProductVariant
from .category import CategoryReadSerializer, CategorySerializer
from .productImage import ProductImageSerializer
from .tag import TagReadSerializer, TagSerializer


def get_product_available_stock(product):
    variants = ProductVariant.objects.active_available().filter(product=product)
    if variants.exists():
        return sum(variant.available_quantity for variant in variants)

    inventories = Inventory.objects.filter(
        product=product,
        product_variant__isnull=True,
        is_deleted=False,
        warehouse__is_active=True,
        warehouse__is_deleted=False,
    )
    return sum(inventory.available_quantity for inventory in inventories)


def group_product_attributes(product):
    """Configured option pool (admin), not necessarily in-stock."""
    assignments = (
        ProductAttributeValue.objects.filter(
            product=product,
            attribute_value__is_active=True,
        )
        .select_related("attribute_value__attribute")
        .order_by("attribute_value__attribute__name", "attribute_value__value")
    )

    grouped = {}
    for assignment in assignments:
        attribute_name = assignment.attribute_value.attribute.name
        grouped.setdefault(attribute_name, []).append(
            {
                "id": assignment.attribute_value_id,
                "value": assignment.attribute_value.value,
            }
        )

    return [
        {"attribute": attribute_name, "values": values}
        for attribute_name, values in grouped.items()
    ]


class ProductVariantDetailSerializer(serializers.ModelSerializer):
    available_quantity = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()
    attribute_values = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = [
            "id",
            "sku",
            "price",
            "currency",
            "is_default",
            "is_active",
            "available_quantity",
            "is_in_stock",
            "attribute_values",
        ]

    def get_available_quantity(self, obj):
        return obj.available_quantity

    def get_is_in_stock(self, obj):
        return obj.is_in_stock

    def get_attribute_values(self, obj):
        return [
            {
                "id": assignment.attribute_value_id,
                "attribute": assignment.attribute_value.attribute.name,
                "value": assignment.attribute_value.value,
            }
            for assignment in obj.variant_attribute_values.select_related(
                "attribute_value__attribute"
            )
        ]


class ProductReadSerializer(serializers.ModelSerializer):
    categories = CategoryReadSerializer(many=True, read_only=True)
    tags = TagReadSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "sku",
            "description",
            "price",
            "currency",
            "shop_name",
            "categories",
            "tags",
            "is_active",
            "created_at",
            "updated_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = serializers.SerializerMethodField()
    selectable_attributes = serializers.SerializerMethodField()
    has_selectable_variants = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()
    available_quantity = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "sku",
            "description",
            "price",
            "currency",
            "shop_name",
            "categories",
            "tags",
            "images",
            "attributes",
            "selectable_attributes",
            "has_selectable_variants",
            "variants",
            "available_quantity",
            "is_in_stock",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_attributes(self, obj):
        return group_product_attributes(obj)

    def get_selectable_attributes(self, obj):
        return obj.get_available_attributes()

    def get_has_selectable_variants(self, obj):
        return obj.has_selectable_variants()

    def get_variants(self, obj):
        variants = (
            ProductVariant.objects.active_available()
            .filter(product=obj)
            .prefetch_related("variant_attribute_values__attribute_value__attribute")
        )
        return ProductVariantDetailSerializer(variants, many=True).data

    def get_available_quantity(self, obj):
        return get_product_available_stock(obj)

    def get_is_in_stock(self, obj):
        return get_product_available_stock(obj) > 0


class ProductWriteSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(read_only=True)
    attribute_value_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True,
    )
    categories = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        many=True,
        required=False,
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "sku",
            "description",
            "price",
            "currency",
            "shop_name",
            "categories",
            "tags",
            "attribute_value_ids",
            "is_active",
        ]
        read_only_fields = ["id", "slug"]

    def validate_categories(self, categories):
        if not categories:
            raise serializers.ValidationError(
                "Product must belong to at least one category."
            )
        return categories

    def _sync_attribute_values(self, product, attribute_value_ids):
        ProductAttributeValue.objects.filter(product=product).delete()
        if not attribute_value_ids:
            return

        values = AttributeValue.objects.filter(
            id__in=attribute_value_ids,
            is_active=True,
        ).select_related("attribute")

        if values.count() != len(set(attribute_value_ids)):
            raise serializers.ValidationError(
                {"attribute_value_ids": "One or more attribute values are invalid."}
            )

        for value in values:
            ProductAttributeValue.objects.create(
                product=product,
                attribute_value=value,
            )

    def create(self, validated_data):
        categories = validated_data.pop("categories", [])
        tags = validated_data.pop("tags", [])
        attribute_value_ids = validated_data.pop("attribute_value_ids", [])
        product = super().create(validated_data)
        product.categories.set(categories)
        product.tags.set(tags)
        self._sync_attribute_values(product, attribute_value_ids)
        return product

    def update(self, instance, validated_data):
        categories = validated_data.pop("categories", None)
        tags = validated_data.pop("tags", None)
        attribute_value_ids = validated_data.pop("attribute_value_ids", None)
        product = super().update(instance, validated_data)
        if categories is not None:
            product.categories.set(categories)
        if tags is not None:
            product.tags.set(tags)
        if attribute_value_ids is not None:
            self._sync_attribute_values(product, attribute_value_ids)
        return product


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    available_quantity = serializers.SerializerMethodField()
    is_in_stock = serializers.SerializerMethodField()

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
            "primary_image",
            "available_quantity",
            "is_in_stock",
            "is_active",
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if not image:
            return None

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image.image.url)
        return image.image.url

    def get_available_quantity(self, obj):
        return get_product_available_stock(obj)

    def get_is_in_stock(self, obj):
        return get_product_available_stock(obj) > 0
