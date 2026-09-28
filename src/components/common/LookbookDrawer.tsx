import React from 'react';
import { X, Trash2, Calendar, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';
import { SiteSettings } from '../../types/database';

interface LookbookDrawerProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const LookbookDrawer: React.FC<LookbookDrawerProps> = ({ settings, onNavigate }) => {
  const { wishlist, removeFromWishlist, lookbookOpen, setLookbookOpen, formatPrice } = useCouture();

  if (!lookbookOpen) return null;

  const totalEstimate = wishlist.reduce((acc, item) => acc + (item.price || 0), 0);

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const itemNames = wishlist.map((item) => `${item.name} (Code: ${item.code || 'Bespoke'})`).join('\n• ');
  const whatsappLookbookUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.business_name || 'AK COUTURE'},\n\nI have saved these outfits in my personal Lookbook and would like to inquire about bespoke fittings, custom colorways, and availability:\n\n• ${itemNames}\n\nPlease share details and consultation slots.`
      )}`
    : '#';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setLookbookOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1C1917] shadow-2xl flex flex-col border-l border-[#EADDD0]">
          {/* Header */}
          <div className="px-6 py-5 bg-[#2D080E] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/40">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
              <div>
                <h2 className="font-serif text-xl tracking-wide">My Saved Lookbook</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                  {wishlist.length} {wishlist.length === 1 ? 'Ensemble' : 'Ensembles'} Curated
                </p>
              </div>
            </div>
            <button
              onClick={() => setLookbookOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#EADDD0]/50 flex items-center justify-center text-stone-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl text-[#58111A]">Your Lookbook is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Browse our Haute Couture collections and tap the heart icon on any silhouette to curate your dream bridal trousseau.
                </p>
                <button
                  onClick={() => {
                    setLookbookOpen(false);
                    onNavigate('/collections');
                  }}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#58111A] text-white rounded hover:bg-[#6B1D2F] transition cursor-pointer"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-[#EADDD0] shadow-sm hover:shadow transition"
                  >
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={item.cover_image || '/src/assets/images/bridal_ak_girl_1790594555283.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-medium text-stone-900 truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.fabric_details && (
                          <p className="text-[11px] text-stone-500 truncate">{item.fabric_details}</p>
                        )}
                        {item.code && (
                          <span className="text-[10px] font-mono text-[#C5A059] font-medium">
                            {item.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-[#58111A]">
                          {formatPrice(item.price)}
                        </span>
                        <button
                          onClick={() => {
                            setLookbookOpen(false);
                            onNavigate(`/designs/${item.slug || item.id}`);
                          }}
                          className="text-[11px] text-stone-600 hover:text-[#58111A] flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {wishlist.length > 0 && (
            <div className="p-6 bg-[#FAF7F2] border-t border-[#EADDD0] space-y-3">
              {totalEstimate > 0 && (
                <div className="flex items-center justify-between text-xs pb-1">
                  <span className="text-stone-600 uppercase tracking-wider font-medium">Estimated Value:</span>
                  <span className="font-serif text-base font-semibold text-[#58111A]">
                    {formatPrice(totalEstimate)}
                  </span>
                </div>
              )}

              {cleanWhatsapp && (
                <a
                  href={whatsappLookbookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-800" />
                  <span>Inquire All on WhatsApp</span>
                </a>
              )}

              <button
                onClick={() => {
                  setLookbookOpen(false);
                  onNavigate('/book-appointment');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition cursor-pointer shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Book Atelier Consultation</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
