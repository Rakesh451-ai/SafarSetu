from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q

User = get_user_model()


class EmailOrUsernameModelBackend(ModelBackend):
    """
    Custom authentication backend that permits users to authenticate
    using either their username OR their email address (case-insensitive).
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD) or kwargs.get("email")

        if not username or not password:
            return None

        # Search by exact username or case-insensitive email/username
        user = (
            User.objects.filter(
                Q(username__iexact=username) | Q(email__iexact=username)
            )
            .order_by("id")
            .first()
        )

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
