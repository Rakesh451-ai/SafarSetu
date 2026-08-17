from django.contrib import admin

from .models import GuideBooking, GuideProfile, TourPackage


class TourPackageInline(admin.TabularInline):
    model = TourPackage
    extra = 0


@admin.register(GuideProfile)
class GuideProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "verified",
        "verified_by",
        "regions_served",
        "languages_spoken",
        "rating_avg",
        "experience_years",
        "hourly_rate",
        "created_at",
    )
    list_filter = ("verified", "regions_served", "languages_spoken")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "regions_served",
        "languages_spoken",
        "bio",
    )
    readonly_fields = ("verified_by", "created_at", "updated_at")
    inlines = [TourPackageInline]
    actions = ["verify_selected_guides", "unverify_selected_guides"]

    @admin.action(description="Verify selected guides (mark as verified)")
    def verify_selected_guides(self, request, queryset):
        count = queryset.update(verified=True, verified_by=request.user)
        self.message_user(request, f"{count} guide(s) successfully verified.")

    @admin.action(description="Unverify selected guides")
    def unverify_selected_guides(self, request, queryset):
        count = queryset.update(verified=False, verified_by=None)
        self.message_user(request, f"{count} guide(s) unverified.")


@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "guide",
        "duration",
        "price",
        "max_group_size",
        "created_at",
    )
    list_filter = ("guide__verified", "duration", "created_at")
    search_fields = ("title", "description", "guide__user__username")
    filter_horizontal = ("poi_refs",)


@admin.register(GuideBooking)
class GuideBookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tour_package",
        "tourist",
        "status",
        "scheduled_date",
        "number_of_people",
        "created_at",
    )
    list_filter = ("status", "scheduled_date", "created_at")
    search_fields = ("tourist__name", "tour_package__title", "special_requests")
