import React from 'react';
import { ShieldCheck, MapPin, Users, Lock } from 'lucide-react';

export default function TrustStatsStrip() {
  return (
    <section
      style={{
        padding: '24px 0 60px 0',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        <div
          className="card"
          style={{
            padding: '20px 24px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Stat 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={20} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                50,000+
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Tourists Protected
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={20} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                3 Heritage Circuits
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Jaipur, Amer & Udaipur
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                &lt; 45 Seconds
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Police SOS Dispatch SLA
              </div>
            </div>
          </div>

          {/* Stat 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock size={20} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                100% Private
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Zero continuous tracking
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance One-Liner */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-dim)' }}>
          Standardized smart tourism infrastructure developed in coordination with the Ministry of Tourism & State Police.
        </div>
      </div>
    </section>
  );
}
