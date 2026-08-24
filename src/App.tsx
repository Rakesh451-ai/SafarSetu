import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { LanguageModal } from './components/layout/LanguageModal';
import { ToastContainer } from './components/common/ToastContainer';

import { HeroSection } from './components/home/HeroSection';
import { FeaturePillars } from './components/home/FeaturePillars';
import { DestinationPreviewGrid } from './components/home/DestinationPreviewGrid';

import { DashboardView } from './components/dashboard/DashboardView';
import { DigitalIDView } from './components/digital_id/DigitalIDView';
import { TouristInteractiveMap } from './components/map/TouristInteractiveMap';
import { DestinationGuideView } from './components/destination/DestinationGuideView';
import { AICopilotView } from './components/assistant/AICopilotView';
import { FloatingAICopilot } from './components/assistant/FloatingAICopilot';
import { SmartItineraryView } from './components/itinerary/SmartItineraryView';
import { LiveSafetyCenterView } from './components/safety/LiveSafetyCenterView';
import { VerifiedMarketplaceView } from './components/services/VerifiedMarketplaceView';
import { OfflinePackManagerView } from './components/offline/OfflinePackManagerView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { UserProfileView } from './components/profile/UserProfileView';

import { SOSModal } from './components/sos/SOSModal';
import { QRScannerModal } from './components/digital_id/QRScannerModal';
import { JourneyCheckInModal } from './components/checkin/JourneyCheckInModal';

export const App: React.FC = () => {
  const { currentPage, isSosActive, cancelSOS } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div className="space-y-4">
            <HeroSection />
            <FeaturePillars />
            <DestinationPreviewGrid />
          </div>
        );
      case 'dashboard':
        return <DashboardView />;
      case 'digital_id':
        return <DigitalIDView />;
      case 'map':
        return <TouristInteractiveMap />;
      case 'destination':
        return <DestinationGuideView />;
      case 'assistant':
        return <AICopilotView />;
      case 'itinerary':
        return <SmartItineraryView />;
      case 'safety':
        return <LiveSafetyCenterView />;
      case 'services':
        return <VerifiedMarketplaceView />;
      case 'offline':
        return <OfflinePackManagerView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'profile':
        return <UserProfileView />;
      case 'checkin':
        return <LiveSafetyCenterView />;
      case 'sos':
        return <LiveSafetyCenterView />;
      default:
        return (
          <div className="space-y-4">
            <HeroSection />
            <FeaturePillars />
            <DestinationPreviewGrid />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-safar-saffron-500 selection:text-white transition-colors duration-200">
      
      {/* Top Emergency Active Warning Ribbon */}
      <EmergencyBanner />

      {/* Main Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main App Body with Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Persistent Desktop Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 lg:pl-72 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[100vw] overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Footer */}
      <div className="lg:pl-72">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Floating Global AI Copilot Button */}
      <FloatingAICopilot />

      {/* Global Modals & Overlays */}
      <SOSModal />
      <QRScannerModal />
      <JourneyCheckInModal />
      <LanguageModal />
      <ToastContainer />

    </div>
  );
};

export default App;
