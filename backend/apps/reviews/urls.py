from django.urls import path

from apps.reviews.views import ReviewViewSet


reviews_list = ReviewViewSet.as_view(
    {
        "get": "list",
    }
)


reviews_detail = ReviewViewSet.as_view(
    {
        "get": "retrieve",
    }
)


reviews_create = ReviewViewSet.as_view(
    {
        "post": "create_review",
    }
)


reviews_update = ReviewViewSet.as_view(
    {
        "put": "update_review",
    }
)


reviews_delete = ReviewViewSet.as_view(
    {
        "delete": "delete_review",
    }
)


reviews_approve = ReviewViewSet.as_view(
    {
        "post": "approve_review",
    }
)


reviews_reject = ReviewViewSet.as_view(
    {
        "post": "reject_review",
    }
)


reviews_vote = ReviewViewSet.as_view(
    {
        "post": "vote_on_review",
    }
)


urlpatterns = [

    path(
        "",
        reviews_list,
        name="reviews-list",
    ),

    path(
        "<int:pk>/",
        reviews_detail,
        name="reviews-detail",
    ),

    path(
        "create/",
        reviews_create,
        name="reviews-create",
    ),

    path(
        "<int:pk>/update/",
        reviews_update,
        name="reviews-update",
    ),

    path(
        "<int:pk>/delete/",
        reviews_delete,
        name="reviews-delete",
    ),

    path(
        "<int:pk>/approve/",
        reviews_approve,
        name="reviews-approve",
    ),

    path(
        "<int:pk>/reject/",
        reviews_reject,
        name="reviews-reject",
    ),

    path(
        "<int:pk>/vote/",
        reviews_vote,
        name="reviews-vote",
    ),
]
