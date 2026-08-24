import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Heart,
  Globe,
  Lock,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  QrCode
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateUser, setLanguageModalOpen, setCurrentPage, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);
  const [medicalNotes, setMedicalNotes] = useState(user.medicalNotes);

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
      message: 'Your personal information & emergency telemetry updated.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Verified Tourist Account
            </span>
            <span className="text-xs text-slate-400 font-mono">{user.id}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            Traveler Profile & Safety Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your digital passport link, emergency contacts, medical records, and privacy preferences.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(prev => !prev)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Edit2 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* User Info Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-safar-teal-500/30 shadow-lg"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">{user.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Ministry Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Digital Tourist ID: {user.id}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-safar-saffron-500" /> {user.nationality}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5 text-safar-teal-500" /> {user.phone}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-indigo-500" /> {user.email}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage('digital_id')}
            className="px-4 py-2.5 rounded-xl bg-safar-navy-900 dark:bg-safar-saffron-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>View Digital ID</span>
          </button>
        </div>

        {/* Edit / Details Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-safar-saffron-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number (with country code)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-safar-saffron-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-safar-saffron-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Blood Group (Medical Triage)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-safar-saffron-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Emergency Medical Notes & Allergies</label>
              <textarea
                rows={2}
                disabled={!isEditing}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white disabled:opacity-75 focus:outline-none focus:border-safar-saffron-500"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs shadow-md"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Language & Preference Quick Launch */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-safar-teal-500" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Multilingual Platform Preferences</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Audio narration and text translation in 10 Indian languages</p>
          </div>
        </div>

        <button
          onClick={() => setLanguageModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-200"
        >
          Change Language
        </button>
      </div>

    </div>
  );
};
