from datetime import date, timedelta

from django.contrib.auth import get_user_model

from apps.identity.models import (
    EmergencyContact,
    IDProofType,
    Tourist,
    UserProfile,
    UserRole,
)
from apps.identity.qr_service import create_or_rotate_digital_id

User = get_user_model()

DEMO_USERS = {
    "tourist": {
        "username": "tourist_demo",
        "email": "tourist@safarsetu.gov.in",
        "password": "Tourist123!",
        "first_name": "Alex",
        "last_name": "Morgan",
        "role": UserRole.TOURIST,
        "phone": "+91 98765 43210",
        "nationality": "India",
        "id_proof_type": IDProofType.AADHAAR,
        "id_proof_number": "XXXX-XXXX-8942",
        "region_scope": "",
        "emergency_name": "Priya Sharma",
        "emergency_phone": "+91 98234 56789",
    },
    "guide": {
        "username": "guide_demo",
        "email": "guide@safarsetu.gov.in",
        "password": "Guide123!",
        "first_name": "Rajesh",
        "last_name": "Kumar",
        "role": UserRole.GUIDE,
        "phone": "+91 98123 45678",
        "nationality": "India",
        "bio": (
            "Govt. Certified Rajasthan Tourism Guide with 8+ years experience "
            "in Amber Fort, City Palace, and Jantar Mantar heritage walks."
        ),
        "languages": "English, Hindi, French, Rajasthani",
        "regions": "Jaipur, Amer, Udaipur, Jodhpur",
        "experience_years": 8,
        "hourly_rate": 850.00,
        "verified": True,
    },
    "responder": {
        "username": "responder_demo",
        "email": "responder@safarsetu.gov.in",
        "password": "Responder123!",
        "first_name": "Inspector Vikram",
        "last_name": "Singh",
        "role": UserRole.RESPONDER,
        "phone": "+91 91100 00112",
        "region_scope": "Jaipur Central & Walled City",
    },
    "admin": {
        "username": "admin_demo",
        "email": "admin@safarsetu.gov.in",
        "password": "Admin123!",
        "first_name": "Dr. Anita",
        "last_name": "Sharma",
        "role": UserRole.ADMIN,
        "phone": "+91 99999 88888",
        "region_scope": "Rajasthan State Jurisdiction",
    },
}


def get_or_create_demo_user(role_key="tourist"):
    """
    Ensures a clean demo account exists in the database for the given role key.
    """
    role_key = (role_key or "tourist").lower()
    cfg = DEMO_USERS.get(role_key, DEMO_USERS["tourist"])

    user = User.objects.filter(username=cfg["username"]).first()
    if not user:
        user = User.objects.create_user(
            username=cfg["username"],
            email=cfg["email"],
            password=cfg["password"],
            first_name=cfg["first_name"],
            last_name=cfg["last_name"],
            is_staff=(cfg["role"] == UserRole.ADMIN),
            is_superuser=(cfg["role"] == UserRole.ADMIN),
        )
    else:
        user.set_password(cfg["password"])
        user.first_name = cfg["first_name"]
        user.last_name = cfg["last_name"]
        user.email = cfg["email"]
        if cfg["role"] == UserRole.ADMIN:
            user.is_staff = True
        user.save()

    # Ensure profile
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.role = cfg["role"]
    profile.phone_number = cfg.get("phone", "")
    profile.region_scope = cfg.get("region_scope", "")
    profile.is_verified = True
    profile.emergency_contact_name = cfg.get("emergency_name", "")
    profile.emergency_contact_phone = cfg.get("emergency_phone", "")
    profile.save()

    # Role specifics
    if cfg["role"] == UserRole.TOURIST:
        tourist, _ = Tourist.objects.get_or_create(
            user=user,
            defaults={
                "name": f"{user.first_name} {user.last_name}".strip(),
                "nationality": cfg.get("nationality", "India"),
                "id_proof_type": cfg.get("id_proof_type", IDProofType.AADHAAR),
                "id_proof_number": cfg.get("id_proof_number", "XXXX-XXXX-8942"),
                "phone": cfg.get("phone", "+91 98765 43210"),
                "current_region": "Jaipur",
                "preferred_language": "en",
                "trip_start": date.today(),
                "trip_end": date.today() + timedelta(days=7),
            },
        )
        if not tourist.digital_ids.filter(is_active=True).exists():
            create_or_rotate_digital_id(tourist)

        if (
            cfg.get("emergency_name")
            and not tourist.emergency_contacts.filter(
                name=cfg["emergency_name"]
            ).exists()
        ):
            EmergencyContact.objects.create(
                tourist=tourist,
                name=cfg["emergency_name"],
                phone=cfg["emergency_phone"],
                relation="Family / Spouse",
            )

    elif cfg["role"] == UserRole.GUIDE:
        from apps.guide.models import GuideProfile

        guide, _ = GuideProfile.objects.get_or_create(
            user=user,
            defaults={
                "bio": cfg.get("bio", ""),
                "languages_spoken": cfg.get("languages", "English, Hindi"),
                "regions_served": cfg.get("regions", "Jaipur, Rajasthan"),
                "experience_years": cfg.get("experience_years", 5),
                "hourly_rate": cfg.get("hourly_rate", 800.00),
                "verified": cfg.get("verified", True),
                "rating_avg": 4.95,
            },
        )
        guide.verified = True
        guide.save()

    return user
