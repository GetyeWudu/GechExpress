from rest_framework import serializers

from apps.reviews.models import Review, ReviewVote
from apps.orders.models import OrderItem


class ReviewReadSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user_email",
            "product",
            "product_name",
            "rating",
            "title",
            "comment",
            "status",
            "helpful_count",
            "unhelpful_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user_email",
            "product_name",
            "helpful_count",
            "unhelpful_count",
            "status",
            "created_at",
            "updated_at",
        ]


class ReviewCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    comment = serializers.CharField(required=False, allow_blank=True)
    order_item_id = serializers.IntegerField(required=False)

    def validate_product_id(self, value):
        from apps.products.models.product import Product

        try:
            Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found.")
        return value

    def validate_order_item_id(self, value):
        if value is None:
            return None

        try:
            OrderItem.objects.get(id=value)
        except OrderItem.DoesNotExist:
            raise serializers.ValidationError("Order item not found.")
        return value


class ReviewUpdateSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False)
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    comment = serializers.CharField(required=False, allow_blank=True)


class ReviewVoteSerializer(serializers.Serializer):
    vote_type = serializers.ChoiceField(choices=ReviewVote.VoteType.choices)
