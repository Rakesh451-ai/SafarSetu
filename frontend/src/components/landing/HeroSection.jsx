import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Shield,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Radio,
  CheckCircle,
  Play,
  Lock,
  Layers,
  Smartphone,
  Navigation,
} from 'lucide-react';

export default function HeroSection({
  t,
  onOpenRegistration,
  onScrollToDemo,
  onScrollToHowItWorks,
}) {
  const [mockupState, setMockupState] = useState('qr'); // 'qr' -> 'scanning' -> 'map' -> 'guide'

  // Automatic cycling animation of the phone mockup
  useEffect(() => {
    const cycle = ['qr', 'scanning', 'map', 'guide'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % cycle.length;
      setMockupState(cycle[idx]);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        paddingTop: '130px',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Copy, Trust Badge & CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* National Initiative Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#f59e0b',
                fontSize: '13px',
                fontWeight: 700,
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={14} />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 54px)',
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
              }}
            >
              {t.hero.title}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                {t.hero.titleAccent}
              </span>
            </h1>

            {/* Subhead */}
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--text-muted)',
                maxWidth: '540px',
              }}
            >
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
                marginTop: '10px',
              }}
            >
              <button
                onClick={onOpenRegistration}
                className="btn btn-primary"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  boxShadow: '0 4px 25px rgba(2, 132, 199, 0.45)',
                }}
              >
                <QrCode size={18} />
                <span>{t.hero.primaryCta}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onScrollToDemo}
                className="btn btn-secondary"
                style={{
                  padding: '14px 24px',
                  fontSize: '15px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Radio size={17} style={{ color: 'var(--safar-saffron)' }} />
                <span>{t.hero.secondaryCta}</span>
              </button>
            </div>

            {/* Trust Signals Footer */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} color="#10b981" />
                <span>{t.hero.trustLine}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🔒 <strong>Zero Tracking</strong> when safe
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📶 <strong>100% Offline</strong> PWA Geofence
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ⚡ <strong>1-Tap SOS</strong> to Police
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Morphing Interactive Phone Mockup */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Morphing Phone Container */}
            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                background: '#090d16',
                borderRadius: '36px',
                border: '4px solid #1e293b',
                padding: '12px',
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(2, 132, 199, 0.25)',
                position: 'relative',
              }}
            >
              {/* Phone Speaker Notch */}
              <div
                style={{
                  width: '90px',
                  height: '18px',
                  background: '#1e293b',
                  borderRadius: '0 0 12px 12px',
                  margin: '0 auto 10px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '4px',
                    borderRadius: '2px',
                    background: '#334155',
                  }}
                />
              </div>

              {/* Screen Display Area */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '26px',
                  minHeight: '430px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* State 1: QR Code Digital ID View */}
                {mockupState === 'qr' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'center',
                      animation: 'fadeIn 0.5s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#38bdf8',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      Govt Signed Pass
                    </div>

                    <div
                      style={{
                        background: '#ffffff',
                        padding: '12px',
                        borderRadius: '16px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                        position: 'relative',
                      }}
                    >
                      <QrCode size={130} color="#0f172a" />
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: '#0284c7',
                          borderRadius: '6px',
                          padding: '3px',
                          color: '#ffffff',
                        }}
                      >
                        <Shield size={16} />
                      </div>
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>
                        Maya Lin (Singapore)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                        ID: SGP123456 • Amber Fort Circuit
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid var(--status-safe-border)',
                        color: 'var(--status-safe)',
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontWeight: 700,
                      }}
                    >
                      ✓ PyJWT SHA-256 Validated
                    </div>
                  </div>
                )}

                {/* State 2: Scanning & Checkpoint Simulation */}
                {mockupState === 'scanning' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '350px',
                      gap: '16px',
                      textAlign: 'center',
                      animation: 'fadeIn 0.5s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '2px dashed #38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'spin 8s linear infinite',
                      }}
                    >
                      <ShieldCheck size={40} color="#38bdf8" />
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#ffffff' }}>
                        Checkpoint Verification
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Suraj Pol Entrance • Amber Fort
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(2, 132, 199, 0.15)',
                        color: '#38bdf8',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      Signature Verified 100%
                    </div>
                  </div>
                )}

                {/* State 3: Live Radar Map & Geofence View */}
                {mockupState === 'map' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      animation: 'fadeIn 0.5s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--status-safe)',
                        }}
                      >
                        ● Safe Heritage Precinct
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'var(--text-dim)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        26.9855° N
                      </span>
                    </div>

                    {/* Mini Radar Map Canvas */}
                    <div
                      style={{
                        height: '190px',
                        background: 'radial-gradient(circle, #172554 0%, #090d16 100%)',
                        borderRadius: '14px',
                        border: '1px solid var(--border-subtle)',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div className="radar-grid" />
                      <div
                        style={{
                          position: 'absolute',
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          border: '1px dashed rgba(56, 189, 248, 0.3)',
                        }}
                      />

                      {/* Amber Fort Polygon */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          background: 'rgba(16, 185, 129, 0.25)',
                          border: '1px solid #10b981',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '9px',
                          color: '#10b981',
                          fontWeight: 700,
                        }}
                      >
                        Amber Fort (Safe)
                      </div>

                      {/* Danger Polygon */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '20px',
                          left: '20px',
                          background: 'rgba(239, 68, 68, 0.25)',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '9px',
                          color: '#ef4444',
                          fontWeight: 700,
                        }}
                      >
                        Cliffside (Danger)
                      </div>

                      {/* User Location Pulse */}
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#10b981',
                          border: '2px solid #ffffff',
                          boxShadow: '0 0 15px #10b981',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: '8px',
                        background: 'var(--bg-surface-raised)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      🛡️ <strong>Safety Shield:</strong> 3 geofence zones monitored on device.
                    </div>
                  </div>
                )}

                {/* State 4: Verified Guide & AI Concierge View */}
                {mockupState === 'guide' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      animation: 'fadeIn 0.5s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--safar-saffron)',
                      }}
                    >
                      ★ Verified Heritage Concierge
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        background: 'var(--bg-surface-raised)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
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
                        👨‍💼
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '12px', color: '#ffffff' }}>
                          Rajeshwar S. Shekhawat
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                          State Certified • Hindi / English / French
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '10px',
                        background: 'rgba(2, 132, 199, 0.1)',
                        borderRadius: '10px',
                        fontSize: '11px',
                        color: '#38bdf8',
                        lineHeight: 1.4,
                      }}
                    >
                      "Sheesh Mahal opens at 8:00 AM. Pre-paid electric shuttles available at Suraj Pol."
                    </div>

                    <button
                      onClick={onOpenRegistration}
                      className="btn btn-primary"
                      style={{ padding: '8px', fontSize: '12px', width: '100%' }}
                    >
                      Explore Full PWA Guide
                    </button>
                  </div>
                )}

                {/* State Switcher Indicator Dots */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '10px',
                  }}
                >
                  {['qr', 'scanning', 'map', 'guide'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setMockupState(st)}
                      aria-label={`View ${st} simulation`}
                      style={{
                        width: mockupState === st ? '18px' : '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background:
                          mockupState === st ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-label */}
            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-dim)',
                marginTop: '12px',
                textAlign: 'center',
              }}
            >
              Interactive Preview: QR Pass ➔ Checkpoint ➔ Geofence ➔ Verified Guide
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
