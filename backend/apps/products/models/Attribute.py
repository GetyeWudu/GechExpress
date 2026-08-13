from django.db import models

from apps.products.utils import generate_unique_slug

class Attribute(models.Model):

    name = models.CharField(max_length=100,unique=True,)
    slug = models.SlugField( max_length=120,unique=True,)
    created_at = models.DateTimeField(auto_now_add=True,)
    updated_at = models.DateTimeField(   auto_now=True,)

    class Meta:
        ordering = ["name"]
    def save(self, *args, **kwargs):
            if not self.slug:
                self.slug = generate_unique_slug(self, self.name)
            super().save(*args, **kwargs)  

    def __str__(self):
        return self.name

class AttributeValue(models.Model):

    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.CASCADE,
        related_name="values",
    )

    value = models.CharField(
        max_length=100,
    )

    slug = models.SlugField(
        max_length=120,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["value"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "attribute",
                    "value",
                ],
                name="unique_attribute_value",
            ),
        ]
    def save(self, *args, **kwargs):
                if not self.slug:
                    self.slug = generate_unique_slug(self, self.value)
                super().save(*args, **kwargs)  
    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


