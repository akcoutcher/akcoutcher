import React, { useState, useRef } from 'react';
import { SiteSettings } from '../../types/database';
import { createCustomOrder, uploadMediaFile } from '../../lib/db';
import { Scissors, Upload, CheckCircle2, AlertCircle, Sparkles, FileText, Image as ImageIcon } from 'lucide-react';

interface CustomOrderPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    dress_type: 'Bespoke Punjabi Salwar Suit',
    occasion: 'Wedding / Reception',
    preferred_colour: '',
    fabric_preference: 'Pure Raw Silk',
    measurements: '',
    budget: '',
    required_date: '',
    additional_notes: '',
  });

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dressTypes = [
    'Bespoke Punjabi Salwar Suit',
    'Patiala Royal Salwar Suit',
    'Bridal Heavily Embroidered Suit',
    'Gharara / Sharara Couture Suit',
    'Straight Kurti with Cigarette Pants',
    'Anarkali Floor-Length Ensemble',
    'Custom Dupatta / Veil Designing',
    'Other Bespoke Silhouette',
  ];

  const fabrics = [
    'Pure Raw Silk',
    'Pure Silk Organza',
    'Heritage Heavy Velvet',
    'Handwoven Chanderi Silk',
    'Pure Georgette / Crepe',
    'Brocade / Banarasi Zari Silk',
    'I would like the Atelier to recommend',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, or WEBP).');
        return;
      }
      setReferenceFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.dress_type) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let uploadedReferenceUrl = '';

      if (referenceFile) {
        try {
          const uploadedMedia = await uploadMediaFile(
            referenceFile,
            `ref-${Date.now()}-${referenceFile.name}`,
            `Reference image from ${formData.customer_name}`,
            'order-references'
          );
          uploadedReferenceUrl = uploadedMedia.url;
        } catch (e) {
          console.warn('Reference upload fallback:', e);
        }
      }

      await createCustomOrder({
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        email: formData.email.trim(),
        dress_type: formData.dress_type,
        occasion: formData.occasion,
        preferred_colour: formData.preferred_colour.trim(),
        fabric_preference: formData.fabric_preference,
        measurements: formData.measurements.trim(),
        budget: formData.budget.trim(),
        required_date: formData.required_date || '',
        reference_image: uploadedReferenceUrl || previewUrl || '',
        additional_notes: formData.additional_notes.trim(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Custom order submission failed:', err);
      setErrorMsg('Failed to submit custom order. Please verify your details or message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold">
            Made-To-Measure Atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#58111A] font-light">
            Custom Stitching & Couture Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            Bring your dream Punjabi silhouette to reality. Share your preferred dress design, reference inspiration, and custom specifications.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-10 sm:p-14 text-center space-y-6 shadow-sm">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#58111A]">
                Custom Order Inquiry Received
              </h2>
              <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed font-light">
                Thank you, <strong>{formData.customer_name}</strong>. Our couture master cutter and designer will review your specifications, fabric choice, and reference image. We will reach out via WhatsApp/Phone with an estimated quote and design sketch timeline.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-xl p-6 max-w-md mx-auto text-left text-xs space-y-2">
              <p><strong>Dress Type:</strong> {formData.dress_type}</p>
              <p><strong>Occasion:</strong> {formData.occasion}</p>
              {formData.preferred_colour && <p><strong>Colour:</strong> {formData.preferred_colour}</p>}
              <p><strong>Fabric:</strong> {formData.fabric_preference}</p>
              {formData.required_date && <p><strong>Target Delivery:</strong> {formData.required_date}</p>}
              <p><strong>Initial Status:</strong> <span className="text-amber-800 font-medium">New Request</span></p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/')}
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#58111A] rounded"
              >
                Return to Home
              </button>
              <button
                onClick={() => onNavigate('/collections')}
                className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-stone-700 bg-stone-100 rounded"
              >
                Explore Archives
              </button>
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

              {/* 01. Contact Info */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  01. Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurleen Kaur"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
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
                      placeholder="For sharing sketches and embroidery samples"
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

              {/* 02. Garment Details */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  02. Garment & Silhouette Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Dress / Silhouette Type *
                    </label>
                    <select
                      value={formData.dress_type}
                      onChange={(e) => setFormData({ ...formData, dress_type: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    >
                      {dressTypes.map((dt) => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Occasion
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Karaj, Sangeet, Engagement, Reception"
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Preferred Colour / Shade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wine, Deep Crimson, Dusty Rose, Ivory & Gold"
                      value={formData.preferred_colour}
                      onChange={(e) => setFormData({ ...formData, preferred_colour: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Fabric Preference
                    </label>
                    <select
                      value={formData.fabric_preference}
                      onChange={(e) => setFormData({ ...formData, fabric_preference: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    >
                      {fabrics.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Target Delivery / Event Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.required_date}
                      onChange={(e) => setFormData({ ...formData, required_date: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Budget Range (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹25,000 - ₹50,000 or USD / CAD"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 03. Reference Image Upload */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  03. Reference Image Inspiration
                </h3>
                <p className="text-xs text-stone-500">
                  Upload an image of an embroidery pattern, suit cut, or design you love.
                </p>

                <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center bg-stone-50/50">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-40 h-40 rounded-lg overflow-hidden border border-stone-300 shadow-sm relative group">
                        <img src={previewUrl} alt="Reference Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-stone-600 font-medium">{referenceFile?.name}</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-[#58111A] hover:underline font-semibold"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-stone-400" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-xs font-semibold text-[#58111A] bg-white border border-[#58111A]/40 rounded hover:bg-[#FAF7F2]"
                      >
                        Select Reference Image from Device
                      </button>
                      <span className="text-[11px] text-stone-500">PNG, JPG, or WEBP up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 04. Measurements & Notes */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl text-[#58111A] border-b border-stone-100 pb-2">
                  04. Sizing & Additional Notes
                </h3>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Custom Measurements (Optional - or leave blank for guided measurement session)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter Bust, Waist, Hips, Kurti Length, Salwar Length, Sleeve Length, or mention 'Will provide over WhatsApp / Video call'."
                    value={formData.measurements}
                    onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Special Design Requests & Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific requests regarding neckline, embroidery density, dupatta borders, tassels, or lining fabric..."
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:border-[#58111A] focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-stone-500">
                  Custom commissions are handcrafted by our generational artisans.
                </span>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] disabled:opacity-50 rounded transition-all shadow-md active:scale-95"
                >
                  <Scissors className="w-4 h-4 text-[#C5A059]" />
                  <span>{submitting ? 'Submitting Custom Order...' : 'Submit Custom Order Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
