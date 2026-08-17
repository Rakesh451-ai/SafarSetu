from datetime import date, timedelta

from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from django.test import Client, TestCase
from django.urls import reverse

from apps.adminpanel.models import AuditAction, AuditLog
from apps.identity.models import IDProofType, Tourist, UserProfile, UserRole
from apps.listings.models import Listing, ListingCategory, ListingType
from apps.sos.models import SOSEvent, SOSStatus, SOSTriggerType
from apps.tracking.models import LocationPing, ZoneType


class ListingsAndAdminPanelTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Admin User
        self.admin_user = User.objects.create_superuser(
            username="super_admin",
            email="admin@safarsetu.gov.in",
            password="AdminPassword123!",
        )
        UserProfile.objects.create(
            user=self.admin_user,
            role=UserRole.ADMIN,
            region_scope="",  # Global admin
        )

        # 2. Regional Responder (Jaipur Jurisdiction)
        self.jaipur_responder = User.objects.create_user(
            username="responder_jaipur",
            email="jaipur.responder@safarsetu.gov.in",
            password="Password123!",
        )
        UserProfile.objects.create(
            user=self.jaipur_responder,
            role=UserRole.RESPONDER,
            region_scope="Jaipur",
        )

        # 3. Regular Tourist User
        self.tourist_user = User.objects.create_user(
            username="tourist_maya",
            email="maya@example.com",
            password="Password123!",
        )
        UserProfile.objects.create(
            user=self.tourist_user,
            role=UserRole.TOURIST,
        )
        self.tourist_jaipur = Tourist.objects.create(
            user=self.tourist_user,
            name="Maya Lin",
            nationality="Singaporean",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="SGP123456",
            phone="+6591234567",
            current_region="Jaipur",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=4),
        )

        # 4. Another Tourist in Udaipur
        self.tourist_udaipur = Tourist.objects.create(
            name="John Miller",
            nationality="British",
            id_proof_type=IDProofType.PASSPORT,
            id_proof_number="GBR998877",
            phone="+447700900123",
            current_region="Udaipur",
            trip_start=date.today(),
            trip_end=date.today() + timedelta(days=6),
        )

        # 5. Category
        self.cat_hotel = ListingCategory.objects.create(name="Hotels", slug="hotels")
        self.cat_transport = ListingCategory.objects.create(
            name="Transport", slug="transport"
        )

        # 6. Seed Sample Listings
        Listing.objects.all().delete()
        self.listing_hotel_amer = Listing.objects.create(
            type=ListingType.HOTEL,
            title="Amer Royal Haveli",
            region="Amer",
            city="Jaipur",
            category=self.cat_hotel,
            price_info="₹3,200 / night",
            rating=4.8,
            verified=True,
            source_verified_by=self.admin_user,
        )
        self.listing_transport_jaipur = Listing.objects.create(
            type=ListingType.TRANSPORT,
            title="Jaipur Junction Prepaid Stand",
            region="Jaipur",
            city="Jaipur",
            category=self.cat_transport,
            price_info="₹15 / km",
            rating=4.7,
            verified=True,
            source_verified_by=self.admin_user,
        )
        self.listing_hotel_udaipur = Listing.objects.create(
            type=ListingType.HOTEL,
            title="Lake Pichola Palace View",
            region="Udaipur",
            city="Udaipur",
            category=self.cat_hotel,
            price_info="₹4,500 / night",
            rating=4.9,
            verified=False,
        )

    # -------------------------------------------------------------
    # PART 1: LISTINGS CRUD & PERMISSIONS TESTS
    # -------------------------------------------------------------
    def test_public_listings_filter_by_type_and_region(self):
        """
        Tests public browse endpoint GET /api/v1/listings?type=&region=&verified=
        """
        # Filter by type=hotel and region=Amer
        response = self.client.get(
            reverse("v1-listings-list-create"),
            {"type": "hotel", "region": "Amer"},
        )
        self.assertEqual(response.status_code, 200)
        res_json = response.json()
        data = res_json.get("results", res_json)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["title"], "Amer Royal Haveli")
        self.assertEqual(data[0]["type"], "hotel")
        self.assertTrue(data[0]["verified"])

        # Filter by type=transport
        resp_trans = self.client.get(
            reverse("v1-listings-list-create"),
            {"type": "transport"},
        )
        self.assertEqual(resp_trans.status_code, 200)
        trans_json = resp_trans.json()
        trans_data = trans_json.get("results", trans_json)
        self.assertEqual(len(trans_data), 1)
        self.assertEqual(trans_data[0]["title"], "Jaipur Junction Prepaid Stand")

    def test_non_staff_write_attempt_gets_403_forbidden(self):
        """
        Tests that unauthenticated and non-admin/tourist users cannot write to listings (403).
        """
        # 1. Anonymous write attempt -> 401/403
        resp_anon = self.client.post(
            reverse("v1-listings-list-create"),
            data={
                "name": "Unauthorized Hotel",
                "type": "hotel",
                "region": "Jaipur",
            },
            content_type="application/json",
        )
        self.assertIn(resp_anon.status_code, [401, 403])

        # 2. Tourist write attempt -> 403 Forbidden
        self.client.force_login(self.tourist_user)
        resp_tourist = self.client.post(
            reverse("v1-listings-list-create"),
            data={
                "name": "Tourist Added Hotel",
                "type": "hotel",
                "region": "Jaipur",
            },
            content_type="application/json",
        )
        self.assertEqual(resp_tourist.status_code, 403)

    def test_admin_can_create_verified_listing(self):
        """
        Tests that Admin/Staff user can successfully create listings.
        """
        self.client.force_login(self.admin_user)
        response = self.client.post(
            reverse("v1-listings-list-create"),
            data={
                "name": "Govt Verified Heritage Taxi Stand",
                "type": "transport",
                "region": "Amer",
                "city": "Jaipur",
                "price_info": "₹20 / km",
                "verified": True,
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["name"], "Govt Verified Heritage Taxi Stand")
        self.assertTrue(response.json()["verified"])

    # -------------------------------------------------------------
    # PART 2: ADMINPANEL & REGION SCOPING & PRIVACY AUDIT TESTS
    # -------------------------------------------------------------
    def test_admin_alerts_scoped_by_region(self):
        """
        Tests GET /api/v1/admin/alerts/:
        - Responder in Jaipur sees Jaipur alerts only.
        - Global Admin sees all alerts.
        """
        # Create SOS event in Jaipur for Maya Lin
        sos_jaipur = SOSEvent.objects.create(
            tourist=self.tourist_jaipur,
            trigger_type=SOSTriggerType.MANUAL,
            location=Point(75.8513, 26.9855, srid=4326),
            status=SOSStatus.ACTIVE,
            notes="Medical distress near Amber Fort.",
        )

        # Create SOS event in Udaipur for John Miller
        SOSEvent.objects.create(
            tourist=self.tourist_udaipur,
            trigger_type=SOSTriggerType.MANUAL,
            location=Point(73.6800, 24.5800, srid=4326),
            status=SOSStatus.ACTIVE,
            notes="Lost passport and stranded in Udaipur.",
        )

        # 1. Test Jaipur Responder (scoped to Jaipur)
        self.client.force_login(self.jaipur_responder)
        resp_jaipur = self.client.get(reverse("v1-admin-alerts"))
        self.assertEqual(resp_jaipur.status_code, 200)
        data_jaipur = resp_jaipur.json()

        self.assertEqual(data_jaipur["scoped_region"], "Jaipur")
        self.assertEqual(data_jaipur["total_unresolved_sos"], 1)
        self.assertEqual(
            data_jaipur["unresolved_sos_events"][0]["tourist_name"], "Maya Lin"
        )
        self.assertEqual(
            data_jaipur["unresolved_sos_events"][0]["sos_id"], str(sos_jaipur.sos_id)
        )

        # 2. Test Global Admin (sees all regions)
        self.client.force_login(self.admin_user)
        resp_admin = self.client.get(reverse("v1-admin-alerts"))
        self.assertEqual(resp_admin.status_code, 200)
        data_admin = resp_admin.json()

        self.assertEqual(data_admin["total_unresolved_sos"], 2)

    def test_active_tourists_location_privacy_and_audit_log(self):
        """
        Tests Privacy by Design:
        1. General active tourist listing MASKS coordinates (privacy protected).
        2. Tourist with open SOS automatically reveals location for emergency dispatch.
        3. Explicit ID lookup reveals coordinates and creates an AuditLog record.
        """
        # Record location ping for Maya Lin
        LocationPing.objects.create(
            tourist=self.tourist_jaipur,
            location=Point(75.8513, 26.9855, srid=4326),
            zone_status_at_ping=ZoneType.SAFE,
        )

        self.client.force_login(self.jaipur_responder)

        # 1. General Active Listing (location is masked)
        resp_list = self.client.get(reverse("v1-admin-tourists-active"))
        self.assertEqual(resp_list.status_code, 200)
        tourist_data = resp_list.json()["tourists"][0]

        self.assertIsNone(tourist_data["location"])
        self.assertEqual(
            tourist_data["privacy_status"], "LOCATION_MASKED_PRIVACY_PROTECTED"
        )

        # 2. Explicit ID Lookup -> Coordinates Revealed & AuditLog Created
        initial_log_count = AuditLog.objects.count()
        resp_explicit = self.client.get(
            reverse("v1-admin-tourists-active")
            + f"?tourist_id={self.tourist_jaipur.tourist_id}&reason=Investigating safety concern"
        )
        self.assertEqual(resp_explicit.status_code, 200)
        explicit_data = resp_explicit.json()["tourists"][0]

        self.assertIsNotNone(explicit_data["location"])
        self.assertEqual(explicit_data["location"]["latitude"], 26.9855)
        self.assertEqual(
            explicit_data["privacy_status"], "LOCATION_DISCLOSED_AUDITED_LOOKUP"
        )

        # Assert AuditLog was created
        self.assertEqual(AuditLog.objects.count(), initial_log_count + 1)
        audit_entry = AuditLog.objects.latest("timestamp")
        self.assertEqual(audit_entry.action, AuditAction.LOCATION_LOOKUP)
        self.assertEqual(audit_entry.target_tourist, self.tourist_jaipur)
        self.assertEqual(audit_entry.user, self.jaipur_responder)
        self.assertIn("Investigating safety concern", audit_entry.reason)

    def test_incident_assign_and_status_update(self):
        """
        Tests:
        1. POST /api/v1/admin/incident/<id>/assign/ updates status to ACKNOWLEDGED and logs audit.
        2. PATCH /api/v1/admin/incident/<id>/status/ updates status to RESOLVED and logs audit.
        """
        sos_event = SOSEvent.objects.create(
            tourist=self.tourist_jaipur,
            trigger_type=SOSTriggerType.MANUAL,
            location=Point(75.8513, 26.9855, srid=4326),
            status=SOSStatus.ACTIVE,
            notes="Trapped on steep trail.",
        )

        self.client.force_login(self.jaipur_responder)

        # 1. Assign Incident
        assign_resp = self.client.post(
            reverse("v1-admin-incident-assign", kwargs={"pk": sos_event.sos_id}),
            data={"responder_notes": "Unit 4 dispatched to trail entrance."},
            content_type="application/json",
        )
        self.assertEqual(assign_resp.status_code, 200)
        self.assertEqual(assign_resp.json()["status"], "acknowledged")

        sos_event.refresh_from_db()
        self.assertEqual(sos_event.status, SOSStatus.ACKNOWLEDGED)
        self.assertIn("Unit 4 dispatched", sos_event.responder_notes)

        # 2. Update Status to RESOLVED
        status_resp = self.client.patch(
            reverse("v1-admin-incident-status", kwargs={"pk": sos_event.sos_id}),
            data={
                "status": "resolved",
                "responder_notes": "Tourist assisted back to hotel safely.",
            },
            content_type="application/json",
        )
        self.assertEqual(status_resp.status_code, 200)
        self.assertEqual(status_resp.json()["status"], "resolved")

        sos_event.refresh_from_db()
        self.assertEqual(sos_event.status, SOSStatus.RESOLVED)
        self.assertIsNotNone(sos_event.resolved_at)

        # Assert AuditLogs created for both operations
        logs = AuditLog.objects.filter(target_incident=sos_event)
        self.assertEqual(logs.count(), 2)
        actions = [log.action for log in logs]
        self.assertIn(AuditAction.INCIDENT_ASSIGN, actions)
        self.assertIn(AuditAction.STATUS_CHANGE, actions)
