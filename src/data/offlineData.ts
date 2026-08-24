import { OfflinePack } from '../types';

export const OFFLINE_PACKS_DATA: OfflinePack[] = [
  {
    id: 'pack-agra',
    destinationName: 'Agra & Golden Triangle Heritage Pack',
    state: 'Uttar Pradesh & Delhi',
    sizeMB: 84,
    isDownloaded: true,
    downloadProgress: 100,
    status: 'downloaded',
    itemsCount: {
      maps: 6,
      guides: 8,
      audioHours: 3.5,
      emergencyContacts: 24,
    }
  },
  {
    id: 'pack-jaipur',
    destinationName: 'Jaipur & Royal Forts Explorer Pack',
    state: 'Rajasthan',
    sizeMB: 112,
    isDownloaded: true,
    downloadProgress: 100,
    status: 'downloaded',
    itemsCount: {
      maps: 9,
      guides: 12,
      audioHours: 4.8,
      emergencyContacts: 30,
    }
  },
  {
    id: 'pack-varanasi',
    destinationName: 'Varanasi Sacred Riverfront & Sarnath',
    state: 'Uttar Pradesh',
    sizeMB: 68,
    isDownloaded: false,
    downloadProgress: 45,
    status: 'downloading',
    itemsCount: {
      maps: 4,
      guides: 6,
      audioHours: 2.9,
      emergencyContacts: 18,
    }
  },
  {
    id: 'pack-kerala',
    destinationName: 'Munnar, Thekkady & Backwaters Eco-Pack',
    state: 'Kerala',
    sizeMB: 96,
    isDownloaded: false,
    downloadProgress: 0,
    status: 'online_only',
    itemsCount: {
      maps: 8,
      guides: 10,
      audioHours: 4.1,
      emergencyContacts: 22,
    }
  },
  {
    id: 'pack-hampi',
    destinationName: 'Hampi & Vijayanagara Heritage Circuit',
    state: 'Karnataka',
    sizeMB: 75,
    isDownloaded: false,
    downloadProgress: 0,
    status: 'online_only',
    itemsCount: {
      maps: 5,
      guides: 7,
      audioHours: 3.2,
      emergencyContacts: 16,
    }
  }
];
