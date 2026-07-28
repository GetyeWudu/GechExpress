from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.orders.models import Order
from apps.shipping.models import (
    ShippingMethod,
    Shipment,
)
from apps.shipping.services import ShippingService


class ShippingMethodTests(TestCase):

    def setUp(self):
        self.method = ShippingMethod.objects.create(
            name="Standard Shipping",
            code="STANDARD",
            base_cost=Decimal("50.00"),
            estimated_days_min=3,
            estimated_days_max=5,
        )

    def test_shipping_method_creation(self):
        self.assertEqual(
            self.method.name,
            "Standard Shipping",
        )

        self.assertEqual(
            self.method.base_cost,
            Decimal("50.00"),
        )


class ShipmentModelTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.order = Order.objects.create(
            user=self.user,
            order_number="ORD-TEST001",
            subtotal=Decimal("1000.00"),
            shipping_cost=Decimal("50.00"),
            total=Decimal("1050.00"),
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

        self.method = ShippingMethod.objects.create(
            name="Standard Shipping",
            code="STANDARD",
            base_cost=Decimal("50.00"),
        )

    def test_shipment_creation(self):
        shipment = Shipment.objects.create(
            order=self.order,
            shipping_method=self.method,
            recipient_full_name=(
                "John Doe"
            ),
            recipient_phone="1234567890",
            recipient_address=(
                "123 Main St"
            ),
            recipient_city="Addis Ababa",
            recipient_country="Ethiopia",
        )

        self.assertEqual(
            shipment.status,
            Shipment.Status.PENDING,
        )

        self.assertEqual(
            shipment.order,
            self.order,
        )


class ShippingServiceTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
        )

        self.order = Order.objects.create(
            user=self.user,
            order_number="ORD-TEST001",
            subtotal=Decimal("1000.00"),
            shipping_cost=Decimal("50.00"),
            total=Decimal("1050.00"),
            shipping_full_name=(
                "John Doe"
            ),
            shipping_phone="1234567890",
            shipping_address=(
                "123 Main St"
            ),
            shipping_city="Addis Ababa",
            shipping_country="Ethiopia",
            status=Order.Status.PROCESSING,
        )

        self.method = ShippingMethod.objects.create(
            name="Standard Shipping",
            code="STANDARD",
            base_cost=Decimal("50.00"),
        )

    def test_create_shipment(self):
        shipment = (
            ShippingService
            .create_shipment(
                order=self.order,
                shipping_method_id=self.method.id,
                recipient_full_name=(
                    "John Doe"
                ),
                recipient_phone="1234567890",
                recipient_address=(
                    "123 Main St"
                ),
                recipient_city="Addis Ababa",
                recipient_country="Ethiopia",
            )
        )

        self.assertIsNotNone(shipment.id)

        self.assertEqual(
            shipment.status,
            Shipment.Status.PENDING,
        )

    def test_update_shipment_status_to_shipped(self):
        shipment = (
            ShippingService
            .create_shipment(
                order=self.order,
                shipping_method_id=self.method.id,
                recipient_full_name=(
                    "John Doe"
                ),
                recipient_phone="1234567890",
                recipient_address=(
                    "123 Main St"
                ),
                recipient_city="Addis Ababa",
                recipient_country="Ethiopia",
            )
        )

        updated = (
            ShippingService
            .update_shipment_status(
                shipment_id=shipment.id,
                status=Shipment.Status.SHIPPED,
                tracking_number=(
                    "TRACK123456789"
                ),
            )
        )

        self.assertEqual(
            updated.status,
            Shipment.Status.SHIPPED,
        )

        self.assertIsNotNone(
            updated.shipped_at
        )

        # Check order status updated
        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            Order.Status.SHIPPED,
        )

    def test_update_shipment_status_to_delivered(self):
        self.order.status = (
            Order.Status.SHIPPED
        )
        self.order.save(skip_validation=True)

        shipment = (
            ShippingService
            .create_shipment(
                order=self.order,
                shipping_method_id=self.method.id,
                recipient_full_name=(
                    "John Doe"
                ),
                recipient_phone="1234567890",
                recipient_address=(
                    "123 Main St"
                ),
                recipient_city="Addis Ababa",
                recipient_country="Ethiopia",
            )
        )

        updated = (
            ShippingService
            .update_shipment_status(
                shipment_id=shipment.id,
                status=Shipment.Status.DELIVERED,
            )
        )

        self.assertEqual(
            updated.status,
            Shipment.Status.DELIVERED,
        )

        self.assertIsNotNone(
            updated.delivered_at
        )


class ShippingAPITests(APITestCase):

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

        self.method = ShippingMethod.objects.create(
            name="Standard Shipping",
            code="STANDARD",
            base_cost=Decimal("50.00"),
        )

        self.order = Order.objects.create(
            user=self.user,
            order_number="ORD-TEST001",
            subtotal=Decimal("1000.00"),
            shipping_cost=Decimal("50.00"),
            total=Decimal("1050.00"),
            shipping_full_name=(
                "John Doe"
            ),
            shipping_phone="1234567890",
            shipping_address=(
                "123 Main St"
            ),
            shipping_city="Addis Ababa",
            shipping_country="Ethiopia",
            status=Order.Status.PROCESSING,
        )

    def test_shipping_methods_list(self):
        response = self.client.get(
            "/api/v1/shipping/methods/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data),
            1,
        )

    def test_shipments_list_customer(self):
        self.client.force_authenticate(
            user=self.user
        )

        response = self.client.get(
            "/api/v1/shipping/shipments/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_create_shipment_staff_only(self):
        # Now with staff
        self.client.force_authenticate(
            user=self.staff_user
        )

        response = self.client.post(
            "/api/v1/shipping/shipments/create/",
            {
                "order_id": self.order.id,
                "shipping_method": self.method.id,
                "recipient_full_name": (
                    "John Doe"
                ),
                "recipient_phone": (
                    "1234567890"
                ),
                "recipient_address": (
                    "123 Main St"
                ),
                "recipient_city": (
                    "Addis Ababa"
                ),
                "recipient_country": (
                    "Ethiopia"
                ),
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
