import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MAP_POIS_DATA, SAFETY_ZONES_DATA } from '../../data/safetyData';
import { MapPOI, SafetyZone } from '../../types';
import {
  Search,
  Filter,
  Layers,
  Navigation,
  Compass,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Building,
  PhoneCall,
  Star,
  Clock,
  Car,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';

export const TouristInteractiveMap: React.FC = () => {
  const { setCurrentPage, setSelectedDestinationId, showToast } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(MAP_POIS_DATA[0]);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [showSafetyZones, setShowSafetyZones] = useState<boolean>(true);
  const [isRouteActive, setIsRouteActive] = useState<boolean>(false);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(true);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [27.1751, 78.0421], // Centered near Agra & Taj Mahal
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap tile layer with high-contrast clean tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | SafarSetu Safety Engine',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers/polygons except tiles
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add Safety Geofence Polygons
    if (showSafetyZones) {
      SAFETY_ZONES_DATA.forEach((zone) => {
        const getZoneColor = () => {
          if (zone.type === 'safe') return '#10B981';
          if (zone.type === 'caution') return '#F59E0B';
          return '#EF4444';
        };

        const polygon = L.polygon(zone.polygon as [number, number][], {
          color: getZoneColor(),
          weight: 2,
          fillColor: getZoneColor(),
          fillOpacity: 0.18,
          dashArray: zone.type === 'danger' ? '6,6' : undefined,
        }).addTo(map);

        polygon.on('click', () => {
          setSelectedZone(zone);
          setSelectedPOI(null);
          showToast({
            title: `Geofence Zone: ${zone.name}`,
            message: zone.activeAdvisory || zone.description,
            type: zone.type === 'danger' ? 'error' : zone.type === 'caution' ? 'warning' : 'success',
          });
        });
      });
    }

    // Add Filtered POI Markers
    const filteredPOIs = MAP_POIS_DATA.filter((poi) => {
      const matchCat = activeCategory === 'all' || poi.category === activeCategory;
      const matchQuery = !searchQuery || poi.name.toLowerCase().includes(searchQuery.toLowerCase()) || poi.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });

    filteredPOIs.forEach((poi) => {
      const getPinColor = () => {
        switch (poi.category) {
          case 'attraction': return '#F97316';
          case 'police': return '#2563EB';
          case 'hospital': return '#DC2626';
          case 'hotel': return '#0D9488';
          case 'transport': return '#7C3AED';
          default: return '#0F172A';
        }
      };

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background: ${getPinColor()};
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            ${poi.category === 'attraction' ? '🏛️' : poi.category === 'police' ? '👮' : poi.category === 'hospital' ? '🏥' : poi.category === 'hotel' ? '🏨' : '🚖'}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker(poi.coordinates, { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedPOI(poi);
        setSelectedZone(null);
        map.panTo(poi.coordinates);
      });
    });

    // Add Route Polyline if active
    if (isRouteActive) {
      const routeCoords: [number, number][] = [
        [27.1751, 78.0421], // Taj Mahal
        [27.1712, 78.0389], // Police Post
        [27.1689, 78.0494], // Oberoi
        [27.1852, 78.0084], // Hospital/Fort loop
      ];
      const polyline = L.polyline(routeCoords, {
        color: '#0D9488',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(map);
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

  }, [activeCategory, searchQuery, showSafetyZones, isRouteActive]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([27.1751, 78.0421], 15, { animate: true, duration: 1.2 });
      showToast({
        title: 'Location Centered',
        message: 'Focused on Taj East Gate Verified Geofence.',
        type: 'info',
      });
    }
  };

  const toggleRoute = () => {
    setIsRouteActive(prev => {
      const next = !prev;
      showToast({
        title: next ? 'Safe Route Navigation Active' : 'Navigation Cleared',
        message: next ? 'Optimal pedestrian and electric shuttle path generated avoiding high-traffic zones.' : 'Route guidance deactivated.',
        type: next ? 'success' : 'info',
      });
      return next;
    });
  };

  const categories = [
    { id: 'all', label: 'All Places', icon: Layers },
    { id: 'attraction', label: 'Attractions', icon: Compass },
    { id: 'police', label: 'Tourist Police', icon: ShieldCheck },
    { id: 'hospital', label: 'Hospitals', icon: Hospital },
    { id: 'hotel', label: 'Verified Stays', icon: Building },
    { id: 'transport', label: 'Transport Hubs', icon: Car },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col animate-fade-in">
      
      {/* Top Map Filter & Search Toolbar */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-col md:flex-row gap-3 pointer-events-none">
        
        {/* Search Bar */}
        <div className="pointer-events-auto w-full md:w-80 glass-panel rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700/80 p-1 flex items-center">
          <Search className="w-4 h-4 ml-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions, hospitals, police..."
            className="w-full px-2.5 py-1.5 text-xs bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 mr-2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-safar-navy-900 dark:bg-safar-saffron-500 text-white font-bold scale-105'
                    : 'glass-panel text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Control Buttons (Right Side) */}
      <div className="absolute top-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 rounded-2xl glass-panel shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-safar-saffron-500 hover:scale-105 transition-all"
          title="Find My Location"
        >
          <Navigation className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowSafetyZones(prev => !prev)}
          className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
            showSafetyZones ? 'bg-emerald-500 text-white' : 'glass-panel text-slate-400'
          }`}
          title="Toggle Geofenced Safety Zones"
        >
          <ShieldAlert className="w-5 h-5" />
        </button>

        <button
          onClick={toggleRoute}
          className={`w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center transition-all ${
            isRouteActive ? 'bg-safar-teal-500 text-white' : 'glass-panel text-slate-400'
          }`}
          title="Safe Route Navigation Planner"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 dark:bg-slate-950 z-10" />

      {/* Bottom Sheet / Side Drawer for Selected POI / Zone */}
      {(selectedPOI || selectedZone) && (
        <div className="absolute bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:w-96 z-30 pointer-events-auto">
          <div className="glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3 animate-slide-up">
            
            {/* Header with Close */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-safar-saffron-500/10 text-safar-saffron-600 dark:text-safar-saffron-400">
                  {selectedPOI?.category || selectedZone?.type.toUpperCase() + ' ZONE'}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white mt-1 leading-tight">
                  {selectedPOI?.name || selectedZone?.name}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedPOI(null);
                  setSelectedZone(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content for Selected POI */}
            {selectedPOI && (
              <div className="space-y-3 text-xs">
                {selectedPOI.image && (
                  <img
                    src={selectedPOI.image}
                    alt={selectedPOI.name}
                    className="w-full h-32 rounded-2xl object-cover"
                  />
                )}

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPOI.description}
                </p>

                <div className="space-y-1.5 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-safar-saffron-500 shrink-0" />
                    <span className="truncate">{selectedPOI.address}</span>
                  </div>
                  {selectedPOI.contact && (
                    <div className="flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="font-mono">{selectedPOI.contact}</span>
                    </div>
                  )}
                  {selectedPOI.openingHours && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>{selectedPOI.openingHours}</span>
                    </div>
                  )}
                </div>

                {/* Facility Tags */}
                {selectedPOI.facilities && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPOI.facilities.map((fac, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {fac}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={toggleRoute}
                    className="py-2 px-3 rounded-xl bg-safar-teal-600 hover:bg-safar-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Start Navigation</span>
                  </button>

                  {selectedPOI.category === 'attraction' ? (
                    <button
                      onClick={() => {
                        setSelectedDestinationId('taj-mahal');
                        setCurrentPage('destination');
                      }}
                      className="py-2 px-3 rounded-xl bg-safar-navy-900 dark:bg-slate-800 hover:bg-safar-saffron-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>View Guide</span>
                    </button>
                  ) : (
                    <a
                      href={`tel:${selectedPOI.contact || '112'}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Call Hotline</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Content for Selected Geofence Zone */}
            {selectedZone && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Active Advisory:</span>
                    <span className="font-mono text-[10px] text-slate-400">Updated {selectedZone.lastUpdated}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedZone.activeAdvisory || selectedZone.description}
                  </p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live Density: <strong>{selectedZone.touristCount} active tourists</strong> in sector
                  </div>
                </div>

                <button
                  onClick={toggleRoute}
                  className="w-full py-2.5 rounded-xl bg-safar-teal-600 hover:bg-safar-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Calculate Safe Perimeter Route</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
