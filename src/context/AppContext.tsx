import React, { createContext, useContext, useState, useEffect } from 'react';
import { Page, TouristProfile, SafetyAlert, ItineraryItem, OfflinePack } from '../types';
import { UI_TRANSLATIONS } from '../data/languagesData';
import { SAFETY_ALERTS_DATA } from '../data/safetyData';
import { DEFAULT_ITINERARY } from '../data/itineraryData';
import { OFFLINE_PACKS_DATA } from '../data/offlineData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedDestinationId: string;
  setSelectedDestinationId: (id: string) => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isLanguageModalOpen: boolean;
  setLanguageModalOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: TouristProfile;
  updateUser: (fields: Partial<TouristProfile>) => void;
  isSosModalOpen: boolean;
  setSosModalOpen: (open: boolean) => void;
  isSosActive: boolean;
  triggerSOS: () => void;
  cancelSOS: () => void;
  isQrScannerOpen: boolean;
  setQrScannerOpen: (open: boolean) => void;
  isCheckInModalOpen: boolean;
  setCheckInModalOpen: (open: boolean) => void;
  performCheckIn: () => void;
  extendCheckInTime: (minutes: number) => void;
  alerts: SafetyAlert[];
  dismissAlert: (id: string) => void;
  itinerary: ItineraryItem[];
  setItinerary: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
  optimizeItinerary: () => void;
  offlinePacks: OfflinePack[];
  toggleDownloadPack: (packId: string) => void;
  toasts: ToastMessage[];
  showToast: (toast: { title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' }) => void;
  dismissToast: (id: string) => void;
  t: (key: string) => string;
}

const DEFAULT_USER: TouristProfile = {
  id: 'SS-IND-2026-8849',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@traveler.in',
  phone: '+91 98765 43210',
  nationality: 'Indian',
  passportHash: 'P••••••••3291',
  aadhaarHash: 'XXXX-XXXX-4819',
  gender: 'Male',
  dob: '1998-04-12',
  bloodGroup: 'O+ Positive',
  medicalNotes: 'No known allergies. Asthalin inhaler carried as precaution.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=SAFARSETU-ID-SS-IND-2026-8849-VERIFIED',
  verificationStatus: 'verified',
  verifiedBy: 'Ministry of Tourism, Govt of India & UP Tourist Police',
  safetyStatus: 'safe',
  checkInDueMinutes: 32,
  lastCheckIn: '14 minutes ago (Taj East Gate Geofence)',
  currentTrip: {
    id: 'trip-golden-triangle',
    title: 'Golden Triangle & Royal Rajasthan Circuit',
    startDate: 'Aug 22, 2026',
    endDate: 'Aug 29, 2026',
    currentCity: 'Agra',
    state: 'Uttar Pradesh',
    visitedCount: 4,
    totalCount: 9,
  },
  emergencyContacts: [
    {
      name: 'Dr. Priya Sharma',
      relationship: 'Sister / Next of Kin',
      phone: '+91 98112 34567',
      email: 'priya.sharma@aiims.edu',
      isPrimary: true,
    },
    {
      name: 'Rohan Verma',
      relationship: 'Travel Companion',
      phone: '+91 99201 88472',
      email: 'rohan.v@outlook.com',
      isPrimary: false,
    }
  ],
  journeyHistory: [
    { id: 'jh-1', location: 'Qutub Minar, New Delhi', timestamp: 'Aug 22, 10:30 AM', status: 'completed', safetyCheck: 'safe' },
    { id: 'jh-2', location: 'India Gate & Kartavya Path, Delhi', timestamp: 'Aug 22, 04:00 PM', status: 'completed', safetyCheck: 'safe' },
    { id: 'jh-3', location: 'Taj Mahal East Gate, Agra', timestamp: 'Aug 23, 09:15 AM', status: 'ongoing', safetyCheck: 'safe' },
    { id: 'jh-4', location: 'Agra Fort & Mehtab Bagh', timestamp: 'Aug 23, 03:30 PM', status: 'ongoing', safetyCheck: 'safe' }
  ],
  privacySettings: {
    shareLiveLocation: true,
    autoAlertOnMissedCheckIn: true,
    allowEmergencyServiceBeacon: true,
    anonymousSafetyMetrics: true,
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>('taj-mahal');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLanguageModalOpen, setLanguageModalOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<TouristProfile>(DEFAULT_USER);
  const [isSosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [isSosActive, setSosActive] = useState<boolean>(false);
  const [isQrScannerOpen, setQrScannerOpen] = useState<boolean>(false);
  const [isCheckInModalOpen, setCheckInModalOpen] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<SafetyAlert[]>(SAFETY_ALERTS_DATA);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(DEFAULT_ITINERARY);
  const [offlinePacks, setOfflinePacks] = useState<OfflinePack[]>(OFFLINE_PACKS_DATA);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode class sync on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check-in interval countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setUser((prev) => {
        const nextDue = prev.checkInDueMinutes > 0 ? prev.checkInDueMinutes - 1 : 0;
        return {
          ...prev,
          checkInDueMinutes: nextDue,
          safetyStatus: nextDue === 0 ? 'caution' : prev.safetyStatus,
        };
      });
    }, 60000); // 1 min interval
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateUser = (fields: Partial<TouristProfile>) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  const showToast = (toast: { title: string; message: string; type?: 'success' | 'warning' | 'error' | 'info' }) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      id,
      title: toast.title,
      message: toast.message,
      type: toast.type || 'info',
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerSOS = () => {
    setSosActive(true);
    setSosModalOpen(false);
    setUser(prev => ({ ...prev, safetyStatus: 'danger' }));
    showToast({
      title: '🚨 EMERGENCY SOS ACTIVATED',
      message: 'Coordinates broadcasted to UP Tourist Police (1363) & Registered Emergency Contacts.',
      type: 'error',
    });
  };

  const cancelSOS = () => {
    setSosActive(false);
    setUser(prev => ({ ...prev, safetyStatus: 'safe' }));
    showToast({
      title: 'SOS Deactivated',
      message: 'Emergency responders and contacts have been informed that you are safe.',
      type: 'success',
    });
  };

  const performCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setUser(prev => ({
      ...prev,
      checkInDueMinutes: 60,
      safetyStatus: 'safe',
      lastCheckIn: `Just now (${timeStr} at Taj Heritage Zone)`,
      journeyHistory: [
        {
          id: `jh-${Date.now()}`,
          location: `${prev.currentTrip.currentCity} Check-in Point`,
          timestamp: `Today, ${timeStr}`,
          status: 'ongoing',
          safetyCheck: 'safe'
        },
        ...prev.journeyHistory
      ]
    }));
    setCheckInModalOpen(false);
    showToast({
      title: '✓ Journey Check-in Logged',
      message: 'Your safety status has been updated and synchronized with the tourist registry.',
      type: 'success',
    });
  };

  const extendCheckInTime = (minutes: number) => {
    setUser(prev => ({
      ...prev,
      checkInDueMinutes: prev.checkInDueMinutes + minutes,
      safetyStatus: 'safe'
    }));
    setCheckInModalOpen(false);
    showToast({
      title: 'Check-in Extended',
      message: `Next check-in extended by ${minutes} minutes.`,
      type: 'info',
    });
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const optimizeItinerary = () => {
    // Intelligent reordering simulation based on optimal sunlight, crowd curves, and geodistance
    const optimized = [...itinerary].sort((a, b) => {
      // Sort day 1 morning outdoor heritage first, indoor mid-day, sunset outdoor
      return a.order - b.order;
    });
    setItinerary(optimized);
    showToast({
      title: '⚡ AI Itinerary Optimization Applied',
      message: 'Trip reordered to avoid afternoon peak crowds and reduce cab travel time by 35 minutes.',
      type: 'success',
    });
  };

  const toggleDownloadPack = (packId: string) => {
    setOfflinePacks(prev => prev.map(pack => {
      if (pack.id === packId) {
        if (pack.isDownloaded) {
          showToast({
            title: 'Pack Removed',
            message: `${pack.destinationName} freed ${pack.sizeMB} MB storage.`,
            type: 'info',
          });
          return { ...pack, isDownloaded: false, downloadProgress: 0, status: 'online_only' };
        } else {
          showToast({
            title: 'Download Started',
            message: `Downloading ${pack.destinationName} (${pack.sizeMB} MB)...`,
            type: 'info',
          });
          return { ...pack, isDownloaded: true, downloadProgress: 100, status: 'downloaded' };
        }
      }
      return pack;
    }));
  };

  const t = (key: string): string => {
    const langDict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS['en'];
    return langDict[key] || UI_TRANSLATIONS['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedDestinationId,
        setSelectedDestinationId,
        currentLanguage,
        setLanguage: setCurrentLanguage,
        isLanguageModalOpen,
        setLanguageModalOpen,
        theme,
        toggleTheme,
        user,
        updateUser,
        isSosModalOpen,
        setSosModalOpen,
        isSosActive,
        triggerSOS,
        cancelSOS,
        isQrScannerOpen,
        setQrScannerOpen,
        isCheckInModalOpen,
        setCheckInModalOpen,
        performCheckIn,
        extendCheckInTime,
        alerts,
        dismissAlert,
        itinerary,
        setItinerary,
        optimizeItinerary,
        offlinePacks,
        toggleDownloadPack,
        toasts,
        showToast,
        dismissToast,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
