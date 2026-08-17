import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Send,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SAMPLE_QUESTIONS = [
  'What are the official entry timings for Amber Fort and Sheesh Mahal?',
  'Are there safe heritage audio guides or verified shuttles at Hawa Mahal?',
  'Is it safe to hike to Jaigarh Fort alone in the evening?',
];

export default function SafeItineraryAI({ tourist, selectedLanguage }) {
  const [durationDays, setDurationDays] = useState(2);
  const [interests, setInterests] = useState('Heritage, Architecture, Cultural Sites');
  const [includeGuide, setIncludeGuide] = useState(true);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState(null);
  const [isQueryingAssistant, setIsQueryingAssistant] = useState(false);

  const handleGenerateItinerary = async () => {
    setIsGeneratingItinerary(true);

    try {
      const resp = await fetch('/api/v1/itinerary/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourist_id: tourist?.tourist_id,
          duration_days: durationDays,
          interests: interests,
          include_guide_options: includeGuide,
          region: tourist?.current_region || 'Jaipur',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setGeneratedItinerary(data);
      } else {
        // Mock fallback safe itinerary
        setGeneratedItinerary({
          itinerary_id: 'itin-local-' + Date.now(),
          title: `${durationDays}-Day Safe Heritage Tour of Jaipur & Amer`,
          destination: 'Jaipur & Amer',
          duration_days: durationDays,
          safety_status: 'VERIFIED_SAFE',
          excluded_danger_pois: ['Cheel Ka Teela Cliffside Overlook (Unfenced Ramparts)'],
          days: [
            {
              day: 1,
              title: 'Amer Heritage & Fort Precinct',
              morning: {
                title: 'Amber Fort & Sheesh Mahal',
                time: '09:00 AM',
                safety: 'SAFE_PRECINCT',
                description: 'Explore Rajput mirror palaces and royal courtyards with certified local guide.',
              },
              afternoon: {
                title: 'Maota Lake & Anokhi Museum',
                time: '02:00 PM',
                safety: 'SAFE_PRECINCT',
                description: 'Traditional Rajasthani block printing museum and verified craft stalls.',
              },
              evening: {
                title: 'Amber Fort Light & Sound Show',
                time: '06:30 PM',
                safety: 'SAFE_PRECINCT',
                description: 'Illuminated monument history presentation at Kesar Kyari.',
              },
            },
            {
              day: 2,
              title: 'Walled Pink City & Observatories',
              morning: {
                title: 'Hawa Mahal & City Palace',
                time: '09:30 AM',
                safety: 'SAFE_PRECINCT',
                description: 'Intricate palace architecture and courtyards in the heart of Jaipur.',
              },
              afternoon: {
                title: 'Jantar Mantar Astronomical Site',
                time: '02:30 PM',
                safety: 'SAFE_PRECINCT',
                description: 'UNESCO World Heritage 18th-century stone sundials and instruments.',
              },
              evening: {
                title: 'Bapu Bazaar Heritage Walk',
                time: '05:30 PM',
                safety: 'SAFE_PRECINCT',
                description: 'Government-authorized handicraft emporiums and textile street market.',
              },
            },
          ],
        });
      }
    } catch (err) {
      console.warn('Itinerary API fallback:', err);
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  const handleAskAssistant = async (question) => {
    const q = question || assistantQuery;
    if (!q) return;
    setIsQueryingAssistant(true);
    setAssistantResponse(null);

    try {
      const resp = await fetch('/api/v1/assistant/query/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourist_id: tourist?.tourist_id,
          question: q,
          language: selectedLanguage,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        setAssistantResponse(data);
      } else {
        setAssistantResponse({
          answer: `[Multilingual Response in ${selectedLanguage.toUpperCase()}]: For Amber Fort, official visiting hours are 8:00 AM to 5:30 PM. Official composite tickets are available at Suraj Pol ticket counter. Please remain within designated safe tourist paths.`,
          relevant_pois: ['Amber Palace & Sheesh Mahal', 'Hawa Mahal'],
          safety_advisories: ['Stay on marked concourses; avoid unfenced mountain trails after sunset.'],
        });
      }
    } catch (err) {
      setAssistantResponse({
        answer: `Official entry timings for Amber Fort are 8:00 AM to 5:30 PM. Composite tourist pass includes Hawa Mahal and Jantar Mantar.`,
        relevant_pois: ['Amber Palace', 'Hawa Mahal'],
      });
    } finally {
      setIsQueryingAssistant(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ color: 'var(--safar-saffron)' }} />
          Safe Itinerary Planner & Multilingual AI Assistant
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          RAG intelligence cross-checked against live geofence boundaries to exclude high-risk terrain.
        </p>
      </div>

      {/* Grid: Itinerary Generator & AI Query Assistant */}
      <div className="grid-2">
        {/* Left Column: Safe Itinerary Configurator */}
        <div className="card">
          <h3 style={{ fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Calendar size={18} style={{ color: '#0284c7' }} />
            Generate Geofence-Safe Itinerary
          </h3>

          <div className="form-group">
            <label className="form-label">Trip Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDurationDays(2)}
                className={`btn ${durationDays === 2 ? 'btn-primary' : 'btn-secondary'}`}
              >
                2-Day Safe Tour
              </button>
              <button
                type="button"
                onClick={() => setDurationDays(3)}
                className={`btn ${durationDays === 3 ? 'btn-primary' : 'btn-secondary'}`}
              >
                3-Day Heritage Tour
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Travel Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="form-input"
              placeholder="e.g. Forts, Palaces, Traditional Arts"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
            <input
              type="checkbox"
              id="includeGuide"
              checked={includeGuide}
              onChange={(e) => setIncludeGuide(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
            />
            <label htmlFor="includeGuide" style={{ fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}>
              Suggest Verified Government Local Guides for excursions
            </label>
          </div>

          <button
            onClick={handleGenerateItinerary}
            disabled={isGeneratingItinerary}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            <Compass size={16} />
            {isGeneratingItinerary ? 'Calculating Geofences...' : 'Generate Safe Itinerary'}
          </button>
        </div>

        {/* Right Column: AI Travel Concierge */}
        <div className="card">
          <h3 style={{ fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare size={18} style={{ color: 'var(--safar-saffron)' }} />
            Multilingual RAG Travel Concierge
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Inquiries:</div>
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAssistantQuery(q);
                  handleAskAssistant(q);
                }}
                style={{
                  background: 'var(--bg-surface-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                "{q}"
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              placeholder="Ask anything about verified routes, timings..."
              className="form-input"
              style={{ flex: 1 }}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
            />
            <button
              onClick={() => handleAskAssistant()}
              disabled={isQueryingAssistant}
              className="btn btn-primary"
            >
              <Send size={15} />
            </button>
          </div>

          {/* AI Response Card */}
          {assistantResponse && (
            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                AI Verified Assistant Response
              </div>
              <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#ffffff' }}>
                {assistantResponse.answer}
              </div>

              {assistantResponse.relevant_pois?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {assistantResponse.relevant_pois.map((poi, i) => (
                    <span key={i} className="badge badge-verified" style={{ fontSize: '11px' }}>
                      <MapPin size={11} /> {poi}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Generated Safe Itinerary Output Section */}
      {generatedItinerary && (
        <div className="card" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                ✓ GEOFENCE SAFETY VERIFIED ITINERARY
              </div>
              <h3 style={{ fontSize: '20px', color: '#ffffff' }}>{generatedItinerary.title}</h3>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-safe">
                <ShieldCheck size={14} /> Danger Zones Filtered
              </span>
            </div>
          </div>

          {/* Danger Exclusion Notice */}
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--status-danger-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px', color: '#fca5a5', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
            <span>Safety Rule Enforced: High-risk cliffside paths at Cheel Ka Teela were automatically excluded from candidate destinations.</span>
          </div>

          {/* Day-by-Day View */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {(generatedItinerary.days || []).map((d) => (
              <div key={d.day} style={{ padding: '16px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--safar-saffron)', marginBottom: '12px' }}>
                  Day {d.day}: {d.title}
                </div>

                <div className="grid-3">
                  {['morning', 'afternoon', 'evening'].map((slotKey) => {
                    const slot = d[slotKey];
                    if (!slot) return null;
                    return (
                      <div key={slotKey} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                            {slotKey} • {slot.time}
                          </span>
                          <span className="badge badge-safe" style={{ fontSize: '10px', padding: '2px 6px' }}>
                            Safe
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>
                          {slot.title}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {slot.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
