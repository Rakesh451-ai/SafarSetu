from django.contrib import admin

from .models import Listing, ListingCategory, Review


@admin.register(ListingCategory)
class ListingCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "type",
        "region",
        "price_info",
        "rating",
        "verified",
        "source_verified_by",
        "updated_at",
    )
    list_filter = ("type", "region", "verified", "is_active")
    search_fields = ("title", "description", "region", "city", "address")
    actions = ["mark_verified", "mark_unverified"]

    @admin.action(description="Mark selected listings as verified")
    def mark_verified(self, request, queryset):
        queryset.update(verified=True, source_verified_by=request.user)

    @admin.action(description="Mark selected listings as unverified")
    def mark_unverified(self, request, queryset):
        queryset.update(verified=False)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "listing", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
