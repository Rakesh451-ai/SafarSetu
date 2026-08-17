import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  QrCode,
  Compass,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Lock,
  WifiOff,
  Radio,
} from 'lucide-react';

export default function HowItWorks({ t, onOpenRegistration }) {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  // Intersection observer to track scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-step-index'));
            if (!isNaN(index)) {
              setActiveStep(index);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const stepElements = document.querySelectorAll('.step-card-scroll');
    stepElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stepsData = [
    {
      icon: <UserPlus size={24} color="#0284c7" />,
      tag: 'Step 1 • Registration',
      title: t.howItWorks.steps[0].title,
      desc: t.howItWorks.steps[0].desc,
      badge: '2 Min Quick KYC',
      visual: (
        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
            OFFICIAL TOURIST PROFILE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Name:</span>
              <strong style={{ color: '#ffffff' }}>Maya Lin</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>ID Proof:</span>
              <span style={{ color: '#38bdf8' }}>Passport (Verified)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Emergency Contact:</span>
              <span style={{ color: '#10b981' }}>Auto-Dispatch Ready ✓</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <QrCode size={24} color="#f59e0b" />,
      tag: 'Step 2 • Cryptographic Pass',
      title: t.howItWorks.steps[1].title,
      desc: t.howItWorks.steps[1].desc,
      badge: 'PyJWT Signed Pass',
      visual: (
        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: '#ffffff', padding: '8px', borderRadius: '8px', marginBottom: '8px' }}>
            <QrCode size={70} color="#0f172a" />
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
            ✓ SHA-256 HMAC Hash Validated
          </div>
          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginTop: '2px' }}>
            Token: a9f8e7d6-45bb-4cf1
          </div>
        </div>
      ),
    },
    {
      icon: <Compass size={24} color="#10b981" />,
      tag: 'Step 3 • Offline Exploration',
      title: t.howItWorks.steps[2].title,
      desc: t.howItWorks.steps[2].desc,
      badge: 'Offline Heritage Concierge',
      visual: (
        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>Amber Fort & Sheesh Mahal</span>
            <span className="badge badge-verified" style={{ fontSize: '10px' }}>Govt Tariff</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--safar-saffron)', fontWeight: 700 }}>
            ₹100 (Indian) • ₹500 (Foreign National)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
            Pre-paid electric shuttles available at Suraj Pol gate.
          </div>
        </div>
      ),
    },
    {
      icon: <ShieldAlert size={24} color="#ef4444" />,
      tag: 'Step 4 • Safety Geofencing',
      title: t.howItWorks.steps[3].title,
      desc: t.howItWorks.steps[3].desc,
      badge: 'Zero Latency Radar',
      visual: (
        <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', border: '1px solid var(--status-danger-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 700, fontSize: '12px' }}>
            <ShieldAlert size={16} />
            DANGER ZONE ALERT TRIGGERED
          </div>
          <div style={{ fontSize: '12px', color: '#ffffff', marginTop: '4px', fontWeight: 600 }}>
            Cheel Ka Teela Restricted Cliffside
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Client-side point-in-polygon containment calculated on-device without network latency.
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '80px 0',
        background: 'linear-gradient(180deg, rgba(8,12,20,0) 0%, rgba(15,23,42,0.6) 50%, rgba(8,12,20,0) 100%)',
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
        {/* Section Header */}
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
            <Sparkles size={14} />
            {t.howItWorks.tag}
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', color: '#ffffff', marginBottom: '12px' }}>
            {t.howItWorks.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 4-Step Interactive Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}
        >
          {stepsData.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`card step-card-scroll ${isCurrent ? 'active-step-card' : ''}`}
                data-step-index={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  borderColor: isCurrent ? '#0284c7' : 'var(--border-subtle)',
                  background: isCurrent ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-surface)',
                  transform: isCurrent ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top Number & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '28px',
                      fontWeight: 800,
                      color: isCurrent ? '#38bdf8' : 'var(--text-dim)',
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: isCurrent ? 'rgba(2, 132, 199, 0.2)' : 'var(--bg-surface-raised)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Step Copy */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--safar-saffron)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {step.tag}
                  </div>
                  <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '8px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>

                {/* Interactive Visual Preview */}
                <div style={{ marginTop: 'auto' }}>
                  {step.visual}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={onOpenRegistration}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <span>Start Free Tourist Registration</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
