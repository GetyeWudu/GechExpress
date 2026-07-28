from rest_framework.permissions import BasePermission


class IsShippingStaff(BasePermission):
    """
    Allow only staff members to manage shipping.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role
            == request.user.Role.STAFF
        )


class IsOrderOwner(BasePermission):
    """
    Allow order owner to view their own shipment.
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


class IsShippingStaffOrOrderOwner(BasePermission):
    """
    Allow staff to manage,
    customers to view their own shipments.
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
