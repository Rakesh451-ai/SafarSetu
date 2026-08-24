import { MapPOI, SafetyZone, SafetyAlert } from '../types';

export const MAP_POIS_DATA: MapPOI[] = [
  // Heritage & Attractions
  {
    id: 'poi-taj-mahal',
    name: 'Taj Mahal (East & West Gates)',
    category: 'attraction',
    coordinates: [27.1751, 78.0421],
    rating: 4.9,
    address: 'Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001',
    contact: '+91 562 222 6431',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    description: 'World Heritage Wonder on the Yamuna river. Fully secured with CCTV & Tourist Police booths.',
    openingHours: '06:00 AM – 06:30 PM (Closed Fridays)',
    entryFee: '₹50 (Indian) / ₹1100 (Foreigner)',
    facilities: ['Wheelchair Ramps', 'Locker Room', 'Battery Carts', 'First Aid Center', 'RO Drinking Water'],
    safetyRating: 4.9,
    openStatus: 'Open Now',
    distanceKm: 0.8
  },
  {
    id: 'poi-amber-fort',
    name: 'Amber Palace & Fort',
    category: 'attraction',
    coordinates: [26.9855, 75.8513],
    rating: 4.8,
    address: 'Devisinghpura, Amer, Jaipur, Rajasthan 302001',
    contact: '+91 141 253 0264',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
    description: 'Famous hilltop fort with Sheesh Mahal and scenic lake ramparts. RTDC verified guides available.',
    openingHours: '08:00 AM – 05:30 PM',
    entryFee: '₹100 (Indian) / ₹550 (Foreigner)',
    facilities: ['Jeep Shuttle', 'Cafeteria', 'Audio Guide Hub', 'Wheelchair Access'],
    safetyRating: 4.8,
    openStatus: 'Open Now',
    distanceKm: 4.2
  },
  {
    id: 'poi-city-palace-jaipur',
    name: 'City Palace Jaipur',
    category: 'attraction',
    coordinates: [26.9258, 75.8237],
    rating: 4.7,
    address: 'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002',
    contact: '+91 141 408 8888',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    description: 'Royal residence combining Rajput, Mughal and European architectural styles.',
    openingHours: '09:30 AM – 05:00 PM',
    entryFee: '₹200 (Indian) / ₹700 (Foreigner)',
    facilities: ['Museum Shop', 'Guided Tours', 'Wheelchair Accessible', 'Restrooms'],
    safetyRating: 4.9,
    openStatus: 'Open Now',
    distanceKm: 1.5
  },
  {
    id: 'poi-varanasi-ghats',
    name: 'Dashashwamedh Ghat Riverfront',
    category: 'attraction',
    coordinates: [25.3076, 83.0107],
    rating: 4.9,
    address: 'Dashashwamedh Ghat Rd, Ghats of Varanasi, Varanasi, Uttar Pradesh 221001',
    contact: '+91 542 250 5033',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    description: 'Sacred riverfront famous for daily evening Ganga Aarti and morning boat journeys.',
    openingHours: 'Open 24 Hours (Aarti at 06:45 PM)',
    entryFee: 'Free Entry (Boats ₹150 - ₹400)',
    facilities: ['Life Jacket Stations', 'River Police Post', 'Seating Benches', 'Lighting'],
    safetyRating: 4.6,
    openStatus: 'Open Now',
    distanceKm: 0.3
  },

  // Emergency & Police
  {
    id: 'poi-police-tourist-agra',
    name: 'Agra Tourist Police Station & Rapid Assistance',
    category: 'police',
    coordinates: [27.1712, 78.0389],
    rating: 4.8,
    address: 'Taj East Gate Road, Tajganj, Agra, UP 282001',
    contact: '1363 / +91 562 242 1204',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    description: 'Dedicated 24x7 Tourist Police Unit offering multi-lingual assistance, dispute resolution, and lost property tracing.',
    openingHours: 'Open 24/7',
    facilities: ['Multilingual Translators', 'Women Help Desk', 'FIR Assistance', 'Emergency SOS Response Team'],
    safetyRating: 5.0,
    openStatus: 'Open 24/7',
    distanceKm: 0.5
  },
  {
    id: 'poi-police-jaipur',
    name: 'Jaipur Tourist Police Post (Hawa Mahal)',
    category: 'police',
    coordinates: [26.9240, 75.8267],
    rating: 4.9,
    address: 'Badi Choupad, Pink City, Jaipur, Rajasthan 302002',
    contact: '+91 141 261 4768 / 112',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    description: 'Direct response patrol for heritage pink city quarter. Equipped with rapid motorcycle interceptors.',
    openingHours: 'Open 24/7',
    facilities: ['First Responder Unit', 'Tourist Dispute Resolution', 'City Patrol Desk'],
    safetyRating: 4.9,
    openStatus: 'Open 24/7',
    distanceKm: 1.1
  },

  // Hospitals & Medical
  {
    id: 'poi-hospital-sn-agra',
    name: 'S.N. Medical College & Emergency Trauma Center',
    category: 'hospital',
    coordinates: [27.1852, 78.0084],
    rating: 4.6,
    address: 'Hospital Road, Moti Katra, Agra, Uttar Pradesh 282003',
    contact: '108 / +91 562 226 0353',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    description: 'Top multi-speciality tertiary care center with 24x7 ICU, burn unit, and international patient desk.',
    openingHours: 'Open 24/7 Emergency',
    facilities: ['24x7 Emergency Trauma Care', 'Blood Bank', 'Pharmacy', 'Ambulance Dispatch', 'English-speaking Doctors'],
    safetyRating: 4.9,
    openStatus: 'Open 24/7',
    distanceKm: 3.4
  },
  {
    id: 'poi-hospital-sms-jaipur',
    name: 'SMS Hospital & Medical Institute',
    category: 'hospital',
    coordinates: [26.8966, 75.8157],
    rating: 4.7,
    address: 'Jawahar Lal Nehru Marg, Ashok Nagar, Jaipur, Rajasthan 302004',
    contact: '108 / +91 141 251 8380',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
    description: 'Premier government hospital in Rajasthan equipped with advanced trauma center and helipad.',
    openingHours: 'Open 24/7 Emergency',
    facilities: ['Advanced Trauma', 'Foreign Tourist Liaison', '24x7 Diagnostics', 'Emergency ICU'],
    safetyRating: 4.9,
    openStatus: 'Open 24/7',
    distanceKm: 2.8
  },

  // Verified Hotels
  {
    id: 'poi-hotel-oberoi-agra',
    name: 'The Oberoi Amarvilas (✓ SafarSetu Verified)',
    category: 'hotel',
    coordinates: [27.1689, 78.0494],
    rating: 4.95,
    address: 'Taj East Gate Rd, Paktola, Tajganj, Agra, Uttar Pradesh 282001',
    contact: '+91 562 223 1515',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-luxury resort located only 600m from the Taj Mahal. Unobstructed monument views from all rooms.',
    openingHours: '24 Hours Check-in',
    entryFee: 'From ₹28,000 / night',
    facilities: ['Private Buggy to Taj Gate', '24x7 Security & Concierge', 'Doctor on Call', 'Spa & Fine Dining'],
    safetyRating: 5.0,
    openStatus: 'Verified & Open',
    distanceKm: 0.6
  },
  {
    id: 'poi-hotel-itc-mughal',
    name: 'ITC Mughal Luxury Heritage Hotel',
    category: 'hotel',
    coordinates: [27.1592, 78.0381],
    rating: 4.8,
    address: 'Fatehabad Rd, Tajganj, Agra, Uttar Pradesh 282001',
    contact: '+91 562 402 1700',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    description: 'Sprawling 35-acre Mughal-inspired luxury hotel with world-class Kaya Kalp spa and verified safety certification.',
    openingHours: '24 Hours Check-in',
    entryFee: 'From ₹9,500 / night',
    facilities: ['High-level Security Scan', 'Verified Taxi Desk', 'Swimming Pool', 'Green Certified'],
    safetyRating: 4.9,
    openStatus: 'Verified & Open',
    distanceKm: 1.9
  },

  // Transport Hubs
  {
    id: 'poi-transport-agra-cantt',
    name: 'Agra Cantt Railway Station (Pre-paid Taxi Booth)',
    category: 'transport',
    coordinates: [27.1587, 77.9947],
    rating: 4.5,
    address: 'Idgah Colony, Agra, Uttar Pradesh 282001',
    contact: '+91 562 242 1222',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    description: 'Major railway junction for Vande Bharat and Gatimaan Express with Govt-monitored Prepaid Taxi and Tourist Police booth.',
    openingHours: 'Open 24/7',
    facilities: ['Prepaid Auto & Taxi Booth', 'Executive Lounge', 'Tourist Information Desk', 'Cloakroom'],
    safetyRating: 4.7,
    openStatus: 'Open 24/7',
    distanceKm: 4.8
  },
  {
    id: 'poi-transport-jaipur-metro',
    name: 'Chandpole Metro Station & Transit Hub',
    category: 'transport',
    coordinates: [26.9272, 75.8078],
    rating: 4.6,
    address: 'Chandpole, Pink City, Jaipur, Rajasthan 302001',
    contact: '+91 141 282 2222',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    description: 'Safe underground rapid metro station connecting directly to Jaipur Railway Station and Central Markets.',
    openingHours: '06:00 AM – 10:30 PM',
    facilities: ['CCTV Surveillance', 'CISF Security Checks', 'Smart Card Passes', 'Elevator Access'],
    safetyRating: 4.9,
    openStatus: 'Open Now',
    distanceKm: 2.1
  }
];

export const SAFETY_ZONES_DATA: SafetyZone[] = [
  {
    id: 'zone-taj-perimeter',
    name: 'Taj Mahal Protected Heritage Corridor',
    type: 'safe',
    center: [27.1751, 78.0421],
    polygon: [
      [27.1795, 78.0370],
      [27.1795, 78.0475],
      [27.1700, 78.0475],
      [27.1700, 78.0370]
    ],
    description: 'Strict non-motorized vehicle zone with constant CISF and UP Tourist Police surveillance. Zero vehicular pollution area.',
    activeAdvisory: 'Safe & monitored. Battery vehicles available freely between Shilpgram and Taj Gates.',
    touristCount: 3420,
    lastUpdated: '10 mins ago'
  },
  {
    id: 'zone-fatehabad-traffic',
    name: 'Fatehabad Road Commercial Strip',
    type: 'caution',
    center: [27.1590, 78.0350],
    polygon: [
      [27.1640, 78.0280],
      [27.1640, 78.0420],
      [27.1540, 78.0420],
      [27.1540, 78.0280]
    ],
    description: 'Heavy evening tourist traffic and construction near metro phase-2 corridor.',
    activeAdvisory: '⚠️ Caution Alert: High traffic density reported between 05:00 PM and 08:30 PM. Use Inner Ring Road bypass for quicker travel.',
    touristCount: 1850,
    lastUpdated: '25 mins ago'
  },
  {
    id: 'zone-yamuna-riverbed-isolated',
    name: 'Yamuna North Riverbed (Unlit Sandbar Area)',
    type: 'danger',
    center: [27.1810, 78.0460],
    polygon: [
      [27.1840, 78.0430],
      [27.1840, 78.0490],
      [27.1780, 78.0490],
      [27.1780, 78.0430]
    ],
    description: 'Unlit natural river sandbar with dangerous water currents. Entry prohibited after 06:00 PM.',
    activeAdvisory: '⛔ Danger Zone: Do not walk into riverbed without authorized boat escort. Strict restriction after dark.',
    touristCount: 12,
    lastUpdated: '5 mins ago'
  }
];

export const SAFETY_ALERTS_DATA: SafetyAlert[] = [
  {
    id: 'alert-101',
    type: 'caution',
    title: 'High Crowd Density at Dashashwamedh Ghat',
    description: 'Heavy evening gathering anticipated for Special Ganga Aarti. Police crowd management active.',
    location: 'Varanasi Riverfront',
    timestamp: '15 minutes ago',
    alternativeRoute: 'Use Chet Singh Ghat or Scindia Ghat for serene viewing and less congested boat boarding.',
    severity: 'medium',
    isActive: true
  },
  {
    id: 'alert-102',
    type: 'info',
    title: 'New Electric Shuttle Corridor Activated in Jaipur',
    description: 'Eco-friendly electric rickshaws available for ₹10 fixed fare across Pink City Heritage Loop (Hawa Mahal ↔ City Palace ↔ Jantar Mantar).',
    location: 'Jaipur Walled City',
    timestamp: '1 hour ago',
    severity: 'low',
    isActive: true
  },
  {
    id: 'alert-103',
    type: 'danger',
    title: 'Monsoon Flash Surge Warning on Mountain Ghat Trails',
    description: 'Intermittent heavy rain causing slippery rock trails near Top Station viewpoints in Munnar.',
    location: 'Munnar High Ranges, Kerala',
    timestamp: '2 hours ago',
    alternativeRoute: 'Stick to paved national park roads; avoid venturing into unmarked waterfall ravines.',
    severity: 'high',
    isActive: true
  }
];

export const EMERGENCY_NUMBERS = [
  { service: 'National Emergency SOS', number: '112', description: 'Single emergency number for Police, Fire, and Ambulance across India' },
  { service: 'Incredible India Tourist Helpline', number: '1363 / 1800 11 1363', description: '24x7 Toll-Free Multilingual Support (English, Hindi, French, Spanish, German, etc.)' },
  { service: 'Women Safety Helpline', number: '1090', description: 'Dedicated assistance and rapid response for female travelers' },
  { service: 'Medical & Ambulance Dispatch', number: '108', description: 'Emergency medical response and hospital triage' },
  { service: 'Railway Passenger Security', number: '139', description: 'Immediate assistance on Indian Railways trains and stations' },
  { service: 'Disaster Management NDRF', number: '1078', description: 'National Disaster Response and weather evacuation support' }
];
