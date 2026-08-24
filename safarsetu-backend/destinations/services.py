import math
from geopy.distance import geodesic
from .models import Destination


def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def get_nearby_destinations(lat: float, lng: float, radius_km: float = 50.0, limit: int = 10):
    """
    Returns destinations within radius_km sorted by distance.
    Works seamlessly across all database backends (PostGIS or SQLite).
    """
    # Rough bounding box filter to limit candidates in large databases
    # 1 deg latitude ~ 111 km, 1 deg longitude ~ 111 * cos(lat) km
    lat_delta = radius_km / 111.0
    lng_delta = radius_km / (111.0 * max(math.cos(math.radians(lat)), 0.1))

    candidates = Destination.objects.filter(
        latitude__gte=lat - lat_delta,
        latitude__lte=lat + lat_delta,
        longitude__gte=lng - lng_delta,
        longitude__lte=lng + lng_delta
    )

    results = []
    origin = (lat, lng)

    for dest in candidates:
        dest_coords = (dest.latitude, dest.longitude)
        dist_km = round(geodesic(origin, dest_coords).kilometers, 2)
        if dist_km <= radius_km:
            results.append({
                'destination': dest,
                'distance_km': dist_km,
                'safety_status': 'safe' if dest.safety_rating >= 4.5 else ('caution' if dest.safety_rating >= 3.5 else 'danger')
            })

    results.sort(key=lambda x: x['distance_km'])
    return results[:limit]
