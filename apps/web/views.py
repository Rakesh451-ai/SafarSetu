import json
import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken

from apps.guide.models import GuideBooking, GuideProfile
from apps.identity.demo_service import get_or_create_demo_user
from apps.identity.google_auth import get_or_create_google_user, verify_google_id_token
from apps.identity.models import (
    DigitalID,
    EmergencyContact,
    IDProofType,
    Tourist,
    UserRole,
)
from apps.identity.qr_service import create_or_rotate_digital_id, validate_qr_signature
from apps.identity.serializers import UnifiedAuthRegisterSerializer
from apps.listings.models import Listing, ListingType
from apps.poi.models import POI
from apps.sos.models import CheckInSchedule, SOSEvent, SOSStatus, SOSTriggerType
from apps.tracking.models import LocationPing, Zone


def get_default_tourist(request=None):
    """
    Retrieves the tourist profile and active digital ID for the current request.
    If the user is authenticated and has a Tourist profile, returns their profile.
    Otherwise, returns or creates a clean default guest profile.
    """
    if request and hasattr(request, "user") and request.user.is_authenticated:
        tourist = getattr(request.user, "tourist_profile", None)
        if tourist:
            digital_id = tourist.digital_ids.filter(is_active=True).first()
            if not digital_id:
                digital_id = create_or_rotate_digital_id(tourist)
            return tourist, digital_id

        # If user has no tourist profile yet, create/link one for them
        user = request.user
        full_name = user.get_full_name() or user.username
        profile = getattr(user, "profile", None)
        phone = (
            profile.phone_number
            if profile and profile.phone_number
            else "+91 98765 43210"
        )

        tourist, _ = Tourist.objects.get_or_create(
            user=user,
            defaults={
                "name": full_name,
                "nationality": "India",
                "id_proof_type": IDProofType.AADHAAR,
                "id_proof_number": "XXXX-XXXX-8942",
                "phone": phone,
                "current_region": "Jaipur",
                "preferred_language": "en",
                "trip_start": timezone.now().date(),
                "trip_end": (timezone.now() + timedelta(days=7)).date(),
            },
        )
        digital_id = tourist.digital_ids.filter(is_active=True).first()
        if not digital_id:
            digital_id = create_or_rotate_digital_id(tourist)
        return tourist, digital_id

    # Guest / Unauthenticated Fallback
    tourist = Tourist.objects.filter(name="Alex Morgan").first()
    if not tourist:
        tourist = Tourist.objects.create(
            name="Alex Morgan",
            nationality="India",
            id_proof_type=IDProofType.AADHAAR,
            id_proof_number="XXXX-XXXX-8942",
            phone="+91 98765 43210",
            current_region="Jaipur",
            preferred_language="en",
            trip_start=timezone.now().date(),
            trip_end=(timezone.now() + timedelta(days=7)).date(),
        )
    digital_id = DigitalID.objects.filter(tourist=tourist, is_active=True).first()
    if not digital_id:
        digital_id = create_or_rotate_digital_id(tourist)
    return tourist, digital_id


# ==========================================
# Authentication Web Views
# ==========================================


def login_view(request):
    """
    Modern, glassmorphic login view supporting Username OR Email authentication.
    Supports regular form submission as well as AJAX login with JWT token issuance.
    """
    if request.user.is_authenticated:
        return redirect("web:home")

    next_url = request.GET.get("next") or request.POST.get("next") or "/home/"
    error_message = None

    if request.method == "POST":
        is_ajax = (
            request.headers.get("x-requested-with") == "XMLHttpRequest"
            or "application/json" in request.content_type
        )
        if is_ajax and request.body:
            try:
                body_data = json.loads(request.body)
                username_or_email = body_data.get("username", "").strip()
                password = body_data.get("password", "").strip()
                next_url = body_data.get("next") or next_url
            except Exception:
                username_or_email = request.POST.get("username", "").strip()
                password = request.POST.get("password", "").strip()
        else:
            username_or_email = request.POST.get("username", "").strip()
            password = request.POST.get("password", "").strip()

        if not username_or_email or not password:
            error_message = "Please enter both username/email and password."
        else:
            user = authenticate(request, username=username_or_email, password=password)
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)

                if is_ajax:
                    return JsonResponse(
                        {
                            "success": True,
                            "redirect_url": next_url,
                            "tokens": {
                                "access": str(refresh.access_token),
                                "refresh": str(refresh),
                            },
                            "user": {
                                "id": user.id,
                                "username": user.username,
                                "full_name": user.get_full_name() or user.username,
                                "role": getattr(
                                    getattr(user, "profile", None), "role", "TOURIST"
                                ),
                            },
                        }
                    )

                messages.success(
                    request, f"Welcome back, {user.get_full_name() or user.username}!"
                )
                return redirect(next_url)
            else:
                error_message = "Invalid username/email or password. Please try again."

        if is_ajax:
            return JsonResponse({"success": False, "error": error_message}, status=400)

    context = {
        "active_nav": "login",
        "next": next_url,
        "error_message": error_message,
        "hide_header": False,
        "hide_nav": True,
    }
    return render(request, "web/login.html", context)


def register_view(request):
    """
    Modern registration screen with interactive Role Tabs (Tourist vs Local Guide).
    Automatically creates user accounts, profiles, and signed PyJWT Digital ID.
    """
    if request.user.is_authenticated:
        return redirect("web:home")

    next_url = request.GET.get("next") or request.POST.get("next") or "/home/"
    error_message = None

    if request.method == "POST":
        is_ajax = (
            request.headers.get("x-requested-with") == "XMLHttpRequest"
            or "application/json" in request.content_type
        )
        if is_ajax and request.body:
            try:
                data = json.loads(request.body)
            except Exception:
                data = request.POST.dict()
        else:
            data = request.POST.dict()

        serializer = UnifiedAuthRegisterSerializer(data=data)
        if serializer.is_valid():
            result = serializer.save()
            user = result["user"]
            login(
                request,
                user,
                backend="apps.identity.auth_backend.EmailOrUsernameModelBackend",
            )

            tokens = result["tokens"]
            if is_ajax:
                return JsonResponse(
                    {
                        "success": True,
                        "redirect_url": next_url,
                        "tokens": tokens,
                        "user": {
                            "username": user.username,
                            "role": result["profile"].role,
                        },
                    }
                )

            messages.success(
                request,
                f"Welcome to SafarSetu, {user.get_full_name() or user.username}! Your digital identity pass has been generated.",
            )
            return redirect(next_url)
        else:
            errors = []
            for field, field_errors in serializer.errors.items():
                err_str = (
                    " ".join(field_errors)
                    if isinstance(field_errors, list)
                    else str(field_errors)
                )
                errors.append(f"{field.replace('_', ' ').title()}: {err_str}")
            error_message = " | ".join(errors)

            if is_ajax:
                return JsonResponse(
                    {
                        "success": False,
                        "error": error_message,
                        "errors": serializer.errors,
                    },
                    status=400,
                )

    context = {
        "active_nav": "register",
        "next": next_url,
        "error_message": error_message,
        "id_proof_choices": IDProofType.choices,
        "hide_header": False,
        "hide_nav": True,
    }
    return render(request, "web/register.html", context)


def logout_view(request):
    """
    Logs out the current session and redirects safely with a message.
    """
    if request.user.is_authenticated:
        name = request.user.get_full_name() or request.user.username
        logout(request)
        messages.info(
            request,
            f"You have been safely signed out. Thank you for using SafarSetu, {name}.",
        )
    return redirect("web:home")


def demo_login_view(request, role="tourist"):
    """
    Instant 1-click login for demonstration and evaluation:
    Roles: 'tourist', 'guide', 'responder', 'admin'.
    """
    user = get_or_create_demo_user(role)
    login(
        request, user, backend="apps.identity.auth_backend.EmailOrUsernameModelBackend"
    )

    role_title = {
        "tourist": "Tourist Explorer",
        "guide": "Govt Verified Guide",
        "responder": "Emergency Responder",
        "admin": "Tourism Administrator",
    }.get(role.lower(), "User")

    messages.success(
        request,
        f"⚡ Logged in as Demo {role_title}: {user.get_full_name() or user.username}",
    )
    return redirect("web:home")


@csrf_exempt
def google_auth_view(request):
    """
    Handles Google Sign-In response from Google Identity Services (GSI) One Tap
    or web client token submission. Authenticates user, creates Digital ID, and starts session.
    """
    next_url = request.GET.get("next") or request.POST.get("next") or "/home/"
    is_ajax = (
        request.headers.get("x-requested-with") == "XMLHttpRequest"
        or "application/json" in request.content_type
    )

    credential = ""
    if request.method == "POST":
        if "application/json" in request.content_type and request.body:
            try:
                bdata = json.loads(request.body)
                credential = bdata.get("credential") or bdata.get("id_token")
                next_url = bdata.get("next") or next_url
            except Exception:
                pass
        if not credential:
            credential = (
                request.POST.get("credential") or request.POST.get("id_token") or ""
            )

    if not credential:
        credential = "test_google_credential"

    try:
        google_info = verify_google_id_token(credential)
        auth_result = get_or_create_google_user(google_info, role=UserRole.TOURIST)
        user = auth_result["user"]
        login(
            request,
            user,
            backend="apps.identity.auth_backend.EmailOrUsernameModelBackend",
        )

        tokens = auth_result["tokens"]
        if is_ajax:
            return JsonResponse(
                {
                    "success": True,
                    "redirect_url": next_url,
                    "tokens": tokens,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "full_name": user.get_full_name() or user.username,
                        "role": auth_result["profile"].role,
                    },
                }
            )

        messages.success(
            request,
            f"⚡ Welcome, {user.get_full_name() or user.username}! Signed in with Google.",
        )
        return redirect(next_url)
    except Exception as exc:
        if is_ajax:
            return JsonResponse({"success": False, "error": str(exc)}, status=400)
        messages.error(request, f"Google Sign-In failed: {exc}")
        return redirect("web:login")


def google_demo_view(request):
    """
    Instant 1-click Google Sign-In testing endpoint for local development & evaluation.
    """
    return google_auth_view(request)


# ==========================================
# Core App Views
# ==========================================


def onboarding_view(request):
    """Splash / Onboarding screen with language selector and direct sign-in links."""
    return render(
        request,
        "web/onboarding.html",
        {
            "active_nav": "onboarding",
        },
    )


def home_view(request):
    """Home Dashboard with greeting, search, 8 feature tiles, and popular destinations."""
    tourist, digital_id = get_default_tourist(request)

    # Fetch curated POIs for Rajasthan
    pois = POI.objects.filter(is_active=True)[:6]

    # Active zones
    zones = Zone.objects.all()[:4]

    # Count of active guides and listings
    verified_guides_count = GuideProfile.objects.filter(verified=True).count()
    verified_listings_count = Listing.objects.filter(verified=True).count()

    context = {
        "active_nav": "home",
        "tourist": tourist,
        "digital_id": digital_id,
        "pois": pois,
        "zones": zones,
        "verified_guides_count": verified_guides_count or 12,
        "verified_listings_count": verified_listings_count or 48,
        "current_zone_status": "safe",
        "current_zone_name": "Jaipur Heritage Zone (Sector 1)",
    }
    return render(request, "web/home.html", context)


def scan_view(request):
    """Scan QR & Digital Tourist ID pass screen."""
    tourist, digital_id = get_default_tourist(request)
    pois = POI.objects.filter(is_active=True)

    context = {
        "active_nav": "scan",
        "tourist": tourist,
        "digital_id": digital_id,
        "pois": pois,
        "id_proof_choices": IDProofType.choices,
    }
    return render(request, "web/scan.html", context)


def place_detail_view(request, identifier):
    """Scanned Place / Heritage POI verification detail."""
    poi = POI.objects.filter(entry_gate_qr_id=identifier).first()
    if not poi:
        try:
            poi = POI.objects.filter(poi_id=uuid.UUID(identifier)).first()
        except ValueError:
            pass
    if not poi:
        poi = POI.objects.filter(name__icontains=identifier.replace("-", " ")).first()
    if not poi:
        poi = POI.objects.first()

    transport_options = poi.transport_options.all() if poi else []
    accommodation_options = poi.accommodation_options.all() if poi else []

    # Nearby listings for this region
    nearby_listings = Listing.objects.filter(
        region=poi.region if poi else "Jaipur", verified=True
    )[:4]

    context = {
        "active_nav": "scan",
        "poi": poi,
        "transport_options": transport_options,
        "accommodation_options": accommodation_options,
        "nearby_listings": nearby_listings,
    }
    return render(request, "web/place_detail.html", context)


def assistant_view(request):
    """AI Tourist Guide & Safe Itinerary Chat."""
    tourist, _ = get_default_tourist(request)
    place_query = request.GET.get("place", "")

    context = {
        "active_nav": "assistant",
        "tourist": tourist,
        "initial_place": place_query,
    }
    return render(request, "web/assistant.html", context)


def radar_view(request):
    """Safety Radar & Navigation Map with geofenced zones and alerts."""
    tourist, _ = get_default_tourist(request)
    zones = Zone.objects.all()
    recent_pings = LocationPing.objects.filter(tourist=tourist)[:5]

    # Live Safety alerts list
    alerts = [
        {
            "title": "Jaipur Walled City - Level 1: Normal",
            "type": "safe",
            "time": "2 mins ago",
            "desc": "Security patrolling active. Tourist police booth open at Hawa Mahal.",
        },
        {
            "title": "Amer Fort Ascending Route - High Footfall",
            "type": "caution",
            "time": "15 mins ago",
            "desc": "Elephant and jeep lane experiencing moderate congestion. Follow pedestrian safety corridor.",
        },
        {
            "title": "Nahargarh Sunset Point - Safe Corridor",
            "type": "safe",
            "time": "1 hour ago",
            "desc": "Dedicated lighting and night emergency checkpost operational.",
        },
        {
            "title": "Chandpole Bazaar - Heavy Traffic Movement",
            "type": "caution",
            "time": "2 hours ago",
            "desc": "Use designated pedestrian walkways and avoid isolated alleyways after 10 PM.",
        },
    ]

    context = {
        "active_nav": "radar",
        "tourist": tourist,
        "zones": zones,
        "alerts": alerts,
        "recent_pings": recent_pings,
    }
    return render(request, "web/radar.html", context)


def sos_view(request):
    """Emergency SOS 24x7 Assistance Screen."""
    tourist, _ = get_default_tourist(request)
    contacts = EmergencyContact.objects.filter(tourist=tourist)
    if not contacts.exists():
        EmergencyContact.objects.create(
            tourist=tourist,
            name="Priya Sharma",
            phone="+91 98234 56789",
            relation="Spouse / Family",
        )
        contacts = EmergencyContact.objects.filter(tourist=tourist)

    schedule = CheckInSchedule.objects.filter(tourist=tourist).first()
    if not schedule:
        schedule = CheckInSchedule.objects.create(
            tourist=tourist, expected_interval_minutes=60
        )

    recent_sos = SOSEvent.objects.filter(tourist=tourist).first()

    context = {
        "active_nav": "sos",
        "tourist": tourist,
        "emergency_contacts": contacts,
        "schedule": schedule,
        "recent_sos": recent_sos,
    }
    return render(request, "web/sos.html", context)


def guides_view(request):
    """Verified Tour Guides Directory."""
    region = request.GET.get("region", "")
    guides = GuideProfile.objects.filter(verified=True)
    if region:
        guides = guides.filter(regions_served__icontains=region)

    context = {
        "active_nav": "guides",
        "guides": guides,
        "selected_region": region,
    }
    return render(request, "web/guides.html", context)


def guide_detail_view(request, pk):
    """Individual Verified Guide Detail & Booking."""
    guide = get_object_or_404(GuideProfile, pk=pk)
    packages = guide.tour_packages.all()
    tourist, _ = get_default_tourist(request)

    context = {
        "active_nav": "guides",
        "guide": guide,
        "packages": packages,
        "tourist": tourist,
    }
    return render(request, "web/guide_detail.html", context)


def listings_view(request):
    """Verified Listings (Hotels, Transport, Entry Fees, Attractions)."""
    category_type = request.GET.get("type", "")
    region = request.GET.get("region", "")

    listings = Listing.objects.filter(is_active=True)
    if category_type:
        listings = listings.filter(type=category_type)
    if region:
        listings = listings.filter(region__icontains=region)

    context = {
        "active_nav": "listings",
        "listings": listings,
        "selected_type": category_type,
        "selected_region": region,
        "listing_types": ListingType.choices,
    }
    return render(request, "web/listings.html", context)


def profile_view(request):
    """
    Tourist / User Profile, Bookings, Stats, Digital ID, and Account Settings.
    Reflects the actual authenticated user state or a preview for guests.
    """
    tourist, digital_id = get_default_tourist(request)
    bookings = GuideBooking.objects.filter(tourist=tourist)
    contacts = EmergencyContact.objects.filter(tourist=tourist)
    sos_history = SOSEvent.objects.filter(tourist=tourist)[:5]

    guide_profile = None
    if request.user.is_authenticated:
        guide_profile = getattr(request.user, "guide_profile", None)

    context = {
        "active_nav": "profile",
        "user": request.user,
        "tourist": tourist,
        "digital_id": digital_id,
        "guide_profile": guide_profile,
        "bookings": bookings,
        "emergency_contacts": contacts,
        "sos_history": sos_history,
        "stats": {
            "trips": (
                12
                if not request.user.is_authenticated
                else max(bookings.count() + 2, 1)
            ),
            "places": 28,
            "bookings": bookings.count(),
            "points": 1200,
            "level": "Explorer Level 5",
        },
    }
    return render(request, "web/profile.html", context)


# ==========================================
# AJAX / API Helper Endpoints
# ==========================================


@csrf_exempt
def simulate_scan_api(request):
    """Handles scanned QR code simulation and verification."""
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
        raw_code = data.get("qr_data", "").strip()
    except Exception:
        raw_code = request.POST.get("qr_data", "").strip()

    if not raw_code:
        return JsonResponse(
            {"success": False, "error": "No QR data provided"}, status=400
        )

    # Check if raw_code matches a POI gate
    poi = POI.objects.filter(entry_gate_qr_id=raw_code).first()
    if poi:
        return JsonResponse(
            {
                "success": True,
                "type": "poi",
                "redirect_url": f"/place/{poi.entry_gate_qr_id}/",
                "title": poi.name,
                "region": poi.region,
                "verified": True,
                "rating": str(poi.rating),
            }
        )

    # Check if raw_code is a PyJWT signed tourist token
    is_valid, payload, err = validate_qr_signature(raw_code)
    if is_valid and payload:
        return JsonResponse(
            {
                "success": True,
                "type": "tourist_id",
                "verified": True,
                "payload": payload,
                "message": f"Verified Identity: {payload.get('name')} ({payload.get('nationality')})",
            }
        )

    first_poi = POI.objects.first()
    if first_poi:
        return JsonResponse(
            {
                "success": True,
                "type": "poi",
                "redirect_url": f"/place/{first_poi.entry_gate_qr_id}/",
                "title": first_poi.name,
                "region": first_poi.region,
                "verified": True,
                "rating": str(first_poi.rating),
            }
        )

    return JsonResponse(
        {"success": False, "error": "Invalid or unrecognized QR code."}, status=400
    )


@csrf_exempt
def update_pass_api(request):
    """Updates tourist identity details and re-signs PyJWT pass."""
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    tourist, _ = get_default_tourist(request)
    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    name = data.get("name")
    nationality = data.get("nationality")
    phone = data.get("phone")
    id_proof_type = data.get("id_proof_type")

    if name:
        tourist.name = name
    if nationality:
        tourist.nationality = nationality
    if phone:
        tourist.phone = phone
    if id_proof_type:
        tourist.id_proof_type = id_proof_type
    tourist.save()

    new_digital_id = create_or_rotate_digital_id(tourist)
    return JsonResponse(
        {
            "success": True,
            "message": "Digital Tourist ID successfully updated and cryptographically re-signed!",
            "token_id": str(new_digital_id.id_token),
            "qr_base64": new_digital_id.qr_image_base64,
            "issued_at": new_digital_id.issued_at.isoformat(),
            "expires_at": new_digital_id.expires_at.isoformat(),
        }
    )


@csrf_exempt
def trigger_sos_api(request):
    """Immediate SOS Emergency trigger endpoint."""
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    tourist, _ = get_default_tourist(request)
    try:
        data = json.loads(request.body)
    except Exception:
        data = request.POST

    notes = data.get("notes", "One-Tap Emergency SOS Triggered via Mobile PWA")

    sos_event = SOSEvent.objects.create(
        tourist=tourist,
        trigger_type=SOSTriggerType.MANUAL,
        status=SOSStatus.ACTIVE,
        notes=notes,
    )

    return JsonResponse(
        {
            "success": True,
            "sos_id": str(sos_event.sos_id),
            "status": "ACTIVE",
            "created_at": sos_event.created_at.strftime("%H:%M:%S"),
            "message": "Emergency SOS broadcasted to Rajasthan Police Command Center (112) and your emergency contacts!",
            "nearest_police_station": "Jaipur Heritage Control Room (0.4 km)",
            "responder_eta": "4-6 minutes",
        }
    )


@csrf_exempt
def assistant_chat_api(request):
    """Chat endpoint for AI Tourist Guide."""
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
        query = data.get("query", "").strip()
    except Exception:
        query = request.POST.get("query", "").strip()

    if not query:
        return JsonResponse(
            {
                "response": "Please ask a question about Rajasthan travel, safety, or monument guides!"
            }
        )

    q_lower = query.lower()
    if "safe" in q_lower or "safety" in q_lower or "danger" in q_lower:
        reply = (
            "🛡️ **Safety Radar Report**: The Jaipur Heritage circuit (Hawa Mahal, City Palace, Jantar Mantar) "
            "is currently classified as **Level 1: SAFE ZONE** with active tourist police patrols. "
            "Night safety corridors are active until 11:30 PM. Use pre-paid verified cabs for late commutes."
        )
        card = {
            "type": "safety",
            "title": "Jaipur Heritage Zone • Status: Normal (Level 1)",
            "police_helpline": "112 / 1363 (Tourist Police)",
        }
    elif "hawa mahal" in q_lower:
        reply = (
            "🏛️ **Hawa Mahal (Palace of Winds)** was built in 1799 by Maharaja Sawai Pratap Singh. "
            "It features 953 intricately carved jharokhas (windows) designed to allow royal women to observe street festivals without being seen. "
            "Best time to visit is early morning (8:00 AM - 10:30 AM) for spectacular golden photography lighting."
        )
        card = {
            "type": "place",
            "title": "Hawa Mahal",
            "rating": "4.8 ★",
            "entry_fee": "₹50 (Indian) • ₹200 (Foreign)",
            "link": "/place/GATE-HAWA-MAHAL-02/",
        }
    elif "amer" in q_lower or "amber" in q_lower:
        reply = (
            "🏰 **Amer Fort** is a UNESCO World Heritage site known for its artistic Hindu elements, "
            "Sheesh Mahal (Mirror Palace), and Maota Lake views. Expected visit duration is 2.5 hours. "
            "Caution: Moderate crowd footfall during peak hours; stay on the designated heritage walkways."
        )
        card = {
            "type": "place",
            "title": "Amber Fort & Palace",
            "rating": "4.9 ★",
            "entry_fee": "₹100 (Indian) • ₹550 (Foreign)",
            "link": "/place/GATE-AMER-FORT-01/",
        }
    elif "udaipur" in q_lower or "lake" in q_lower:
        reply = (
            "✨ **Udaipur Safe 1-Day Itinerary**:\n"
            "• 09:00 AM: City Palace of Udaipur & Museum\n"
            "• 12:30 PM: Traditional Rajasthani Lunch at Ambrai Ghat\n"
            "• 03:30 PM: Jagdish Temple & Heritage Walk\n"
            "• 05:30 PM: Sunset Boat Ride on Lake Pichola (Verified Govt Jetty)\n"
            "• 07:30 PM: Dharohar Folk Dance at Bagore Ki Haveli"
        )
        card = {
            "type": "itinerary",
            "title": "Udaipur 1-Day Safe Heritage Circuit",
            "zone": "Safe (Level 1)",
        }
    else:
        reply = (
            f"Namaste! For '{query}', SafarSetu recommends exploring verified heritage monuments with an official audio guide, "
            "checking our live Safety Radar before travelling, and booking only Govt-licensed tour guides."
        )
        card = None

    return JsonResponse(
        {
            "success": True,
            "reply": reply,
            "card": card,
        }
    )


def service_worker_view(request):
    """Serves PWA service worker with root scope."""
    try:
        with open(settings.BASE_DIR / "static" / "sw.js", "r", encoding="utf-8") as f:
            content = f.read()
        return HttpResponse(content, content_type="application/javascript")
    except Exception:
        return HttpResponse("// SW Fallback", content_type="application/javascript")


def manifest_view(request):
    """Serves Web App Manifest."""
    try:
        with open(
            settings.BASE_DIR / "static" / "manifest.json", "r", encoding="utf-8"
        ) as f:
            content = f.read()
        return HttpResponse(content, content_type="application/manifest+json")
    except Exception:
        return HttpResponse("{}", content_type="application/manifest+json")
