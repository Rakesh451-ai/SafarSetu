import React, { useState } from 'react';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import LiveSafetyDemoWidget from './LiveSafetyDemoWidget';
import FeatureGrid from './FeatureGrid';
import SOSReassurance from './SOSReassurance';
import TestimonialsStats from './TestimonialsStats';
import StickyMobileBar from './StickyMobileBar';
import { TRANSLATIONS } from '../../i18n/translations';
import {
  Shield,
  QrCode,
  MapPin,
  HeartHandshake,
  Lock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage({
  lang,
  setLang,
  onLaunchAppTab,
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      {/* 1. Header & Navigation */}
      <LandingNavbar
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenApp={() => onLaunchAppTab('radar')}
        onOpenRegistration={() => onLaunchAppTab('id')}
      />

      {/* 2. Hero Section with Morphing Phone Mockup */}
      <HeroSection
        t={t}
        onOpenRegistration={() => onLaunchAppTab('id')}
        onScrollToDemo={() => scrollToSection('live-demo')}
        onScrollToHowItWorks={() => scrollToSection('how-it-works')}
      />

      {/* 3. 4-Step Interactive Flow */}
      <HowItWorks
        t={t}
        onOpenRegistration={() => onLaunchAppTab('id')}
      />

      {/* 4. Live Safety Geofence Radar Demo Widget */}
      <LiveSafetyDemoWidget
        t={t}
      />

      {/* 5. 8 Core Platform Features Grid */}
      <FeatureGrid
        t={t}
        onOpenRegistration={() => onLaunchAppTab('id')}
      />

      {/* 6. Calm SOS Distress Reassurance Section */}
      <SOSReassurance
        t={t}
        onOpenRegistration={() => onLaunchAppTab('sos')}
      />

      {/* 7. Testimonials & Platform Telemetry Stats */}
      <TestimonialsStats
        t={t}
      />

      {/* 8. Persistent Sticky Bottom Mobile Bar */}
      <StickyMobileBar
        onOpenRegistration={() => onLaunchAppTab('id')}
        onOpenSOS={() => onLaunchAppTab('sos')}
      />

      {/* 9. Landing Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: '#060910',
          padding: '60px 20px 100px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f59e0b, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>SafarSetu</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              National Smart Tourism & Safety Infrastructure platform. Protecting travelers with offline cryptographic IDs and geofencing.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
              Platform Modules
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <li>
                <button onClick={() => onLaunchAppTab('id')} style={footerLinkBtn}>
                  Digital Tourist ID & QR Pass
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchAppTab('radar')} style={footerLinkBtn}>
                  Safety Radar & Offline Geofencing
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchAppTab('sos')} style={footerLinkBtn}>
                  1-Tap Emergency SOS & Check-in
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchAppTab('itinerary')} style={footerLinkBtn}>
                  Multilingual AI Travel Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchAppTab('guides')} style={footerLinkBtn}>
                  Verified Guide Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onLaunchAppTab('listings')} style={footerLinkBtn}>
                  Regulated Tariffs & Verified Stays
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
              Safety & Government Hotlines
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <li>Rajasthan Tourist Police: <strong>1363</strong> (Toll-Free)</li>
              <li>National Emergency Response: <strong>112</strong></li>
              <li>Jaipur Police Control: <strong>+91-141-260-1200</strong></li>
              <li>Ministry of Tourism Portal: <a href="https://tourism.gov.in" target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>tourism.gov.in</a></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1240px',
            margin: '40px auto 0 auto',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            © 2026 SafarSetu • Ministry of Tourism & State Police Departments
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy by Design</span>
            <span>PyJWT Signed Cryptography</span>
            <span>GeoDjango PostGIS Geofencing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const footerLinkBtn = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '13px',
  textAlign: 'left',
  cursor: 'pointer',
  padding: 0,
};
