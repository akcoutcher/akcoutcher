import React, { useState } from 'react';
import { Menu, X, Calendar, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../../types/database';

interface HeaderProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const whatsappHref = settings.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        'Hello Kaur Couture, I would like to inquire about your bespoke Punjabi suits and couture collection.'
      )}`
    : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADDD0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single Brand Title / Logo */}
        <div className="flex items-center">
          <button
            onClick={() => handleNav('/')}
            className="group text-left focus:outline-none flex items-center gap-3"
          >
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.business_name} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#58111A] group-hover:text-[#6B1D2F] transition-colors">
                  {settings.business_name || 'Kaur Couture'}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-medium font-sans -mt-1">
                  Haute Couture Atelier
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text, no pill badges) */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-wider font-medium text-stone-700">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`relative py-1 transition-colors hover:text-[#58111A] ${
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

        {/* Zone 3: Primary Action & Direct WhatsApp Touchpoint */}
        <div className="hidden sm:flex items-center gap-3">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-200/50 rounded-full transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={() => handleNav('/book-appointment')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#58111A] hover:bg-[#6B1D2F] active:scale-[0.99] rounded transition-all shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handleNav('/book-appointment')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#58111A] rounded sm:hidden"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-800 hover:text-[#58111A] rounded-lg focus:outline-none"
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
                className={`text-left px-3 py-2 text-sm font-medium rounded ${
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
              className="text-left px-3 py-2 text-sm font-medium text-stone-700 hover:bg-[#F3ECE1]"
            >
              Custom Order Enquiry
            </button>
          </nav>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <button
              onClick={() => handleNav('/book-appointment')}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
            >
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <span>Book Appointment</span>
            </button>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100"
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
