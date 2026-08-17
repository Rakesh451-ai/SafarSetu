import json
import logging

from django.contrib.gis.geos import Point, Polygon
from django.db import connection
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.identity.models import Tourist

from .models import LocationPing, Zone, ZoneType
from .serializers import LocationPingInputSerializer, LocationPingResponseSerializer
from .signals import zone_transition

logger = logging.getLogger("safarsetu.tracking")


def find_zones_containing_point(point: Point, region: str = None):
    """
    Executes a point-in-polygon containment query. Uses native PostGIS ST_Contains
    in PostgreSQL, and GEOS polygon.contains(point) in SQLite development mode.
    """
    qs = Zone.objects.all()
    if region:
        qs = qs.filter(region__icontains=region)

    if hasattr(connection.ops, "geo_db_type"):
        try:
            return list(qs.filter(boundary__contains=point))
        except Exception:
            pass

    return [z for z in qs if z.boundary and z.boundary.contains(point)]


def find_zones_intersecting_bbox(bbox_poly: Polygon, region: str = None):
    """
    Executes a spatial intersection query against bounding box.
    """
    qs = Zone.objects.all()
    if region:
        qs = qs.filter(region__icontains=region)

    if hasattr(connection.ops, "geo_db_type"):
        try:
            return list(qs.filter(boundary__intersects=bbox_poly))
        except Exception:
            pass

    return [z for z in qs if z.boundary and z.boundary.intersects(bbox_poly)]


@extend_schema(
    tags=["Tracking & Geofencing"],
    summary="Submit tourist GPS location ping",
    description=(
        "Transmits real-time tourist GPS coordinates, executes a point-in-polygon "
        "containment query against active geofence zones, stores the location ping, "
        "and triggers a zone_transition signal if safety status changes."
    ),
    request=LocationPingInputSerializer,
    responses={
        201: LocationPingResponseSerializer,
        400: OpenApiResponse(description="Invalid coordinates or missing parameters."),
        404: OpenApiResponse(description="Tourist not found."),
    },
)
class LocationPingView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LocationPingInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        tourist_id = serializer.validated_data["tourist_id"]
        latitude = serializer.validated_data["latitude"]
        longitude = serializer.validated_data["longitude"]
        accuracy = serializer.validated_data.get("accuracy_meters")

        try:
            tourist = Tourist.objects.get(tourist_id=tourist_id)
        except Tourist.DoesNotExist:
            return Response(
                {"detail": f"Tourist with ID '{tourist_id}' not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Construct GeoDjango Point (WGS84)
        point = Point(longitude, latitude, srid=4326)

        # Run point-in-polygon query using GeoDjango contains lookup
        matched_zones = find_zones_containing_point(point)

        # Prioritize most severe zone: danger > caution > safe
        severity_order = {ZoneType.DANGER: 3, ZoneType.CAUTION: 2, ZoneType.SAFE: 1}
        matched_zone = None
        if matched_zones:
            matched_zones.sort(
                key=lambda z: severity_order.get(z.type, 0), reverse=True
            )
            matched_zone = matched_zones[0]
            resolved_status = matched_zone.type
        else:
            resolved_status = ZoneType.SAFE

        # Retrieve previous ping to determine if zone status changed
        previous_ping = (
            LocationPing.objects.filter(tourist=tourist).order_by("-timestamp").first()
        )
        previous_status = previous_ping.zone_status_at_ping if previous_ping else None
        zone_transitioned = (
            previous_status is not None and previous_status != resolved_status
        )

        # Persist new LocationPing
        ping = LocationPing.objects.create(
            tourist=tourist,
            location=point,
            zone_status_at_ping=resolved_status,
            accuracy_meters=accuracy,
        )

        # Fire zone_transition signal when status changes
        if zone_transitioned:
            zone_transition.send(
                sender=LocationPing,
                tourist=tourist,
                previous_status=previous_status,
                current_status=resolved_status,
                ping=ping,
                zone=matched_zone,
            )

        response_data = {
            "ping_id": ping.ping_id,
            "tourist_id": tourist.tourist_id,
            "tourist_name": tourist.name,
            "latitude": latitude,
            "longitude": longitude,
            "zone_status": resolved_status,
            "matched_zone_name": matched_zone.name if matched_zone else None,
            "previous_zone_status": previous_status,
            "zone_transitioned": zone_transitioned,
            "timestamp": ping.timestamp,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


@extend_schema(
    tags=["Tracking & Geofencing"],
    summary="Get geofence zone polygons as GeoJSON",
    description=(
        "Returns geofence zones as a standard GeoJSON FeatureCollection for "
        "offline client mapping and geofence evaluation. Supports bounding box "
        "filtering via the ?bbox=min_lon,min_lat,max_lon,max_lat parameter."
    ),
    parameters=[
        OpenApiParameter(
            name="bbox",
            description="Bounding box filter in 'min_lon,min_lat,max_lon,max_lat' format (e.g. '75.80,26.90,75.90,27.00').",
            required=False,
            type=str,
            location=OpenApiParameter.QUERY,
        ),
        OpenApiParameter(
            name="region",
            description="Filter zones by region/city name.",
            required=False,
            type=str,
            location=OpenApiParameter.QUERY,
        ),
    ],
    responses={
        200: OpenApiResponse(
            description="GeoJSON FeatureCollection containing zone polygons and metadata."
        )
    },
)
class ZoneGeoJSONView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        region = request.query_params.get("region", "").strip() or None
        bbox_str = request.query_params.get("bbox", "").strip()

        if bbox_str:
            try:
                parts = [float(x.strip()) for x in bbox_str.split(",")]
                if len(parts) != 4:
                    return Response(
                        {
                            "detail": "Invalid bbox format. Expected 'min_lon,min_lat,max_lon,max_lat'."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                min_lon, min_lat, max_lon, max_lat = parts
                bbox_poly = Polygon.from_bbox((min_lon, min_lat, max_lon, max_lat))
                zones = find_zones_intersecting_bbox(bbox_poly, region=region)
            except ValueError:
                return Response(
                    {"detail": "Bbox values must be numeric floating point numbers."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            zones = Zone.objects.all()
            if region:
                zones = zones.filter(region__icontains=region)

        features = []
        for zone in zones:
            if not zone.boundary:
                continue
            geometry = json.loads(zone.boundary.geojson)
            features.append(
                {
                    "type": "Feature",
                    "id": str(zone.zone_id),
                    "geometry": geometry,
                    "properties": {
                        "zone_id": str(zone.zone_id),
                        "name": zone.name,
                        "type": zone.type,
                        "region": zone.region,
                        "description": zone.description,
                        "created_at": zone.created_at.isoformat(),
                    },
                }
            )

        geojson_feature_collection = {
            "type": "FeatureCollection",
            "features": features,
        }

        return Response(geojson_feature_collection, status=status.HTTP_200_OK)
