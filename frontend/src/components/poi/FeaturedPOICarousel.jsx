import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const FALLBACK_FEATURED_POIS = [
  {
    poi_id: '45896675-3b7d-42de-9481-4398fc5a4dfc',
    name: 'Amber Fort & Palace (Amer)',
    category: 'UNESCO Hill Fort & Palace',
    region: 'Amer',
    city: 'Jaipur',
    description: 'Majestic 16th-century fortress renowned for Sheesh Mahal mirror mosaics, royal courtyards, and ancient ramparts.',
    short_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-historic-fort-42514-large.mp4',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900&auto=format&fit=crop&q=80',
    ],
    rating: 4.90,
    entry_fee_info: '₹100 (Indian) • ₹500 (Foreign)',
    best_time_to_visit: 'Oct to Mar, 8:00 AM – 11:30 AM',
    avg_visit_duration_minutes: 150,
    entry_gate_qr_id: 'GATE-AMER-FORT-01',
    is_hidden_gem: false,
  },
  {
    poi_id: '89104589-3b7d-42de-9481-4398fc5a4dfd',
    name: 'Hawa Mahal (Palace of Winds)',
    category: 'Pink City Landmark',
    region: 'Jaipur',
    city: 'Jaipur',
    description: 'Five-storey pink sandstone crown palace featuring 953 jharokha windows built in 1799 for royal women.',
    short_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-ancient-indian-building-facade-42515-large.mp4',
    images: [
      'https://images.unsplash.com/photo-1609137144822-4a7b7d0a6c02?w=900&auto=format&fit=crop&q=80',
    ],
    rating: 4.82,
    entry_fee_info: '₹50 (Indian) • ₹200 (Foreign)',
    best_time_to_visit: 'Oct to Mar, 8:30 AM – 10:30 AM',
    avg_visit_duration_minutes: 60,
    entry_gate_qr_id: 'GATE-HAWA-MAHAL-02',
    is_hidden_gem: false,
  },
  {
    poi_id: '72635489-3b7d-42de-9481-4398fc5a4dfe',
    name: 'Jantar Mantar Royal Observatory',
    category: 'UNESCO Scientific Heritage',
    region: 'Jaipur',
    city: 'Jaipur',
    description: 'World’s largest stone sundial and astronomical instruments built in 1734 by astronomer-king Sawai Jai Singh II.',
    short_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-monuments-and-statues-in-a-sunny-park-42516-large.mp4',
    images: [
      'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=900&auto=format&fit=crop&q=80',
    ],
    rating: 4.88,
    entry_fee_info: '₹50 (Indian) • ₹200 (Foreign)',
    best_time_to_visit: '11:30 AM – 1:30 PM (Solar Noon)',
    avg_visit_duration_minutes: 90,
    entry_gate_qr_id: 'GATE-JANTAR-MANTAR-03',
    is_hidden_gem: false,
  },
];

export default function FeaturedPOICarousel({ onSelectPOI }) {
  const [pois, setPois] = useState(FALLBACK_FEATURED_POIS);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const videoRefs = useRef({});

  useEffect(() => {
    // Fetch featured POIs from API
    fetch('/api/v1/poi/featured')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const list = Array.isArray(data) ? data : data.results || [];
          if (list.length > 0) setPois(list);
        }
      })
      .catch(() => {
        // Use fallback if offline
      });
  }, []);

  // IntersectionObserver for lazy-loading and playing background video when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const poiId = entry.target.getAttribute('data-poi-id');
          const video = videoRefs.current[poiId];
          if (entry.isIntersecting) {
            if (video && video.paused) {
              video.play().catch(() => {});
              setActiveVideoId(poiId);
            }
          } else {
            if (video && !video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const cards = document.querySelectorAll('.featured-poi-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [pois]);

  return (
    <div style={{ marginTop: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#f59e0b" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Featured Heritage Destinations
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Tap to view verified guide & plan visit
        </span>
      </div>

      {/* Responsive Grid / Horizontal Carousel */}
      <div
        className="poi-carousel-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {pois.map((poi) => {
          const bgImg = poi.images?.[0] || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=900';

          return (
            <div
              key={poi.poi_id}
              data-poi-id={poi.poi_id}
              onClick={() => onSelectPOI(poi)}
              className="card featured-poi-card"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                minHeight: '260px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#090d16',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
              }}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${poi.name}`}
            >
              {/* Background Video / Image with Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  overflow: 'hidden',
                }}
              >
                {poi.short_video_url ? (
                  <video
                    ref={(el) => (videoRefs.current[poi.poi_id] = el)}
                    src={poi.short_video_url}
                    poster={bgImg}
                    muted
                    loop
                    playsInline
                    preload="none"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.45,
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                ) : (
                  <img
                    src={bgImg}
                    alt={poi.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.4,
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(9,13,22,0.3) 0%, rgba(9,13,22,0.85) 60%, rgba(9,13,22,0.98) 100%)',
                  }}
                />
              </div>

              {/* Top Row: Category Pill & Rating */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(2, 132, 199, 0.35)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    fontWeight: 700,
                  }}
                >
                  {poi.category}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#f59e0b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Star size={12} fill="#f59e0b" />
                  <span>{poi.rating}</span>
                </div>
              </div>

              {/* Bottom Content: Title, Hours, Entry & CTA */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {poi.name}
                </h3>

                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                  {poi.description?.slice(0, 95)}...
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--text-dim)', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} color="#f59e0b" />
                    {poi.avg_visit_duration_minutes} mins visit
                  </span>
                  <span style={{ color: 'var(--safar-saffron)', fontWeight: 700 }}>
                    {poi.entry_fee_info?.split('•')[0] || 'Govt Ticket'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    padding: '6px 10px',
                    background: 'rgba(2, 132, 199, 0.2)',
                    borderRadius: '8px',
                    color: '#38bdf8',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  <span>Explore Place Details</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
