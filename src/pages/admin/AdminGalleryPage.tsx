import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types/database';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Image as ImageIcon, X } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Bridal Couture',
    image_url: '',
    status: 'published' as 'published' | 'draft',
    sort_order: 0,
  });

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGallery(false);
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setFormData({
      title: '',
      caption: '',
      category: 'Bridal Couture',
      image_url: '',
      status: 'published',
      sort_order: items.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url) {
      showToast('Title and image are required', 'error');
      return;
    }

    try {
      await createGalleryItem(formData);
      showToast('Image added to gallery', 'success');
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to add gallery item', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGalleryItem(id);
      showToast('Gallery image removed', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete image', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Artisan Gallery CMS</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage high-resolution runway photography, bridal shoot archives, and atelier needlecraft details.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Gallery Image</span>
        </button>
      </div>

      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading gallery archive...</div>
      ) : items.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-4">
          <ImageIcon className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="font-serif text-xl text-white">No gallery items yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Upload photoshoot moments, client bridal looks, or hand-embroidery close-ups.
          </p>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] rounded-lg"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group flex flex-col justify-between"
            >
              <div className="aspect-[3/4] bg-stone-950 overflow-hidden relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-950/80 hover:bg-red-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete from Gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#C5A059] block">
                  {item.category}
                </span>
                <p className="text-xs font-medium text-white truncate">{item.title}</p>
                {item.caption && <p className="text-[11px] text-stone-400 line-clamp-1">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-2xl text-white">Add Photo to Gallery</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Maroon Velvet Bridal Suit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Bridal, Festive, Runway, Craftsmanship..."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief note on embroidery, styling, or patron event..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <ImageUploadField
                label="High-Resolution Photograph"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                aspectRatioHint="Recommended: 3:4 portrait or free crop"
                initialAspect={3 / 4}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Remove Gallery Photo?</h4>
            <p className="text-xs text-stone-400">Are you sure you want to remove this photo from the public gallery?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-stone-300 bg-stone-800 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-800 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
