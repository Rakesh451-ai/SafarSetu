from django.core.management.base import BaseCommand

from apps.poi.models import (
    POI,
    AccommodationOption,
    AccommodationType,
    TransportMode,
    TransportOption,
)


class Command(BaseCommand):
    help = "Seeds 5 famous POIs with realistic transport/accommodation options and 3 nearby hidden gems."

    def handle(self, *args, **options):
        self.stdout.write(
            "Seeding sample POIs, transport options, stays, and hidden gems..."
        )

        # -------------------------------------------------------------
        # 1. Famous POI: Amber Fort
        # -------------------------------------------------------------
        amber_fort, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-AMER-FORT-01",
            defaults={
                "name": "Amber Fort & Palace (Amer)",
                "category": "UNESCO Hill Fort & Palace",
                "region": "Amer",
                "city": "Jaipur",
                "description": "Majestic 16th-century hilltop fortress renowned for its blend of Rajput and Mughal architecture, artistic mirror mosaics, and grand courtyards.",
                "history": "Commissioned in 1592 by Raja Man Singh I and expanded by Mirza Raja Jai Singh, Amber Fort served as the principal seat of the Kachwaha Rajputs until the founding of Jaipur in 1727.",
                "facilities": [
                    "Audio Guide (7 Languages)",
                    "Licensed Heritage Guides",
                    "Wheelchair Ramps (Diwan-i-Aam)",
                    "Drinking Water Kiosks",
                    "Battery-Operated Shuttles",
                    "First Aid & Medical Station",
                    "Luggage Cloakroom",
                ],
                "latitude": 26.985500,
                "longitude": 75.851300,
                "entry_fee_info": "₹100 (Indian Nationals) • ₹500 (Foreign Visitors) • ₹20 (Students)",
                "best_time_to_visit": "October to March, 8:00 AM – 11:30 AM (or Light & Sound Show at 7:30 PM)",
                "avg_visit_duration_minutes": 150,
                "is_hidden_gem": False,
                "short_video_url": "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-historic-fort-42514-large.mp4",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/amber-fort",
                "images": [
                    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1600100397608-f010e421d3fa?w=900&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.90,
                "is_active": True,
            },
        )

        TransportOption.objects.update_or_create(
            poi=amber_fort,
            mode=TransportMode.TAXI,
            from_landmark="Jaipur Junction Railway Station (12.5 km)",
            defaults={
                "estimated_price_range": "₹350 – ₹450 (Pre-paid / App)",
                "estimated_duration": "30-35 mins",
                "verified": True,
                "source_verified_by": "Rajasthan State Transport Authority 2026",
            },
        )
        TransportOption.objects.update_or_create(
            poi=amber_fort,
            mode=TransportMode.AUTO,
            from_landmark="Hawa Mahal / Badi Chaupar (9.5 km)",
            defaults={
                "estimated_price_range": "₹150 – ₹200",
                "estimated_duration": "20-25 mins",
                "verified": True,
                "source_verified_by": "Jaipur Traffic Police Pre-Paid Booth",
            },
        )
        TransportOption.objects.update_or_create(
            poi=amber_fort,
            mode=TransportMode.BUS,
            from_landmark="Ajmeri Gate AC Bus Stand (Route AC-1 / AC-5)",
            defaults={
                "estimated_price_range": "₹30 – ₹40 per ticket",
                "estimated_duration": "45 mins",
                "verified": True,
                "source_verified_by": "JCTSL City Bus Schedule",
            },
        )

        AccommodationOption.objects.update_or_create(
            poi=amber_fort,
            name="Amer Heritage Haveli & Spa",
            defaults={
                "type": AccommodationType.HOTEL,
                "price_range": "₹3,200 – ₹6,500 / night",
                "distance_from_poi": "450m from Suraj Pol Entrance",
                "rating": 4.85,
                "verified": True,
            },
        )
        AccommodationOption.objects.update_or_create(
            poi=amber_fort,
            name="The Hosteller Amber Fort",
            defaults={
                "type": AccommodationType.HOSTEL,
                "price_range": "₹650 – ₹1,800 / night",
                "distance_from_poi": "800m from Maota Lake",
                "rating": 4.65,
                "verified": True,
            },
        )

        # -------------------------------------------------------------
        # 2. Famous POI: Hawa Mahal
        # -------------------------------------------------------------
        hawa_mahal, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-HAWA-MAHAL-02",
            defaults={
                "name": "Hawa Mahal (Palace of Winds)",
                "category": "Pink City Landmark",
                "region": "Jaipur",
                "city": "Jaipur",
                "description": "Five-storey pink and red sandstone palace featuring 953 intricately carved jharokhas (small casements) designed for royal ladies to observe street festivals unnoticed.",
                "history": "Built in 1799 by Maharaja Sawai Pratap Singh and designed by Lal Chand Ustad in the form of the crown of Lord Krishna.",
                "facilities": [
                    "Archaeological Museum",
                    "Audio Guides",
                    "Rooftop Photography Vantage",
                    "Drinking Water",
                    "Souvenir Stall",
                ],
                "latitude": 26.923900,
                "longitude": 75.826700,
                "entry_fee_info": "₹50 (Indian Nationals) • ₹200 (Foreign Visitors)",
                "best_time_to_visit": "October to March, 8:30 AM – 10:30 AM (Morning sunlight illuminates facade)",
                "avg_visit_duration_minutes": 60,
                "is_hidden_gem": False,
                "short_video_url": "https://assets.mixkit.co/videos/preview/mixkit-ancient-indian-building-facade-42515-large.mp4",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/hawa-mahal",
                "images": [
                    "https://images.unsplash.com/photo-1609137144822-4a7b7d0a6c02?w=900&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1598890777032-bde13fbe3492?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.82,
                "is_active": True,
            },
        )

        TransportOption.objects.update_or_create(
            poi=hawa_mahal,
            mode=TransportMode.METRO,
            from_landmark="Badi Chaupar Underground Metro Station",
            defaults={
                "estimated_price_range": "₹10 – ₹20 (Jaipur Metro Pink Line)",
                "estimated_duration": "2 mins walk (150m)",
                "verified": True,
                "source_verified_by": "Jaipur Metro Rail Corporation",
            },
        )
        AccommodationOption.objects.update_or_create(
            poi=hawa_mahal,
            name="Zostel Jaipur Walled City",
            defaults={
                "type": AccommodationType.HOSTEL,
                "price_range": "₹700 – ₹2,400 / night",
                "distance_from_poi": "300m from Sireh Deori Bazaar",
                "rating": 4.75,
                "verified": True,
            },
        )

        # -------------------------------------------------------------
        # 3. Famous POI: Jantar Mantar
        # -------------------------------------------------------------
        jantar_mantar, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-JANTAR-MANTAR-03",
            defaults={
                "name": "Jantar Mantar Royal Observatory",
                "category": "UNESCO Scientific Heritage",
                "region": "Jaipur",
                "city": "Jaipur",
                "description": "Collection of nineteen architectural astronomical instruments featuring the world's largest stone sundial (Vrihat Samrat Yantra), accurate to within two seconds.",
                "history": "Constructed between 1728 and 1734 by Maharaja Sawai Jai Singh II, representing the pinnacle of Mughal-Rajput astronomical knowledge.",
                "facilities": [
                    "Astronomical Demonstration Shows",
                    "Certified Astronomy Guides",
                    "Braille Panels",
                    "Wheelchair Access",
                    "Cloakroom",
                ],
                "latitude": 26.924800,
                "longitude": 75.824600,
                "entry_fee_info": "₹50 (Indian Nationals) • ₹200 (Foreign Visitors)",
                "best_time_to_visit": "October to March, 11:30 AM – 1:30 PM (Solar noon for sundial readings)",
                "avg_visit_duration_minutes": 90,
                "is_hidden_gem": False,
                "short_video_url": "https://assets.mixkit.co/videos/preview/mixkit-monuments-and-statues-in-a-sunny-park-42516-large.mp4",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/jantar-mantar",
                "images": [
                    "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.88,
                "is_active": True,
            },
        )

        # -------------------------------------------------------------
        # 4. Famous POI: City Palace
        # -------------------------------------------------------------
        city_palace, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-CITY-PALACE-04",
            defaults={
                "name": "City Palace of Jaipur",
                "category": "Royal Residence & Museum",
                "region": "Jaipur",
                "city": "Jaipur",
                "description": "Magnificent royal palace complex including Mubarak Mahal, Chandra Mahal, Peacock Courtyard, and the Maharaja Sawai Man Singh II Museum.",
                "history": "Established in 1727 alongside Jaipur city by Maharaja Sawai Jai Singh II, remaining the official ceremonial residence of the Jaipur royal family.",
                "facilities": [
                    "Royal Heritage Museum",
                    "Buggy & Carriage Rides",
                    "Palace Cafe & Courtyard",
                    "Accessible Elevators",
                    "Restrooms",
                ],
                "latitude": 26.925800,
                "longitude": 75.823600,
                "entry_fee_info": "₹200 (Museum Pass) • ₹700 (Foreign) • ₹2,500 (Chandra Mahal Exclusive Tour)",
                "best_time_to_visit": "October to April, 9:30 AM – 1:00 PM",
                "avg_visit_duration_minutes": 120,
                "is_hidden_gem": False,
                "short_video_url": "https://assets.mixkit.co/videos/preview/mixkit-courtyard-of-a-historic-palace-42517-large.mp4",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/city-palace",
                "images": [
                    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.85,
                "is_active": True,
            },
        )

        # -------------------------------------------------------------
        # 5. Famous POI: Nahargarh Fort
        # -------------------------------------------------------------
        nahargarh, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-NAHARGARH-05",
            defaults={
                "name": "Nahargarh Fort & Sunset Point",
                "category": "Hilltop Ridge Fort",
                "region": "Jaipur",
                "city": "Jaipur",
                "description": "Standing on the edge of the Aravalli Hills, offering panoramic sunset views across the entire Jaipur Pink City and housing Madhavendra Bhawan.",
                "history": "Constructed in 1734 by Maharaja Sawai Jai Singh II as a retreat palace and defensive ridge for the royal city.",
                "facilities": [
                    "Padao Sunset Cafe",
                    "Sculpture Park",
                    "Wax Museum",
                    "Designated Safe Viewing Platforms",
                    "Parking Lot",
                ],
                "latitude": 26.937800,
                "longitude": 75.815600,
                "entry_fee_info": "₹50 (Indian Nationals) • ₹200 (Foreign Visitors)",
                "best_time_to_visit": "4:30 PM – 6:45 PM (Iconic Golden Hour & Sunset)",
                "avg_visit_duration_minutes": 90,
                "is_hidden_gem": False,
                "short_video_url": "https://assets.mixkit.co/videos/preview/mixkit-sunset-over-a-mountain-fort-42518-large.mp4",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/nahargarh",
                "images": [
                    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.78,
                "is_active": True,
            },
        )

        # -------------------------------------------------------------
        # 6. Hidden Gem 1: Panna Meena Ka Kund (Stepwell near Amber Fort)
        # -------------------------------------------------------------
        panna_meena, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-PANNA-MEENA-06",
            defaults={
                "name": "Panna Meena Ka Kund (Historic Stepwell)",
                "category": "Historic Stepwell & Water Architecture",
                "region": "Amer",
                "city": "Jaipur",
                "description": "An exquisite 16th-century symmetrical 8-storey stepwell featuring criss-cross geometric staircases, octagonal gazebos, and ancient community water harvesting.",
                "history": "Built during the reign of Maharaja Man Singh I in the 16th century as a social meeting place and cooling reservoir for local travelers and pilgrims.",
                "facilities": [
                    "Archaeological Guard Post",
                    "Photography Point",
                    "Heritage Plaques",
                    "Shaded Seating Area",
                ],
                "latitude": 26.988200,
                "longitude": 75.856900,
                "entry_fee_info": "Free Entry (Protected ASI Monument)",
                "best_time_to_visit": "October to March, 7:30 AM – 9:30 AM (Quiet morning light)",
                "avg_visit_duration_minutes": 45,
                "is_hidden_gem": True,
                "short_video_url": "",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/panna-meena",
                "images": [
                    "https://images.unsplash.com/photo-1600100397608-f010e421d3fa?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.92,
                "is_active": True,
            },
        )

        TransportOption.objects.update_or_create(
            poi=panna_meena,
            mode=TransportMode.WALK,
            from_landmark="Amber Fort Elephant Stand (1.1 km)",
            defaults={
                "estimated_price_range": "Free (Scenic Village Walk)",
                "estimated_duration": "12-15 mins walk",
                "verified": True,
                "source_verified_by": "Amer Heritage Walking Trail Map",
            },
        )
        AccommodationOption.objects.update_or_create(
            poi=panna_meena,
            name="Kawa Homestay & Pottery Studio",
            defaults={
                "type": AccommodationType.HOMESTAY,
                "price_range": "₹1,800 – ₹3,200 / night",
                "distance_from_poi": "200m from Stepwell",
                "rating": 4.90,
                "verified": True,
            },
        )

        # -------------------------------------------------------------
        # 7. Hidden Gem 2: Jagat Shiromani Temple
        # -------------------------------------------------------------
        jagat_shiromani, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-JAGAT-SHIROMANI-07",
            defaults={
                "name": "Jagat Shiromani Temple",
                "category": "Ancient Marble & Sandstone Temple",
                "region": "Amer",
                "city": "Jaipur",
                "description": "Masterpiece of 16th-century temple architecture dedicated to Lord Krishna, Vishnu, and Meera Bai, famed for its intricately carved torana archway and elephant brackets.",
                "history": "Constructed between 1599 and 1608 AD by Queen Kanakwati in memory of her son Jagat Singh. The Krishna idol was brought specially from Chittorgarh during the Mughal wars.",
                "facilities": [
                    "Pujari Audio Commentary",
                    "Shoe Stand",
                    "Heritage Courtyard",
                ],
                "latitude": 26.986800,
                "longitude": 75.852800,
                "entry_fee_info": "Free Entry (Donations Accepted)",
                "best_time_to_visit": "6:00 AM – 11:00 AM or 4:00 PM – 7:30 PM (Aarti timings)",
                "avg_visit_duration_minutes": 45,
                "is_hidden_gem": True,
                "short_video_url": "",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/jagat-shiromani",
                "images": [
                    "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.87,
                "is_active": True,
            },
        )

        TransportOption.objects.update_or_create(
            poi=jagat_shiromani,
            mode=TransportMode.WALK,
            from_landmark="Amber Fort Chand Pol Gate (600m)",
            defaults={
                "estimated_price_range": "Free (Cobblestone Path)",
                "estimated_duration": "8 mins walk",
                "verified": True,
                "source_verified_by": "Amer Town Tourism Board",
            },
        )

        # -------------------------------------------------------------
        # 8. Hidden Gem 3: Gatore Ki Chhatriyan
        # -------------------------------------------------------------
        gatore, _ = POI.objects.update_or_create(
            entry_gate_qr_id="GATE-GATORE-08",
            defaults={
                "name": "Gatore Ki Chhatriyan (Royal Cenotaphs)",
                "category": "Marble Cenotaphs & Serene Heritage",
                "region": "Jaipur",
                "city": "Jaipur",
                "description": "Quiet, secluded valley of intricately sculpted white marble and yellow sandstone cenotaphs honoring the Kachwaha Maharajas of Jaipur.",
                "history": "Chosen by Maharaja Sawai Jai Singh II as the royal cremation ground, each chhatri reflects the distinct architectural taste of the ruler it commemorates.",
                "facilities": [
                    "Peaceful Garden Walks",
                    "Ticket Counter",
                    "Clean Restrooms",
                    "Photography Zones",
                ],
                "latitude": 26.942300,
                "longitude": 75.828500,
                "entry_fee_info": "₹30 (Indian Nationals) • ₹50 (Foreign Visitors)",
                "best_time_to_visit": "October to March, 9:00 AM – 12:00 PM (Serene morning atmosphere)",
                "avg_visit_duration_minutes": 60,
                "is_hidden_gem": True,
                "short_video_url": "",
                "three_sixty_media_url": "https://safarsetu.gov.in/360/gatore",
                "images": [
                    "https://images.unsplash.com/photo-1598890777032-bde13fbe3492?w=900&auto=format&fit=crop&q=80",
                ],
                "rating": 4.89,
                "is_active": True,
            },
        )

        TransportOption.objects.update_or_create(
            poi=gatore,
            mode=TransportMode.AUTO,
            from_landmark="Jorawar Singh Gate / Badi Chaupar (3.5 km)",
            defaults={
                "estimated_price_range": "₹80 – ₹120",
                "estimated_duration": "10-15 mins",
                "verified": True,
                "source_verified_by": "Jaipur Pre-Paid Auto Stand",
            },
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully seeded 8 POIs (5 Famous + 3 Hidden Gems) with verified transport & stays!"
            )
        )
