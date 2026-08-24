import math
from typing import Tuple, Optional, Dict, Any, List
from shapely.geometry import Point, Polygon
from geopy.distance import geodesic
from .models import SafetyZone, SafetyAlert


def is_point_inside_polygon(lat: float, lng: float, polygon_coords: List[List[float]]) -> bool:
    """
    Check if (lat, lng) point is inside polygon defined by list of [lat, lng] pairs.
    Uses Shapely geometry.
    """
    if not polygon_coords or len(polygon_coords) < 3:
        return False
    try:
        # Shapely expects (x, y) which is (lng, lat)
        poly_points = [(p[1], p[0]) for p in polygon_coords]
        poly = Polygon(poly_points)
        pt = Point(lng, lat)
        return poly.contains(pt) or poly.touches(pt)
    except Exception:
        # Robust Ray-casting fallback
        n = len(polygon_coords)
        inside = False
        p1lat, p1lng = polygon_coords[0]
        for i in range(n + 1):
            p2lat, p2lng = polygon_coords[i % n]
            if lng > min(p1lng, p2lng):
                if lng <= max(p1lng, p2lng):
                    if lat <= max(p1lat, p2lat):
                        if p1lng != p2lng:
                            xinters = (lng - p1lng) * (p2lat - p1lat) / (p2lng - p1lng) + p1lat
                        if p1lat == p2lat or lat <= xinters:
                            inside = not inside
            p1lat, p1lng = p2lat, p2lng
        return inside


def check_location_safety(lat: float, lng: float) -> Dict[str, Any]:
    """
    Evaluate GPS coordinates against all active SafetyZones.
    Checks Danger zones first, then Caution zones, then Safe zones.
    """
    active_zones = SafetyZone.objects.filter(is_active=True)

    # 1. Check Danger zones
    danger_zones = [z for z in active_zones if z.zone_type == 'danger']
    for zone in danger_zones:
        if is_point_inside_polygon(lat, lng, zone.polygon_coordinates):
            return {
                'status': 'DANGER',
                'zone': zone.name,
                'severity': zone.severity,
                'message': zone.active_advisory or zone.description,
                'zone_id': zone.id
            }

    # 2. Check Caution zones
    caution_zones = [z for z in active_zones if z.zone_type == 'caution']
    for zone in caution_zones:
        if is_point_inside_polygon(lat, lng, zone.polygon_coordinates):
            return {
                'status': 'CAUTION',
                'zone': zone.name,
                'severity': zone.severity,
                'message': zone.active_advisory or zone.description,
                'zone_id': zone.id
            }

    # 3. Check Safe zones
    safe_zones = [z for z in active_zones if z.zone_type == 'safe']
    for zone in safe_zones:
        if is_point_inside_polygon(lat, lng, zone.polygon_coordinates):
            return {
                'status': 'SAFE',
                'zone': zone.name,
                'severity': zone.severity,
                'message': zone.active_advisory or 'You are inside a verified secure tourist corridor.',
                'zone_id': zone.id
            }

    # Default if outside specific geo-fences
    return {
        'status': 'SAFE',
        'zone': None,
        'severity': 'low',
        'message': 'No active geo-fence restrictions or hazard advisories in this area.',
        'zone_id': None
    }


def get_nearby_safety_alerts(lat: float, lng: float, radius_km: float = 15.0) -> List[SafetyAlert]:
    """Find active safety alerts within radius_km."""
    active_alerts = SafetyAlert.objects.filter(is_active=True)
    nearby_alerts = []
    origin = (lat, lng)

    for alert in active_alerts:
        alert_coords = (alert.latitude, alert.longitude)
        dist_km = geodesic(origin, alert_coords).kilometers
        if dist_km <= radius_km:
            nearby_alerts.append(alert)

    return nearby_alerts
