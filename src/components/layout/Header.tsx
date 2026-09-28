import React, { useState } from 'react';
import { Menu, X, Calendar, MessageCircle, Heart, Ruler, Globe } from 'lucide-react';
import { SiteSettings } from '../../types/database';
import { useCouture, CURRENCIES, CurrencyCode } from '../../context/CoutureContext';

interface HeaderProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const { currency, setCurrency, wishlist, setLookbookOpen, setMeasurementModalOpen } = useCouture();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Designs', path: '/designs' },
    { label: 'Services', path: '/services' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappHref = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.business_name || 'AK Couture'}, I would like to inquire about your bespoke couture collection and fitting consultations.`
      )}`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADDD0] transition-all">
      {/* Top micro-bar for international currency & quick atelier touchpoints */}
      <div className="bg-[#1C1917] text-[#FAF7F2] text-[11px] py-1.5 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#C5A059] font-medium tracking-widest uppercase hidden sm:inline">
              Haute Couture Atelier
            </span>
            <span className="text-stone-400 truncate">
              {settings.address ? settings.address.split(',')[0] : 'Adampur Doaba'} • Bespoke Global Delivery
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 text-stone-300 hover:text-white transition cursor-pointer font-medium"
              >
                <Globe className="w-3 h-3 text-[#C5A059]" />
                <span>{CURRENCIES[currency].label}</span>
              </button>

              {currencyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-[#262220] border border-stone-700 rounded-lg shadow-xl z-50 py-1 text-xs">
                    {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 transition flex items-center justify-between cursor-pointer ${
                          currency === c ? 'bg-[#58111A] text-white font-medium' : 'text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <span>{c}</span>
                        <span className="text-[#C5A059] font-mono">{CURRENCIES[c].symbol}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bespoke Fit Guide trigger */}
            <button
              onClick={() => setMeasurementModalOpen(true)}
              className="hidden md:flex items-center gap-1 text-stone-300 hover:text-[#C5A059] transition cursor-pointer"
            >
              <Ruler className="w-3 h-3 text-[#C5A059]" />
              <span>Measurement Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center">
          <button
            onClick={() => handleNav('/')}
            className="group text-left focus:outline-none flex items-center gap-3 cursor-pointer"
          >
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.business_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#58111A] group-hover:text-[#6B1D2F] transition-colors">
                  {settings.business_name === 'Kaur Couture' || !settings.business_name ? 'Ak Coutcher' : settings.business_name}
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A059] font-semibold font-sans -mt-1">
                  Haute Couture Atelier
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-wider font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`relative py-1 transition-colors hover:text-[#58111A] cursor-pointer ${
                  isActive ? 'text-[#58111A] font-semibold' : 'text-stone-700'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Touchpoints: Lookbook, WhatsApp, Book Appointment */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Lookbook Drawer trigger */}
          <button
            onClick={() => setLookbookOpen(true)}
            className="relative p-2 text-stone-700 hover:text-[#58111A] hover:bg-stone-200/50 rounded-full transition cursor-pointer"
            title="My Saved Lookbook"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#58111A] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          )}

          <button
            onClick={() => handleNav('/book-appointment')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#58111A] hover:bg-[#6B1D2F] active:scale-[0.99] rounded transition-all shadow-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Book Fitting</span>
          </button>
        </div>

        {/* Mobile Hamburger & Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Lookbook badge mobile */}
          <button
            onClick={() => setLookbookOpen(true)}
            className="relative p-2 text-stone-700 hover:text-[#58111A] rounded-full cursor-pointer"
            title="Lookbook"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#58111A] text-white text-[9px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-800 hover:text-[#58111A] rounded-lg focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#EADDD0] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left px-3 py-2 text-sm font-medium rounded cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-[#EFE8DC] text-[#58111A] font-semibold'
                    : 'text-stone-700 hover:bg-[#F3ECE1]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/custom-order')}
              className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#F3ECE1] cursor-pointer"
            >
              Custom Couture Order
            </button>
            <button
              onClick={() => {
                setMeasurementModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#F3ECE1] flex items-center gap-2 cursor-pointer"
            >
              <Ruler className="w-4 h-4 text-[#C5A059]" />
              <span>Bespoke Measurement Guide</span>
            </button>
          </nav>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/book-appointment')}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Book Atelier Fitting</span>
            </button>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
