import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Flame, Layers, Box, Truck, ChevronRight } from 'lucide-react';
import { ThreeBoxViewer } from './ThreeBoxViewer';
import { BoxConfig3D } from '../types';
import { TRUSTED_CLIENTS, STATS_KSA } from '../data/mockData';

interface HeroProps {
  onOpen3DStudio: () => void;
  onOpenQuote: () => void;
  lang: 'en' | 'ar';
}

export const Hero: React.FC<HeroProps> = ({ onOpen3DStudio, onOpenQuote, lang }) => {
  const [heroBoxConfig, setHeroBoxConfig] = useState<BoxConfig3D>({
    modelType: 'fiberglass-box',
    primaryColor: '#e11d48', // Jahez Red default
    secondaryColor: '#f59e0b',
    accentColor: '#ffffff',
    materialFinish: 'fiberglass',
    hasLEDLight: true,
    ledColor: '#f59e0b',
    hasLock: true,
    hasShelves: true,
    shelfCount: 2,
    customText: 'BAG & BOX KSA',
    openLid: false,
    explodedView: false,
  });

  const heroColors = [
    { label: 'Jahez Red', hex: '#e11d48' },
    { label: 'Hunger Gold', hex: '#f59e0b' },
    { label: 'Saudi Green', hex: '#006c35' },
    { label: 'Stealth Black', hex: '#1e293b' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Compelling Pitch & Copy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-400 backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'ar'
                  ? 'المصنع المعتمد رقم #1 لصناديق الدراجات وتغليف التوصيل بالمملكة'
                  : 'KSA #1 Certified Fleet Delivery Boxes & Thermal Packaging'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {lang === 'ar' ? (
                <>
                  أقوى صناديق الدراجات النارية <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">
                    والتغليف الحراري الفاخر
                  </span>{' '}
                  في المملكة
                </>
              ) : (
                <>
                  Heavy-Duty Delivery Boxes &amp;{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">
                    Smart 3D Packaging
                  </span>{' '}
                  for Saudi Fleets
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              {lang === 'ar'
                ? 'نصمم ونُصنّع صناديق الدراجات النارية المقواة بالفايبرجلاس، حقائب التوصيل الحرارية بقماش 1680D، وملابس وأدوات سلامة السائقين المعتمدة لدى كبرى شركات التوصيل في السعودية والخليج.'
                : 'Engineered for extreme desert temperatures (+55°C). Supplying aerodynamic fiberglass motorcycle boxes with LED billboards, thermal courier backpacks, rider safety gear, and luxury retail packaging.'}
            </p>

            {/* Key Value Bullets */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>SASO &amp; Traffic Safety Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Heavy-Duty Multi-Layer FRP</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Integrated 12V LED Billboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Universal Bike Mounting Bracket</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                id="btn-hero-3d-studio"
                onClick={onOpen3DStudio}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ar' ? 'صمّم صندوقك بتقنية 3D' : 'Launch 3D Customizer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-quote"
                onClick={onOpenQuote}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700/80 font-bold text-sm flex items-center gap-2 transition-all hover:border-slate-600"
              >
                <span>{lang === 'ar' ? 'طلب عرض سعر B2B' : 'Request Fleet RFQ'}</span>
              </button>
            </div>

            {/* Quick stats counter */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS_KSA.map((stat, i) => (
                <div key={i}>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">{stat.value}</div>
                  <div className="text-[11px] text-slate-400 font-medium leading-tight">
                    {lang === 'ar' ? stat.labelAr : stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live 3D Interactive Box Canvas in Hero */}
          <div className="lg:col-span-6">
            <div className="relative p-2 sm:p-3 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
              {/* 3D Header Bar inside the frame */}
              <div className="flex items-center justify-between px-3 py-2 mb-2 bg-slate-950/70 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 ml-1">
                    Apex 85L FRP Fleet Box (Real-Time 3D)
                  </span>
                </div>

                {/* Direct Color Quick Swatch */}
                <div className="flex items-center gap-1.5">
                  {heroColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setHeroBoxConfig((prev) => ({ ...prev, primaryColor: c.hex }))}
                      title={c.label}
                      className={`w-5 h-5 rounded-full border transition-all ${
                        heroBoxConfig.primaryColor === c.hex
                          ? 'ring-2 ring-amber-400 scale-110 border-white'
                          : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* 3D Canvas */}
              <ThreeBoxViewer
                config={heroBoxConfig}
                onConfigChange={(partial) => setHeroBoxConfig((prev) => ({ ...prev, ...partial }))}
                height="400px"
                interactive={true}
              />

              {/* Quick Hero 3D feature trigger footer */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs">
                <div className="text-slate-400 flex items-center gap-2">
                  <span className="text-[11px]">Rotate 360° with mouse or finger</span>
                </div>
                <button
                  onClick={onOpen3DStudio}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-xs"
                >
                  <span>Open Full 3D Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Client Ticker / Trust Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            {lang === 'ar'
              ? 'موثوق من قِبل كبرى أساطيل التوصيل والعلامات التجارية في المملكة العربية السعودية'
              : 'Trusted By Premier Delivery Fleets & Food Chains Across KSA'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            {TRUSTED_CLIENTS.map((client) => (
              <div
                key={client.name}
                className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-2 hover:border-slate-700 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-extrabold text-sm tracking-wider text-slate-200">
                  {client.logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
