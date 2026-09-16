import React, { useState } from 'react';
import { Product, BoxConfig3D } from '../types';
import { X, Check, ShieldCheck, Sparkles, Truck, Box, Star, MessageSquare } from 'lucide-react';
import { ThreeBoxViewer } from './ThreeBoxViewer';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product, quantity: number) => void;
  onOpen3DStudio: (product: Product) => void;
  lang: 'en' | 'ar';
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToQuote,
  onOpen3DStudio,
  lang,
}) => {
  const [quantity, setQuantity] = useState(product ? product.moq : 10);
  const [view3DTab, setView3DTab] = useState(false);

  if (!product) return null;

  const totalSAR = product.priceSAR * quantity;

  // Default 3D config for this model
  const default3D: BoxConfig3D = {
    modelType: product.modelType || 'fiberglass-box',
    primaryColor: '#e11d48',
    secondaryColor: '#f59e0b',
    accentColor: '#ffffff',
    materialFinish: 'fiberglass',
    hasLEDLight: product.id.includes('led'),
    ledColor: '#f59e0b',
    hasLock: true,
    hasShelves: true,
    shelfCount: 2,
    customText: 'BAG & BOX KSA',
    openLid: false,
    explodedView: false,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 uppercase tracking-wider">
              {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-center text-amber-400 text-xs font-bold gap-1 ml-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount} fleet reviews)</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal content */}
        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
          {/* Left Column: Media / 3D Viewer */}
          <div className="p-6 bg-slate-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              {/* Image vs 3D toggle if 3D is supported */}
              {product.is3DSupported && (
                <div className="flex items-center gap-2 mb-4 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setView3DTab(false)}
                    className={`flex-1 py-1.5 rounded-lg transition-all ${
                      !view3DTab ? 'bg-slate-900 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Photo Gallery
                  </button>
                  <button
                    type="button"
                    onClick={() => setView3DTab(true)}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      view3DTab ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-amber-400 hover:text-amber-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Interactive 3D
                  </button>
                </div>
              )}

              {view3DTab && product.is3DSupported ? (
                <div className="rounded-2xl overflow-hidden border border-slate-800">
                  <ThreeBoxViewer config={default3D} height="320px" interactive={true} />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-4/3 bg-slate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {product.isPopular && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 shadow-md">
                      Bestseller
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick 3D Studio deep customizer trigger */}
            {product.is3DSupported && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpen3DStudio(product);
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 hover:border-amber-400/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Open in 3D Customizer Studio (Colors &amp; Decals)</span>
              </button>
            )}
          </div>

          {/* Right Column: Specs & Ordering */}
          <div className="p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {lang === 'ar' ? product.nameAr : product.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {product.fullDesc}
                </p>
              </div>

              {/* Technical Specifications Sheet */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Technical Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Material</span>
                    <span className="font-semibold text-slate-200">{product.specs.material}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Dimensions</span>
                    <span className="font-semibold text-slate-200">{product.specs.dimensions}</span>
                  </div>
                  {product.specs.capacity && (
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Capacity</span>
                      <span className="font-semibold text-amber-400">{product.specs.capacity}</span>
                    </div>
                  )}
                  {product.specs.warranty && (
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Warranty</span>
                      <span className="font-semibold text-emerald-400">{product.specs.warranty}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features bullet list */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Fleet Features
                </span>
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Quote Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Order Quantity</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min={product.moq}
                      step={product.moq >= 100 ? 50 : 5}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.moq, Number(e.target.value)))}
                      className="w-24 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">units (Min: {product.moq})</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Estimated Price</span>
                  <span className="text-xl font-black text-amber-400">
                    {totalSAR.toLocaleString()} <span className="text-xs text-slate-300">SAR</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    ({product.priceSAR} SAR / unit)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToQuote(product, quantity);
                    onClose();
                  }}
                  className="flex-2 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Add to B2B Quote Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
