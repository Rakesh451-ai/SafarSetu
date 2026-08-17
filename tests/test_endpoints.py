from django.test import Client, TestCase
from django.urls import reverse


class SafarSetuSmokeTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_health_check(self):
        response = self.client.get(reverse("api-health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")
        self.assertEqual(len(response.json()["modules"]), 8)

    def test_openapi_schema(self):
        response = self.client.get(reverse("schema"))
        self.assertEqual(response.status_code, 200)

    def test_swagger_ui(self):
        response = self.client.get(reverse("swagger-ui"))
        self.assertEqual(response.status_code, 200)

    def test_redoc_ui(self):
        response = self.client.get(reverse("redoc"))
        self.assertEqual(response.status_code, 200)

    def test_identity_status(self):
        response = self.client.get(reverse("identity:status"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["module"], "identity")

    def test_listings_endpoint(self):
        response = self.client.get(reverse("listings:listing-list"))
        self.assertEqual(response.status_code, 200)
