# from django.urls import path

# from apps.wishlist.views import WishlistViewSet


# wishlist_list = WishlistViewSet.as_view(
#     {
#         "get": "list",
#     }
# )


# wishlist_add = WishlistViewSet.as_view(
#     {
#         "post": "add_item",
#     }
# )


# wishlist_remove = WishlistViewSet.as_view(
#     {
#         "delete": "remove_item",
#     }
# )


# wishlist_clear = WishlistViewSet.as_view(
#     {
#         "post": "clear_wishlist",
#     }
# )


# urlpatterns = [

#     path(
#         "",
#         wishlist_list,
#         name="wishlist-list",
#     ),

#     path(
#         "add/",
#         wishlist_add,
#         name="wishlist-add",
#     ),

#     path(
#         "<int:pk>/remove/",
#         wishlist_remove,
#         name="wishlist-remove",
#     ),

#     path(
#         "clear/",
#         wishlist_clear,
#         name="wishlist-clear",
#     ),
# ]
