from django.contrib import admin

from .models import DigitalID, EmergencyContact, Tourist, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "phone_number", "is_verified", "created_at")
    list_filter = ("role", "is_verified")
    search_fields = ("user__username", "user__email", "phone_number")


class EmergencyContactInline(admin.TabularInline):
    model = EmergencyContact
    extra = 0


class DigitalIDInline(admin.StackedInline):
    model = DigitalID
    extra = 0
    readonly_fields = (
        "id_token",
        "issued_at",
        "expires_at",
        "qr_payload_signed",
        "qr_image_base64",
    )


@admin.register(Tourist)
class TouristAdmin(admin.ModelAdmin):
    list_display = (
        "tourist_id",
        "name",
        "nationality",
        "phone",
        "id_proof_type",
        "trip_start",
        "trip_end",
        "created_at",
    )
    list_filter = ("nationality", "id_proof_type", "trip_start", "trip_end")
    search_fields = ("name", "nationality", "phone", "tourist_id")
    inlines = [EmergencyContactInline, DigitalIDInline]


@admin.register(DigitalID)
class DigitalIDAdmin(admin.ModelAdmin):
    list_display = ("id_token", "tourist", "issued_at", "expires_at", "is_active")
    list_filter = ("is_active", "issued_at", "expires_at")
    search_fields = ("id_token", "tourist__name", "tourist__phone")
    readonly_fields = ("id_token", "issued_at", "qr_payload_signed", "qr_image_base64")


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ("name", "tourist", "phone", "relation", "created_at")
    list_filter = ("relation", "created_at")
    search_fields = ("name", "phone", "tourist__name")
