from rest_framework.routers import DefaultRouter
from ..views.category_views import AdminCategoryViewSet
from ..views.attribute_views import (
    AdminAttributeViewSet,
    AdminAttributeValueViewSet,
)
from ..views.category_attribute_views import AdminCategoryAttributeViewSet  
from ..views.category_attribute_value_views import AdminCategoryAttributeValueViewSet 


router = DefaultRouter()
router.register(
    "categories",
    AdminCategoryViewSet,
    basename="admin-categories",
)
router.register(
    "attributes",
    AdminAttributeViewSet,
    basename="admin-attributes",
)
router.register(
    "attribute-values",
    AdminAttributeValueViewSet,
    basename="admin-attribute-values",
)
router.register(
    "category-attributes",
    AdminCategoryAttributeViewSet,
    basename="admin-category-attributes",
)
router.register(
    "category-attribute-values",  
    AdminCategoryAttributeValueViewSet,
    basename="admin-category-attribute-values",
)
          
# ✅ Direct assignment
urlpatterns = router.urls