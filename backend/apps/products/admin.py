from django import forms
from django.contrib import admin

from .models import (
    Attribute,
    AttributeValue,
    Category,
    Product,
    ProductAttribute,
    ProductAttributeValue,
    ProductImage,
    ProductVariant,
    Tag,
    VariantAttributeValue,
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_text", "is_primary", "display_order")


class ProductAttributeValueInline(admin.TabularInline):
    """Option pool: multiple Colors / Sizes allowed on one product."""

    model = ProductAttributeValue
    extra = 1
    autocomplete_fields = ("attribute_value",)
    verbose_name = "Available option"
    verbose_name_plural = "Available options (Size/Color pool)"


class VariantAttributeValueInline(admin.TabularInline):
    model = VariantAttributeValue
    extra = 1
    autocomplete_fields = ("attribute_value",)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "attribute_value":
            product_id = getattr(request, "_variant_parent_product_id", None)
            if product_id:
                allowed_ids = ProductAttributeValue.objects.filter(
                    product_id=product_id,
                ).values_list("attribute_value_id", flat=True)
                kwargs["queryset"] = AttributeValue.objects.filter(
                    id__in=allowed_ids,
                    is_active=True,
                ).select_related("attribute")
            else:
                kwargs["queryset"] = AttributeValue.objects.filter(is_active=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class ProductVariantInlineForm(forms.ModelForm):
    class Meta:
        model = ProductVariant
        fields = (
            "sku",
            "price",
            "currency",
            "is_default",
            "is_active",
        )


class ProductVariantInline(admin.StackedInline):
    model = ProductVariant
    form = ProductVariantInlineForm
    extra = 0
    show_change_link = True
    fields = ("sku", "price", "currency", "is_default", "is_active")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "parent", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "sku",
        "price",
        "currency",
        "shop_name",
        "is_active",
        "is_deleted",
        "created_at",
    )
    search_fields = ("name", "slug", "sku", "shop_name")
    list_filter = ("is_active", "is_deleted", "categories", "tags", "currency")
    filter_horizontal = ("categories", "tags")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [
        ProductImageInline,
        ProductAttributeValueInline,
        ProductVariantInline,
    ]


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "sku",
        "product",
        "price",
        "currency",
        "is_default",
        "is_active",
        "is_deleted",
    )
    list_filter = ("is_active", "is_default", "is_deleted", "currency")
    search_fields = ("sku", "product__name")
    autocomplete_fields = ("product",)
    inlines = [VariantAttributeValueInline]

    def get_form(self, request, obj=None, **kwargs):
        if obj is not None:
            request._variant_parent_product_id = obj.product_id
        elif request.method == "GET":
            product_id = request.GET.get("product")
            if product_id:
                request._variant_parent_product_id = product_id
        return super().get_form(request, obj, **kwargs)

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "attribute_values":
            product_id = getattr(request, "_variant_parent_product_id", None)
            if product_id:
                allowed_ids = ProductAttributeValue.objects.filter(
                    product_id=product_id,
                ).values_list("attribute_value_id", flat=True)
                kwargs["queryset"] = AttributeValue.objects.filter(
                    id__in=allowed_ids,
                    is_active=True,
                )
        return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ("attribute", "value", "is_active")
    list_filter = ("attribute", "is_active")
    search_fields = ("value", "attribute__name")
    autocomplete_fields = ("attribute",)


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ("product", "attribute")
    search_fields = ("product__name", "attribute__name")


@admin.register(ProductAttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = ("product", "get_attribute", "attribute_value")
    list_filter = ("attribute_value__attribute",)
    search_fields = ("product__name", "attribute_value__value")
    autocomplete_fields = ("product", "attribute_value")

    @admin.display(description="Attribute")
    def get_attribute(self, obj):
        return obj.attribute_value.attribute.name


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "is_primary", "display_order", "created_at")
    list_filter = ("is_primary",)
