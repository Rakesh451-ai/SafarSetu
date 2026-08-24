import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  PhoneCall,
  RotateCw,
  Clock,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  User,
  Activity,
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DigitalIDView: React.FC = () => {
  const { user, updateUser, setQrScannerOpen, showToast } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRel, setContactRel] = useState('Family / Friend');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleDownloadID = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast({
      title: 'Digital ID Pass Downloaded',
      message: 'Cryptographically signed offline PDF saved to device.',
      type: 'success',
    });
  };

  const handleShareID = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SafarSetu Verified Digital Tourist ID',
        text: `Verified Tourist ID for ${user.name} (${user.id}) issued by Ministry of Tourism & Police.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`https://safarsetu.gov.in/verify/${user.id}`);
      showToast({
        title: 'Verification Link Copied',
        message: 'Shareable cryptographic verification link copied to clipboard.',
        type: 'success',
      });
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    const newContact = {
      name: contactName,
      phone: contactPhone,
      relationship: contactRel,
      email: '',
      isPrimary: false,
    };
    updateUser({
      emergencyContacts: [...user.emergencyContacts, newContact],
    });
    setContactName('');
    setContactPhone('');
    setIsEditingContacts(false);
    showToast({
      title: 'Emergency Contact Added',
      message: `${newContact.name} will be notified in case of missed check-ins or SOS.`,
      type: 'success',
    });
  };

  const handleDeleteContact = (index: number) => {
    const updated = user.emergencyContacts.filter((_, i) => i !== index);
    updateUser({ emergencyContacts: updated });
    showToast({
      title: 'Contact Removed',
      message: 'Emergency contact list updated.',
      type: 'info',
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Govt of India Verified
            </span>
            <span className="text-xs text-slate-400 font-mono">{user.id}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
            Digital Tourist Identity Card
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unified digital identification, contactless monument entry pass, and emergency safety telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsFlipped(prev => !prev)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>

          <button
            onClick={() => setQrScannerOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-safar-teal-50 dark:bg-safar-teal-950/40 hover:bg-safar-teal-100 text-safar-teal-700 dark:text-safar-teal-300 flex items-center gap-1.5 transition-colors border border-safar-teal-500/30"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Location QR</span>
          </button>

          <button
            onClick={handleDownloadID}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white flex items-center gap-1.5 shadow-md shadow-safar-saffron-500/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Pass</span>
          </button>

          <button
            onClick={handleShareID}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Share Verification Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: 3D Flip Card + Key Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 cols: 3D Flipping Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="perspective-1000 w-full max-w-lg cursor-pointer" onClick={() => setIsFlipped(prev => !prev)}>
            <div
              className={`relative w-full aspect-[1.62/1] rounded-3xl transition-transform duration-700 transform-style-3d shadow-2xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-safar-navy-950 via-slate-900 to-safar-navy-900 text-white p-6 sm:p-7 border border-slate-700/80 flex flex-col justify-between overflow-hidden shadow-glass-dark">
                {/* Background watermarks */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-safar-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-safar-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Top Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-safar-saffron-500 to-amber-400 flex items-center justify-center text-white shadow-md">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-safar-saffron-400 leading-none">
                        REPUBLIC OF INDIA • SAFARSETU
                      </div>
                      <div className="font-display font-black text-base text-white tracking-wide mt-0.5">
                        DIGITAL TOURIST PASS
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified
                  </div>
                </div>

                {/* Card Center: Photo, Name, ID, QR */}
                <div className="flex items-center justify-between gap-4 my-auto relative z-10">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-safar-saffron-500/50 shadow-md"
                    />
                    <div>
                      <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                        {user.name}
                      </h3>
                      <div className="font-mono text-xs text-safar-teal-300 font-semibold tracking-wider">
                        {user.id}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Nationality: <strong className="text-white">{user.nationality}</strong>
                      </div>
                      <div className="text-xs text-slate-300">
                        Blood Group: <strong className="text-rose-300">{user.bloodGroup}</strong>
                      </div>
                    </div>
                  </div>

                  {/* QR code box */}
                  <div className="bg-white p-2 rounded-2xl shadow-lg shrink-0 flex flex-col items-center">
                    <img
                      src={user.qrCodeUrl}
                      alt="Digital Tourist QR"
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                    <span className="text-[8px] font-mono font-bold text-slate-900 mt-0.5 uppercase">SCAN AT GATE</span>
                  </div>
                </div>

                {/* Card Bottom: Validity & Security chip */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-3 relative z-10">
                  <div>
                    <span>VALID THROUGH: </span>
                    <strong className="text-white font-mono">{user.currentTrip.endDate}</strong>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Lock className="w-3 h-3 text-safar-teal-400" />
                    <span className="font-mono">256-BIT ENCRYPTED</span>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-slate-900 text-white p-6 sm:p-7 border border-slate-700 flex flex-col justify-between overflow-hidden shadow-glass-dark">
                {/* Magnetic Strip Header */}
                <div className="h-9 bg-slate-950 -mx-7 -mt-7 mb-3 border-b border-slate-800 flex items-center justify-end px-6">
                  <span className="text-[9px] font-mono tracking-widest text-slate-500">MINISTRY OF TOURISM • GOVT OF INDIA</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Emergency Next of Kin:</span>
                    <div className="font-semibold text-white mt-0.5 flex items-center justify-between">
                      <span>{user.emergencyContacts[0]?.name} ({user.emergencyContacts[0]?.relationship})</span>
                      <span className="font-mono text-safar-teal-300">{user.emergencyContacts[0]?.phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Document Verification:</span>
                    <div className="font-mono text-[11px] text-slate-300">
                      Aadhaar / ID Hash: {user.aadhaarHash}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Medical Notes:</span>
                    <p className="text-[11px] text-slate-300 italic">{user.medicalNotes}</p>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>Authorized for National ASI Monuments & Transit</span>
                  <span className="font-mono">P-ID: 8849-2026</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-safar-saffron-500 animate-spin-slow" />
            <span>Click or tap card to flip & view emergency details</span>
          </p>
        </div>

        {/* Right 5 cols: Quick Management Panels */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Emergency Contacts Panel */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Emergency Contacts</h3>
              </div>
              <button
                onClick={() => setIsEditingContacts(prev => !prev)}
                className="text-xs font-semibold text-safar-saffron-600 dark:text-safar-saffron-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEditingContacts ? 'Cancel' : 'Add Contact'}</span>
              </button>
            </div>

            {/* List of contacts */}
            <div className="space-y-2.5">
              {user.emergencyContacts.map((contact, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{contact.name}</span>
                      {contact.isPrimary && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-safar-teal-500/10 text-safar-teal-600 dark:text-safar-teal-400">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {contact.relationship} • <span className="font-mono font-medium">{contact.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contact.phone}`}
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                      title="Call Contact"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                    </a>
                    {user.emergencyContacts.length > 1 && (
                      <button
                        onClick={() => handleDeleteContact(i)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Contact Form */}
            {isEditingContacts && (
              <form onSubmit={handleAddContact} className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 space-y-2.5 animate-slide-up">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Dr. Priya Sharma)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-safar-saffron-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (+91 98112 34567)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-safar-saffron-500"
                  required
                />
                <select
                  value={contactRel}
                  onChange={(e) => setContactRel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-safar-saffron-500"
                >
                  <option value="Family / Next of Kin">Family / Next of Kin</option>
                  <option value="Spouse / Partner">Spouse / Partner</option>
                  <option value="Travel Companion">Travel Companion</option>
                  <option value="Hotel / Guide Liaison">Hotel / Guide Liaison</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-2 bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  Save Emergency Contact
                </button>
              </form>
            )}
          </div>

          {/* Privacy & Safety Beacon Settings */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-safar-teal-500" />
              <span>Privacy & Geofence Beacon Settings</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Share Live Geofence with Police</span>
                <input
                  type="checkbox"
                  checked={user.privacySettings.shareLiveLocation}
                  onChange={(e) => updateUser({
                    privacySettings: { ...user.privacySettings, shareLiveLocation: e.target.checked }
                  })}
                  className="w-4 h-4 text-safar-teal-600 rounded border-slate-300 focus:ring-safar-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300">Auto-Alert on Missed Check-In</span>
                <input
                  type="checkbox"
                  checked={user.privacySettings.autoAlertOnMissedCheckIn}
                  onChange={(e) => updateUser({
                    privacySettings: { ...user.privacySettings, autoAlertOnMissedCheckIn: e.target.checked }
                  })}
                  className="w-4 h-4 text-safar-teal-600 rounded border-slate-300 focus:ring-safar-teal-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Journey History Timeline */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
              Verified Journey History & Checkpoints
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authenticated entry scans and geofence safety verifications along your route.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {user.journeyHistory.length} Checkpoints Logged
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {user.journeyHistory.map((item) => (
            <div key={item.id} className="relative flex items-start gap-4">
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-safar-saffron-500 border-4 border-white dark:border-slate-900 ring-2 ring-safar-saffron-500/30" />
              
              <div className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{item.location}</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item.status}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Checkpoint scan time: {item.timestamp}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Safety Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
