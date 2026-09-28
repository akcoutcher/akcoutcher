import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook, Youtube, Ruler, Heart } from 'lucide-react';
import { SiteSettings } from '../../types/database';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useCouture } from '../../context/CoutureContext';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const { setLookbookOpen, setMeasurementModalOpen } = useCouture();

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const businessDisplayName = settings.business_name || 'Ak Coutcher';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${businessDisplayName}, I am contacting you from your official website regarding bespoke bridal couture.`
      )}`
    : '#';

  return (
    <footer className="bg-[#1C1917] text-[#FAF7F2] border-t border-stone-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand & Atelier Story */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#FAF7F2] tracking-wide">
              {businessDisplayName}
            </h3>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium font-sans">
              Haute Couture Atelier
            </p>
            <p className="text-sm text-stone-400 font-light leading-relaxed">
              {settings.tagline || 'Where Tradition Meets Your Style'}. Handcrafting heirloom Punjabi salwar suits, bridal couture, regal silhouettes, and bespoke zardozi embroidery for discerning clients worldwide.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <PWAInstallButton variant="footer" />
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#C5A059]">The Atelier</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors cursor-pointer">
                  Haute Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/designs')} className="hover:text-white transition-colors cursor-pointer">
                  Runway Designs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors cursor-pointer">
                  Bespoke Tailoring &amp; Embroidery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/gallery')} className="hover:text-white transition-colors cursor-pointer">
                  Real Brides &amp; Trousseau
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  Designer Philosophy &amp; Heritage
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Appointments & Bespoke */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#C5A059]">Client Concierge</h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('/book-appointment')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Book Fitting Consultation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/custom-order')} className="hover:text-white transition-colors text-left cursor-pointer">
                  Custom Couture Commission
                </button>
              </li>
              <li>
                <button
                  onClick={() => setMeasurementModalOpen(true)}
                  className="hover:text-[#C5A059] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Interactive Measurement Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLookbookOpen(true)}
                  className="hover:text-[#C5A059] transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>My Saved Lookbook</span>
                </button>
              </li>
              {cleanWhatsapp && (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp VIP Concierge</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Atelier Location & Hours */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#C5A059]">Atelier Flagship</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{settings.address || 'Adampur Doaba, Distt. Jalandhar, Pin Code 144102, Punjab'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phone || '+919501657426'}`} className="hover:text-white">
                  {settings.phone || '+91 95016 57426'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`mailto:${settings.email || 'akcoutcher@gmail.com'}`} className="hover:text-white">
                  {settings.email || 'akcoutcher@gmail.com'}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.opening_hours || 'Mon - Sat: 10:30 AM - 8:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-light">
          <p>© {currentYear} {businessDisplayName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/privacy-policy')} className="hover:text-stone-300 cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-stone-300 cursor-pointer">
              Terms &amp; Conditions
            </button>
            <a href="#root" className="hover:text-stone-300 cursor-pointer">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
