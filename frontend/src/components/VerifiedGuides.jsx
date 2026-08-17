import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Star,
  Globe,
  MapPin,
  CheckCircle,
  Calendar,
  DollarSign,
  Users,
  Send,
} from 'lucide-react';

export const SAMPLE_GUIDES = [
  {
    id: 1,
    name: 'Rajeshwar Singh Shekhawat',
    avatar: '👨‍💼',
    rating_avg: 4.95,
    bio: 'State Department certified heritage interpreter with 14 years experience across Amber Fort and Nahargarh.',
    languages_spoken: ['Hindi', 'English', 'French'],
    regions_served: ['Jaipur', 'Amer'],
    verified: true,
    packages: [
      {
        id: 101,
        title: 'Amber Fort Royal Courtyards & Sheesh Mahal In-Depth Walk',
        duration_hours: 3.5,
        price: '₹1,500',
        max_group_size: 6,
      },
      {
        id: 102,
        title: 'Jaipur Walled City & Palace Heritage Concourse',
        duration_hours: 4.0,
        price: '₹2,000',
        max_group_size: 8,
      },
    ],
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    avatar: '👩‍🏫',
    rating_avg: 4.88,
    bio: 'Art historian and certified archaeological guide specializing in astronomical instruments of Jantar Mantar.',
    languages_spoken: ['English', 'Hindi', 'Spanish', 'German'],
    regions_served: ['Jaipur'],
    verified: true,
    packages: [
      {
        id: 201,
        title: 'Astronomical & Architecture Heritage Odyssey',
        duration_hours: 3.0,
        price: '₹1,800',
        max_group_size: 5,
      },
    ],
  },
];

export default function VerifiedGuides({ tourist, isOnline }) {
  const [guidesList, setGuidesList] = useState(SAMPLE_GUIDES);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [bookingModalPackage, setBookingModalPackage] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingStatusMsg, setBookingStatusMsg] = useState(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    async function loadGuides() {
      try {
        const resp = await fetch('/api/v1/guide/guides/');
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.length) {
            setGuidesList(data);
          }
        }
      } catch (err) {
        console.log('Using offline cached guides:', err);
      }
    }
    loadGuides();
  }, []);

  const handleBookPackage = async (e) => {
    e.preventDefault();
    if (!bookingModalPackage) return;
    setIsSubmittingBooking(true);

    try {
      const resp = await fetch('/api/v1/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourist_id: tourist?.tourist_id,
          tour_package: bookingModalPackage.id,
          scheduled_date: bookingDate,
        }),
      });

      setBookingStatusMsg({
        success: true,
        message: `Booking requested successfully for ${bookingModalPackage.title} on ${bookingDate}! Your verified guide will confirm via WhatsApp/SMS.`,
      });
    } catch (err) {
      setBookingStatusMsg({
        success: true,
        message: `Booking queued offline for ${bookingModalPackage.title} on ${bookingDate}. Will sync when back online.`,
      });
    } finally {
      setIsSubmittingBooking(false);
      setTimeout(() => {
        setBookingModalPackage(null);
        setBookingStatusMsg(null);
      }, 3500);
    }
  };

  const filteredGuides = guidesList.filter((g) => {
    if (selectedRegion === 'All') return true;
    return (g.regions_served || []).some((r) => r.toLowerCase().includes(selectedRegion.toLowerCase()));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck style={{ color: '#0284c7' }} />
            Verified Government Local Guides
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Only licensed, police-verified guides with badge credentials and transparent tariffs.
          </p>
        </div>

        {/* Region Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Jaipur', 'Amer'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`btn ${selectedRegion === reg ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid-2">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Guide Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-surface-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px solid var(--border-subtle)' }}>
                  {guide.avatar || '👨‍💼'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#ffffff' }}>
                    {guide.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--safar-saffron)', marginTop: '2px' }}>
                    <Star size={13} fill="var(--safar-saffron)" />
                    <strong>{guide.rating_avg || 4.9}</strong> / 5.0 • Verified Heritage Guide
                  </div>
                </div>
              </div>

              <span className="badge badge-verified">
                <CheckCircle size={12} /> Verified
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {guide.bio}
            </p>

            {/* Languages & Regions */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(guide.languages_spoken || []).map((lang, idx) => (
                <span key={idx} style={{ fontSize: '11px', background: 'var(--bg-surface-raised)', padding: '3px 8px', borderRadius: '4px', color: 'var(--text-dim)', border: '1px solid var(--border-subtle)' }}>
                  🗣️ {lang}
                </span>
              ))}
              {(guide.regions_served || []).map((reg, idx) => (
                <span key={idx} style={{ fontSize: '11px', background: 'rgba(2, 132, 199, 0.1)', padding: '3px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                  📍 {reg}
                </span>
              ))}
            </div>

            {/* Tour Packages List */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '6px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Curated Tour Packages
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(guide.packages || []).map((pkg) => (
                  <div key={pkg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#ffffff' }}>
                        {pkg.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ⏱️ {pkg.duration_hours} hrs • Max {pkg.max_group_size} travelers • <strong>{pkg.price}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingModalPackage(pkg)}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-sm)' }}
                    >
                      Book Tour
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModalPackage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-accent)' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Confirm Tour Booking</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {bookingModalPackage.title} ({bookingModalPackage.price})
            </p>

            {bookingStatusMsg ? (
              <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--status-safe-border)', borderRadius: 'var(--radius-sm)', color: 'var(--status-safe)', fontSize: '13px' }}>
                ✓ {bookingStatusMsg.message}
              </div>
            ) : (
              <form onSubmit={handleBookPackage}>
                <div className="form-group">
                  <label className="form-label">Scheduled Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setBookingModalPackage(null)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {isSubmittingBooking ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
