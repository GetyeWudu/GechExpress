from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.orders.models import Order
from apps.orders.serializers import (
    CheckoutSerializer,
    OrderReadSerializer,
)
from apps.orders.services import CheckoutService


class OrderViewSet(GenericViewSet):

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return (
            Order.objects
            .filter(
                user=self.request.user
            )
            .prefetch_related(
                "items"
            )
            .order_by(
                "-created_at"
            )
        )

    def list(
        self,
        request,
        *args,
        **kwargs
    ):

        orders = self.get_queryset()

        serializer = OrderReadSerializer(
            orders,
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

        order = self.get_queryset().filter(
            pk=pk
        ).first()

        if not order:
            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = OrderReadSerializer(
            order
        )

        return Response(
            serializer.data
        )

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        serializer = CheckoutSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        order = CheckoutService.checkout(
            user=request.user,
            **serializer.validated_data
        )

        return Response(
            OrderReadSerializer(
                order
            ).data,
            status=status.HTTP_201_CREATED,
        )