import React from 'react';
import { SiteSettings } from '../../types/database';

interface PrivacyPolicyPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-stone-200 pb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">Legal & Transparency</span>
          <h1 className="font-serif text-4xl text-[#58111A] font-light mt-1">Privacy Policy</h1>
          <p className="text-xs text-stone-500 mt-2">Last updated: October 2026</p>
        </div>

        <div className="space-y-6 text-sm text-stone-700 leading-relaxed font-light">
          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">1. Information We Collect</h2>
            <p>
              At {settings.business_name || 'Kaur Couture'}, we respect your privacy. When you request an appointment, submit a custom order, or message our atelier, we collect contact information including your full name, phone number, WhatsApp number, email address, dress specifications, measurements, and any reference design images you provide.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">2. How We Use Your Data</h2>
            <p>
              We use your submitted information exclusively to coordinate fittings, tailor bespoke Punjabi garments according to your measurements, fulfill order deliveries, and communicate directly regarding your commissions. We never sell, trade, or share your personal data with third-party advertising brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">3. Reference Images & Photos</h2>
            <p>
              Reference photos uploaded by patrons during custom stitching orders are stored securely within our private media infrastructure and are accessible strictly to our pattern cutters and head designer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-stone-900">4. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding how your data is handled, you may contact our atelier directly at{' '}
              <a href={`mailto:${settings.email}`} className="text-[#58111A] underline">
                {settings.email}
              </a>{' '}
              or by phone at {settings.phone}.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
