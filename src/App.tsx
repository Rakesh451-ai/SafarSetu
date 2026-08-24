import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LanguageModal } from './components/layout/LanguageModal';

import { HeroSection } from './components/home/HeroSection';
import { DashboardView } from './components/dashboard/DashboardView';
import { DigitalIDView } from './components/digital_id/DigitalIDView';
import { DestinationGuideView } from './components/destination/DestinationGuideView';
import { AICopilotView } from './components/assistant/AICopilotView';
import { SmartItineraryView } from './components/itinerary/SmartItineraryView';
import { LiveSafetyCenterView } from './components/safety/LiveSafetyCenterView';
import { TouristInteractiveMap } from './components/map/TouristInteractiveMap';
import { UserProfileView } from './components/profile/UserProfileView';

import { SOSModal } from './components/sos/SOSModal';
import { QRScannerModal } from './components/digital_id/QRScannerModal';

export const App: React.FC = () => {
  const { currentPage } = useApp();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'landing':
        return <HeroSection />;
      case 'dashboard':
        return <DashboardView />;
      case 'destination':
        return <DestinationGuideView />;
      case 'itinerary':
        return <SmartItineraryView />;
      case 'safety':
        return <LiveSafetyCenterView />;
      case 'digital_id':
        return <DigitalIDView />;
      case 'assistant':
        return <AICopilotView />;
      case 'map':
        return <TouristInteractiveMap />;
      case 'profile':
        return <UserProfileView />;
      case 'sos':
      case 'checkin':
        return <LiveSafetyCenterView />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans antialiased">
      
      {/* 1. Simple, Clean Top Navbar */}
      <Navbar />

      {/* 2. Main Content Area (Centered with reasonable width and intentional whitespace) */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {renderCurrentView()}
      </main>

      {/* 3. Clean Footer */}
      <Footer />

      {/* 4. Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* 5. Essential Modals & Toasts */}
      <SOSModal />
      <QRScannerModal />
      <LanguageModal />
      <ToastContainer />

    </div>
  );
};

export default App;
