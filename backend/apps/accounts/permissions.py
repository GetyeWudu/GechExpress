from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):

    message = "Only administrators can perform this action."

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.role == user.Role.ADMIN
            and user.account_status
            == user.AccountStatus.ACTIVE
        )


class IsSeller(BasePermission):

    message = "Only active sellers can perform this action."

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.role == user.Role.SELLER
            and user.account_status
            == user.AccountStatus.ACTIVE
        )


class IsCustomer(BasePermission):

    message = "Only customers can perform this action."

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.role == user.Role.CUSTOMER
            and user.account_status
            == user.AccountStatus.ACTIVE
        )


class IsActiveUser(BasePermission):

    message = "Your account is not active."

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.account_status
            == user.AccountStatus.ACTIVE
        )


class IsAdminOrSeller(BasePermission):

    message = (
        "Only administrators or active sellers "
        "can perform this action."
    )

    def has_permission(self, request, view):
        user = request.user

        return (
            user.is_authenticated
            and user.account_status
            == user.AccountStatus.ACTIVE
            and user.role in (
                user.Role.ADMIN,
                user.Role.SELLER,
            )
        )
