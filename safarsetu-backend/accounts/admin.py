from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'role', 'preferred_language', 'is_staff', 'is_active')
    list_filter = ('role', 'preferred_language', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'phone', 'preferred_language')}),
        ('Permissions & Role', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'role', 'first_name', 'last_name', 'phone', 'preferred_language'),
        }),
    )
