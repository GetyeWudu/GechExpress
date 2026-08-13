from django.contrib.auth.tokens import (
    default_token_generator,
)
from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from .serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,

)
from .services import send_password_reset_email
from django.conf import settings


def build_auth_response(user):

    refresh = RefreshToken.for_user(user)

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "role": user.role,
            "account_status": user.account_status,
        },
        "tokens": {
            "access": str(
                refresh.access_token
            ),
            "refresh": str(refresh),
        },
    }


class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.save()

        return Response(
            build_auth_response(user),
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data,
            context={
                "request": request
            },
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data[
            "user"
        ]

        return Response(
            build_auth_response(user),
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        refresh_token = request.data.get(
            "refresh"
        )

        if not refresh_token:
            return Response(
                {
                    "detail": (
                        "Refresh token is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

        except Exception:
            return Response(
                {
                    "detail": (
                        "Invalid refresh token."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "detail": (
                    "Successfully logged out."
                )
            },
            status=status.HTTP_205_RESET_CONTENT,
        )


class PasswordChangeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        serializer = PasswordChangeSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = request.user

        current_password = (
            serializer.validated_data[
                "current_password"
            ]
        )

        new_password = (
            serializer.validated_data[
                "new_password"
            ]
        )

        confirm_new_password = (
            serializer.validated_data[
                "confirm_new_password"
            ]
        )

        if not user.check_password(
            current_password
        ):
            return Response(
                {
                    "current_password": (
                        "Current password is incorrect."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            new_password
            != confirm_new_password
        ):
            return Response(
                {
                    "new_password": (
                        "New passwords do not match."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save(
            update_fields=["password"]
        )

        return Response(
            {
                "detail": (
                    "Password changed successfully."
                )
            },
            status=status.HTTP_200_OK,
        )


class PasswordResetRequestView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = (
            PasswordResetRequestSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.context.get(
            "user"
        )

        if user:
            send_password_reset_email(
                user,
                request,
            )

        return Response(
            {
                "detail": (
                    "If an account exists, "
                    "a reset email has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )
