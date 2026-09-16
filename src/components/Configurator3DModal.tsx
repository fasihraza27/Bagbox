import React, { useState } from 'react';
import { BoxConfig3D } from '../types';
import { ThreeBoxViewer } from './ThreeBoxViewer';
import { X, Sparkles, Check, Download, Layers, ShieldCheck, Zap, Sliders, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Configurator3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToQuote: (config: BoxConfig3D, calculatedPrice: number) => void;
  initialConfig?: BoxConfig3D;
}

const PRESET_COLORS = [
  { name: 'Saudi Green', hex: '#006c35' },
  { name: 'Jahez Crimson', hex: '#e11d48' },
  { name: 'Hunger Gold', hex: '#f59e0b' },
  { name: 'Stealth Black', hex: '#1e293b' },
  { name: 'Pearl White', hex: '#f8fafc' },
  { name: 'Royal Navy', hex: '#1d4ed8' },
  { name: 'Careem Mint', hex: '#059669' },
  { name: 'Desert Ochre', hex: '#d97706' },
];

export const Configurator3DModal: React.FC<Configurator3DModalProps> = ({
  isOpen,
  onClose,
  onApplyToQuote,
  initialConfig,
}) => {
  const [config, setConfig] = useState<BoxConfig3D>(
    initialConfig || {
      modelType: 'fiberglass-box',
      primaryColor: '#e11d48',
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
    }
  );

  const [activeTab, setActiveTab] = useState<'model' | 'color' | 'hardware' | 'branding'>('model');
  const [quantity, setQuantity] = useState(50);

  if (!isOpen) return null;

  // Base price calculation
  let baseUnitSAR = 420;
  if (config.modelType === 'thermal-bag') baseUnitSAR = 185;
  if (config.modelType === 'rigid-box') baseUnitSAR = 15;
  if (config.modelType === 'mailer-box') baseUnitSAR = 3.5;

  if (config.hasLEDLight && config.modelType === 'fiberglass-box') baseUnitSAR += 120;
  if (config.hasShelves && config.modelType === 'fiberglass-box') baseUnitSAR += 45;
  if (config.materialFinish === 'carbon') baseUnitSAR += 60;

  // Volume discount
  let discountMultiplier = 1.0;
  if (quantity >= 500) discountMultiplier = 0.8;
  else if (quantity >= 100) discountMultiplier = 0.88;
  else if (quantity >= 50) discountMultiplier = 0.94;

  const finalUnitPriceSAR = Math.round(baseUnitSAR * discountMultiplier);
  const totalEstimatedSAR = finalUnitPriceSAR * quantity;

  const handleUpdate = (partial: Partial<BoxConfig3D>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleConfirmQuote = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onApplyToQuote(config, totalEstimatedSAR);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                3D Custom Box Studio
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Interactive Configurator
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Design your fleet delivery box or packaging with real-time 3D inspection and instant SAR quotation.
              </p>
            </div>
          </div>
          <button
            id="btn-close-configurator"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body: 3D Canvas on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left: 3D Viewport */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-slate-950/60 border-b lg:border-b-0 lg:border-r border-slate-800">
            <div className="w-full">
              <ThreeBoxViewer
                config={config}
                onConfigChange={handleUpdate}
                height="460px"
                interactive={true}
              />
            </div>

            {/* Quick Specs bar */}
            <div className="mt-4 grid grid-cols-3 gap-3 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Model Type</span>
                <span className="text-xs font-semibold text-white capitalize">
                  {config.modelType.replace('-', ' ')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Finish</span>
                <span className="text-xs font-semibold text-amber-400 capitalize">
                  {config.materialFinish}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Safety Rating</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SASO & IP66
                </span>
              </div>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-slate-900 space-y-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Category tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('model')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'model'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('color')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'color'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Colors
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hardware')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'hardware'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Hardware
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('branding')}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'branding'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Branding
                </button>
              </div>

              {/* Tab 1: Model Selection */}
              {activeTab === 'model' && (
                <div className="space-y-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Select Product Template
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      {
                        id: 'fiberglass-box',
                        title: 'Fiberglass Motorcycle Fleet Box',
                        desc: 'Heavy-duty 65L-85L with mounting bracket, key lock & optional LED billboard.',
                        badge: 'Bestseller in KSA',
                      },
                      {
                        id: 'thermal-bag',
                        title: 'Oxford 1680D Thermal Backpack',
                        desc: 'Ergonomic courier backpack with cup holders and thermal insulation.',
                        badge: 'Courier Favorite',
                      },
                      {
                        id: 'rigid-box',
                        title: 'Royal Luxury Rigid Gift Box',
                        desc: 'Magnetic snap flap, hot gold foil stamping & custom velvet foam cavity.',
                        badge: 'Luxury Packaging',
                      },
                      {
                        id: 'mailer-box',
                        title: 'Corrugated E-Commerce Mailer',
                        desc: 'Self-locking crash-proof corrugated carton with interior brand print.',
                        badge: 'E-Commerce',
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleUpdate({ modelType: item.id as any })}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          config.modelType === item.id
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{item.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Material Finish
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'fiberglass', label: 'Gelcoat Fiberglass' },
                        { id: 'matte', label: 'Industrial Matte' },
                        { id: 'carbon', label: 'Carbon Pattern' },
                      ].map((fin) => (
                        <button
                          key={fin.id}
                          type="button"
                          onClick={() => handleUpdate({ materialFinish: fin.id as any })}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                            config.materialFinish === fin.id
                              ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          {fin.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Colors */}
              {activeTab === 'color' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Primary Fleet Color
                    </label>
                    <div className="grid grid-cols-4 gap-2.5">
                      {PRESET_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handleUpdate({ primaryColor: c.hex })}
                          className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                            config.primaryColor === c.hex
                              ? 'border-amber-400 ring-2 ring-amber-400/20 bg-slate-800'
                              : 'border-slate-700/80 bg-slate-800/40 hover:bg-slate-800'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                            {c.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                      Custom Color (HEX)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-slate-800 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Hardware & Accessories */}
              {activeTab === 'hardware' && (
                <div className="space-y-3.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Functional Enhancements
                  </label>

                  {config.modelType === 'fiberglass-box' && (
                    <div className="space-y-3">
                      <div
                        onClick={() => handleUpdate({ hasLEDLight: !config.hasLEDLight })}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between ${
                          config.hasLEDLight
                            ? 'bg-amber-500/15 border-amber-500/60'
                            : 'bg-slate-800/50 border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Zap className={`w-5 h-5 ${config.hasLEDLight ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              LED Illuminated Rear Billboard
                            </span>
                            <span className="text-xs text-slate-400">
                              High-lumen night safety + 24/7 mobile street advertising (+120 SAR)
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.hasLEDLight}
                          readOnly
                          className="w-4 h-4 accent-amber-500"
                        />
                      </div>

                      <div
                        onClick={() => handleUpdate({ hasShelves: !config.hasShelves })}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between ${
                          config.hasShelves
                            ? 'bg-amber-500/15 border-amber-500/60'
                            : 'bg-slate-800/50 border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Layers className={`w-5 h-5 ${config.hasShelves ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Internal Multi-Order Divider Shelf
                            </span>
                            <span className="text-xs text-slate-400">
                              Heated acoustic shelf prevents food spills & separates cold/hot items (+45 SAR)
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.hasShelves}
                          readOnly
                          className="w-4 h-4 accent-amber-500"
                        />
                      </div>

                      <div
                        onClick={() => handleUpdate({ hasLock: !config.hasLock })}
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between ${
                          config.hasLock
                            ? 'bg-amber-500/15 border-amber-500/60'
                            : 'bg-slate-800/50 border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className={`w-5 h-5 ${config.hasLock ? 'text-amber-400' : 'text-slate-500'}`} />
                          <div>
                            <span className="text-sm font-semibold text-white block">
                              Stainless Steel Keyed Tension Lock
                            </span>
                            <span className="text-xs text-slate-400">
                              Anti-theft tamper lock with dual master keys
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={config.hasLock}
                          readOnly
                          className="w-4 h-4 accent-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {config.modelType !== 'fiberglass-box' && (
                    <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 text-center text-xs text-slate-300">
                      Standard commercial reinforcements (YKK zippers, magnetic snap, reinforced handles) are pre-engineered into this model.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Branding */}
              {activeTab === 'branding' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Brand Text on 3D Surface
                    </label>
                    <input
                      id="input-3d-brand-text"
                      type="text"
                      value={config.customText}
                      maxLength={24}
                      onChange={(e) => handleUpdate({ customText: e.target.value.toUpperCase() })}
                      placeholder="e.g. JAHEZ FLEET"
                      className="w-full px-3.5 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-semibold text-amber-400 tracking-wider focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Rendered in high-resolution UV print on the 3D preview in real-time.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Batch Quantity (Units)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        step="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="flex-1 accent-amber-500"
                      />
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-center text-sm font-bold text-white"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>MOQ: 10 units</span>
                      {quantity >= 100 && (
                        <span className="text-emerald-400 font-semibold">Tier 2 Volume Discount Applied</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Summary & Submit CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Unit Price (Estimated)</span>
                  <span className="text-xl font-extrabold text-white">
                    {finalUnitPriceSAR}{' '}
                    <span className="text-xs font-semibold text-amber-400">SAR / unit</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total ({quantity} units)</span>
                  <span className="text-2xl font-black text-amber-400">
                    {totalEstimatedSAR.toLocaleString()}{' '}
                    <span className="text-xs font-bold text-slate-300">SAR</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-apply-3d-quote"
                  type="button"
                  onClick={handleConfirmQuote}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  Apply to RFQ Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
