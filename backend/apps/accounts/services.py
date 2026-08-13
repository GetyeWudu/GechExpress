from django.contrib.auth.tokens import (
    default_token_generator,
)
from django.core.mail import send_mail
from django.db import transaction
from django.urls import reverse
from django.conf import settings
from django.db import transaction

from .models import User
from django.conf import settings

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from .models import User


def send_password_reset_email(user, request):

    token = default_token_generator.make_token(
        user
    )

    uid = user.pk

    reset_url = (
        f"http://localhost:5173/reset-password/"
        f"{uid}/{token}/"
    )

    send_mail(
        subject="Reset your password",
        message=(
            "Click the following link "
            f"to reset your password:\n\n"
            f"{reset_url}"
        ),
        from_email=None,
        recipient_list=[user.email],
    )




class UserManagementService:

    @staticmethod
    @transaction.atomic
    def change_role(
        *,
        admin_user,
        target_user,
        new_role,
    ):

        if admin_user == target_user:
            raise ValueError(
                "You cannot change your own role."
            )

        if (
            target_user.role == User.Role.ADMIN
            and new_role != User.Role.ADMIN
        ):

            active_admins = (
                User.objects
                .select_for_update()
                .filter(
                    role=User.Role.ADMIN,
                    account_status=(
                        User.AccountStatus.ACTIVE
                    ),
                    is_active=True,
                )
                .count()
            )

            if active_admins <= 1:
                raise ValueError(
                    "The last active administrator "
                    "cannot be demoted."
                )

        target_user.role = new_role

        target_user.save(
            update_fields=[
                "role",
                "updated_at",
            ]
        )

        return target_user

    @staticmethod
    @transaction.atomic
    def change_status(
        *,
        admin_user,
        target_user,
        new_status,
    ):

        if admin_user == target_user:
            raise ValueError(
                "You cannot change your own status."
            )

        if (
            target_user.role == User.Role.ADMIN
            and new_status
            != User.AccountStatus.ACTIVE
        ):

            active_admins = (
                User.objects
                .select_for_update()
                .filter(
                    role=User.Role.ADMIN,
                    account_status=(
                        User.AccountStatus.ACTIVE
                    ),
                    is_active=True,
                )
                .count()
            )

            if active_admins <= 1:
                raise ValueError(
                    "The last active administrator "
                    "cannot be deactivated or suspended."
                )

        target_user.account_status = new_status

        target_user.is_active = (
            new_status
            == User.AccountStatus.ACTIVE
        )

        target_user.save(
            update_fields=[
                "account_status",
                "is_active",
                "updated_at",
            ]
        )

        return target_user


class GoogleAuthenticationError(Exception):
    """Base Google authentication error."""


class GoogleEmailConflictError(
    GoogleAuthenticationError
):
    """Google email already belongs to another account."""


def authenticate_with_google(credential):

    try:
        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

    except ValueError as exc:
        raise GoogleAuthenticationError(
            "Invalid Google credential."
        ) from exc

    google_sub = google_user.get("sub")
    email = google_user.get("email")

    if not google_sub or not email:
        raise GoogleAuthenticationError(
            "Google account information is incomplete."
        )

    user = User.objects.filter(
        google_sub=google_sub
    ).first()

    if not user:

        existing_user = User.objects.filter(
            email=email
        ).first()

        if existing_user:
            raise GoogleEmailConflictError(
                "An account already exists with this email. "
                "Sign in with your existing account before "
                "linking Google."
            )

        user = User.objects.create_user(
            email=email,
            first_name=google_user.get(
                "given_name",
                "",
            ),
            last_name=google_user.get(
                "family_name",
                "",
            ),
            google_sub=google_sub,
            role=User.Role.CUSTOMER,
            account_status=(
                User.AccountStatus.ACTIVE
            ),
        )

    return user