import React, { Suspense, lazy } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { LanguageModal } from './components/layout/LanguageModal';
import { HeroSection } from './components/home/HeroSection';
import { SOSModal } from './components/sos/SOSModal';

// Lazy load views for optimal bundle splitting and fast initial page load
const DashboardView = lazy(() => import('./components/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const DestinationGuideView = lazy(() => import('./components/destination/DestinationGuideView').then(m => ({ default: m.DestinationGuideView })));
const SmartItineraryView = lazy(() => import('./components/itinerary/SmartItineraryView').then(m => ({ default: m.SmartItineraryView })));
const LiveSafetyCenterView = lazy(() => import('./components/safety/LiveSafetyCenterView').then(m => ({ default: m.LiveSafetyCenterView })));
const DigitalIDView = lazy(() => import('./components/digital_id/DigitalIDView').then(m => ({ default: m.DigitalIDView })));
const AICopilotView = lazy(() => import('./components/assistant/AICopilotView').then(m => ({ default: m.AICopilotView })));
const TouristInteractiveMap = lazy(() => import('./components/map/TouristInteractiveMap').then(m => ({ default: m.TouristInteractiveMap })));
const UserProfileView = lazy(() => import('./components/profile/UserProfileView').then(m => ({ default: m.UserProfileView })));
const AdminDashboardView = lazy(() => import('./components/admin/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const QRScannerModal = lazy(() => import('./components/digital_id/QRScannerModal').then(m => ({ default: m.QRScannerModal })));
const AuthModal = lazy(() => import('./components/auth/AuthModal').then(m => ({ default: m.AuthModal })));

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
      case 'admin':
        return <AdminDashboardView />;
      case 'sos':
      case 'checkin':
        return <LiveSafetyCenterView />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172033] flex flex-col font-sans antialiased">
      
      {/* 1. Top Navbar */}
      <Navbar />

      {/* 2. Main Content Area with Suspense Lazy Loading */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <Suspense fallback={
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-2 text-slate-400">
            <div className="w-6 h-6 border-2 border-[#12355B] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading SafarSetu...</span>
          </div>
        }>
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* 5. Modals & Overlays */}
      <SOSModal />
      <LanguageModal />
      <ToastContainer />
      <Suspense fallback={null}>
        <QRScannerModal />
        <AuthModal />
      </Suspense>

    </div>
  );
};


export default App;
