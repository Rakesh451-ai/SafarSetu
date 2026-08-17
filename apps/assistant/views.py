import logging

from django.utils import timezone
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.models import Tourist

from .itinerary_service import generate_itinerary_plan
from .llm_client import default_llm_client
from .models import Itinerary
from .retrieval import retrieve_pois_for_query
from .serializers import (
    AssistantQueryInputSerializer,
    AssistantQueryResponseSerializer,
    ItineraryGenerateInputSerializer,
    ItineraryModelSerializer,
)

logger = logging.getLogger("safarsetu.assistant")


@extend_schema(
    tags=["AI Assistant & RAG"],
    summary="Ask AI travel assistant with RAG POI retrieval",
    description=(
        "Retrieves relevant Points of Interest (POIs) using Postgres Full-Text Search, "
        "augments the prompt context, and queries the LLM in the tourist's preferred language."
    ),
    request=AssistantQueryInputSerializer,
    responses={
        200: AssistantQueryResponseSerializer,
        404: OpenApiResponse(description="Tourist not found."),
    },
)
class AssistantQueryView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = AssistantQueryInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tourist_id = serializer.validated_data["tourist_id"]
        question = serializer.validated_data["question"]
        city = serializer.validated_data.get("city", "Jaipur")

        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            return Response(
                {"detail": f"Tourist with ID '{tourist_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # 1. RAG Retrieval Layer: Postgres Full-Text Search / Ranked Search over POIs
        retrieved_pois_qs = retrieve_pois_for_query(
            query_text=question,
            city=city,
            limit=5,
        )

        poi_summaries = []
        rag_context_lines = []
        for poi in retrieved_pois_qs:
            poi_summaries.append(
                {
                    "id": poi.id,
                    "title": poi.title,
                    "category": poi.category.name if poi.category else "Attraction",
                    "city": poi.city,
                    "rating": float(poi.rating),
                    "address": poi.address,
                }
            )
            rag_context_lines.append(
                f"- {poi.title} ({poi.category.name if poi.category else 'Attraction'}, Rating: {poi.rating}/5): {poi.description[:150]}"
            )

        rag_context_text = (
            "\n".join(rag_context_lines)
            if rag_context_lines
            else "No specific POI records matched query."
        )

        prompt = (
            f"Tourist Question: {question}\n"
            f"Destination Context: {city}\n"
            f"Verified Destination Information:\n{rag_context_text}\n\n"
            f"Provide a helpful, friendly, and safety-conscious response for the tourist."
        )

        system_prompt = (
            f"You are SafarSetu AI, an expert tourist assistant for India. "
            f"Always prioritize verified heritage and tourist safety. "
            f"Tourist Name: {tourist.name}, Preferred Language: {tourist.preferred_language or 'en'}."
        )

        # 2. Invoke LLM in tourist's preferred language
        answer_text = default_llm_client.generate_response(
            prompt=prompt,
            system_prompt=system_prompt,
            language=tourist.preferred_language or "en",
        )

        return Response(
            {
                "tourist_id": str(tourist.tourist_id),
                "tourist_name": tourist.name,
                "language": tourist.preferred_language or "en",
                "question": question,
                "answer": answer_text,
                "retrieved_pois": poi_summaries,
                "timestamp": timezone.now(),
            },
            status=status.HTTP_200_OK,
        )


@extend_schema(
    tags=["AI Assistant & RAG"],
    summary="Generate safe curated day-by-day travel itinerary",
    description=(
        "Generates a personalized day-by-day itinerary by cross-checking candidate POIs "
        "against Geofence Zones (safe/caution/danger), excluding high-risk locations, "
        "optionally attaching matching verified guide packages, and persisting as an Itinerary model."
    ),
    request=ItineraryGenerateInputSerializer,
    responses={
        201: OpenApiResponse(description="Itinerary generated successfully."),
        404: OpenApiResponse(description="Tourist not found."),
    },
)
class ItineraryGenerateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ItineraryGenerateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tourist_id = serializer.validated_data["tourist_id"]
        city = serializer.validated_data.get("destination_city", "Jaipur")
        duration = serializer.validated_data.get("duration_days", 2)
        interests = serializer.validated_data.get("interests", [])
        want_guide = serializer.validated_data.get("want_guide", True)

        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            return Response(
                {"detail": f"Tourist with ID '{tourist_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        itinerary_data = generate_itinerary_plan(
            tourist=tourist,
            destination_city=city,
            duration_days=duration,
            interests=interests,
            want_guided_option=want_guide,
        )

        return Response(itinerary_data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["AI Assistant & RAG"],
    summary="List persisted itineraries",
    description="List all generated itineraries for tourists.",
)
class ItineraryListView(generics.ListAPIView):
    queryset = Itinerary.objects.all()
    serializer_class = ItineraryModelSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(
    tags=["AI Assistant & RAG"],
    summary="Retrieve itinerary by ID",
    description="Retrieve details of a persisted itinerary.",
)
class ItineraryDetailView(generics.RetrieveAPIView):
    queryset = Itinerary.objects.all()
    serializer_class = ItineraryModelSerializer
    permission_classes = [permissions.AllowAny]
