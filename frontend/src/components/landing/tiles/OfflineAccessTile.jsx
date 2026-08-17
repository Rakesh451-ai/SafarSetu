import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  CheckCircle2,
  HardDriveDownload,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function OfflineAccessTile() {
  const [isSimOffline, setIsSimOffline] = useState(false);

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
        borderColor: isSimOffline ? 'var(--status-caution)' : 'var(--border-subtle)',
        transition: 'border-color 0.3s ease',
      }}
      role="region"
      aria-label="Offline Access interactive demo"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isSimOffline ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isSimOffline ? <WifiOff size={18} color="#f59e0b" /> : <Wifi size={18} color="#38bdf8" />}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              6. Offline PWA Access
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Toggle network simulator
            </div>
          </div>
        </div>

        <span className={`badge ${isSimOffline ? 'badge-caution' : 'badge-safe'}`} style={{ fontSize: '10px' }}>
          {isSimOffline ? 'Offline' : 'Online'}
        </span>
      </div>

      {/* Interactive Toggle Body */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: '110px',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        {/* Toggle Switch */}
        <button
          onClick={() => setIsSimOffline(!isSimOffline)}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            background: isSimOffline ? 'rgba(245, 158, 11, 0.2)' : 'rgba(2, 132, 199, 0.2)',
            border: `1px solid ${isSimOffline ? '#f59e0b' : '#38bdf8'}`,
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
          aria-label="Simulate offline mode"
        >
          {isSimOffline ? <WifiOff size={14} color="#f59e0b" /> : <Wifi size={14} color="#38bdf8" />}
          <span>{isSimOffline ? 'Simulating: OFFLINE' : 'Simulating: ONLINE'}</span>
        </button>

        {/* State Display */}
        <div style={{ fontSize: '11px', marginTop: '2px' }}>
          {isSimOffline ? (
            <div style={{ color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              <span>Service Worker Active • Cached & Ready</span>
            </div>
          ) : (
            <div style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={13} />
              <span>Live Cloud Sync Ready</span>
            </div>
          )}
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
          {isSimOffline
            ? 'Geofence runs on device • Pings queued to auto-sync'
            : 'Pre-caches maps, POIs & tourist ID pass on launch'}
        </div>
      </div>

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>Progressive Web App</span>
        <span style={{ color: '#38bdf8' }}>Works in zero-network valleys</span>
      </div>
    </div>
  );
}
