import React, { useState, useEffect } from 'react';
import { CollectionItem, DesignItem, SiteSettings } from '../../types/database';
import { getCollectionBySlug, getDesigns } from '../../lib/db';
import { ArrowLeft, MessageCircle, Calendar, Sparkles } from 'lucide-react';

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
      <div className="min-h-[60vh] flex items-center justify-center text-stone-500 text-sm">
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
          className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
        >
          Return to All Collections
        </button>
      </div>
    );
  }

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello, I would like to inquire about the "${collection.name}" collection from Kaur Couture.`
      )}`
    : '#';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Back link */}
        <button
          onClick={() => onNavigate('/collections')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-[#58111A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collections</span>
        </button>

        {/* Hero Banner for Collection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#F4EFE6] border border-[#EADBCE] rounded-2xl overflow-hidden p-6 sm:p-10">
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
                className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Book Fitting Appointment</span>
              </button>
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-stone-300 bg-stone-100">
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
                You can inquire directly with our designer to commission a custom ensemble in this collection's aesthetic.
              </p>
              <button
                onClick={() => onNavigate('/custom-order')}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
              >
                Request Custom Piece
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {designs.map((design) => (
                <div
                  key={design.id}
                  onClick={() => onNavigate(`/designs/${design.slug}`)}
                  className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all"
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
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[11px] text-stone-500">{design.category}</span>
                    <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-[#58111A] truncate">
                      {design.name}
                    </h3>
                    <p className="text-xs font-medium text-[#58111A] pt-1">
                      {design.price ? `₹${Number(design.price).toLocaleString('en-IN')}` : design.price_label || 'Price on Request'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
