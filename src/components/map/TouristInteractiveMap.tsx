import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MAP_POIS_DATA, SAFETY_ZONES_DATA } from '../../data/safetyData';
import { MapPOI, SafetyZone } from '../../types';
import {
  Search,
  Layers,
  Navigation,
  Compass,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Hospital,
  Building,
  PhoneCall,
  X,
  ChevronRight
} from 'lucide-react';
import L from 'leaflet';

export const TouristInteractiveMap: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId, showToast } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(MAP_POIS_DATA[0]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [27.1751, 78.0421], // Centered near Agra & Taj Mahal
        zoom: 14,
        zoomControl: true,
      });

      // OpenStreetMap clean tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | SafarSetu',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon) {
        map.removeLayer(layer);
      }
    });

    // Add Simple Geofences
    SAFETY_ZONES_DATA.forEach((zone) => {
      const color = zone.type === 'safe' ? '#16A34A' : zone.type === 'caution' ? '#F59E0B' : '#DC2626';
      L.polygon(zone.polygon as [number, number][], {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.15,
      }).addTo(map);
    });

    // Add Markers
    const filteredPOIs = MAP_POIS_DATA.filter((poi) => {
      const matchCat = activeCategory === 'all' || poi.category === activeCategory;
      const matchQuery = !searchQuery || poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    filteredPOIs.forEach((poi) => {
      const pinColor = poi.category === 'attraction' ? '#12355B' : poi.category === 'police' ? '#168A72' : poi.category === 'hospital' ? '#DC2626' : '#F28C28';
      const customIcon = L.divIcon({
        className: 'clean-map-pin',
        html: `
          <div style="
            background: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${poi.category === 'attraction' ? '🏛️' : poi.category === 'police' ? '👮' : poi.category === 'hospital' ? '🏥' : '🏨'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(poi.coordinates, { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        setSelectedPOI(poi);
        map.panTo(poi.coordinates);
      });
    });

  }, [activeCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'attraction', label: 'Monuments' },
    { id: 'police', label: 'Police Kiosks' },
    { id: 'hospital', label: 'Hospitals' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4 py-4 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#172033]">
          Interactive Map & Places
        </h1>
        <p className="text-xs text-slate-500">
          Find verified monuments, tourist police assistance kiosks, and safe routes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search on map..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#12355B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeCategory === cat.id
                  ? 'bg-[#12355B] text-white border-[#12355B]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container and Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Leaflet Canvas (8 cols on desktop) */}
        <div className="lg:col-span-8 h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        {/* Selected POI Details Card (4 cols on desktop) */}
        <div className="lg:col-span-4">
          {selectedPOI ? (
            <div className="safar-card p-5 space-y-4 bg-white">
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                  {selectedPOI.category}
                </span>
                <h3 className="font-bold text-base text-[#172033] mt-1">
                  {selectedPOI.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedPOI.address}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPOI.description}
              </p>

              {selectedPOI.contact && (
                <div className="text-xs text-slate-600 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#168A72]" />
                  <span className="font-mono">{selectedPOI.contact}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                {selectedPOI.category === 'attraction' ? (
                  <button
                    onClick={() => {
                      setSelectedDestinationId('taj-mahal');
                      setCurrentPage('destination');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#12355B] text-white font-bold text-xs hover:bg-[#0E2845] transition-colors"
                  >
                    View Destination Guide
                  </button>
                ) : (
                  <a
                    href={`tel:${selectedPOI.contact || '112'}`}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center hover:bg-emerald-700 transition-colors"
                  >
                    Call Assistance
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="safar-card p-5 text-center text-xs text-slate-400">
              Tap any pin on the map to view details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
