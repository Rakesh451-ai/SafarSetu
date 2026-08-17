from rest_framework import permissions


def is_admin_user(user) -> bool:
    """
    Checks if a user has administrative privileges either via is_staff/is_superuser
    or via UserProfile.role == 'ADMIN'.
    """
    if not user or not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser:
        return True
    if hasattr(user, "profile") and getattr(user.profile, "role", None) == "ADMIN":
        return True
    return False


def is_guide_user(user) -> bool:
    """
    Checks if a user is a registered guide.
    """
    if not user or not user.is_authenticated:
        return False
    if hasattr(user, "profile") and getattr(user.profile, "role", None) == "GUIDE":
        return True
    return hasattr(user, "guide_profile")


class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return is_admin_user(request.user)


class IsOwnerGuideOrAdmin(permissions.BasePermission):
    """
    Allows safe methods for all, but restricts write operations
    to the owning guide user or platform admins.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if is_admin_user(request.user):
            return True

        # Check GuideProfile ownership
        if hasattr(obj, "user"):
            return obj.user == request.user

        # Check TourPackage ownership
        if hasattr(obj, "guide"):
            return obj.guide.user == request.user

        return False


class CanManageBooking(permissions.BasePermission):
    """
    Permissions for viewing and transitioning GuideBookings:
    - View: Tourist owner, assigned guide, or Admin.
    - Transition Status: Only assigned guide or Admin can confirm/complete.
      Tourist can only cancel their own booking.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        if is_admin_user(user):
            return True

        is_assigned_guide = obj.tour_package.guide.user == user
        is_booking_tourist = obj.tourist.user == user if obj.tourist.user else False

        if request.method in permissions.SAFE_METHODS:
            return is_assigned_guide or is_booking_tourist

        # For status mutations
        if request.method in ["PATCH", "PUT"]:
            # If changing status to confirmed or completed, must be guide or admin
            target_status = request.data.get("status")
            if target_status in ["confirmed", "completed"]:
                return is_assigned_guide

            # Tourist can cancel
            if target_status == "cancelled" and is_booking_tourist:
                return True

            return is_assigned_guide

        return False
