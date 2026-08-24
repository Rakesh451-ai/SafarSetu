import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ADMIN_STATS_DATA, ADMIN_INCIDENTS_DATA, TOURIST_STREAM_DATA } from '../../data/adminData';
import { SAFETY_ZONES_DATA } from '../../data/safetyData';
import { AdminIncident } from '../../types';
import {
  Activity,
  Users,
  ShieldAlert,
  Clock,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Filter,
  Send,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardView: React.FC = () => {
  const { showToast } = useApp();
  const [incidents, setIncidents] = useState<AdminIncident[]>(ADMIN_INCIDENTS_DATA);
  const [selectedIncident, setSelectedIncident] = useState<AdminIncident | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeAdminTab, setActiveAdminTab] = useState<'triage' | 'tourists' | 'zones' | 'analytics'>('triage');

  const touristFlowData = [
    { time: '06:00', tourists: 1200, safeScore: 98 },
    { time: '08:00', tourists: 3400, safeScore: 97 },
    { time: '10:00', tourists: 8900, safeScore: 94 },
    { time: '12:00', tourists: 12400, safeScore: 91 },
    { time: '14:00', tourists: 14820, safeScore: 89 },
    { time: '16:00', tourists: 13900, safeScore: 92 },
    { time: '18:00', tourists: 11200, safeScore: 95 },
    { time: '20:00', tourists: 5600, safeScore: 99 },
  ];

  const categoryIncidents = [
    { name: 'SOS Emergencies', value: 2, color: '#EF4444' },
    { name: 'Medical Distress', value: 1, color: '#F59E0B' },
    { name: 'Missed Check-in', value: 5, color: '#0D9488' },
    { name: 'Property / Dispute', value: 3, color: '#6366F1' },
  ];

  const handleUpdateStatus = (id: string, newStatus: AdminIncident['status']) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));

    showToast({
      title: 'Incident Status Updated',
      message: `Incident ${id} updated to status: ${newStatus.toUpperCase()}`,
      type: 'success',
    });
  };

  const filteredIncidents = incidents.filter(inc => {
    if (statusFilter === 'all') return true;
    return inc.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Law Enforcement & Tourism Authority Portal
            </span>
            <span className="text-xs text-slate-400">Northern Heritage Command</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            SafarSetu Command Center & Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time tourist telemetry, rapid SOS dispatch triage, and active geofence administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Telemetry System 100% Operational
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Tourists</span>
          <div className="font-display font-black text-2xl text-slate-900 dark:text-white mt-1">
            {ADMIN_STATS_DATA.activeTourists.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">+12% vs yesterday</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">In-Transit</span>
          <div className="font-display font-black text-2xl text-safar-teal-600 dark:text-safar-teal-400 mt-1">
            {ADMIN_STATS_DATA.inTransit.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">Live GPS Ping</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Alerts</span>
          <div className="font-display font-black text-2xl text-amber-500 mt-1">
            {ADMIN_STATS_DATA.activeAlerts}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">2 Caution, 1 Danger</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Open SOS Incidents</span>
          <div className="font-display font-black text-2xl text-rose-500 mt-1">
            {ADMIN_STATS_DATA.openSOS}
          </div>
          <span className="text-[10px] text-rose-500 font-bold animate-pulse">Patrol Dispatched</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Missed Check-Ins</span>
          <div className="font-display font-black text-2xl text-slate-800 dark:text-slate-200 mt-1">
            {ADMIN_STATS_DATA.missedCheckins}
          </div>
          <span className="text-[10px] text-slate-500">Escalation Phase 1</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Response Time</span>
          <div className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1">
            {ADMIN_STATS_DATA.avgResponseTimeMinutes}m
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Target &lt; 5 mins</span>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs sm:text-sm font-bold">
        {[
          { id: 'triage', label: 'Emergency Incident Triage' },
          { id: 'tourists', label: 'Live Tourist Monitoring Grid' },
          { id: 'zones', label: 'Safety Zones & Geofences' },
          { id: 'analytics', label: 'Command Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeAdminTab === tab.id
                ? 'bg-slate-900 text-white dark:bg-safar-saffron-500 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INCIDENT TRIAGE */}
      {activeAdminTab === 'triage' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Active Incident Pipeline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Incoming emergency requests, triage prioritization, and assigned response units
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {['all', 'new', 'acknowledged', 'responding', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      inc.status === 'responding'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : inc.status === 'acknowledged'
                        ? 'bg-amber-500 text-slate-950'
                        : inc.status === 'new'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}>
                      {inc.status}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {inc.type} — {inc.touristName} ({inc.touristId})
                    </h4>
                  </div>

                  <span className="text-xs text-slate-500 font-mono">{inc.time}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Location:</span> {inc.location}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Assigned Unit:</span> {inc.assignedOfficer}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Tourist Battery:</span> {inc.batteryLevel}%
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  Officer Log: {inc.responderNotes}
                </p>

                {/* Status Transitions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                  <button
                    onClick={() => handleUpdateStatus(inc.id, 'acknowledged')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(inc.id, 'responding')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                  >
                    Dispatch Unit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(inc.id, 'resolved')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE TOURIST MONITORING */}
      {activeAdminTab === 'tourists' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
              Live Tourist Telemetry Stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active tourists registered in northern heritage zone
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tourist ID & Name</th>
                  <th className="py-3 px-4">Current Sector</th>
                  <th className="py-3 px-4">Safety State</th>
                  <th className="py-3 px-4">Battery</th>
                  <th className="py-3 px-4">Last Check-In</th>
                  <th className="py-3 px-4">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {TOURIST_STREAM_DATA.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {t.name} <span className="text-[10px] font-mono text-slate-400 block font-normal">{t.id}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{t.destination}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'Safe' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{t.battery}%</td>
                    <td className="py-3.5 px-4 text-slate-500">{t.checkin}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-semibold ${t.risk === 'Low' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {t.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ZONES */}
      {activeAdminTab === 'zones' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white">
                Geofenced Safety Perimeters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure safe, caution, and hazard corridors
              </p>
            </div>
            <button
              onClick={() => showToast({ title: 'New Geofence Created', message: 'Custom sector drawn & synchronized with patrol cars.', type: 'success' })}
              className="px-3.5 py-2 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Zone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAFETY_ZONES_DATA.map((zone) => (
              <div key={zone.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    zone.type === 'safe' ? 'bg-emerald-500/10 text-emerald-600' : zone.type === 'caution' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {zone.type}
                  </span>
                  <span className="text-[10px] text-slate-400">{zone.lastUpdated}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{zone.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{zone.description}</p>
                <div className="text-xs font-semibold text-safar-teal-600 dark:text-safar-teal-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  {zone.touristCount} tourists currently in perimeter
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart 1: Hourly Inflow & Safety Index */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Hourly Tourist Inflow Density (Agra & Jaipur Sectors)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Peak rush observed between 11:00 AM and 03:00 PM</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={touristFlowData}>
                    <defs>
                      <linearGradient id="colorTourists" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="tourists" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTourists)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Category Breakdown */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  Incident Type Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active week distribution</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryIncidents} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={40}>
                      {categoryIncidents.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {categoryIncidents.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </span>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
