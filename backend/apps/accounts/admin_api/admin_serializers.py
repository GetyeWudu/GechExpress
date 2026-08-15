from rest_framework import serializers

from ..models import User


class AdminCreateSellerSerializer(
    serializers.ModelSerializer
):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
        ]

    def validate_email(self, value):
        if User.objects.filter(
            email=value
        ).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )

        return value


class AdminSellerListSerializer(
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

        read_only_fields = fields


class AdminSellerDetailSerializer(
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

        read_only_fields = fields


class AdminCustomerListSerializer(
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

        read_only_fields = fields


class AdminCustomerDetailSerializer(
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

        read_only_fields = fields


class AdminUserStatusSerializer(
    serializers.Serializer
):
    account_status = serializers.ChoiceField(
        choices=User.AccountStatus.choices
    )