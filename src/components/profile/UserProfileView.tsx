import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  Globe,
  Save,
  LogOut,
  LogIn,
  KeyRound,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    user,
    authUser,
    isAuthenticated,
    openAuthModal,
    logout,
    updateUser,
    setLanguageModalOpen,
    setCurrentPage,
    showToast
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [medicalNotes, setMedicalNotes] = useState(user.medicalNotes || '');

  // Keep fields synchronized when user updates in context
  useEffect(() => {
    setName(user.name);
    setPhone(user.phone);
    setEmail(user.email);
    setBloodGroup(user.bloodGroup);
    setMedicalNotes(user.medicalNotes || '');
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      email,
      bloodGroup,
      medicalNotes,
    });
    setIsEditing(false);
    showToast({
      title: 'Profile Updated',
      message: 'Your personal information has been saved to your digital profile.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#172033]">
            Traveler Profile & Security
          </h1>
          <p className="text-xs text-slate-500">
            Official tourist credential details and emergency contact settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(prev => !prev)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#12355B] hover:bg-[#0E2845] shadow-sm transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth Status Card (if not logged in) */}
      {!isAuthenticated && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                Guest Mode
              </span>
              <h3 className="text-sm font-bold text-slate-900">Sign in to sync your verified credentials</h3>
            </div>
            <p className="text-xs text-slate-600">
              Unlock cloud sync, official emergency contacts dispatch, and automatic check-in tracking.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openAuthModal('login')}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#12355B] text-white text-xs font-bold hover:bg-[#0E2845] transition-all"
            >
              Continue with Google / Email
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="safar-card p-6 space-y-6 bg-white">
        
        {/* User Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#172033]">{user.name}</h2>
                {authUser?.role === 'ADMIN' && (
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#168A72] font-semibold">{user.id}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Ministry of Tourism Verified
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('digital_id')}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <QrCode className="w-3.5 h-3.5 text-[#F28C28]" />
            <span>View Digital ID</span>
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-85 focus:outline-none focus:border-[#12355B] focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Registered Phone</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-85 focus:outline-none focus:border-[#12355B] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
              <input
                type="text"
                disabled={!isEditing}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-85 focus:outline-none focus:border-[#12355B] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <input
              type="email"
              disabled={!isEditing}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-85 focus:outline-none focus:border-[#12355B] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Medical & Emergency Notes</label>
            <textarea
              rows={2}
              disabled={!isEditing}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder="e.g. Asthma inhaler, penicillin allergy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-85 focus:outline-none focus:border-[#12355B] focus:bg-white transition-all"
            />
          </div>

          {/* Emergency Contact Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 text-xs block">Primary Emergency Contact</span>
            <div className="text-slate-600 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-900">{user.emergencyContacts[0]?.name || 'Dr. Priya Sharma'}</span>
              <span>({user.emergencyContacts[0]?.relationship || 'Next of Kin'})</span>
              <span>•</span>
              <strong className="font-mono text-[#12355B]">{user.emergencyContacts[0]?.phone || '+91 98112 34567'}</strong>
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#12355B] text-white font-bold text-xs hover:bg-[#0E2845] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save & Synchronize Profile</span>
            </button>
          )}
        </form>
      </div>

      {/* Language Preference Card */}
      <div className="safar-card p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#168A72]" />
          <div>
            <span className="font-bold text-xs text-[#172033] block">Language Preference</span>
            <span className="text-[11px] text-slate-500">Audio guides and interface translation</span>
          </div>
        </div>

        <button
          onClick={() => setLanguageModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
        >
          Change
        </button>
      </div>

    </div>
  );
};

