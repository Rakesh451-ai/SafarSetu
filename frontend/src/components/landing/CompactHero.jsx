import React from 'react';
import { QrCode, ArrowRight, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';

export default function CompactHero({ lang, onOpenRegistration, onOpenApp }) {
  const content = {
    en: {
      badge: 'National Tourist Safety Platform',
      title: 'One QR for Seamless Travel & 24/7 Tourist Safety in India',
      subtitle: 'Instant cryptographic Digital Tourist ID, offline multilingual heritage guides, and automated police-connected geofencing.',
      cta: 'Get Your Digital Tourist ID',
      secondaryCta: 'Launch Full App',
      trust: 'Verified by Ministry of Tourism & State Police • 100% Privacy by Design',
    },
    hi: {
      badge: 'राष्ट्रीय पर्यटक सुरक्षा मंच',
      title: 'भारत में सुरक्षित एवं सुगम यात्रा के लिए एक डिजिटल क्यूआर पास',
      subtitle: 'त्वरित डिजिटल पर्यटक आईडी, ऑफलाइन बहुभाषी गाइड, और पर्यटक पुलिस द्वारा समर्थित 24/7 भू-फेंसिंग सुरक्षा।',
      cta: 'अपनी डिजिटल पर्यटक आईडी बनाएं',
      secondaryCta: 'ऐप खोलें',
      trust: 'पर्यटन मंत्रालय एवं राज्य पुलिस द्वारा प्रमाणित • 100% गोपनीयता सुरक्षित',
    },
  };

  const t = content[lang] || content.en;

  return (
    <section
      style={{
        paddingTop: '100px',
        paddingBottom: '20px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
        {/* Subtle Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '14px',
          }}
        >
          <Sparkles size={13} />
          <span>{t.badge}</span>
        </div>

        {/* Compact Headline */}
        <h1
          style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            lineHeight: 1.18,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '12px',
          }}
        >
          {t.title}
        </h1>

        {/* One-Line Subhead */}
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '680px',
            margin: '0 auto 20px auto',
          }}
        >
          {t.subtitle}
        </p>

        {/* Single Primary CTA (+ Optional secondary Launch App) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button
            onClick={onOpenRegistration}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
              fontWeight: 700,
            }}
          >
            <QrCode size={18} />
            <span>{t.cta}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onOpenApp}
            className="btn btn-secondary"
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <Smartphone size={16} />
            <span>{t.secondaryCta}</span>
          </button>
        </div>

        {/* Trust Line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--text-dim)',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={15} color="#10b981" />
          <span>{t.trust}</span>
        </div>
      </div>
    </section>
  );
}
