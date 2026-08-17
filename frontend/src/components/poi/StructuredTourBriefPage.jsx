import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckSquare,
  Square,
  Bus,
  Hotel,
  DollarSign,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookmarkPlus,
  Send,
} from 'lucide-react';

export default function StructuredTourBriefPage({
  poiData,
  onBack,
  onAddedToItinerary,
}) {
  const [brief, setBrief] = useState(null);
  const [selectedGems, setSelectedGems] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (poiData?.poi_id) {
      setIsLoading(true);
      fetch('/api/v1/tour-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poi_id: poiData.poi_id }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setBrief(data);
            // Default check first hidden gem
            const initialCheck = {};
            data.suggested_hidden_gems?.forEach((gem, idx) => {
              initialCheck[gem.poi_id || idx] = idx === 0;
            });
            setSelectedGems(initialCheck);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [poiData]);

  const toggleGem = (id) => {
    setSelectedGems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSaveToItinerary = () => {
    setIsSaved(true);
    // Persist saved tour brief in localStorage for Phase 7 Assistant app
    try {
      const existing = JSON.parse(localStorage.getItem('safarsetu_saved_briefs') || '[]');
      existing.push({
        poi_id: brief?.poi_id,
        name: brief?.name,
        selected_gems: Object.keys(selectedGems).filter((k) => selectedGems[k]),
        saved_at: new Date().toISOString(),
      });
      localStorage.setItem('safarsetu_saved_briefs', JSON.stringify(existing));
    } catch (e) {}

    setTimeout(() => {
      if (onAddedToItinerary) onAddedToItinerary();
    }, 1800);
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 20px', textAlign: 'center', color: '#ffffff' }}>
        <Sparkles size={32} className="animate-spin" style={{ color: '#38bdf8', marginBottom: '12px' }} />
        <div style={{ fontSize: '16px', fontWeight: 700 }}>Generating Structured Tour Brief...</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Cross-checking transport tariffs, monument logistics, and nearby hidden gems
        </div>
      </div>
    );
  }

  const currentBrief = brief || {
    name: poiData?.name || 'Amber Fort & Palace',
    category: poiData?.category || 'Heritage Fort',
    region: poiData?.region || 'Amer',
    city: poiData?.city || 'Jaipur',
    overview: {
      entry_fee_info: poiData?.entry_fee_info || '₹100 (Indian) • ₹500 (Foreign)',
      rating: 4.9,
    },
    visit_logistics: {
      best_time_to_visit: 'Oct to Mar, 8:00 AM – 11:30 AM',
      recommended_hours_text: '2h 30m',
    },
    how_to_get_there: [
      {
        mode_display: 'Pre-Paid Taxi',
        from_landmark: 'Jaipur Junction Railway Station',
        estimated_price_range: '₹350 – ₹450',
        estimated_duration: '30-35 mins',
      },
      {
        mode_display: 'Auto-Rickshaw',
        from_landmark: 'Hawa Mahal / Badi Chaupar',
        estimated_price_range: '₹150 – ₹200',
        estimated_duration: '20-25 mins',
      },
    ],
    where_to_stay: [
      {
        name: 'Amer Heritage Haveli & Spa',
        type_display: 'Heritage Hotel',
        price_range: '₹3,200 – ₹6,500 / night',
        distance_from_poi: '450m from gate',
      },
    ],
    price_transparency: {
      entry_ticket: '₹100 (Indian) • ₹500 (Foreign)',
      average_daily_budget: '₹1,200 – ₹3,500 (Moderate)',
    },
    suggested_hidden_gems: [
      {
        poi_id: 'gem-1',
        name: 'Panna Meena Ka Kund (Stepwell)',
        category: 'Ancient Water Architecture',
        distance_text: '1.2 km away',
        description: 'Exquisite symmetrical geometric stepwell with octagonal gazebos.',
        best_time_to_visit: '7:30 AM – 9:30 AM',
        rating: 4.92,
      },
      {
        poi_id: 'gem-2',
        name: 'Jagat Shiromani Temple',
        category: 'Ancient Marble Temple',
        distance_text: '800m away',
        description: 'Rare Meera Bai temple with intricately carved Vishnu torana arch.',
        best_time_to_visit: '4:00 PM – 6:30 PM',
        rating: 4.87,
      },
    ],
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '16px 16px 120px 16px', color: 'var(--text-main)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '8px 14px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Place Detail</span>
        </button>

        <span className="badge badge-safe" style={{ fontSize: '11px' }}>
          ✓ Verified Tour Brief
        </span>
      </div>

      {/* 1. Place Overview Structured Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '20px', background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,13,22,0.95) 100%)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              Structured Tour Brief
            </span>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
              {currentBrief.name}
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              {currentBrief.category} • {currentBrief.region}, {currentBrief.city}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '6px 12px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Duration</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>
                {currentBrief.visit_logistics?.recommended_hours_text || '2.5 Hours'}
              </div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Rating</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>
                ★ {currentBrief.overview?.rating || '4.9'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Timings */}
        <div style={{ marginTop: '16px', padding: '12px 14px', background: 'var(--bg-surface-raised)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
          <Clock size={16} color="#f59e0b" />
          <div>
            <strong>Recommended Window:</strong> {currentBrief.visit_logistics?.best_time_to_visit}
          </div>
        </div>
      </div>

      {/* 2. Transport Breakdown Table */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bus size={16} color="#38bdf8" />
          <span>How to Get There: Transport Options</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentBrief.how_to_get_there?.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--bg-surface-raised)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12px',
              }}
            >
              <div>
                <strong style={{ color: '#ffffff' }}>{item.mode_display}</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>From {item.from_landmark}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, color: 'var(--safar-saffron)' }}>{item.estimated_price_range}</span>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.estimated_duration}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Accommodation & Price Transparency */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        {/* Accommodations */}
        <div className="card" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Hotel size={15} color="#a855f7" />
            <span>Recommended Stay</span>
          </h3>
          {currentBrief.where_to_stay?.slice(0, 2).map((acc, i) => (
            <div key={i} style={{ padding: '8px 10px', background: 'var(--bg-surface-raised)', borderRadius: '8px', marginBottom: '6px', fontSize: '12px' }}>
              <div style={{ fontWeight: 700, color: '#ffffff' }}>{acc.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', color: 'var(--text-dim)', fontSize: '11px' }}>
                <span>{acc.distance_from_poi}</span>
                <strong style={{ color: '#10b981' }}>{acc.price_range}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Budget Summary */}
        <div className="card" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={15} color="#f59e0b" />
            <span>Estimated Visit Budget</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Monument Entry:</span>
              <strong style={{ color: '#ffffff' }}>{currentBrief.price_transparency?.entry_ticket}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Average Daily Spend:</span>
              <strong style={{ color: '#f59e0b' }}>{currentBrief.price_transparency?.average_daily_budget}</strong>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
              ✓ No hidden surcharges; rates governed by Tourism Dept tariffs.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Suggested Hidden-Gem Add-ons with Checkboxes */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.08) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Sparkles size={18} color="#10b981" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Curated Hidden-Gem Add-Ons (Select to include in itinerary)
          </h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Enhance your tour by adding these verified offbeat discoveries nearby.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentBrief.suggested_hidden_gems?.map((gem, idx) => {
            const isChecked = !!selectedGems[gem.poi_id || idx];

            return (
              <div
                key={gem.poi_id || idx}
                onClick={() => toggleGem(gem.poi_id || idx)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${isChecked ? '#10b981' : 'var(--border-subtle)'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ marginTop: '2px', color: isChecked ? '#10b981' : 'var(--text-dim)' }}>
                  {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '13px', color: '#ffffff' }}>
                      {gem.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>
                      📍 {gem.distance_text || 'Nearby'}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    {gem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Sticky Bottom Action Bar */}
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
          padding: '14px 20px',
          boxShadow: '0 -8px 25px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
              Tour Brief Complete
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              {Object.values(selectedGems).filter(Boolean).length} Hidden Gems Added
            </div>
          </div>

          <button
            onClick={handleSaveToItinerary}
            disabled={isSaved}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              borderRadius: 'var(--radius-full)',
              background: isSaved
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              boxShadow: isSaved ? '0 0 20px rgba(16, 185, 129, 0.5)' : '0 0 20px rgba(2, 132, 199, 0.45)',
              fontWeight: 800,
            }}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved to My Itinerary ✓</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={16} />
                <span>Add to My Itinerary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
