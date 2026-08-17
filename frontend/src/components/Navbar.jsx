import React from 'react';
import {
  Shield,
  Wifi,
  WifiOff,
  RefreshCw,
  Globe,
  QrCode,
  MapPin,
  AlertTriangle,
  Compass,
  UserCheck,
  Building2,
} from 'lucide-react';

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  isOnline,
  toggleNetworkSimulation,
  queuedPingsCount,
  onSyncQueuedPings,
  isSyncing,
  selectedLanguage,
  setSelectedLanguage,
  tourist,
}) {
  return (
    <header className="navbar">
      {/* Brand Badge */}
      <div className="brand-badge">
        <div className="brand-logo-icon">
          <Shield size={22} />
        </div>
        <div>
          <div className="brand-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            SafarSetu
            <span style={{ fontSize: '10px', background: '#0284c7', color: 'white', padding: '2px 6px', borderRadius: '6px' }}>
              PWA v1.0
            </span>
          </div>
          <div className="brand-subtitle">National Smart Tourist Safety Platform</div>
        </div>
      </div>

      {/* Center Nav Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'id' ? 'active' : ''}`}
          onClick={() => setActiveTab('id')}
        >
          <QrCode size={15} />
          Digital ID
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
          onClick={() => setActiveTab('radar')}
        >
          <MapPin size={15} />
          Safety Radar
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'sos' ? 'active' : ''}`}
          onClick={() => setActiveTab('sos')}
          style={activeTab === 'sos' ? { background: '#ef4444' } : { color: '#f87171' }}
        >
          <AlertTriangle size={15} />
          1-Tap SOS
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          <Compass size={15} />
          Safe Itinerary & AI
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'guides' ? 'active' : ''}`}
          onClick={() => setActiveTab('guides')}
        >
          <UserCheck size={15} />
          Verified Guides
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => setActiveTab('listings')}
        >
          <Building2 size={15} />
          Verified Listings
        </button>
      </nav>

      {/* Right Controls: Network Status, Language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Network Online/Offline Toggle Simulation */}
        <button
          onClick={toggleNetworkSimulation}
          title="Click to toggle network online/offline simulation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.2)',
            border: `1px solid ${isOnline ? '#10b981' : '#f59e0b'}`,
            color: isOnline ? '#10b981' : '#f59e0b',
            borderRadius: '9999px',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </button>

        {/* Sync Button if queued pings exist */}
        {queuedPingsCount > 0 && (
          <button
            onClick={onSyncQueuedPings}
            disabled={!isOnline || isSyncing}
            className="btn btn-primary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '9999px',
              background: '#0284c7',
            }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            Sync ({queuedPingsCount})
          </button>
        )}

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="form-select"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              width: 'auto',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
