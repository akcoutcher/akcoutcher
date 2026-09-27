import React, { useState, useEffect } from 'react';
import { DesignItem, CollectionItem } from '../../types/database';
import {
  getDesigns,
  createDesign,
  updateDesign,
  deleteDesign,
  getCollections,
} from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { MediaPickerModal } from '../../components/common/MediaPickerModal';
import { useToast } from '../../components/common/Toast';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Search,
  X,
  Image as ImageIcon,
  Check
} from 'lucide-react';

export const AdminDesignsPage: React.FC = () => {
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DesignItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Additional image gallery picker modal
  const [galleryPickerOpen, setGalleryPickerOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'Bridal Salwar Suit',
    collection_id: '',
    price: '' as string | number,
    price_label: 'Price on Request',
    cover_image: '',
    images: [] as string[],
    fabric_details: '',
    embroidery_details: '',
    featured: false,
    status: 'published' as 'published' | 'draft' | 'archived',
    sort_order: 0,
  });

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [d, c] = await Promise.all([getDesigns(false), getCollections(false)]);
      setDesigns(d);
      setCollections(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      category: 'Bridal Salwar Suit',
      collection_id: collections[0]?.id || '',
      price: '',
      price_label: 'Price on Request',
      cover_image: '',
      images: [],
      fabric_details: 'Pure Handspun Silk, Chanderi Organza Dupatta',
      embroidery_details: 'Authentic Zardozi & Tilla Hand Embroidery',
      featured: false,
      status: 'published',
      sort_order: designs.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DesignItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      description: item.description || '',
      category: item.category || 'Bridal Salwar Suit',
      collection_id: item.collection_id || '',
      price: item.price !== null && item.price !== undefined ? item.price : '',
      price_label: item.price_label || 'Price on Request',
      cover_image: item.cover_image || '',
      images: Array.isArray(item.images) ? item.images : [],
      fabric_details: item.fabric_details || '',
      embroidery_details: item.embroidery_details || '',
      featured: item.featured || false,
      status: item.status || 'published',
      sort_order: item.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingItem ? prev.slug : generateSlug(name),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Design name is required', 'error');
      return;
    }

    const cleanSlug = formData.slug.trim() || generateSlug(formData.name);
    const parsedPrice = formData.price !== '' ? Number(formData.price) : null;

    try {
      if (editingItem) {
        await updateDesign(editingItem.id, {
          ...formData,
          slug: cleanSlug,
          price: parsedPrice,
          collection_id: formData.collection_id || null,
        });
        showToast('Design updated successfully', 'success');
      } else {
        await createDesign({
          ...formData,
          slug: cleanSlug,
          price: parsedPrice,
          collection_id: formData.collection_id || null,
        });
        showToast('Design added to catalog successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to save design', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDesign(id);
      showToast('Design deleted successfully', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete design', 'error');
    }
  };

  const handleToggleStatus = async (item: DesignItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await updateDesign(item.id, { status: nextStatus });
      showToast(`Design marked as ${nextStatus}`, 'info');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= designs.length) return;

    const newItems = [...designs];
    const itemA = newItems[index];
    const itemB = newItems[targetIndex];

    const tempOrder = itemA.sort_order;
    itemA.sort_order = itemB.sort_order;
    itemB.sort_order = tempOrder;

    setDesigns(newItems);
    await Promise.all([
      updateDesign(itemA.id, { sort_order: itemA.sort_order }),
      updateDesign(itemB.id, { sort_order: itemB.sort_order }),
    ]);
    showToast('Design order updated', 'info');
    loadData();
  };

  const handleAddGalleryImage = (url: string) => {
    if (!formData.images.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSetCoverFromGallery = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      cover_image: url,
    }));
    showToast('Set as cover image', 'info');
  };

  const filtered = designs.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Designs & Ensembles</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage bespoke bridal suits, Patiala suits, fabrics, multiple images, and pricing.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Design</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search designs by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Total: <strong className="text-white">{designs.length}</strong> · Published:{' '}
          <strong className="text-emerald-400">
            {designs.filter((d) => d.status === 'published').length}
          </strong>
        </div>
      </div>

      {/* Designs Table */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading couture designs...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="font-serif text-xl text-white">No designs found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No designs matching your search term.'
              : 'Add your first bespoke Punjabi suit or bridal lehenga ensemble.'}
          </p>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] rounded-lg"
          >
            Create First Design
          </button>
        </div>
      ) : (
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141210] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Order</th>
                  <th className="py-3 px-4 w-16">Cover</th>
                  <th className="py-3 px-4">Design Name & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Gallery</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                    {/* Order up/down */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === filtered.length - 1}
                          className="p-1 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 rounded overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                        {item.cover_image ? (
                          <img src={item.cover_image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-white text-sm">{item.name}</p>
                      <p className="font-mono text-[11px] text-stone-500">/designs/{item.slug}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-stone-300">
                      {item.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono">
                      {item.price ? `₹${Number(item.price).toLocaleString('en-IN')}` : item.price_label || 'Price on Request'}
                    </td>

                    {/* Image count */}
                    <td className="py-3 px-4 text-stone-400">
                      {Array.isArray(item.images) ? item.images.length : 0} photos
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                          item.status === 'published'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {item.featured ? (
                        <span className="text-[#C5A059] font-medium text-[11px]">★ Yes</span>
                      ) : (
                        <span className="text-stone-500 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-[#C5A059] hover:text-white hover:bg-stone-800 rounded"
                          title="Edit Design"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                          title="Delete Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Design Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-2xl text-white">
                {editingItem ? 'Edit Couture Design' : 'Add New Couture Design'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Primary details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Design Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Maroon Silk Patiala Suit"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="royal-maroon-silk-patiala"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="Bridal Suits, Patiala Suits..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Collection Suite
                    </label>
                    <select
                      value={formData.collection_id}
                      onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="">(None / Standalone Design)</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Price (Numeric in ₹ INR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 38500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Price Label / Custom Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Price on Request or Starting from ₹35,000"
                      value={formData.price_label}
                      onChange={(e) => setFormData({ ...formData, price_label: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Design Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the silhouette cut, neck style, dupatta finish, and festive styling..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
                  />
                </div>
              </div>

              {/* Cover Image & Multiple Gallery Images */}
              <div className="space-y-4 pt-4 border-t border-stone-800">
                <ImageUploadField
                  label="Primary Cover Image"
                  value={formData.cover_image}
                  onChange={(url) => setFormData({ ...formData, cover_image: url })}
                  aspectRatioHint="Recommended: 3:4 portrait (fits luxury card perfectly)"
                  initialAspect={3 / 4}
                />

                {/* Multiple Images Gallery */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Additional Showcase Images (Multiple)
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryPickerOpen(true)}
                      className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Photos from Library</span>
                    </button>
                  </div>

                  {formData.images.length === 0 ? (
                    <div className="p-4 bg-stone-950 border border-stone-800 rounded-lg text-center text-xs text-stone-500">
                      No additional photos added yet. Click "+ Add Photos from Library" to add detailed embroidery close-ups and alternate angles.
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-3 bg-stone-950 border border-stone-800 rounded-lg">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-[3/4] rounded overflow-hidden border border-stone-700 group bg-stone-900">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                            <button
                              type="button"
                              onClick={() => handleSetCoverFromGallery(img)}
                              className="text-[9px] bg-[#58111A] text-white px-1.5 py-0.5 rounded hover:bg-[#6B1D2F]"
                              title="Set as Cover"
                            >
                              Make Cover
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(img)}
                              className="text-[9px] bg-red-900 text-white px-1.5 py-0.5 rounded hover:bg-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Craftsmanship Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Fabric Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Raw Silk, Organza Dupatta with Gota Laces"
                    value={formData.fabric_details}
                    onChange={(e) => setFormData({ ...formData, fabric_details: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Embroidery Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zardozi, Gota Patti, Antique Tilla"
                    value={formData.embroidery_details}
                    onChange={(e) => setFormData({ ...formData, embroidery_details: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Status and Visibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Publish Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="design-featured-check"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#C5A059] rounded"
                  />
                  <label htmlFor="design-featured-check" className="text-xs text-stone-300 cursor-pointer">
                    Feature on Homepage Spotlight
                  </label>
                </div>
              </div>

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
                  {editingItem ? 'Save Changes' : 'Create Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker for Additional Gallery Images */}
      {galleryPickerOpen && (
        <MediaPickerModal
          isOpen={galleryPickerOpen}
          title="Select Additional Showcase Image"
          initialAspect={3 / 4}
          onClose={() => setGalleryPickerOpen(false)}
          onSelectImage={(url) => {
            handleAddGalleryImage(url);
            showToast('Added photo to design gallery', 'success');
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Design?</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Are you sure you want to delete this design? It will immediately disappear from the public catalog.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-800 hover:bg-red-700 rounded-lg shadow"
              >
                Delete Design
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
