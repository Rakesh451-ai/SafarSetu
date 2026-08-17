import React, { useState } from 'react';
import {
  MapPin,
  Shield,
  AlertTriangle,
  AlertOctagon,
  Radio,
} from 'lucide-react';

export default function SafetyMapTile() {
  const [activeZone, setActiveZone] = useState('safe'); // 'safe' | 'caution' | 'danger'

  const zones = {
    safe: {
      label: 'Safe Precinct',
      name: 'Amber Fort Courtyard',
      color: '#10b981',
      badgeClass: 'badge-safe',
      icon: <Shield size={12} />,
      pinPos: { x: '25%', y: '40%' },
    },
    caution: {
      label: 'Caution Trail',
      name: 'Jaigarh Ridge Trail',
      color: '#f59e0b',
      badgeClass: 'badge-caution',
      icon: <AlertTriangle size={12} />,
      pinPos: { x: '55%', y: '65%' },
    },
    danger: {
      label: 'Danger Cliff',
      name: 'Cheel Cliff (Restricted)',
      color: '#ef4444',
      badgeClass: 'badge-danger',
      icon: <AlertOctagon size={12} />,
      pinPos: { x: '80%', y: '25%' },
    },
  };

  const current = zones[activeZone];

  return (
    <div
      className="card interactive-tile"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        background: 'var(--bg-surface)',
        borderColor: `${current.color}55`,
        transition: 'border-color 0.3s ease',
      }}
      role="region"
      aria-label="Live Safety Map interactive demo"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio size={18} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              2. Live Safety Radar
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Click zones to test pin
            </div>
          </div>
        </div>

        <span className={`badge ${current.badgeClass}`} style={{ fontSize: '10px' }}>
          {current.label}
        </span>
      </div>

      {/* Mini Interactive Radar Canvas */}
      <div
        style={{
          position: 'relative',
          height: '110px',
          background: 'radial-gradient(circle at 50% 50%, #151f33 0%, #070a12 100%)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="radar-grid" style={{ backgroundSize: '16px 16px' }} />

        {/* 3 Clickable Geofence Zones */}
        <button
          onClick={() => setActiveZone('safe')}
          style={{
            position: 'absolute',
            left: '8px',
            top: '20px',
            width: '60px',
            height: '45px',
            background: 'rgba(16, 185, 129, 0.25)',
            border: `1px solid ${activeZone === 'safe' ? '#10b981' : '#10b98166'}`,
            borderRadius: '6px',
            fontSize: '8px',
            color: '#10b981',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Select Safe Zone"
        >
          Safe
        </button>

        <button
          onClick={() => setActiveZone('caution')}
          style={{
            position: 'absolute',
            left: '80px',
            bottom: '10px',
            width: '60px',
            height: '45px',
            background: 'rgba(245, 158, 11, 0.25)',
            border: `1px dashed ${activeZone === 'caution' ? '#f59e0b' : '#f59e0b66'}`,
            borderRadius: '6px',
            fontSize: '8px',
            color: '#f59e0b',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Select Caution Zone"
        >
          Caution
        </button>

        <button
          onClick={() => setActiveZone('danger')}
          style={{
            position: 'absolute',
            right: '8px',
            top: '15px',
            width: '60px',
            height: '45px',
            background: 'rgba(239, 68, 68, 0.25)',
            border: `1px solid ${activeZone === 'danger' ? '#ef4444' : '#ef444466'}`,
            borderRadius: '6px',
            fontSize: '8px',
            color: '#ef4444',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Select Danger Zone"
        >
          Danger
        </button>

        {/* Animated Moving Draggable Pin */}
        <div
          style={{
            position: 'absolute',
            top: current.pinPos.y,
            left: current.pinPos.x,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: current.color,
              border: '2px solid #ffffff',
              boxShadow: `0 0 12px ${current.color}`,
            }}
          />
        </div>
      </div>

      {/* Zone Status Detail */}
      <div
        style={{
          marginTop: '6px',
          padding: '6px 10px',
          borderRadius: '8px',
          background: `${current.color}18`,
          border: `1px solid ${current.color}44`,
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ color: current.color, fontWeight: 700 }}>
          {current.name}
        </span>
        <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
          0ms offline check
        </span>
      </div>

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>GeoDjango boundary</span>
        <span style={{ color: current.color }}>Instant containment alert</span>
      </div>
    </div>
  );
}
