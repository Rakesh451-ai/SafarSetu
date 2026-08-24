from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema

from .models import User
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSummarySerializer,
)
from tourists.models import TouristProfile
from tourists.serializers import TouristProfileSerializer


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Register New Tourist",
        description="Register a new tourist account with name, email, phone, password, preferred language, and emergency contact.",
        request=UserRegisterSerializer,
        responses={201: dict, 400: dict}
    )
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            user_data = UserSummarySerializer(user).data
            profile_data = None
            if hasattr(user, 'tourist_profile'):
                profile_data = TouristProfileSerializer(user.tourist_profile).data

            return Response({
                "success": True,
                "message": "User registered successfully.",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": user_data,
                    "profile": profile_data
                }
            }, status=status.HTTP_201_CREATED)

        error_msg = "Registration failed."
        if serializer.errors:
            for field, err_list in serializer.errors.items():
                if isinstance(err_list, list) and len(err_list) > 0:
                    error_msg = str(err_list[0])
                elif isinstance(err_list, dict):
                    first_sub = next(iter(err_list.values()))
                    error_msg = str(first_sub[0]) if isinstance(first_sub, list) else str(first_sub)
                else:
                    error_msg = str(err_list)
                break

        return Response({
            "success": False,
            "message": error_msg,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="User Login",
        description="Authenticate user with email and password to receive JWT access and refresh tokens.",
        request=UserLoginSerializer,
        responses={200: dict, 400: dict}
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            user_data = UserSummarySerializer(user).data
            
            # Ensure TouristProfile exists
            profile, _ = TouristProfile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': user.get_full_name() or user.username,
                    'email': user.email,
                    'phone': user.phone or '',
                }
            )
            profile_data = TouristProfileSerializer(profile).data

            return Response({
                "success": True,
                "message": "Login successful.",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": user_data,
                    "profile": profile_data
                }
            }, status=status.HTTP_200_OK)

        error_msg = "Invalid email or password."
        if serializer.errors:
            if 'non_field_errors' in serializer.errors:
                error_msg = serializer.errors['non_field_errors'][0]
            elif 'email' in serializer.errors:
                error_msg = serializer.errors['email'][0]
            elif 'password' in serializer.errors:
                error_msg = serializer.errors['password'][0]

        return Response({
            "success": False,
            "message": error_msg,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        summary="Logout User",
        description="Logout user and blacklist refresh token if provided.",
        responses={200: dict}
    )
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # Ignore if blacklisting fails

        return Response({
            "success": True,
            "message": "Logged out successfully."
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Get Current User Profile",
        description="Returns details for the currently authenticated user.",
        responses={200: UserSummarySerializer}
    )
    def get(self, request):
        user_data = UserSummarySerializer(request.user).data
        profile_data = None
        if hasattr(request.user, 'tourist_profile'):
            profile_data = TouristProfileSerializer(request.user.tourist_profile).data
        return Response({
            "success": True,
            "data": {
                "user": user_data,
                "profile": profile_data
            }
        }, status=status.HTTP_200_OK)


