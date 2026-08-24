from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .serializers import AIChatRequestSerializer, AIMessageResponseSerializer
from .services import AIAssistantService
from tourists.models import TouristProfile


class AIChatView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="AI Tourist Assistant Chat",
        description="Interactive travel copilot that provides personalized itineraries, monument facts, and safety advisories grounded in official database facts.",
        request=AIChatRequestSerializer,
        responses={200: AIMessageResponseSerializer}
    )
    def post(self, request):
        serializer = AIChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Invalid query payload.",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data['message']

        # Retrieve tourist profile if logged in
        tourist_profile = None
        if request.user and request.user.is_authenticated and hasattr(request.user, 'tourist_profile'):
            tourist_profile = request.user.tourist_profile

        response_data = AIAssistantService.generate_response(user_message, tourist_profile)

        return Response({
            "success": True,
            "data": response_data
        }, status=status.HTTP_200_OK)
