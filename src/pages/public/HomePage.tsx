import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Calendar, MessageCircle, Scissors, Award, Gem, Clock, Play, Heart, Star, Smartphone, Ruler, CheckCircle2 } from 'lucide-react';
import { SiteSettings, HomepageContent, CollectionItem, DesignItem, ServiceItem, GalleryItem } from '../../types/database';
import { getCollections, getDesigns, getServices, getGallery } from '../../lib/db';
import { useCouture } from '../../context/CoutureContext';
import { RunwayModal } from '../../components/common/RunwayModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';

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
  const [runwayModalOpen, setRunwayModalOpen] = useState(false);

  const { formatPrice, isInWishlist, toggleWishlist, setMeasurementModalOpen } = useCouture();
  const { isInstallable, isInstalled, install } = usePWAInstall();

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
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello AK Couture, I am interested in inquiring about your bespoke bridal suits and couture collection.')}`
    : '#';

  const heroImage = homepage.hero_image_url || '/src/assets/images/punjabi_couture_hero_1790501175200.jpg';
  const ownerImage = settings.owner_image_url || '/src/assets/images/punjabi_designer_portrait_1790501188325.jpg';
  const craftImage = homepage.craftsmanship_image_url || '/src/assets/images/punjabi_embroidery_craft_1790501202133.jpg';

  const testimonials = [
    {
      bride: 'Simran & Angad',
      location: 'Vancouver, Canada',
      quote: 'My bridal lehenga and wedding anarkali exceeded every expectation. The zardozi and raw silk fall were like wearable art. AK Couture made the virtual measurements process seamless!',
      outfit: 'Custom Royal Crimson Zardozi Lehenga',
    },
    {
      bride: 'Harleen K.',
      location: 'London, UK',
      quote: 'Ordered three trousseau suits for my sister’s wedding. The fitting was absolute perfection right out of the box. Delivery to London was fast and insured.',
      outfit: 'Pure Organza & Dabka Punjabi Suits',
    },
    {
      bride: 'Preet Gill',
      location: 'San Francisco, USA',
      quote: 'The craftsmanship and attention to detail is truly high fashion. Meeting the designer virtually felt like a personalized Paris atelier appointment.',
      outfit: 'Bespoke Velvet Mehendi Sharara',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Haute Couture Ensemble"
            className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transform scale-100 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-[#FAF7F2] space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-[#C5A059]/50 backdrop-blur-sm text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Haute Couture &amp; Bespoke Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.08] text-balance">
            {homepage.hero_heading || 'Where Heritage Meets Contemporary Haute Couture'}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-200 font-light leading-relaxed">
            {homepage.hero_subtitle || 'Bespoke bridal lehengas, regal Punjabi silhouettes, and generational zardozi embroidery tailored to your exact measurements.'}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate(homepage.hero_primary_btn_link || '/collections')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              {homepage.hero_primary_btn_text || 'Explore Collections'}
            </button>
            <button
              onClick={() => onNavigate(homepage.hero_secondary_btn_link || '/book-appointment')}
              className="w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-transparent hover:bg-white/10 border border-white/60 hover:border-white rounded transition-all active:scale-95 cursor-pointer"
            >
              {homepage.hero_secondary_btn_text || 'Book VIP Consultation'}
            </button>
            <button
              onClick={() => setRunwayModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-widest font-semibold text-stone-200 hover:text-white bg-black/40 hover:bg-black/60 border border-[#C5A059]/40 rounded transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              <span>Watch Runway Film</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL PRESS STRIP */}
      <section className="bg-[#1C1917] border-y border-[#332D29] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
            Celebrated In Global Fashion &amp; Bridal Media:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 text-stone-400 font-serif text-lg tracking-widest">
            <span className="hover:text-white transition cursor-default">VOGUE INDIA</span>
            <span className="text-stone-700">•</span>
            <span className="hover:text-white transition cursor-default">HARPER&apos;S BAZAAR</span>
            <span className="text-stone-700">•</span>
            <span className="hover:text-white transition cursor-default">ELLE ATELIER</span>
            <span className="text-stone-700">•</span>
            <span className="hover:text-white transition cursor-default">WEDDINGSUTRA</span>
            <span className="text-stone-700">•</span>
            <span className="hover:text-white transition cursor-default">GRAZIA BRIDAL</span>
          </div>
        </div>
      </section>

      {/* 3. ATELIER HERITAGE */}
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
                'At AK Couture, every garment is an homage to Punjab’s illustrious sartorial heritage. From pure handspun raw silks to antique gold tilla and zardozi threadwork, we curate bespoke ensembles that transcend ephemeral trends.'}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Each bridal suit and festive outfit is crafted through personalized measurement sessions, customized silhouette styling, and heirloom hand-embroidery.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6">
              <button
                onClick={() => onNavigate('/about')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A] group cursor-pointer"
              >
                <span>Read Full Atelier Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setMeasurementModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#C5A059] hover:underline cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
                <span>Bespoke Measurement Guide</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src={craftImage}
                alt="Artisan embroidery craftsmanship"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#58111A] text-white p-6 rounded-xl shadow-xl hidden sm:block max-w-xs border border-[#C5A059]/40">
              <span className="font-serif text-3xl font-light text-[#C5A059] block">100% Bespoke</span>
              <p className="text-xs text-stone-200 font-light mt-1">
                Hand-embroidered by generational artisans using pure metallic tilla, dabka, and Swarovski crystals.
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
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A] cursor-pointer"
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
            <div className="bg-white/80 border border-stone-300/80 rounded-xl p-12 text-center max-w-xl mx-auto">
              <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No collections available yet.</h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-4">
                Our bespoke seasonal collections are currently being curated. Contact our atelier directly for customized bridal and festive wear.
              </p>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-[#58111A] border border-[#58111A] rounded hover:bg-[#58111A] hover:text-white transition-colors cursor-pointer"
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
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-2xl transition-all duration-300"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-xs uppercase tracking-wider text-white font-medium flex items-center gap-1.5">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-semibold block">
                      {col.category || 'Haute Couture'}
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

      {/* 5. FEATURED DESIGNS WITH WISHLIST / LOOKBOOK */}
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
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#58111A] hover:text-[#85223A] cursor-pointer"
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
          <div className="bg-[#FAF7F2] border border-stone-200 rounded-xl p-12 text-center max-w-xl mx-auto">
            <Scissors className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No designs available yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Our atelier introduces bespoke suites on custom order. You can request a personalized design consultation or upload reference images for custom stitching.
            </p>
            <button
              onClick={() => onNavigate('/custom-order')}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded hover:bg-[#6B1D2F] transition-colors cursor-pointer"
            >
              Request Custom Suit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {designs.slice(0, 8).map((design) => {
              const inWishlist = isInWishlist(design.id);
              return (
                <div
                  key={design.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all"
                >
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
                    {design.featured && (
                      <div className="absolute top-3 left-3 bg-[#58111A] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded shadow">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(design);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                      inWishlist
                        ? 'bg-white text-red-600'
                        : 'bg-white/80 text-stone-700 hover:text-red-600 hover:bg-white'
                    }`}
                    title={inWishlist ? 'Remove from Lookbook' : 'Save to Lookbook'}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-600' : ''}`} />
                  </button>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{design.category}</span>
                      {design.code && <span className="font-mono text-[#C5A059]">{design.code}</span>}
                    </div>
                    <h3
                      onClick={() => onNavigate(`/designs/${design.slug}`)}
                      className="font-serif text-lg font-medium text-stone-900 group-hover:text-[#58111A] truncate cursor-pointer"
                    >
                      {design.name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs font-semibold text-[#58111A]">
                        {formatPrice(design.price)}
                      </p>
                      <button
                        onClick={() => onNavigate(`/designs/${design.slug}`)}
                        className="text-[11px] text-stone-500 hover:text-[#58111A] font-medium flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. COUTURE SERVICES */}
      <section className="py-20 bg-[#F4EFE6] border-y border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
              Bespoke Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-normal">
              Couture Services &amp; Tailoring
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              From hand-drawn motif conceptualization to individual precision fittings, explore our comprehensive atelier services.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="bg-white/80 border border-stone-300/80 rounded-xl p-12 text-center max-w-md mx-auto">
              <Scissors className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No services published yet.</h3>
              <p className="text-xs text-stone-500 mb-4">
                Our bespoke services include Custom Punjabi Stitching, Hand Embroidery, and Bridal Consultations.
              </p>
              <button
                onClick={() => onNavigate('/book-appointment')}
                className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
              >
                Book Consultation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 hover:border-[#C5A059] transition-all shadow-sm hover:shadow-lg"
                >
                  {svc.image_url && (
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58111A] hover:text-[#85223A] pt-2 cursor-pointer"
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

      {/* 7. REAL BRIDES & CLIENT TESTIMONIALS */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Heirloom Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-normal">
            Real Brides &amp; Trousseau Stories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Discerning women across India, the UK, the USA, and Canada celebrating their most precious moments in AK Couture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
                  ))}
                </div>
                <p className="text-stone-700 font-serif italic text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-serif text-base font-semibold text-[#58111A]">{t.bride}</h4>
                <p className="text-xs text-stone-500">{t.location}</p>
                <p className="text-[11px] text-[#C5A059] font-medium mt-1">{t.outfit}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DESIGNER & CREATIVE DIRECTOR SPOTLIGHT */}
      <section className="py-20 lg:py-28 bg-[#FAF7F2] border-t border-[#EADBCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-stone-300 shadow-xl bg-stone-100">
                <img
                  src={ownerImage}
                  alt={settings.owner_name || 'AK Couture Master Couturier'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
                Creative Director &amp; Master Couturier
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#58111A] font-normal">
                {settings.owner_name || 'AK Couturier'}
              </h2>
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                {settings.owner_title || 'Master Couturier & Founder'}
              </p>

              <blockquote className="border-l-2 border-[#C5A059] pl-6 italic font-serif text-xl sm:text-2xl text-stone-800 font-light">
                &ldquo;{settings.owner_short_bio ||
                  'Crafting heirloom Punjabi silhouettes, bridal couture, and bespoke zardozi embroidery for discerning women globally.'}&rdquo;
              </blockquote>

              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {settings.owner_full_bio ||
                  'With over 18 years dedicated to preserving authentic Punjabi textile arts, our master couturier unites centuries-old tilla, gota patti, and hand-phulkari needlework with modern couture tailoring. Every bespoke suit and bridal ensemble is individually envisioned, patterned, and perfected.'}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('/book-appointment')}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-colors cursor-pointer"
                >
                  Book Private Consultation
                </button>
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-stone-900 border border-stone-300 rounded transition-colors cursor-pointer"
                >
                  Meet The Couturier
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PWA APP INSTALL PROMPT STRIP */}
      {!isInstalled && (
        <section className="bg-gradient-to-r from-[#200508] via-[#3E0911] to-[#200508] text-white py-12 px-4 border-t border-[#C5A059]/40">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#58111A] border-2 border-[#C5A059] flex items-center justify-center shrink-0 shadow-lg">
                <img src="/pwa-192x192.png" alt="App" className="w-10 h-10 object-contain" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-white font-medium">Install AK Couture on Your Device</h3>
                <p className="text-xs text-stone-300 mt-1 max-w-lg">
                  Install in seconds without going to app stores. Enjoy instant offline browsing of our bridal lookbooks and quick appointment booking.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => install()}
                className="flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 text-xs uppercase tracking-widest font-semibold rounded-lg shadow-xl cursor-pointer active:scale-95 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install Official App</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 10. APPOINTMENT CTA & WHATSAPP */}
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
              'Experience an exclusive personal consultation in our atelier or schedule a private virtual session with our Master Couturier.'}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/book-appointment')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded transition-all shadow-xl active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{homepage.cta_btn_text || 'Schedule Consultation'}</span>
            </button>

            {cleanWhatsapp && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded transition-all shadow-xl active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Runway Video Modal */}
      <RunwayModal
        isOpen={runwayModalOpen}
        onClose={() => setRunwayModalOpen(false)}
        title="AK Couture • Autumn/Winter Runway Presentation"
        season="Haute Couture Fashion Week Showcase"
      />
    </div>
  );
};
