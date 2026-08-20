from datetime import date, timedelta

from django.contrib.auth import authenticate, get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework_simplejwt.tokens import AccessToken

from apps.identity.models import (
    DigitalID,
    EmergencyContact,
    Tourist,
    UserProfile,
    UserRole,
)

User = get_user_model()


class AuthenticationSystemTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username="kavita_t",
            email="kavita@example.com",
            password="SecurePassword123!",
            first_name="Kavita",
            last_name="Sharma",
        )
        self.profile = UserProfile.objects.create(
            user=self.user,
            role=UserRole.TOURIST,
            phone_number="+91 98111 22233",
            is_verified=True,
        )
        self.tourist = Tourist.objects.create(
            user=self.user,
            name="Kavita Sharma",
            nationality="India",
            phone="+91 98111 22233",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=5),
        )

    def test_email_or_username_backend(self):
        # 1. Authenticate with username
        auth_user1 = authenticate(username="kavita_t", password="SecurePassword123!")
        self.assertIsNotNone(auth_user1)
        self.assertEqual(auth_user1.id, self.user.id)

        # 2. Authenticate with case-insensitive username
        auth_user2 = authenticate(username="KAVITA_T", password="SecurePassword123!")
        self.assertIsNotNone(auth_user2)
        self.assertEqual(auth_user2.id, self.user.id)

        # 3. Authenticate with email
        auth_user3 = authenticate(
            username="kavita@example.com", password="SecurePassword123!"
        )
        self.assertIsNotNone(auth_user3)
        self.assertEqual(auth_user3.id, self.user.id)

        # 4. Authenticate with case-insensitive email
        auth_user4 = authenticate(
            username="KAVITA@EXAMPLE.COM", password="SecurePassword123!"
        )
        self.assertIsNotNone(auth_user4)
        self.assertEqual(auth_user4.id, self.user.id)

        # 5. Invalid password
        bad_auth = authenticate(username="kavita_t", password="WrongPassword!")
        self.assertIsNone(bad_auth)

    def test_api_jwt_login_with_username_and_email(self):
        # Login via username
        resp1 = self.client.post(
            reverse("identity:login"),
            data={"username": "kavita_t", "password": "SecurePassword123!"},
            content_type="application/json",
        )
        self.assertEqual(resp1.status_code, 200)
        data1 = resp1.json()
        self.assertIn("access", data1)
        self.assertIn("refresh", data1)
        self.assertIn("user", data1)
        self.assertEqual(data1["user"]["username"], "kavita_t")
        self.assertEqual(data1["user"]["role"], "TOURIST")

        # Verify claims in decoded access token
        token_payload = AccessToken(data1["access"]).payload
        self.assertEqual(token_payload["username"], "kavita_t")
        self.assertEqual(token_payload["role"], "TOURIST")
        self.assertEqual(token_payload["tourist_id"], str(self.tourist.tourist_id))

        # Login via email
        resp2 = self.client.post(
            reverse("identity:login"),
            data={"username": "kavita@example.com", "password": "SecurePassword123!"},
            content_type="application/json",
        )
        self.assertEqual(resp2.status_code, 200)

    def test_unified_register_tourist_api(self):
        payload = {
            "role": "TOURIST",
            "username": "rohan_traveler",
            "email": "rohan@example.com",
            "password": "RohanPassword123!",
            "first_name": "Rohan",
            "last_name": "Verma",
            "phone_number": "+91 98444 55566",
            "nationality": "India",
            "id_proof_type": "AADHAAR",
            "id_proof_number": "XXXX-XXXX-9900",
            "emergency_contact_name": "Sunita Verma",
            "emergency_contact_phone": "+91 98444 55577",
        }

        resp = self.client.post(
            reverse("identity:auth-register"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertIn("tokens", data)
        self.assertIn("tourist", data)
        self.assertIn("digital_id", data)
        self.assertEqual(data["user"]["username"], "rohan_traveler")

        # Verify Tourist and Digital ID created
        user = User.objects.get(username="rohan_traveler")
        self.assertTrue(hasattr(user, "tourist_profile"))
        tourist = user.tourist_profile
        self.assertEqual(tourist.name, "Rohan Verma")
        self.assertTrue(
            DigitalID.objects.filter(tourist=tourist, is_active=True).exists()
        )
        self.assertTrue(
            EmergencyContact.objects.filter(
                tourist=tourist, name="Sunita Verma"
            ).exists()
        )

    def test_unified_register_guide_api(self):
        payload = {
            "role": "GUIDE",
            "username": "arun_guide",
            "email": "arun.guide@example.com",
            "password": "ArunGuidePass123!",
            "first_name": "Arun",
            "last_name": "Singh",
            "phone_number": "+91 97222 33344",
            "languages_spoken": "English, Hindi, German",
            "regions_served": "Amer, Jaipur, Pushkar",
            "experience_years": 6,
            "hourly_rate": "750.00",
            "bio": "Heritage scholar and Amer fort specialist guide.",
        }

        resp = self.client.post(
            reverse("identity:auth-register"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertIn("tokens", data)
        self.assertEqual(data["user"]["role"], "GUIDE")

        user = User.objects.get(username="arun_guide")
        self.assertTrue(hasattr(user, "guide_profile"))
        guide = user.guide_profile
        self.assertEqual(guide.languages_spoken, "English, Hindi, German")
        self.assertEqual(guide.experience_years, 6)

    def test_auth_me_and_profile_update_and_change_password(self):
        login_resp = self.client.post(
            reverse("identity:login"),
            data={"username": "kavita_t", "password": "SecurePassword123!"},
            content_type="application/json",
        )
        token = login_resp.json()["access"]
        auth_header = {"HTTP_AUTHORIZATION": f"Bearer {token}"}

        # 1. GET /api/v1/auth/me/
        me_resp = self.client.get(reverse("identity:me"), **auth_header)
        self.assertEqual(me_resp.status_code, 200)
        self.assertEqual(me_resp.json()["username"], "kavita_t")

        # 2. PATCH /api/v1/auth/profile/
        update_resp = self.client.patch(
            reverse("identity:profile-update"),
            data={
                "phone_number": "+91 99999 11111",
                "emergency_contact_name": "Ramesh Sharma",
                "emergency_contact_phone": "+91 99999 22222",
            },
            content_type="application/json",
            **auth_header,
        )
        self.assertEqual(update_resp.status_code, 200)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.phone_number, "+91 99999 11111")
        self.assertEqual(self.profile.emergency_contact_name, "Ramesh Sharma")

        # 3. POST /api/v1/auth/change-password/
        # Test bad old password
        bad_pwd_resp = self.client.post(
            reverse("identity:change-password"),
            data={
                "old_password": "WrongOldPassword!",
                "new_password": "BrandNewPassword123!",
                "confirm_password": "BrandNewPassword123!",
            },
            content_type="application/json",
            **auth_header,
        )
        self.assertEqual(bad_pwd_resp.status_code, 400)

        # Test valid change password
        good_pwd_resp = self.client.post(
            reverse("identity:change-password"),
            data={
                "old_password": "SecurePassword123!",
                "new_password": "BrandNewPassword123!",
                "confirm_password": "BrandNewPassword123!",
            },
            content_type="application/json",
            **auth_header,
        )
        self.assertEqual(good_pwd_resp.status_code, 200)

        # Confirm new password works
        new_auth = authenticate(username="kavita_t", password="BrandNewPassword123!")
        self.assertIsNotNone(new_auth)

    def test_web_login_view(self):
        # 1. GET login page
        get_resp = self.client.get(reverse("web:login"))
        self.assertEqual(get_resp.status_code, 200)
        self.assertContains(get_resp, "Sign In to SafarSetu")
        self.assertContains(get_resp, "Instant 1-Click Demo Login")

        # 2. POST invalid credentials
        bad_resp = self.client.post(
            reverse("web:login"),
            data={"username": "kavita_t", "password": "WrongPassword"},
        )
        self.assertEqual(bad_resp.status_code, 200)
        self.assertContains(bad_resp, "Invalid username/email or password")

        # 3. POST valid credentials
        good_resp = self.client.post(
            reverse("web:login"),
            data={
                "username": "kavita_t",
                "password": "SecurePassword123!",
                "next": "/radar/",
            },
        )
        self.assertRedirects(good_resp, "/radar/")

    def test_web_register_view(self):
        # 1. GET register page
        get_resp = self.client.get(reverse("web:register"))
        self.assertEqual(get_resp.status_code, 200)
        self.assertContains(get_resp, "Create SafarSetu Account")
        self.assertContains(get_resp, "Tourist / Traveler")
        self.assertContains(get_resp, "Tour Guide")

        # 2. POST registration
        reg_payload = {
            "role": "TOURIST",
            "first_name": "Maya",
            "last_name": "Patel",
            "username": "maya_patel",
            "email": "maya@example.com",
            "phone_number": "+91 97777 88888",
            "nationality": "India",
            "id_proof_type": "PASSPORT",
            "id_proof_number": "IN8920193",
            "password": "MayaStrongPass123!",
            "confirm_password": "MayaStrongPass123!",
        }
        post_resp = self.client.post(reverse("web:register"), data=reg_payload)
        self.assertEqual(post_resp.status_code, 302)
        self.assertTrue(User.objects.filter(username="maya_patel").exists())

    def test_demo_login_and_logout_views(self):
        # 1. 1-Click Demo Tourist Login
        demo_resp = self.client.get(
            reverse("web:demo-login", kwargs={"role": "tourist"})
        )
        self.assertRedirects(demo_resp, reverse("web:home"))

        # Profile view when authenticated
        prof_resp = self.client.get(reverse("web:profile"))
        self.assertEqual(prof_resp.status_code, 200)
        self.assertContains(prof_resp, "Alex Morgan")

        # 2. 1-Click Demo Guide Login
        guide_resp = self.client.get(
            reverse("web:demo-login", kwargs={"role": "guide"})
        )
        self.assertRedirects(guide_resp, reverse("web:home"))

        # 3. Logout
        logout_resp = self.client.get(reverse("web:logout"))
        self.assertRedirects(logout_resp, reverse("web:home"))

    def test_google_auth_api(self):
        # 1. Test Google API Login with mock credential
        payload = {
            "credential": "test_google_credential",
            "role": "TOURIST",
        }
        resp = self.client.post(
            reverse("identity:google-auth"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("tokens", data)
        self.assertIn("user", data)
        self.assertIn("tourist", data)
        self.assertIn("digital_id", data)
        self.assertEqual(data["user"]["email"], "traveler.google@gmail.com")

        # Verify Tourist and Digital ID created
        user = User.objects.get(email="traveler.google@gmail.com")
        self.assertTrue(hasattr(user, "tourist_profile"))
        self.assertTrue(
            DigitalID.objects.filter(
                tourist=user.tourist_profile, is_active=True
            ).exists()
        )

    def test_google_web_auth_and_demo(self):
        # 1. Test 1-Click Demo Google Web Sign-In
        resp = self.client.get(reverse("web:google-demo"))
        self.assertRedirects(resp, reverse("web:home"))
        self.assertTrue(User.objects.filter(email="traveler.google@gmail.com").exists())

        # Check authenticated session in profile view
        prof_resp = self.client.get(reverse("web:profile"))
        self.assertEqual(prof_resp.status_code, 200)
        self.assertContains(prof_resp, "traveler.google@gmail.com")
