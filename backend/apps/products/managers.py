from django.db import models


class SoftDeleteQuerySet(models.QuerySet):

    def active(self):
        return self.filter(
            deleted_at__isnull=True,
        )

    def deleted(self):
        return self.filter(
            deleted_at__isnull=False,
        )

    def soft_delete(self):
        return self.update(
            deleted_at=models.functions.Now(),
            is_active=False,
        )

    def restore(self):
        return self.update(
            deleted_at=None,
            is_active=True,
        )


class SoftDeleteManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset().filter(
            deleted_at__isnull=True,
        )


class AllObjectsManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset()