from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.inventory.models import Inventory, Warehouse
from apps.products.models import Category, Product, Tag


class Command(BaseCommand):
    help = "Load sample products into database"

    def handle(self, *args, **options):
        self.stdout.write("Loading sample data...\n")

        warehouse, created = Warehouse.objects.get_or_create(
            code="WH1",
            defaults={
                "name": "Main Warehouse",
                "address": "123 Main St",
                "city": "New York",
                "country": "USA",
                "is_active": True,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS("Created warehouse: Main Warehouse"))

        categories_data = [
            {
                "name": "Electronics",
                "slug": "electronics",
                "description": "Electronic devices and gadgets",
            },
            {
                "name": "Fashion",
                "slug": "fashion",
                "description": "Clothing and accessories",
            },
            {
                "name": "Home & Garden",
                "slug": "home-garden",
                "description": "Home and garden items",
            },
            {
                "name": "Crafts",
                "slug": "crafts",
                "description": "Handmade crafts and DIY items",
            },
            {
                "name": "Vintage",
                "slug": "vintage",
                "description": "Vintage and antique items",
            },
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data["name"],
                defaults={
                    "slug": cat_data["slug"],
                    "description": cat_data["description"],
                    "is_active": True,
                },
            )
            categories[cat_data["name"]] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created category: {category.name}"))

        tags_data = [
            {"name": "Sale", "slug": "sale"},
            {"name": "New", "slug": "new"},
            {"name": "Trending", "slug": "trending"},
            {"name": "Popular", "slug": "popular"},
        ]

        tags = {}
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(
                name=tag_data["name"],
                defaults={"slug": tag_data["slug"]},
            )
            tags[tag_data["name"]] = tag
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created tag: {tag.name}"))

        products_data = [
            {
                "name": "Wireless Headphones Pro",
                "sku": "WHP-BLACK-001",
                "price": "199.99",
                "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
                "category": "Electronics",
                "tags": ["Sale", "Trending"],
            },
            {
                "name": "4K USB-C Monitor",
                "sku": "MON-4K-001",
                "price": "599.99",
                "description": "32-inch 4K USB-C monitor perfect for professionals and creators",
                "category": "Electronics",
                "tags": ["New", "Trending"],
            },
            {
                "name": "Mechanical Keyboard RGB",
                "sku": "KB-RGB-001",
                "price": "149.99",
                "description": "Premium mechanical gaming keyboard with RGB backlighting",
                "category": "Electronics",
                "tags": ["Popular", "Trending"],
            },
            {
                "name": "Vintage Leather Jacket",
                "sku": "JACKET-M",
                "price": "89.99",
                "description": "Classic brown leather jacket perfect for any occasion",
                "category": "Fashion",
                "tags": ["Vintage", "Popular"],
            },
            {
                "name": "Cotton T-Shirt Collection",
                "sku": "TSHIRT-3PACK",
                "price": "34.99",
                "description": "Set of 3 comfortable 100% cotton t-shirts",
                "category": "Fashion",
                "tags": ["Sale", "New"],
            },
            {
                "name": "Handmade Ceramic Vase",
                "sku": "VASE-SMALL",
                "price": "45.00",
                "description": "Beautiful handmade ceramic vase with traditional patterns",
                "category": "Crafts",
                "tags": ["New", "Popular"],
            },
            {
                "name": "Wooden Coffee Table",
                "sku": "TABLE-WALNUT",
                "price": "249.99",
                "description": "Rustic wooden coffee table handcrafted from reclaimed wood",
                "category": "Home & Garden",
                "tags": ["Trending"],
            },
            {
                "name": "Vintage Camera",
                "sku": "CAM-70S-001",
                "price": "125.00",
                "description": "Classic film camera from the 1970s in excellent working condition",
                "category": "Vintage",
                "tags": ["Vintage", "Sale"],
            },
            {
                "name": "Smart Plant Watering System",
                "sku": "PLANT-SMART-001",
                "price": "79.99",
                "description": "IoT plant watering system with mobile app control",
                "category": "Home & Garden",
                "tags": ["New", "Trending"],
            },
            {
                "name": "Personalized Wood Photo Frame",
                "sku": "FRAME-4x6",
                "price": "24.99",
                "description": "Custom engraved wooden photo frame, perfect for gifts",
                "category": "Crafts",
                "tags": ["New", "Popular"],
            },
            {
                "name": "Organic Cotton Bedding Set",
                "sku": "BED-QUEEN",
                "price": "119.99",
                "description": "Premium organic cotton sheets and pillowcase set",
                "category": "Home & Garden",
                "tags": ["New"],
            },
            {
                "name": "Vintage Vinyl Record Player",
                "sku": "VINYL-PRO-001",
                "price": "189.99",
                "description": "Turntable for playing vinyl records with excellent sound quality",
                "category": "Vintage",
                "tags": ["Vintage", "Popular"],
            },
        ]

        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                sku=product_data["sku"],
                defaults={
                    "name": product_data["name"],
                    "description": product_data["description"],
                    "price": Decimal(product_data["price"]),
                    "currency": "USD",
                    "is_active": True,
                },
            )

            if created:
                product.categories.add(categories[product_data["category"]])
                for tag_name in product_data["tags"]:
                    product.tags.add(tags[tag_name])

                Inventory.objects.get_or_create(
                    warehouse=warehouse,
                    product=product,
                    defaults={"quantity": 100, "reserved_quantity": 0},
                )

                self.stdout.write(self.style.SUCCESS(f"Created product: {product.name}"))

        self.stdout.write(self.style.SUCCESS("\nSample products loaded successfully!"))
