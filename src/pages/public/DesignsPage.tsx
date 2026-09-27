import React, { useState, useEffect } from 'react';
import { DesignItem } from '../../types/database';
import { getDesigns } from '../../lib/db';
import { Sparkles, Search, Heart, ArrowRight, Filter } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

interface DesignsPageProps {
  onNavigate: (path: string) => void;
}

export const DesignsPage: React.FC<DesignsPageProps> = ({ onNavigate }) => {
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { formatPrice, isInWishlist, toggleWishlist } = useCouture();

  useEffect(() => {
    getDesigns(true).then((data) => {
      setDesigns(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(designs.map((d) => d.category).filter(Boolean)))];

  const filteredDesigns = designs.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.category && d.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.code && d.code.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Bespoke Creations
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Haute Couture Designs
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Every suit, lehenga, and silhouette is an original composition, customized to your measurements and preferred color palette.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-6">
          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <span className="text-xs text-stone-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#58111A] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search designs, codes, fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#58111A] text-stone-800"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-stone-200/60 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No matching designs found.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Our master couturier creates bespoke suits tailored to your inspiration. Share your preferred dress design and reference image for custom tailoring.
            </p>
            <button
              onClick={() => onNavigate('/custom-order')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded-lg cursor-pointer"
            >
              Request Custom Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => {
              const inWishlist = isInWishlist(design.id);
              return (
                <div
                  key={design.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      onClick={() => onNavigate(`/designs/${design.slug}`)}
                      className="aspect-[3/4] bg-stone-100 overflow-hidden relative cursor-pointer"
                    >
                      {design.cover_image ? (
                        <img
                          src={design.cover_image}
                          alt={design.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Sparkles className="w-8 h-8 text-[#C5A059]" />
                        </div>
                      )}
                      {design.featured && (
                        <div className="absolute top-3 left-3 bg-[#58111A] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(design);
                      }}
                      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow transition cursor-pointer ${
                        inWishlist
                          ? 'bg-white text-red-600'
                          : 'bg-white/80 text-stone-700 hover:text-red-600 hover:bg-white'
                      }`}
                      title={inWishlist ? 'Remove from Lookbook' : 'Save to Lookbook'}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-600' : ''}`} />
                    </button>

                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="uppercase tracking-wider text-[#C5A059] font-medium">
                          {design.category}
                        </span>
                        {design.code && <span className="font-mono text-stone-400">{design.code}</span>}
                      </div>
                      <h3
                        onClick={() => onNavigate(`/designs/${design.slug}`)}
                        className="font-serif text-xl font-medium text-stone-900 group-hover:text-[#58111A] transition-colors truncate cursor-pointer"
                      >
                        {design.name}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                        {design.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                      <span className="text-xs font-semibold text-[#58111A]">
                        {formatPrice(design.price)}
                      </span>
                      <button
                        onClick={() => onNavigate(`/designs/${design.slug}`)}
                        className="text-[11px] text-stone-600 group-hover:text-[#58111A] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
