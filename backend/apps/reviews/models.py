from django.conf import settings
from django.core.validators import (
    MinValueValidator,
    MaxValueValidator,
)
from django.db import models

from apps.orders.models import OrderItem
from apps.products.models.Product import Product


class Review(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="reviews",
        null=True,
        blank=True,
    )

    # Link to the purchase order item
    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="review",
    )

    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ],
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    comment = models.TextField(
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    helpful_count = models.PositiveIntegerField(
        default=0,
    )

    unhelpful_count = models.PositiveIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                condition=models.Q(
                    status__in=[
                        "approved",
                        "pending",
                    ]
                ),
                name="unique_active_review_per_user_product",
            ),
        ]
        indexes = [
            models.Index(
                fields=["product", "-rating"]
            ),
            models.Index(
                fields=["user", "-created_at"]
            ),
            models.Index(
                fields=["status", "-created_at"]
            ),
        ]

    def __str__(self):
        return (
            f"Review({self.user.email}, "
            f"{self.product.name}, "
            f"{self.rating}⭐)"
        )


class ReviewVote(models.Model):
    """
    Track whether users find reviews helpful or not.
    """

    class VoteType(models.TextChoices):
        HELPFUL = "helpful", "Helpful"
        UNHELPFUL = "unhelpful", "Unhelpful"

    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="review_votes",
    )

    vote_type = models.CharField(
        max_length=20,
        choices=VoteType.choices,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["review", "user"],
                name="unique_review_vote_per_user",
            ),
        ]
        indexes = [
            models.Index(
                fields=["review", "-created_at"]
            ),
        ]

    def __str__(self):
        return (
            f"ReviewVote({self.review_id}, "
            f"{self.user.email}, "
            f"{self.vote_type})"
        )
