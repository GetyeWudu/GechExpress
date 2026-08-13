# from django import forms
# from django.contrib import admin
# from .models.ProductVariant import ProductVariant
# from .models.ProductImage import ProductImage,ProductVariant



# class ProductImageInline(admin.TabularInline):
#     model = ProductImage
#     extra = 1
#     fields = ("image", "alt_text", "is_primary", "display_order")


# class ProductAttributeValueInline(admin.TabularInline):
#     """
#     Product Attribute Configuration Pool.
    
#     Defines which attribute values are AVAILABLE for variants of this product.
#     Example: if you add "Size: S, M, L" and "Color: Black, Navy" here,
#     then variants can be created with any combination of these values.
    
#     The actual variant SKUs and their attribute assignments are managed
#     in ProductVariantAdmin > VariantAttributeValueInline.
#     """

#     model = ProductAttributeValue
#     extra = 1
#     autocomplete_fields = ("attribute_value",)
#     verbose_name = "Available attribute value"
#     verbose_name_plural = "Available attribute values (configuration pool)"
    
#     def formfield_for_foreignkey(self, db_field, request, **kwargs):
#         if db_field.name == "attribute_value":
#             kwargs["queryset"] = AttributeValue.objects.select_related("attribute").filter(
#                 is_active=True
#             )
#         return super().formfield_for_foreignkey(db_field, request, **kwargs)


# class VariantAttributeValueInline(admin.TabularInline):
#     """
#     Concrete Variant Attribute Assignment.
    
#     Assigns specific attribute values to this variant SKU.
#     Example: For variant SKU "TSHIRT-001-S-BLK", assign:
#       - Size: S (small)
#       - Color: Black
    
#     Each variant can have AT MOST one value per attribute type.
#     Values here MUST be in the parent product's attribute pool
#     (configured in ProductAdmin > Available attribute values).
#     """
    
#     model = VariantAttributeValue
#     extra = 1
#     autocomplete_fields = ("attribute_value",)
#     verbose_name = "Attribute assignment"
#     verbose_name_plural = "Attribute assignments (this variant's specific values)"


# class ProductVariantInline(admin.TabularInline):
#     """Display variants in a compact table format with attributes"""
#     model = ProductVariant
#     extra = 1
#     fields = ("sku", "price", "currency", "is_default", "is_active", "get_attributes")
#     readonly_fields = ("get_attributes",)
#     show_change_link = True

#     def get_attributes(self, obj):
#         """Display variant attributes"""
#         if not obj.pk:
#             return "—"
#         attrs = obj.variant_attribute_values.select_related(
#             "attribute_value__attribute"
#         )
#         if not attrs.exists():
#             return "No attributes"
#         return ", ".join(
#             f"{a.attribute_value.attribute.name}: {a.attribute_value.value}"
#             for a in attrs
#         )
#     get_attributes.short_description = "Attributes"


# @admin.register(Category)
# class CategoryAdmin(admin.ModelAdmin):
#     list_display = ("id", "name", "parent", "is_active")
#     search_fields = ("name",)
#     prepopulated_fields = {"slug": ("name",)}


# @admin.register(Tag)
# class TagAdmin(admin.ModelAdmin):
#     list_display = ("id", "name", "is_active")
#     search_fields = ("name",)
#     prepopulated_fields = {"slug": ("name",)}


# @admin.register(Product)
# class ProductAdmin(admin.ModelAdmin):
#     list_display = (
#         "name",
#         "price",
#         "currency",
#         "shop_name",
#         "is_active",
#         "is_deleted",
#         "created_at",
#     )
#     search_fields = ("name", "slug", "shop_name")
#     list_filter = ("is_active", "is_deleted", "categories", "tags", "currency")
#     filter_horizontal = ("categories", "tags")
#     prepopulated_fields = {"slug": ("name",)}
#     inlines = [
#         ProductImageInline,
#         ProductAttributeValueInline,  # Configure available attributes for variants
#         ProductVariantInline,  # Create concrete variants
#     ]
#     readonly_fields = ("price",)
    
#     fieldsets = (
#         ("Basic Information", {
#             "fields": ("name", "slug", "description", "shop_name")
#         }),
#         ("Pricing", {
#             "fields": ("price", "currency"),
#             "description": "Price is auto-synced from active variant prices. Edit variants to change pricing."
#         }),
#         ("Organization", {
#             "fields": ("categories", "tags")
#         }),
#         ("Status", {
#             "fields": ("is_active", "is_deleted"),
#             "classes": ("collapse",)
#         }),
#     )


# @admin.register(ProductVariant)
# class ProductVariantAdmin(admin.ModelAdmin):
#     """
#     Manage sellable product variants (distinct SKUs).
    
#     Each variant is a unique SKU with its own:
#     - Price (used during checkout, not the product display price)
#     - Inventory (tracked separately per variant)
#     - Attributes (size, color, etc.)
    
#     Attributes assigned here MUST be from the parent product's
#     configuration pool (defined in ProductAdmin).
    
#     Note: Attribute assignments can only be added AFTER creating the variant.
#     """
    
#     list_display = (
#         "sku",
#         "product",
#         "price",
#         "currency",
#         "is_default",
#         "is_active",
#         "is_deleted",
#     )
#     list_filter = ("is_active", "is_default", "is_deleted", "currency", "product")
#     search_fields = ("sku", "product__name")
#     autocomplete_fields = ("product",)
    
#     fieldsets = (
#         ("Variant Information", {
#             "fields": ("product", "sku", "is_default")
#         }),
#         ("Pricing", {
#             "fields": ("price", "currency"),
#             "description": "This variant's actual price (used at checkout)"
#         }),
#         ("Status", {
#             "fields": ("is_active", "is_deleted"),
#             "classes": ("collapse",)
#         }),
#     )
    
#     def get_inlines(self, request, obj):
#         """Only show attribute inline when editing existing variant"""
#         if obj is None:  # Adding new variant
#             return []
#         return [VariantAttributeValueInline]


# @admin.register(Attribute)
# class AttributeAdmin(admin.ModelAdmin):
#     list_display = ("name", "slug", "is_active")
#     search_fields = ("name",)
#     prepopulated_fields = {"slug": ("name",)}


# @admin.register(AttributeValue)
# class AttributeValueAdmin(admin.ModelAdmin):
#     list_display = ("attribute", "value", "is_active")
#     list_filter = ("attribute", "is_active")
#     search_fields = ("value", "attribute__name")
#     autocomplete_fields = ("attribute",)


# @admin.register(ProductAttribute)
# class ProductAttributeAdmin(admin.ModelAdmin):
#     list_display = ("product", "attribute")
#     list_filter = ("attribute",)
#     search_fields = ("product__name", "attribute__name")
#     autocomplete_fields = ("product", "attribute")
    
#     fieldsets = (
#         ("Attribute Declaration", {
#             "fields": ("product", "attribute"),
#             "description": "Declares that this product has variants with this attribute type (e.g., Size, Color)."
#         }),
#     )


# @admin.register(ProductAttributeValue)
# class ProductAttributeValueAdmin(admin.ModelAdmin):
#     list_display = ("product", "get_attribute", "attribute_value", "get_attribute_name")
#     list_filter = ("attribute_value__attribute",)
#     search_fields = ("product__name", "attribute_value__value", "attribute_value__attribute__name")
#     autocomplete_fields = ("product", "attribute_value")
    
#     fieldsets = (
#         ("Configuration Pool", {
#             "fields": ("product", "attribute_value"),
#             "description": (
#                 "Add available attribute values for variants of this product. "
#                 "Example: Add 'Size: S', 'Size: M', 'Size: L' to allow S/M/L variants. "
#                 "Actual variant assignments are managed in ProductVariantAdmin."
#             )
#         }),
#     )

#     @admin.display(description="Attribute Type")
#     def get_attribute(self, obj):
#         return obj.attribute_value.attribute.name
    
#     @admin.display(description="Value")
#     def get_attribute_name(self, obj):
#         return obj.attribute_value.value


# @admin.register(ProductImage)
# class ProductImageAdmin(admin.ModelAdmin):
#     list_display = ("product", "is_primary", "display_order", "created_at")
#     list_filter = ("is_primary",)
