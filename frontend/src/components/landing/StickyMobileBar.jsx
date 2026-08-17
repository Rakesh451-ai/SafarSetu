import React, { useState, useEffect } from 'react';
import { QrCode, AlertTriangle, ArrowRight } from 'lucide-react';

export default function StickyMobileBar({ onOpenRegistration, onOpenSOS }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once user scrolls down 300px (past hero)
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: 'rgba(9, 13, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '10px 16px',
        boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
      className="mobile-sticky-bar"
    >
      <button
        onClick={onOpenRegistration}
        className="btn btn-primary"
        style={{
          flex: 1,
          padding: '12px 16px',
          fontSize: '14px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
        }}
      >
        <QrCode size={16} />
        <span>Get Digital Tourist ID</span>
      </button>

      <button
        onClick={onOpenSOS}
        className="btn btn-danger"
        style={{
          padding: '12px 14px',
          fontSize: '13px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
        }}
        aria-label="1-Tap Emergency SOS"
      >
        <AlertTriangle size={16} />
        <span>SOS</span>
      </button>
    </div>
  );
}
