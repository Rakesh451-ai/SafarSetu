import React, { useState } from 'react';
import {
  UserCheck,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const GUIDES_PREVIEW = [
  {
    id: 1,
    name: 'Rajeshwar S. Shekhawat',
    avatar: '👨‍💼',
    rating: '4.95',
    languages: 'Hindi, English, French',
    specialty: 'Amber Fort & Nahargarh',
    badge: 'Govt Certified',
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    avatar: '👩‍🏫',
    rating: '4.88',
    languages: 'English, Spanish, German',
    specialty: 'Jantar Mantar Astronomy',
    badge: 'Archaeology Expert',
  },
];

export default function VerifiedGuidesTile() {
  const [guideIdx, setGuideIdx] = useState(0);

  const guide = GUIDES_PREVIEW[guideIdx];

  const handleNext = (e) => {
    e.stopPropagation();
    setGuideIdx((prev) => (prev + 1) % GUIDES_PREVIEW.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setGuideIdx((prev) => (prev === 0 ? GUIDES_PREVIEW.length - 1 : prev - 1));
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
        borderColor: 'var(--border-subtle)',
      }}
      role="region"
      aria-label="Verified Guides interactive demo"
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
            <UserCheck size={18} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              5. Verified Guides
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Swipe verified local historians
            </div>
          </div>
        </div>

        <span className="badge badge-safe" style={{ fontSize: '10px' }}>
          Police Verified
        </span>
      </div>

      {/* Guide Card Carousel Preview */}
      <div
        style={{
          background: 'var(--bg-surface-raised)',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          minHeight: '110px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              {guide.avatar}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>
                {guide.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {guide.specialty}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
            <Star size={11} fill="#f59e0b" />
            <span>{guide.rating}</span>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--safar-saffron)', marginTop: '2px' }}>
          🗣️ {guide.languages}
        </div>

        {/* Carousel Switcher Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '4px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {GUIDES_PREVIEW.map((_, i) => (
              <span
                key={i}
                style={{
                  width: guideIdx === i ? '12px' : '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: guideIdx === i ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handlePrev}
              style={carouselBtnStyle}
              aria-label="Previous guide"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={handleNext}
              style={carouselBtnStyle}
              aria-label="Next guide"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
        <span>Direct In-App Booking</span>
        <span style={{ color: '#10b981' }}>0% Commission markups</span>
      </div>
    </div>
  );
}

const carouselBtnStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid var(--border-subtle)',
  color: '#ffffff',
  borderRadius: '4px',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
