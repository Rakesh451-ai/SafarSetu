from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow ADMIN role users or staff to create/edit listings.
    Public read access for all tourists and anonymous users.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.is_staff or request.user.is_superuser:
            return True

        profile = getattr(request.user, "profile", None)
        return bool(profile and profile.role == "ADMIN")
