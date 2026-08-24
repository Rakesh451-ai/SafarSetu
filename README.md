# 🇮🇳 SafarSetu (सफ़र सेतु) — Digital Tourist Guide & Safety Platform

> **A Unified Platform for Safer and Smarter Tourism in India**  
> Combining a premium travel guide, government-recognized digital tourist pass, interactive safety radar, and an intelligent AI travel copilot.

---

## 🌟 Key Highlights & Features

### 1. 🏛️ Digital Tourist ID & Verified Pass
- **Cryptographically Signed Digital Pass**: Unique ID (`SS-IND-2026-8849`), photo ID, and 256-bit encrypted Aadhaar/Passport hashes.
- **3D Rotatable ID Card**: Flip between the front pass and back emergency medical/next-of-kin credentials.
- **Interactive QR Code Scanner**: Scan monument & police booth QR codes for instantaneous access to verified guides and audio narrations.
- **Offline PDF & Pass Export**: One-tap download and sharing.

### 2. 🗺️ Interactive Safety Radar & Live Geofencing
- **Interactive OpenStreetMap / Leaflet Integration**: Custom category markers for Heritage Monuments, Tourist Police Kiosks, 24x7 Hospitals, Verified Havelis, and Transport Hubs.
- **Multi-tier Geofence Perimeter Overlays**:
  - 🟢 **Safe Zone**: Monitored heritage corridors and high-illumination zones with active patrol units.
  - 🟡 **Caution Zone**: Heavy crowd density & peak traffic advisories with alternative safe route detours.
  - 🔴 **Danger / Restricted Zone**: Unlit riverbeds and isolated hazard trails with immediate safety alerts.
- **Safe Route Planner**: Real-time walking & electric shuttle navigation avoiding congestion corridors.

### 3. 🤖 SafarSetu AI Travel Copilot
- **Dedicated Travel Companion**: Natural-language conversational interface with structured response cards.
- **Safety & Weather-Aware Planning**: Dynamic prompt chips for budget trips, wheelchair accessibility, family safety, and sunset timings.
- **One-Click Itinerary Sync**: Direct integration to add AI-recommended stops into your active trip timeline.

### 4. 🧭 Immersive Destination Guides & Audio Narration
- **Top Indian Heritage Circuits**: Rich guides for Taj Mahal, Amber Fort, Varanasi Ghats, Munnar Tea Hills, and Hampi Ruins.
- **Multilingual Audio Guide Player**: 10 Indian & International languages with scrubber, playback speed controls (0.75x to 1.5x), and live transcripts.
- **Crowd Meter & AQI**: Real-time crowd percentage and atmospheric air quality telemetry.
- **Official Guidelines**: Dos & Don'ts, ticket fees (Domestic vs. International), and universal accessibility facilities.

### 5. 🗓️ Smart Drag-and-Drop Itinerary Builder
- **Day-by-Day Timeline Interface**: Reorderable destination cards displaying duration, distance, transit mode, and cost estimates.
- **⚡ AI Trip Optimizer**: Reorders destinations automatically for optimal lighting, minimal crowd congestion, and shortest commute times.

### 6. 🚨 High-Priority Emergency SOS & Check-In Protocol
- **5-Second Countdown SOS**: Prevents accidental triggers with siren preview and cancelable timer.
- **Live Coordinate Beacon**: Real-time GPS broadcasting to **112 / 1363 UP Tourist Police** and registered emergency contacts.
- **Journey Check-In System**: Automatic countdown timer with a 3-tier escalation ladder (*Tourist Ping → Next of Kin Alert → Police Unit Dispatch*).

### 7. 🛍️ Verified Tourism Marketplace
- **✓ SafarSetu Verified Guarantee**: ASI-licensed historians, certified havelis, prepaid police-monitored electric fleets, and official fast-track monument passes.
- **100% Transparent Pricing**: Zero hidden fees and full tax breakdowns.

### 8. 📶 Offline Travel Pack Manager
- **Zero-Connectivity Architecture**: Download regional offline vector maps, audio guides, and emergency numbers for low-network valleys and hill stations.
- **Device Storage Visualizer**: Real-time cache management.

### 9. 🛡️ Law Enforcement & Authority Command Center (Admin)
- **Real-Time KPI Dashboard**: Active tourists, in-transit telemetry, open SOS incidents, and average response times.
- **Incident Triage Workflow**: Status management (`New` ➔ `Acknowledged` ➔ `Responding` ➔ `Resolved`).
- **Command Analytics**: Recharts-powered graphs for hourly tourist density and safety resolutions.

---

## 🎨 Design System & Aesthetics

- **Color Palette**:
  - `Deep Navy / Indigo`: `#0F1E36` / `#1E3A8A` (Trust & Governance)
  - `Indian Saffron / Warm Amber`: `#F97316` / `#EA580C` (Cultural Accent & CTAs)
  - `Safety Teal & Emerald`: `#0D9488` / `#10B981` (Safety Indicators & Verified Badges)
  - `Emergency Crimson`: `#EF4444` (SOS & Critical Alerts)
- **Typography**: Plus Jakarta Sans & Outfit
- **Theme**: Seamless Light & Dark Mode with glassmorphic cards and accessible contrast.
- **Responsiveness**: Mobile-first safety UX with permanent mobile SOS trigger.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+

### Installation & Run

```bash
# 1. Clone or navigate to the project directory
cd /home/rakesh/SafarSetu

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 📂 Project Structure

```
SafarSetu/
├── index.html                   # HTML entrypoint with Leaflet & Google Fonts
├── package.json                 # Pinned dependencies (React 18, Vite 6, Tailwind, Lucide, Recharts, Leaflet)
├── tailwind.config.js           # Custom Indian travel-tech theme & animations
├── vite.config.ts               # Vite configuration
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root app layout & view router
│   ├── index.css                # Tailwind directives, glassmorphism & Leaflet custom styles
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for all domain models
│   ├── data/
│   │   ├── destinationsData.ts  # Curated destination guides, transcripts & fees
│   │   ├── safetyData.ts        # Map POIs, geofenced safe/caution/danger zones & emergency numbers
│   │   ├── servicesData.ts      # Verified marketplace services (Guides, Stays, Transport)
│   │   ├── itineraryData.ts     # Sample 3-day itinerary timelines
│   │   ├── languagesData.ts     # 10 Indian language translations
│   │   ├── adminData.ts         # Law enforcement telemetry stream & incident triage
│   │   └── offlineData.ts       # Downloadable offline travel packs
│   ├── context/
│   │   └── AppContext.tsx       # Global state management (Auth, Theme, Language, SOS, Alerts, Itinerary)
│   └── components/
│       ├── layout/              # Navbar, Sidebar, MobileBottomNav, Footer, EmergencyBanner, LanguageModal
│       ├── home/                # HeroSection, FeaturePillars, DestinationPreviewGrid
│       ├── digital_id/          # DigitalIDView (3D Flip Card), QRScannerModal
│       ├── dashboard/           # DashboardView (Explorer greeting, Journey progress, Weather, Mini-ID)
│       ├── map/                 # TouristInteractiveMap (Leaflet map, geofence polygons, POI drawer)
│       ├── destination/         # DestinationGuideView (360° view, crowd meter, audio player, transcripts)
│       ├── assistant/           # AICopilotView (Copilot chat, structured cards), FloatingAICopilot
│       ├── itinerary/           # SmartItineraryView (Timeline reorder, AI optimizer, PDF export)
│       ├── safety/              # LiveSafetyCenterView (Geofence radar, active alerts, incident report)
│       ├── checkin/             # JourneyCheckInModal (Countdown timer, escalation ladder)
│       ├── sos/                 # SOSModal (5s countdown, live coordinates, direct emergency dialers)
│       ├── services/            # VerifiedMarketplaceView (Verified cards, transparent pricing, booking)
│       ├── offline/             # OfflinePackManagerView (Storage breakdown, offline pack downloads)
│       ├── admin/               # AdminDashboardView (Incident triage pipeline, telemetry grid, Recharts)
│       ├── profile/             # UserProfileView (Traveler profile, emergency contacts, medical records)
│       └── common/              # ToastContainer, Badges, Modals
```

---

## 🔒 Security & Privacy
- **Client-Side Encryption Simulation**: 256-bit hashed identity parameters.
- **Granular Privacy Controls**: Opt-in toggle for live police geofence beacon.
- **Government Ready**: Conforming to Ministry of Tourism & National Emergency Response System (NERS 112) architectural guidelines.
