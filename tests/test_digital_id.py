import io
from datetime import date, timedelta

import jwt
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone
from PIL import Image

from apps.identity.models import DigitalID, EmergencyContact, IDProofType, Tourist
from apps.identity.qr_service import (
    create_or_rotate_digital_id,
    generate_qr_base64,
    generate_qr_png_bytes,
    generate_signed_jwt_payload,
    verify_qr_token,
)


class DigitalIDQRTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.tourist = Tourist.objects.create(
            name="Alice Traveler",
            nationality="Japanese",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="JP88291038",
            phone="+819012345678",
            preferred_language="ja",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=7),
        )

    def test_qr_payload_generation_and_verification(self):
        signed_token, payload, iat, exp = generate_signed_jwt_payload(self.tourist)

        self.assertIsInstance(signed_token, str)
        self.assertEqual(payload["tourist_id"], str(self.tourist.tourist_id))
        self.assertEqual(payload["name"], "Alice Traveler")
        self.assertEqual(payload["nationality"], "Japanese")
        self.assertIn("checksum", payload)

        # Verify decoding and signature validation
        verified_data = verify_qr_token(signed_token)
        self.assertEqual(verified_data["tourist_id"], str(self.tourist.tourist_id))
        self.assertEqual(verified_data["checksum"], payload["checksum"])

    def test_checksum_tamper_detection(self):
        signed_token, payload, iat, exp = generate_signed_jwt_payload(self.tourist)
        decoded = jwt.decode(signed_token, options={"verify_signature": False})

        # Tamper with the name without altering signature/checksum
        tampered_payload = dict(decoded)
        tampered_payload["name"] = "Malicious Impersonator"

        from django.conf import settings

        tampered_token = jwt.encode(
            tampered_payload, settings.SECRET_KEY, algorithm="HS256"
        )

        with self.assertRaises(ValueError) as ctx:
            verify_qr_token(tampered_token)
        self.assertIn("checksum mismatch", str(ctx.exception).lower())

    def test_expired_token_rejection(self):
        past_iat = timezone.now() - timedelta(days=10)
        past_exp = timezone.now() - timedelta(days=2)
        signed_token, _, _, _ = generate_signed_jwt_payload(
            self.tourist, issued_at=past_iat, expires_at=past_exp
        )

        with self.assertRaises(ValueError) as ctx:
            verify_qr_token(signed_token)
        self.assertIn("expired", str(ctx.exception).lower())

    def test_qr_image_rendering(self):
        signed_token, _, _, _ = generate_signed_jwt_payload(self.tourist)
        png_bytes = generate_qr_png_bytes(signed_token)
        self.assertTrue(len(png_bytes) > 0)

        # Verify valid PNG image by loading with Pillow
        image = Image.open(io.BytesIO(png_bytes))
        self.assertEqual(image.format, "PNG")

        # Base64 string
        b64_uri = generate_qr_base64(signed_token)
        self.assertTrue(b64_uri.startswith("data:image/png;base64,"))

    def test_create_and_rotate_digital_id(self):
        digital_id_1 = create_or_rotate_digital_id(self.tourist)
        self.assertTrue(digital_id_1.is_active)
        self.assertFalse(digital_id_1.is_expired)

        # Rotate
        digital_id_2 = create_or_rotate_digital_id(self.tourist)
        digital_id_1.refresh_from_db()

        self.assertFalse(digital_id_1.is_active)
        self.assertTrue(digital_id_2.is_active)
        self.assertNotEqual(digital_id_1.id_token, digital_id_2.id_token)


class TouristAPITests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_tourist_registration_endpoint(self):
        payload = {
            "name": "Jane Doe",
            "nationality": "French",
            "id_proof_type": "PASSPORT",
            "id_proof_number": "FR9832104",
            "phone": "+33612345678",
            "preferred_language": "fr",
            "trip_start": (date.today()).isoformat(),
            "trip_end": (date.today() + timedelta(days=10)).isoformat(),
            "username": "janedoe",
            "email": "jane@example.com",
            "password": "StrongPassword123!",
            "emergency_contacts": [
                {
                    "name": "Pierre Doe",
                    "phone": "+33687654321",
                    "relation": "Spouse",
                }
            ],
        }

        response = self.client.post(
            reverse("v1-register"),
            data=payload,
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("tourist", data)
        self.assertIn("digital_id", data)
        self.assertIn("tokens", data)
        self.assertIn("access", data["tokens"])
        self.assertIn("refresh", data["tokens"])

        tourist_id = data["tourist"]["tourist_id"]
        self.assertTrue(Tourist.objects.filter(tourist_id=tourist_id).exists())
        self.assertTrue(
            EmergencyContact.objects.filter(
                tourist_id=tourist_id, name="Pierre Doe"
            ).exists()
        )
        self.assertTrue(
            DigitalID.objects.filter(tourist_id=tourist_id, is_active=True).exists()
        )

        # Test SimpleJWT token with an authenticated endpoint
        access_token = data["tokens"]["access"]
        auth_response = self.client.get(
            reverse("identity:me"),
            HTTP_AUTHORIZATION=f"Bearer {access_token}",
        )
        self.assertEqual(auth_response.status_code, 200)
        self.assertEqual(auth_response.json()["username"], "janedoe")

    def test_get_qr_endpoint_json_and_image(self):
        # Register a tourist first
        tourist = Tourist.objects.create(
            name="John Smith",
            nationality="British",
            id_proof_type=IDProofType.PASSPORT,
            phone="+447911123456",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=5),
        )
        digital_id = create_or_rotate_digital_id(tourist)

        # 1. JSON response
        url = reverse("v1-id-qr", kwargs={"tourist_id": tourist.tourist_id})
        json_resp = self.client.get(url)
        self.assertEqual(json_resp.status_code, 200)
        json_data = json_resp.json()
        self.assertEqual(json_data["tourist_id"], str(tourist.tourist_id))
        self.assertEqual(json_data["id_token"], str(digital_id.id_token))
        self.assertTrue(json_data["is_signature_valid"])
        self.assertTrue(
            json_data["qr_image_base64"].startswith("data:image/png;base64,")
        )

        # 2. Raw PNG Image response via ?format=image
        img_resp = self.client.get(f"{url}?format=image")
        self.assertEqual(img_resp.status_code, 200)
        self.assertEqual(img_resp["Content-Type"], "image/png")
        img = Image.open(io.BytesIO(img_resp.content))
        self.assertEqual(img.format, "PNG")

    def test_emergency_contact_create_endpoint(self):
        tourist = Tourist.objects.create(
            name="Carlos Silva",
            nationality="Brazilian",
            id_proof_type=IDProofType.PASSPORT,
            phone="+5511987654321",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=14),
        )

        contact_payload = {
            "tourist_id": str(tourist.tourist_id),
            "name": "Maria Silva",
            "phone": "+5511912345678",
            "relation": "Mother",
        }

        response = self.client.post(
            reverse("v1-emergency-contacts"),
            data=contact_payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["name"], "Maria Silva")
        self.assertTrue(
            EmergencyContact.objects.filter(
                tourist=tourist, name="Maria Silva"
            ).exists()
        )

    def test_rotate_qr_signatures_management_command(self):
        tourist = Tourist.objects.create(
            name="Elena Rostova",
            nationality="Russian",
            id_proof_type=IDProofType.PASSPORT,
            phone="+79161234567",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=20),
        )
        initial_digital_id = create_or_rotate_digital_id(tourist)

        out = io.StringIO()
        call_command(
            "rotate_qr_signatures",
            f"--tourist-id={tourist.tourist_id}",
            stdout=out,
        )

        initial_digital_id.refresh_from_db()
        self.assertFalse(initial_digital_id.is_active)

        active_id = DigitalID.objects.filter(tourist=tourist, is_active=True).first()
        self.assertIsNotNone(active_id)
        self.assertNotEqual(active_id.id_token, initial_digital_id.id_token)
        self.assertIn("Successfully processed: 1", out.getvalue())
