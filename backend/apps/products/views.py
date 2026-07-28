from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import (
    SAFE_METHODS,
    AllowAny,
    IsAuthenticated,
)
from rest_framework.decorators import action
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter,
)
from django_filters.rest_framework import DjangoFilterBackend

from apps.accounts.permissions import IsEmailVerified
from apps.products.pagination import ProductPagination
from apps.products.permissions import IsProductManager
from apps.products.filters import ProductFilter
from apps.products.discovery_service import ProductDiscoveryService
from django.db.models import Prefetch

# Fixed Model Imports
from apps.products.models.product import (
    Category,
    Tag,
    Product,
)
from apps.products.models.productImage import ProductImage
from apps.products.models.attribute import (
    Attribute,
    AttributeValue,
    ProductAttributeValue,
)

# Fixed Serializer Imports
from apps.products.serializers import (
    CategorySerializer,
    ProductWriteSerializer,
    ProductReadSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    TagSerializer,
    ProductImageSerializer,
    AttributeSerializer,
    AttributeValueSerializer,
)


class CategoryViewSet(
    ModelViewSet
):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer
    permission_classes = [IsProductManager]
    filterset_fields = ['parent', 'is_active']
    
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsProductManager()]
    
    def get_queryset(self):
        """Filter categories to only show ones without a parent (root level) unless explicitly filtered"""
        queryset = Category.objects.all()
        
        # Check if parent filter is explicitly provided
        parent_param = self.request.query_params.get('parent')
        parent_isnull_param = self.request.query_params.get('parent__isnull')
        
        # If no parent filters are specified, only return root categories (parent is null)
        if parent_param is None and parent_isnull_param is None:
            queryset = queryset.filter(parent__isnull=True)
        
        return queryset


class TagViewSet(
    ModelViewSet
):

    queryset = Tag.objects.all()

    serializer_class = TagSerializer
    permission_classes = [IsProductManager]


class ProductViewSet(
    ModelViewSet
):

    lookup_field = "slug"

    queryset = (
        Product.objects
        .filter(
            is_active=True,
        )
        .prefetch_related(
            "categories",
            "tags",
            "images",
            "product_attribute_values__attribute_value__attribute",
            "variants__variant_attribute_values__attribute_value__attribute",
        )
    )
    pagination_class = (
        ProductPagination
    )

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = ProductFilter

    search_fields = [
        "name",
        "description",
        "categories__name",
        "tags__name",
    ]

    ordering_fields = [
        "name",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-created_at",
    ]

    def get_serializer_class(self):

        if self.action == "retrieve":
            return ProductDetailSerializer

        if self.action in [
            "list",
            "featured",
            "trending",
            "new_arrivals",
            "category_highlights",
            "similar",
        ]:
            return ProductListSerializer

        return ProductWriteSerializer

    def get_permissions(self):

        if self.request.method in SAFE_METHODS:
            return [
                AllowAny()
            ]

        return [
            IsAuthenticated(),

            IsProductManager(),
        ]

    @action(
        detail=False,
        methods=["get"],
        url_path="featured",
        permission_classes=[AllowAny],
    )
    def featured(self, request):
        """
        Get featured/highlighted products for homepage hero section.
        Available to all users (public).
        """
        products = (
            ProductDiscoveryService
            .get_featured_products(
                limit=12
            )
        )

        serializer = ProductListSerializer(
            products,
            many=True,
            context={"request": request},
        )

        return Response({
            "type": "featured",
            "count": len(products),
            "results": serializer.data,
        })

    @action(
        detail=False,
        methods=["get"],
        url_path="trending",
        permission_classes=[AllowAny],
    )
    def trending(self, request):
        """
        Get trending products based on recent activity and reviews.
        Available to all users (public).
        """
        products = (
            ProductDiscoveryService
            .get_trending_products(
                limit=12
            )
        )

        serializer = ProductListSerializer(
            products,
            many=True,
            context={"request": request},
        )

        return Response({
            "type": "trending",
            "count": len(products),
            "results": serializer.data,
        })

    @action(
        detail=False,
        methods=["get"],
        url_path="new-arrivals",
        permission_classes=[AllowAny],
    )
    def new_arrivals(self, request):
        """
        Get newest products added to marketplace.
        Available to all users (public).
        """
        products = (
            ProductDiscoveryService
            .get_new_arrivals(
                limit=12
            )
        )

        serializer = ProductListSerializer(
            products,
            many=True,
            context={"request": request},
        )

        return Response({
            "type": "new_arrivals",
            "count": len(products),
            "results": serializer.data,
        })

    @action(
        detail=False,
        methods=["get"],
        url_path="category-highlights",
        permission_classes=[AllowAny],
    )
    def category_highlights(self, request):
        """
        Get highlighted products from a specific category.
        Query param: category_id (required)
        Available to all users (public).
        """
        category_id = request.query_params.get(
            "category_id"
        )

        if not category_id:
            return Response(
                {
                    "detail": (
                        "category_id query parameter required"
                    )
                },
                status=(
                    status
                    .HTTP_400_BAD_REQUEST
                ),
            )

        products = (
            ProductDiscoveryService
            .get_category_highlights(
                category_id=category_id,
                limit=12,
            )
        )

        serializer = ProductListSerializer(
            products,
            many=True,
            context={"request": request},
        )

        return Response({
            "type": "category_highlights",
            "category_id": int(category_id),
            "count": len(products),
            "results": serializer.data,
        })

    @action(
        detail=True,
        methods=["get"],
        url_path="similar",
        permission_classes=[AllowAny],
    )
    def similar(self, request, pk=None):
        """
        Get products similar to this product.
        Based on shared categories and tags.
        Available to all users (public).
        """
        products = (
            ProductDiscoveryService
            .get_similar_products(
                product_id=pk,
                limit=8,
            )
        )

        serializer = ProductListSerializer(
            products,
            many=True,
            context={"request": request},
        )

        return Response({
            "type": "similar",
            "reference_product_id": int(pk),
            "count": len(products),
            "results": serializer.data,
        })


class ProductImageViewSet(ModelViewSet):

    queryset = ProductImage.objects.select_related("product")
    serializer_class = ProductImageSerializer
    permission_classes = [IsProductManager]


class AttributeViewSet(
    ModelViewSet
):

    queryset = (
        Attribute.objects
        .filter(
            is_active=True,
        )
        .prefetch_related(
            "attribute_values",
        )
    )

    serializer_class = (
        AttributeSerializer
    )
    permission_classes = [IsProductManager,]


class AttributeValueViewSet(
    ModelViewSet
):

    queryset = (
        AttributeValue.objects
        .filter(
            is_active=True,
        )
        .select_related(
            "attribute",
        )
    )

    serializer_class = (
        AttributeValueSerializer
    )
    permission_classes = [IsProductManager,]
