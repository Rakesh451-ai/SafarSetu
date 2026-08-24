from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model

from accounts.models import User
from tourists.models import TouristProfile, EmergencyContact
from destinations.models import Destination, AudioGuideTrack, DestinationReview, NearbyAttraction
from safety.models import SafetyZone, SafetyAlert
from services.models import VerifiedService
from journeys.models import Journey, JourneyLocation, CheckInSchedule
from itinerary.models import Itinerary, ItineraryItem
from emergency.models import EmergencyIncident
from notifications.models import Notification


class Command(BaseCommand):
    help = "Populate realistic database seed data for SafarSetu backend."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding SafarSetu database..."))

        # 1. Create Admin User
        admin_user, created = User.objects.get_or_create(
            email="admin@safarsetu.gov.in",
            defaults={
                "username": "admin@safarsetu.gov.in",
                "first_name": "SafarSetu",
                "last_name": "Administrator",
                "phone": "+91 11 2345 6789",
                "role": User.Role.ADMIN,
                "preferred_language": User.Language.EN,
                "is_staff": True,
                "is_superuser": True,
            }
        )
        if created:
            admin_user.set_password("Admin@12345")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("✓ Admin user created: admin@safarsetu.gov.in"))

        # 2. Create Response Operator User
        operator_user, created = User.objects.get_or_create(
            email="operator@safarsetu.gov.in",
            defaults={
                "username": "operator@safarsetu.gov.in",
                "first_name": "Vikram",
                "last_name": "Pratap (UP Tourist Police)",
                "phone": "+91 562 242 1204",
                "role": User.Role.RESPONSE_OPERATOR,
                "preferred_language": User.Language.HI,
                "is_staff": True,
            }
        )
        if created:
            operator_user.set_password("Operator@12345")
            operator_user.save()
            self.stdout.write(self.style.SUCCESS("✓ Response Operator created: operator@safarsetu.gov.in"))

        # 3. Create Demo Tourist 1: Aarav Sharma
        tourist1_user, created = User.objects.get_or_create(
            email="aarav.sharma@traveler.in",
            defaults={
                "username": "aarav.sharma@traveler.in",
                "first_name": "Aarav",
                "last_name": "Sharma",
                "phone": "+91 98765 43210",
                "role": User.Role.TOURIST,
                "preferred_language": User.Language.EN,
            }
        )
        if created:
            tourist1_user.set_password("Tourist@12345")
            tourist1_user.save()

        profile1, _ = TouristProfile.objects.get_or_create(
            user=tourist1_user,
            defaults={
                "digital_id": "SS-IND-2026-8849",
                "full_name": "Aarav Sharma",
                "email": "aarav.sharma@traveler.in",
                "phone": "+91 98765 43210",
                "nationality": "Indian",
                "passport_hash": "P••••••••3291",
                "aadhaar_hash": "XXXX-XXXX-4819",
                "gender": "Male",
                "dob": "1998-04-12",
                "blood_group": "O+ Positive",
                "medical_notes": "No known allergies. Asthalin inhaler carried as precaution.",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
                "verification_status": "verified",
                "verified_by": "Ministry of Tourism, Govt of India & UP Tourist Police",
                "safety_status": "safe",
                "check_in_due_minutes": 32,
                "last_check_in_location": "14 minutes ago (Taj East Gate Geofence)",
                "last_latitude": 27.1751,
                "last_longitude": 78.0421,
            }
        )

        EmergencyContact.objects.get_or_create(
            tourist=profile1,
            phone="+91 98112 34567",
            defaults={
                "name": "Dr. Priya Sharma",
                "relationship": "Sister / Next of Kin",
                "email": "priya.sharma@aiims.edu",
                "is_primary": True,
            }
        )
        EmergencyContact.objects.get_or_create(
            tourist=profile1,
            phone="+91 99201 88472",
            defaults={
                "name": "Rohan Verma",
                "relationship": "Travel Companion",
                "email": "rohan.v@outlook.com",
                "is_primary": False,
            }
        )

        # 4. Create Demo Tourist 2: Sophie Van Der Berg (International)
        tourist2_user, created = User.objects.get_or_create(
            email="sophie.vdb@traveler.org",
            defaults={
                "username": "sophie.vdb@traveler.org",
                "first_name": "Sophie",
                "last_name": "Van Der Berg",
                "phone": "+31 6 1234 5678",
                "role": User.Role.TOURIST,
                "preferred_language": User.Language.EN,
            }
        )
        if created:
            tourist2_user.set_password("Tourist@12345")
            tourist2_user.save()

        profile2, _ = TouristProfile.objects.get_or_create(
            user=tourist2_user,
            defaults={
                "digital_id": "SS-INT-2026-3104",
                "full_name": "Sophie Van Der Berg",
                "email": "sophie.vdb@traveler.org",
                "phone": "+31 6 1234 5678",
                "nationality": "Netherlands",
                "passport_hash": "N••••••••9901",
                "aadhaar_hash": "N/A (Foreign Tourist E-Visa #IND-2026-9481)",
                "gender": "Female",
                "blood_group": "A+ Positive",
                "medical_notes": "Mild lactose sensitivity.",
                "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
                "verification_status": "verified",
                "verified_by": "Bureau of Immigration, Govt of India",
                "safety_status": "safe",
                "check_in_due_minutes": 55,
                "last_check_in_location": "Varanasi Ghats Police Checkpoint",
                "last_latitude": 25.3076,
                "last_longitude": 83.0107,
            }
        )

        # 5. Seed Destinations
        dest_taj, _ = Destination.objects.get_or_create(
            slug="taj-mahal",
            defaults={
                "name": "Taj Mahal",
                "tagline": "The Epitome of Mughal Architecture & Eternal Love",
                "city": "Agra",
                "state": "Uttar Pradesh",
                "category": "heritage",
                "rating": 4.9,
                "reviews_count": 14820,
                "safety_rating": 4.8,
                "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80",
                ],
                "description": "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife Mumtaz Mahal. It is one of the universally admired masterpieces of the world heritage.",
                "history": "Commissioned in 1631 by Mughal Emperor Shah Jahan, over 20,000 artisans worked for 22 years to complete the ivory-white marble complex on the south bank of the Yamuna river.",
                "opening_hours": "Sunrise to Sunset (Closed on Fridays)",
                "best_time_to_visit": "October to March (Sunrise viewing recommended)",
                "entry_fee": {"domestic": 50, "international": 1100, "camera": 25},
                "accessibility": {
                    "wheelchairAccessible": True,
                    "audioAssistance": True,
                    "brailleSignage": True,
                    "batteryCars": True,
                    "specialWashrooms": True,
                },
                "facilities": [
                    "Tourist Information Center",
                    "Battery-operated Golf Carts from Shilpgram",
                    "Shoe Covers Provided",
                    "RO Drinking Water Stations",
                    "Cloakroom / Locker facility",
                    "Govt-certified Audio Guides",
                    "First Aid & Emergency Booth (East/West Gates)",
                ],
                "safety_guidelines": [
                    "Cigarettes, lighters, tripods, and large bags are prohibited inside.",
                    "Always hire official UP Tourism & ASI badge-holding tourist guides.",
                    "Use designated battery golf carts to avoid unauthorized vendors.",
                    "Emergency SOS booths with direct connection to Agra Tourist Police stationed at both gates.",
                ],
                "dos_and_donts": {
                    "dos": [
                        "Book online tickets through SafarSetu or ASI portal to skip queues",
                        "Carry valid photo identity proof",
                        "Wear comfortable slip-on footwear or use provided shoe covers",
                    ],
                    "donts": [
                        "Do not touch or lean on delicate Pietra Dura marble inlay work",
                        "No drone cameras (Strict No-Fly Heritage Zone)",
                        "No photography inside the main crypt chamber",
                    ],
                },
                "weather": {"temp": 29, "condition": "Clear & Sunny", "aqi": 94, "aqiStatus": "Satisfactory"},
                "crowd_status": "moderate",
                "crowd_percentage": 62,
                "latitude": 27.1751,
                "longitude": 78.0421,
                "qr_code": "SAFARSETU-POI-AGR-001",
                "panorama_url": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80",
                "verification_status": "verified",
            }
        )

        AudioGuideTrack.objects.get_or_create(
            destination=dest_taj,
            language="English",
            defaults={
                "title": "The Architectural Marvel of Taj Mahal",
                "duration": "14:20",
                "duration_seconds": 860,
                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
                "transcript": "Welcome to the Taj Mahal. As you pass through the magnificent red sandstone Darwaza-i-Rauza (Main Gateway), you will witness the shimmering white marble dome aligning with the four minarets...",
            }
        )

        AudioGuideTrack.objects.get_or_create(
            destination=dest_taj,
            language="हिन्दी (Hindi)",
            defaults={
                "title": "ताजमहल की वास्तुकला और अमर प्रेम गाथा",
                "duration": "15:10",
                "duration_seconds": 910,
                "audio_url": "https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg",
                "transcript": "ताजमहल में आपका स्वागत है। मुख्य द्वार से प्रवेश करते ही यमुना नदी के तट पर संगमरमर का यह अद्भूत स्मारक आपके सामने प्रस्तुत होता है...",
            }
        )

        DestinationReview.objects.get_or_create(
            destination=dest_taj,
            author="Ananya Deshmukh",
            defaults={
                "nationality": "Indian",
                "rating": 5,
                "date": "Aug 2026",
                "comment": "Mesmerizing at sunrise! Using SafarSetu made entering through the East Gate seamless with no touts.",
                "verified_stay": True,
            }
        )

        NearbyAttraction.objects.get_or_create(
            destination=dest_taj,
            name="Agra Fort",
            defaults={"distance": "2.5 km", "image": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80"}
        )
        NearbyAttraction.objects.get_or_create(
            destination=dest_taj,
            name="Mehtab Bagh",
            defaults={"distance": "1.2 km (River View)", "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80"}
        )

        # Additional Destinations
        dest_amber, _ = Destination.objects.get_or_create(
            slug="amber-fort",
            defaults={
                "name": "Amber Palace & Fort",
                "tagline": "Majestic Hilltop Fortress with Sheesh Mahal",
                "city": "Jaipur",
                "state": "Rajasthan",
                "category": "heritage",
                "rating": 4.8,
                "reviews_count": 9230,
                "safety_rating": 4.8,
                "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
                "gallery": ["https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"],
                "description": "Constructed of red sandstone and marble, the fort overlooks the Maota Lake. Known for its artistic Hindu elements and the dazzling Mirror Palace (Sheesh Mahal).",
                "history": "Built by Raja Man Singh I in 1592 and expanded by Mirza Raja Jai Singh, Amber served as the Rajput stronghold before the capital moved to Jaipur in 1727.",
                "opening_hours": "08:00 AM – 05:30 PM & Night Tourism 06:30 PM – 09:15 PM",
                "best_time_to_visit": "November to February",
                "entry_fee": {"domestic": 100, "international": 550, "camera": 50},
                "accessibility": {"wheelchairAccessible": True, "audioAssistance": True, "batteryCars": True},
                "facilities": ["RTDC Verified Guides", "Jeep Shuttles", "Audio Guide Desk", "Restrooms"],
                "safety_guidelines": ["Stay on marked ramparts.", "Do not lean over battlements."],
                "dos_and_donts": {"dos": ["Take government jeep shuttle from base"], "donts": ["Avoid unauthorized parking hawkers"]},
                "weather": {"temp": 32, "condition": "Sunny", "aqi": 82, "aqiStatus": "Moderate"},
                "crowd_status": "moderate",
                "crowd_percentage": 55,
                "latitude": 26.9855,
                "longitude": 75.8513,
                "qr_code": "SAFARSETU-POI-JAI-001",
                "verification_status": "verified",
            }
        )

        dest_citypalace, _ = Destination.objects.get_or_create(
            slug="city-palace-jaipur",
            defaults={
                "name": "City Palace Jaipur",
                "tagline": "Royal Residence of the Maharajas of Jaipur",
                "city": "Jaipur",
                "state": "Rajasthan",
                "category": "heritage",
                "rating": 4.7,
                "reviews_count": 6420,
                "safety_rating": 4.9,
                "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
                "description": "A magnificent blend of Rajasthani and Mughal architecture in the center of the Old City.",
                "opening_hours": "09:30 AM – 05:00 PM",
                "entry_fee": {"domestic": 200, "international": 700, "camera": 100},
                "latitude": 26.9258,
                "longitude": 75.8237,
                "qr_code": "SAFARSETU-POI-JAI-002",
                "verification_status": "verified",
            }
        )

        dest_qutub, _ = Destination.objects.get_or_create(
            slug="qutub-minar",
            defaults={
                "name": "Qutub Minar Complex",
                "tagline": "The World's Tallest Brick Minaret and Iron Pillar of Delhi",
                "city": "New Delhi",
                "state": "Delhi",
                "category": "heritage",
                "rating": 4.75,
                "reviews_count": 11300,
                "safety_rating": 4.9,
                "image": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80",
                "description": "73-metre high tower of victory begun by Qutb-ud-din Aibak in 1192 surrounded by ancient Indo-Islamic monuments.",
                "opening_hours": "07:00 AM – 07:00 PM",
                "entry_fee": {"domestic": 40, "international": 600, "camera": 25},
                "latitude": 28.5244,
                "longitude": 77.1855,
                "qr_code": "SAFARSETU-POI-DEL-001",
                "verification_status": "verified",
            }
        )

        dest_varanasi, _ = Destination.objects.get_or_create(
            slug="varanasi-ghats",
            defaults={
                "name": "Dashashwamedh Ghat Riverfront",
                "tagline": "Sacred Ganga Aarti & Ancient Ghats of Kashi",
                "city": "Varanasi",
                "state": "Uttar Pradesh",
                "category": "spiritual",
                "rating": 4.9,
                "reviews_count": 18900,
                "safety_rating": 4.6,
                "image": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
                "description": "The main and most vibrant riverfront ghat in Varanasi where the grand Maha Aarti is performed every sunset.",
                "opening_hours": "Open 24 Hours (Aarti at 06:45 PM)",
                "entry_fee": {"domestic": 0, "international": 0, "camera": 0},
                "latitude": 25.3076,
                "longitude": 83.0107,
                "qr_code": "SAFARSETU-POI-VAR-001",
                "verification_status": "verified",
            }
        )

        # 6. Seed Safety Zones
        SafetyZone.objects.get_or_create(
            name="Taj Mahal Protected Heritage Corridor",
            defaults={
                "description": "Strict non-motorized vehicle zone with constant CISF and UP Tourist Police surveillance. Zero vehicular pollution area.",
                "zone_type": "safe",
                "severity": "low",
                "center_latitude": 27.1751,
                "center_longitude": 78.0421,
                "polygon_coordinates": [
                    [27.1795, 78.0370],
                    [27.1795, 78.0475],
                    [27.1700, 78.0475],
                    [27.1700, 78.0370],
                ],
                "active_advisory": "Safe & monitored. Battery vehicles available freely between Shilpgram and Taj Gates.",
                "tourist_count": 3420,
                "is_active": True,
            }
        )

        SafetyZone.objects.get_or_create(
            name="Fatehabad Road Commercial Strip",
            defaults={
                "description": "Heavy evening tourist traffic and construction near metro phase-2 corridor.",
                "zone_type": "caution",
                "severity": "medium",
                "center_latitude": 27.1590,
                "center_longitude": 78.0350,
                "polygon_coordinates": [
                    [27.1640, 78.0280],
                    [27.1640, 78.0420],
                    [27.1540, 78.0420],
                    [27.1540, 78.0280],
                ],
                "active_advisory": "⚠️ Caution Alert: High traffic density reported between 05:00 PM and 08:30 PM. Use Inner Ring Road bypass for quicker travel.",
                "tourist_count": 1850,
                "is_active": True,
            }
        )

        SafetyZone.objects.get_or_create(
            name="Yamuna North Riverbed (Unlit Sandbar Area)",
            defaults={
                "description": "Unpatrolled isolated flood plain terrain north of river bend. Not recommended after sunset.",
                "zone_type": "danger",
                "severity": "critical",
                "center_latitude": 27.1810,
                "center_longitude": 78.0460,
                "polygon_coordinates": [
                    [27.1850, 78.0400],
                    [27.1850, 78.0520],
                    [27.1780, 78.0520],
                    [27.1780, 78.0400],
                ],
                "active_advisory": "⛔ DANGER WARNING: Isolated unlit riverbank. No authorized tourist activity permitted here. Return to Mehtab Bagh gardens.",
                "tourist_count": 12,
                "is_active": True,
            }
        )

        # 7. Seed Safety Alerts
        SafetyAlert.objects.get_or_create(
            title="Heavy Traffic Density & Metro Construction",
            location_name="Fatehabad Road (East Gate Approach), Agra",
            defaults={
                "description": "Metro construction work on central lanes between TDI Mall and Shilpgram. Expect 15-20 min delays during evening hours.",
                "alert_type": "caution",
                "severity": "medium",
                "latitude": 27.1610,
                "longitude": 78.0365,
                "alternative_route": "Take the Taj East Drain Road via VIP Ring Road",
                "is_active": True,
                "expires_at": timezone.now() + timedelta(days=7),
            }
        )

        SafetyAlert.objects.get_or_create(
            title="Flash Monsoon Water Flow Advisory",
            location_name="Yamuna Ghat Low-lying Steps, Agra",
            defaults={
                "description": "River water level elevated following upstream release. Stay behind safety railings near Dussehra Ghat.",
                "alert_type": "danger",
                "severity": "high",
                "latitude": 27.1730,
                "longitude": 78.0450,
                "alternative_route": "Use elevated monument viewing platforms only",
                "is_active": True,
                "expires_at": timezone.now() + timedelta(days=3),
            }
        )

        # 8. Seed Verified Services
        VerifiedService.objects.get_or_create(
            service_id="srv-guide-1",
            defaults={
                "title": "Certified Master Heritage Guide — Agra & Fatehpur Sikri",
                "service_type": "guide",
                "provider": "Rashid Khan (ASI License #UP-AGR-4421)",
                "license_number": "ASI-GOI-2024-8849",
                "location": "Agra, Uttar Pradesh",
                "rating": 4.95,
                "reviews_count": 340,
                "price": 1800,
                "price_unit": "per 4-hour tour",
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                "badge": "✓ SafarSetu Verified Guide",
                "facilities": ["Govt ASI License", "First Aid Certified", "Custom Photography Assistance"],
                "accessibility": ["Sign Language Basics", "Assisted Wheelchair Routing"],
                "languages": ["English", "हिन्दी", "Français", "Español"],
                "experience_years": 14,
                "is_verified": True,
            }
        )

        VerifiedService.objects.get_or_create(
            service_id="srv-hotel-1",
            defaults={
                "title": "Heritage Haveli Hotel & Spa (Zero Hidden Fees)",
                "service_type": "hotel",
                "provider": "Alsisar Haveli Hospitality Ltd.",
                "license_number": "HR-RAJ-2022-9901",
                "location": "Sansar Chandra Road, Pink City, Jaipur",
                "rating": 4.85,
                "reviews_count": 890,
                "price": 6500,
                "price_unit": "per night",
                "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
                "badge": "✓ SafarSetu Verified Stay",
                "facilities": ["24x7 Security & CCTV", "Swimming Pool", "Doctor On Call", "Free High-speed Wi-Fi"],
                "accessibility": ["Ground Floor Rooms", "Grab Bars in Bathroom"],
                "is_verified": True,
            }
        )

        # 9. Seed Journeys & Check-ins for Aarav Sharma
        journey_golden, _ = Journey.objects.get_or_create(
            tourist=profile1,
            name="Golden Triangle & Royal Rajasthan Circuit",
            defaults={
                "start_date": timezone.now().date() - timedelta(days=3),
                "end_date": timezone.now().date() + timedelta(days=4),
                "current_city": "Agra",
                "state": "Uttar Pradesh",
                "status": "ACTIVE",
                "visited_count": 4,
                "total_count": 9,
                "expected_check_in_time": timezone.now() + timedelta(minutes=45),
            }
        )

        JourneyLocation.objects.get_or_create(
            journey=journey_golden,
            tourist=profile1,
            location_name="Qutub Minar, New Delhi",
            defaults={
                "latitude": 28.5244,
                "longitude": 77.1855,
                "event_type": "DESTINATION_VISIT",
                "status": "completed",
                "safety_check": "safe",
                "timestamp": timezone.now() - timedelta(days=2, hours=4),
            }
        )

        JourneyLocation.objects.get_or_create(
            journey=journey_golden,
            tourist=profile1,
            location_name="Taj Mahal East Gate, Agra",
            defaults={
                "latitude": 27.1751,
                "longitude": 78.0421,
                "event_type": "CHECK_IN",
                "status": "ongoing",
                "safety_check": "safe",
                "timestamp": timezone.now() - timedelta(minutes=15),
            }
        )

        CheckInSchedule.objects.get_or_create(
            journey=journey_golden,
            tourist=profile1,
            expected_check_in_time=timezone.now() + timedelta(minutes=45),
            defaults={"status": "PENDING"}
        )

        # 10. Seed Itinerary
        itin1, _ = Itinerary.objects.get_or_create(
            tourist=profile1,
            name="Jaipur Royal Heritage Circuit (2 Days)",
            defaults={
                "description": "Curated cultural itinerary with verified ASI stops and pre-paid transport.",
                "start_date": timezone.now().date(),
                "end_date": timezone.now().date() + timedelta(days=2),
            }
        )

        ItineraryItem.objects.get_or_create(
            itinerary=itin1,
            order=1,
            defaults={
                "day": 1,
                "time": "09:00 AM",
                "title": "Amber Fort & Sheesh Mahal",
                "location": "Amer, Jaipur",
                "duration": "2.5 hours",
                "transport_mode": "cab",
                "travel_time_from_prev": "20 mins",
                "distance_from_prev": "9.2 km",
                "cost": 550.0,
                "safety_status": "safe",
                "recommended_hours": "Morning hours (least crowded)",
                "notes": "Book RTDC verified jeep at base gate to save 30 mins uphill walk.",
                "latitude": 26.9855,
                "longitude": 75.8513,
            }
        )

        ItineraryItem.objects.get_or_create(
            itinerary=itin1,
            order=2,
            defaults={
                "day": 1,
                "time": "12:30 PM",
                "title": "City Palace & Museum Complex",
                "location": "Pink City, Jaipur",
                "duration": "2 hours",
                "transport_mode": "cab",
                "travel_time_from_prev": "25 mins",
                "distance_from_prev": "8.5 km",
                "cost": 700.0,
                "safety_status": "safe",
                "recommended_hours": "Mid-day indoor gallery viewing",
                "notes": "Pritam Niwas Chowk with 4 seasonal peacock gates is ideal for photography.",
                "latitude": 26.9258,
                "longitude": 75.8237,
            }
        )

        # 11. Seed Emergency Incidents
        EmergencyIncident.objects.get_or_create(
            incident_id="INC-2026-089",
            defaults={
                "tourist": profile1,
                "tourist_name": "Aarav Sharma",
                "tourist_phone": "+91 98765 43210",
                "nationality": "Indian",
                "emergency_type": "SOS Emergency",
                "priority": "critical",
                "latitude": 27.1712,
                "longitude": 78.0460,
                "location_description": "Near Shilpgram Parking, Agra East Gate",
                "description": "Urgent assistance required near East Gate taxi booth.",
                "status": "responding",
                "assigned_officer_name": "Insp. Vikram Pratap (UP Tourist Police - Unit 4)",
                "battery_level": 68,
                "responder_notes": "Patrol vehicle Bravo-2 dispatched from East Gate Post. ETA 2 minutes. Direct audio line open.",
            }
        )

        EmergencyIncident.objects.get_or_create(
            incident_id="INC-2026-088",
            defaults={
                "tourist": profile2,
                "tourist_name": "Sophie Van Der Berg",
                "tourist_phone": "+31 6 1234 5678",
                "nationality": "Netherlands",
                "emergency_type": "Medical Distress",
                "priority": "high",
                "latitude": 25.3080,
                "longitude": 83.0065,
                "location_description": "Godowlia Chowk crossing, Varanasi",
                "description": "Tourist reported acute dehydration and heat exhaustion.",
                "status": "acknowledged",
                "assigned_officer_name": "Dr. S. K. Pandey (EMRI Ambulance 108)",
                "battery_level": 42,
                "responder_notes": "First responder bike paramedic en route.",
            }
        )

        # 12. Seed Notifications
        Notification.objects.get_or_create(
            user=tourist1_user,
            title="✓ Digital Tourist Pass Verified",
            defaults={
                "message": "Your SafarSetu Tourist Pass (SS-IND-2026-8849) is authenticated by Ministry of Tourism.",
                "notification_type": "SYSTEM",
                "is_read": True,
            }
        )

        self.stdout.write(self.style.SUCCESS("✓ Seed data populated successfully!"))
