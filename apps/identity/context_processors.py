from django.conf import settings


def auth_user_context(request):
    """
    Context processor that supplies authenticated user profile, active Digital ID,
    guide profile, role state, and Google OAuth configuration to every HTML template.
    """
    context = {
        "current_user": getattr(request, "user", None),
        "is_authenticated": (
            request.user.is_authenticated if hasattr(request, "user") else False
        ),
        "current_user_profile": None,
        "current_tourist": None,
        "current_digital_id": None,
        "current_guide": None,
        "user_role": None,
        "google_oauth_client_id": getattr(settings, "GOOGLE_OAUTH_CLIENT_ID", ""),
    }

    if hasattr(request, "user") and request.user.is_authenticated:
        profile = getattr(request.user, "profile", None)
        context["current_user_profile"] = profile
        if profile:
            context["user_role"] = profile.role

        tourist = getattr(request.user, "tourist_profile", None)
        if tourist:
            context["current_tourist"] = tourist
            context["current_digital_id"] = tourist.digital_ids.filter(
                is_active=True
            ).first()

        guide = getattr(request.user, "guide_profile", None)
        if guide:
            context["current_guide"] = guide

    return context
