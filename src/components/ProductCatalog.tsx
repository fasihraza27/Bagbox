import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { Sparkles, Search, Filter, Box, Eye, MessageSquare, Star, ArrowUpRight } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpen3DStudio: (product: Product) => void;
  onAddToQuote: (product: Product, quantity: number) => void;
  lang: 'en' | 'ar';
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onOpen3DStudio,
  onAddToQuote,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Solutions', labelAr: 'جميع المنتجات' },
    { id: 'delivery-boxes', label: 'Motorcycle Boxes', labelAr: 'صناديق الدراجات' },
    { id: 'thermal-bags', label: 'Thermal Bags & Backpacks', labelAr: 'الحقائب الحرارية' },
    { id: 'rider-gear', label: 'Rider PPE & Uniforms', labelAr: 'معدات وملابس السائقين' },
    { id: 'custom-packaging', label: 'Custom Packaging', labelAr: 'التغليف المطبوع' },
    { id: 'vehicle-branding', label: 'Fleet Vehicle Branding', labelAr: 'تغليف وتجليد الأساطيل' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameAr.includes(searchQuery) ||
        p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="products" className="py-16 sm:py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Box className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'كتالوج المنتجات الرسمي' : 'Commercial Fleet Catalog'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {lang === 'ar'
                ? 'حلول التوصيل والتغليف الصناعي'
                : 'Engineered for Fleet Performance'}
            </h2>
            <p className="text-slate-400 text-sm max-w-xl">
              {lang === 'ar'
                ? 'استكشف تشكيلتنا الواسعة من صناديق الفايبرجلاس، حقائب التوصيل الحرارية، ومعدات السلامة المصممة خصيصاً للظروف المناخية في السعودية.'
                : 'Browse heavy-duty fiberglass delivery boxes, thermal insulated backpacks, SASO helmets, and custom luxury retail packaging.'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="input-catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث عن منتج، خوذة، صندوق...' : 'Search boxes, bags, helmets...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ProductCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
            <Box className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search criteria or reset category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/5"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.isPopular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-md">
                        Bestseller
                      </span>
                    )}
                    {product.is3DSupported && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/80 text-white backdrop-blur-md flex items-center gap-1 border border-indigo-400/40">
                        <Sparkles className="w-3 h-3" />
                        3D Ready
                      </span>
                    )}
                  </div>

                  {/* Rating pill */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-amber-400 flex items-center gap-1 border border-slate-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                      <span>{product.category.replace('-', ' ')}</span>
                      <span className="text-slate-600">•</span>
                      <span>MOQ: {product.moq} pcs</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                      {lang === 'ar' ? product.nameAr : product.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lang === 'ar' ? product.shortDescAr : product.shortDesc}
                    </p>

                    {/* Tag chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Fleet Price</span>
                      <span className="text-lg font-black text-white">
                        {product.priceSAR}{' '}
                        <span className="text-xs font-bold text-amber-400">SAR</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {product.is3DSupported && (
                        <button
                          type="button"
                          onClick={() => onOpen3DStudio(product)}
                          title="Open in 3D Customizer"
                          className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 transition-all border border-amber-500/30"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Specs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddToQuote(product, product.moq)}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
