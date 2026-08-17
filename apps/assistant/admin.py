from django.contrib import admin

from .models import AssistantConversation, AssistantMessage, Itinerary


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = (
        "itinerary_id",
        "title",
        "tourist",
        "destination_city",
        "duration_days",
        "created_at",
    )
    list_filter = ("destination_city", "duration_days", "created_at")
    search_fields = ("title", "tourist__name", "destination_city")
    readonly_fields = ("itinerary_id", "created_at", "updated_at")


@admin.register(AssistantConversation)
class AssistantConversationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "created_at", "updated_at")
    search_fields = ("title", "user__username")


@admin.register(AssistantMessage)
class AssistantMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "conversation", "role", "timestamp")
    list_filter = ("role", "timestamp")
    search_fields = ("content",)
