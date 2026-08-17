import React, { useState } from 'react';
import {
  QrCode,
  Sparkles,
  MapPin,
  AlertTriangle,
  WifiOff,
  DollarSign,
  UserCheck,
  Building,
  ArrowUpRight,
  Shield,
  Layers,
  Clock,
  Radio,
  CheckCircle,
} from 'lucide-react';

export const CORE_FEATURES = [
  {
    id: 1,
    icon: <QrCode size={22} color="#0284c7" />,
    title: 'Digital Tourist ID & Signed QR',
    shortDesc: 'Tamper-proof PyJWT cryptographic safety pass with HMAC SHA-256 validation for swift checkpoint entry.',
    detail: 'Eliminates fake physical passes. Scannable offline by tourist police and monument gates.',
    tag: 'Identity',
    accentColor: '#0284c7',
  },
  {
    id: 2,
    icon: <Sparkles size={22} color="#f59e0b" />,
    title: 'Multilingual RAG Travel AI',
    shortDesc: 'Instant travel answers in 6 languages, cross-checked against live safety zones and verified monuments.',
    detail: 'Retrieves authentic history and rules in Hindi, English, French, Spanish, German, and Japanese.',
    tag: 'AI Concierge',
    accentColor: '#f59e0b',
  },
  {
    id: 3,
    icon: <MapPin size={22} color="#10b981" />,
    title: 'Live Geofence Safety Radar',
    shortDesc: 'Device-side polygon containment checks alert you before entering hazardous or restricted mountain cliffs.',
    detail: 'Runs client-side point-in-polygon math with 0ms server latency, even without internet access.',
    tag: 'Tracking',
    accentColor: '#10b981',
  },
  {
    id: 4,
    icon: <AlertTriangle size={22} color="#ef4444" />,
    title: '1-Tap Emergency SOS Distress',
    shortDesc: 'Instant broadcast to Tourist Police Command Center and SMS dispatch to pre-configured family contacts.',
    detail: 'Features a 3-second cancel window to avoid false alarms, plus periodic safety check-in tracking.',
    tag: 'Emergency',
    accentColor: '#ef4444',
  },
  {
    id: 5,
    icon: <WifiOff size={22} color="#38bdf8" />,
    title: 'Offline-First PWA Sync Buffer',
    shortDesc: 'Pre-caches heritage guides and buffers location pings locally, automatically syncing upon network recovery.',
    detail: 'Works in zero-connectivity valleys and remote heritage forts via Service Worker architecture.',
    tag: 'Offline PWA',
    accentColor: '#38bdf8',
  },
  {
    id: 6,
    icon: <DollarSign size={22} color="#f59e0b" />,
    title: 'Government Tariff Transparency',
    shortDesc: 'Regulated pre-paid auto-rickshaw fares, official monument composite passes, and certified hotel listings.',
    detail: 'Protects international and domestic travelers from extortionate tout pricing and hidden surcharges.',
    tag: 'Listings',
    accentColor: '#f59e0b',
  },
  {
    id: 7,
    icon: <UserCheck size={22} color="#10b981" />,
    title: 'Verified Guide Marketplace',
    shortDesc: 'Browse and book police-verified local historians with transparent badges, spoken languages, and reviews.',
    detail: 'Only government-authenticated guides can receive booking requests, ensuring authentic heritage storytelling.',
    tag: 'Marketplace',
    accentColor: '#10b981',
  },
  {
    id: 8,
    icon: <Building size={22} color="#a855f7" />,
    title: 'Command Center & Jurisdiction',
    shortDesc: 'Regional responder dashboards with jurisdiction scoping and strict privacy audit logging for location access.',
    detail: 'Ensures tourist coordinates remain private unless an active emergency SOS is initiated.',
    tag: 'Security & Privacy',
    accentColor: '#a855f7',
  },
];

export default function FeatureGrid({ t, onOpenRegistration }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      id="features"
      style={{
        padding: '90px 0',
        background: 'linear-gradient(180deg, rgba(8,12,20,0) 0%, rgba(15,23,42,0.7) 50%, rgba(8,12,20,0) 100%)',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            <Layers size={14} />
            {t.features.tag}
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', color: '#ffffff', marginBottom: '12px' }}>
            {t.features.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {t.features.subtitle}
          </p>
        </div>

        {/* 2-Column Mobile Grid, 4-Column Desktop Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
          }}
          className="feature-2col-grid"
        >
          {CORE_FEATURES.map((feat) => {
            const isHovered = hoveredCard === feat.id;

            return (
              <div
                key={feat.id}
                onMouseEnter={() => setHoveredCard(feat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  background: isHovered
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(15, 23, 42, 0.75)',
                  borderColor: isHovered ? feat.accentColor : 'var(--border-subtle)',
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {/* Header Icon + Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'var(--bg-surface-raised)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {feat.icon}
                  </div>

                  <span
                    style={{
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: 'rgba(255,255,255,0.06)',
                      color: feat.accentColor,
                      fontWeight: 700,
                      border: `1px solid ${feat.accentColor}33`,
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>

                {/* Title & Short Desc */}
                <div>
                  <h3 style={{ fontSize: '15px', color: '#ffffff', marginBottom: '6px', fontWeight: 700 }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {feat.shortDesc}
                  </p>
                </div>

                {/* Expanded Micro-Detail on Hover/Active */}
                <div
                  style={{
                    fontSize: '11px',
                    color: isHovered ? 'var(--text-main)' : 'var(--text-dim)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '8px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {feat.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
