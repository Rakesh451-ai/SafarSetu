import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Globe,
  Edit2,
  Save
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateUser, setLanguageModalOpen, setCurrentPage, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      email,
      bloodGroup,
    });
    setIsEditing(false);
    showToast({
      title: 'Profile Updated',
      message: 'Your personal information has been saved.',
      type: 'success',
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#172033]">
            Traveler Profile
          </h1>
          <p className="text-xs text-slate-500">
            Personal details and emergency contact settings.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(prev => !prev)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="safar-card p-6 space-y-5 bg-white">
        
        {/* User Top Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
          />
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-[#172033]">{user.name}</h2>
            <p className="text-xs font-mono text-[#168A72] font-semibold">{user.id}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Ministry Verified
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              disabled={!isEditing}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-75 focus:outline-none focus:border-[#12355B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-75 focus:outline-none focus:border-[#12355B]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
              <input
                type="text"
                disabled={!isEditing}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-75 focus:outline-none focus:border-[#12355B]"
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
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 disabled:opacity-75 focus:outline-none focus:border-[#12355B]"
            />
          </div>

          {/* Emergency Contact Preview */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-700 block">Emergency Contact</span>
            <p className="text-slate-600">
              {user.emergencyContacts[0]?.name} ({user.emergencyContacts[0]?.relationship}) • <strong className="font-mono text-[#12355B]">{user.emergencyContacts[0]?.phone}</strong>
            </p>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#12355B] text-white font-bold text-xs hover:bg-[#0E2845] transition-colors"
            >
              Save Profile
            </button>
          )}
        </form>
      </div>

      {/* Language Settings Link */}
      <div className="safar-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#168A72]" />
          <div>
            <span className="font-bold text-xs text-[#172033] block">Language Preference</span>
            <span className="text-[11px] text-slate-500">Audio guides and interface translation</span>
          </div>
        </div>

        <button
          onClick={() => setLanguageModalOpen(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700"
        >
          Change
        </button>
      </div>

    </div>
  );
};
