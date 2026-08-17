import logging
from typing import Any, Dict, List

from django.contrib.gis.geos import Point

from apps.listings.models import Listing
from apps.tracking.models import Zone, ZoneType

logger = logging.getLogger("safarsetu.assistant")


def evaluate_poi_safety(poi: Listing, active_zones: List[Zone]) -> Dict[str, Any]:
    """
    Evaluates safety status of a POI by testing point-in-polygon containment
    against active Geofence Zones (Safe, Caution, Danger).
    """
    lat = float(poi.latitude) if poi.latitude is not None else 0.0
    lng = float(poi.longitude) if poi.longitude is not None else 0.0

    poi_point = Point(lng, lat, srid=4326)
    resolved_zone = None
    resolved_status = ZoneType.SAFE

    for zone in active_zones:
        try:
            if zone.boundary.contains(poi_point):
                resolved_zone = zone
                resolved_status = zone.type
                break
        except Exception:
            continue

    poi_dict = {
        "id": poi.id,
        "title": poi.title,
        "category": poi.category.name if poi.category else "Attraction",
        "city": poi.city,
        "address": poi.address,
        "rating": float(poi.rating),
        "latitude": lat,
        "longitude": lng,
        "safety_zone": resolved_status,
        "zone_name": resolved_zone.name if resolved_zone else "General Area",
    }

    if resolved_status == ZoneType.DANGER:
        poi_dict["is_safe"] = False
        poi_dict["exclusion_reason"] = (
            f"Located inside high-risk danger zone '{resolved_zone.name if resolved_zone else 'Restricted Area'}'. "
            f"Excluded from public recommendation for tourist safety."
        )
    elif resolved_status == ZoneType.CAUTION:
        poi_dict["is_safe"] = True
        poi_dict["safety_warning"] = (
            f"Located inside caution zone '{resolved_zone.name if resolved_zone else 'Caution Area'}'. "
            f"Daylight visits with certified local guide strongly advised."
        )
    else:
        poi_dict["is_safe"] = True
        poi_dict["safety_note"] = "Located in verified safe tourist zone."

    return poi_dict


def filter_and_assess_candidate_pois(candidate_pois: List[Listing]) -> Dict[str, Any]:
    """
    Classifies candidate POIs into safe_pois, caution_pois, and excluded_danger_pois.
    """
    active_zones = list(Zone.objects.all())

    safe_pois = []
    caution_pois = []
    excluded_danger_pois = []

    for poi in candidate_pois:
        evaluated = evaluate_poi_safety(poi, active_zones)
        if evaluated["safety_zone"] == ZoneType.DANGER:
            excluded_danger_pois.append(evaluated)
            logger.warning(
                "🚫 [ITINERARY SAFETY FILTER] Excluded danger-zone POI: '%s' in zone '%s'.",
                poi.title,
                evaluated.get("zone_name"),
            )
        elif evaluated["safety_zone"] == ZoneType.CAUTION:
            caution_pois.append(evaluated)
        else:
            safe_pois.append(evaluated)

    return {
        "safe_pois": safe_pois,
        "caution_pois": caution_pois,
        "excluded_danger_pois": excluded_danger_pois,
        "total_evaluated": len(candidate_pois),
        "total_approved": len(safe_pois) + len(caution_pois),
        "total_excluded": len(excluded_danger_pois),
    }
