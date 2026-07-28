from rest_framework import serializers
from apps.products.models.category import Category
from apps.products.models.product import Product


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "parent", "image", "is_active"]
        read_only_fields = ["id", "slug"]

    def _build_image_url(self, image_field):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(image_field.url)
        return image_field.url

    def _get_product_cover_image(self, category):
        product = (
            Product.objects.filter(
                is_active=True,
                categories=category,
            )
            .prefetch_related("images")
            .first()
        )
        if not product:
            return None

        image = product.images.filter(is_primary=True).first() or product.images.first()
        if not image:
            return None

        return self._build_image_url(image.image)

    def get_image(self, obj):
        if obj.image:
            return self._build_image_url(obj.image)

        return self._get_product_cover_image(obj)


class CategoryReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]
