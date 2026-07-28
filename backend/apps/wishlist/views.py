from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.wishlist.models import (
    Wishlist,
    WishlistItem,
)
from apps.wishlist.serializers import (
    WishlistReadSerializer,
    WishlistItemSerializer,
    WishlistItemCreateSerializer,
)
from apps.wishlist.services import WishlistService


class WishlistViewSet(GenericViewSet):
    """
    Manage user wishlists.
    """

    permission_classes = [
        IsAuthenticated
    ]

    def get_wishlist(self):
        """Get or create wishlist for current user."""

        wishlist = (
            WishlistService
            .get_or_create_wishlist(
                self.request.user
            )
        )

        return (
            Wishlist.objects
            .prefetch_related("items__product")
            .filter(pk=wishlist.pk)
            .first()
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="",
    )
    def list(
        self,
        request,
        *args,
        **kwargs
    ):
        """Get user's wishlist."""

        wishlist = self.get_wishlist()

        serializer = WishlistReadSerializer(
            wishlist
        )

        return Response(
            serializer.data
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="add",
    )
    def add_item(
        self,
        request,
        *args,
        **kwargs
    ):
        """Add an item to wishlist."""

        serializer = (
            WishlistItemCreateSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        item = WishlistService.add_to_wishlist(
            user=request.user,
            product_id=serializer.validated_data["product_id"],
        )

        return Response(
            WishlistItemSerializer(
                item
            ).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path="remove",
    )
    def remove_item(
        self,
        request,
        pk=None,
        *args,
        **kwargs
    ):
        """Remove an item from wishlist."""

        try:
            item = WishlistItem.objects.get(
                id=pk,
                wishlist__user=request.user,
            )
        except WishlistItem.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Wishlist item "
                        "not found."
                    )
                },
                status=(
                    status
                    .HTTP_404_NOT_FOUND
                ),
            )

        WishlistService.remove_from_wishlist(
            user=request.user,
            wishlist_item_id=pk,
        )

        return Response(
            status=(
                status
                .HTTP_204_NO_CONTENT
            )
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="clear",
    )
    def clear_wishlist(
        self,
        request,
        *args,
        **kwargs
    ):
        """Clear all items from wishlist."""

        WishlistService.clear_wishlist(
            request.user
        )

        return Response(
            status=(
                status
                .HTTP_204_NO_CONTENT
            )
        )
