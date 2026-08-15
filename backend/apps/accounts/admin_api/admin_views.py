from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)

from ..models import User
from ..permissions import IsAdmin
from ..services import UserManagementService

from .admin_serializers import (
    AdminCreateSellerSerializer,
    AdminSellerDetailSerializer,
    AdminSellerListSerializer,
    AdminCustomerDetailSerializer,
    AdminCustomerListSerializer,
    AdminUserStatusSerializer,
)
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
)



class AdminSellerViewSet(
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAdmin]

    queryset = (
        User.objects
        .filter(role=User.Role.SELLER)
        .order_by("-created_at")
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "account_status",
        "is_active",
    ]

    search_fields = [
        "email",
        "first_name",
        "last_name",
        "phone_number",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "email",
        "first_name",
        "last_name",
        "account_status",
        "last_login",
    ]

    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action == "create":
            return AdminCreateSellerSerializer

        if self.action == "list":
            return AdminSellerListSerializer

        return AdminSellerDetailSerializer

    def perform_create(self, serializer):
        validated_data = serializer.validated_data

        try:
            self.created_seller = (
                UserManagementService.create_seller(
                    **validated_data
                )
            )
        except ValueError as exc:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({
                "detail": str(exc)
            })

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_create(serializer)

        response_serializer = (
            AdminSellerDetailSerializer(
                self.created_seller
            )
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
    )
    def change_status(self, request, pk=None):
        seller = self.get_object()

        serializer = AdminUserStatusSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            seller = (
                UserManagementService.change_status(
                    admin_user=request.user,
                    target_user=seller,
                    new_status=(
                        serializer.validated_data[
                            "account_status"
                        ]
                    ),
                )
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            AdminSellerDetailSerializer(
                seller
            ).data,
            status=status.HTTP_200_OK,
        )


class AdminCustomerViewSet(
    viewsets.ReadOnlyModelViewSet
):
    permission_classes = [IsAdmin]

    queryset = (
        User.objects
        .filter(
            role=User.Role.CUSTOMER
        )
        .order_by("-created_at")
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = [
        "account_status",
        "is_active",
    ]

    search_fields = [
        "email",
        "first_name",
        "last_name",
        "phone_number",
    ]

    ordering_fields = [
        "created_at",
        "updated_at",
        "email",
        "first_name",
        "last_name",
        "account_status",
        "last_login",
    ]

    ordering = [
        "-created_at",
    ]

    def get_serializer_class(self):

        if self.action == "list":
            return AdminCustomerListSerializer

        return AdminCustomerDetailSerializer

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
    )
    def change_status(
        self,
        request,
        pk=None,
    ):

        customer = self.get_object()

        serializer = (
            AdminUserStatusSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:
            customer = (
                UserManagementService.change_status(
                    admin_user=request.user,
                    target_user=customer,
                    new_status=(
                        serializer.validated_data[
                            "account_status"
                        ]
                    ),
                )
            )

        except ValueError as exc:
            return Response(
                {
                    "detail": str(exc)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            AdminCustomerDetailSerializer(
                customer
            ).data,
            status=status.HTTP_200_OK,
        )    