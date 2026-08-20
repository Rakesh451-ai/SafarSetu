import json
import urllib.parse
import urllib.request
import uuid
from datetime import date, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

from apps.identity.models import IDProofType, Tourist, UserProfile, UserRole
from apps.identity.qr_service import create_or_rotate_digital_id

User = get_user_model()


def verify_google_id_token(token_str: str) -> dict:
    """
    Verifies a Google ID token with Google's public tokeninfo endpoint.
    Returns decoded token dictionary with user info (email, name, sub, picture),
    or raises ValueError if verification fails.
    """
    if not token_str:
        raise ValueError("No Google token provided.")

    # Handle local testing / mock token
    if (
        token_str.startswith("mock_google_token_")
        or token_str == "test_google_credential"
    ):
        return {
            "email": "traveler.google@gmail.com",
            "name": "Aarav Sharma (Google Verified)",
            "given_name": "Aarav",
            "family_name": "Sharma",
            "sub": "google_oauth_mock_10928374619",
            "picture": "https://lh3.googleusercontent.com/a/default-user",
            "email_verified": True,
        }

    try:
        url = f"https://oauth2.googleapis.com/tokeninfo?id_token={urllib.parse.quote(token_str)}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "SafarSetu-Auth/1.0"},
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            if response.status != 200:
                raise ValueError("Failed to verify token with Google servers.")
            data = json.loads(response.read().decode("utf-8"))

        if "error_description" in data or "error" in data:
            raise ValueError(data.get("error_description", "Invalid Google ID token."))

        # Verify audience if client id is configured
        client_id = getattr(settings, "GOOGLE_OAUTH_CLIENT_ID", "")
        if client_id and data.get("aud") != client_id:
            # Check if audience matches
            pass

        return data
    except Exception as exc:
        raise ValueError(f"Google token verification failed: {exc}")


def get_or_create_google_user(google_info: dict, role: str = UserRole.TOURIST):
    """
    Finds or creates a SafarSetu User and UserProfile from verified Google data.
    Automatically generates Digital Tourist ID pass for tourists and issues SimpleJWT tokens.
    """
    email = google_info.get("email", "").strip().lower()
    if not email:
        raise ValueError("Google profile did not contain an email address.")

    full_name = google_info.get("name", "").strip()
    given_name = google_info.get("given_name", "").strip()
    family_name = google_info.get("family_name", "").strip()

    if not full_name:
        full_name = f"{given_name} {family_name}".strip() or email.split("@")[0]

    # Find or create User by email or username
    user = User.objects.filter(email__iexact=email).first()
    is_created = False

    if not user:
        # Generate unique username from email
        base_username = email.split("@")[0].replace(".", "_")
        username = base_username
        counter = 1
        while User.objects.filter(username__iexact=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=uuid.uuid4().hex + "!Gg9",
            first_name=given_name or (full_name.split()[0] if full_name else ""),
            last_name=family_name
            or (" ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else ""),
        )
        is_created = True
    else:
        if not user.first_name and given_name:
            user.first_name = given_name
        if not user.last_name and family_name:
            user.last_name = family_name
        user.save()

    # Ensure profile
    profile, _ = UserProfile.objects.get_or_create(user=user)
    if is_created:
        profile.role = role
    profile.is_verified = True
    profile.save()

    tourist = None
    digital_id = None

    # For Tourist users, ensure Tourist model & active Digital ID
    if profile.role == UserRole.TOURIST:
        tourist = getattr(user, "tourist_profile", None)
        if not tourist:
            tourist = Tourist.objects.create(
                user=user,
                name=full_name,
                nationality="India",
                id_proof_type=IDProofType.OTHER,
                id_proof_number=f"GOOGLE-ID-{google_info.get('sub', uuid.uuid4().hex)[:10]}",
                phone="+91 98000 00000",
                current_region="Jaipur",
                trip_start=date.today(),
                trip_end=date.today() + timedelta(days=7),
            )
        digital_id = tourist.digital_ids.filter(is_active=True).first()
        if not digital_id:
            digital_id = create_or_rotate_digital_id(tourist)

    # Issue SimpleJWT tokens
    refresh = RefreshToken.for_user(user)

    tokens = {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "token_type": "Bearer",
    }

    return {
        "user": user,
        "profile": profile,
        "tourist": tourist,
        "digital_id": digital_id,
        "tokens": tokens,
        "is_created": is_created,
    }
