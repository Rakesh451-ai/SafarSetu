from django.urls import path

from .views import (
    AssistantQueryView,
    ItineraryDetailView,
    ItineraryGenerateView,
    ItineraryListView,
)

app_name = "assistant"

urlpatterns = [
    path("query/", AssistantQueryView.as_view(), name="assistant-query"),
    path(
        "itinerary/generate/",
        ItineraryGenerateView.as_view(),
        name="itinerary-generate",
    ),
    path("itineraries/", ItineraryListView.as_view(), name="itinerary-list"),
    path(
        "itineraries/<uuid:pk>/",
        ItineraryDetailView.as_view(),
        name="itinerary-detail",
    ),
]
