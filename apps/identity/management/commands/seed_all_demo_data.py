from datetime import date, timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.guide.models import GuideProfile, TourPackage
from apps.identity.models import IDProofType, Tourist, UserProfile, UserRole


class Command(BaseCommand):
    help = "Seeds all demonstration data across all apps for local testing."

    def handle(self, *args, **options):
        self.stdout.write("Seeding comprehensive demonstration data for SafarSetu...")

        # 1. Admin & Responders
        admin_user, _ = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@safarsetu.gov.in",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin_user.set_password("AdminPass123!")
        admin_user.save()
        UserProfile.objects.update_or_create(
            user=admin_user,
            defaults={"role": UserRole.ADMIN, "region_scope": ""},
        )

        dsp_user, _ = User.objects.get_or_create(
            username="police_dsp_jaipur",
            defaults={"email": "dsp.jaipur@police.gov.in", "is_staff": True},
        )
        dsp_user.set_password("PolicePass123!")
        dsp_user.save()
        UserProfile.objects.update_or_create(
            user=dsp_user,
            defaults={"role": UserRole.RESPONDER, "region_scope": "Jaipur"},
        )

        # 2. Guides
        guide_user1, _ = User.objects.get_or_create(
            username="guide_rajeshwar",
            defaults={
                "email": "rajeshwar@guides.rajasthan.gov.in",
                "first_name": "Rajeshwar Singh",
                "last_name": "Shekhawat",
            },
        )
        guide_user1.set_password("GuidePass123!")
        guide_user1.save()
        UserProfile.objects.update_or_create(
            user=guide_user1,
            defaults={"role": UserRole.GUIDE, "is_verified": True},
        )
        profile1, _ = GuideProfile.objects.update_or_create(
            user=guide_user1,
            defaults={
                "bio": "Certified Rajasthan Heritage interpreter with 14 years experience across Amber Fort and Nahargarh.",
                "languages_spoken": "Hindi, English, French",
                "regions_served": "Jaipur, Amer",
                "verified": True,
                "verified_by": admin_user,
                "rating_avg": 4.95,
            },
        )
        TourPackage.objects.update_or_create(
            guide=profile1,
            title="Amber Fort Royal Courtyards & Sheesh Mahal In-Depth Walk",
            defaults={
                "description": "Comprehensive guided walk through Diwan-i-Aam, mirror mosaics of Sheesh Mahal, and ancient water harvesting conduits.",
                "duration": "3.5 hours",
                "price": 1500.00,
                "max_group_size": 6,
            },
        )

        guide_user2, _ = User.objects.get_or_create(
            username="guide_ananya",
            defaults={
                "email": "ananya@guides.rajasthan.gov.in",
                "first_name": "Ananya",
                "last_name": "Sharma",
            },
        )
        guide_user2.set_password("GuidePass123!")
        guide_user2.save()
        UserProfile.objects.update_or_create(
            user=guide_user2,
            defaults={"role": UserRole.GUIDE, "is_verified": True},
        )
        profile2, _ = GuideProfile.objects.update_or_create(
            user=guide_user2,
            defaults={
                "bio": "Art historian and certified archaeological guide specializing in astronomy at Jantar Mantar and City Palace.",
                "languages_spoken": "English, Hindi, Spanish, German",
                "regions_served": "Jaipur",
                "verified": True,
                "verified_by": admin_user,
                "rating_avg": 4.88,
            },
        )
        TourPackage.objects.update_or_create(
            guide=profile2,
            title="Astronomical & Architecture Heritage Odyssey",
            defaults={
                "description": "Explore UNESCO Jantar Mantar instruments and Pink City royal architecture.",
                "duration": "3.0 hours",
                "price": 1800.00,
                "max_group_size": 5,
            },
        )

        # 3. Sample Tourist
        tourist_user, _ = User.objects.get_or_create(
            username="tourist_maya",
            defaults={"email": "maya.lin@example.com"},
        )
        tourist_user.set_password("TouristPass123!")
        tourist_user.save()
        UserProfile.objects.update_or_create(
            user=tourist_user,
            defaults={"role": UserRole.TOURIST},
        )
        Tourist.objects.update_or_create(
            phone="+6591234567",
            defaults={
                "user": tourist_user,
                "name": "Maya Lin",
                "nationality": "Singaporean",
                "id_proof_type": IDProofType.PASSPORT,
                "id_proof_number": "SGP123456",
                "current_region": "Jaipur",
                "preferred_language": "en",
                "trip_start": date.today(),
                "trip_end": date.today() + timedelta(days=5),
            },
        )

        self.stdout.write(
            self.style.SUCCESS("All SafarSetu demo data successfully populated!")
        )
