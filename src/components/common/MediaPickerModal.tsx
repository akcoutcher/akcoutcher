import React, { useState, useEffect, useRef } from 'react';
import { Upload, Search, Check, X, Trash2, Eye, Crop, Sparkles } from 'lucide-react';
import { MediaItem } from '../../types/database';
import { getMediaList, uploadMediaFile, deleteMediaItem } from '../../lib/db';
import { ImageCropperModal } from './ImageCropperModal';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string, altText?: string) => void;
  title?: string;
  initialAspect?: number;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select or Upload Couture Image',
  initialAspect,
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageToCrop, setRawImageToCrop] = useState<string | null>(null);
  const [pendingFileName, setPendingFileName] = useState('boutique-asset.jpg');

  // Preview overlay
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const items = await getMediaList();
      setMediaItems(items);
      if (items.length > 0 && !selectedItem) {
        setSelectedItem(items[0]);
      }
    } catch (e) {
      console.error('Failed to load media:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    setPendingFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageToCrop(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be chosen again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropCompleteAndUpload = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const uploadedItem = await uploadMediaFile(
        blob,
        pendingFileName.replace(/\.[^/.]+$/, '') + '-cropped.jpg',
        'Boutique Couture Media Asset'
      );
      setMediaItems((prev) => [uploadedItem, ...prev]);
      setSelectedItem(uploadedItem);
    } catch (err) {
      console.error('Error uploading cropped image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}" from your media library?`)) {
      return;
    }
    try {
      await deleteMediaItem(item.id, item.storage_path);
      setMediaItems((prev) => prev.filter((m) => m.id !== item.id));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    } catch (e) {
      console.error('Error deleting media:', e);
    }
  };

  const filteredItems = mediaItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-5xl bg-[#FAF7F2] border border-stone-300 rounded-xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F5EFE6]">
            <div>
              <h3 className="text-xl font-serif font-semibold text-[#1C1917]">{title}</h3>
              <p className="text-xs text-stone-600">Select from Media Library or upload a new high-resolution photo</p>
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
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded-lg transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4 text-[#C5A059]" />
                <span>{isUploading ? 'Uploading...' : 'Upload & Crop New'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="px-6 py-3 border-b border-stone-200 bg-white flex items-center gap-3">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search images by name or alt text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none text-stone-800"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-xs text-stone-400 hover:text-stone-700">
                Clear
              </button>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grid of images */}
            <div className="md:col-span-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
                  Loading media library...
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50/50">
                  <Sparkles className="w-8 h-8 text-[#C5A059] mb-2" />
                  <p className="text-sm font-medium text-stone-700 mb-1">No media files found</p>
                  <p className="text-xs text-stone-500 max-w-xs mb-4">
                    Upload bespoke photoshoot images, bridal lehenga shots, or client reference designs.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 text-xs font-medium text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded-lg"
                  >
                    Upload First Photo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-2 border-[#58111A] ring-2 ring-[#C5A059]/40 shadow-md'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <img
                          src={item.url}
                          alt={item.alt_text || item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#58111A] text-white rounded-full flex items-center justify-center shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between text-white text-[11px]">
                          <span className="truncate max-w-[70%]">{item.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewMedia(item);
                            }}
                            className="p-1 hover:text-[#C5A059]"
                            title="Preview full size"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Details of Selected Image */}
            <div className="border border-stone-200 rounded-xl bg-white p-4 flex flex-col justify-between">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-200 bg-stone-100 relative group">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.alt_text}
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(selectedItem)}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white rounded hover:bg-black"
                      title="Expand preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-stone-500 font-medium block">File Name:</span>
                      <p className="text-stone-900 font-medium truncate">{selectedItem.name}</p>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium block">Alt Text / Description:</span>
                      <p className="text-stone-700">{selectedItem.alt_text || 'No alt text provided'}</p>
                    </div>
                    <div className="flex items-center gap-3 text-stone-500">
                      <span>Type: {selectedItem.mime_type}</span>
                      <span>•</span>
                      <span>Size: {Math.round(selectedItem.size_bytes / 1024)} KB</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-medium block">Direct URL:</span>
                      <input
                        type="text"
                        readOnly
                        value={selectedItem.url}
                        className="w-full bg-stone-50 border border-stone-200 rounded px-2 py-1 text-[11px] text-stone-600 select-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setRawImageToCrop(selectedItem.url);
                        setPendingFileName(selectedItem.name);
                        setCropModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                    >
                      <Crop className="w-3.5 h-3.5 text-[#58111A]" />
                      <span>Re-Crop Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMedia(selectedItem)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-stone-400 py-12">
                  Select an image from the grid to view details and use it.
                </div>
              )}

              {/* Bottom action */}
              <div className="pt-4 border-t border-stone-200 mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={() => {
                    if (selectedItem) {
                      onSelectImage(selectedItem.url, selectedItem.alt_text);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] disabled:opacity-40 rounded-lg shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Use Selected Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Cropper Modal */}
      {cropModalOpen && rawImageToCrop && (
        <ImageCropperModal
          isOpen={cropModalOpen}
          imageSrc={rawImageToCrop}
          initialAspect={initialAspect}
          onClose={() => setCropModalOpen(false)}
          onCropSave={handleCropCompleteAndUpload}
        />
      )}

      {/* Full preview overlay */}
      {previewMedia && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A059]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewMedia.url}
              alt={previewMedia.alt_text}
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl border border-stone-700"
            />
            <p className="text-sm text-stone-300 mt-3">{previewMedia.name}</p>
          </div>
        </div>
      )}
    </>
  );
};
