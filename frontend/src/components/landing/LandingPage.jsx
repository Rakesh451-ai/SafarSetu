import React from 'react';
import LandingNavbar from './LandingNavbar';
import CompactHero from './CompactHero';
import InteractiveFeatureStrip from './InteractiveFeatureStrip';
import FeaturedPOICarousel from '../poi/FeaturedPOICarousel';
import TrustStatsStrip from './TrustStatsStrip';
import StickyMobileBar from './StickyMobileBar';
import { TRANSLATIONS } from '../../i18n/translations';
import { Shield } from 'lucide-react';

export default function LandingPage({
  lang,
  setLang,
  onLaunchAppTab,
  onSelectPOI,
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* 1. Header Navigation */}
      <LandingNavbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenApp={() => onLaunchAppTab('radar')}
        onOpenRegistration={() => onLaunchAppTab('id')}
      />

      {/* 2. Compact Hero */}
      <CompactHero
        lang={lang}
        onOpenRegistration={() => onLaunchAppTab('id')}
        onOpenApp={() => onLaunchAppTab('radar')}
      />

      {/* 3. Main Focus: Top Interactive Feature Strip */}
      <InteractiveFeatureStrip
        onOpenRegistration={() => onLaunchAppTab('id')}
        onOpenApp={onLaunchAppTab}
      />

      {/* 4. Featured Heritage Destinations Carousel (Lazy-Loaded Background Videos) */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        <FeaturedPOICarousel
          onSelectPOI={onSelectPOI || ((poi) => onLaunchAppTab('place-detail', poi))}
        />
      </div>

      {/* 5. Short Trust / Safety Line with Stat Placeholders */}
      <TrustStatsStrip />

      {/* 6. Sticky Bottom CTA Bar on Mobile */}
      <StickyMobileBar
        onOpenRegistration={() => onLaunchAppTab('id')}
        onOpenSOS={() => onLaunchAppTab('sos')}
      />

      {/* 7. Minimal Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: '#060910',
          padding: '24px 20px 80px 20px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-dim)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f59e0b, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={14} color="#ffffff" />
          </div>
          <strong style={{ color: '#ffffff' }}>SafarSetu</strong>
          <span>• National Smart Tourism Safety Platform</span>
        </div>
        <div>
          © 2026 Ministry of Tourism & State Police Departments • 100% Privacy by Design
        </div>
      </footer>
    </div>
  );
}
