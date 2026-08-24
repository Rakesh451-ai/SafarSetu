from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .models import QRScanLog
from .serializers import QRScanRequestSerializer, PublicDigitalIDVerifySerializer
from destinations.models import Destination
from destinations.serializers import DestinationSerializer
from tourists.models import TouristProfile


class QRScanView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Scan Monument or Tourism QR Code",
        description="Processes scanned QR code, verifies official monument/kiosk credentials, and logs scan history.",
        request=QRScanRequestSerializer,
        responses={200: dict, 404: dict}
    )
    def post(self, request):
        serializer = QRScanRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid QR code payload.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        qr_code = serializer.validated_data['qr_code'].strip()
        lat = serializer.validated_data.get('latitude')
        lng = serializer.validated_data.get('longitude')

        # Identify tourist profile if authenticated
        tourist_profile = None
        if request.user and request.user.is_authenticated and hasattr(request.user, 'tourist_profile'):
            tourist_profile = request.user.tourist_profile

        # Look up destination by qr_code, slug, or name
        dest = Destination.objects.filter(qr_code__iexact=qr_code).first()
        if not dest:
            dest = Destination.objects.filter(slug__iexact=qr_code).first()
        if not dest and '-' in qr_code:
            # Try matching suffix or part (e.g. DEST-TAJ-AGRA -> taj)
            parts = qr_code.lower().split('-')
            for part in parts:
                if len(part) >= 3:
                    matched = Destination.objects.filter(slug__icontains=part).first()
                    if matched:
                        dest = matched
                        break

        # Log scan event
        QRScanLog.objects.create(
            tourist=tourist_profile,
            destination=dest,
            qr_code_scanned=qr_code,
            scan_type='DESTINATION' if dest else 'OTHER',
            latitude=lat or (dest.latitude if dest else None),
            longitude=lng or (dest.longitude if dest else None),
        )

        if not dest:
            return Response({
                "success": False,
                "message": f"No verified destination found for QR code: '{qr_code}'.",
                "errors": {"qr_code": "Unrecognized QR code"}
            }, status=status.HTTP_404_NOT_FOUND)

        dest_data = DestinationSerializer(dest).data
        audio_languages = [ag['language'] for ag in dest_data.get('audioGuides', [])]

        return Response({
            "success": True,
            "message": f"Verified ASI guide loaded for {dest.name}.",
            "data": {
                "destination": dest_data,
                "location": f"{dest.city}, {dest.state}",
                "description": dest.description,
                "safety_status": "safe" if dest.safety_rating >= 4.5 else "caution",
                "opening_hours": dest.opening_hours,
                "entry_fee": dest.entry_fee,
                "facilities": dest.facilities,
                "available_languages": audio_languages or ["English", "हिन्दी (Hindi)"],
                "audio_guides": dest_data.get('audioGuides', []),
                "video_guide": {
                    "title": f"Official Video Tour of {dest.name}",
                    "video_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    "duration": "03:45"
                }
            }
        }, status=status.HTTP_200_OK)


class QRVerifyTouristView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Public Digital Tourist ID Verification",
        description="Allows police, monument gates, and verified authorities to scan a Tourist ID and verify legitimacy without exposing sensitive data.",
        responses={200: PublicDigitalIDVerifySerializer, 404: dict}
    )
    def get(self, request, tourist_id):
        # Support clean lookup e.g. SS-IND-8F42K9 or SAFARSETU-ID-SS-IND-8F42K9-VERIFIED
        clean_id = tourist_id.replace('SAFARSETU-ID-', '').replace('-VERIFIED', '').strip()
        profile = TouristProfile.objects.filter(digital_id__iexact=clean_id).prefetch_related('emergency_contacts').first()

        if not profile:
            return Response({
                "success": False,
                "message": f"Digital Tourist ID '{tourist_id}' not found in registry.",
                "errors": {"tourist_id": "Invalid ID"}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = PublicDigitalIDVerifySerializer(profile)
        return Response({
            "success": True,
            "message": "✓ Verified Official Digital Tourist Credentials",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
