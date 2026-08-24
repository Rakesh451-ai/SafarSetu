import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../data/languagesData';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalView,
    login,
    register,
  } = useApp();

  const [view, setView] = useState<'login' | 'register'>(authModalView || 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLang, setRegLang] = useState('en');
  const [regEmergencyName, setRegEmergencyName] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regEmergencyRel, setRegEmergencyRel] = useState('Family / Next of Kin');

  // Sync modal view when opened with specific tab
  useEffect(() => {
    if (authModalView) {
      setView(authModalView);
      setErrorMessage(null);
    }
  }, [authModalView, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await login(loginEmail.trim(), loginPassword.trim());
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in your name, email, and a password (min 6 characters).');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const data: any = {
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone: regPhone.trim(),
        password: regPassword,
        preferred_language: regLang,
      };

      if (regEmergencyName.trim() && regEmergencyPhone.trim()) {
        data.emergency_contact = {
          name: regEmergencyName.trim(),
          phone: regEmergencyPhone.trim(),
          relationship: regEmergencyRel,
        };
      }

      const res = await register(data);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMessage(res.error || 'Registration failed. This email may already be in use.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (type: 'tourist' | 'admin' | 'foreign') => {
    if (type === 'tourist') {
      setLoginEmail('aarav.sharma@traveler.in');
      setLoginPassword('Tourist@12345');
    } else if (type === 'admin') {
      setLoginEmail('admin@safarsetu.gov.in');
      setLoginPassword('Admin@12345');
    } else if (type === 'foreign') {
      setLoginEmail('sophie.vdb@traveler.org');
      setLoginPassword('Tourist@12345');
    }
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-[#12355B] text-white px-6 pt-6 pb-5 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-[#F28C28] border border-orange-400/30 flex items-center justify-center font-bold text-base">
              स
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white">SafarSetu</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-orange-500/20 text-[#F28C28] border border-orange-400/30">
                  सफ़र सेतु
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Official Tourist ID & Safety Portal</p>
            </div>
          </div>

          {/* Switcher Tabs */}
          <div className="flex bg-slate-800/60 p-1 rounded-xl mt-4 border border-white/10">
            <button
              type="button"
              onClick={() => { setView('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                view === 'login'
                  ? 'bg-white text-[#12355B] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setView('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                view === 'register'
                  ? 'bg-white text-[#12355B] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* 1. SIGN IN VIEW */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Helper */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                <span className="font-semibold text-slate-600 block">⚡ Quick Demo Accounts:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('tourist')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[#12355B] font-medium"
                  >
                    Tourist (Aarav)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[#12355B] font-medium"
                  >
                    Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('foreign')}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-[#12355B] font-medium"
                  >
                    Foreign Tourist
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0E2845] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. CREATE ACCOUNT VIEW */}
          {view === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={regLang}
                      onChange={(e) => setRegLang(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#12355B] focus:bg-white"
                    >
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-semibold text-slate-700 block">
                  🛡️ Emergency Contact (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={regEmergencyName}
                    onChange={(e) => setRegEmergencyName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#12355B]"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone"
                    value={regEmergencyPhone}
                    onChange={(e) => setRegEmergencyPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#12355B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#12355B] hover:bg-[#0E2845] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#F28C28]" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Security Notice */}
          <div className="pt-2 text-center text-[10px] text-slate-400">
            Protected by SafarSetu Gov Security & 256-bit encryption.
          </div>

        </div>
      </div>
    </div>
  );
};
export default AuthModal;

