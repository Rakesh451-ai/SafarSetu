from django.core.management.base import BaseCommand

from apps.identity.demo_service import DEMO_USERS, get_or_create_demo_user


class Command(BaseCommand):
    help = "Initializes default demonstration users for SafarSetu (Tourist, Guide, Responder, Admin)."

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.NOTICE("Initializing SafarSetu demo user accounts...")
        )
        for role_key in DEMO_USERS:
            user = get_or_create_demo_user(role_key)
            self.stdout.write(
                self.style.SUCCESS(
                    f"✓ Provisioned {role_key.upper()} account: {user.username} (Password: {DEMO_USERS[role_key]['password']})"
                )
            )
        self.stdout.write(
            self.style.SUCCESS("All SafarSetu demo users successfully created/updated!")
        )
