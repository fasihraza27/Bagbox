import React, { useState } from 'react';
import { Product, QuoteRequest, BoxConfig3D } from '../types';
import { MessageSquare, Check, Sparkles, Building2, MapPin, Phone, Mail, User, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuoteBuilderProps {
  products: Product[];
  selectedProduct?: Product | null;
  activeConfig3D?: BoxConfig3D | null;
  onSubmitQuote: (quote: QuoteRequest) => void;
  lang: 'en' | 'ar';
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  products,
  selectedProduct,
  activeConfig3D,
  onSubmitQuote,
  lang,
}) => {
  const [chosenProductId, setChosenProductId] = useState<string>(
    selectedProduct ? selectedProduct.id : products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(selectedProduct ? selectedProduct.moq : 50);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('+966 ');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState<'Riyadh' | 'Jeddah' | 'Dammam' | 'Khobar' | 'Mecca' | 'Medina' | 'Other'>('Riyadh');
  const [customBranding, setCustomBranding] = useState(true);
  const [notes, setNotes] = useState('');
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  const currentProduct = products.find((p) => p.id === chosenProductId) || products[0];

  // Pricing calculations
  const unitPriceSAR = currentProduct ? currentProduct.priceSAR : 420;
  const subtotalSAR = unitPriceSAR * quantity;

  // Volume tier discounts
  let discountPct = 0;
  if (quantity >= 500) discountPct = 15;
  else if (quantity >= 100) discountPct = 10;
  else if (quantity >= 50) discountPct = 5;

  const discountAmountSAR = Math.round((subtotalSAR * discountPct) / 100);
  const totalAfterDiscountSAR = subtotalSAR - discountAmountSAR;
  const vatAmountSAR = Math.round(totalAfterDiscountSAR * 0.15); // 15% KSA VAT
  const grandTotalSAR = totalAfterDiscountSAR + vatAmountSAR;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !email) {
      alert('Please fill in your name, contact phone, and email address.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: `QTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      clientName,
      companyName: companyName || 'Private Fleet / Logistics',
      phone,
      email,
      city,
      productId: currentProduct.id,
      productName: currentProduct.name,
      quantity,
      customBranding,
      notes,
      estimatedTotalSAR: grandTotalSAR,
      status: 'Pending',
      config3D: activeConfig3D || undefined,
    };

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });

    onSubmitQuote(newQuote);
    setSubmittedQuote(newQuote);
  };

  return (
    <section id="quote" className="py-20 sm:py-28 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'طلب تسعيرة رسمية للأساطيل' : 'Official B2B Fleet RFP'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'ar'
              ? 'احصل على عرض سعر تجاري فوري'
              : 'Request an Official B2B Commercial Quotation'}
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {lang === 'ar'
              ? 'تجهيز أساطيل التوصيل، المطاعم السحابية، وشركات الخدمات اللوجستية في جميع مدن المملكة بعروض أسعار تنافسية ودعم فني متكامل.'
              : 'Instant commercial volume quotation with full ZATCA-compliant tax breakdown and fleet volume discounts.'}
          </p>
        </div>

        {submittedQuote ? (
          /* Confirmation State */
          <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                Quotation Request Received
              </span>
              <h3 className="text-2xl font-black text-white">
                RFQ Reference: #{submittedQuote.id}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Thank you <strong className="text-white">{submittedQuote.clientName}</strong>. Your quotation for{' '}
                <strong className="text-amber-400">{submittedQuote.quantity} units</strong> of {submittedQuote.productName} has been transmitted directly to our sales and production dispatch queue in {submittedQuote.city}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Total (Inc. 15% VAT):</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  {submittedQuote.estimatedTotalSAR.toLocaleString()} SAR
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Region:</span>
                <span className="font-medium text-slate-200">{submittedQuote.city} Distribution Hub</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                  Under Engineering Review
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmittedQuote(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Submit Another RFP
              </button>
              <a
                href={`https://wa.me/966500000000?text=Hello%20Bag%20%26%20Box%20KSA,%20I%20have%20submitted%20Quote%20ID%20${submittedQuote.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Instant WhatsApp Expedite</span>
              </a>
            </div>
          </div>
        ) : (
          /* Form layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
            >
              {/* Product & Quantity Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>1. Product Specifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Selected Item
                    </label>
                    <select
                      id="select-quote-product"
                      value={chosenProductId}
                      onChange={(e) => setChosenProductId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.priceSAR} SAR)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Fleet Quantity (Units)
                    </label>
                    <input
                      id="input-quote-quantity"
                      type="number"
                      min={currentProduct?.moq || 10}
                      step={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(currentProduct?.moq || 10, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      MOQ for this item: {currentProduct?.moq || 10} units
                    </span>
                  </div>
                </div>

                {/* Custom Branding checkbox */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Include Custom Fleet Vinyl / UV Logo Branding
                    </span>
                    <span className="text-[11px] text-slate-400">
                      High-resolution 3M cast vinyl printed with your company logo &amp; contact lines.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={customBranding}
                    onChange={(e) => setCustomBranding(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Company & Client Details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>2. Client &amp; Logistics Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Contact Person Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Mohammed Al-Ghamdi"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Desert Express Logistics"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Saudi Mobile / Phone *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Official Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="procurement@company.sa"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Delivery Hub / City in KSA
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value as any)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Riyadh">Riyadh (Central Hub)</option>
                        <option value="Jeddah">Jeddah (Western Region)</option>
                        <option value="Dammam">Dammam (Eastern Province)</option>
                        <option value="Khobar">Al Khobar</option>
                        <option value="Mecca">Mecca</option>
                        <option value="Medina">Medina</option>
                        <option value="Other">Other Saudi City</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Project Notes / Mounting Model
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Honda Ace CB125, need LED light"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <button
                id="btn-submit-rfq"
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Submit Official B2B Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Right: Real-time Commercial Estimation Breakdown */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
              <h3 className="text-base font-extrabold text-white flex items-center justify-between">
                <span>Quotation Summary</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  ZATCA 15% VAT
                </span>
              </h3>

              {/* Selected Product snapshot */}
              <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{currentProduct.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    Base: {currentProduct.priceSAR} SAR / unit
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 font-semibold inline-block">
                    {quantity} Units Selected
                  </span>
                </div>
              </div>

              {/* Price Line Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Item Total ({quantity} x {unitPriceSAR} SAR):</span>
                  <span className="font-semibold">{subtotalSAR.toLocaleString()} SAR</span>
                </div>

                {discountPct > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Fleet Tier Discount ({discountPct}%):</span>
                    <span>-{discountAmountSAR.toLocaleString()} SAR</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>Custom Branding &amp; Assembly:</span>
                  <span className="text-emerald-400 font-semibold">Complimentary</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>KSA VAT (15% ZATCA standard):</span>
                  <span>+{vatAmountSAR.toLocaleString()} SAR</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Estimated Total (SAR)</span>
                    <span className="text-[10px] text-slate-500">Includes taxes &amp; universal brackets</span>
                  </div>
                  <span className="text-2xl font-black text-amber-400">
                    {grandTotalSAR.toLocaleString()}{' '}
                    <span className="text-xs font-bold text-slate-300">SAR</span>
                  </span>
                </div>
              </div>

              {/* Assurances */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2-Year Structural Fleet Warranty against desert UV degradation.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Doorstep delivery &amp; mounting installation available in Riyadh &amp; Jeddah.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
