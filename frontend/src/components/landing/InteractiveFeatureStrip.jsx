import React, { useRef } from 'react';
import ScanExploreTile from './tiles/ScanExploreTile';
import SafetyMapTile from './tiles/SafetyMapTile';
import AIAssistantTile from './tiles/AIAssistantTile';
import OneTapSOSTile from './tiles/OneTapSOSTile';
import VerifiedGuidesTile from './tiles/VerifiedGuidesTile';
import OfflineAccessTile from './tiles/OfflineAccessTile';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export default function InteractiveFeatureStrip({ onOpenRegistration, onOpenApp }) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="interactive-features"
      style={{
        padding: '24px 0 40px 0',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#38bdf8',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Interactive Feature Strip • Try Live Demo</span>
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', color: '#ffffff', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              One QR. Full Guide. Complete Safety Net.
            </h2>
          </div>

          {/* Mobile Swipe / Desktop Navigation Controls */}
          <div className="mobile-scroll-hint" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Swipe or test tiles ➔
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={scrollLeft} style={stripArrowBtn} aria-label="Scroll features left">
                <ChevronLeft size={14} />
              </button>
              <button onClick={scrollRight} style={stripArrowBtn} aria-label="Scroll features right">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Tiles Container (Scroll-snap on mobile, Grid on desktop) */}
        <div
          ref={scrollContainerRef}
          className="feature-strip-scroll"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          <ScanExploreTile onOpenApp={onOpenApp} />
          <SafetyMapTile />
          <AIAssistantTile />
          <OneTapSOSTile />
          <VerifiedGuidesTile />
          <OfflineAccessTile />
        </div>
      </div>
    </section>
  );
}

const stripArrowBtn = {
  background: 'var(--bg-surface-raised)',
  border: '1px solid var(--border-subtle)',
  color: '#ffffff',
  borderRadius: '6px',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};
