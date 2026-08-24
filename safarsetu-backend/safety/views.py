from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import SafetyZone, SafetyAlert, TouristLocationLog
from .serializers import (
    SafetyZoneSerializer,
    SafetyAlertSerializer,
    LocationSafetyCheckResponseSerializer,
    LocationUpdateInputSerializer
)
from .services import check_location_safety, get_nearby_safety_alerts
from tourists.models import TouristProfile


class SafetyCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Check Location Safety Status",
        description="Evaluates whether given GPS coordinates fall inside a SAFE, CAUTION, or DANGER zone.",
        parameters=[
            OpenApiParameter('lat', OpenApiTypes.FLOAT, required=True, description='Latitude'),
            OpenApiParameter('lng', OpenApiTypes.FLOAT, required=True, description='Longitude'),
        ],
        responses={200: LocationSafetyCheckResponseSerializer, 400: dict}
    )
    def get(self, request):
        lat_str = request.query_params.get('lat')
        lng_str = request.query_params.get('lng')

        if not lat_str or not lng_str:
            return Response({
                "success": False,
                "message": "Both 'lat' and 'lng' query parameters are required.",
                "errors": {"coordinates": "lat and lng required"}
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat = float(lat_str)
            lng = float(lng_str)
        except ValueError:
            return Response({
                "success": False,
                "message": "Invalid latitude or longitude numbers.",
                "errors": {"coordinates": "Must be valid numbers"}
            }, status=status.HTTP_400_BAD_REQUEST)

        safety_result = check_location_safety(lat, lng)
        return Response({
            "success": True,
            "data": safety_result
        }, status=status.HTTP_200_OK)


class SafetyAlertListView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="List Active Safety Alerts",
        description="Retrieve all current active safety advisories and alerts.",
        responses={200: SafetyAlertSerializer(many=True)}
    )
    def get(self, request):
        alerts = SafetyAlert.objects.filter(is_active=True)
        serializer = SafetyAlertSerializer(alerts, many=True)
        return Response({
            "success": True,
            "count": alerts.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class NearbySafetyAlertsView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Get Nearby Safety Alerts",
        description="Find active safety alerts within a specified radius (km) of current coordinates.",
        parameters=[
            OpenApiParameter('lat', OpenApiTypes.FLOAT, required=True, description='Latitude'),
            OpenApiParameter('lng', OpenApiTypes.FLOAT, required=True, description='Longitude'),
            OpenApiParameter('radius', OpenApiTypes.FLOAT, required=False, description='Radius in km (default 15)'),
        ],
        responses={200: SafetyAlertSerializer(many=True)}
    )
    def get(self, request):
        lat_str = request.query_params.get('lat')
        lng_str = request.query_params.get('lng')
        radius_str = request.query_params.get('radius', '15')

        if not lat_str or not lng_str:
            return Response({
                "success": False,
                "message": "Both 'lat' and 'lng' query parameters are required.",
                "errors": {"coordinates": "lat and lng required"}
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            lat = float(lat_str)
            lng = float(lng_str)
            radius_km = float(radius_str)
        except ValueError:
            return Response({
                "success": False,
                "message": "Invalid coordinates or radius.",
                "errors": {"coordinates": "Must be valid numbers"}
            }, status=status.HTTP_400_BAD_REQUEST)

        nearby_alerts = get_nearby_safety_alerts(lat, lng, radius_km)
        serializer = SafetyAlertSerializer(nearby_alerts, many=True)
        return Response({
            "success": True,
            "count": len(nearby_alerts),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class LocationUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Update Tourist Live Location & Get Real-Time Safety Status",
        description="Saves latest location, evaluates geo-fenced safety zones, checks alerts, and updates tourist profile.",
        request=LocationUpdateInputSerializer,
        responses={200: dict}
    )
    def post(self, request):
        serializer = LocationUpdateInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid location payload.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        lat = serializer.validated_data['latitude']
        lng = serializer.validated_data['longitude']

        # Determine safety status
        safety_eval = check_location_safety(lat, lng)
        status_code = safety_eval['status'].lower()  # 'safe', 'caution', 'danger'

        # Get or update tourist profile
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.get_full_name() or request.user.username}
        )

        profile.last_latitude = lat
        profile.last_longitude = lng
        # Only overwrite safety status if not currently in SOS danger mode
        if profile.safety_status != 'danger' or status_code == 'danger':
            profile.safety_status = status_code
        profile.save(update_fields=['last_latitude', 'last_longitude', 'safety_status'])

        # Log location
        TouristLocationLog.objects.create(
            tourist=profile,
            latitude=lat,
            longitude=lng,
            safety_status_determined=status_code
        )

        # Find nearby alerts
        nearby_alerts = get_nearby_safety_alerts(lat, lng, radius_km=15.0)
        alerts_data = SafetyAlertSerializer(nearby_alerts, many=True).data

        return Response({
            "success": True,
            "status": safety_eval['status'],
            "zone": safety_eval['zone'],
            "message": safety_eval['message'],
            "alerts": alerts_data
        }, status=status.HTTP_200_OK)
