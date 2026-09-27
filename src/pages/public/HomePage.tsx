import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Calendar, MessageCircle, Scissors, Award, Gem, Clock } from 'lucide-react';
import { SiteSettings, HomepageContent, CollectionItem, DesignItem, ServiceItem, GalleryItem } from '../../types/database';
import { getCollections, getDesigns, getServices, getGallery } from '../../lib/db';

interface HomePageProps {
  settings: SiteSettings;
  homepage: HomepageContent;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ settings, homepage, onNavigate }) => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [c, d, s, g] = await Promise.all([
          getCollections(true),
          getDesigns(true),
          getServices(true),
          getGallery(true),
        ]);
        setCollections(c);
        setDesigns(d);
        setServices(s);
        setGallery(g);
      } catch (e) {
        console.error('Error loading homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello, I am interested in inquiring about your bespoke Punjabi suits and couture services.')}`
    : '#';

  const heroImage = homepage.hero_image_url || '/src/assets/images/punjabi_couture_hero_1790501175200.jpg';
  const ownerImage = settings.owner_image_url || '/src/assets/images/punjabi_designer_portrait_1790501188325.jpg';
  const craftImage = homepage.craftsmanship_image_url || '/src/assets/images/punjabi_embroidery_craft_1790501202133.jpg';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917]">
      {/* 2. HERO SECTION */}
      <section className="relative min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950">
        {/* Background Image with Measured Contrast Scrim */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Punjabi Couture Bridal Ensemble"
            className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-[#FAF7F2] space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C5A059] font-medium">
            <span>Handcrafted Punjabi Haute Couture</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-balance">
            {homepage.hero_heading || 'Where Tradition Meets Your Style'}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-200 font-light leading-relaxed">
            {homepage.hero_subtitle || 'Bespoke Punjabi bridal couture, regal silhouettes, and handcrafted heritage embroidery tailored to your exact measurements.'}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate(homepage.hero_primary_btn_link || '/collections')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded transition-all shadow-lg active:scale-95"
            >
              {homepage.hero_primary_btn_text || 'Explore Collections'}
            </button>
            <button
              onClick={() => onNavigate(homepage.hero_secondary_btn_link || '/book-appointment')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-transparent hover:bg-white/10 border border-white/60 hover:border-white rounded transition-all active:scale-95"
            >
              {homepage.hero_secondary_btn_text || 'Book Appointment'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. ABOUT BOUTIQUE / ATELIER HERITAGE */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              {homepage.about_section_subheading || 'The Atelier Story'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#58111A] leading-tight">
              {homepage.about_section_heading || 'A Legacy of Punjabi Grace & Artisanship'}
            </h2>
            <p className="text-base text-stone-700 leading-relaxed font-light">
              {homepage.about_section_text ||
                'At Kaur Couture, every garment is an homage to Punjab’s illustrious sartorial heritage. From pure handspun raw silks to antique gold tilla and zardozi threadwork, we curate bespoke ensembles that transcend ephemeral trends.'}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Each bridal suit and festive outfit is crafted through personalized measurement sessions, customized silhouette styling, and heirloom hand-embroidery.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A] group"
              >
                <span>Read Full Atelier Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('/custom-order')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-stone-900"
              >
                <span>Custom Order</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl border border-stone-200">
              <img
                src={craftImage}
                alt="Artisan embroidery craftsmanship"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#58111A] text-white p-6 rounded shadow-xl hidden sm:block max-w-xs">
              <span className="font-serif text-3xl font-light text-[#C5A059] block">100% Bespoke</span>
              <p className="text-xs text-stone-200 font-light mt-1">
                Hand-embroidered by generational Punjabi artisans with pure metallic threads and stones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] mt-1 font-normal">
                Heirloom Punjabi Silhouettes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/collections')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A]"
            >
              <span>View All Collections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-stone-200/60 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : collections.length === 0 ? (
            /* Elegant Empty State as mandated by No Fake Data Rule */
            <div className="bg-white/80 border border-stone-300/80 rounded-xl p-12 text-center max-w-xl mx-auto">
              <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No collections available yet.</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                Our bespoke seasonal collections are currently being curated. Contact our atelier directly for customized bridal and festive wear.
              </p>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-[#58111A] border border-[#58111A] rounded hover:bg-[#58111A] hover:text-white transition-colors"
              >
                Inquire with Atelier
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((col) => (
                <div
                  key={col.id}
                  onClick={() => onNavigate(`/collections/${col.slug}`)}
                  className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
                    {col.cover_image ? (
                      <img
                        src={col.cover_image}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
                        <Sparkles className="w-8 h-8 text-[#C5A059]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-xs uppercase tracking-wider text-white font-medium flex items-center gap-1.5">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-medium block">
                      {col.category || 'Couture'}
                    </span>
                    <h3 className="font-serif text-2xl text-stone-900 group-hover:text-[#58111A] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. FEATURED DESIGNS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Signature Ensembles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] mt-1 font-normal">
              Haute Couture Designs
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/designs')}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A]"
          >
            <span>Browse All Designs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-72 bg-stone-200/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          /* Empty State */
          <div className="bg-[#FAF7F2] border border-stone-200 rounded-xl p-12 text-center max-w-xl mx-auto">
            <Scissors className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No designs available yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Our atelier introduces bespoke suites on custom order. You can request a personalized design consultation or upload reference images for custom stitching.
            </p>
            <button
              onClick={() => onNavigate('/custom-order')}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded hover:bg-[#6B1D2F] transition-colors"
            >
              Request Custom Suit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designs.slice(0, 8).map((design) => (
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
                  {design.featured && (
                    <div className="absolute top-2 left-2 bg-[#58111A] text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <span>{design.category}</span>
                  </div>
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
      </section>

      {/* 6. SERVICES */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Bespoke Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-normal">
              Couture Services & Tailoring
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              From hand-drawn motif conceptualization to individual precision fittings, explore our comprehensive atelier services.
            </p>
          </div>

          {services.length === 0 ? (
            /* Elegant empty state */
            <div className="bg-white/80 border border-stone-300/80 rounded-xl p-12 text-center max-w-md mx-auto">
              <Scissors className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No services published yet.</h3>
              <p className="text-xs text-stone-500 mb-4">
                Our bespoke services include Custom Punjabi Stitching, Hand Embroidery, and Bridal Consultations.
              </p>
              <button
                onClick={() => onNavigate('/book-appointment')}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
              >
                Book Consultation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white border border-stone-200/80 rounded-lg p-6 space-y-4 hover:border-[#C5A059] transition-colors"
                >
                  {svc.image_url && (
                    <div className="aspect-[16/9] rounded overflow-hidden bg-stone-100">
                      <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-serif text-xl text-[#58111A] font-medium">{svc.name}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{svc.description}</p>
                  {svc.price_starting_from && (
                    <span className="text-[11px] text-[#C5A059] font-medium block">
                      Starting from {svc.price_starting_from}
                    </span>
                  )}
                  <button
                    onClick={() => onNavigate('/book-appointment')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58111A] hover:text-[#85223A] pt-2"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. WHY CHOOSE US / CRAFTSMANSHIP PILLARS */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            The Kaur Couture Promise
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-normal">
            Why Discerning Patrons Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white border border-stone-200/80 rounded-lg space-y-3">
            <Award className="w-6 h-6 text-[#C5A059]" />
            <h3 className="font-serif text-lg font-medium text-stone-900">Generational Karigars</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Authentic hand-phulkari, tilla, and zardozi needlework executed by master artisans with ancestral expertise.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-lg space-y-3">
            <Scissors className="w-6 h-6 text-[#C5A059]" />
            <h3 className="font-serif text-lg font-medium text-stone-900">Flawless Tailored Fit</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Every salwar suit, Patiala, and kurti is hand-measured and patterned to contour perfectly with royal comfort.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-lg space-y-3">
            <Gem className="w-6 h-6 text-[#C5A059]" />
            <h3 className="font-serif text-lg font-medium text-stone-900">Pure Heritage Fabrics</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Uncompromising sourcing of 100% pure raw silk, organza, georgette, and plush velvets from certified mills.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-lg space-y-3">
            <Clock className="w-6 h-6 text-[#C5A059]" />
            <h3 className="font-serif text-lg font-medium text-stone-900">Worldwide Delivery</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Reliable doorstep delivery with insured express courier service for our Punjabi diaspora across USA, UK, Canada, and Australia.
            </p>
          </div>
        </div>
      </section>

      {/* 8. OWNER / DESIGNER SECTION */}
      <section className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-stone-300 shadow-xl bg-stone-100">
                <img
                  src={ownerImage}
                  alt={settings.owner_name || 'Simran Kaur'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Creative Director & Couturier
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#58111A] font-normal">
                {settings.owner_name || 'Simran Kaur'}
              </h2>
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                {settings.owner_title || 'Master Couturier & Founder'}
              </p>

              <blockquote className="border-l-2 border-[#C5A059] pl-6 italic font-serif text-xl sm:text-2xl text-stone-800 font-light">
                "{settings.owner_short_bio ||
                  'Crafting heirloom Punjabi silhouettes, bridal couture, and bespoke zardozi embroidery for discerning women globally.'}"
              </blockquote>

              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {settings.owner_full_bio ||
                  'With over 18 years dedicated to preserving authentic Punjabi textile arts, Simran Kaur unites centuries-old tilla, gota patti, and hand-phulkari needlework with modern couture tailoring. Every bespoke suit and bridal ensemble is individually envisioned, patterned, and perfected.'}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/book-appointment')}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-colors"
                >
                  Book Private Consultation
                </button>
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 rounded transition-colors"
                >
                  Meet The Couturier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. GALLERY PREVIEW */}
      <section className="py-20 bg-[#F4EFE6] border-t border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Visual Chronicle
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] mt-1 font-normal">
                Atelier Gallery
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A]"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {gallery.length === 0 ? (
            <div className="bg-white/80 border border-stone-300/80 rounded-xl p-12 text-center max-w-md mx-auto">
              <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No gallery images added yet.</h3>
              <p className="text-xs text-stone-500 mb-4">
                Our latest bridal shoots and couture runway photos will be published shortly.
              </p>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#58111A] border border-[#58111A] rounded"
              >
                Contact Atelier
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('/gallery')}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-medium">{item.category}</span>
                    <p className="font-serif text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 10. APPOINTMENT CTA & 11. WHATSAPP CTA */}
      <section className="py-24 bg-[#58111A] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold">
            Personal Atelier Consultation
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-balance leading-tight">
            {homepage.cta_heading || 'Design Your Dream Bridal & Festive Ensembles'}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-light leading-relaxed">
            {homepage.cta_subheading ||
              'Experience an exclusive personal consultation in our Ludhiana atelier or schedule a private virtual session with our Master Couturier.'}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/book-appointment')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded transition-all shadow-xl active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{homepage.cta_btn_text || 'Schedule Consultation'}</span>
            </button>

            {cleanWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-all shadow-xl active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
