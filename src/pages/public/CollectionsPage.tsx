import React, { useState, useEffect, useRef } from 'react';
import {
  ProductItem,
  ProductFilterOptions,
  ALL_PRODUCT_CATEGORIES,
} from '../../types/product';
import {
  getAllProducts,
  getNewArrivals,
  getBestsellers,
  getTrendingProducts,
} from '../../lib/productDb';
import { ProductCard } from '../../components/collections/ProductCard';
import { CollectionFilterSidebar } from '../../components/collections/CollectionFilterSidebar';
import { QuickViewModal } from '../../components/collections/QuickViewModal';
import { useCouture } from '../../context/CoutureContext';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Crown,
  Flame,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';

interface CollectionsPageProps {
  onNavigate: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const { quickViewProduct, setQuickViewProduct } = useCouture();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductItem[]>([]);
  const [bestsellers, setBestsellers] = useState<ProductItem[]>([]);
  const [trending, setTrending] = useState<ProductItem[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Search & Filter state
  const [filters, setFilters] = useState<ProductFilterOptions>({
    category: 'ALL',
    sortBy: 'featured',
    searchQuery: '',
  });

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Load products based on filters
  useEffect(() => {
    const list = getAllProducts(filters);
    setProducts(list);
    setNewArrivals(getNewArrivals(4));
    setBestsellers(getBestsellers(4));
    setTrending(getTrendingProducts(4));
  }, [filters]);

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    scrollToCatalog();
  };

  const handleExploreNewArrivals = () => {
    setFilters((prev) => ({ ...prev, category: 'NEW ARRIVALS', sortBy: 'newest' }));
    scrollToCatalog();
  };

  // Editorial featured banner definitions
  const featuredBanners = [
    {
      id: 'wedding-edit',
      title: 'WEDDING EDIT',
      subtitle: 'Explore elegant wedding fashion.',
      description: 'Regal velvet kalis, intricate zardozi needlework, and heirloom bridal ensembles tailored to bespoke patron measurements.',
      image: '/src/assets/images/hero_ak_couture_1790594513046.jpg',
      categoryTarget: 'WEDDING COLLECTION',
    },
    {
      id: 'festive-edit',
      title: 'FESTIVE EDIT',
      subtitle: 'Celebrate every occasion in style.',
      description: 'Handwoven Chanderi silks, gota-patti scalloped dupattas, and fluid silhouettes designed for joy and timeless grace.',
      image: '/src/assets/images/kurta_set_luxury_1790595502886.jpg',
      categoryTarget: 'FESTIVE COLLECTION',
    },
    {
      id: 'beauty-edit',
      title: 'BEAUTY EDIT',
      subtitle: 'Beauty essentials for your signature look.',
      description: 'Intense hydrating velvet matte lipsticks and 24-hour waterproof calligraphy eyeliners curated for flawless couture glam.',
      image: '/src/assets/images/lipstick_red_luxury_1790595441734.jpg',
      categoryTarget: 'MAKEUP & BEAUTY',
    },
    {
      id: 'handbags-edit',
      title: 'PREMIUM HANDBAGS',
      subtitle: 'Elevate your everyday style.',
      description: 'Structured vegan calfskin totes and 24k gold-plated evening minaudières blending Italian architecture with daily function.',
      image: '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
      categoryTarget: 'HANDBAGS',
    },
    {
      id: 'ethnic-edit',
      title: 'ETHNIC EDIT',
      subtitle: 'Timeless Indian fashion with a modern touch.',
      description: 'Handcrafted Punjabi suits, Patiala silhouettes, and heritage zardozi ensembles celebrated across worldwide ateliers.',
      image: '/src/assets/images/bridal_ak_girl_1790594555283.jpg',
      categoryTarget: 'ETHNIC WEAR',
    },
  ];

  return (
    <div className="w-full bg-[#F8F7F4] text-[#151515] pb-24">
      {/* ---------------------------------------------------- */}
      {/* 1. EDITORIAL HERO BANNER                             */}
      {/* ---------------------------------------------------- */}
      <section className="relative min-h-[550px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
        {/* Background Fashion Visual */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_ak_couture_1790594513046.jpg"
            alt="AK COUTURE Collections"
            className="w-full h-full object-cover object-center opacity-45 filter contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0B0B0B]/40 to-[#0B0B0B]" />
        </div>

        {/* Hero Copy */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#C9A227]/60 backdrop-blur-md text-[11px] uppercase tracking-[0.3em] text-[#E6C65C] font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Haute Couture • Beauty • Luxury Lifestyle</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-balance">
            AK COUTURE COLLECTIONS
          </h1>

          <p className="text-sm sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            "Discover fashion, beauty and accessories curated for your unique style."
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCatalog}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B0B0B] bg-[#C9A227] hover:bg-[#E6C65C] active:scale-[0.99] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#0B0B0B]" />
              <span>SHOP COLLECTIONS</span>
            </button>

            <button
              onClick={handleExploreNewArrivals}
              className="w-full sm:w-auto px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE NEW ARRIVALS</span>
              <ArrowRight className="w-4 h-4 text-[#C9A227]" />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. VALUE PROPOSITIONS BAR                           */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white border-y border-stone-200 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-stone-100">
          <div className="px-2">
            <p className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">Bespoke Atelier Fit</p>
            <p className="text-[11px] text-stone-500 font-light">Custom tailoring to your exact body measurements</p>
          </div>
          <div className="px-2">
            <p className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">Complimentary Shipping</p>
            <p className="text-[11px] text-stone-500 font-light">Free express delivery on all orders above ₹2,000</p>
          </div>
          <div className="px-2">
            <p className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">Clean Luxury Formulations</p>
            <p className="text-[11px] text-stone-500 font-light">Cruelty-free botanical beauty and dermatologist tested</p>
          </div>
          <div className="px-2">
            <p className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">100% Authentic Heritage</p>
            <p className="text-[11px] text-stone-500 font-light">Handcrafted by master karigars with gold seal quality</p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. FEATURED EDITORIAL COLLECTION BANNERS             */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold">
            Curated Edits
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal">
            Signature Seasonal Highlights
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Immerse yourself in thematic stories bridging Punjabi artisan traditions and international luxury elegance.
          </p>
        </div>

        {/* Grid of 5 Luxury Editorial Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBanners.map((banner, index) => {
            const isLarge = index === 0 || index === 3;
            return (
              <div
                key={banner.id}
                className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-200/80 bg-[#151515] flex flex-col justify-end min-h-[380px] sm:min-h-[420px] ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-1'
                }`}
              >
                {/* Banner Background */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                {/* Banner Content */}
                <div className="relative p-6 sm:p-8 space-y-2.5 text-white max-w-lg">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest bg-black/60 border border-[#C9A227]/40 text-[#E6C65C]">
                    Editorial Feature
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                    {banner.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-200 font-light line-clamp-2">
                    {banner.description}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectCategory(banner.categoryTarget)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/95 hover:bg-[#C9A227] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. DEDICATED SECTIONS: NEW ARRIVALS, BESTSELLERS     */}
      {/* ---------------------------------------------------- */}

      {/* NEW ARRIVALS SECTION */}
      {newArrivals.length > 0 && (
        <section className="bg-white py-14 border-y border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                  Just In
                </span>
                <h2 className="font-serif text-3xl text-[#0B0B0B]">NEW ARRIVALS</h2>
              </div>
              <button
                onClick={handleExploreNewArrivals}
                className="text-xs uppercase tracking-wider font-semibold text-[#58111A] hover:text-[#0B0B0B] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>View All New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onNavigate={onNavigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BESTSELLERS SECTION */}
      {bestsellers.length > 0 && (
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
                  Patron Favorites
                </span>
                <h2 className="font-serif text-3xl text-[#0B0B0B]">BESTSELLERS</h2>
              </div>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, sortBy: 'bestselling', category: 'ALL' }));
                  scrollToCatalog();
                }}
                className="text-xs uppercase tracking-wider font-semibold text-[#58111A] hover:text-[#0B0B0B] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>Shop All Bestsellers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestsellers.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onNavigate={onNavigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING NOW SECTION */}
      {trending.length > 0 && (
        <section className="bg-stone-100/70 py-14 border-y border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#C9A227]" />
                  In High Demand
                </span>
                <h2 className="font-serif text-3xl text-[#0B0B0B]">TRENDING NOW</h2>
              </div>
              <button
                onClick={() => {
                  setFilters((prev) => ({ ...prev, sortBy: 'featured', category: 'ALL' }));
                  scrollToCatalog();
                }}
                className="text-xs uppercase tracking-wider font-semibold text-[#58111A] hover:text-[#0B0B0B] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <span>Explore Trending Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {trending.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onNavigate={onNavigate}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. MAIN EXPANDABLE CATALOGUE WITH FULL FILTERS       */}
      {/* ---------------------------------------------------- */}
      <section
        ref={catalogSectionRef}
        id="catalog-grid"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8"
      >
        <div className="border-b border-stone-200 pb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold">
                Complete Collection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-light">
                Shop The Atelier Archive
              </h2>
            </div>

            {/* Prominent Search Box */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Search products, fabric, SKU, tag..."
                value={filters.searchQuery || ''}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 16 Main Categories Expandable Horizontal Pill Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">
            <button
              onClick={() => handleSelectCategory('ALL')}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                !filters.category || filters.category === 'ALL'
                  ? 'bg-[#0B0B0B] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-300 hover:border-stone-500'
              }`}
            >
              ALL COLLECTIONS
            </button>
            {ALL_PRODUCT_CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B0B0B] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-300 hover:border-stone-500'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Controls Bar: Sort, Filter Trigger, Results Count */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-xs font-medium text-stone-800 shadow-2xs hover:bg-stone-50 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Filters</span>
              </button>

              <span className="text-xs text-stone-500 font-mono">
                Showing <strong className="text-stone-900 font-semibold">{products.length}</strong> creations
              </span>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="hidden sm:inline text-stone-500">Sort By:</span>
              <div className="relative">
                <select
                  value={filters.sortBy || 'featured'}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as any,
                    }))
                  }
                  className="appearance-none bg-white border border-stone-300 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#C9A227] cursor-pointer"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="top_rated">Top Customer Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar Container */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <CollectionFilterSidebar
            filters={filters}
            onChangeFilters={setFilters}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
            totalProductsCount={products.length}
          />

          {/* Product Grid: 4 Desktop / 3 Tablet / 2 Mobile */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Sparkles className="w-6 h-6 text-[#C9A227]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-stone-900 font-medium">No Products Found</h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    We could not find any items matching your selected criteria. Try resetting filters or adjusting search terms.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setFilters({ category: 'ALL', sortBy: 'featured', searchQuery: '' })
                  }
                  className="px-5 py-2.5 rounded-lg bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#58111A] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onNavigate={onNavigate}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick View Pop-Up Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
};
