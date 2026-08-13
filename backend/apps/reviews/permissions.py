from rest_framework.permissions import BasePermission


class IsReviewOwner(BasePermission):
    """
    Allow only the review author to edit/delete.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return (
            request.user.is_authenticated
            and obj.user == request.user
        )


class IsReviewModerator(BasePermission):
    """
    Allow staff to moderate reviews.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role
            == request.user.Role.STAFF
        )
