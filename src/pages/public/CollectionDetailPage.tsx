import React, { useState, useEffect } from 'react';
import { CollectionItem, DesignItem, SiteSettings } from '../../types/database';
import { getCollectionBySlug, getDesigns } from '../../lib/db';
import { ArrowLeft, MessageCircle, Calendar, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

interface CollectionDetailPageProps {
  slug: string;
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({
  slug,
  settings,
  onNavigate,
}) => {
  const [collection, setCollection] = useState<CollectionItem | null>(null);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { formatPrice, isInWishlist, toggleWishlist } = useCouture();

  useEffect(() => {
    async function load() {
      const col = await getCollectionBySlug(slug);
      setCollection(col);
      if (col) {
        const allDesigns = await getDesigns(true, col.id);
        setDesigns(allDesigns);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-sm font-serif">
        Loading collection details...
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#58111A]">Collection Not Found</h2>
        <p className="text-xs text-stone-500">The requested collection does not exist or may have been archived.</p>
        <button
          onClick={() => onNavigate('/collections')}
          className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
        >
          Return to All Collections
        </button>
      </div>
    );
  }

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.business_name || 'AK Couture'}, I would like to inquire about the "${collection.name}" collection.`
      )}`
    : '#';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Back link */}
        <button
          onClick={() => onNavigate('/collections')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-[#58111A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </button>

        {/* Hero Banner for Collection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#F4EFE6] border border-[#EADBCE] rounded-3xl overflow-hidden p-6 sm:p-12 shadow-sm">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
              {collection.category || 'Atelier Collection'}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light leading-tight">
              {collection.name}
            </h1>
            <p className="text-sm text-stone-700 leading-relaxed font-light whitespace-pre-line">
              {collection.description || 'A timeless collection celebrating Punjabi couture traditions.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/book-appointment')}
                className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded-xl transition-all shadow cursor-pointer active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Book Fitting Appointment</span>
              </button>
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-300 bg-stone-100">
              {collection.cover_image ? (
                <img
                  src={collection.cover_image}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <Sparkles className="w-12 h-12 text-[#C5A059]" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Designs under this collection */}
        <div className="space-y-8">
          <div className="border-b border-stone-200 pb-4">
            <h2 className="font-serif text-3xl text-[#58111A]">Ensembles in this Collection</h2>
            <p className="text-xs text-stone-500">Each garment is handcrafted to order and tailored to your specifications.</p>
          </div>

          {designs.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center max-w-md mx-auto">
              <Sparkles className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
              <h3 className="font-serif text-lg font-medium text-stone-800 mb-1">No designs added to this collection yet.</h3>
              <p className="text-xs text-stone-500 mb-4">
                You can inquire directly with our designer to commission a custom ensemble in this collection&apos;s aesthetic.
              </p>
              <button
                onClick={() => onNavigate('/custom-order')}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
              >
                Request Custom Piece
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {designs.map((design) => {
                const inWishlist = isInWishlist(design.id);
                return (
                  <div
                    key={design.id}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(design);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow cursor-pointer ${
                          inWishlist
                            ? 'bg-white text-red-600'
                            : 'bg-white/80 text-stone-700 hover:text-red-600 hover:bg-white'
                        }`}
                        title={inWishlist ? 'Remove from Lookbook' : 'Save to Lookbook'}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-600' : ''}`} />
                      </button>

                      <div className="p-4 space-y-1">
                        <span className="text-[11px] text-stone-500 uppercase tracking-wider text-[#C5A059] font-medium block">
                          {design.category}
                        </span>
                        <h3
                          onClick={() => onNavigate(`/designs/${design.slug}`)}
                          className="font-serif text-lg font-medium text-stone-900 group-hover:text-[#58111A] truncate cursor-pointer"
                        >
                          {design.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                        <p className="text-xs font-semibold text-[#58111A]">
                          {formatPrice(design.price)}
                        </p>
                        <button
                          onClick={() => onNavigate(`/designs/${design.slug}`)}
                          className="text-[11px] text-stone-600 group-hover:text-[#58111A] flex items-center gap-0.5 cursor-pointer font-medium"
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
    </div>
  );
};
