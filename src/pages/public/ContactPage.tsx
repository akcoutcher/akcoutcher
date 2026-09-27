import React, { useState } from 'react';
import { SiteSettings } from '../../types/database';
import { createContactMessage } from '../../lib/db';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2, Instagram, Facebook, Youtube } from 'lucide-react';

interface ContactPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Kaur Couture, I would like to get in touch regarding bespoke suits and services.')}`
    : '#';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await createContactMessage({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      // Also navigate to thank you or show confirmation
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg('Unable to send message right now. Please message us on WhatsApp or call directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Atelier Concierge
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Contact & Showroom Visit
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            We welcome you to visit our boutique atelier in Ludhiana, Punjab or reach out to our couture team globally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8 bg-[#F4EFE6] border border-[#EADBCE] rounded-2xl p-8">
            <div>
              <h3 className="font-serif text-2xl text-[#58111A] font-medium mb-1">
                {settings.business_name || 'Kaur Couture'}
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#C5A059] font-medium">
                Flagship Atelier & Showroom
              </p>
            </div>

            <div className="space-y-6 text-sm text-stone-700">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-900 block text-xs uppercase tracking-wider mb-1">Address</span>
                  <p className="leading-relaxed">{settings.address || '14 Heritage Boulevard, Model Town, Ludhiana, Punjab'}</p>
                  {settings.google_maps_url && (
                    <a
                      href={settings.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#58111A] hover:underline font-medium inline-block mt-1"
                    >
                      Get Directions on Google Maps →
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-900 block text-xs uppercase tracking-wider mb-1">Visiting Hours</span>
                  <p className="leading-relaxed text-xs">{settings.opening_hours || 'Mon - Sat: 10:30 AM - 8:00 PM | Sun: By Appointment'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-900 block text-xs uppercase tracking-wider mb-1">Direct Call</span>
                  <a href={`tel:${settings.phone}`} className="hover:text-[#58111A] font-medium">
                    {settings.phone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-stone-900 block text-xs uppercase tracking-wider mb-1">Email</span>
                  <a href={`mailto:${settings.email}`} className="hover:text-[#58111A]">
                    {settings.email || 'contact@kaurcouture.com'}
                  </a>
                </div>
              </div>

              {cleanWhatsapp && (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs uppercase tracking-wider font-semibold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Chat</span>
                  </a>
                </div>
              )}
            </div>

            {/* Social channels */}
            <div className="pt-6 border-t border-stone-300">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-3">Follow Atelier Work</span>
              <div className="flex items-center gap-3">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-700 hover:text-[#58111A] hover:border-[#58111A] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-700 hover:text-[#58111A] hover:border-[#58111A] transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-stone-300 rounded-full text-stone-700 hover:text-[#58111A] hover:border-[#58111A] transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-3xl text-[#58111A]">Message Sent Successfully</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed font-light">
                  Thank you for reaching out to Kaur Couture. Our atelier team will review your inquiry and reply via email or phone within 24 business hours.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', message: '' });
                    }}
                    className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded"
                  >
                    Send Another Message
                  </button>
                  <button
                    onClick={() => onNavigate('/collections')}
                    className="px-5 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
                  >
                    Explore Collections
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#58111A] font-medium">Send an Atelier Message</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Have questions about bespoke suits, custom measurements, or shipping? Let us know.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaspreet Kaur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 or international phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Your Message or Inquiry *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe what you are looking for (e.g., custom Patiala suit for sister's wedding, bridal consultation, fabric selection...)"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] disabled:opacity-50 rounded transition-all shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
