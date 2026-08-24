from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .models import VerifiedService
from .serializers import VerifiedServiceSerializer
from config.pagination import StandardResultsSetPagination


class VerifiedServiceListView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="List Verified Tourism Services",
        description="Filter verified services (hotels, guides, transport, experiences) with category and location filters.",
        parameters=[
            OpenApiParameter('type', OpenApiTypes.STR, description='Service type (hotel, transport, guide, ticket, experience)'),
            OpenApiParameter('location', OpenApiTypes.STR, description='Filter by location / city'),
            OpenApiParameter('min_price', OpenApiTypes.FLOAT, description='Minimum price'),
            OpenApiParameter('max_price', OpenApiTypes.FLOAT, description='Maximum price'),
            OpenApiParameter('verified_only', OpenApiTypes.BOOL, description='Show only verified services'),
            OpenApiParameter('search', OpenApiTypes.STR, description='Search by title, provider, or location'),
        ],
        responses={200: VerifiedServiceSerializer(many=True)}
    )
    def get(self, request):
        queryset = VerifiedService.objects.all()

        service_type = request.query_params.get('type')
        location = request.query_params.get('location')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        verified_only = request.query_params.get('verified_only')
        search = request.query_params.get('search')

        if service_type and service_type != 'all':
            queryset = queryset.filter(service_type__iexact=service_type)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))

        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))

        if verified_only and verified_only.lower() in ('true', '1'):
            queryset = queryset.filter(is_verified=True)

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(provider__icontains=search) |
                Q(location__icontains=search)
            )

        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = VerifiedServiceSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = VerifiedServiceSerializer(queryset, many=True)
        return Response({
            "success": True,
            "count": queryset.count(),
            "results": serializer.data
        }, status=status.HTTP_200_OK)


class VerifiedServiceDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Get Verified Service Details",
        description="Retrieve full details for a verified service.",
        responses={200: VerifiedServiceSerializer, 404: dict}
    )
    def get(self, request, id):
        service = None
        if str(id).isdigit():
            service = VerifiedService.objects.filter(id=int(id)).first()
        if not service:
            service = VerifiedService.objects.filter(service_id=str(id)).first()

        if not service:
            return Response({
                "success": False,
                "message": f"Service '{id}' not found.",
                "errors": {"id": "Service not found"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = VerifiedServiceSerializer(service)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)
