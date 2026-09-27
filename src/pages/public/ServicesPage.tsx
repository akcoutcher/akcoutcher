import React, { useState, useEffect } from 'react';
import { ServiceItem } from '../../types/database';
import { getServices } from '../../lib/db';
import { Scissors, Sparkles, ArrowRight, Check } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices(true).then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Bespoke Atelier Offerings
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Couture Services
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Master tailoring, authentic heritage embroidery, fabric sourcing, and personal couture consultations.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-stone-200/60 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-16 text-center max-w-lg mx-auto shadow-sm">
            <Scissors className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-stone-800 mb-2">No services published yet.</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-6">
              Our atelier offers custom salwar suits, bridal trousseau design, and hand embroidery. Contact us to discuss your bespoke garment.
            </p>
            <button
              onClick={() => onNavigate('/book-appointment')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
            >
              Book Consultation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div>
                  {svc.image_url ? (
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100">
                      <img
                        src={svc.image_url}
                        alt={svc.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-stone-100 flex items-center justify-center text-stone-300">
                      <Scissors className="w-8 h-8 text-[#C5A059]" />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-2xl text-[#58111A] font-medium">{svc.name}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">{svc.description}</p>
                    {svc.full_details && (
                      <p className="text-xs text-stone-500 leading-relaxed pt-2 border-t border-stone-100 whitespace-pre-line">
                        {svc.full_details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                  {svc.price_starting_from ? (
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 block">Starting from</span>
                      <span className="text-xs font-semibold text-stone-900">{svc.price_starting_from}</span>
                    </div>
                  ) : <div />}
                  <button
                    onClick={() => onNavigate('/book-appointment')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Steps */}
        <div className="border-t border-stone-200 pt-16 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl text-[#58111A]">The Couture Process</h2>
            <p className="text-xs text-stone-600">From concept sketch to your heirloom final fitting.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-2">
              <span className="text-xs font-mono font-semibold text-[#C5A059]">01. Consultation</span>
              <h4 className="font-serif text-lg font-medium text-stone-900">Styling & Silhouette</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Discuss your occasion, color preferences, and personal style with Simran Kaur.
              </p>
            </div>
            <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-2">
              <span className="text-xs font-mono font-semibold text-[#C5A059]">02. Fabric & Motifs</span>
              <h4 className="font-serif text-lg font-medium text-stone-900">Material Sourcing</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Select from pure silk, organza, or velvet swatches and customize embroidery density.
              </p>
            </div>
            <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-2">
              <span className="text-xs font-mono font-semibold text-[#C5A059]">03. Hand Embroidery</span>
              <h4 className="font-serif text-lg font-medium text-stone-900">Master Needlework</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Our generational artisans render the intricate tilla, zardozi, or phulkari needlecraft.
              </p>
            </div>
            <div className="p-5 bg-white border border-stone-200 rounded-lg space-y-2">
              <span className="text-xs font-mono font-semibold text-[#C5A059]">04. Perfect Fitting</span>
              <h4 className="font-serif text-lg font-medium text-stone-900">Final Presentation</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Final trial fitting, precision adjustments, and bespoke packaging for doorstep delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
