import React from 'react';
import { Box, Phone, Mail, MapPin, ShieldCheck, Sparkles, Truck, MessageSquare } from 'lucide-react';

interface FooterProps {
  onOpen3DStudio: () => void;
  onOpenQuote: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  lang: 'en' | 'ar';
}

export const Footer: React.FC<FooterProps> = ({
  onOpen3DStudio,
  onOpenQuote,
  onOpenTracker,
  onOpenAdmin,
  lang,
}) => {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      {/* Top Pre-footer CTA banner */}
      <div className="border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to Upgrade Your Delivery Fleet in Saudi Arabia?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Connect with our Riyadh engineering team for custom fiberglass box molds, SASO test reports, and volume pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Fleet Sales</span>
            </a>
            <button
              onClick={onOpenQuote}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Get Immediate RFQ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Company Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                <Box className="w-5 h-5 font-black" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                BAG &amp; BOX <span className="text-amber-400">KSA</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Bag Box Advertising and Publishing LLC (KSA). Saudi Arabia's premier manufacturer and distributor of motorcycle delivery boxes, thermal insulated backpacks, rider protective gear, and luxury bespoke packaging.
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Commercial Registration (CR): 1010XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ZATCA VAT ID: 310XXXXXXXX0003</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SASO Certified Safety Compliant</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Fleet Products
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#products" className="hover:text-amber-400 transition-colors">65L &amp; 85L Fiberglass Boxes</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">LED Illuminated Billboards</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Oxford 1680D Thermal Backpacks</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Dual-Chamber Pizza Boxes</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">SASO Rider Helmets &amp; Jackets</a></li>
              <li><a href="#products" className="hover:text-amber-400 transition-colors">Custom Kraft Paper Bags</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Solutions &amp; Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={onOpen3DStudio}
                  className="hover:text-amber-400 text-amber-400/90 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Box Configurator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Production Order</span>
                </button>
              </li>
              <li><a href="#quote" className="hover:text-amber-400 transition-colors">B2B Volume Quotations</a></li>
              <li><a href="#fleet" className="hover:text-amber-400 transition-colors">Fleet Vehicle Wrapping</a></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-white transition-colors"
                >
                  Fleet Operations Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Saudi Offices
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Riyadh (HQ &amp; Plant):</strong>
                  Al Sulay Industrial Zone, Riyadh 14264
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Jeddah Hub:</strong>
                  Al Bawadi District, Jeddah
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Khobar &amp; Dammam:</strong>
                  King Fahd Branch Rd, Eastern Province
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Bag &amp; Box Advertising and Publishing LLC (KSA). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Terms of Supply</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">SASO Certification</a>
            <span>•</span>
            <button onClick={onOpenAdmin} className="text-amber-400 font-bold hover:underline">
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
