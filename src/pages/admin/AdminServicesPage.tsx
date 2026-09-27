import React, { useState, useEffect } from 'react';
import { ServiceItem } from '../../types/database';
import { getServices, createService, updateService, deleteService } from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Scissors, Search, X } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    full_details: '',
    image_url: '',
    price_starting_from: '₹12,500',
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
      const data = await getServices(false);
      setServices(data);
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
      full_details: '',
      image_url: '',
      price_starting_from: '₹12,500',
      status: 'published',
      sort_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setEditingItem(svc);
    setFormData({
      name: svc.name,
      slug: svc.slug,
      description: svc.description,
      full_details: svc.full_details || '',
      image_url: svc.image_url || '',
      price_starting_from: svc.price_starting_from || '',
      status: svc.status || 'published',
      sort_order: svc.sort_order || 0,
    });
    setIsModalOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
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
      showToast('Service name is required', 'error');
      return;
    }
    const cleanSlug = formData.slug.trim() || generateSlug(formData.name);

    try {
      if (editingItem) {
        await updateService(editingItem.id, { ...formData, slug: cleanSlug });
        showToast('Service updated successfully', 'success');
      } else {
        await createService({ ...formData, slug: cleanSlug });
        showToast('Service created successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to save service', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      showToast('Service deleted successfully', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete service', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const list = [...services];
    const itemA = list[index];
    const itemB = list[targetIndex];

    const temp = itemA.sort_order;
    itemA.sort_order = itemB.sort_order;
    itemB.sort_order = temp;

    setServices(list);
    await Promise.all([
      updateService(itemA.id, { sort_order: itemA.sort_order }),
      updateService(itemB.id, { sort_order: itemB.sort_order }),
    ]);
    showToast('Display order updated', 'info');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Couture Services CMS</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage bespoke stitching, bridal consultations, embroidery, and starting prices.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-4">
          <Scissors className="w-10 h-10 text-[#C5A059] mx-auto" />
          <h3 className="font-serif text-xl text-white">No services created yet</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Add services like Custom Punjabi Stitching, Patiala Salwar Tailoring, or Bridal Trousseau Design.
          </p>
          <button
            onClick={handleOpenNew}
            className="px-5 py-2 text-xs font-semibold text-stone-950 bg-[#C5A059] rounded-lg"
          >
            Add First Service
          </button>
        </div>
      ) : (
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141210] border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">Order</th>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {services.map((svc, index) => (
                <tr key={svc.id} className="hover:bg-stone-800/40">
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, 'down')}
                        disabled={index === services.length - 1}
                        className="p-1 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-12 h-10 rounded overflow-hidden bg-stone-950 border border-stone-800">
                      {svc.image_url ? (
                        <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-600">
                          <Scissors className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-white text-sm">
                    {svc.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-stone-300">
                    {svc.price_starting_from || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {svc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(svc)}
                        className="p-1.5 text-[#C5A059] hover:text-white hover:bg-stone-800 rounded"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(svc.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded"
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
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-stone-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-2xl text-white">
                {editingItem ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Custom Bridal Patiala Suit Stitching"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                    Price Starting From
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000"
                    value={formData.price_starting_from}
                    onChange={(e) => setFormData({ ...formData, price_starting_from: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                  Full Details & Inclusions
                </label>
                <textarea
                  rows={3}
                  value={formData.full_details}
                  onChange={(e) => setFormData({ ...formData, full_details: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <ImageUploadField
                label="Service Illustration / Showcase Photo"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                aspectRatioHint="Recommended: 16:9 or 4:3 photograph"
                initialAspect={16 / 9}
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
                  Save Service
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
            <h4 className="font-serif text-xl text-white">Delete Service?</h4>
            <p className="text-xs text-stone-400">Are you sure you want to remove this service from the boutique?</p>
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
