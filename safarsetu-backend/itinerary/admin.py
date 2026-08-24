from django.contrib import admin
from .models import Itinerary, ItineraryItem


class ItineraryItemInline(admin.TabularInline):
    model = ItineraryItem
    extra = 1


@admin.register(Itinerary)
class ItineraryAdmin(admin.ModelAdmin):
    list_display = ('name', 'tourist', 'journey', 'start_date', 'end_date', 'created_at')
    list_filter = ('start_date', 'created_at')
    search_fields = ('name', 'tourist__full_name', 'description')
    ordering = ('-created_at',)
    inlines = [ItineraryItemInline]


@admin.register(ItineraryItem)
class ItineraryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'itinerary', 'day', 'order', 'time', 'location', 'transport_mode', 'cost', 'safety_status')
    list_filter = ('day', 'transport_mode', 'safety_status')
    search_fields = ('title', 'location', 'itinerary__name')
    ordering = ('itinerary', 'day', 'order')
