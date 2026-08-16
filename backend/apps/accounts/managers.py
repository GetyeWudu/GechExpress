from django.contrib.auth.base_user import BaseUserManager
from django.db import transaction
from django.conf import settings
User = settings.AUTH_USER_MODEL


class UserManager(BaseUserManager):

    def create_user(
        self,
        email,
        password=None,
        **extra_fields,
    ):
        if not email:
            raise ValueError(
                "The Email field must be set."
            )

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields,
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email,
        password=None,
        **extra_fields,
    ):
        extra_fields.setdefault(
            "is_staff",
            True,
        )

        extra_fields.setdefault(
            "is_superuser",
            True,
        )

        extra_fields.setdefault(
            "role",
            "ADMIN",
        )

        extra_fields.setdefault(
            "account_status",
            "ACTIVE",
        )

        if extra_fields.get("is_staff") is not True:
            raise ValueError(
                "Superuser must have is_staff=True."
            )

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(
                "Superuser must have is_superuser=True."
            )

        if extra_fields.get("role") != "ADMIN":
            raise ValueError(
                "Superuser must have role=ADMIN."
            )

        return self.create_user(
            email,
            password,
            **extra_fields,
        )





class UserManagementService:

    @staticmethod
    @transaction.atomic
    def create_seller(
        *,
        email,
        password,
        first_name="",
        last_name="",
        phone_number=None,
    ):
        if User.objects.filter(
            email=email
        ).exists():
            raise ValueError(
                "A user with this email already exists."
            )

        seller = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            role=User.Role.SELLER,
            account_status=(
                User.AccountStatus.ACTIVE
            ),
        )

        return seller