import math
from typing import Any, Dict, List, Optional

from apps.poi.models import POI


def calculate_haversine_distance_km(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Calculates great-circle distance between two GPS coordinates in kilometers.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def get_nearby_hidden_gems(
    poi: POI, max_distance_km: float = 20.0, limit: int = 3
) -> List[Dict[str, Any]]:
    """
    Finds offbeat/lesser-known hidden gem POIs nearby the target POI using distance calculation.
    """
    hidden_gems = POI.objects.filter(is_hidden_gem=True, is_active=True).exclude(
        poi_id=poi.poi_id
    )

    nearby_list = []
    lat1 = float(poi.latitude)
    lng1 = float(poi.longitude)

    for gem in hidden_gems:
        lat2 = float(gem.latitude)
        lng2 = float(gem.longitude)
        dist = calculate_haversine_distance_km(lat1, lng1, lat2, lng2)
        if dist <= max_distance_km:
            nearby_list.append(
                {
                    "poi_id": str(gem.poi_id),
                    "name": gem.name,
                    "category": gem.category,
                    "region": gem.region,
                    "distance_km": dist,
                    "distance_text": f"{dist} km away",
                    "description": gem.description,
                    "best_time_to_visit": gem.best_time_to_visit,
                    "avg_visit_duration_minutes": gem.avg_visit_duration_minutes,
                    "images": gem.images,
                    "rating": float(gem.rating),
                    "entry_gate_qr_id": gem.entry_gate_qr_id,
                }
            )

    nearby_list.sort(key=lambda x: x["distance_km"])
    return nearby_list[:limit]


def build_tour_brief(
    poi_id_or_instance: Any, itinerary_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Structured Tour Brief Service:
    Returns the complete place-detail and tour preparation bundle for a POI,
    including logistics, transport options, accommodation, and curated hidden gems.
    """
    if isinstance(poi_id_or_instance, POI):
        poi = poi_id_or_instance
    else:
        poi = POI.objects.get(poi_id=poi_id_or_instance)

    # 1. Transport options
    transports = []
    for t in poi.transport_options.all():
        transports.append(
            {
                "transport_id": str(t.transport_id),
                "mode": t.mode,
                "mode_display": t.get_mode_display(),
                "from_landmark": t.from_landmark,
                "estimated_price_range": t.estimated_price_range,
                "estimated_duration": t.estimated_duration,
                "verified": t.verified,
                "source_verified_by": t.source_verified_by,
            }
        )

    # 2. Accommodation options
    accommodations = []
    for acc in poi.accommodation_options.all():
        accommodations.append(
            {
                "accommodation_id": str(acc.accommodation_id),
                "name": acc.name,
                "type": acc.type,
                "type_display": acc.get_type_display(),
                "price_range": acc.price_range,
                "distance_from_poi": acc.distance_from_poi,
                "rating": float(acc.rating),
                "verified": acc.verified,
            }
        )

    # 3. Nearby Hidden Gems (Offbeat suggestions)
    nearby_gems = get_nearby_hidden_gems(poi, max_distance_km=25.0, limit=3)

    return {
        "poi_id": str(poi.poi_id),
        "name": poi.name,
        "category": poi.category,
        "region": poi.region,
        "city": poi.city,
        "is_hidden_gem": poi.is_hidden_gem,
        "entry_gate_qr_id": poi.entry_gate_qr_id,
        "overview": {
            "description": poi.description,
            "history": poi.history,
            "facilities": poi.facilities,
            "entry_fee_info": poi.entry_fee_info,
            "rating": float(poi.rating),
            "coordinates": {
                "latitude": float(poi.latitude),
                "longitude": float(poi.longitude),
            },
        },
        "media": {
            "images": poi.images,
            "short_video_url": poi.short_video_url,
            "three_sixty_media_url": poi.three_sixty_media_url,
        },
        "visit_logistics": {
            "best_time_to_visit": poi.best_time_to_visit,
            "avg_visit_duration_minutes": poi.avg_visit_duration_minutes,
            "recommended_hours_text": (
                f"{poi.avg_visit_duration_minutes // 60}h {poi.avg_visit_duration_minutes % 60}m"
                if poi.avg_visit_duration_minutes >= 60
                else f"{poi.avg_visit_duration_minutes} mins"
            ),
        },
        "how_to_get_there": transports,
        "where_to_stay": accommodations,
        "price_transparency": {
            "entry_ticket": poi.entry_fee_info,
            "transport_guidance": "Regulated prepaid booths available at railway station and airport exits.",
            "average_daily_budget": "₹1,200 – ₹3,500 (Moderate)",
        },
        "suggested_hidden_gems": nearby_gems,
        "itinerary_id": str(itinerary_id) if itinerary_id else None,
    }
