import React from 'react';
import { SiteSettings } from '../../types/database';

interface TermsPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">Atelier Charter</span>
          <h1 className="font-serif text-4xl text-[#58111A] font-light mt-1">Terms & Conditions</h1>
          <p className="text-xs text-stone-500 mt-2">Bespoke Couture & Custom Stitching Policy</p>
        </div>

        <div className="space-y-6 text-sm text-stone-700 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">1. Bespoke Orders & Production</h2>
            <p>
              Each couture piece commissioned through {settings.business_name || 'Kaur Couture'} is handcrafted to individualized specifications and measurements. Production commences only after design approval, fabric selection, and receipt of agreed deposit.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">2. Measurements & Fittings</h2>
            <p>
              We provide guided virtual measurement sessions and in-person atelier trials. If a patron provides self-measured sizing, our master cutters will craft the garment precisely to those dimensions. Minor alterations are supported to achieve optimal drape.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">3. Handcrafted Variations</h2>
            <p>
              Due to the nature of authentic hand embroidery (Phulkari, Zardozi, Tilla, Gotapatti) and vegetable-dyed pure silks, subtle artisanal variations in motif density or shade are inherent hallmarks of true handcraft.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">4. Shipping & International Delivery</h2>
            <p>
              We dispatch orders worldwide via insured express international couriers. Tracking references are shared as soon as the ensemble completes final inspection.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
