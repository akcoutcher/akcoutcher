import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types/database';
import { getGallery } from '../../lib/db';
import { Sparkles, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigate }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getGallery(true).then((items) => {
      setGallery(items);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean)))];

  const filteredItems = gallery.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Visual Chronicle
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Atelier Gallery
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Moments captured across our bridal runways, heritage needlecraft archives, and bespoke client silhouettes.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
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
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-stone-200/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No gallery images available yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Our couture photo archive is being uploaded. Check back soon or visit our Instagram to view our latest bridal creations.
            </p>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
            >
              Contact Our Atelier
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative rounded-xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-lg font-medium text-white">{item.title}</h4>
                  {item.caption && <p className="text-xs text-stone-300 line-clamp-2 mt-1">{item.caption}</p>}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#C5A059] font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Size</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Professional Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900/60 transition-colors z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-white rounded-full bg-stone-900/60 hover:bg-stone-800 transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-stone-300 hover:text-white rounded-full bg-stone-900/60 hover:bg-stone-800 transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center Content */}
          <div
            className="max-w-4xl max-h-[90vh] flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[activeLightboxIndex].image_url}
              alt={filteredItems[activeLightboxIndex].title}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-4 space-y-1 text-white max-w-xl">
              <span className="text-[11px] uppercase tracking-widest text-[#C5A059]">
                {filteredItems[activeLightboxIndex].category}
              </span>
              <h3 className="font-serif text-2xl font-light">
                {filteredItems[activeLightboxIndex].title}
              </h3>
              {filteredItems[activeLightboxIndex].caption && (
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  {filteredItems[activeLightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
