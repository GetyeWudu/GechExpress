from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):

    list_display = (
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "role",
        "account_status",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "role",
        "account_status",
        "is_staff",
        "is_active",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
        "phone_number",
    )

    ordering = (
        "email",
    )
