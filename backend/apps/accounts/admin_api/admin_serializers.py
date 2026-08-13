


from rest_framework import serializers
from ..models import User

class AdminUserListSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "account_status",
            "is_active",
            "created_at",
            "updated_at",
            "last_login",
        ]


class AdminUserDetailSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "role",
            "account_status",
            "is_active",
            "created_at",
            "updated_at",
            "last_login",
        ]

        read_only_fields = [
            "id",
            "email",
            "created_at",
            "updated_at",
            "last_login",
        ]


class AdminUserRoleSerializer(
    serializers.Serializer
):
    role = serializers.ChoiceField(
        choices=User.Role.choices
    )


class AdminUserStatusSerializer(
    serializers.Serializer
):
    account_status = serializers.ChoiceField(
        choices=User.AccountStatus.choices
    )
