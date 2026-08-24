from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from .models import TouristProfile
from .serializers import (
    TouristProfileSerializer,
    TouristProfileUpdateSerializer,
    DigitalTouristIDSerializer
)


class TouristProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Tourist Profile",
        description="Retrieve the complete profile, safety state, active trip, and emergency contacts for the authenticated tourist.",
        responses={200: TouristProfileSerializer}
    )
    def get(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'phone': request.user.phone,
            }
        )
        serializer = TouristProfileSerializer(profile)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Update Tourist Profile",
        description="Update personal details, medical info, emergency contacts, or privacy preferences.",
        request=TouristProfileUpdateSerializer,
        responses={200: TouristProfileSerializer}
    )
    def patch(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'phone': request.user.phone,
            }
        )
        serializer = TouristProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            full_data = TouristProfileSerializer(profile).data
            return Response({
                "success": True,
                "message": "Profile updated successfully.",
                "data": full_data
            }, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "message": "Failed to update profile.",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class DigitalTouristIDView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Digital Tourist ID",
        description="Fetch the unique Digital Tourist ID, secure QR string, and verified credentials.",
        responses={200: DigitalTouristIDSerializer}
    )
    def get(self, request):
        profile, _ = TouristProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'phone': request.user.phone,
            }
        )
        serializer = DigitalTouristIDSerializer(profile)
        return Response({
            "success": True,
            "data": serializer.data
        }, status=status.HTTP_200_OK)
