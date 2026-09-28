import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { SiteSettings } from '../../types/database';

interface FloatingWhatsAppButtonProps {
  settings: SiteSettings;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '919501657426';
  const consultantName = 'ANMOL KAUR';
  const brandName = settings.business_name || 'AK COUTURE';

  const defaultMessage = `Hello ${consultantName} (${brandName}), I would like to inquire about bespoke Punjabi suits, bridal couture, and custom styling consultations.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Tooltip / Popup card on hover or first load */}
      <div
        className={`pointer-events-auto mb-3 transition-all duration-300 transform origin-bottom-right ${
          showTooltip ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="w-72 sm:w-80 bg-stone-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-[#C5A059]/40 p-4 relative overflow-hidden">
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#58111A]" />

          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-3 right-3 text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-emerald-700/80 border border-emerald-400/60 flex items-center justify-center text-white shadow-md">
                <MessageCircle className="w-6 h-6 fill-white/20" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold text-white tracking-wide">{consultantName}</h4>
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
              </div>
              <p className="text-[11px] text-[#C5A059] font-medium uppercase tracking-wider">
                {brandName} • Direct Atelier Chat
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-stone-300 leading-relaxed font-light">
            Need quick styling advice, fabric consultation, or custom measurements? Chat directly with us on WhatsApp.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-lg active:scale-98"
          >
            <span>Start Chat with {consultantName}</span>
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Floating Trigger Button (Round WhatsApp Logo Button) */}
      <div className="pointer-events-auto relative group">
        {/* Subtle pulsing background ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping opacity-75 group-hover:opacity-100" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl border-2 border-white/30 active:scale-95 hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label={`Chat with ${consultantName} on WhatsApp`}
        >
          {/* Authentic WhatsApp SVG Logo */}
          <svg
            className="w-7 h-7 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
