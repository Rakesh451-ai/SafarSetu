import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Shield,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Zap,
  CheckCircle2,
  Navigation,
  Info,
} from 'lucide-react';
import {
  resolveOfflineZone,
  FALLBACK_GEOJSON_ZONES,
} from '../../utils/geofence';

export const DEMO_PRESETS = [
  {
    name: 'Amber Fort Courtyard',
    lat: 26.9855,
    lng: 75.8513,
    expectedZone: 'safe',
    zoneName: 'Amber Fort Tourist Heritage Precinct',
    desc: 'Designated tourist concourse with CCTV surveillance, medical booths, and security officers.',
  },
  {
    name: 'Jaigarh Mountain Trail',
    lat: 26.9825,
    lng: 75.8470,
    expectedZone: 'caution',
    zoneName: 'Jaigarh-Amber Mountain Ridge & Hiking Trail',
    desc: 'Steep incline connecting fortifications. Spotty cellular coverage. Stay on marked paths.',
  },
  {
    name: 'Cheel Ka Teela Cliffside',
    lat: 26.9850,
    lng: 75.8400,
    expectedZone: 'danger',
    zoneName: 'Cheel Ka Teela Restricted Cliffside & Unfenced Ramparts',
    desc: 'High-risk unpatrolled cliff with 400ft vertical drop. Strict safety perimeter enforced.',
  },
];

export default function LiveSafetyDemoWidget({ t }) {
  const [activeCoords, setActiveCoords] = useState({
    lat: 26.9855,
    lng: 75.8513,
  });
  const [currentZoneStatus, setCurrentZoneStatus] = useState('safe');
  const [matchedZone, setMatchedZone] = useState(DEMO_PRESETS[0]);
  const [simulatedAlerts, setSimulatedAlerts] = useState([]);

  const handleSelectLocation = (preset) => {
    setActiveCoords({ lat: preset.lat, lng: preset.lng });
    const { zone_status, zone } = resolveOfflineZone(
      preset.lat,
      preset.lng,
      FALLBACK_GEOJSON_ZONES
    );

    setCurrentZoneStatus(zone_status);
    setMatchedZone(preset);

    // Push simulated audit / telemetry log entry
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      zone_status,
      name: preset.zoneName,
      lat: preset.lat,
      lng: preset.lng,
    };
    setSimulatedAlerts((prev) => [newLog, ...prev.slice(0, 3)]);
  };

  const getStatusColor = (status) => {
    if (status === 'danger') return '#ef4444';
    if (status === 'caution') return '#f59e0b';
    return '#10b981';
  };

  return (
    <section
      id="live-demo"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, rgba(8,12,20,0.9) 0%, rgba(15,23,42,0.95) 50%, rgba(8,12,20,0.9) 100%)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#f59e0b',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            <Radio size={14} />
            {t.demo.tag}
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', color: '#ffffff', marginBottom: '12px' }}>
            {t.demo.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {t.demo.subtitle}
          </p>
        </div>

        {/* Live Safety Widget Canvas Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Column: Interactive Radar Canvas */}
          <div
            className="card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '440px',
              background: '#090d16',
              border: `1px solid ${getStatusColor(currentZoneStatus)}44`,
            }}
          >
            {/* Top Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: getStatusColor(currentZoneStatus),
                    boxShadow: `0 0 10px ${getStatusColor(currentZoneStatus)}`,
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                  Amber Fort Precinct Geofence Grid
                </span>
              </div>

              <span
                className={`badge badge-${currentZoneStatus}`}
                style={{ fontSize: '12px', textTransform: 'uppercase' }}
              >
                {currentZoneStatus} ZONE
              </span>
            </div>

            {/* Radar Viewport */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '280px',
                background: 'radial-gradient(circle at 50% 50%, #151f33 0%, #070a12 100%)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="radar-grid" />
              <div className="radar-ring" style={{ width: '90px', height: '90px' }} />
              <div className="radar-ring" style={{ width: '180px', height: '180px' }} />
              <div className="radar-ring" style={{ width: '250px', height: '250px' }} />

              {/* Polygon 1: Amber Fort (Safe) */}
              <button
                onClick={() => handleSelectLocation(DEMO_PRESETS[0])}
                style={{
                  position: 'absolute',
                  top: '30px',
                  right: '30px',
                  width: '130px',
                  height: '100px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid #10b981',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#10b981',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'transform 0.2s',
                }}
              >
                <Shield size={16} />
                <span>Amber Fort (Safe)</span>
              </button>

              {/* Polygon 2: Jaigarh Trail (Caution) */}
              <button
                onClick={() => handleSelectLocation(DEMO_PRESETS[1])}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  right: '90px',
                  width: '120px',
                  height: '90px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px dashed #f59e0b',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'transform 0.2s',
                }}
              >
                <AlertTriangle size={16} />
                <span>Jaigarh Trail</span>
              </button>

              {/* Polygon 3: Cheel Ka Teela Cliff (Danger) */}
              <button
                onClick={() => handleSelectLocation(DEMO_PRESETS[2])}
                style={{
                  position: 'absolute',
                  top: '40px',
                  left: '30px',
                  width: '130px',
                  height: '100px',
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '2px solid #ef4444',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 700,
                  transition: 'transform 0.2s',
                }}
              >
                <AlertOctagon size={16} />
                <span>Cheel Cliff (Danger)</span>
              </button>

              {/* Animated Pin Marker */}
              <div
                style={{
                  position: 'absolute',
                  zIndex: 20,
                  transform: 'translate(-50%, -50%)',
                  top:
                    currentZoneStatus === 'danger'
                      ? '90px'
                      : currentZoneStatus === 'caution'
                      ? '210px'
                      : '80px',
                  left:
                    currentZoneStatus === 'danger'
                      ? '95px'
                      : currentZoneStatus === 'caution'
                      ? '210px'
                      : '255px',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: getStatusColor(currentZoneStatus),
                    border: '3px solid #ffffff',
                    boxShadow: `0 0 20px ${getStatusColor(currentZoneStatus)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                </div>
                <span
                  style={{
                    background: '#090d16',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    marginTop: '4px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  GPS: {activeCoords.lat.toFixed(4)}, {activeCoords.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Sub-bar Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
              <span>⚡ Ray-Casting Algorithm: Client-Side Offline</span>
              <span>Latency: 0ms</span>
            </div>
          </div>

          {/* Right Column: Interactive Test Controls & Telemetry Audit Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Test Points */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                Test Simulated GPS Coordinates
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Select a coordinate to watch the geofence engine calculate containment in real-time.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {DEMO_PRESETS.map((preset) => {
                  const isSelected = matchedZone.name === preset.name;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectLocation(preset)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--bg-surface-raised)' : 'var(--bg-surface)',
                        border: `1px solid ${isSelected ? getStatusColor(preset.expectedZone) : 'var(--border-subtle)'}`,
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                          {preset.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {preset.desc}
                        </div>
                      </div>

                      <span
                        className={`badge badge-${preset.expectedZone}`}
                        style={{ fontSize: '10px', textTransform: 'uppercase' }}
                      >
                        {preset.expectedZone}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resolved Advisory Card */}
            <div
              className="card"
              style={{
                padding: '18px',
                background:
                  currentZoneStatus === 'danger'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : currentZoneStatus === 'caution'
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${getStatusColor(currentZoneStatus)}66`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getStatusColor(currentZoneStatus), fontWeight: 700, fontSize: '13px' }}>
                {currentZoneStatus === 'danger' ? (
                  <AlertOctagon size={16} />
                ) : currentZoneStatus === 'caution' ? (
                  <AlertTriangle size={16} />
                ) : (
                  <Shield size={16} />
                )}
                <span>Resolved Status: {matchedZone.zoneName}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-main)', marginTop: '6px', lineHeight: 1.5 }}>
                {matchedZone.desc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
