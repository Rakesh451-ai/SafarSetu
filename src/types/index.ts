export type Page = 
  | 'landing' 
  | 'dashboard' 
  | 'digital_id' 
  | 'map' 
  | 'destination' 
  | 'assistant' 
  | 'itinerary' 
  | 'safety' 
  | 'sos' 
  | 'checkin' 
  | 'services' 
  | 'offline' 
  | 'admin' 
  | 'profile';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface TouristProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportHash: string;
  aadhaarHash: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  medicalNotes: string;
  avatarUrl: string;
  qrCodeUrl: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verifiedBy: string;
  safetyStatus: 'safe' | 'caution' | 'danger';
  checkInDueMinutes: number;
  lastCheckIn: string;
  currentTrip: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    currentCity: string;
    state: string;
    visitedCount: number;
    totalCount: number;
  };
  emergencyContacts: EmergencyContact[];
  journeyHistory: {
    id: string;
    location: string;
    timestamp: string;
    status: 'completed' | 'ongoing';
    safetyCheck: 'safe' | 'caution';
  }[];
  privacySettings: {
    shareLiveLocation: boolean;
    autoAlertOnMissedCheckIn: boolean;
    allowEmergencyServiceBeacon: boolean;
    anonymousSafetyMetrics: boolean;
  };
}

export interface AudioGuideTrack {
  id: string;
  language: string;
  title: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  transcript: string;
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  city: string;
  state: string;
  category: 'heritage' | 'nature' | 'spiritual' | 'adventure' | 'coastal';
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  history: string;
  openingHours: string;
  entryFee: {
    domestic: number;
    international: number;
    camera: number;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    audioAssistance: boolean;
    brailleSignage: boolean;
    batteryCars: boolean;
    specialWashrooms: boolean;
  };
  safetyRating: number;
  crowdStatus: 'low' | 'moderate' | 'high';
  crowdPercentage: number;
  weather: {
    temp: number;
    condition: string;
    aqi: number;
    aqiStatus: string;
  };
  bestTimeToVisit: string;
  facilities: string[];
  audioGuides: AudioGuideTrack[];
  safetyGuidelines: string[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  coordinates: [number, number];
  qrCode: string;
  panoramaUrl: string;
  nearbyAttractions: {
    name: string;
    distance: string;
    image: string;
  }[];
  reviews: {
    id: string;
    author: string;
    nationality: string;
    rating: number;
    date: string;
    comment: string;
    verifiedStay: boolean;
  }[];
}

export interface MapPOI {
  id: string;
  name: string;
  category: 'attraction' | 'hotel' | 'restaurant' | 'hospital' | 'police' | 'transport' | 'emergency';
  coordinates: [number, number];
  rating?: number;
  address: string;
  contact?: string;
  image?: string;
  description: string;
  openingHours?: string;
  entryFee?: string;
  facilities?: string[];
  safetyRating: number;
  openStatus: string;
  distanceKm?: number;
}

export interface SafetyZone {
  id: string;
  name: string;
  type: 'safe' | 'caution' | 'danger';
  center: [number, number];
  polygon: [number, number][];
  description: string;
  activeAdvisory?: string;
  touristCount: number;
  lastUpdated: string;
}

export interface SafetyAlert {
  id: string;
  type: 'caution' | 'danger' | 'info';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  alternativeRoute?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
}

export interface ItineraryItem {
  id: string;
  day: number;
  order: number;
  time: string;
  title: string;
  location: string;
  duration: string;
  transportMode: 'walk' | 'cab' | 'metro' | 'auto';
  travelTimeFromPrev: string;
  distanceFromPrev: string;
  cost: number;
  safetyStatus: 'safe' | 'caution';
  recommendedHours: string;
  coordinates: [number, number];
  notes?: string;
}

export interface VerifiedService {
  id: string;
  type: 'hotel' | 'transport' | 'guide' | 'ticket' | 'experience';
  title: string;
  provider: string;
  licenseNumber: string;
  location: string;
  rating: number;
  reviewsCount: number;
  price: number;
  priceUnit: string;
  image: string;
  badge: string;
  facilities: string[];
  accessibility: string[];
  cancellationPolicy: string;
  verifiedDate: string;
  languages?: string[];
  experienceYears?: number;
}

export interface AdminIncident {
  id: string;
  touristId: string;
  touristName: string;
  nationality: string;
  location: string;
  coordinates: [number, number];
  time: string;
  type: 'SOS Emergency' | 'Medical Distress' | 'Missed Check-In' | 'Lost Item / Dispute';
  status: 'new' | 'acknowledged' | 'responding' | 'resolved';
  priority: 'critical' | 'high' | 'medium';
  assignedOfficer: string;
  batteryLevel: number;
  responderNotes: string;
}

export interface AdminStats {
  activeTourists: number;
  inTransit: number;
  activeAlerts: number;
  openSOS: number;
  missedCheckins: number;
  avgResponseTimeMinutes: number;
  highRiskZonesCount: number;
}

export interface OfflinePack {
  id: string;
  destinationName: string;
  state: string;
  sizeMB: number;
  isDownloaded: boolean;
  downloadProgress: number;
  status: 'downloaded' | 'downloading' | 'online_only';
  itemsCount: {
    maps: number;
    guides: number;
    audioHours: number;
    emergencyContacts: number;
  };
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  cards?: {
    type: 'destination' | 'route' | 'safety' | 'budget';
    title: string;
    subtitle: string;
    rating?: number;
    cost?: string;
    safetyLevel?: 'safe' | 'caution' | 'danger';
    tags?: string[];
    actionLabel?: string;
    destinationId?: string;
  }[];
}
