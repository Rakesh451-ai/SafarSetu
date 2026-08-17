import React, { useState, useEffect } from 'react';
import {
  Shield,
  QrCode,
  MapPin,
  AlertTriangle,
  Compass,
  Globe,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { LANGUAGES } from '../Navbar';

export default function LandingNavbar({
  lang,
  setLang,
  t,
  onOpenApp,
  onOpenRegistration,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled
          ? 'rgba(8, 12, 20, 0.92)'
          : 'rgba(8, 12, 20, 0.65)',
        backdropFilter: 'blur(16px)',
        borderBottom: isScrolled
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid transparent',
        padding: isScrolled ? '12px 0' : '18px 0',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Badge */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              SafarSetu
              <span
                style={{
                  fontSize: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                }}
              >
                Govt Verified
              </span>
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.3px',
              }}
            >
              National Tourist Safety Platform
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={navLinkStyle}
          >
            {t.nav.howItWorks}
          </button>
          <button
            onClick={() => scrollToSection('live-demo')}
            style={navLinkStyle}
          >
            {t.nav.liveDemo}
          </button>
          <button
            onClick={() => scrollToSection('features')}
            style={navLinkStyle}
          >
            {t.nav.features}
          </button>
          <button
            onClick={() => scrollToSection('sos-reassurance')}
            style={{ ...navLinkStyle, color: '#f87171' }}
          >
            {t.nav.sosShield}
          </button>
        </nav>

        {/* Right CTA & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="form-select"
              aria-label="Select Language"
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                width: 'auto',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(30, 41, 59, 0.8)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Launch PWA App Button */}
          <button
            onClick={onOpenApp}
            className="btn btn-secondary"
            style={{
              display: 'none',
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: 'var(--radius-full)',
            }}
            className="desktop-nav btn btn-secondary"
          >
            <Smartphone size={15} />
            {t.nav.launchApp}
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenRegistration}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
            }}
          >
            <QrCode size={15} />
            <span style={{ fontWeight: 700 }}>{t.nav.getStarted}</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--bg-surface-raised)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            className="mobile-hamburger"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 30px rgba(0,0,0,0.5)',
          }}
        >
          <button
            onClick={() => scrollToSection('how-it-works')}
            style={mobileNavLinkStyle}
          >
            {t.nav.howItWorks}
          </button>
          <button
            onClick={() => scrollToSection('live-demo')}
            style={mobileNavLinkStyle}
          >
            {t.nav.liveDemo}
          </button>
          <button
            onClick={() => scrollToSection('features')}
            style={mobileNavLinkStyle}
          >
            {t.nav.features}
          </button>
          <button
            onClick={() => scrollToSection('sos-reassurance')}
            style={{ ...mobileNavLinkStyle, color: '#ef4444' }}
          >
            {t.nav.sosShield}
          </button>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
            }}
          >
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApp();
              }}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '10px' }}
            >
              <Smartphone size={16} />
              {t.nav.launchApp}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegistration();
              }}
              className="btn btn-primary"
              style={{ flex: 1, padding: '10px' }}
            >
              <QrCode size={16} />
              {t.nav.getStarted}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const navLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
};

const mobileNavLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-main)',
  fontSize: '16px',
  fontWeight: 600,
  textAlign: 'left',
  padding: '6px 0',
  cursor: 'pointer',
};
