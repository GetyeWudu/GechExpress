"""
Product discovery service for Etsy-like marketplace homepage.
"""

from django.db.models import Q, Count, Avg
from apps.products.models.product import Product


class ProductDiscoveryService:

    @staticmethod
    def get_featured_products(limit=12):
        return (
            Product.objects
            .filter(is_active=True)
            .prefetch_related("images", "categories", "tags")
            .annotate(
                avg_rating=Avg("reviews__rating"),
                review_count=Count(
                    "reviews",
                    filter=Q(reviews__status="approved"),
                ),
            )
            .filter(avg_rating__gte=4.0)
            .order_by("-reviews__created_at")[:limit]
        )

    @staticmethod
    def get_trending_products(limit=12):
        from django.utils import timezone
        from datetime import timedelta

        seven_days_ago = timezone.now() - timedelta(days=7)

        return (
            Product.objects
            .filter(is_active=True)
            .prefetch_related("images", "categories", "tags")
            .annotate(
                recent_reviews=Count(
                    "reviews",
                    filter=Q(
                        reviews__status="approved",
                        reviews__created_at__gte=seven_days_ago,
                    ),
                ),
                avg_rating=Avg("reviews__rating"),
            )
            .filter(recent_reviews__gt=0)
            .order_by("-recent_reviews", "-avg_rating")[:limit]
        )

    @staticmethod
    def get_new_arrivals(limit=12):
        return (
            Product.objects
            .filter(is_active=True)
            .prefetch_related("images", "categories", "tags")
            .order_by("-created_at")[:limit]
        )

    @staticmethod
    def get_category_highlights(category_id, limit=8):
        return (
            Product.objects
            .filter(is_active=True, categories__id=category_id)
            .prefetch_related("images", "categories", "tags")
            .annotate(
                avg_rating=Avg("reviews__rating"),
                review_count=Count(
                    "reviews",
                    filter=Q(reviews__status="approved"),
                ),
            )
            .order_by("-avg_rating", "-review_count")[:limit]
        )

    @staticmethod
    def get_similar_products(product_id, limit=8):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Product.objects.none()

        category_ids = product.categories.values_list("id", flat=True)
        tag_ids = product.tags.values_list("id", flat=True)

        return (
            Product.objects
            .filter(is_active=True)
            .exclude(id=product_id)
            .filter(
                Q(categories__id__in=category_ids)
                | Q(tags__id__in=tag_ids)
            )
            .prefetch_related("images", "categories", "tags")
            .distinct()[:limit]
        )
