from django.conf import settings
from django.db import models
from ..utils import generate_unique_slug
from cloudinary.models import CloudinaryField
class Category(models.Model):

    name = models.CharField(
        max_length=100,
    )

    slug = models.SlugField(
        max_length=120,
        unique=True,
    )

    description = models.TextField(
        blank=True,
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.PROTECT,
        related_name="children",
        null=True,
        blank=True,
    )
    image = CloudinaryField(
            "image",
            blank=True,
            null=True,
        )
    is_active = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["name"]
    def generate_unique_slug(self):
       
        self.slug = generate_unique_slug(self, self.name)    

    def __str__(self):
        return self.name