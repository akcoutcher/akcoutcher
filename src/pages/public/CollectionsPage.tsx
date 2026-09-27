import React, { useState, useEffect } from 'react';
import { CollectionItem } from '../../types/database';
import { getCollections } from '../../lib/db';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CollectionsPageProps {
  onNavigate: (path: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollections(true).then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Haute Couture Archives
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Explore our themed bridal, festive, and heritage suites, thoughtfully conceptualized with authentic needlecraft.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-stone-200/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No collections available yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Our couture collections are currently in development. You can book an appointment or explore bespoke custom suit orders directly with our atelier.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/book-appointment')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
              >
                Book Appointment
              </button>
              <button
                onClick={() => onNavigate('/custom-order')}
                className="w-full sm:w-auto px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-stone-700 bg-stone-100 rounded"
              >
                Custom Suit Request
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col) => (
              <div
                key={col.id}
                onClick={() => onNavigate(`/collections/${col.slug}`)}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] bg-stone-100 overflow-hidden relative">
                  {col.cover_image ? (
                    <img
                      src={col.cover_image}
                      alt={col.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Sparkles className="w-8 h-8 text-[#C5A059]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-xs uppercase tracking-wider text-white font-medium flex items-center gap-1.5">
                      <span>View Collection Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                    {col.category || 'Couture Suite'}
                  </span>
                  <h3 className="font-serif text-2xl text-stone-900 group-hover:text-[#58111A] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                    {col.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
