import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  Compass,
  Bus,
  Car,
  Navigation,
  Hotel,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';

export default function PlaceDetailPage({
  poiData,
  onBack,
  onPlanVisit,
}) {
  const [poiDetail, setPoiDetail] = useState(poiData);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If we only have basic POI info, fetch full detail bundle from API
    if (poiData?.poi_id) {
      setIsLoading(true);
      fetch(`/api/v1/poi/${poiData.poi_id}/`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setPoiDetail((prev) => ({ ...prev, ...data }));
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [poiData]);

  if (!poiDetail) return null;

  const images = poiDetail.images || [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80',
  ];

  const transports = poiDetail.transport_options || [
    {
      transport_id: 't1',
      mode: 'taxi',
      mode_display: 'Pre-Paid Taxi',
      from_landmark: 'Jaipur Junction Railway Station (12 km)',
      estimated_price_range: '₹350 – ₹450',
      estimated_duration: '30 mins',
      verified: true,
    },
    {
      transport_id: 't2',
      mode: 'auto',
      mode_display: 'Auto-Rickshaw',
      from_landmark: 'Hawa Mahal / Badi Chaupar (9.5 km)',
      estimated_price_range: '₹150 – ₹200',
      estimated_duration: '20 mins',
      verified: true,
    },
  ];

  const accommodations = poiDetail.accommodation_options || [
    {
      accommodation_id: 'a1',
      name: 'Amer Heritage Haveli Stay',
      type_display: 'Heritage Hotel',
      price_range: '₹3,200 – ₹5,500 / night',
      distance_from_poi: '450m from gate',
      rating: 4.85,
      verified: true,
    },
    {
      accommodation_id: 'a2',
      name: 'The Hosteller Amer',
      type_display: 'Backpacker Hostel',
      price_range: '₹650 – ₹1,800 / night',
      distance_from_poi: '800m from Maota Lake',
      rating: 4.65,
      verified: true,
    },
  ];

  const sampleHiddenGems = [
    {
      name: 'Panna Meena Ka Kund (Historic Stepwell)',
      category: '16th Century Water Architecture',
      distance: '1.2 km away (Amer Village)',
      desc: 'Exquisite symmetrical criss-cross stepwell built in 1590, free from tourist crowds.',
      entry: 'Free Entry (ASI Protected)',
      rating: 4.92,
    },
    {
      name: 'Jagat Shiromani Temple',
      category: 'Ancient Marble & Sandstone Temple',
      distance: '800m from Chand Pol Gate',
      desc: 'Intricately carved 16th-century Vishnu & Meera Bai temple with stunning torana stone arch.',
      entry: 'Free Entry',
      rating: 4.87,
    },
  ];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 16px 100px 16px', color: 'var(--text-main)' }}>
      {/* Top Header Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Destinations</span>
        </button>

        <span className="badge badge-verified" style={{ fontSize: '11px' }}>
          Gate QR: {poiDetail.entry_gate_qr_id || 'GATE-AMER-01'}
        </span>
      </div>

      {/* 1. Image / Video Gallery (Swipeable on Mobile) */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', background: '#090d16', border: '1px solid var(--border-subtle)' }}>
        <div style={{ position: 'relative', height: '280px' }}>
          <img
            src={images[selectedImageIdx] || images[0]}
            alt={poiDetail.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* Floating Category & Rating */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
            <span style={{ background: 'rgba(2, 132, 199, 0.85)', color: '#ffffff', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
              {poiDetail.category}
            </span>
          </div>

          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.75)', color: '#f59e0b', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={13} fill="#f59e0b" />
            <span>{poiDetail.rating}</span>
          </div>

          {/* Place Title Overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', color: '#ffffff', fontWeight: 800, margin: 0 }}>
              {poiDetail.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '12px', color: '#e2e8f0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#38bdf8" /> {poiDetail.region}, {poiDetail.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} color="#f59e0b" /> {poiDetail.avg_visit_duration_minutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', background: 'var(--bg-surface-raised)', overflowX: 'auto' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIdx(i)}
                style={{
                  width: '54px',
                  height: '40px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: `2px solid ${selectedImageIdx === i ? '#38bdf8' : 'transparent'}`,
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Overview & Verified History */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span>Verified History & Archaeological Background</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '14px' }}>
          {poiDetail.history || poiDetail.description}
        </p>

        {/* Logistics Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: 'var(--bg-surface-raised)', padding: '12px', borderRadius: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Entry Ticket
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--safar-saffron)', marginTop: '2px' }}>
              {poiDetail.entry_fee_info}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Best Time to Visit
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {poiDetail.best_time_to_visit}
            </div>
          </div>
        </div>

        {/* Facilities Chips */}
        {poiDetail.facilities?.length > 0 && (
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Tourist Amenities on Site
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {poiDetail.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#e2e8f0',
                  }}
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. How to Get There (Transport Options) */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bus size={18} color="#38bdf8" />
          <span>How to Get There (Regulated Tariffs)</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {transports.map((opt, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'var(--bg-surface-raised)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                    {opt.mode_display || opt.mode.toUpperCase()}
                  </span>
                  <span className="badge badge-safe" style={{ fontSize: '9px' }}>
                    Govt Verified
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  From {opt.from_landmark}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--safar-saffron)' }}>
                  {opt.estimated_price_range}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
                  ⏱️ {opt.estimated_duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Where to Stay (Accommodations) */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Hotel size={18} color="#a855f7" />
          <span>Where to Stay (Verified Accommodations)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {accommodations.map((acc, i) => (
            <div
              key={i}
              style={{
                padding: '14px',
                background: 'var(--bg-surface-raised)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff' }}>
                    {acc.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 600 }}>
                    {acc.type_display || acc.type}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
                  <Star size={11} fill="#f59e0b" />
                  <span>{acc.rating || '4.8'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  📍 {acc.distance_from_poi}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>
                  {acc.price_range}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Distinct Section: Off the Beaten Path (Hidden Gems Nearby) */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(2, 132, 199, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '30px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#10b981" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Off the Beaten Path: Hidden Gems Nearby
          </h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Curated archaeological sites and serene spots within 2 km of {poiDetail.name} that most tourist buses miss.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {sampleHiddenGems.map((gem, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px',
                background: 'rgba(9, 13, 22, 0.85)',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#10b981' }}>
                    {gem.name}
                  </div>
                  <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>
                    ★ {gem.rating}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {gem.category} • {gem.distance}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-main)', marginTop: '6px', lineHeight: 1.4 }}>
                  {gem.desc}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--safar-saffron)', fontWeight: 700 }}>{gem.entry}</span>
                <span style={{ color: '#38bdf8' }}>Included in tour brief ➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Sticky Plan This Visit CTA Bar */}
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
          padding: '12px 20px',
          boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Ready to explore {poiDetail.name}?
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
              Structured Tour Brief & Safety Logistics
            </div>
          </div>

          <button
            onClick={() => onPlanVisit(poiDetail)}
            className="btn btn-primary"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.45)',
              fontWeight: 800,
            }}
          >
            <span>Plan This Visit</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
