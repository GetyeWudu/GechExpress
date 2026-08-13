from django.db import transaction
from django.utils import timezone


class ProductService:

    @staticmethod
    @transaction.atomic
    def soft_delete_product(
        *,
        product,
        deleted_by,
    ):

        if product.deleted_at is not None:
            raise ValueError(
                "Product is already deleted."
            )

        product.deleted_at = timezone.now()
        product.deleted_by = deleted_by
        product.is_active = False

        product.save(
            update_fields=[
                "deleted_at",
                "deleted_by",
                "is_active",
                "updated_at",
            ]
        )

        return product

    @staticmethod
    @transaction.atomic
    def restore_product(
        *,
        product,
    ):

        if product.deleted_at is None:
            raise ValueError(
                "Product is not deleted."
            )

        product.deleted_at = None
        product.deleted_by = None
        product.is_active = True

        product.save(
            update_fields=[
                "deleted_at",
                "deleted_by",
                "is_active",
                "updated_at",
            ]
        )

        return product
