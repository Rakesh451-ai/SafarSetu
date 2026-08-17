from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from apps.identity.models import DigitalID, Tourist
from apps.identity.qr_service import create_or_rotate_digital_id


class Command(BaseCommand):
    help = (
        "Regenerates signed JWT payloads and QR code images for active DigitalIDs. "
        "Intended for daily automated execution by Celery Beat."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--tourist-id",
            type=str,
            help="Optional UUID of a specific tourist whose QR signature should be rotated.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Simulate rotation without committing database changes.",
        )

    def handle(self, *args, **options):
        tourist_id = options.get("tourist_id")
        dry_run = options.get("dry_run", False)
        now = timezone.now()

        if tourist_id:
            try:
                tourists = Tourist.objects.filter(tourist_id=tourist_id)
                if not tourists.exists():
                    raise CommandError(f"Tourist with ID '{tourist_id}' not found.")
            except Exception as e:
                raise CommandError(f"Invalid tourist ID format: {e}")
        else:
            # Query tourists with active trip or unexpired digital IDs
            active_ids = DigitalID.objects.filter(
                is_active=True, expires_at__gt=now
            ).values_list("tourist_id", flat=True)
            tourists = Tourist.objects.filter(tourist_id__in=active_ids)

        total_count = tourists.count()
        self.stdout.write(
            self.style.NOTICE(
                f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Starting QR signature rotation for {total_count} tourist(s)..."
            )
        )

        success_count = 0
        failure_count = 0

        for tourist in tourists:
            try:
                if dry_run:
                    self.stdout.write(
                        f" [DRY RUN] Would rotate signature for {tourist.name} ({tourist.tourist_id})"
                    )
                else:
                    new_digital_id = create_or_rotate_digital_id(tourist)
                    self.stdout.write(
                        self.style.SUCCESS(
                            f" ✓ Rotated signature for {tourist.name} ({tourist.tourist_id}) -> New Token: {new_digital_id.id_token}"
                        )
                    )
                success_count += 1
            except Exception as exc:
                self.stderr.write(
                    self.style.ERROR(
                        f" ✗ Failed rotating signature for {tourist.name} ({tourist.tourist_id}): {exc}"
                    )
                )
                failure_count += 1

        status_msg = f"Rotation completed. Successfully processed: {success_count}, Failures: {failure_count}."
        if dry_run:
            status_msg = f"[DRY RUN] {status_msg}"

        self.stdout.write(self.style.SUCCESS(status_msg))
