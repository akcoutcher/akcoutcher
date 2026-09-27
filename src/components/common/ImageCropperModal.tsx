import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { RotateCw, ZoomIn, ZoomOut, Check, X, RefreshCw, FlipHorizontal, Eye } from 'lucide-react';
import { getCroppedImg } from '../../utils/cropImage';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropSave: (croppedBlob: Blob, croppedUrl: string) => void;
  initialAspect?: number | undefined;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropSave,
  initialAspect,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(initialAspect || undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setAspect(undefined);
    setPreviewUrl(null);
  };

  const handleGeneratePreview = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      const { url } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip);
      setPreviewUrl(url);
      setShowPreviewModal(true);
    } catch (e) {
      console.error('Error generating crop preview:', e);
    }
  };

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsProcessing(true);
    try {
      const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, flip);
      onCropSave(file, url);
      onClose();
    } catch (e) {
      console.error('Error saving cropped image:', e);
      alert('Failed to process image crop. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#1C1917] border border-stone-800 rounded-xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
          <div>
            <h3 className="text-lg font-serif text-[#FAF7F2] font-semibold">Image Studio & Precision Cropper</h3>
            <p className="text-xs text-stone-400">Crop, rotate, zoom, and adjust aspect ratio before publishing</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Work Area */}
        <div className="relative w-full h-[380px] sm:h-[440px] bg-stone-950 overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            showGrid={true}
            cropShape="rect"
            style={{
              containerStyle: { background: '#0C0A09' },
              cropAreaStyle: { border: '2px solid #C5A059' },
            }}
          />
        </div>

        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 space-y-4">
          {/* Aspect Ratios & Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-stone-400 mr-1 font-medium">Aspect:</span>
              <button
                type="button"
                onClick={() => setAspect(undefined)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  aspect === undefined ? 'bg-[#C5A059] text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => setAspect(1)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  aspect === 1 ? 'bg-[#C5A059] text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                1:1 Square
              </button>
              <button
                type="button"
                onClick={() => setAspect(3 / 4)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  aspect === 3 / 4 ? 'bg-[#C5A059] text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                3:4 Portrait
              </button>
              <button
                type="button"
                onClick={() => setAspect(4 / 3)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  aspect === 4 / 3 ? 'bg-[#C5A059] text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                4:3 Standard
              </button>
              <button
                type="button"
                onClick={() => setAspect(16 / 9)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  aspect === 16 / 9 ? 'bg-[#C5A059] text-stone-950 font-semibold' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                }`}
              >
                16:9 Banner
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 90° Clockwise"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => setFlip((f) => ({ ...f, horizontal: !f.horizontal }))}
                title="Flip Horizontal"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  flip.horizontal ? 'bg-[#C5A059] text-stone-950 font-medium' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset adjustments"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Zoom Slider and Preview Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-stone-800/80">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <ZoomOut className="w-4 h-4 text-stone-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full sm:w-48 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
              <ZoomIn className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-mono text-stone-400 w-10">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleGeneratePreview}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Preview Crop</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-300 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg transition-all shadow-md"
              >
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isProcessing ? 'Processing...' : 'Apply & Save Image'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Preview Modal overlay if user clicks "Preview Crop" */}
      {showPreviewModal && previewUrl && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl max-w-lg w-full flex flex-col items-center gap-4">
            <div className="flex justify-between items-center w-full">
              <h4 className="text-sm font-medium text-white">Cropped Result Preview</h4>
              <button onClick={() => setShowPreviewModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[350px] overflow-hidden rounded border border-stone-800">
              <img src={previewUrl} alt="Crop Preview" className="max-h-[350px] w-auto object-contain" />
            </div>
            <div className="flex justify-end w-full gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 rounded"
              >
                Back to Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPreviewModal(false);
                  handleSave();
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#C5A059] text-stone-950 rounded hover:bg-[#D4AF37]"
              >
                Confirm & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
