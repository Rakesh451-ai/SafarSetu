import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  Users,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

export default function OneTapSOSTile() {
  const [sosState, setSosState] = useState('idle'); // 'idle' | 'sent' | 'family' | 'police'

  const handleTestSOS = () => {
    if (sosState !== 'idle') {
      setSosState('idle');
      return;
    }

    setSosState('sent');
    setTimeout(() => {
      setSosState('family');
      setTimeout(() => {
        setSosState('police');
      }, 900);
    }, 800);
  };

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
        borderColor: sosState !== 'idle' ? '#ef4444' : 'var(--border-subtle)',
        transition: 'border-color 0.3s ease',
      }}
      role="region"
      aria-label="One-Tap SOS interactive demo"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              4. One-Tap SOS
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Tap button to test dispatch
            </div>
          </div>
        </div>

        <span className="badge badge-danger" style={{ fontSize: '10px' }}>
          Simulation
        </span>
      </div>

      {/* Interactive Body */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          borderRadius: '10px',
          padding: '10px',
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
        {sosState === 'idle' ? (
          <button
            onClick={handleTestSOS}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease',
            }}
            aria-label="Test Simulated SOS Button"
          >
            <span>SOS</span>
            <span style={{ fontSize: '7px', opacity: 0.8 }}>TAP TO TEST</span>
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            {/* Step 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Radio size={10} /> 1. Alert Beacon Sent
              </span>
              <span>✓ &lt; 1s</span>
            </div>

            {/* Step 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: sosState === 'family' || sosState === 'police' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                color: sosState === 'family' || sosState === 'police' ? '#38bdf8' : 'var(--text-dim)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={10} /> 2. Family SMS Dispatched
              </span>
              <span>{sosState === 'family' || sosState === 'police' ? '✓ Sent' : '...'}</span>
            </div>

            {/* Step 3 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                background: sosState === 'police' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                color: sosState === 'police' ? '#10b981' : 'var(--text-dim)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={10} /> 3. Tourist Police Notified
              </span>
              <span>{sosState === 'police' ? '✓ Mobilized' : '...'}</span>
            </div>
          </div>
        )}

        {sosState !== 'idle' && (
          <button
            onClick={handleTestSOS}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <RotateCcw size={9} />
            <span>Reset Demo</span>
          </button>
        )}
      </div>

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>3-Second Cancel Window</span>
        <span style={{ color: '#ef4444' }}>Celery High-Priority Queue</span>
      </div>
    </div>
  );
}
