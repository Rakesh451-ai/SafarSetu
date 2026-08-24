import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_SERVICES_DATA } from '../../data/servicesData';
import { VerifiedService } from '../../types';
import {
  Store,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  Lock,
  PhoneCall,
  Calendar,
  Sparkles,
  Ticket,
  Car,
  Building,
  Users,
  Compass,
  ArrowRight,
  Filter,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VerifiedMarketplaceView: React.FC = () => {
  const { showToast, setCurrentPage } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<VerifiedService | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-08-26');
  const [guestsCount, setGuestsCount] = useState<number>(2);

  const filteredServices = VERIFIED_SERVICES_DATA.filter((srv) => {
    if (activeFilter === 'all') return true;
    return srv.type === activeFilter;
  });

  const handleBookNow = (service: VerifiedService) => {
    setSelectedService(service);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast({
      title: '✓ Booking Confirmed & Verified Pass Issued',
      message: `${selectedService.title} pass added to your Digital Tourist ID!`,
      type: 'success',
    });

    setSelectedService(null);
  };

  const filterTabs = [
    { id: 'all', label: 'All Verified Services', icon: Store },
    { id: 'guide', label: 'Certified Historians & Guides', icon: Users },
    { id: 'hotel', label: 'Heritage Stays & Havelis', icon: Building },
    { id: 'transport', label: 'Prepaid Electric Fleets', icon: Car },
    { id: 'ticket', label: 'Official Monument Passes', icon: Ticket },
    { id: 'experience', label: 'Cultural Experiences', icon: Compass },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Background Verified Providers
            </span>
            <span className="text-xs text-slate-400">Zero Hidden Charges Guarantee</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-950 dark:text-white mt-1">
            Verified Tourism Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Govt-certified guides, police-monitored electric transport, and official ASI monument fast-track passes.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <Lock className="w-4 h-4 text-safar-teal-500" />
          <span className="text-slate-600 dark:text-slate-300">
            All prices include taxes & govt verification insurance.
          </span>
        </div>
      </div>

      {/* Filter Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
                isSelected
                  ? 'bg-safar-navy-900 text-white dark:bg-safar-saffron-500 shadow-md scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Verified Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Location */}
              <div className="absolute bottom-3 inset-x-3 text-white text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-safar-saffron-400" />
                <span className="truncate">{service.location}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-safar-teal-600 dark:text-safar-teal-400 truncate">
                    {service.provider}
                  </span>
                  <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{service.rating} ({service.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-slate-950 dark:text-white leading-snug group-hover:text-safar-saffron-500 transition-colors">
                  {service.title}
                </h3>

                {/* Facilities Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {service.facilities.slice(0, 3).map((f, fi) => (
                    <span key={fi} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Total Cost (No Hidden Fees)</div>
                  <div className="font-display font-black text-lg text-slate-900 dark:text-white">
                    ₹{service.price.toLocaleString()}{' '}
                    <span className="text-[10px] font-normal text-slate-400 block -mt-1">{service.priceUnit}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookNow(service)}
                  className="px-4 py-2.5 rounded-xl bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white font-bold text-xs shadow-md shadow-safar-saffron-500/20 transition-all flex items-center gap-1.5 hover:scale-105"
                >
                  <span>Book Now</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Confirmation Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-900 dark:text-white shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  {selectedService.badge}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mt-1">
                  Confirm Verified Booking
                </h3>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="font-bold text-sm text-slate-900 dark:text-white">{selectedService.title}</div>
              <div className="text-slate-500 dark:text-slate-400">License: {selectedService.licenseNumber}</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedService.cancellationPolicy}</div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Select Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Rate:</span>
                  <span>₹{selectedService.price}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST & Tourist Safety Insurance:</span>
                  <span>₹0 (Included)</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span>Total Payable:</span>
                  <span className="text-safar-teal-600 dark:text-safar-teal-400">₹{selectedService.price}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-safar-saffron-500 hover:bg-safar-saffron-600 text-white shadow-md shadow-safar-saffron-500/20"
                >
                  Confirm & Issue Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
