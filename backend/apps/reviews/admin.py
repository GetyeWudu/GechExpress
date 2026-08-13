from django.contrib import admin

from apps.reviews.models import Review, ReviewVote


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "user",
        "product",
        "rating",
        "status",
        "helpful_count",
        "unhelpful_count",
        "created_at",
    ]

    list_filter = [
        "status",
        "rating",
        "created_at",
    ]

    search_fields = [
        "user__email",
        "product__sku",
        "title",
        "comment",
    ]

    readonly_fields = [
        "user",
        "product",
        "order_item",
        "helpful_count",
        "unhelpful_count",
        "created_at",
        "updated_at",
    ]

    fieldsets = (
        (
            "Review Information",
            {
                "fields": [
                    "user",
                    "product",
                    "order_item",
                    "rating",
                ]
            },
        ),
        (
            "Content",
            {
                "fields": [
                    "title",
                    "comment",
                ]
            },
        ),
        (
            "Moderation",
            {
                "fields": [
                    "status",
                ]
            },
        ),
        (
            "Engagement",
            {
                "fields": [
                    "helpful_count",
                    "unhelpful_count",
                ]
            },
        ),
        (
            "Timestamps",
            {
                "fields": [
                    "created_at",
                    "updated_at",
                ]
            },
        ),
    )

    actions = [
        "approve_reviews",
        "reject_reviews",
    ]

    def approve_reviews(
        self,
        request,
        queryset,
    ):
        queryset.update(
            status=Review.Status.APPROVED
        )

        self.message_user(
            request,
            "Selected reviews approved.",
        )

    approve_reviews.short_description = (
        "Approve selected reviews"
    )

    def reject_reviews(
        self,
        request,
        queryset,
    ):
        queryset.update(
            status=Review.Status.REJECTED
        )

        self.message_user(
            request,
            "Selected reviews rejected.",
        )

    reject_reviews.short_description = (
        "Reject selected reviews"
    )


@admin.register(ReviewVote)
class ReviewVoteAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "review",
        "user",
        "vote_type",
        "created_at",
    ]

    list_filter = [
        "vote_type",
        "created_at",
    ]

    search_fields = [
        "user__email",
        "review__title",
    ]

    readonly_fields = [
        "review",
        "user",
        "created_at",
    ]
