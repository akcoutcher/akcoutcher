import React, { useState } from 'react';
import { Image as ImageIcon, Crop, Trash2, Upload } from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';
import { ImageCropperModal } from './ImageCropperModal';
import { uploadMediaFile } from '../../lib/db';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatioHint?: string;
  initialAspect?: number;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  aspectRatioHint = 'Recommended: 3:4 portrait or 4:3',
  initialAspect,
  description,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCropSave = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const item = await uploadMediaFile(blob, `edited-${Date.now()}.jpg`, label);
      onChange(item.url);
    } catch (e) {
      console.error('Failed to upload cropped image:', e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700">{label}</label>
        {aspectRatioHint && <span className="text-[11px] text-stone-600">{aspectRatioHint}</span>}
      </div>
      {description && <p className="text-[11px] text-stone-600 mb-1">{description}</p>}

      <div className="flex flex-col sm:flex-row items-start gap-4 p-3 border border-stone-200 rounded-lg bg-stone-50/50">
        {value ? (
          <div className="relative group w-32 h-32 rounded-lg overflow-hidden border border-stone-300 bg-white shrink-0 shadow-sm">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCropModalOpen(true)}
                title="Crop / Rotate Image"
                className="p-1.5 bg-white text-stone-800 rounded-full hover:bg-[#C5A059] hover:text-white transition-colors"
              >
                <Crop className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                title="Remove Image"
                className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 bg-white shrink-0">
            <ImageIcon className="w-6 h-6 stroke-1 mb-1 text-stone-400" />
            <span className="text-[11px] text-stone-500">No Image</span>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-between self-stretch gap-2">
          <div className="space-y-1">
            <input
              type="text"
              placeholder="Or paste external / Supabase image URL directly"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded focus:border-[#58111A] focus:outline-none text-stone-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#58111A] bg-[#FAF7F2] border border-[#58111A]/30 hover:border-[#58111A] rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Media Library & Cropper</span>
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setCropModalOpen(true)}
                disabled={isUploading}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 rounded"
              >
                <Crop className="w-3 h-3 text-stone-500" />
                <span>{isUploading ? 'Cropping...' : 'Crop / Rotate'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        title={`Select Image for ${label}`}
        initialAspect={initialAspect}
        onClose={() => setPickerOpen(false)}
        onSelectImage={(url) => onChange(url)}
      />

      {cropModalOpen && value && (
        <ImageCropperModal
          isOpen={cropModalOpen}
          imageSrc={value}
          initialAspect={initialAspect}
          onClose={() => setCropModalOpen(false)}
          onCropSave={handleCropSave}
        />
      )}
    </div>
  );
};
