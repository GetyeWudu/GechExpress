# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from rest_framework.viewsets import GenericViewSet, ModelViewSet
# from rest_framework.decorators import action

# from apps.carts.models import Cart, CartItem
# from apps.carts.serializers import (
#     CartReadSerializer,
#     CartItemReadSerializer,
#     CartItemCreateSerializer,
#     CartItemUpdateSerializer,
# )


# class CartViewSet(GenericViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = CartReadSerializer

#     def get_queryset(self):
#         return Cart.objects.filter(
#             user=self.request.user
#         ).prefetch_related(
#             "items__product_variant__product",
#             "items__product_variant__variant_attribute_values__attribute_value__attribute",
#         )

#     def get_object(self):
#         cart, _ = Cart.objects.get_or_create(
#             user=self.request.user
#         )
#         return (
#             self.get_queryset()
#             .filter(pk=cart.pk)
#             .first()
#         )

#     def list(self, request, *args, **kwargs):
#         serializer = self.get_serializer(
#             self.get_object()
#         )
#         return Response(serializer.data)

#     @action(
#         detail=False,
#         methods=["post"],
#         url_path="clear",
#     )
#     def clear(self, request, *args, **kwargs):
#         cart = self.get_object()
#         cart.items.all().delete()
#         return Response(
#             status=status.HTTP_204_NO_CONTENT
#         )


# class CartItemViewSet(ModelViewSet):
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return (
#             CartItem.objects.filter(
#                 cart__user=self.request.user
#             )
#             .select_related("cart", "product_variant__product")
#             .prefetch_related(
#                 "product_variant__variant_attribute_values__attribute_value__attribute"
#             )
#             .order_by("id")
#         )

#     def get_serializer_class(self):
#         if self.action in ["list", "retrieve"]:
#             return CartItemReadSerializer
#         if self.action == "create":
#             return CartItemCreateSerializer
#         return CartItemUpdateSerializer

#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         cart, _ = Cart.objects.get_or_create(
#             user=self.request.user
#         )
#         context["cart"] = cart
#         return context

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         cart_item = serializer.save()

#         read_serializer = CartItemReadSerializer(
#             cart_item,
#             context={"request": request},
#         )
#         return Response(read_serializer.data, status=status.HTTP_201_CREATED)
