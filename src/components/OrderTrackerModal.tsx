import React, { useState } from 'react';
import { OrderTrackResult } from '../types';
import { INITIAL_TRACKING_ORDERS } from '../data/mockData';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, Package, ShieldCheck, ArrowRight } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [trackInput, setTrackInput] = useState('BB-KSA-9421');
  const [currentOrder, setCurrentOrder] = useState<OrderTrackResult | null>(
    INITIAL_TRACKING_ORDERS['BB-KSA-9421']
  );
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackInput.trim().toUpperCase();
    if (INITIAL_TRACKING_ORDERS[cleanId]) {
      setCurrentOrder(INITIAL_TRACKING_ORDERS[cleanId]);
    } else {
      // Fallback pseudo live tracking for any entered ID
      setCurrentOrder({
        trackingNumber: cleanId || 'BB-KSA-LIVE',
        clientName: 'Commercial Fleet Logistics',
        company: 'Saudi Enterprise Partner',
        item: 'Custom Fleet Fiberglass Delivery Boxes (Batch Production)',
        quantity: 50,
        destination: 'Riyadh Central Distribution Warehouse, KSA',
        status: 'Branding & Assembly',
        carrier: 'BagBox Dedicated Fleet',
        estimatedDelivery: '3 Days',
        steps: [
          { title: 'RFQ Approved & PO Received', date: 'Yesterday, 10:00 AM', completed: true, current: false, location: 'Bag & Box Riyadh Sales HQ' },
          { title: 'Gelcoat Fiberglass Molding & Resin Curing', date: 'Today, 08:30 AM', completed: true, current: false, location: 'Al Sulay Manufacturing Plant' },
          { title: 'Precision CNC Trimming & LED Assembly', date: 'In Progress', completed: true, current: true, location: 'Assembly Line 2' },
          { title: 'SASO Impact & Weather Seal Inspection', date: 'Pending', completed: false, current: false, location: 'Quality Assurance Testing Hub' },
          { title: 'Dispatch via Fleet Flatbed Truck', date: 'Pending', completed: false, current: false, location: 'Carrier Depot' },
        ],
      });
    }
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lang === 'ar' ? 'نظام تتبع إنتاج وتوصيل الطلبات' : 'Fleet Order & Production Tracking'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Track your fiberglass boxes &amp; thermal backpacks from factory mold to fleet handover.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input bar */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Tracking # (e.g. BB-KSA-9421)"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono uppercase text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Preset quick test badges */}
          <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-400">
            <span>Demo Codes:</span>
            <button
              type="button"
              onClick={() => {
                setTrackInput('BB-KSA-9421');
                setCurrentOrder(INITIAL_TRACKING_ORDERS['BB-KSA-9421']);
              }}
              className="text-amber-400 font-mono hover:underline"
            >
              BB-KSA-9421 (Jahez 120 units)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setTrackInput('BB-KSA-8834');
                setCurrentOrder(INITIAL_TRACKING_ORDERS['BB-KSA-8834']);
              }}
              className="text-indigo-400 font-mono hover:underline"
            >
              BB-KSA-8834 (Shawarma House)
            </button>
          </div>
        </div>

        {/* Tracking Details & Timeline */}
        {currentOrder && (
          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Status Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Status
                </span>
                <span className="text-lg font-extrabold text-amber-400 flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  {currentOrder.status}
                </span>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {currentOrder.item}
                </p>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Est. Delivery / Handover
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {currentOrder.estimatedDelivery}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Via {currentOrder.carrier}
                </span>
              </div>
            </div>

            {/* Destination info */}
            <div className="flex items-start gap-2.5 text-xs text-slate-300 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Consignee Destination:</span>{' '}
                {currentOrder.destination}
              </div>
            </div>

            {/* Milestone Steps */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Production &amp; Logistics Milestones
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {currentOrder.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.current
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 font-bold'
                          : step.completed
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`text-xs font-bold ${
                            step.current
                              ? 'text-amber-400'
                              : step.completed
                              ? 'text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{step.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
