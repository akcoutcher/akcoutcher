import React, { useState, useEffect, useRef } from 'react';
import { MediaItem } from '../../types/database';
import { getMediaList, uploadMediaFile, deleteMediaItem } from '../../lib/db';
import { ImageCropperModal } from '../../components/common/ImageCropperModal';
import { useToast } from '../../components/common/Toast';
import {
  Upload,
  Search,
  Trash2,
  Crop,
  Copy,
  Eye,
  Check,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

export const AdminMediaPage: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Cropper states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState('boutique-asset.jpg');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const items = await getMediaList();
      setMediaItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setPendingFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageToCrop(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCompleteAndUpload = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const item = await uploadMediaFile(
        blob,
        pendingFileName.replace(/\.[^/.]+$/, '') + '-cropped.jpg',
        'Atelier Asset'
      );
      showToast('Image cropped and saved to storage!', 'success');
      setMediaItems((prev) => [item, ...prev]);
    } catch (e) {
      console.error(e);
      showToast('Failed to upload cropped image', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath?: string) => {
    try {
      await deleteMediaItem(id, storagePath);
      showToast('Media item deleted', 'success');
      setDeleteConfirmId(null);
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
      showToast('Failed to delete media', 'error');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Direct image URL copied to clipboard!', 'info');
  };

  const filtered = mediaItems.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Media Asset Library</h1>
          <p className="text-xs text-stone-400 mt-1">
            Store, crop, organize, and reuse photoshoot and campaign images directly via Supabase Storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload & Crop New'}</span>
          </button>
        </div>
      </div>

      {/* Search and Counts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Total Stored Media: <strong className="text-white">{mediaItems.length}</strong>
        </div>
      </div>

      {/* Grid of Media Cards */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading media assets...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="font-serif text-xl text-white">No media files in library</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Upload campaign photos, bridal suits, embroidery swatches, and logo assets.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] rounded-lg"
          >
            Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group flex flex-col justify-between hover:border-stone-700 transition-all shadow-sm"
            >
              <div className="aspect-square bg-stone-950 overflow-hidden relative">
                <img src={item.url} alt={item.alt_text} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMedia(item)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-full"
                    title="View Full Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRawImageToCrop(item.url);
                      setPendingFileName(item.name);
                      setCropperOpen(true);
                    }}
                    className="p-1.5 bg-stone-800 hover:bg-[#C5A059] hover:text-stone-950 text-white rounded-full transition-colors"
                    title="Crop this Image"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.url)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-full"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1.5 bg-stone-800 hover:bg-red-800 text-white rounded-full"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 space-y-1 text-xs">
                <p className="font-medium text-stone-200 truncate text-[11px]">{item.name}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>{item.size_bytes ? `${Math.round(item.size_bytes / 1024)} KB` : 'Asset'}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Cropper Modal */}
      {cropperOpen && rawImageToCrop && (
        <ImageCropperModal
          isOpen={cropperOpen}
          imageSrc={rawImageToCrop}
          onClose={() => setCropperOpen(false)}
          onCropSave={handleCropCompleteAndUpload}
        />
      )}

      {/* Lightbox Preview */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewMedia(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A059]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewMedia.url}
              alt={previewMedia.alt_text}
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-stone-700 shadow-2xl"
            />
            <p className="text-sm text-stone-300 mt-2">{previewMedia.name}</p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Media Item?</h4>
            <p className="text-xs text-stone-400">
              Permanently delete this image from Supabase storage? Any collection or design using it will lose its reference.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-stone-300 bg-stone-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const itm = mediaItems.find((m) => m.id === deleteConfirmId);
                  handleDelete(deleteConfirmId, itm?.storage_path);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-800 rounded"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
