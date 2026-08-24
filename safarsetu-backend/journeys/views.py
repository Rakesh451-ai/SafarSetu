from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import Journey, JourneyLocation
from .serializers import JourneySerializer, JourneyLocationSerializer, CheckInInputSerializer
from tourists.models import TouristProfile
from safety.services import check_location_safety


class JourneyListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List Tourist Journeys",
        description="Retrieve all journeys created by the authenticated tourist.",
        responses={200: JourneySerializer(many=True)}
    )
    def get(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        journeys = Journey.objects.filter(tourist=profile).prefetch_related('locations')
        serializer = JourneySerializer(journeys, many=True)
        return Response({
            "success": True,
            "count": journeys.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Create Journey",
        description="Create a new planned or active travel circuit journey.",
        request=JourneySerializer,
        responses={201: JourneySerializer}
    )
    def post(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        serializer = JourneySerializer(data=request.data)
        if serializer.is_valid():
            journey = serializer.save(tourist=profile)
            return Response({
                "success": True,
                "message": "Journey created successfully.",
                "data": JourneySerializer(journey).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "message": "Failed to create journey.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class JourneyDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Journey Details",
        description="Retrieve specific journey with milestone history and route timeline.",
        responses={200: JourneySerializer, 404: dict}
    )
    def get(self, request, id):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        journey = Journey.objects.filter(id=id, tourist=profile).prefetch_related('locations').first()
        if not journey:
            return Response({
                "success": False,
                "message": f"Journey {id} not found.",
                "errors": {"id": "Journey not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = JourneySerializer(journey)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update Journey",
        description="Update status (ACTIVE, COMPLETED, CANCELLED), cities, or dates.",
        request=JourneySerializer,
        responses={200: JourneySerializer}
    )
    def patch(self, request, id):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        journey = Journey.objects.filter(id=id, tourist=profile).first()
        if not journey:
            return Response({
                "success": False,
                "message": f"Journey {id} not found.",
                "errors": {"id": "Journey not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = JourneySerializer(journey, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Journey updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Failed to update journey.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Delete Journey",
        description="Remove a planned or obsolete journey.",
        responses={200: dict}
    )
    def delete(self, request, id):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )
        journey = Journey.objects.filter(id=id, tourist=profile).first()
        if not journey:
            return Response({
                "success": False,
                "message": f"Journey {id} not found.",
                "errors": {"id": "Journey not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        journey.delete()
        return Response({
            "success": True,
            "message": "Journey deleted successfully."
        }, status=status.HTTP_200_OK)


class JourneyCheckInView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Perform Journey Safety Check-in",
        description="Logs a verified safety check-in, resets the tourist countdown timer, and updates tourist live registry.",
        request=CheckInInputSerializer,
        responses={200: dict}
    )
    def post(self, request, id=None):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )

        journey = None
        if id:
            journey = Journey.objects.filter(id=id, tourist=profile).first()
        if not journey:
            journey = Journey.objects.filter(tourist=profile, status='ACTIVE').first()
        if not journey:
            journey = Journey.objects.filter(tourist=profile).first()

        if not journey:
            journey = Journey.objects.create(
                tourist=profile,
                name='Default Sightseeing Circuit',
                status='ACTIVE',
                current_city='Agra',
                state='Uttar Pradesh',
            )

        serializer = CheckInInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid check-in data.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        lat = serializer.validated_data.get('latitude', 27.1751)
        lng = serializer.validated_data.get('longitude', 78.0421)
        location_name = serializer.validated_data.get('location_name') or f"{journey.current_city} Verified Check-in Point"
        notes = serializer.validated_data.get('notes', '')
        extend_minutes = serializer.validated_data.get('extend_minutes', 60)

        # Check safety zone
        safety_eval = check_location_safety(lat, lng)
        safety_code = safety_eval['status'].lower()

        now = timezone.now()
        location_log = JourneyLocation.objects.create(
            journey=journey,
            tourist=profile,
            location_name=location_name,
            latitude=lat,
            longitude=lng,
            event_type='CHECK_IN',
            status='ongoing',
            safety_check=safety_code,
            notes=notes,
            timestamp=now
        )

        # Update tourist profile
        time_str = now.strftime('%I:%M %p')
        profile.last_check_in_time = now
        profile.last_check_in_location = f"Just now ({time_str} at {location_name})"
        profile.check_in_due_minutes = extend_minutes
        if profile.safety_status != 'danger':
            profile.safety_status = 'safe'
        profile.save(update_fields=['last_check_in_time', 'last_check_in_location', 'check_in_due_minutes', 'safety_status'])

        return Response({
            "success": True,
            "message": "✓ Journey check-in logged and synchronized with tourist registry.",
            "data": {
                "check_in_id": location_log.id,
                "location_name": location_name,
                "timestamp": now.strftime('%b %d, %I:%M %p'),
                "safety_status": profile.safety_status,
                "check_in_due_minutes": profile.check_in_due_minutes,
                "zone": safety_eval['zone'],
            }
        }, status=status.HTTP_200_OK)
