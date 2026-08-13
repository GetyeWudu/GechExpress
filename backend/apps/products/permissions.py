from rest_framework.permissions import (
    BasePermission,
    SAFE_METHODS,
)


class HasModelPermission(
    BasePermission
):

    permission_map = {}

    app_label = ""

    model_name = ""

    def has_permission(
        self,
        request,
        view,
    ):

        if request.method in SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            return False

        action = self.permission_map.get(
            request.method
        )

        if not action:
            return False

        permission = (
            f"{self.app_label}."
            f"{action}_{self.model_name}"
        )

        return request.user.has_perm(
            permission
        )


class IsProductManager(
    BasePermission
):
    """
    Allow product management for:
    - MANAGER role users
    - STAFF role users
    - Superusers
    - Any authenticated user (for development/testing)
    """

    def has_permission(self, request, view):
        # Allow safe methods (GET, HEAD, OPTIONS) for all authenticated users
        if request.method in SAFE_METHODS:
            return True

        # Require authentication for write operations
        if not request.user or not request.user.is_authenticated:
            return False

        # Allow if user is superuser
        if request.user.is_superuser:
            return True

        # Allow if user has MANAGER or STAFF role
        user_role = getattr(request.user, 'role', None)
        allowed_roles = ['MANAGER', 'STAFF']
        
        if user_role in allowed_roles:
            return True

        # For development: allow authenticated users to create products
        # In production, comment this line and enforce role-based access
        return True


