import React, { useState, useEffect } from 'react';
import { Product, QuoteRequest, BoxConfig3D } from './types';
import { INITIAL_PRODUCTS, INITIAL_QUOTES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FleetSolutions } from './components/FleetSolutions';
import { ProductCatalog } from './components/ProductCatalog';
import { QuoteBuilder } from './components/QuoteBuilder';
import { Configurator3DModal } from './components/Configurator3DModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Sparkles, Phone, MessageSquare, Shield, Truck } from 'lucide-react';

export default function App() {
  // Persistence in localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bagbox_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved products', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('bagbox_quotes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved quotes', e);
      }
    }
    return INITIAL_QUOTES;
  });

  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Modals state
  const [is3DStudioOpen, setIs3DStudioOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeConfig3D, setActiveConfig3D] = useState<BoxConfig3D | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bagbox_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bagbox_quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Handle new quote submission
  const handleQuoteSubmitted = (newQuote: QuoteRequest) => {
    setQuotes((prev) => [newQuote, ...prev]);
  };

  // Handle quote status update from admin
  const handleUpdateQuoteStatus = (id: string, newStatus: QuoteRequest['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
  };

  const handleDeleteQuote = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quote request?')) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Delete this product from catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all quotes and catalog to initial factory preset?')) {
      localStorage.removeItem('bagbox_products');
      localStorage.removeItem('bagbox_quotes');
      setProducts(INITIAL_PRODUCTS);
      setQuotes(INITIAL_QUOTES);
    }
  };

  // Add to quote from catalog or modal
  const handleAddToQuote = (product: Product, quantity: number) => {
    setSelectedProduct(product);
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open 3D customizer for a specific product
  const handleOpen3DForProduct = (product: Product) => {
    if (product.modelType) {
      setActiveConfig3D({
        modelType: product.modelType,
        primaryColor: '#e11d48',
        secondaryColor: '#f59e0b',
        accentColor: '#ffffff',
        materialFinish: 'fiberglass',
        hasLEDLight: product.id.includes('led'),
        ledColor: '#f59e0b',
        hasLock: true,
        hasShelves: true,
        shelfCount: 2,
        customText: product.name.split(' ')[0] || 'BAG & BOX KSA',
        openLid: false,
        explodedView: false,
      });
    }
    setIs3DStudioOpen(true);
  };

  const handleApply3DToQuote = (config: BoxConfig3D, calculatedPrice: number) => {
    setActiveConfig3D(config);
    setIs3DStudioOpen(false);
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-slate-950 text-slate-100 ${
        lang === 'ar' ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* Navigation Bar */}
      <Navbar
        onOpen3DStudio={() => setIs3DStudioOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ar' : 'en')}
        quoteCount={quotes.length}
        onOpenQuote={() => {
          const el = document.getElementById('quote');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Body */}
      <main>
        {/* Hero with Real-Time 3D Box Showcase */}
        <Hero
          onOpen3DStudio={() => setIs3DStudioOpen(true)}
          onOpenQuote={() => {
            const el = document.getElementById('quote');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          lang={lang}
        />

        {/* Corporate Delivery Fleet Solutions */}
        <FleetSolutions
          onOpen3DStudio={() => setIs3DStudioOpen(true)}
          onOpenQuote={() => {
            const el = document.getElementById('quote');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          lang={lang}
        />

        {/* Interactive Product Catalog */}
        <ProductCatalog
          products={products}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onOpen3DStudio={handleOpen3DForProduct}
          onAddToQuote={handleAddToQuote}
          lang={lang}
        />

        {/* Commercial Quotation (RFQ) Form */}
        <QuoteBuilder
          products={products}
          selectedProduct={selectedProduct}
          activeConfig3D={activeConfig3D}
          onSubmitQuote={handleQuoteSubmitted}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpen3DStudio={() => setIs3DStudioOpen(true)}
        onOpenQuote={() => {
          const el = document.getElementById('quote');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        lang={lang}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Floating 3D Studio Trigger */}
        <button
          id="btn-floating-3d"
          onClick={() => setIs3DStudioOpen(true)}
          title="Open Interactive 3D Studio"
          className="group px-4 py-3 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:text-white hover:bg-amber-500 font-bold text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all transform hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-slate-950 animate-pulse" />
          <span className="hidden sm:inline group-hover:text-slate-950">3D Box Studio</span>
        </button>

        {/* Floating WhatsApp Sales Button */}
        <a
          id="btn-floating-whatsapp"
          href="https://wa.me/966500000000?text=Hello%20Bag%20%26%20Box%20KSA,%20I%20would%20like%20a%20delivery%20fleet%20consultation"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat with Saudi Sales on WhatsApp"
          className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-105"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>

      {/* MODAL 1: Full-Screen 3D Configurator Studio */}
      <Configurator3DModal
        isOpen={is3DStudioOpen}
        onClose={() => setIs3DStudioOpen(false)}
        onApplyToQuote={handleApply3DToQuote}
        initialConfig={activeConfig3D || undefined}
      />

      {/* MODAL 2: Product Detail & Spec Sheet Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={handleAddToQuote}
        onOpen3DStudio={handleOpen3DForProduct}
        lang={lang}
      />

      {/* MODAL 3: Order Production Tracking Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        lang={lang}
      />

      {/* MODAL 4: Operations Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        quotes={quotes}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onDeleteQuote={handleDeleteQuote}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetData={handleResetData}
      />
    </div>
  );
}
