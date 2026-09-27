import React, { useState, useEffect } from 'react';
import { DesignItem, SiteSettings } from '../../types/database';
import { getDesignBySlug } from '../../lib/db';
import { ArrowLeft, MessageCircle, Calendar, Sparkles, Scissors, Ruler, ShieldCheck, Heart, Share2, Check } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

interface DesignDetailPageProps {
  slug: string;
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const DesignDetailPage: React.FC<DesignDetailPageProps> = ({
  slug,
  settings,
  onNavigate,
}) => {
  const [design, setDesign] = useState<DesignItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const { formatPrice, isInWishlist, toggleWishlist, setMeasurementModalOpen, currency } = useCouture();

  useEffect(() => {
    async function load() {
      const d = await getDesignBySlug(slug);
      setDesign(d);
      if (d) {
        setSelectedImage(d.cover_image || (d.images && d.images[0]) || '');
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center text-stone-500 text-sm font-serif">
        Loading haute couture ensemble...
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#58111A]">Design Not Found</h2>
        <p className="text-xs text-stone-500">The requested design could not be found or may have been archived.</p>
        <button
          onClick={() => onNavigate('/designs')}
          className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
        >
          Return to Designs
        </button>
      </div>
    );
  }

  const galleryImages = [
    ...(design.cover_image ? [design.cover_image] : []),
    ...(Array.isArray(design.images) ? design.images.filter((img) => img !== design.cover_image) : []),
  ];

  const inWishlist = isInWishlist(design.id);

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const priceDisplay = formatPrice(design.price);
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.business_name || 'AK Couture'},\n\nI would like to inquire about the bespoke ensemble "${design.name}" (Code: ${design.code || 'Haute'}).\nEstimated Price: ${priceDisplay}\n\nPlease share fitting availability, customized color options, and dispatch timelines.`
      )}`
    : '#';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${design.name} | AK Couture`,
        text: `Check out this bespoke haute couture ensemble by AK Couture.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button onClick={() => onNavigate('/designs')} className="hover:text-[#58111A] flex items-center gap-1 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Designs</span>
            </button>
            <span>/</span>
            <span className="text-stone-400">{design.category}</span>
            <span>/</span>
            <span className="text-stone-800 font-medium truncate max-w-xs">{design.name}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-[#58111A] transition cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Outfit'}</span>
          </button>
        </div>

        {/* Main Grid: Gallery on Left, Details & Tailoring Module on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-stone-300 shadow-md relative group">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={design.name}
                  className="w-full h-full object-cover transition-all"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <Sparkles className="w-12 h-12 text-[#C5A059]" />
                </div>
              )}

              {/* Wishlist Button floating over image */}
              <button
                onClick={() => toggleWishlist(design)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition cursor-pointer ${
                  inWishlist
                    ? 'bg-white text-red-600'
                    : 'bg-white/80 text-stone-700 hover:text-red-600 hover:bg-white'
                }`}
                title={inWishlist ? 'Remove from Lookbook' : 'Save to Lookbook'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-[#58111A] shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Inquiries Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-stone-200 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                  {design.category}
                </span>
                {design.code && (
                  <span className="text-xs font-mono text-stone-400">Atelier ID: {design.code}</span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-light leading-tight">
                {design.name}
              </h1>

              <div className="pt-2 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-medium text-stone-900">
                  {priceDisplay}
                </span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">
                  ({currency} Currency)
                </span>
              </div>
              <span className="text-xs text-stone-500 block">
                Tailored to your bespoke measurements • Global Insured Express Shipping
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2 text-stone-700 text-sm leading-relaxed font-light">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Design &amp; Atelier Notes
              </h3>
              <p className="whitespace-pre-line">{design.description}</p>
            </div>

            {/* Fabric & Embroidery Specs */}
            <div className="bg-[#F4EFE6] border border-[#EADBCE] rounded-2xl p-5 space-y-3 text-xs">
              <h4 className="font-serif text-base text-[#58111A] font-medium">Bespoke Specifications</h4>
              <div className="space-y-2.5 text-stone-700">
                <div className="flex items-start gap-2.5">
                  <Scissors className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Fabric Options:</strong> {design.fabric_details || 'Pure Raw Silk, Chanderi, Organza, or Velvet.'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Hand Needlework:</strong> {design.embroidery_details || 'Traditional Zardozi, Gota Patti, Dabka, and Tilla.'}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Ruler className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Custom Sizing:</strong> Made-to-measure.
                    <button
                      onClick={() => setMeasurementModalOpen(true)}
                      className="ml-1 text-[#58111A] underline font-medium hover:text-[#C5A059] cursor-pointer"
                    >
                      Open Measurements Guide →
                    </button>
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Authenticity Guarantee:</strong> 100% handcrafted by certified generational artisans in Punjab.
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Actions */}
            <div className="space-y-3 pt-2">
              {cleanWhatsapp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp with Master Couturier</span>
                </a>
              ) : (
                <button
                  onClick={() => onNavigate('/contact')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-800 rounded-xl cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire About This Design</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('/book-appointment')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-stone-900 bg-[#FAF7F2] hover:bg-white border border-[#58111A]/40 hover:border-[#58111A] active:scale-[0.99] rounded-xl transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#58111A]" />
                <span>Book Fitting Appointment</span>
              </button>

              <button
                onClick={() => onNavigate('/custom-order')}
                className="w-full py-2.5 text-xs text-center text-stone-600 hover:text-stone-900 hover:underline cursor-pointer"
              >
                Want this in a different color or fabric? Submit Custom Commission Request →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
