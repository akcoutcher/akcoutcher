import React, { useState, useEffect } from 'react';
import { DesignItem, SiteSettings } from '../../types/database';
import { getDesignBySlug } from '../../lib/db';
import { ArrowLeft, MessageCircle, Calendar, Sparkles, Check, Scissors, Ruler, ShieldCheck } from 'lucide-react';

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
      <div className="min-h-[65vh] flex items-center justify-center text-stone-500 text-sm">
        Loading haute couture design details...
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#58111A]">Design Not Found</h2>
        <p className="text-xs text-stone-500">The requested design could not be found or may have been unlisted.</p>
        <button
          onClick={() => onNavigate('/designs')}
          className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
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

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello Kaur Couture, I would like to enquire about the "${design.name}" (${design.category}). Please share details on pricing, customisation options, and timeline.`
      )}`
    : '#';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button onClick={() => onNavigate('/designs')} className="hover:text-[#58111A] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Designs</span>
          </button>
          <span>/</span>
          <span className="text-stone-400">{design.category}</span>
          <span>/</span>
          <span className="text-stone-800 font-medium truncate max-w-xs">{design.name}</span>
        </div>

        {/* Main Grid: Gallery on Left, Purchase & Customisation Module on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary High-Resolution Stage */}
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 border border-stone-300 shadow-md relative group">
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
            </div>

            {/* Thumbnail Navigation Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
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
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
                {design.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-light leading-tight">
                {design.name}
              </h1>
              <div className="pt-2">
                <span className="font-serif text-2xl font-medium text-stone-900">
                  {design.price ? `₹${Number(design.price).toLocaleString('en-IN')}` : design.price_label || 'Price on Request'}
                </span>
                <span className="text-xs text-stone-500 block mt-0.5">
                  Hand-tailored to bespoke measurements
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 text-stone-700 text-sm leading-relaxed font-light">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
                Design & Atelier Notes
              </h3>
              <p className="whitespace-pre-line">{design.description}</p>
            </div>

            {/* Fabric & Embroidery Specs */}
            <div className="bg-[#F4EFE6] border border-[#EADBCE] rounded-xl p-5 space-y-3 text-xs">
              <h4 className="font-serif text-base text-[#58111A] font-medium">Bespoke Specifications</h4>
              <div className="space-y-2 text-stone-700">
                <div className="flex items-start gap-2">
                  <Scissors className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Fabric Options:</strong> {design.fabric_details || 'Pure Raw Silk, Chanderi, Organza, or Velvet.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Hand Needlework:</strong> {design.embroidery_details || 'Traditional Zardozi, Gota Patti, and Tilla.'}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Custom Sizing:</strong> Tailored to your exact measurements via virtual or in-person consultation.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>
                    <strong>Authenticity:</strong> 100% handcrafted by certified generational artisans in Punjab.
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Actions (WhatsApp Inquiry with pre-filled name & Book Consultation) */}
            <div className="space-y-3 pt-2">
              {cleanWhatsapp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] rounded-lg shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask About This Design on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={() => onNavigate('/contact')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-white bg-emerald-800 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire About This Design</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('/book-appointment')}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs uppercase tracking-wider font-semibold text-stone-900 bg-[#FAF7F2] hover:bg-white border border-[#58111A]/40 hover:border-[#58111A] active:scale-[0.99] rounded-lg transition-all"
              >
                <Calendar className="w-4 h-4 text-[#58111A]" />
                <span>Book Fitting Appointment</span>
              </button>

              <button
                onClick={() => onNavigate('/custom-order')}
                className="w-full py-2.5 text-xs text-center text-stone-600 hover:text-stone-900 hover:underline"
              >
                Want this in another color or fabric? Submit Custom Request →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
