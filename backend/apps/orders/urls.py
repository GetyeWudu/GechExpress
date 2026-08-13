from django.urls import path

from apps.orders.views import OrderViewSet


order_list_view = OrderViewSet.as_view(
    {
        "get": "list",
        "post": "create",
    }
)


order_detail_view = OrderViewSet.as_view(
    {
        "get": "retrieve",
    }
)


urlpatterns = [

    path(
        "",
        order_list_view,
        name="order-list",
    ),

    path(
        "<int:pk>/",
        order_detail_view,
        name="order-detail",
    ),
]