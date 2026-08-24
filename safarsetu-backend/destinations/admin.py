from django.contrib import admin
from .models import Destination, AudioGuideTrack, DestinationReview, NearbyAttraction


class AudioGuideTrackInline(admin.TabularInline):
    model = AudioGuideTrack
    extra = 1


class DestinationReviewInline(admin.TabularInline):
    model = DestinationReview
    extra = 1


class NearbyAttractionInline(admin.TabularInline):
    model = NearbyAttraction
    extra = 1


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'category', 'rating', 'safety_rating', 'crowd_status', 'verification_status', 'qr_code')
    list_filter = ('category', 'state', 'city', 'crowd_status', 'verification_status')
    search_fields = ('name', 'city', 'state', 'description', 'qr_code')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('-rating', 'name')
    inlines = [AudioGuideTrackInline, DestinationReviewInline, NearbyAttractionInline]


@admin.register(AudioGuideTrack)
class AudioGuideTrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'destination', 'language', 'duration', 'duration_seconds')
    list_filter = ('language', 'destination')
    search_fields = ('title', 'transcript', 'destination__name')


@admin.register(DestinationReview)
class DestinationReviewAdmin(admin.ModelAdmin):
    list_display = ('author', 'destination', 'rating', 'nationality', 'verified_stay', 'created_at')
    list_filter = ('rating', 'verified_stay', 'destination')
    search_fields = ('author', 'comment', 'destination__name')


@admin.register(NearbyAttraction)
class NearbyAttractionAdmin(admin.ModelAdmin):
    list_display = ('name', 'destination', 'distance')
    search_fields = ('name', 'destination__name')
