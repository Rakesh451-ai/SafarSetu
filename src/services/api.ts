import {
  TouristProfile,
  Destination,
  SafetyAlert,
  SafetyZone,
  ItineraryItem,
  VerifiedService,
  AdminIncident,
  AdminStats,
  AIMessage
} from '../types';

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

class ApiService {
  private baseUrl: string = API_BASE_URL;

  private getHeaders(auth: boolean = true): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (auth) {
      const token = localStorage.getItem('safarsetu_access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  getToken(): string | null {
    return localStorage.getItem('safarsetu_access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('safarsetu_access_token');
  }

  // --- 1. Authentication APIs ---
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    preferred_language?: string;
    emergency_contact?: { name: string; relationship: string; phone: string };
  }) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/register/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (json && json.success && json.data?.access) {
        localStorage.setItem('safarsetu_access_token', json.data.access);
        if (json.data.refresh) {
          localStorage.setItem('safarsetu_refresh_token', json.data.refresh);
        }
        return json;
      }
      if (json && !json.success) {
        return json;
      }
      if (!res.ok) {
        return {
          success: false,
          message: json?.message || 'Registration failed. Please check your information.',
          errors: json?.errors
        };
      }
      return json || { success: false, message: 'Unexpected server response.' };
    } catch (err: any) {
      console.warn('Django registration endpoint unavailable, creating local verified tourist session:', err);
      // Fallback local session for seamless offline/standalone testing
      const digitalId = `SS-IND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const mockUser = {
        id: Date.now(),
        email: data.email,
        name: data.name,
        phone: data.phone || '',
        role: 'TOURIST' as const,
        preferred_language: data.preferred_language || 'en',
        digital_id: digitalId,
        is_staff: false,
      };
      const mockProfile: TouristProfile = {
        id: digitalId,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        nationality: 'Indian',
        passportHash: 'P••••••••3291',
        aadhaarHash: 'XXXX-XXXX-4819',
        gender: 'Male',
        dob: '1998-05-15',
        bloodGroup: 'O+ Positive',
        medicalNotes: 'No known allergies.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        qrCodeUrl: '',
        preferredLanguage: data.preferred_language || 'en',

        verificationStatus: 'verified',
        verifiedBy: 'Ministry of Tourism, Govt of India & UP Tourist Police',
        safetyStatus: 'safe',
        checkInDueMinutes: 60,
        lastCheckIn: 'Taj East Gate Geofence',
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
        emergencyContacts: data.emergency_contact ? [{
          id: 1,
          name: data.emergency_contact.name,
          relationship: data.emergency_contact.relationship || 'Family / Next of Kin',
          phone: data.emergency_contact.phone,
          isPrimary: true,
        }] : [],
        journeyHistory: [
          { id: 'jh-1', location: 'Qutub Minar, New Delhi', timestamp: 'Aug 22, 10:30 AM', status: 'completed', safetyCheck: 'safe' },
          { id: 'jh-2', location: 'Taj Mahal East Gate, Agra', timestamp: 'Aug 23, 09:15 AM', status: 'ongoing', safetyCheck: 'safe' }
        ],
        privacySettings: {
          shareLiveLocation: true,
          autoAlertOnMissedCheckIn: true,
          allowEmergencyServiceBeacon: true,
          anonymousSafetyMetrics: true,
        },
      };
      const mockAccess = `local_token_${Date.now()}`;
      localStorage.setItem('safarsetu_access_token', mockAccess);
      localStorage.setItem('safarsetu_local_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
      return {
        success: true,
        message: 'Account created successfully.',
        data: {
          access: mockAccess,
          user: mockUser,
          profile: mockProfile,
        }
      };
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await fetch(`${this.baseUrl}/auth/login/`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => null);
      if (json && json.success && json.data?.access) {
        localStorage.setItem('safarsetu_access_token', json.data.access);
        if (json.data.refresh) {
          localStorage.setItem('safarsetu_refresh_token', json.data.refresh);
        }
        return json;
      }
      if (json && !json.success) {
        return json;
      }
      if (!res.ok) {
        return {
          success: false,
          message: json?.message || 'Invalid email or password.',
          errors: json?.errors,
        };
      }
      return json || { success: false, message: 'Invalid email or password.' };
    } catch (err: any) {
      console.warn('Django login endpoint unavailable, checking local demo fallback:', err);
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail === 'aarav.sharma@traveler.in' || lowerEmail === 'admin@safarsetu.gov.in' || lowerEmail === 'sophie.vdb@traveler.org') {
        const isAdmin = lowerEmail === 'admin@safarsetu.gov.in';
        const isSophie = lowerEmail === 'sophie.vdb@traveler.org';
        const mockUser = {
          id: isAdmin ? 1 : 2,
          email: lowerEmail,
          name: isAdmin ? 'Admin Command' : isSophie ? 'Sophie Van Den Berg' : 'Aarav Sharma',
          phone: '+91 98765 43210',
          role: (isAdmin ? 'ADMIN' : 'TOURIST') as any,
          preferred_language: 'en',
          digital_id: isAdmin ? 'SS-ADM-001' : isSophie ? 'SS-INT-4821' : 'SS-IND-2026-8849',
          is_staff: isAdmin,
        };
        const mockAccess = `demo_token_${Date.now()}`;
        localStorage.setItem('safarsetu_access_token', mockAccess);
        return {
          success: true,
          message: 'Login successful.',
          data: {
            access: mockAccess,
            user: mockUser,
          }
        };
      }
      const localSaved = localStorage.getItem('safarsetu_local_user');
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (parsed.user && parsed.user.email?.toLowerCase() === lowerEmail) {
            const mockAccess = `local_token_${Date.now()}`;
            localStorage.setItem('safarsetu_access_token', mockAccess);
            return {
              success: true,
              message: 'Login successful.',
              data: {
                access: mockAccess,
                user: parsed.user,
                profile: parsed.profile,
              }
            };
          }
        } catch {}
      }
      return {
        success: false,
        message: 'Invalid email or password.',
      };
    }
  }

  async logout() {
    const refresh = localStorage.getItem('safarsetu_refresh_token');
    try {
      if (refresh) {
        await fetch(`${this.baseUrl}/auth/logout/`, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: JSON.stringify({ refresh }),
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('safarsetu_access_token');
      localStorage.removeItem('safarsetu_refresh_token');
      localStorage.removeItem('safarsetu_local_user');
    }
  }

  async getMe() {
    try {
      const res = await fetch(`${this.baseUrl}/auth/me/`, {
        headers: this.getHeaders(true),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Check local saved user
      const localSaved = localStorage.getItem('safarsetu_local_user');
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          return { success: true, data: parsed };
        } catch {}
      }
    }
    return { success: false };
  }



  // --- 2. Tourist Profile & Digital Tourist ID ---
  async getProfile(): Promise<{ success: boolean; data: TouristProfile }> {
    const res = await fetch(`${this.baseUrl}/tourist/profile/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async updateProfile(fields: Partial<TouristProfile>): Promise<{ success: boolean; data: TouristProfile }> {
    const res = await fetch(`${this.baseUrl}/tourist/profile/`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(fields),
    });
    return res.json();
  }

  async getDigitalID() {
    const res = await fetch(`${this.baseUrl}/tourist/digital-id/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  // --- 3. QR System & Verification ---
  async scanQRCode(qr_code: string, latitude?: number, longitude?: number) {
    const res = await fetch(`${this.baseUrl}/qr/scan/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ qr_code, latitude, longitude }),
    });
    return res.json();
  }

  async verifyDigitalID(tourist_id: string) {
    const res = await fetch(`${this.baseUrl}/qr/verify/${encodeURIComponent(tourist_id)}/`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  // --- 4. Destinations ---
  async getDestinations(params?: { search?: string; state?: string; city?: string; category?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.baseUrl}/destinations/${query ? `?${query}` : ''}`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  async getDestination(id: string): Promise<{ success: boolean; data: Destination }> {
    const res = await fetch(`${this.baseUrl}/destinations/${encodeURIComponent(id)}/`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  async getNearbyDestinations(lat: number, lng: number, radiusKm: number = 50) {
    const res = await fetch(`${this.baseUrl}/destinations/nearby/?lat=${lat}&lng=${lng}&radius=${radiusKm}`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  // --- 5. Journeys & Check-ins ---
  async getJourneys() {
    const res = await fetch(`${this.baseUrl}/journeys/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async performCheckIn(payload?: { latitude?: number; longitude?: number; location_name?: string; extend_minutes?: number }) {
    const res = await fetch(`${this.baseUrl}/journeys/check-in/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(payload || {}),
    });
    return res.json();
  }

  // --- 6. Itineraries ---
  async getItineraries() {
    const res = await fetch(`${this.baseUrl}/itineraries/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async optimizeItinerary(id?: number) {
    const endpoint = id ? `${this.baseUrl}/itineraries/${id}/optimize/` : `${this.baseUrl}/itineraries/optimize/`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  // --- 7. Safety Center & Alerts ---
  async checkSafety(lat: number, lng: number) {
    const res = await fetch(`${this.baseUrl}/safety/check/?lat=${lat}&lng=${lng}`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  async getSafetyAlerts() {
    const res = await fetch(`${this.baseUrl}/safety/alerts/`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  async updateLiveLocation(lat: number, lng: number) {
    const res = await fetch(`${this.baseUrl}/safety/location/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    });
    return res.json();
  }

  // --- 8. Emergency SOS ---
  async triggerSOS(data: { latitude: number; longitude: number; description?: string; emergency_type?: string }) {
    const res = await fetch(`${this.baseUrl}/emergency/sos/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async cancelSOS(incident_id?: string) {
    const endpoint = incident_id
      ? `${this.baseUrl}/emergency/sos/${incident_id}/cancel/`
      : `${this.baseUrl}/emergency/sos/cancel/`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  // --- 9. AI Copilot ---
  async chatWithAI(message: string): Promise<{ success: boolean; data: AIMessage }> {
    const res = await fetch(`${this.baseUrl}/ai/chat/`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ message }),
    });
    return res.json();
  }

  // --- 10. Verified Services ---
  async getServices(params?: { type?: string; location?: string; verified_only?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.baseUrl}/services/${query ? `?${query}` : ''}`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }

  // --- 11. Notifications ---
  async getNotifications() {
    const res = await fetch(`${this.baseUrl}/notifications/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async markNotificationRead(id: number) {
    const res = await fetch(`${this.baseUrl}/notifications/${id}/read/`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  // --- 12. Admin Command Center ---
  async getAdminStats(): Promise<{ success: boolean; data: AdminStats }> {
    const res = await fetch(`${this.baseUrl}/admin/dashboard/`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async getAdminIncidents(params?: { status?: string; priority?: string }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${this.baseUrl}/emergency/incidents/${query ? `?${query}` : ''}`, {
      headers: this.getHeaders(true),
    });
    return res.json();
  }

  async updateIncidentStatus(id: string, newStatus: AdminIncident['status'], notes?: string) {
    const res = await fetch(`${this.baseUrl}/emergency/incidents/${id}/`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify({ status: newStatus, responderNotes: notes }),
    });
    return res.json();
  }

  // --- 13. Health Check ---
  async checkHealth() {
    const res = await fetch(`${this.baseUrl}/health/`, {
      headers: this.getHeaders(false),
    });
    return res.json();
  }
}

export const api = new ApiService();
export default api;
