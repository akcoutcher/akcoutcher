import React, { useState } from 'react';
import { SiteSettings } from '../../types/database';
import { createAppointment } from '../../lib/db';
import { Calendar, CheckCircle2, MessageCircle, AlertCircle, Heart, Ruler } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

interface BookAppointmentPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const BookAppointmentPage: React.FC<BookAppointmentPageProps> = ({ settings, onNavigate }) => {
  const { wishlist, measurements, setMeasurementModalOpen } = useCouture();

  const [attachLookbook, setAttachLookbook] = useState(wishlist.length > 0);
  const [attachMeasurements, setAttachMeasurements] = useState(Boolean(measurements.bust || measurements.waist));

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    preferred_date: '',
    preferred_time: '11:00 AM',
    service: 'Bridal Wear Consultation',
    consultation_mode: 'Studio Fitting (In-Person Atelier)',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const servicesList = [
    'Bridal Wear Consultation',
    'Custom Salwar / Patiala Suit Fitting',
    'Heirloom Embroidery & Fabric Consultation',
    'Party / Trousseau Wear Designing',
    'Virtual Video Styling Appointment',
    'General Atelier Visit',
  ];

  const modesList = [
    'Studio Fitting (In-Person Atelier)',
    'Virtual VIP Video Call (Zoom / WhatsApp / Meet)',
  ];

  const timesList = [
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
    '06:30 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.preferred_date) {
      setErrorMsg('Please complete all required fields (Name, Phone, Email, Preferred Date).');
      return;
    }

    setSubmitting(true);

    let extendedMessage = formData.message.trim();
    extendedMessage += `\n\n[Mode: ${formData.consultation_mode}]`;

    if (attachLookbook && wishlist.length > 0) {
      const items = wishlist.map((w) => `${w.name} (${w.code || 'Haute'})`).join(', ');
      extendedMessage += `\n[Saved Lookbook Items: ${items}]`;
    }

    if (attachMeasurements && (measurements.bust || measurements.waist)) {
      extendedMessage += `\n[Client Measurements: Bust: ${measurements.bust || '-'} ${measurements.unit}, Waist: ${measurements.waist || '-'} ${measurements.unit}, Hips: ${measurements.hips || '-'} ${measurements.unit}, Height: ${measurements.height || '-'}]`;
    }

    try {
      await createAppointment({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        email: formData.email.trim(),
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        service: `${formData.service} (${formData.consultation_mode})`,
        message: extendedMessage,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit appointment:', err);
      setErrorMsg('Unable to submit appointment. Please try again or chat with us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
        `Hello ${settings.business_name || 'AK COUTURE'}, I have submitted an appointment request for a ${formData.service} on ${formData.preferred_date || 'my preferred date'}.`
      )}`
    : '#';

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Personal Atelier Session
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Book an Appointment
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Schedule an exclusive one-on-one session with our Master Couturier at our atelier or via private virtual video consultation anywhere in the world.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
                Your Appointment Request Has Been Received
              </h2>
              <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed font-light">
                Thank you, <strong>{formData.name}</strong>. Our atelier manager will review the schedule and contact you via phone or WhatsApp to verify and confirm your consultation date &amp; time.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-xl p-6 max-w-md mx-auto text-left text-xs space-y-2">
              <p><strong>Service:</strong> {formData.service}</p>
              <p><strong>Mode:</strong> {formData.consultation_mode}</p>
              <p><strong>Date:</strong> {formData.preferred_date}</p>
              <p><strong>Time:</strong> {formData.preferred_time}</p>
              <p><strong>Status:</strong> <span className="text-amber-800 font-medium">Pending Confirmation</span></p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/')}
                className="w-full sm:w-auto px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded cursor-pointer"
              >
                Return to Home
              </button>
              {cleanWhatsapp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-100 rounded hover:bg-emerald-200 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Verify Faster on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="bg-[#FAF7F2] border-l-4 border-[#C5A059] p-4 text-xs text-stone-700 leading-relaxed font-light">
                <strong>Atelier Notice:</strong> Submitting this request reserves your preferred time slot. Our couture concierge will reach out to you within 24 hours to confirm appointment details.
              </div>

              {/* Client Info */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  01. Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jasleen Kaur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Same as phone or international format"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Preferences */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  02. Consultation Preferences
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Consultation Format *
                    </label>
                    <select
                      value={formData.consultation_mode}
                      onChange={(e) => setFormData({ ...formData, consultation_mode: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    >
                      {modesList.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Service Type *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    >
                      {servicesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    >
                      {timesList.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Lookbook & Measurements attachments */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-stone-200 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#58111A] block">
                    Attach Your Atelier Data
                  </span>

                  {wishlist.length > 0 && (
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attachLookbook}
                        onChange={(e) => setAttachLookbook(e.target.checked)}
                        className="rounded text-[#58111A] focus:ring-[#58111A]"
                      />
                      <Heart className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                      <span>
                        Include my <strong>{wishlist.length} saved Lookbook outfits</strong> for reference in this session.
                      </span>
                    </label>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attachMeasurements}
                        onChange={(e) => setAttachMeasurements(e.target.checked)}
                        className="rounded text-[#58111A] focus:ring-[#58111A]"
                      />
                      <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>
                        Include my saved body measurements (Bust: {measurements.bust || 'none'}, Waist: {measurements.waist || 'none'}).
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMeasurementModalOpen(true)}
                      className="text-[11px] text-[#58111A] hover:underline cursor-pointer"
                    >
                      Edit Measurements
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Occasion &amp; Special Styling Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the occasion (wedding, sangeet, engagement, bridal trousseau), color ideas, or target delivery date."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500">
                  Appointments are confirmed personally by the atelier concierge.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] disabled:opacity-50 rounded transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span>{submitting ? 'Requesting Appointment...' : 'Submit Appointment Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
