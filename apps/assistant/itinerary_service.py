import logging
from typing import Any, Dict, List, Optional

from apps.guide.models import TourPackage
from apps.identity.models import Tourist

from .llm_client import default_llm_client
from .models import Itinerary
from .retrieval import retrieve_pois_by_interests
from .safety_evaluator import filter_and_assess_candidate_pois

logger = logging.getLogger("safarsetu.assistant")


def generate_itinerary_plan(
    tourist: Tourist,
    destination_city: str = "Jaipur",
    duration_days: int = 2,
    interests: Optional[List[str]] = None,
    want_guided_option: bool = True,
) -> Dict[str, Any]:
    """
    Core Itinerary Generation Pipeline:
    1. Retrieves candidate POIs based on interests and destination.
    2. Runs safety assessment against Phase 4 Geofence Zones (excludes danger POIs).
    3. Finds matching verified Guide Tour Packages.
    4. Invokes LLM to construct a day-by-day plan in tourist's preferred language.
    5. Persists the generated itinerary to the Itinerary model.
    """
    interest_list = interests or ["heritage", "culture", "forts", "sightseeing"]

    # 1. Retrieve candidate POIs
    candidate_pois = retrieve_pois_by_interests(
        interests=interest_list,
        city=destination_city,
        limit=20,
    )

    # 2. Safety Assessment & Geofence Filtering
    safety_assessment = filter_and_assess_candidate_pois(candidate_pois)

    # 3. Query matching verified TourPackages from guide app
    suggested_packages_qs = TourPackage.objects.filter(
        guide__verified=True,
    ).select_related("guide", "guide__user")

    if destination_city:
        suggested_packages_qs = suggested_packages_qs.filter(
            guide__regions_served__icontains=destination_city
        )

    matched_packages = list(suggested_packages_qs[:3])
    suggested_packages_data = [
        {
            "package_id": pkg.id,
            "title": pkg.title,
            "guide_name": pkg.guide.user.get_full_name() or pkg.guide.user.username,
            "guide_rating": float(pkg.guide.rating_avg),
            "languages": pkg.guide.languages_spoken,
            "duration": pkg.duration,
            "price": float(pkg.price),
            "max_group_size": pkg.max_group_size,
        }
        for pkg in matched_packages
    ]

    # 4. LLM Generation
    itinerary_data = default_llm_client.generate_structured_itinerary(
        tourist_name=tourist.name,
        city=destination_city,
        duration_days=duration_days,
        interests=interest_list,
        candidate_pois=[
            {
                "title": p.title,
                "category": p.category.name if p.category else "Sightseeing",
            }
            for p in candidate_pois
        ],
        safety_assessment=safety_assessment,
        suggested_packages=suggested_packages_data if want_guided_option else [],
        language=tourist.preferred_language or "en",
    )

    # 5. Persist Itinerary Model
    title = f"{duration_days}-Day Curated Safe Tour of {destination_city}"
    itinerary_obj = Itinerary.objects.create(
        tourist=tourist,
        title=title,
        destination_city=destination_city,
        duration_days=duration_days,
        interests=interest_list,
        day_by_day_plan=itinerary_data.get("days", []),
        safety_assessment=safety_assessment,
    )

    if matched_packages and want_guided_option:
        itinerary_obj.suggested_packages.set(matched_packages)

    itinerary_data["itinerary_id"] = str(itinerary_obj.itinerary_id)
    itinerary_data["title"] = itinerary_obj.title
    itinerary_data["created_at"] = itinerary_obj.created_at.isoformat()

    return itinerary_data
