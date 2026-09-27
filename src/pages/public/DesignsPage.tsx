import React, { useState, useEffect } from 'react';
import { DesignItem } from '../../types/database';
import { getDesigns } from '../../lib/db';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';

interface DesignsPageProps {
  onNavigate: (path: string) => void;
}

export const DesignsPage: React.FC<DesignsPageProps> = ({ onNavigate }) => {
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
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
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#58111A] text-white'
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
              placeholder="Search designs or fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#58111A] text-stone-800"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-stone-200/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No designs available yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Our master couturier creates bespoke suits tailored to your inspiration. Share your preferred dress design and reference image for custom tailoring.
            </p>
            <button
              onClick={() => onNavigate('/custom-order')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded"
            >
              Request Custom Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                onClick={() => onNavigate(`/designs/${design.slug}`)}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] bg-stone-100 overflow-hidden relative">
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
                    <div className="absolute top-2 left-2 bg-[#58111A] text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                    {design.category}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-[#58111A] transition-colors truncate">
                    {design.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                    {design.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                    <span className="text-xs font-semibold text-[#58111A]">
                      {design.price ? `₹${Number(design.price).toLocaleString('en-IN')}` : design.price_label || 'Price on Request'}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium group-hover:text-[#58111A]">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
