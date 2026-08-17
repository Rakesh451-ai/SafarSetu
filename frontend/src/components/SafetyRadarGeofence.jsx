import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Shield,
  AlertTriangle,
  AlertOctagon,
  Radio,
  Navigation,
  RefreshCw,
  Wifi,
  WifiOff,
  Crosshair,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  resolveOfflineZone,
  enqueueOfflinePing,
  FALLBACK_GEOJSON_ZONES,
} from '../utils/geofence';

export const PRESET_LOCATIONS = [
  {
    name: 'Amber Fort Courtyard (Safe)',
    lat: 26.9855,
    lng: 75.8513,
    expectedZone: 'safe',
    desc: 'Main heritage concourse with security and shade.',
  },
  {
    name: 'Jaigarh-Amber Trail (Caution)',
    lat: 26.9825,
    lng: 75.8470,
    expectedZone: 'caution',
    desc: 'Steep hill path connecting Amber to Jaigarh Fort.',
  },
  {
    name: 'Cheel Ka Teela Cliff (Danger)',
    lat: 26.9850,
    lng: 75.8400,
    expectedZone: 'danger',
    desc: 'Unfenced vertical cliffside & restricted ramparts.',
  },
];

export default function SafetyRadarGeofence({
  tourist,
  isOnline,
  onPingQueued,
}) {
  const [currentCoords, setCurrentCoords] = useState({
    lat: 26.9855,
    lng: 75.8513,
  });
  const [currentZoneStatus, setCurrentZoneStatus] = useState('safe');
  const [activeZoneDetails, setActiveZoneDetails] = useState(null);
  const [transitionAlert, setTransitionAlert] = useState(null);
  const [isSimulatingMovement, setIsSimulatingMovement] = useState(false);
  const [lastPingTime, setLastPingTime] = useState(new Date().toLocaleTimeString());
  const [zonesGeoJSON, setZonesGeoJSON] = useState(FALLBACK_GEOJSON_ZONES);

  // Fetch live zones from backend on mount if online
  useEffect(() => {
    async function loadZones() {
      try {
        const resp = await fetch('/api/v1/zones/');
        if (resp.ok) {
          const data = await resp.json();
          setZonesGeoJSON(data);
        }
      } catch (err) {
        console.log('Using offline cached zones:', err);
      }
    }
    loadZones();
  }, []);

  // Evaluate GPS location against geofence zones
  const handleEvaluateLocation = async (lat, lng) => {
    setCurrentCoords({ lat, lng });
    const { zone_status, zone } = resolveOfflineZone(lat, lng, zonesGeoJSON);

    // Detect zone transition
    if (zone_status !== currentZoneStatus) {
      const alertMsg =
        zone_status === 'danger'
          ? '🚨 HIGH RISK WARNING: You have entered a Restricted Danger Zone (Cheel Ka Teela Cliffside)!'
          : zone_status === 'caution'
          ? '⚠️ CAUTION: Entering Jaigarh mountain ridge. Intermittent cellular coverage.'
          : '✅ Returned to Safe Heritage Precinct.';

      setTransitionAlert({
        from: currentZoneStatus,
        to: zone_status,
        message: alertMsg,
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    setCurrentZoneStatus(zone_status);
    setActiveZoneDetails(zone?.properties || null);
    setLastPingTime(new Date().toLocaleTimeString());

    // Record ping (send to API if online, or queue if offline)
    if (isOnline && tourist?.tourist_id) {
      try {
        const resp = await fetch('/api/v1/location/ping/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourist_id: tourist.tourist_id,
            latitude: lat,
            longitude: lng,
          }),
        });
        if (!resp.ok) throw new Error('Failed to send ping');
      } catch (err) {
        enqueueOfflinePing({
          tourist_id: tourist?.tourist_id || 'anonymous_tourist',
          latitude: lat,
          longitude: lng,
          zone_status_at_ping: zone_status,
        });
        if (onPingQueued) onPingQueued();
      }
    } else {
      enqueueOfflinePing({
        tourist_id: tourist?.tourist_id || 'anonymous_tourist',
        latitude: lat,
        longitude: lng,
        zone_status_at_ping: zone_status,
      });
      if (onPingQueued) onPingQueued();
    }
  };

  const getStatusBadge = () => {
    if (currentZoneStatus === 'danger') {
      return (
        <span className="badge badge-danger" style={{ fontSize: '13px', padding: '6px 14px' }}>
          <AlertOctagon size={16} />
          DANGER ZONE
        </span>
      );
    }
    if (currentZoneStatus === 'caution') {
      return (
        <span className="badge badge-caution" style={{ fontSize: '13px', padding: '6px 14px' }}>
          <AlertTriangle size={16} />
          CAUTION ZONE
        </span>
      );
    }
    return (
      <span className="badge badge-safe" style={{ fontSize: '13px', padding: '6px 14px' }}>
        <Shield size={16} />
        SAFE PRECINCT
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Status Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio style={{ color: '#0284c7' }} />
            Safety Radar & Offline Geofence Tracker
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Instant client-side point-in-polygon evaluation with offline telemetry queueing.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getStatusBadge()}
        </div>
      </div>

      {/* Zone Transition Alert Banner */}
      {transitionAlert && (
        <div
          className="card"
          style={{
            background:
              transitionAlert.to === 'danger'
                ? 'var(--status-danger-bg)'
                : transitionAlert.to === 'caution'
                ? 'var(--status-caution-bg)'
                : 'var(--status-safe-bg)',
            border: `1px solid ${
              transitionAlert.to === 'danger'
                ? 'var(--status-danger-border)'
                : transitionAlert.to === 'caution'
                ? 'var(--status-caution-border)'
                : 'var(--status-safe-border)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {transitionAlert.to === 'danger' ? (
              <AlertOctagon size={24} style={{ color: 'var(--status-danger)' }} />
            ) : transitionAlert.to === 'caution' ? (
              <AlertTriangle size={24} style={{ color: 'var(--status-caution)' }} />
            ) : (
              <Shield size={24} style={{ color: 'var(--status-safe)' }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{transitionAlert.message}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Zone transition recorded at {transitionAlert.timestamp}
              </div>
            </div>
          </div>
          <button
            onClick={() => setTransitionAlert(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Grid: Radar Display & Controls */}
      <div className="grid-2">
        {/* Left Column: Radar Viewport */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Crosshair size={16} style={{ color: '#38bdf8' }} />
              Amber Fort Precinct Radar (Simulated Map)
            </h3>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
              GPS: {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
            </span>
          </div>

          {/* Interactive Radar Box */}
          <div className="radar-canvas-box">
            <div className="radar-grid" />

            {/* Concentric Radar Rings */}
            <div className="radar-ring" style={{ width: '100px', height: '100px' }} />
            <div className="radar-ring" style={{ width: '200px', height: '200px' }} />
            <div className="radar-ring" style={{ width: '280px', height: '280px' }} />

            {/* Zone Boundaries Simulation overlays */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                width: '120px',
                height: '110px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#10b981',
                textAlign: 'center',
              }}
            >
              Amber Fort (Safe)
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '100px',
                width: '110px',
                height: '100px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '2px dashed rgba(245, 158, 11, 0.6)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#f59e0b',
                textAlign: 'center',
              }}
            >
              Jaigarh Trail (Caution)
            </div>

            <div
              style={{
                position: 'absolute',
                top: '60px',
                left: '40px',
                width: '120px',
                height: '110px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgba(239, 68, 68, 0.7)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#ef4444',
                textAlign: 'center',
              }}
            >
              Cheel Ka Teela (Danger)
            </div>

            {/* Tourist User Location Marker Pin */}
            <div
              style={{
                position: 'absolute',
                zIndex: 10,
                transform: 'translate(-50%, -50%)',
                top:
                  currentZoneStatus === 'danger'
                    ? '115px'
                    : currentZoneStatus === 'caution'
                    ? '220px'
                    : '95px',
                left:
                  currentZoneStatus === 'danger'
                    ? '100px'
                    : currentZoneStatus === 'caution'
                    ? '230px'
                    : '260px',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background:
                    currentZoneStatus === 'danger'
                      ? '#ef4444'
                      : currentZoneStatus === 'caution'
                      ? '#f59e0b'
                      : '#10b981',
                  border: '3px solid #ffffff',
                  boxShadow: '0 0 15px rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
              </div>
              <div
                style={{
                  background: '#090d16',
                  color: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700,
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                You ({tourist?.name || 'Tourist'})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Last Telemetry Ping: {lastPingTime}</span>
            <span>Network: {isOnline ? 'Online Sync Active' : 'Offline Queue Active'}</span>
          </div>
        </div>

        {/* Right Column: GPS Simulator Controls */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={16} style={{ color: 'var(--safar-saffron)' }} />
            GPS Location Simulator & Test Points
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Click below to simulate moving between safe, caution, and danger geofence boundaries.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PRESET_LOCATIONS.map((preset) => {
              const isSelected =
                Math.abs(currentCoords.lat - preset.lat) < 0.0001 &&
                Math.abs(currentCoords.lng - preset.lng) < 0.0001;

              return (
                <button
                  key={preset.name}
                  onClick={() => handleEvaluateLocation(preset.lat, preset.lng)}
                  className="card"
                  style={{
                    padding: '14px',
                    textAlign: 'left',
                    background: isSelected ? 'var(--bg-surface-raised)' : 'var(--bg-surface)',
                    borderColor: isSelected
                      ? preset.expectedZone === 'danger'
                        ? '#ef4444'
                        : preset.expectedZone === 'caution'
                        ? '#f59e0b'
                        : '#10b981'
                      : 'var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                      {preset.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {preset.desc}
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
                      ({preset.lat.toFixed(4)}, {preset.lng.toFixed(4)})
                    </div>
                  </div>

                  <span
                    className={`badge badge-${preset.expectedZone}`}
                    style={{ fontSize: '11px' }}
                  >
                    {preset.expectedZone.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Zone Detail Card */}
          {activeZoneDetails && (
            <div style={{ padding: '14px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Active Zone Jurisdiction
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff', marginTop: '2px' }}>
                {activeZoneDetails.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {activeZoneDetails.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
