import React, { useState } from 'react';
import { X, Ruler, Check, Copy, Sparkles, HelpCircle } from 'lucide-react';
import { useCouture } from '../../context/CoutureContext';

export const MeasurementGuideModal: React.FC = () => {
  const { measurements, updateMeasurements, measurementModalOpen, setMeasurementModalOpen } = useCouture();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'guide'>('form');

  if (!measurementModalOpen) return null;

  const handleCopy = () => {
    const text = `AK Couture - Bespoke Measurements (${measurements.unit}):
• Bust: ${measurements.bust || 'N/A'} ${measurements.unit}
• Waist: ${measurements.waist || 'N/A'} ${measurements.unit}
• Hips: ${measurements.hips || 'N/A'} ${measurements.unit}
• Shoulder Width: ${measurements.shoulder || 'N/A'} ${measurements.unit}
• Armhole: ${measurements.armhole || 'N/A'} ${measurements.unit}
• Sleeve Length: ${measurements.sleeveLength || 'N/A'} ${measurements.unit}
• Kurta / Kameez Length: ${measurements.kurtaLength || 'N/A'} ${measurements.unit}
• Salwar / Bottom Length: ${measurements.bottomLength || 'N/A'} ${measurements.unit}
• Front Neck Depth: ${measurements.neckDepthFront || 'N/A'} ${measurements.unit}
• Back Neck Depth: ${measurements.neckDepthBack || 'N/A'} ${measurements.unit}
• Client Height: ${measurements.height || 'N/A'}
• Special Notes: ${measurements.notes || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] text-[#1C1917] rounded-2xl shadow-2xl border border-[#C5A059]/40 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#2D080E] text-[#FAF7F2] flex items-center justify-between border-b border-[#C5A059]/40">
          <div className="flex items-center gap-2.5">
            <Ruler className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h3 className="font-serif text-xl tracking-wide">Bespoke Fitting & Measurement Guide</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059]">
                Precision Tailoring for Flawless Fall & Silhouette
              </p>
            </div>
          </div>
          <button
            onClick={() => setMeasurementModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#EADDD0] bg-[#F4EDE4] text-xs font-medium">
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'form'
                ? 'bg-[#FAF7F2] text-[#58111A] font-semibold border-b-2 border-[#58111A]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Enter My Measurements
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 text-center transition cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#FAF7F2] text-[#58111A] font-semibold border-b-2 border-[#58111A]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            How To Measure (Visual Guide)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'form' ? (
            <div className="space-y-5">
              {/* Unit Toggle */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EADDD0]">
                <div className="flex items-center gap-2 text-xs text-stone-700">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Measurements auto-save to your browser for fast checkout & consultations.</span>
                </div>
                <div className="flex items-center gap-1 bg-[#F4EDE4] p-1 rounded-lg text-xs">
                  <button
                    onClick={() => updateMeasurements({ unit: 'inches' })}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      measurements.unit === 'inches' ? 'bg-[#58111A] text-white font-medium' : 'text-stone-600'
                    }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => updateMeasurements({ unit: 'cm' })}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      measurements.unit === 'cm' ? 'bg-[#58111A] text-white font-medium' : 'text-stone-600'
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                </div>
              </div>

              {/* Grid of Measurements */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Bust ({measurements.unit}) *
                  </label>
                  <input
                    type="text"
                    value={measurements.bust}
                    onChange={(e) => updateMeasurements({ bust: e.target.value })}
                    placeholder="e.g. 36"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Waist ({measurements.unit}) *
                  </label>
                  <input
                    type="text"
                    value={measurements.waist}
                    onChange={(e) => updateMeasurements({ waist: e.target.value })}
                    placeholder="e.g. 30"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Hips ({measurements.unit}) *
                  </label>
                  <input
                    type="text"
                    value={measurements.hips}
                    onChange={(e) => updateMeasurements({ hips: e.target.value })}
                    placeholder="e.g. 40"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Shoulder Width
                  </label>
                  <input
                    type="text"
                    value={measurements.shoulder}
                    onChange={(e) => updateMeasurements({ shoulder: e.target.value })}
                    placeholder="e.g. 14.5"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Armhole Round
                  </label>
                  <input
                    type="text"
                    value={measurements.armhole}
                    onChange={(e) => updateMeasurements({ armhole: e.target.value })}
                    placeholder="e.g. 17"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Sleeve Length
                  </label>
                  <input
                    type="text"
                    value={measurements.sleeveLength}
                    onChange={(e) => updateMeasurements({ sleeveLength: e.target.value })}
                    placeholder="e.g. 19 (Full) / 10"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Kameez / Kurta Length
                  </label>
                  <input
                    type="text"
                    value={measurements.kurtaLength}
                    onChange={(e) => updateMeasurements({ kurtaLength: e.target.value })}
                    placeholder="e.g. 38"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Salwar / Bottom Length
                  </label>
                  <input
                    type="text"
                    value={measurements.bottomLength}
                    onChange={(e) => updateMeasurements({ bottomLength: e.target.value })}
                    placeholder="e.g. 39"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Front / Back Neck
                  </label>
                  <input
                    type="text"
                    value={measurements.neckDepthFront}
                    onChange={(e) => updateMeasurements({ neckDepthFront: e.target.value })}
                    placeholder="e.g. 7.5 front / 8 back"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1 text-xs">
                  Your Height & Fit Preferences (e.g. 5&apos;6&quot;, Relaxed Fit, Heavy Gher, Slim Arms)
                </label>
                <textarea
                  rows={2}
                  value={measurements.notes}
                  onChange={(e) => updateMeasurements({ notes: e.target.value })}
                  placeholder="Tell our master couturier any fit specifications..."
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D5C7B5] rounded focus:outline-none focus:border-[#58111A]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C5A059]" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Measurements'}</span>
                </button>
                <button
                  onClick={() => setMeasurementModalOpen(false)}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#6B1D2F] transition cursor-pointer"
                >
                  Save & Return
                </button>
              </div>
            </div>
          ) : (
            /* Visual Measurement Guide */
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="bg-white p-4 rounded-xl border border-[#EADDD0] space-y-3">
                <h4 className="font-serif text-base text-[#58111A] font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                  <span>How Our Master Karigars Measure:</span>
                </h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li><strong>Bust:</strong> Measure around the fullest part of your chest with a comfortable bra on, keeping the tape straight across the back.</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline, usually 1 to 2 inches above your navel.</li>
                  <li><strong>Hips:</strong> Stand with feet together and measure around the fullest part of your seat.</li>
                  <li><strong>Kameez Length:</strong> From the top shoulder seam, measure down to your preferred hemline (usually below knees or mid-calf).</li>
                  <li><strong>Salwar / Pants Length:</strong> Measure from the waistband down to the ankle bone or top of feet.</li>
                  <li><strong>Shoulder:</strong> Measure across the back from the edge of one shoulder bone straight to the other.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#F2E8DC] rounded-xl text-center text-xs text-stone-800">
                <p className="font-medium text-[#58111A]">Need Virtual Assistance?</p>
                <p className="mt-1 text-stone-600">
                  Our stylist can guide you live over a 10-minute video call. Select &ldquo;Virtual Video Consultation&rdquo; on the appointment booking page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
