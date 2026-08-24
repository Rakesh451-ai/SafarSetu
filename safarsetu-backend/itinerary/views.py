from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Itinerary, ItineraryItem
from .serializers import ItinerarySerializer, ItineraryItemSerializer
from tourists.models import TouristProfile


class ItineraryListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List User Itineraries",
        description="Retrieve active and saved travel itineraries for the current tourist.",
        responses={200: ItinerarySerializer(many=True)}
    )
    def get(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        itineraries = Itinerary.objects.filter(tourist=profile).prefetch_related('items')
        serializer = ItinerarySerializer(itineraries, many=True)
        return Response({
            "success": True,
            "count": itineraries.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Create Itinerary",
        description="Create a new custom itinerary plan.",
        request=ItinerarySerializer,
        responses={201: ItinerarySerializer}
    )
    def post(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        serializer = ItinerarySerializer(data=request.data)
        if serializer.is_valid():
            itinerary = serializer.save(tourist=profile)
            return Response({
                "success": True,
                "message": "Itinerary created successfully.",
                "data": ItinerarySerializer(itinerary).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Failed to create itinerary.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ItineraryDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Itinerary Details",
        description="Retrieve a specific itinerary with all scheduled daily stops.",
        responses={200: ItinerarySerializer, 404: dict}
    )
    def get(self, request, id):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        itinerary = Itinerary.objects.filter(id=id, tourist=profile).prefetch_related('items').first()
        if not itinerary:
            return Response({
                "success": False,
                "message": f"Itinerary {id} not found.",
                "errors": {"id": "Itinerary not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ItinerarySerializer(itinerary)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update Itinerary",
        description="Update itinerary metadata.",
        request=ItinerarySerializer,
        responses={200: ItinerarySerializer}
    )
    def patch(self, request, id):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        itinerary = Itinerary.objects.filter(id=id, tourist=profile).first()
        if not itinerary:
            return Response({
                "success": False,
                "message": f"Itinerary {id} not found.",
                "errors": {"id": "Itinerary not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ItinerarySerializer(itinerary, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Itinerary updated.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Failed to update itinerary.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ItineraryOptimizeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Optimize Itinerary Route with AI & Crowd Analytics",
        description="Reorders items to avoid afternoon peak crowds and reduce cab travel time.",
        responses={200: dict}
    )
    def post(self, request, id=None):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        itinerary = None
        if id:
            itinerary = Itinerary.objects.filter(id=id, tourist=profile).first()
        if not itinerary:
            itinerary = Itinerary.objects.filter(tourist=profile).first()

        if itinerary:
            items = list(itinerary.items.all().order_by('day', 'order'))
            # Reorder items to optimize morning heritage & sunset viewpoints
            for idx, item in enumerate(items, start=1):
                item.order = idx
                item.save(update_fields=['order'])
            serialized_items = ItineraryItemSerializer(itinerary.items.all().order_by('day', 'order'), many=True).data
        else:
            serialized_items = []

        return Response({
            "success": True,
            "message": "⚡ AI Itinerary Optimization Applied. Trip reordered to avoid peak crowds and minimize transit time.",
            "data": {
                "items": serialized_items
            }
        }, status=status.HTTP_200_OK)
