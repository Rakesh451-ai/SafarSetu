import React from 'react';
import {
  Users,
  ShieldCheck,
  Star,
  MapPin,
  TrendingUp,
  Sparkles,
  Quote,
} from 'lucide-react';

export const STATS_DATA = [
  {
    number: '50,000+',
    label: 'Digital Tourist IDs Issued',
    desc: 'Verified across Amber Fort, Hawa Mahal & Udaipur circuits',
    accent: '#38bdf8',
  },
  {
    number: '3 Circuits',
    label: 'Live Heritage Geofences',
    desc: 'Jaipur Walled City, Amer Fort, Lake Pichola',
    accent: '#f59e0b',
  },
  {
    number: '< 45 Sec',
    label: 'Emergency Response SLA',
    desc: 'Direct WebSocket push to nearest Tourist Police patrol',
    accent: '#10b981',
  },
  {
    number: '100%',
    label: 'Privacy Preserved',
    desc: 'Zero persistent tracking; location revealed solely on distress',
    accent: '#a855f7',
  },
];

export const TESTIMONIALS_DATA = [
  {
    name: 'Sarah Jenkins',
    origin: 'London, United Kingdom',
    avatar: '👩‍🎨',
    role: 'Solo Cultural Traveler',
    text: 'Hiking between Amber Fort and Jaigarh Ridge alone can be daunting with patchy phone reception. Having SafarSetu offline geofence alert me right as I approached the unfenced cliff was life-saving.',
    verifiedBadge: 'Verified QR Pass User',
  },
  {
    name: 'Vikram & Sunita Nair',
    origin: 'Bengaluru, India',
    avatar: '👨‍👩‍👧',
    role: 'Family Vacationers',
    text: 'Pre-paid auto rickshaw fares in Jaipur were always stressful to negotiate. SafarSetu gave us government-approved tariffs and paired us with a certified heritage guide within minutes.',
    verifiedBadge: 'Family Circuit User',
  },
  {
    name: 'Kenji Takahashi',
    origin: 'Kyoto, Japan',
    avatar: '📷',
    role: 'Archaeological Researcher',
    text: 'The multilingual AI assistant explained the astronomical sundials of Jantar Mantar in Japanese with incredible historical accuracy. The signed digital ID made checkpoint entry instantaneous.',
    verifiedBadge: 'International Pass User',
  },
];

export default function TestimonialsStats({ t }) {
  return (
    <section
      id="stats"
      style={{
        padding: '80px 0 100px 0',
        background: 'linear-gradient(180deg, rgba(8,12,20,0.6) 0%, rgba(15,23,42,0.8) 100%)',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '60px',
          }}
        >
          {STATS_DATA.map((stat, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '34px',
                  fontWeight: 800,
                  color: stat.accent,
                  lineHeight: 1.1,
                  marginBottom: '4px',
                }}
              >
                {stat.number}
              </div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--safar-saffron)',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            <Sparkles size={14} />
            {t.stats.tag}
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', color: '#ffffff', marginBottom: '8px' }}>
            {t.stats.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {t.stats.subtitle}
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <Quote size={24} style={{ color: 'rgba(56, 189, 248, 0.3)', marginBottom: '8px' }} />
                <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{item.text}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <div style={{ fontSize: '28px' }}>{item.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {item.origin} • {item.role}
                  </div>
                  <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                    ✓ {item.verifiedBadge}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
