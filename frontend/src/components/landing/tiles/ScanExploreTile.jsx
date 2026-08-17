import React, { useState } from 'react';
import {
  QrCode,
  RotateCw,
  Globe,
  Sparkles,
  MapPin,
  Shield,
  Check,
} from 'lucide-react';

export default function ScanExploreTile({ onOpenApp }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [lang, setLang] = useState('en');

  const content = {
    en: {
      title: 'Amber Fort (Amer)',
      era: 'Built 1592 by Raja Man Singh I',
      desc: 'UNESCO World Heritage site known for Sheesh Mahal (Mirror Palace) and Rajput architecture.',
      btn: 'Flip to QR Pass',
    },
    hi: {
      title: 'आमेर का किला (जयपुर)',
      era: '1592 में राजा मान सिंह प्रथम द्वारा निर्मित',
      desc: 'यूनेस्को विश्व धरोहर स्थल, शीश महल और भव्य राजपूत स्थापत्य कला के लिए प्रसिद्ध।',
      btn: 'क्यूआर पास देखें',
    },
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
        borderColor: isFlipped ? 'var(--safar-primary)' : 'var(--border-subtle)',
        position: 'relative',
      }}
      role="region"
      aria-label="Scan and Explore interactive demo"
    >
      {/* Tile Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(2, 132, 199, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QrCode size={18} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              1. Scan & Explore
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              Tap to test digital pass
            </div>
          </div>
        </div>

        <span className="badge badge-verified" style={{ fontSize: '10px' }}>
          Instant KYC
        </span>
      </div>

      {/* Interactive Body */}
      {!isFlipped ? (
        <div
          onClick={() => setIsFlipped(true)}
          style={{
            background: 'var(--bg-surface-raised)',
            borderRadius: '12px',
            padding: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px dashed rgba(56, 189, 248, 0.4)',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
              marginBottom: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <QrCode size={56} color="#090d16" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <RotateCw size={12} />
            <span>Tap QR to reveal POI Guide</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
            PyJWT SHA-256 Validated Pass
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(2, 132, 199, 0.08)',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              {content[lang].title}
            </span>
            {/* Real Language Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLang(lang === 'en' ? 'hi' : 'en');
              }}
              style={{
                background: 'var(--bg-surface-raised)',
                border: '1px solid var(--border-subtle)',
                color: '#f59e0b',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              aria-label="Toggle language between English and Hindi"
            >
              <Globe size={10} />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--safar-saffron)', fontWeight: 600 }}>
            {content[lang].era}
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-main)', lineHeight: 1.4, margin: '2px 0' }}>
            {content[lang].desc}
          </p>

          <button
            onClick={() => setIsFlipped(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
            }}
          >
            <RotateCw size={10} />
            <span>{content[lang].btn}</span>
          </button>
        </div>
      )}

      {/* Micro-footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', marginTop: '8px' }}>
        <span>Offline verified ticket</span>
        <span style={{ color: '#10b981' }}>✓ 0ms Checkpoint scan</span>
      </div>
    </div>
  );
}
