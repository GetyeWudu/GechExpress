from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.reviews.models import Review, ReviewVote
from apps.orders.models import OrderItem
from apps.products.models.product import Product


class ReviewService:

    @staticmethod
    @transaction.atomic
    def create_review(
        *,
        user,
        product_id,
        rating,
        title=None,
        comment=None,
        order_item_id=None,
    ):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValidationError({"product": "Product not found."})

        existing = Review.objects.filter(
            user=user,
            product=product,
            status__in=[Review.Status.APPROVED, Review.Status.PENDING],
        ).first()

        if existing:
            raise ValidationError(
                {"review": "You have already reviewed this product."}
            )

        order_item = None

        if order_item_id:
            try:
                order_item = OrderItem.objects.get(id=order_item_id)

                if order_item.order.user != user:
                    raise ValidationError({"order_item": "Order item not found."})

                if order_item.product != product:
                    raise ValidationError(
                        {"order_item": "Order item does not match product."}
                    )

            except OrderItem.DoesNotExist:
                raise ValidationError({"order_item": "Order item not found."})

        return Review.objects.create(
            user=user,
            product=product,
            order_item=order_item,
            rating=rating,
            title=title or "",
            comment=comment or "",
            status=Review.Status.PENDING,
        )

    @staticmethod
    @transaction.atomic
    def update_review(*, review_id, rating=None, title=None, comment=None):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"review": "Review not found."})

        if rating is not None:
            review.rating = rating
        if title is not None:
            review.title = title
        if comment is not None:
            review.comment = comment

        review.save()
        return review

    @staticmethod
    @transaction.atomic
    def approve_review(*, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"review": "Review not found."})

        if review.status == Review.Status.APPROVED:
            raise ValidationError({"review": "Review is already approved."})

        review.status = Review.Status.APPROVED
        review.save()
        return review

    @staticmethod
    @transaction.atomic
    def reject_review(*, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"review": "Review not found."})

        if review.status == Review.Status.REJECTED:
            raise ValidationError({"review": "Review is already rejected."})

        review.status = Review.Status.REJECTED
        review.save()
        return review

    @staticmethod
    @transaction.atomic
    def delete_review(*, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"review": "Review not found."})

        review.delete()
        return True

    @staticmethod
    @transaction.atomic
    def vote_on_review(*, review_id, user, vote_type):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            raise ValidationError({"review": "Review not found."})

        existing = ReviewVote.objects.filter(review=review, user=user).first()

        if existing:
            if existing.vote_type == vote_type:
                raise ValidationError({"vote": "You have already voted this way."})

            if existing.vote_type == ReviewVote.VoteType.HELPFUL:
                review.helpful_count -= 1
            else:
                review.unhelpful_count -= 1

            existing.vote_type = vote_type
            existing.save()
        else:
            ReviewVote.objects.create(review=review, user=user, vote_type=vote_type)

        if vote_type == ReviewVote.VoteType.HELPFUL:
            review.helpful_count += 1
        else:
            review.unhelpful_count += 1

        review.save()
        return review
