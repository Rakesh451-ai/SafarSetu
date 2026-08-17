from django.urls import path

from .views import ListingCategoryListView, ListingDetailView, ListingListCreateView

app_name = "listings"

urlpatterns = [
    path("", ListingListCreateView.as_view(), name="listing-list"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
    path("categories/", ListingCategoryListView.as_view(), name="category-list"),
]
