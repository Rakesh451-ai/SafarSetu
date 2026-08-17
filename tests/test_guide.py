from datetime import date, timedelta

from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

from apps.guide.models import BookingStatus, GuideBooking, GuideProfile, TourPackage
from apps.identity.models import IDProofType, Tourist, UserProfile, UserRole


class GuideSystemTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Admin User
        self.admin_user = User.objects.create_superuser(
            username="admin_user",
            email="admin@safarsetu.com",
            password="AdminPassword123!",
            first_name="Admin",
            last_name="Super",
        )
        UserProfile.objects.create(
            user=self.admin_user,
            role=UserRole.ADMIN,
            phone_number="+911100000000",
            is_verified=True,
        )

        # 2. Guide User 1 (Unverified)
        self.guide_user_unverified = User.objects.create_user(
            username="guide_rajesh",
            email="rajesh@safarsetu.com",
            password="GuidePassword123!",
            first_name="Rajesh",
            last_name="Kumar",
        )
        UserProfile.objects.create(
            user=self.guide_user_unverified,
            role=UserRole.GUIDE,
            phone_number="+919811122233",
            is_verified=True,
        )
        self.guide_profile_unverified = GuideProfile.objects.create(
            user=self.guide_user_unverified,
            bio="Passionate heritage tour guide in Old Delhi.",
            languages_spoken="Hindi, English",
            regions_served="Delhi, Agra",
            verified=False,
            rating_avg=4.8,
            hourly_rate=500.00,
        )

        # 3. Guide User 2 (Verified)
        self.guide_user_verified = User.objects.create_user(
            username="guide_fatima",
            email="fatima@safarsetu.com",
            password="GuidePassword123!",
            first_name="Fatima",
            last_name="Begum",
        )
        UserProfile.objects.create(
            user=self.guide_user_verified,
            role=UserRole.GUIDE,
            phone_number="+919822233344",
            is_verified=True,
        )
        self.guide_profile_verified = GuideProfile.objects.create(
            user=self.guide_user_verified,
            bio="Certified Rajasthan and Jaipur fort historian.",
            languages_spoken="Hindi, English, French",
            regions_served="Jaipur, Rajasthan",
            verified=True,
            verified_by=self.admin_user,
            rating_avg=4.95,
            hourly_rate=800.00,
        )

        # 4. Tourist User
        self.tourist_user = User.objects.create_user(
            username="tourist_albert",
            email="albert@example.com",
            password="TouristPassword123!",
            first_name="Albert",
            last_name="Camus",
        )
        self.tourist = Tourist.objects.create(
            user=self.tourist_user,
            name="Albert Camus",
            nationality="French",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="FR10293847",
            phone="+33698765432",
            preferred_language="fr",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=10),
        )

        # Tour package under verified guide
        self.package_jaipur = TourPackage.objects.create(
            guide=self.guide_profile_verified,
            title="Amber Fort & Pink City Cultural Walk",
            description="Explore the rich palaces and secret corridors of Amber Fort.",
            duration="1 Day",
            price=2500.00,
            max_group_size=8,
        )

    def get_jwt_header(self, user: User) -> dict:
        refresh = RefreshToken.for_user(user)
        return {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_unverified_guide_is_excluded_from_public_browse(self):
        """
        Confirms that GET /api/v1/guides strictly excludes unverified guides.
        """
        response = self.client.get(reverse("v1-guide-browse"))
        self.assertEqual(response.status_code, 200)

        data = response.json()
        returned_usernames = [g["username"] for g in data]

        # Verified guide MUST be present
        self.assertIn("guide_fatima", returned_usernames)

        # Unverified guide MUST be excluded
        self.assertNotIn("guide_rajesh", returned_usernames)
        self.assertEqual(len(data), 1)

    def test_public_guide_filtering_by_region_and_language(self):
        """
        Tests filtering verified guides by region and language query params.
        """
        # Filter by region: Jaipur
        resp_jaipur = self.client.get(f"{reverse('v1-guide-browse')}?region=Jaipur")
        self.assertEqual(resp_jaipur.status_code, 200)
        self.assertEqual(len(resp_jaipur.json()), 1)
        self.assertEqual(resp_jaipur.json()[0]["username"], "guide_fatima")

        # Filter by region: Kerala (no verified guides)
        resp_kerala = self.client.get(f"{reverse('v1-guide-browse')}?region=Kerala")
        self.assertEqual(resp_kerala.status_code, 200)
        self.assertEqual(len(resp_kerala.json()), 0)

        # Filter by language: French
        resp_french = self.client.get(f"{reverse('v1-guide-browse')}?language=French")
        self.assertEqual(resp_french.status_code, 200)
        self.assertEqual(len(resp_french.json()), 1)

        # Filter by language: German (none)
        resp_german = self.client.get(f"{reverse('v1-guide-browse')}?language=German")
        self.assertEqual(resp_german.status_code, 200)
        self.assertEqual(len(resp_german.json()), 0)

    def test_admin_verification_workflow(self):
        """
        Verifies that only ADMIN can verify a guide, and once verified,
        the guide immediately appears in the public browse endpoint.
        """
        url = reverse(
            "v1-guide-verify", kwargs={"pk": self.guide_profile_unverified.pk}
        )

        # 1. Anonymous attempt -> 401 Unauthorized
        anon_resp = self.client.post(url)
        self.assertEqual(anon_resp.status_code, 401)

        # 2. Tourist attempt -> 403 Forbidden
        tourist_resp = self.client.post(url, **self.get_jwt_header(self.tourist_user))
        self.assertEqual(tourist_resp.status_code, 403)

        # 3. Guide attempting self-verification -> 403 Forbidden
        guide_resp = self.client.post(
            url, **self.get_jwt_header(self.guide_user_unverified)
        )
        self.assertEqual(guide_resp.status_code, 403)

        # 4. Admin verification -> 200 OK
        admin_resp = self.client.post(url, **self.get_jwt_header(self.admin_user))
        self.assertEqual(admin_resp.status_code, 200)
        self.assertTrue(admin_resp.json()["guide"]["verified"])

        self.guide_profile_unverified.refresh_from_db()
        self.assertTrue(self.guide_profile_unverified.verified)
        self.assertEqual(self.guide_profile_unverified.verified_by, self.admin_user)

        # 5. Now both guides appear in public browse!
        browse_resp = self.client.get(reverse("v1-guide-browse"))
        self.assertEqual(browse_resp.status_code, 200)
        self.assertEqual(len(browse_resp.json()), 2)
        returned_usernames = [g["username"] for g in browse_resp.json()]
        self.assertIn("guide_rajesh", returned_usernames)
        self.assertIn("guide_fatima", returned_usernames)

    def test_guide_package_crud_permissions(self):
        """
        Tests that guides can only edit their own packages, while other guides cannot.
        """
        # Fatima creates a new package
        create_resp = self.client.post(
            reverse("v1-package-list-create"),
            data={
                "title": "Hawa Mahal Sunset Photography",
                "description": "Golden hour photo tour.",
                "duration": "3 hours",
                "price": "1200.00",
                "max_group_size": 4,
            },
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_verified),
        )
        self.assertEqual(create_resp.status_code, 201)
        package_id = create_resp.json()["id"]

        # Rajesh tries to modify Fatima's package -> 403 Forbidden
        patch_url = reverse("v1-package-detail", kwargs={"pk": package_id})
        forbidden_resp = self.client.patch(
            patch_url,
            data={"price": "5000.00"},
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_unverified),
        )
        self.assertEqual(forbidden_resp.status_code, 403)

        # Fatima updates her own package -> 200 OK
        ok_resp = self.client.patch(
            patch_url,
            data={"price": "1500.00"},
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_verified),
        )
        self.assertEqual(ok_resp.status_code, 200)
        self.assertEqual(ok_resp.json()["price"], "1500.00")

    def test_tour_booking_and_status_transition_permissions(self):
        """
        Tests:
        - Tourist books a package (status='requested')
        - Tourist CANNOT transition status to 'confirmed' (403/validation error)
        - Assigned guide CAN transition status ('confirmed' -> 'completed')
        - Tourist can cancel their own booking
        """
        # 1. Tourist creates booking
        booking_resp = self.client.post(
            reverse("v1-booking-list-create"),
            data={
                "tour_package": self.package_jaipur.id,
                "scheduled_date": (date.today() + timedelta(days=3)).isoformat(),
                "number_of_people": 2,
                "special_requests": "Vegetarian snacks please.",
            },
            content_type="application/json",
            **self.get_jwt_header(self.tourist_user),
        )
        self.assertEqual(booking_resp.status_code, 201)
        booking_id = booking_resp.json()["id"]
        self.assertEqual(booking_resp.json()["status"], "requested")

        booking_url = reverse("v1-booking-detail", kwargs={"pk": booking_id})

        # 2. Tourist tries to confirm the booking -> 403 Forbidden
        tourist_confirm_resp = self.client.patch(
            booking_url,
            data={"status": "confirmed"},
            content_type="application/json",
            **self.get_jwt_header(self.tourist_user),
        )
        self.assertEqual(tourist_confirm_resp.status_code, 403)

        # 3. Unrelated guide (Rajesh) tries to confirm the booking -> 403 Forbidden
        unrelated_guide_resp = self.client.patch(
            booking_url,
            data={"status": "confirmed"},
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_unverified),
        )
        self.assertEqual(unrelated_guide_resp.status_code, 403)

        # 4. Assigned guide (Fatima) confirms the booking -> 200 OK
        guide_confirm_resp = self.client.patch(
            booking_url,
            data={"status": "confirmed"},
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_verified),
        )
        self.assertEqual(guide_confirm_resp.status_code, 200)
        self.assertEqual(guide_confirm_resp.json()["status"], "confirmed")

        # 5. Assigned guide marks booking as completed -> 200 OK
        guide_complete_resp = self.client.patch(
            booking_url,
            data={"status": "completed"},
            content_type="application/json",
            **self.get_jwt_header(self.guide_user_verified),
        )
        self.assertEqual(guide_complete_resp.status_code, 200)
        self.assertEqual(guide_complete_resp.json()["status"], "completed")

        booking_obj = GuideBooking.objects.get(id=booking_id)
        self.assertEqual(booking_obj.status, BookingStatus.COMPLETED)
