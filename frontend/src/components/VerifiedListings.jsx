import React, { useState, useEffect } from 'react';
import {
  Building2,
  Car,
  Ticket,
  MapPin,
  CheckCircle,
  Star,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export const SAMPLE_LISTINGS = [
  {
    id: 1,
    type: 'hotel',
    name: 'Amer Heritage Haveli & Resort',
    region: 'Amer',
    city: 'Jaipur',
    description: 'Authentic Rajput haveli stay with courtyard dining and Amber Fort views.',
    price_info: '₹3,500 / night',
    rating: 4.8,
    verified: true,
  },
  {
    id: 2,
    type: 'transport',
    name: 'Jaipur Pre-paid Auto-Rickshaw Union Stand',
    region: 'Jaipur',
    city: 'Jaipur',
    description: 'Government tariff-regulated pre-paid auto stand at Jaipur Junction and Hawa Mahal.',
    price_info: '₹15 / km (Govt Metered Tariff)',
    rating: 4.7,
    verified: true,
  },
  {
    id: 3,
    type: 'transport',
    name: 'Amer Electric Shuttle & Jeep Syndicate',
    region: 'Amer',
    city: 'Jaipur',
    description: 'Authorized battery-operated electric shuttle and 4x4 jeeps to Amber Fort main gate.',
    price_info: '₹500 / vehicle (Round Trip)',
    rating: 4.9,
    verified: true,
  },
  {
    id: 4,
    type: 'entry_fee',
    name: 'Amber Fort Official Monument Entry Ticket',
    region: 'Amer',
    city: 'Jaipur',
    description: 'Official Department of Archaeology entrance ticket for Amber Fort and Sheesh Mahal.',
    price_info: '₹100 (Indians) / ₹500 (Foreign Nationals)',
    rating: 5.0,
    verified: true,
  },
  {
    id: 5,
    type: 'entry_fee',
    name: 'Hawa Mahal & Museum Composite Pass',
    region: 'Jaipur',
    city: 'Jaipur',
    description: 'Composite entry ticket including Hawa Mahal, Jantar Mantar, and Albert Hall Museum.',
    price_info: '₹300 (Composite 2-Day Pass)',
    rating: 4.9,
    verified: true,
  },
  {
    id: 6,
    type: 'attraction',
    name: 'Amber Palace & Sheesh Mahal',
    region: 'Amer',
    city: 'Jaipur',
    description: 'Opulent 16th-century Rajput palace renowned for mirror mosaics and royal courtyards.',
    price_info: 'Official Entry ₹100-₹500',
    rating: 4.9,
    verified: true,
  },
];

export default function VerifiedListings({ isOnline }) {
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    async function fetchListings() {
      try {
        const queryParams = new URLSearchParams();
        if (selectedType !== 'all') queryParams.set('type', selectedType);
        if (selectedRegion !== 'all') queryParams.set('region', selectedRegion);

        const resp = await fetch(`/api/v1/listings/?${queryParams.toString()}`);
        if (resp.ok) {
          const data = await resp.json();
          const items = data.results || data;
          if (items && items.length) {
            setListings(items);
          }
        }
      } catch (err) {
        console.log('Using offline cached listings:', err);
      }
    }
    fetchListings();
  }, [selectedType, selectedRegion]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <Building2 size={16} style={{ color: '#38bdf8' }} />;
      case 'transport':
        return <Car size={16} style={{ color: 'var(--safar-saffron)' }} />;
      case 'entry_fee':
        return <Ticket size={16} style={{ color: '#10b981' }} />;
      default:
        return <MapPin size={16} style={{ color: '#a855f7' }} />;
    }
  };

  const filteredListings = listings.filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (selectedRegion !== 'all' && !(item.region || '').toLowerCase().includes(selectedRegion.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ color: '#10b981' }} />
            Verified Listings & Official Tariffs
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Government-verified hotels, regulated pre-paid transport tariffs, and official monument entrance passes.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
          >
            <option value="all">All Types</option>
            <option value="hotel">Hotels & Stays</option>
            <option value="transport">Regulated Transport</option>
            <option value="entry_fee">Official Entry Fees</option>
            <option value="attraction">Heritage Attractions</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '12px' }}
          >
            <option value="all">All Regions</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Amer">Amer</option>
            <option value="Udaipur">Udaipur</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid-3">
        {filteredListings.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {getTypeIcon(item.type)}
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-dim)' }}>
                    {item.type?.replace('_', ' ')}
                  </span>
                </div>

                {item.verified && (
                  <span className="badge badge-verified" style={{ fontSize: '10px' }}>
                    <CheckCircle size={10} /> Verified
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '16px', color: '#ffffff', marginBottom: '6px' }}>
                {item.name || item.title}
              </h3>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Official Tariff</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--safar-saffron)' }}>
                  {item.price_info || 'Regulated Rate'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ffffff' }}>
                <Star size={12} fill="var(--safar-saffron)" style={{ color: 'var(--safar-saffron)' }} />
                <strong>{item.rating || 4.8}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
