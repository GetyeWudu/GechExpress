from rest_framework.permissions import BasePermission


class IsWishlistOwner(BasePermission):
    """
    Allow only the wishlist owner to access.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return (
            request.user.is_authenticated
            and obj.wishlist.user == request.user
        )
