from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/token/refresh/",
         TokenRefreshView.as_view(), name="token_refresh",),

    path("api/v1/auth/", include("apps.accounts.urls")),
    # path("api/v1/catalog/", include("apps.products.urls")),
    # path("api/v1/inventory/", include("apps.inventory.urls")),
    # path("api/v1/cart/", include("apps.carts.urls")),
    # path("api/v1/orders/", include("apps.orders.urls")),
    # path("api/v1/payments/", include("apps.payments.urls")),
    # path("api/v1/shipping/", include("apps.shipping.urls")),
    # path("api/v1/reviews/", include("apps.reviews.urls")),
    # path("api/v1/wishlist/", include("apps.wishlist.urls")),
    path("api/v1/admin/catalog/", include("apps.products.admin_api.admin_urls"),),
    path("api/v1/admin/", include("apps.accounts.admin_api.admin_urls"),),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
