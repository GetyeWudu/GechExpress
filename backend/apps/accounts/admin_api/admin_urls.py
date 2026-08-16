from rest_framework.routers import DefaultRouter

from .admin_views import (
    AdminSellerViewSet,
    AdminCustomerViewSet,
)

router = DefaultRouter()

router.register(
    "sellers",
    AdminSellerViewSet,
    basename="admin-sellers",
)

router.register(
    "users",
    AdminCustomerViewSet,
    basename="admin-customers",
)

urlpatterns = router.urls