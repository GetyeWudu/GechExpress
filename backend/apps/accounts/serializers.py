from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    password_confirm = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = User

        fields = [
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
            "phone_number",
        ]

    def validate(self, attrs):
        if (
            attrs.get("password")
            != attrs.get("password_confirm")
        ):
            raise serializers.ValidationError(
                {
                    "password": (
                        "Passwords do not match."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop(
            "password_confirm"
        )

        password = validated_data.pop(
            "password"
        )

        return User.objects.create_user(
            password=password,
            role=User.Role.CUSTOMER,
            account_status=(
                User.AccountStatus.ACTIVE
            ),
            **validated_data,
        )


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError(
                "Email and password are required."
            )

        # Find the user
        user = User.objects.filter(
            email=email
        ).first()

        # User does not exist
        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        # Verify password first.
        # This prevents revealing account status
        # for an arbitrary email address.
        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid email or password."
            )

        # Credentials are correct from here onward.

        if (
            user.account_status
            == User.AccountStatus.SUSPENDED
        ):
            raise serializers.ValidationError(
                {
                    "detail": "Your account is suspended."
                }
            )

        if (
            user.account_status
            != User.AccountStatus.ACTIVE
        ):
            raise serializers.ValidationError(
                {
                    "detail": "Your account is not active."
                }
            )

        # Django-level safety check
        if not user.is_active:
            raise serializers.ValidationError(
                {
                    "detail": "Your account is disabled."
                }
            )

        attrs["user"] = user

        return attrs
    
class PasswordChangeSerializer(
    serializers.Serializer
):
    current_password = serializers.CharField(
        write_only=True,
    )

    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirm_new_password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    def validate(self, attrs):

        if (
            attrs["new_password"]
            != attrs["confirm_new_password"]
        ):
            raise serializers.ValidationError(
                {
                    "new_password": (
                        "New passwords do not match."
                    )
                }
            )

        return attrs


class PasswordResetRequestSerializer(
    serializers.Serializer
):
    email = serializers.EmailField()

    def validate_email(self, value):

        user = User.objects.filter(
            email=value
        ).first()

        if user:
            self.context["user"] = user

        return value



