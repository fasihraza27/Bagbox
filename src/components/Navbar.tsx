import React, { useState } from 'react';
import { Box, Phone, MessageSquare, Shield, Menu, X, Sparkles, Truck, UserCheck, Search } from 'lucide-react';

interface NavbarProps {
  onOpen3DStudio: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  quoteCount: number;
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpen3DStudio,
  onOpenAdmin,
  onOpenTracker,
  lang,
  onToggleLang,
  quoteCount,
  onOpenQuote,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      {/* Top micro-bar for Saudi logistics info */}
      <div className="bg-slate-900/90 text-slate-400 text-xs border-b border-slate-800/50 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {lang === 'ar' ? 'مصنع وصالات عرض الرياض، جدة، والخبر' : 'Riyadh, Jeddah & Khobar Facilities Active'}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              {lang === 'ar' ? 'اعتماد الهيئة السعودية للمواصفات والمقاييس (SASO)' : 'SASO Compliant Fleet Boxes & PPE'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <a
              href="tel:+966500000000"
              className="hover:text-amber-400 transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+966 (11) 234-BAGS</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenTracker}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 text-slate-300"
            >
              <Truck className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'ar' ? 'تتبع طلبك' : 'Track Order'}</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onToggleLang}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold tracking-wider text-[11px] transition-colors"
            >
              {lang === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Box className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  BAG <span className="text-amber-400">&amp;</span> BOX
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  KSA
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
                {lang === 'ar' ? 'صناديق التوصيل والتغليف المبتكر' : 'Delivery Boxes & Packaging'}
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#products"
              className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'المنتجات والحلول' : 'Products & Catalog'}
            </a>
            <a
              href="#fleet"
              className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'حلول أساطيل التوصيل' : 'Fleet Solutions'}
            </a>
            <button
              onClick={onOpen3DStudio}
              className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 group transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:animate-spin" />
              {lang === 'ar' ? 'استوديو التصميم 3D' : '3D Box Studio'}
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                NEW
              </span>
            </button>
            <a
              href="#quote"
              className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'طلب عرض سعر B2B' : 'B2B Quotation'}
            </a>
            <a
              href="#contact"
              className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'تواصل معنا' : 'Contact'}
            </a>
          </nav>

          {/* Actions: Admin Portal & RFQ Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Admin Portal button */}
            <button
              id="btn-nav-admin"
              onClick={onOpenAdmin}
              title="Open Admin Dashboard"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>

            {/* Quote Cart CTA */}
            <button
              id="btn-nav-quote"
              onClick={onOpenQuote}
              className="relative px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طلب تسعيرة' : 'Request RFQ'}</span>
              {quoteCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
                  {quoteCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            <a
              href="#products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              {lang === 'ar' ? 'المنتجات والحلول' : 'Products & Catalog'}
            </a>
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              {lang === 'ar' ? 'حلول أساطيل التوصيل' : 'Fleet Solutions'}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpen3DStudio();
              }}
              className="px-3 py-2 rounded-lg text-sm font-bold text-amber-400 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <Sparkles className="w-4 h-4" />
              {lang === 'ar' ? 'استوديو التصميم 3D التفاعلي' : '3D Box Studio (Interactive)'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTracker();
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900 flex items-center gap-2 text-left"
            >
              <Truck className="w-4 h-4 text-indigo-400" />
              {lang === 'ar' ? 'تتبع طلبك' : 'Track Order'}
            </button>
            <a
              href="#quote"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
            >
              {lang === 'ar' ? 'طلب تسعيرة B2B' : 'B2B Quotation'}
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              Admin Portal
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              {lang === 'ar' ? 'عرض سعر' : 'Get Quote'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
