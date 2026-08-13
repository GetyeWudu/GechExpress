from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.orders.models import Order, OrderItem
from apps.products.models.variant import ProductVariant
from apps.products.models.product import Product
from apps.reviews.models import Review, ReviewVote
from apps.reviews.services import ReviewService


class ReviewModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

        self.variant = (
            ProductVariant.objects.create(
                product=self.product,
                sku="TEST-SKU-001",
                price=Decimal("99.99"),
                is_default=True,
            )
        )

    def test_review_creation(self):
        review = Review.objects.create(
            user=self.user,
            product_variant=self.variant,
            rating=5,
            title="Great product!",
            comment="Excellent quality.",
        )

        self.assertEqual(
            review.rating,
            5,
        )

        self.assertEqual(
            review.status,
            Review.Status.PENDING,
        )

    def test_unique_review_constraint(self):
        Review.objects.create(
            user=self.user,
            product_variant=self.variant,
            rating=5,
            title="First review",
            status=Review.Status.APPROVED,
        )

        # Attempting to create another
        # approved/pending review should fail
        with self.assertRaises(Exception):
            Review.objects.create(
                user=self.user,
                product_variant=self.variant,
                rating=4,
                title="Second review",
                status=Review.Status.APPROVED,
            )


class ReviewServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

        self.variant = (
            ProductVariant.objects.create(
                product=self.product,
                sku="TEST-SKU-001",
                price=Decimal("99.99"),
                is_default=True,
            )
        )

        self.order = Order.objects.create(
            user=self.user,
            order_number="ORD-TEST001",
            subtotal=Decimal("99.99"),
            shipping_cost=Decimal("0.00"),
            total=Decimal("99.99"),
            shipping_full_name=(
                "John Doe"
            ),
            shipping_phone="1234567890",
            shipping_address=(
                "123 Main St"
            ),
            shipping_city="Addis Ababa",
            shipping_country="Ethiopia",
        )

        self.order_item = OrderItem.objects.create(
            order=self.order,
            product_variant=self.variant,
            product_name=self.product.name,
            sku=self.variant.sku,
            unit_price=self.variant.price,
            quantity=1,
            subtotal=Decimal("99.99"),
        )

    def test_create_review(self):
        review = ReviewService.create_review(
            user=self.user,
            product_variant_id=self.variant.id,
            rating=5,
            title="Great!",
            comment="Really good.",
            order_item_id=self.order_item.id,
        )

        self.assertEqual(
            review.rating,
            5,
        )

        self.assertEqual(
            review.status,
            Review.Status.PENDING,
        )

        self.assertEqual(
            review.order_item,
            self.order_item,
        )

    def test_approve_review(self):
        review = ReviewService.create_review(
            user=self.user,
            product_variant_id=self.variant.id,
            rating=5,
            title="Great!",
        )

        approved = (
            ReviewService.approve_review(
                review_id=review.id
            )
        )

        self.assertEqual(
            approved.status,
            Review.Status.APPROVED,
        )

    def test_vote_on_review(self):
        review = ReviewService.create_review(
            user=self.user,
            product_variant_id=self.variant.id,
            rating=5,
            title="Great!",
        )

        other_user = (
            User.objects.create_user(
                email="other@example.com",
                password="testpass123",
            )
        )

        reviewed = (
            ReviewService.vote_on_review(
                review_id=review.id,
                user=other_user,
                vote_type=(
                    ReviewVote.VoteType.HELPFUL
                ),
            )
        )

        self.assertEqual(
            reviewed.helpful_count,
            1,
        )

        self.assertEqual(
            reviewed.unhelpful_count,
            0,
        )


class ReviewAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.staff_user = (
            User.objects.create_user(
                email="staff@example.com",
                password="testpass123",
                role=User.Role.STAFF,
            )
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

        self.variant = (
            ProductVariant.objects.create(
                product=self.product,
                sku="TEST-SKU-001",
                price=Decimal("99.99"),
                is_default=True,
            )
        )

        self.client.force_authenticate(
            user=self.user
        )

    def test_create_review_endpoint(self):
        response = self.client.post(
            "/api/v1/reviews/create/",
            {
                "product_variant_id": (
                    self.variant.id
                ),
                "rating": 5,
                "title": "Great product!",
                "comment": (
                    "Excellent quality."
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["rating"],
            5,
        )

    def test_reviews_list_endpoint(self):
        # Create and approve a review
        review = Review.objects.create(
            user=self.user,
            product_variant=self.variant,
            rating=5,
            title="Great!",
            status=Review.Status.APPROVED,
        )

        response = self.client.get(
            "/api/v1/reviews/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

    def test_approve_review_staff_only(self):
        review = Review.objects.create(
            user=self.user,
            product_variant=self.variant,
            rating=5,
            title="Great!",
            status=Review.Status.PENDING,
        )

        # Staff can approve
        self.client.force_authenticate(
            user=self.staff_user
        )

        response = self.client.post(
            f"/api/v1/reviews/{review.id}/approve/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["status"],
            Review.Status.APPROVED,
        )
