from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.accounts.permissions import IsStaff
from apps.reviews.models import Review
from apps.reviews.permissions import (
    IsReviewOwner,
    IsReviewModerator,
)
from apps.reviews.serializers import (
    ReviewReadSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
    ReviewVoteSerializer,
)
from apps.reviews.services import ReviewService


class ReviewViewSet(GenericViewSet):
    """
    Manage product reviews.
    """

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):
        """
        Return approved reviews for public viewing.
        Staff sees all.
        """

        if (
            self.request.user.is_authenticated
            and self.request.user.role
            == self.request.user.Role.STAFF
        ):
            return (
                Review.objects
                .select_related("user", "product")
                .order_by("-created_at")
            )

        return (
            Review.objects
            .filter(
                status=Review.Status.APPROVED
            )
            .select_related("user", "product")
            .order_by("-created_at")
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):
        """
        List reviews for a product.
        Filter by product_id query param.
        """

        product_id = request.query_params.get("product_id")

        queryset = self.get_queryset()

        if product_id:
            queryset = queryset.filter(product_id=product_id)

        serializer = ReviewReadSerializer(
            queryset,
            many=True
        )

        return Response(
            serializer.data
        )

    def retrieve(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Retrieve a specific review."""

        review = (
            self.get_queryset()
            .filter(pk=pk)
            .first()
        )

        if not review:
            return Response(
                {
                    "detail": (
                        "Review not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        serializer = ReviewReadSerializer(
            review
        )

        return Response(
            serializer.data
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="create",
        permission_classes=[
            IsAuthenticated
        ],
    )
    def create_review(
        self,
        request,
        *args,
        **kwargs
    ):
        """Create a new review."""

        serializer = ReviewCreateSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = ReviewService.create_review(
            user=request.user,
            product_id=serializer.validated_data["product_id"],
            rating=serializer.validated_data["rating"],
            title=serializer.validated_data.get("title"),
            comment=serializer.validated_data.get("comment"),
            order_item_id=serializer.validated_data.get("order_item_id"),
        )

        return Response(
            ReviewReadSerializer(
                review
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["put"],
        url_path="update",
        permission_classes=[
            IsAuthenticated,
            IsReviewOwner,
        ],
    )
    def update_review(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Update a review (owner only)."""

        review = (
            Review.objects
            .filter(pk=pk)
            .first()
        )

        if not review:
            return Response(
                {
                    "detail": (
                        "Review not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        # Check permission
        if review.user != request.user:
            return Response(
                {
                    "detail": (
                        "Permission denied."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                ),
            )

        serializer = (
            ReviewUpdateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = ReviewService.update_review(
            review_id=pk,
            rating=(
                serializer.validated_data.get(
                    "rating"
                )
            ),
            title=(
                serializer.validated_data.get(
                    "title"
                )
            ),
            comment=(
                serializer.validated_data.get(
                    "comment"
                )
            ),
        )

        return Response(
            ReviewReadSerializer(
                review
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path="delete",
        permission_classes=[
            IsAuthenticated,
            IsReviewOwner,
        ],
    )
    def delete_review(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Delete a review (owner only)."""

        review = (
            Review.objects
            .filter(pk=pk)
            .first()
        )

        if not review:
            return Response(
                {
                    "detail": (
                        "Review not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        # Check permission
        if review.user != request.user:
            return Response(
                {
                    "detail": (
                        "Permission denied."
                    )
                },
                status=(
                    status
                    .HTTP_403_FORBIDDEN
                ),
            )

        ReviewService.delete_review(
            review_id=pk
        )

        return Response(
            status=(
                status
                .HTTP_204_NO_CONTENT
            )
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="approve",
        permission_classes=[
            IsAuthenticated,
            IsReviewModerator,
        ],
    )
    def approve_review(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Approve a review (staff only)."""

        review = ReviewService.approve_review(
            review_id=pk
        )

        return Response(
            ReviewReadSerializer(
                review
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="reject",
        permission_classes=[
            IsAuthenticated,
            IsReviewModerator,
        ],
    )
    def reject_review(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Reject a review (staff only)."""

        review = ReviewService.reject_review(
            review_id=pk
        )

        return Response(
            ReviewReadSerializer(
                review
            ).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="vote",
        permission_classes=[
            IsAuthenticated
        ],
    )
    def vote_on_review(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Vote on review helpfulness."""

        serializer = ReviewVoteSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        review = ReviewService.vote_on_review(
            review_id=pk,
            user=request.user,
            vote_type=(
                serializer.validated_data[
                    "vote_type"
                ]
            ),
        )

        return Response(
            ReviewReadSerializer(
                review
            ).data,
            status=status.HTTP_200_OK,
        )
