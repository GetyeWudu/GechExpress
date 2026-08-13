from rest_framework.permissions import BasePermission



class IsPaymentOwner(BasePermission):
    """
    Allow users to view/access only their own order's payment.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return (
            request.user.is_authenticated
            and obj.order.user == request.user
        )


class IsPaymentStaffOrOwner(BasePermission):
    """
    Allow payment staff or order owner to access payment.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return (
            request.user.is_authenticated
            and (
                obj.order.user == request.user
                or (
                    request.user.role
                    == request.user.Role.STAFF
                )
            )
        )
