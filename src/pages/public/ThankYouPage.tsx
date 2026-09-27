import React from 'react';
import { CheckCircle2, ArrowRight, Home, Calendar } from 'lucide-react';
import { SiteSettings } from '../../types/database';

interface ThankYouPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-24 sm:py-32">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
          Thank You for Contacting Us
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light">
          Your request has been securely recorded by our atelier system. A member of the {settings.business_name || 'Kaur Couture'} team will contact you shortly to coordinate fittings, measurements, or answer any questions.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </button>
          <button
            onClick={() => onNavigate('/collections')}
            className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-stone-700 bg-white border border-stone-300 rounded hover:bg-stone-50 transition-colors"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
