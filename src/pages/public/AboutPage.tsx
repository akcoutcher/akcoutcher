import React, { useState, useEffect } from 'react';
import { SiteSettings, AboutContent } from '../../types/database';
import { getAboutContent } from '../../lib/db';
import { Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    getAboutContent().then(setAbout);
  }, []);

  const ownerImage = settings.owner_image_url && !settings.owner_image_url.includes('punjabi_designer_portrait')
    ? settings.owner_image_url
    : '/aakk11.png';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            {about?.subheading || 'About Our Atelier'}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#58111A] font-light leading-tight">
            {about?.heading || 'Heirloom Craftsmanship Reimagined'}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            Dedicated to the authentic textile traditions of Punjab, uniting royal heritage with bespoke contemporary couture.
          </p>
        </div>

        {/* Story Section with Designer Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="group aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-stone-300 relative bg-stone-100">
              <img
                src={ownerImage}
                alt={settings.owner_name || 'Simran Kaur'}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-white">
                <p className="font-serif text-2xl font-normal">{settings.owner_name || 'Simran Kaur'}</p>
                <p className="text-xs uppercase tracking-wider text-[#C5A059] font-sans mt-0.5">
                  {settings.owner_title || 'Creative Director & Master Couturier'}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A] font-normal">
              The Journey of Ak Couture
            </h2>
            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              <p>
                {about?.story
                  ? about.story.replace(/Kaur Couture/gi, 'Ak Couture')
                  : 'Founded in the heart of Punjab, Ak Couture emerged from a passionate devotion to authentic textile arts and flawless silhouette architecture. We believe every woman deserves clothing that honors tradition while celebrating her personal poise.'}
              </p>
              <p>
                {settings.owner_full_bio ||
                  'With over 18 years dedicated to preserving authentic Punjabi textile arts, Simran Kaur unites centuries-old tilla, gota patti, and hand-phulkari needlework with modern couture tailoring. Every bespoke suit and bridal ensemble is individually envisioned, patterned, and perfected.'}
              </p>
              <p>
                {about?.heritage_text ||
                  'Rooted in traditional Phulkari, Dabka, Marodi, and Gotapatti craftsmanship passed through generations of master artisans.'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-200">
              <div>
                <span className="font-serif text-3xl font-normal text-[#58111A] block">
                  {about?.experience_years || '18+'}
                </span>
                <span className="text-xs text-stone-500 font-medium">Years of Heritage Couture</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-normal text-[#58111A] block">100%</span>
                <span className="text-xs text-stone-500 font-medium">Authentic Hand-Embroidery</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-normal text-[#58111A] block">Global</span>
                <span className="text-xs text-stone-500 font-medium">Doorstep Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="bg-[#F4EFE6] border border-[#EADBCE] rounded-xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#58111A] text-[#C5A059] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#58111A]">Our Vision</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              {about?.vision ||
                'To establish authentic Punjabi couture on global runways while preserving traditional handcraft techniques for future generations.'}
            </p>
          </div>

          <div className="bg-[#F4EFE6] border border-[#EADBCE] rounded-xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#58111A] text-[#C5A059] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl text-[#58111A]">Our Mission</h3>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              {about?.mission ||
                'To deliver peerless tailored fit, ethically commissioned artisan needlework, and an intimate couture experience for every bride and patron.'}
            </p>
          </div>
        </div>

        {/* Craftsmanship Pillars */}
        <div className="border-t border-stone-200 pt-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl text-[#58111A]">The Needlework of Punjab</h2>
            <p className="text-xs text-stone-600">Preserving techniques perfected over centuries across the Punjab region.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
              <h4 className="font-serif text-lg font-medium text-stone-900">Phulkari Embroidery</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Traditional flower needlework stitched with raw silk untwisted floss thread on khaddar and pure silk georgettes.
              </p>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
              <h4 className="font-serif text-lg font-medium text-stone-900">Zardozi & Tilla</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Intricate 3D metallic embroidery utilizing gold and silver bullion wires, sequins, and micro pearls.
              </p>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
              <h4 className="font-serif text-lg font-medium text-stone-900">Gota Patti Work</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Gold ribbon appliqués hand-cut into diamond, petal, and peacock motifs, stitched along dupattas and hemlines.
              </p>
            </div>
            <div className="p-6 bg-white border border-stone-200 rounded-lg space-y-2">
              <h4 className="font-serif text-lg font-medium text-stone-900">Bespoke Fit</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Meticulous tailored sizing following our 18-point proprietary measurement charter for flawless drape.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('/book-appointment')}
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-all shadow-md"
          >
            Book An Atelier Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
