from django.urls import path

# from apps.shipping.views import (
#     ShippingMethodViewSet,
#     ShipmentViewSet,
# )


# shipping_methods_list = (
#     ShippingMethodViewSet.as_view(
#         {
#             "get": "list",
#         }
#     )
# )


# shipping_methods_detail = (
#     ShippingMethodViewSet.as_view(
#         {
#             "get": "retrieve",
#         }
#     )
# )


# shipments_list = ShipmentViewSet.as_view(
#     {
#         "get": "list",
#     }
# )


# shipments_detail = ShipmentViewSet.as_view(
#     {
#         "get": "retrieve",
#     }
# )


# shipments_create = ShipmentViewSet.as_view(
#     {
#         "post": "create_shipment",
#     }
# )


# shipments_update_status = (
#     ShipmentViewSet.as_view(
#         {
#             "post": "update_status",
#         }
#     )
# )


# shipments_cancel = ShipmentViewSet.as_view(
#     {
#         "post": "cancel_shipment",
#     }
# )


# urlpatterns = [

#     path(
#         "methods/",
#         shipping_methods_list,
#         name="shipping-methods-list",
#     ),

#     path(
#         "methods/<int:pk>/",
#         shipping_methods_detail,
#         name="shipping-methods-detail",
#     ),

#     path(
#         "shipments/",
#         shipments_list,
#         name="shipments-list",
#     ),

#     path(
#         "shipments/<int:pk>/",
#         shipments_detail,
#         name="shipments-detail",
#     ),

#     path(
#         "shipments/create/",
#         shipments_create,
#         name="shipments-create",
#     ),

#     path(
#         "shipments/<int:pk>/update-status/",
#         shipments_update_status,
#         name="shipments-update-status",
#     ),

#     path(
#         "shipments/<int:pk>/cancel/",
#         shipments_cancel,
#         name="shipments-cancel",
#     ),
# ]
