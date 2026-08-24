from django.contrib import admin
from .models import Journey, JourneyLocation, CheckInSchedule


class JourneyLocationInline(admin.TabularInline):
    model = JourneyLocation
    extra = 1


@admin.register(Journey)
class JourneyAdmin(admin.ModelAdmin):
    list_display = ('name', 'tourist', 'current_city', 'state', 'status', 'visited_count', 'total_count', 'created_at')
    list_filter = ('status', 'state', 'created_at')
    search_fields = ('name', 'tourist__full_name', 'current_city')
    ordering = ('-created_at',)
    inlines = [JourneyLocationInline]


@admin.register(JourneyLocation)
class JourneyLocationAdmin(admin.ModelAdmin):
    list_display = ('location_name', 'tourist', 'journey', 'event_type', 'status', 'safety_check', 'timestamp')
    list_filter = ('event_type', 'safety_check', 'status', 'timestamp')
    search_fields = ('location_name', 'tourist__full_name', 'journey__name')
    ordering = ('-timestamp',)


@admin.register(CheckInSchedule)
class CheckInScheduleAdmin(admin.ModelAdmin):
    list_display = ('tourist', 'journey', 'expected_check_in_time', 'actual_check_in_time', 'status')
    list_filter = ('status', 'expected_check_in_time')
    search_fields = ('tourist__full_name', 'journey__name')
