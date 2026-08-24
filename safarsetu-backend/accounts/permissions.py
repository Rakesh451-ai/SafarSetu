from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import User


class IsTourist(BasePermission):
    """Allows access only to authenticated users with TOURIST role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.TOURIST
        )


class IsAdminRole(BasePermission):
    """Allows access only to ADMIN role or superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == User.Role.ADMIN or request.user.is_staff or request.user.is_superuser)
        )


class IsResponseOperator(BasePermission):
    """Allows access to emergency RESPONSE_OPERATOR role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == User.Role.RESPONSE_OPERATOR
        )


class IsResponseOperatorOrAdmin(BasePermission):
    """Allows access to either RESPONSE_OPERATOR, ADMIN, or staff/superuser."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in [User.Role.ADMIN, User.Role.RESPONSE_OPERATOR] or request.user.is_staff or request.user.is_superuser)
        )


class IsOwnerOrAdmin(BasePermission):
    """Object-level permission allowing owners or admins to edit/delete."""
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == User.Role.ADMIN or request.user.is_staff or request.user.is_superuser:
            return True
        # Check direct user attribute or tourist.user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'tourist') and hasattr(obj.tourist, 'user'):
            return obj.tourist.user == request.user
        return False
