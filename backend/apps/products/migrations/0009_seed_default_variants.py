from decimal import Decimal

from django.db import migrations


def seed_default_variants(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductVariant = apps.get_model("products", "ProductVariant")
    ProductAttributeValue = apps.get_model("products", "ProductAttributeValue")
    VariantAttributeValue = apps.get_model("products", "VariantAttributeValue")
    Inventory = apps.get_model("inventory", "Inventory")

    for product in Product.objects.all():
        if ProductVariant.objects.filter(product_id=product.id, is_deleted=False).exists():
            continue

        sku = product.sku or f"PROD-{product.id}"
        # Ensure unique SKU if product.sku already used somehow
        if ProductVariant.objects.filter(sku=sku).exists():
            sku = f"{sku}-V{product.id}"

        variant = ProductVariant.objects.create(
            product_id=product.id,
            sku=sku,
            price=product.price or Decimal("0.00"),
            currency=product.currency or "ETB",
            is_default=True,
            is_active=True,
        )

        # Attach attribute values only when each attribute has exactly one option
        # (safe single-SKU mapping). Multi-option pools stay as catalog options.
        assignments = list(
            ProductAttributeValue.objects.filter(product_id=product.id).select_related(
                "attribute_value"
            )
        )
        by_attribute = {}
        for assignment in assignments:
            attribute_id = assignment.attribute_value.attribute_id
            by_attribute.setdefault(attribute_id, []).append(assignment)

        if by_attribute and all(len(items) == 1 for items in by_attribute.values()):
            for items in by_attribute.values():
                VariantAttributeValue.objects.create(
                    variant_id=variant.id,
                    attribute_value_id=items[0].attribute_value_id,
                )

        Inventory.objects.filter(
            product_id=product.id,
            product_variant__isnull=True,
            is_deleted=False,
        ).update(product_variant_id=variant.id)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("inventory", "0003_restore_product_variant"),
        ("products", "0008_restore_product_variant"),
    ]

    operations = [
        migrations.RunPython(seed_default_variants, noop_reverse),
    ]
