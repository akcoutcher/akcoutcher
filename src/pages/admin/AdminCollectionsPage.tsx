import React, { useState, useEffect } from 'react';
import { CollectionItem } from '../../types/database';
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  Sparkles,
  Search,
  X
} from 'lucide-react';

export const AdminCollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Bridal Wear',
    description: '',
    cover_image: '',
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
      const data = await getCollections(false);
      setCollections(data);
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
      category: 'Bridal Wear',
      description: '',
      cover_image: '',
      featured: false,
      status: 'published',
      sort_order: collections.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col: CollectionItem) => {
    setEditingItem(col);
    setFormData({
      name: col.name,
      slug: col.slug,
      category: col.category || 'Bridal Wear',
      description: col.description || '',
      cover_image: col.cover_image || '',
      featured: col.featured || false,
      status: col.status || 'published',
      sort_order: col.sort_order || 0,
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
      showToast('Collection name is required', 'error');
      return;
    }

    const cleanSlug = formData.slug.trim() || generateSlug(formData.name);

    try {
      if (editingItem) {
        await updateCollection(editingItem.id, {
          ...formData,
          slug: cleanSlug,
        });
        showToast('Collection updated successfully', 'success');
      } else {
        await createCollection({
          ...formData,
          slug: cleanSlug,
        });
        showToast('Collection created successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to save collection', 'error');
    }
  };

  const handleDuplicate = async (col: CollectionItem) => {
    try {
      await createCollection({
        name: `${col.name} (Copy)`,
        slug: `${col.slug}-copy-${Date.now().toString().slice(-4)}`,
        category: col.category,
        description: col.description,
        cover_image: col.cover_image,
        featured: false,
        status: 'draft',
        sort_order: col.sort_order + 1,
      });
      showToast('Collection duplicated as draft', 'success');
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to duplicate collection', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id);
      showToast('Collection deleted successfully', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete collection', 'error');
    }
  };

  const handleToggleStatus = async (col: CollectionItem) => {
    const nextStatus = col.status === 'published' ? 'draft' : 'published';
    try {
      await updateCollection(col.id, { status: nextStatus });
      showToast(`Collection marked as ${nextStatus}`, 'info');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= collections.length) return;

    const newCols = [...collections];
    const itemA = newCols[index];
    const itemB = newCols[targetIndex];

    const tempOrder = itemA.sort_order;
    itemA.sort_order = itemB.sort_order;
    itemB.sort_order = tempOrder;

    setCollections(newCols);
    await Promise.all([
      updateCollection(itemA.id, { sort_order: itemA.sort_order }),
      updateCollection(itemB.id, { sort_order: itemB.sort_order }),
    ]);
    showToast('Display order updated', 'info');
    loadData();
  };

  const filtered = collections.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Collections Management</h1>
          <p className="text-xs text-stone-400 mt-1">
            Organize haute couture bridal, salwar, and festive suites. All changes reflect live.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Collection</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search collections by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
        <div className="text-xs text-stone-400 font-mono">
          Total: <strong className="text-white">{collections.length}</strong> · Published:{' '}
          <strong className="text-emerald-400">
            {collections.filter((c) => c.status === 'published').length}
          </strong>
        </div>
      </div>

      {/* Collections Table / Grid */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading collections...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-4">
          <Sparkles className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="font-serif text-xl text-white">No collections found</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No collections matching your search criteria.'
              : 'Create your first haute couture collection to showcase on the boutique.'}
          </p>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] rounded-lg"
          >
            Create First Collection
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
                  <th className="py-3 px-4">Name & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {filtered.map((col, index) => (
                  <tr key={col.id} className="hover:bg-stone-800/40 transition-colors">
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

                    {/* Cover thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-14 rounded overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                        {col.cover_image ? (
                          <img src={col.cover_image} alt={col.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-white text-sm">{col.name}</p>
                      <p className="font-mono text-[11px] text-stone-500">/collections/{col.slug}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-stone-300">{col.category}</span>
                    </td>

                    {/* Status toggle */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(col)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold transition-colors ${
                          col.status === 'published'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {col.status}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {col.featured ? (
                        <span className="text-[#C5A059] font-medium text-[11px]">★ Featured</span>
                      ) : (
                        <span className="text-stone-500 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(col)}
                          className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded"
                          title="Duplicate Collection"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(col)}
                          className="p-1.5 text-[#C5A059] hover:text-white hover:bg-stone-800 rounded"
                          title="Edit Collection"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(col.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
                          title="Delete Collection"
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

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-2xl text-white">
                {editingItem ? 'Edit Couture Collection' : 'Create New Collection'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Patiala Heritage 2026"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="royal-patiala-heritage-2026"
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
                    placeholder="Bridal Wear, Patiala Suits, Festive..."
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Collection Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Atmosphere, embroidery style, fabric choices, and silhouette details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <ImageUploadField
                label="Collection Cover Image"
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url })}
                aspectRatioHint="Recommended: 3:4 portrait or 4:3 high-res photo"
                initialAspect={3 / 4}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Status
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
                    id="featured-check"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#C5A059] rounded"
                  />
                  <label htmlFor="featured-check" className="text-xs text-stone-300 cursor-pointer">
                    Feature on Homepage Carousel
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
                  {editingItem ? 'Save Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Collection?</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Are you sure you want to delete this collection? This action cannot be undone. Associated designs will remain in the catalog.
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
                Delete Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
