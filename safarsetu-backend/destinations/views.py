from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import Destination
from .serializers import DestinationSerializer, DestinationNearbyResultSerializer
from .services import get_nearby_destinations
from config.pagination import StandardResultsSetPagination


class DestinationListView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="List Destinations",
        description="Search and filter verified heritage destinations by query, state, city, and category with pagination.",
        parameters=[
            OpenApiParameter('search', OpenApiTypes.STR, description='Search by name, city, state, or description'),
            OpenApiParameter('state', OpenApiTypes.STR, description='Filter by state (e.g., Uttar Pradesh, Rajasthan)'),
            OpenApiParameter('city', OpenApiTypes.STR, description='Filter by city (e.g., Agra, Jaipur, Delhi)'),
            OpenApiParameter('category', OpenApiTypes.STR, description='Filter by category (heritage, nature, spiritual, adventure, coastal)'),
            OpenApiParameter('page', OpenApiTypes.INT, description='Page number'),
            OpenApiParameter('page_size', OpenApiTypes.INT, description='Results per page'),
        ],
        responses={200: DestinationSerializer(many=True)}
    )
    def get(self, request):
        queryset = Destination.objects.all().prefetch_related('audio_guides', 'reviews', 'nearby_attractions')

        search_query = request.query_params.get('search')
        state_filter = request.query_params.get('state')
        city_filter = request.query_params.get('city')
        category_filter = request.query_params.get('category')

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(city__icontains=search_query) |
                Q(state__icontains=search_query) |
                Q(tagline__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        if state_filter:
            queryset = queryset.filter(state__iexact=state_filter.strip())

        if city_filter:
            queryset = queryset.filter(city__iexact=city_filter.strip())

        if category_filter:
            queryset = queryset.filter(category__iexact=category_filter.strip())

        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = DestinationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = DestinationSerializer(queryset, many=True)
        return Response({
            "success": True,
            "count": queryset.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class DestinationDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Get Destination by Slug or ID",
        description="Retrieve comprehensive details for a monument or destination including audio guides, reviews, weather, and safety guidelines.",
        responses={200: DestinationSerializer, 404: dict}
    )
    def get(self, request, id):
        dest = None
        if str(id).isdigit():
            dest = Destination.objects.filter(id=int(id)).first()
        if not dest:
            dest = Destination.objects.filter(slug=str(id)).first()
        if not dest:
            dest = Destination.objects.filter(qr_code=str(id)).first()

        if not dest:
            return Response({
                "success": False,
                "message": f"Destination '{id}' not found.",
                "errors": {"id": "Destination not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = DestinationSerializer(dest)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class NearbyDestinationsView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Find Nearby Destinations",
        description="Calculate geodesic distance from tourist GPS coordinates and return closest safe destinations.",
        parameters=[
            OpenApiParameter('lat', OpenApiTypes.FLOAT, required=True, description='Latitude'),
            OpenApiParameter('lng', OpenApiTypes.FLOAT, required=True, description='Longitude'),
            OpenApiParameter('radius', OpenApiTypes.FLOAT, required=False, description='Radius in km (default 50)'),
            OpenApiParameter('limit', OpenApiTypes.INT, required=False, description='Max destinations to return (default 10)'),
        ],
        responses={200: DestinationNearbyResultSerializer(many=True)}
    )
    def get(self, request):
        lat_str = request.query_params.get('lat')
        lng_str = request.query_params.get('lng')
        radius_str = request.query_params.get('radius', '50')
        limit_str = request.query_params.get('limit', '10')

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
            limit = int(limit_str)
        except ValueError:
            return Response({
                "success": False,
                "message": "Invalid coordinates or radius values.",
                "errors": {"coordinates": "Must be valid numbers"}
            }, status=status.HTTP_400_BAD_REQUEST)

        nearby_items = get_nearby_destinations(lat, lng, radius_km=radius_km, limit=limit)
        results = []
        for item in nearby_items:
            results.append({
                'destination': DestinationSerializer(item['destination']).data,
                'distance_km': item['distance_km'],
                'safety_status': item['safety_status']
            })

        return Response({
            "success": True,
            "count": len(results),
            "results": results
        }, status=status.HTTP_200_OK)
