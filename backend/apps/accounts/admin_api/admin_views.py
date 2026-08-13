

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..permissions import IsAdmin
from ..models import User
from .admin_serializers import (
    AdminUserDetailSerializer,
    AdminUserListSerializer,
    AdminUserRoleSerializer,
    AdminUserStatusSerializer,
)
from ..services import UserManagementService


class AdminUserViewSet(
    viewsets.ReadOnlyModelViewSet
):

    permission_classes = [IsAdmin]

    queryset = (
        User.objects
        .all()
        .order_by("-created_at")
    )

    filterset_fields = [
        "role",
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
        "role",
        "account_status",
        "last_login",
    ]

    ordering = [
        "-created_at"
    ]

    def get_serializer_class(self):

        if self.action == "list":
            return AdminUserListSerializer

        return AdminUserDetailSerializer

    @action(
        detail=True,
        methods=["patch"],
        url_path="role",
    )
    def change_role(
        self,
        request,
        pk=None,
    ):

        target_user = self.get_object()

        serializer = AdminUserRoleSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            user = (
                UserManagementService.change_role(
                    admin_user=request.user,
                    target_user=target_user,
                    new_role=(
                        serializer.validated_data[
                            "role"
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
            AdminUserDetailSerializer(
                user
            ).data,
            status=status.HTTP_200_OK,
        )

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

        target_user = self.get_object()

        serializer = AdminUserStatusSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            user = (
                UserManagementService.change_status(
                    admin_user=request.user,
                    target_user=target_user,
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
            AdminUserDetailSerializer(
                user
            ).data,
            status=status.HTTP_200_OK,
        )
