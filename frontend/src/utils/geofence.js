/**
 * Offline Geofencing and Point-in-Polygon Engine for SafarSetu PWA.
 * Implements Jordan curve theorem ray-casting algorithm to resolve zones directly on device.
 */

// Offline fallback zones around Amber Fort, Jaipur in GeoJSON format
export const FALLBACK_GEOJSON_ZONES = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "45896675-3b7d-42de-9481-4398fc5a4dfc",
      properties: {
        zone_id: "45896675-3b7d-42de-9481-4398fc5a4dfc",
        name: "Amber Fort Tourist Heritage Precinct",
        type: "safe",
        region: "Jaipur",
        description: "Official tourist concourse with security and medical kiosks.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.8490, 26.9840],
            [75.8540, 26.9840],
            [75.8540, 26.9880],
            [75.8490, 26.9880],
            [75.8490, 26.9840],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "066f3f13-0032-48e3-a8f4-96d32f3e669f",
      properties: {
        zone_id: "066f3f13-0032-48e3-a8f4-96d32f3e669f",
        name: "Jaigarh-Amber Mountain Trail & Ridge",
        type: "caution",
        region: "Jaipur",
        description: "Steep uneven terrain with intermittent cellular coverage.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.8450, 26.9800],
            [75.8490, 26.9800],
            [75.8490, 26.9850],
            [75.8450, 26.9850],
            [75.8450, 26.9800],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "fcb06787-9d76-4d47-bd86-c78dac9b878b",
      properties: {
        zone_id: "fcb06787-9d76-4d47-bd86-c78dac9b878b",
        name: "Cheel Ka Teela Restricted Cliffside & Unfenced Ramparts",
        type: "danger",
        region: "Jaipur",
        description: "Unfenced 400ft vertical drop and high-risk wildlife zone.",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.8380, 26.9820],
            [75.8430, 26.9820],
            [75.8430, 26.9870],
            [75.8380, 26.9870],
            [75.8380, 26.9820],
          ],
        ],
      },
    },
  ],
};

/**
 * Standard Ray-Casting algorithm to determine if a [lng, lat] point is inside a polygon ring.
 * @param {[number, number]} point - [longitude, latitude]
 * @param {Array<[number, number]>} ring - Array of [longitude, latitude] coordinates
 * @returns {boolean} True if point is inside
 */
export function isPointInPolygonRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Resolves the safety zone for a given latitude and longitude.
 * Danger zones take top priority, followed by Caution, then Safe.
 * @param {number} latitude
 * @param {number} longitude
 * @param {Object} geojsonData - FeatureCollection of GeoJSON Zones
 * @returns {{ zone_status: 'safe'|'caution'|'danger'|'unknown', zone: Object|null }}
 */
export function resolveOfflineZone(latitude, longitude, geojsonData = FALLBACK_GEOJSON_ZONES) {
  const pt = [longitude, latitude];
  const features = geojsonData?.features || [];

  const matchedZones = [];

  for (const feature of features) {
    const geom = feature.geometry;
    if (!geom) continue;

    let isInside = false;
    if (geom.type === "Polygon") {
      // First ring is exterior boundary
      if (isPointInPolygonRing(pt, geom.coordinates[0])) {
        // If there are holes, check if inside any hole
        let insideHole = false;
        for (let h = 1; h < geom.coordinates.length; h++) {
          if (isPointInPolygonRing(pt, geom.coordinates[h])) {
            insideHole = true;
            break;
          }
        }
        if (!insideHole) isInside = true;
      }
    } else if (geom.type === "MultiPolygon") {
      for (const polyCoords of geom.coordinates) {
        if (isPointInPolygonRing(pt, polyCoords[0])) {
          isInside = true;
          break;
        }
      }
    }

    if (isInside) {
      matchedZones.push(feature);
    }
  }

  if (matchedZones.length === 0) {
    return { zone_status: "safe", zone: null, is_outside_precinct: true };
  }

  // Priority order: danger > caution > safe
  const dangerZone = matchedZones.find(
    (z) => (z.properties?.type || "").toLowerCase() === "danger"
  );
  if (dangerZone) {
    return { zone_status: "danger", zone: dangerZone, is_outside_precinct: false };
  }

  const cautionZone = matchedZones.find(
    (z) => (z.properties?.type || "").toLowerCase() === "caution"
  );
  if (cautionZone) {
    return { zone_status: "caution", zone: cautionZone, is_outside_precinct: false };
  }

  const safeZone = matchedZones.find(
    (z) => (z.properties?.type || "").toLowerCase() === "safe"
  );
  return {
    zone_status: safeZone ? "safe" : "unknown",
    zone: safeZone || matchedZones[0],
    is_outside_precinct: false,
  };
}

// -------------------------------------------------------------
// Offline Ping Queue Management (LocalStorage / IndexedDB Sync)
// -------------------------------------------------------------
const QUEUE_STORAGE_KEY = "safarsetu_offline_pings_queue";

export function getQueuedPings() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read offline queue:", err);
    return [];
  }
}

export function enqueueOfflinePing(pingData) {
  try {
    const queue = getQueuedPings();
    queue.push({
      ...pingData,
      queued_at: new Date().toISOString(),
      id: "offline_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    });
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    console.log(`📡 [Offline Ping Enqueued] Total queued: ${queue.length}`, pingData);
    return queue.length;
  } catch (err) {
    console.error("Failed to enqueue offline ping:", err);
    return 0;
  }
}

export function clearOfflinePings() {
  localStorage.removeItem(QUEUE_STORAGE_KEY);
}

/**
 * Synchronizes queued offline pings with the Django API backend.
 */
export async function syncQueuedPingsToServer(touristId) {
  const queue = getQueuedPings();
  if (!queue.length) return { synced: 0, failed: 0 };

  console.log(`🔄 [Auto-Sync] Attempting to flush ${queue.length} offline location pings to server...`);
  let synced = 0;
  let failed = 0;
  const remaining = [];

  for (const ping of queue) {
    try {
      const response = await fetch("/api/v1/location/ping/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourist_id: touristId || ping.tourist_id,
          latitude: ping.latitude,
          longitude: ping.longitude,
        }),
      });

      if (response.ok) {
        synced++;
      } else {
        failed++;
        remaining.push(ping);
      }
    } catch (err) {
      console.warn("Sync failed for ping item, will retry later:", err);
      failed++;
      remaining.push(ping);
    }
  }

  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remaining));
  return { synced, failed, remaining: remaining.length };
}
