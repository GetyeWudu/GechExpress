from django.urls import path

from apps.payments.views import PaymentViewSet


payment_list_view = PaymentViewSet.as_view(
    {
        "get": "list",
    }
)


payment_detail_view = PaymentViewSet.as_view(
    {
        "get": "retrieve",
    }
)


payment_initialize_view = PaymentViewSet.as_view(
    {
        "post": "initialize",
    }
)


payment_callback_view = PaymentViewSet.as_view(
    {
        "post": "callback",
    }
)


payment_refund_view = PaymentViewSet.as_view(
    {
        "post": "refund",
    }
)


urlpatterns = [

    path(
        "",
        payment_list_view,
        name="payment-list",
    ),

    path(
        "<int:pk>/",
        payment_detail_view,
        name="payment-detail",
    ),

    path(
        "initialize/",
        payment_initialize_view,
        name="payment-initialize",
    ),

    path(
        "callback/",
        payment_callback_view,
        name="payment-callback",
    ),

    path(
        "<int:pk>/refund/",
        payment_refund_view,
        name="payment-refund",
    ),
]
