import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Radio,
  Users,
  ShieldCheck,
  PhoneCall,
  Clock,
  CheckCircle,
  Bell,
  HeartHandshake,
  Lock,
} from 'lucide-react';

export default function SOSReassurance({ t, onOpenRegistration }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const dispatchPhases = [
    {
      step: 1,
      title: '1. Instant Minimal Broadcast (< 1 sec)',
      desc: 'Synchronous distress event is logged in encrypted memory, triggering asynchronous Celery fan-out across high-priority queues.',
      statusText: 'Distress Beacon Initialized',
      icon: <Radio size={20} color="#f87171" />,
    },
    {
      step: 2,
      title: '2. Family & Emergency Contacts Notified',
      desc: 'Automated SMS alerts dispatch to pre-configured emergency contacts with live GPS coordinates, battery status, and last known landmark.',
      statusText: 'Family SMS Dispatch Completed',
      icon: <Users size={20} color="#38bdf8" />,
    },
    {
      step: 3,
      title: '3. Tourist Police Command Center Mobilized',
      desc: 'Active incident streams directly into the jurisdiction-scoped police dashboard via real-time WebSockets for fast on-ground dispatch.',
      statusText: 'Nearest Police Patrol Assigned',
      icon: <ShieldCheck size={20} color="#10b981" />,
    },
  ];

  return (
    <section
      id="sos-reassurance"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, #1c1015 0%, #25121b 50%, #0d0e17 100%)',
        borderTop: '1px solid rgba(239, 68, 68, 0.2)',
        borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Big SOS Button UI Preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '30px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '24px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 0 50px rgba(239, 68, 68, 0.2)',
            }}
          >
            <div className="sos-big-btn" style={{ width: '150px', height: '150px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px' }}>SOS</span>
              <span className="sos-subtext">ONE-TAP SAFETY</span>
            </div>

            <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>
              Calm, Reliable Emergency Protection
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '320px', marginTop: '6px' }}>
              Equipped with a 3-second abort window to eliminate accidental triggers.
            </p>

            <div
              style={{
                marginTop: '16px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#fca5a5',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Lock size={12} />
              <span>Location coordinates are disclosed strictly during an active SOS.</span>
            </div>
          </div>

          {/* Right Column: 3-Stage Dispatch Sequence */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#f87171',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                <HeartHandshake size={14} />
                {t.sos.tag}
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: '#ffffff', marginBottom: '10px' }}>
                {t.sos.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                {t.sos.subtitle}
              </p>
            </div>

            {/* 3 Step Sequence Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dispatchPhases.map((phase, idx) => {
                const isActive = activeStep === idx;

                return (
                  <div
                    key={phase.step}
                    onClick={() => setActiveStep(idx)}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      background: isActive ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.65)',
                      border: `1px solid ${isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'translateX(6px)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {phase.icon}
                        <h3 style={{ fontSize: '15px', color: '#ffffff', fontWeight: 700 }}>
                          {phase.title}
                        </h3>
                      </div>

                      {isActive && (
                        <span className="badge badge-safe" style={{ fontSize: '10px', padding: '2px 8px' }}>
                          Live Step
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {phase.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
