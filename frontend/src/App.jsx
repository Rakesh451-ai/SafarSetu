import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/landing/LandingPage';
import DigitalTouristID from './components/DigitalTouristID';
import SafetyRadarGeofence from './components/SafetyRadarGeofence';
import EmergencySOS from './components/EmergencySOS';
import SafeItineraryAI from './components/SafeItineraryAI';
import VerifiedGuides from './components/VerifiedGuides';
import VerifiedListings from './components/VerifiedListings';
import {
  getQueuedPings,
  syncQueuedPingsToServer,
} from './utils/geofence';
import { Wifi, WifiOff, RefreshCw, ArrowLeft, Home } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'app'
  const [activeTab, setActiveTab] = useState('id'); // 'id' | 'radar' | 'sos' | 'itinerary' | 'guides' | 'listings'
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isManualOffline, setIsManualOffline] = useState(false);
  const [queuedPingsCount, setQueuedPingsCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Stored Tourist Profile & Signed Digital ID
  const [tourist, setTourist] = useState(() => {
    try {
      const saved = localStorage.getItem('safarsetu_tourist');
      return saved
        ? JSON.parse(saved)
        : {
            tourist_id: 'd8a3910c-45bb-4cf1-8c44-320e8b15d023',
            name: 'Maya Lin',
            nationality: 'Singaporean',
            id_proof_type: 'PASSPORT',
            id_proof_number: 'SGP123456',
            phone: '+6591234567',
            current_region: 'Jaipur',
            preferred_language: 'en',
            trip_start: new Date().toISOString().split('T')[0],
            trip_end: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          };
    } catch (e) {
      return null;
    }
  });

  const [digitalId, setDigitalId] = useState(() => {
    try {
      const saved = localStorage.getItem('safarsetu_digital_id');
      return saved
        ? JSON.parse(saved)
        : {
            id_token: 'id-token-98124',
            issued_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
            qr_payload_signed: {
              tourist_id: 'd8a3910c-45bb-4cf1-8c44-320e8b15d023',
              name: 'Maya Lin',
              checksum: 'sha256:4f9b8c2d1e0a77519bb5a11c47ea8d65dfc2d4b1fa3d677284addd200126d906',
            },
          };
    } catch (e) {
      return null;
    }
  });

  // Track real online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (!isManualOffline) {
        setIsOnline(true);
        triggerAutoSync();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateQueuedCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isManualOffline]);

  const updateQueuedCount = () => {
    const q = getQueuedPings();
    setQueuedPingsCount(q.length);
  };

  const toggleNetworkSimulation = () => {
    const nextManualOffline = !isManualOffline;
    setIsManualOffline(nextManualOffline);
    const effectiveOnline = !nextManualOffline && navigator.onLine;
    setIsOnline(effectiveOnline);

    if (effectiveOnline) {
      triggerAutoSync();
    }
  };

  const triggerAutoSync = async () => {
    updateQueuedCount();
    const count = getQueuedPings().length;
    if (count === 0) return;

    setIsSyncing(true);
    setSyncFeedback(`🔄 Syncing ${count} queued offline location pings to SafarSetu server...`);

    const result = await syncQueuedPingsToServer(tourist?.tourist_id);
    updateQueuedCount();
    setIsSyncing(false);

    setSyncFeedback(
      `✅ Successfully synchronized ${result.synced} offline pings with the government safety database!`
    );
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  const handleLaunchAppTab = (tabName) => {
    setActiveTab(tabName);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Landing Page mode, render LandingPage at root route
  if (viewMode === 'landing') {
    return (
      <LandingPage
        lang={selectedLanguage}
        setLang={setSelectedLanguage}
        onLaunchAppTab={handleLaunchAppTab}
      />
    );
  }

  // Live PWA App View
  return (
    <div className="app-container">
      {/* Top Banner with Return to Home Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '10px' }}>
        <button
          onClick={() => setViewMode('landing')}
          className="btn btn-secondary"
          style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
        >
          <Home size={14} />
          <span>Return to SafarSetu Home</span>
        </button>

        <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          Active Session: <strong>{tourist?.name || 'Registered Tourist'}</strong>
        </span>
      </div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        toggleNetworkSimulation={toggleNetworkSimulation}
        queuedPingsCount={queuedPingsCount}
        onSyncQueuedPings={triggerAutoSync}
        isSyncing={isSyncing}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        tourist={tourist}
      />

      {/* Network Status & Sync Notification Banner */}
      {!isOnline && (
        <div className="sync-banner offline">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WifiOff size={16} />
            <span>
              <strong>OFFLINE MODE ACTIVE:</strong> Client-side geofencing, cached POIs, and offline ping queue are functioning without network.
            </span>
          </div>
          <span style={{ fontSize: '11px', opacity: 0.9 }}>
            Queued Pings: <strong>{queuedPingsCount}</strong>
          </span>
        </div>
      )}

      {syncFeedback && (
        <div className="sync-banner online" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            <span>{syncFeedback}</span>
          </div>
        </div>
      )}

      {/* Screen Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'id' && (
          <DigitalTouristID
            tourist={tourist}
            setTourist={setTourist}
            digitalId={digitalId}
            setDigitalId={setDigitalId}
            isOnline={isOnline}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeTab === 'radar' && (
          <SafetyRadarGeofence
            tourist={tourist}
            isOnline={isOnline}
            onPingQueued={updateQueuedCount}
          />
        )}

        {activeTab === 'sos' && (
          <EmergencySOS
            tourist={tourist}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'itinerary' && (
          <SafeItineraryAI
            tourist={tourist}
            selectedLanguage={selectedLanguage}
          />
        )}

        {activeTab === 'guides' && (
          <VerifiedGuides
            tourist={tourist}
            isOnline={isOnline}
          />
        )}

        {activeTab === 'listings' && (
          <VerifiedListings
            isOnline={isOnline}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: '48px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: 'var(--text-dim)' }}>
        <div>
          © 2026 SafarSetu • National Smart Tourist Safety Platform • Ministry of Tourism & State Police
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setViewMode('landing')} style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '12px' }}>
            Landing Page
          </button>
          <span>Offline Geofencing Shield</span>
          <span>PyJWT Cryptographic Pass</span>
          <span>1-Tap SOS Distress</span>
        </div>
      </footer>
    </div>
  );
}
