from django.contrib import admin
from .models import TouristProfile, EmergencyContact


class EmergencyContactInline(admin.TabularInline):
    model = EmergencyContact
    extra = 1


@admin.register(TouristProfile)
class TouristProfileAdmin(admin.ModelAdmin):
    list_display = ('digital_id', 'full_name', 'email', 'phone', 'nationality', 'verification_status', 'safety_status', 'created_at')
    list_filter = ('verification_status', 'safety_status', 'nationality', 'created_at')
    search_fields = ('digital_id', 'full_name', 'email', 'phone')
    ordering = ('-created_at',)
    inlines = [EmergencyContactInline]
    readonly_fields = ('digital_id', 'created_at', 'updated_at')


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'relationship', 'phone', 'email', 'tourist', 'is_primary', 'created_at')
    list_filter = ('is_primary', 'relationship', 'created_at')
    search_fields = ('name', 'phone', 'email', 'tourist__full_name', 'tourist__digital_id')
