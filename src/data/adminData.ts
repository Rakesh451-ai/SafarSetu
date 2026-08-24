import { AdminStats, AdminIncident } from '../types';

export const ADMIN_STATS_DATA: AdminStats = {
  activeTourists: 14820,
  inTransit: 8410,
  activeAlerts: 3,
  openSOS: 2,
  missedCheckins: 5,
  avgResponseTimeMinutes: 4.2,
  highRiskZonesCount: 4,
};

export const ADMIN_INCIDENTS_DATA: AdminIncident[] = [
  {
    id: 'INC-2026-089',
    touristId: 'SS-IND-2026-8849',
    touristName: 'Aarav Sharma',
    nationality: 'Indian',
    location: 'Near Shilpgram Parking, Agra East Gate',
    coordinates: [27.1712, 78.0460],
    time: '4 mins ago',
    type: 'SOS Emergency',
    status: 'responding',
    priority: 'critical',
    assignedOfficer: 'Insp. Vikram Pratap (UP Tourist Police - Unit 4)',
    batteryLevel: 68,
    responderNotes: 'Patrol vehicle Bravo-2 dispatched from East Gate Post. ETA 2 minutes. Direct audio line open.'
  },
  {
    id: 'INC-2026-088',
    touristId: 'SS-INT-2026-3104',
    touristName: 'Sophie Van Der Berg',
    nationality: 'Netherlands',
    location: 'Godowlia Chowk crossing, Varanasi',
    coordinates: [25.3080, 83.0065],
    time: '18 mins ago',
    type: 'Medical Distress',
    status: 'acknowledged',
    priority: 'high',
    assignedOfficer: 'Dr. S. K. Pandey (EMRI Ambulance 108)',
    batteryLevel: 42,
    responderNotes: 'Tourist reported acute dehydration and heat exhaustion. First responder bike paramedic en route.'
  },
  {
    id: 'INC-2026-087',
    touristId: 'SS-INT-2026-9021',
    touristName: 'Marcus Miller',
    nationality: 'Germany',
    location: 'Nahargarh Stepwell trail, Jaipur',
    coordinates: [26.9374, 75.8155],
    time: '36 mins ago',
    type: 'Missed Check-In',
    status: 'new',
    priority: 'medium',
    assignedOfficer: 'Jaipur Command Dispatch',
    batteryLevel: 19,
    responderNotes: 'Check-in overdue by 36 mins. Primary emergency contact notified via automated SMS. Cell ping active.'
  },
  {
    id: 'INC-2026-086',
    touristId: 'SS-IND-2026-1142',
    touristName: 'Divya & Rajesh Nair',
    nationality: 'Indian',
    location: 'Amber Fort Elephant Ramp',
    coordinates: [26.9855, 75.8513],
    time: '2 hours ago',
    type: 'Lost Item / Dispute',
    status: 'resolved',
    priority: 'medium',
    assignedOfficer: 'ASI Guard Post Amer',
    batteryLevel: 85,
    responderNotes: 'Bag containing passport recovered from cloakroom locker #14 and returned to tourist after biometric verification.'
  }
];

export const TOURIST_STREAM_DATA = [
  { id: 'SS-01', name: 'Aarav Sharma', destination: 'Agra Heritage Corridor', status: 'Safe', battery: 68, checkin: '12m ago', risk: 'Low' },
  { id: 'SS-02', name: 'Sophie Van Der Berg', destination: 'Varanasi Ghats', status: 'Medical Assist', battery: 42, checkin: 'Just now', risk: 'Elevated' },
  { id: 'SS-03', name: 'Marcus Miller', destination: 'Jaipur Hills', status: 'Overdue Check-in', battery: 19, checkin: '36m ago', risk: 'Attention' },
  { id: 'SS-04', name: 'Elena Rostova', destination: 'Taj Mahal Complex', status: 'Safe', battery: 91, checkin: '5m ago', risk: 'Low' },
  { id: 'SS-05', name: 'Karthik Ramanathan', destination: 'Hampi Vittala', status: 'Safe', battery: 84, checkin: '8m ago', risk: 'Low' },
  { id: 'SS-06', name: 'Zoe & Lucas Martin', destination: 'Munnar High Ranges', status: 'Safe', battery: 77, checkin: '14m ago', risk: 'Low' },
];
