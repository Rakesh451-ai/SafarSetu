from django.contrib import admin
from .models import VerifiedService


@admin.register(VerifiedService)
class VerifiedServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'service_type', 'provider', 'location', 'price', 'rating', 'is_verified', 'created_at')
    list_filter = ('service_type', 'is_verified', 'location')
    search_fields = ('title', 'provider', 'location', 'license_number')
    ordering = ('-rating', 'title')
