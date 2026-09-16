import React, { useState } from 'react';
import { QuoteRequest, Product, BoxConfig3D } from '../types';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  LogOut,
  Lock,
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: QuoteRequest[];
  onUpdateQuoteStatus: (id: string, newStatus: QuoteRequest['status']) => void;
  onDeleteQuote: (id: string) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  quotes,
  onUpdateQuoteStatus,
  onDeleteQuote,
  products,
  onAddProduct,
  onDeleteProduct,
  onResetData,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default true for instant preview usability
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'products' | 'facilities'>('overview');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuoteRequest | null>(null);

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('delivery-boxes');
  const [newProdPrice, setNewProdPrice] = useState(380);
  const [newProdMoq, setNewProdMoq] = useState(10);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
  );

  if (!isOpen) return null;

  // Filtered quotes
  const filteredQuotes = quotes.filter((q) => {
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchSearch =
      q.clientName.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.companyName.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.id.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.productName.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.city.toLowerCase().includes(quoteSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Analytics Metrics
  const totalPipelineSAR = quotes.reduce((acc, q) => acc + q.estimatedTotalSAR, 0);
  const totalUnits = quotes.reduce((acc, q) => acc + q.quantity, 0);
  const pendingCount = quotes.filter((q) => q.status === 'Pending' || q.status === 'Reviewing').length;
  const productionCount = quotes.filter((q) => q.status === 'In Production').length;

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = [
      'Quote ID',
      'Created At',
      'Client Name',
      'Company',
      'Phone',
      'Email',
      'City',
      'Product',
      'Quantity',
      'Estimated Total SAR',
      'Status',
    ];
    const rows = quotes.map((q) => [
      q.id,
      q.createdAt,
      `"${q.clientName}"`,
      `"${q.companyName}"`,
      `"${q.phone}"`,
      q.email,
      q.city,
      `"${q.productName}"`,
      q.quantity,
      q.estimatedTotalSAR,
      q.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BagBox_KSA_Quotes_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProdName,
      nameAr: newProdNameAr || newProdName,
      category: newProdCategory,
      shortDesc: newProdDesc || 'Commercial grade fleet solution from Bag & Box KSA.',
      shortDescAr: 'منتج أساطيل معتمد بمواصفات عالية التحمل.',
      fullDesc: newProdDesc || 'Engineered for high volume commercial use.',
      priceSAR: Number(newProdPrice),
      moq: Number(newProdMoq),
      rating: 4.9,
      reviewsCount: 1,
      image: newProdImage,
      tags: ['Commercial', 'Fleet Grade', 'New Addition'],
      specs: {
        material: 'High-Density Composite',
        dimensions: 'Custom Fleet Dimensions',
        warranty: '2 Years Standard',
      },
      features: ['Food safe thermal barrier', 'Heavy duty hardware', 'Custom branding ready'],
      isPopular: false,
      is3DSupported: newProdCategory === 'delivery-boxes' || newProdCategory === 'thermal-bags',
      modelType: newProdCategory === 'thermal-bags' ? 'thermal-bag' : 'fiberglass-box',
    };

    onAddProduct(newProd);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdNameAr('');
    setNewProdDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">
                  Bag &amp; Box KSA Operations Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Commercial RFQs, 3D Customizer Specifications, and Fleet Inventory Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onResetData}
              title="Reset to default mock dataset"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Mock Data</span>
            </button>
            <button
              id="btn-close-admin"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'quotes'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>RFQs &amp; Orders</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-amber-400 font-bold">
                {quotes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Catalog Management</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-bold">
                {products.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-4 py-2 rounded-xl transition-all ${
                activeTab === 'facilities'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Saudi Hubs
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Pipeline Volume</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {totalPipelineSAR.toLocaleString()}{' '}
                    <span className="text-xs font-bold text-amber-400">SAR</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    Across {quotes.length} active fleet RFQs
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Units in Demand</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {totalUnits.toLocaleString()}{' '}
                    <span className="text-xs font-bold text-slate-400">Boxes &amp; Bags</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Motorcycle boxes, backpacks, packaging
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>In Production</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-indigo-400">
                    {productionCount}{' '}
                    <span className="text-xs font-bold text-slate-400">Active Batches</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Riyadh &amp; Jeddah Fiberglass Lines
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                    <span>Pending Quotes</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400">
                    {pendingCount}{' '}
                    <span className="text-xs font-bold text-slate-400">Awaiting Pricing</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Requires engineering sign-off
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Latest Commercial Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {quotes.slice(0, 4).map((q) => (
                    <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{q.id}</span>
                          <span className="text-xs font-bold text-white">{q.clientName}</span>
                          <span className="text-xs text-slate-400">({q.companyName})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {q.quantity}x {q.productName} • {q.city}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white block">
                          {q.estimatedTotalSAR.toLocaleString()} SAR
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                            q.status === 'In Production'
                              ? 'bg-indigo-500/20 text-indigo-400'
                              : q.status === 'Quoted'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUOTES & RFQ MANAGEMENT */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    placeholder="Search client, company, quote ID, city..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Quoted">Quoted</option>
                    <option value="In Production">In Production</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Quotes Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Ref ID</th>
                      <th className="p-3.5">Client &amp; Company</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Product &amp; Qty</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Est. SAR</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-amber-400">
                          {q.id}
                          {q.config3D && (
                            <span className="block text-[9px] text-indigo-400 font-sans font-bold flex items-center gap-0.5 mt-0.5">
                              <Sparkles className="w-3 h-3" />
                              3D Spec Attached
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white">{q.clientName}</div>
                          <div className="text-[11px] text-slate-400">{q.companyName}</div>
                        </td>
                        <td className="p-3.5 text-[11px]">
                          <div>{q.phone}</div>
                          <div className="text-slate-400 truncate max-w-[140px]">{q.email}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-200 line-clamp-1 max-w-[180px]">
                            {q.productName}
                          </div>
                          <div className="text-[11px] text-amber-400 font-bold">
                            {q.quantity} units
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-300">{q.city}</td>
                        <td className="p-3.5 font-bold text-white">
                          {q.estimatedTotalSAR.toLocaleString()} SAR
                        </td>
                        <td className="p-3.5">
                          <select
                            value={q.status}
                            onChange={(e) => onUpdateQuoteStatus(q.id, e.target.value as any)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                              q.status === 'In Production'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : q.status === 'Quoted'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : q.status === 'Delivered'
                                ? 'bg-green-600/20 text-green-300 border-green-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                            <option value="Reviewing" className="bg-slate-900 text-white">Reviewing</option>
                            <option value="Quoted" className="bg-slate-900 text-white">Quoted</option>
                            <option value="In Production" className="bg-slate-900 text-white">In Production</option>
                            <option value="Dispatched" className="bg-slate-900 text-white">Dispatched</option>
                            <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedQuoteDetail(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="View Full Spec & Notes"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteQuote(q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                            title="Delete Quote"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Live Product Catalog ({products.length} items)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control MOQ, fleet prices, and product availability.
                  </p>
                </div>
                <button
                  id="btn-add-product-modal"
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 rounded-xl object-cover bg-slate-900"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase">
                          {p.category}
                        </span>
                        <div className="text-xs font-black text-white">
                          {p.priceSAR} SAR{' '}
                          <span className="text-[10px] text-slate-400 font-normal">
                            (MOQ: {p.moq})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        {p.is3DSupported ? '3D Config Enabled' : 'Standard Spec'}
                      </span>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-slate-900"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAUDI HUBS & FACILITIES */}
          {activeTab === 'facilities' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Headquarters &amp; Plant</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Riyadh Central Hub</h4>
                  <p className="text-xs text-slate-400">
                    Al Sulay Industrial Zone, Riyadh 14264, Saudi Arabia. Houses heavy fiberglass compression molds, CNC bracket cutting, and 12V LED electrical assembly.
                  </p>
                  <div className="pt-2 text-xs text-slate-300 space-y-1">
                    <div>Capacity: <strong>1,200 Boxes / Month</strong></div>
                    <div>Fleet Support: <strong>Central &amp; Northern Region</strong></div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Distribution &amp; Wrapping</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Jeddah Logistics Hub</h4>
                  <p className="text-xs text-slate-400">
                    Al Bawadi District, Jeddah, Saudi Arabia. Specializes in Oxford 1680D thermal textile stitching, ultrasonic food liner welding, and 3M motorcycle wrapping.
                  </p>
                  <div className="pt-2 text-xs text-slate-300 space-y-1">
                    <div>Capacity: <strong>800 Bags / Month</strong></div>
                    <div>Fleet Support: <strong>Western, Mecca &amp; Medina</strong></div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">Regional Office</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-base font-extrabold text-white">Al Khobar &amp; Dammam</h4>
                  <p className="text-xs text-slate-400">
                    King Fahd Rd, Al Khobar, Saudi Arabia. Fleet customer pickup point, rider helmet &amp; uniform sizing depot, and warranty inspection center.
                  </p>
                  <div className="pt-2 text-xs text-slate-300 space-y-1">
                    <div>Capacity: <strong>Spare parts &amp; Hardware</strong></div>
                    <div>Fleet Support: <strong>Eastern Province &amp; Bahrain</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: View Full Quote Detail */}
        {selectedQuoteDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white">
                  Quote Details: {selectedQuoteDetail.id}
                </h4>
                <button
                  onClick={() => setSelectedQuoteDetail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-950 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Client</span>
                    <span className="font-bold text-white">{selectedQuoteDetail.clientName}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Company</span>
                    <span className="font-bold text-white">{selectedQuoteDetail.companyName}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <span className="font-bold text-amber-400">{selectedQuoteDetail.phone}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">City</span>
                    <span className="font-bold text-white">{selectedQuoteDetail.city}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                  <span className="text-slate-400 block text-[10px]">Requested Product</span>
                  <div className="font-bold text-white">{selectedQuoteDetail.productName}</div>
                  <div className="text-amber-400 font-bold">
                    {selectedQuoteDetail.quantity} Units — {selectedQuoteDetail.estimatedTotalSAR.toLocaleString()} SAR
                  </div>
                </div>

                {selectedQuoteDetail.config3D && (
                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl space-y-1.5">
                    <span className="text-indigo-400 font-bold block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Attached 3D Customizer Specs:
                    </span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                      <div>Primary Color: <strong>{selectedQuoteDetail.config3D.primaryColor}</strong></div>
                      <div>Finish: <strong>{selectedQuoteDetail.config3D.materialFinish}</strong></div>
                      <div>LED Billboard: <strong>{selectedQuoteDetail.config3D.hasLEDLight ? 'YES' : 'NO'}</strong></div>
                      <div>Custom Logo Text: <strong>"{selectedQuoteDetail.config3D.customText}"</strong></div>
                    </div>
                  </div>
                )}

                {selectedQuoteDetail.notes && (
                  <div className="p-3 bg-slate-950 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Client Notes</span>
                    <p className="text-slate-200 mt-1">{selectedQuoteDetail.notes}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedQuoteDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Product Form */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <form
              onSubmit={handleCreateProduct}
              className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-base font-bold text-white">Add New Catalog Item</h4>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Product Name (EN) *</label>
                  <input
                    required
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. ThermoShield 90L Mega Fleet Box"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Product Name (Arabic)</label>
                  <input
                    type="text"
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    placeholder="مثال: صندوق فايبرجلاس 90 لتر ضخم"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="delivery-boxes">Motorcycle Boxes</option>
                      <option value="thermal-bags">Thermal Bags</option>
                      <option value="rider-gear">Rider PPE</option>
                      <option value="custom-packaging">Custom Packaging</option>
                      <option value="vehicle-branding">Vehicle Branding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Price (SAR) *</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">MOQ (Units)</label>
                    <input
                      type="number"
                      value={newProdMoq}
                      onChange={(e) => setNewProdMoq(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Image URL</label>
                    <input
                      type="text"
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short description..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
