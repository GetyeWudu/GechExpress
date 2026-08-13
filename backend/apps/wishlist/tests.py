from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.products.models.product import Product
from apps.wishlist.models import Wishlist, WishlistItem
from apps.wishlist.services import WishlistService


class WishlistModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

    def test_wishlist_creation(self):
        wishlist = Wishlist.objects.create(
            user=self.user
        )

        self.assertEqual(
            wishlist.user,
            self.user,
        )

    def test_wishlist_item_creation(self):
        wishlist = Wishlist.objects.create(
            user=self.user
        )

        item = WishlistItem.objects.create(
            wishlist=wishlist,
            product=self.product,
        )

        self.assertEqual(
            item.wishlist,
            wishlist,
        )

        self.assertEqual(
            item.product,
            self.product,
        )


class WishlistServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

    def test_get_or_create_wishlist(self):
        wishlist = (
            WishlistService
            .get_or_create_wishlist(
                self.user
            )
        )

        self.assertIsNotNone(wishlist.id)

        # Creating again should return same
        wishlist2 = (
            WishlistService
            .get_or_create_wishlist(
                self.user
            )
        )

        self.assertEqual(
            wishlist.id,
            wishlist2.id,
        )

    def test_add_to_wishlist(self):
        item = (
            WishlistService
            .add_to_wishlist(
                user=self.user,
                product_id=self.product.id,
            )
        )

        self.assertIsNotNone(item.id)

        self.assertEqual(
            item.product,
            self.product,
        )

    def test_remove_from_wishlist(self):
        item = (
            WishlistService
            .add_to_wishlist(
                user=self.user,
                product_id=self.product.id,
            )
        )

        result = (
            WishlistService
            .remove_from_wishlist(
                user=self.user,
                wishlist_item_id=item.id,
            )
        )

        self.assertTrue(result)

        # Item should not exist
        with self.assertRaises(
            WishlistItem.DoesNotExist
        ):
            WishlistItem.objects.get(
                id=item.id
            )

    def test_clear_wishlist(self):
        WishlistService.add_to_wishlist(
            user=self.user,
            product_id=self.product.id,
        )

        result = (
            WishlistService
            .clear_wishlist(
                self.user
            )
        )

        self.assertTrue(result)

        wishlist = (
            Wishlist.objects.get(
                user=self.user
            )
        )

        self.assertEqual(
            wishlist.items.count(),
            0,
        )


class WishlistAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.product = Product.objects.create(
            name="Test Product",
            slug="test-product",
        )

        self.client.force_authenticate(
            user=self.user
        )

    def test_wishlist_list_endpoint(self):
        response = self.client.get(
            "/api/v1/wishlist/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn("items", response.data)

    def test_add_to_wishlist_endpoint(self):
        response = self.client.post(
            "/api/v1/wishlist/add/",
            {
                "product_id": self.product.id,
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        self.assertEqual(
            response.data["product"],
            self.product.id,
        )

    def test_remove_from_wishlist_endpoint(self):
        # Add item first
        item = (
            WishlistService
            .add_to_wishlist(
                user=self.user,
                product_id=self.product.id,
            )
        )

        response = self.client.delete(
            f"/api/v1/wishlist/{item.id}/remove/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

    def test_clear_wishlist_endpoint(self):
        WishlistService.add_to_wishlist(
            user=self.user,
            product_id=self.product.id,
        )

        response = self.client.post(
            "/api/v1/wishlist/clear/",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        # Verify wishlist is empty
        response = self.client.get(
            "/api/v1/wishlist/"
        )

        self.assertEqual(
            len(response.data["items"]),
            0,
        )
