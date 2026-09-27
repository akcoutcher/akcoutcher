import React, { useState, useEffect } from 'react';
import { CustomOrderItem, CustomOrderStatus } from '../../types/database';
import { getCustomOrders, updateCustomOrderStatus, deleteCustomOrder } from '../../lib/db';
import { useToast } from '../../components/common/Toast';
import {
  ShoppingBag,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  Trash2,
  Edit3,
  Calendar,
  X,
  Search,
  Scissors
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CustomOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { showToast } = useToast();

  const statuses: CustomOrderStatus[] = [
    'new',
    'contacted',
    'designing',
    'approved',
    'in_production',
    'ready',
    'completed',
    'cancelled',
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCustomOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: CustomOrderStatus) => {
    try {
      await updateCustomOrderStatus(id, newStatus);
      showToast(`Order status updated to ${newStatus.replace('_', ' ')}`, 'success');
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to update order status', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const order = orders.find((o) => o.id === id);
      if (order) {
        await updateCustomOrderStatus(id, order.status, noteText);
        showToast('Internal notes saved', 'success');
        setEditingNotesId(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomOrder(id);
      showToast('Custom order deleted', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete order', 'error');
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.dress_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Custom Orders & Stitching</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage bespoke inquiries, client measurements, reference inspirations, and production stages.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-colors ${
              statusFilter === 'all' ? 'bg-[#58111A] text-white font-semibold' : 'text-stone-400 hover:text-white bg-stone-900'
            }`}
          >
            All
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-colors whitespace-nowrap ${
                statusFilter === st ? 'bg-[#58111A] text-white font-semibold' : 'text-stone-400 hover:text-white bg-stone-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search patron or dress type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading custom orders...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-2">
          <ShoppingBag className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
          <h3 className="font-serif text-xl text-white">No custom orders yet</h3>
          <p className="text-xs text-stone-400">
            {searchTerm || statusFilter !== 'all'
              ? 'No custom orders match the current filter.'
              : 'Patron custom stitching and bridal requests submitted via /custom-order will show here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const cleanWhatsapp = (order.whatsapp || order.phone).replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Hello ${order.customer_name}, this is Kaur Couture regarding your custom order for "${order.dress_type}".`
            )}`;

            return (
              <div
                key={order.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 shadow-sm text-xs hover:border-stone-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-base text-white">{order.customer_name}</span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-stone-800 text-[#C5A059] border border-stone-700">
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                      className="bg-stone-950 border border-stone-700 text-white text-[11px] rounded px-2.5 py-1 focus:outline-none focus:border-[#C5A059]"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(order.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-stone-300">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">Garment Specs</span>
                    <p className="font-medium text-white text-xs">{order.dress_type}</p>
                    <p className="text-stone-400 text-[11px]">Occasion: {order.occasion || 'Bespoke'}</p>
                    <p className="text-stone-400 text-[11px]">Fabric: {order.fabric_preference}</p>
                    {order.preferred_colour && <p className="text-stone-400 text-[11px]">Color: {order.preferred_colour}</p>}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">Timeline & Budget</span>
                    <p className="text-stone-300">Delivery: {order.required_date || 'Flexible'}</p>
                    <p className="text-stone-400">Budget: {order.budget || 'Not specified'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">Contact</span>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <a href={`tel:${order.phone}`} className="hover:text-white">{order.phone}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#C5A059]" />
                      <a href={`mailto:${order.email}`} className="hover:text-white truncate">{order.email}</a>
                    </div>
                    {cleanWhatsapp && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline pt-1 text-[11px]"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>

                  {/* Reference Image preview */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block mb-1">
                      Reference Photo
                    </span>
                    {order.reference_image ? (
                      <div
                        onClick={() => setPreviewImage(order.reference_image!)}
                        className="w-20 h-24 rounded overflow-hidden border border-stone-700 bg-stone-950 cursor-pointer relative group"
                      >
                        <img
                          src={order.reference_image}
                          alt="Customer Reference"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-500 text-[11px]">No reference image uploaded</span>
                    )}
                  </div>
                </div>

                {order.measurements && (
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded text-xs space-y-1">
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block">Customer Measurements:</span>
                    <p className="font-mono text-stone-300 whitespace-pre-line">{order.measurements}</p>
                  </div>
                )}

                {order.additional_notes && (
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded text-xs space-y-1">
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block">Additional Notes:</span>
                    <p className="italic text-stone-300 font-light">"{order.additional_notes}"</p>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  {editingNotesId === order.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Internal notes (e.g. Masterji assigned, silk dyed, sent draft sketch...)"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-2.5 py-1 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                      />
                      <button
                        onClick={() => handleSaveNotes(order.id)}
                        className="px-3 py-1 bg-[#C5A059] text-stone-950 font-semibold rounded"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingNotesId(null)} className="px-2 py-1 text-stone-400">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-stone-400">
                        {order.admin_notes ? (
                          <>Internal Note: <strong className="text-stone-200">{order.admin_notes}</strong></>
                        ) : (
                          <span className="text-stone-600">No production notes yet.</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesId(order.id);
                          setNoteText(order.admin_notes || '');
                        }}
                        className="text-[#C5A059] hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{order.admin_notes ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox for Reference Image */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A059]"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Reference Preview"
              className="max-h-[80vh] w-auto object-contain rounded-lg border border-stone-700 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Custom Order Record?</h4>
            <p className="text-xs text-stone-400">Are you sure you want to delete this custom order?</p>
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
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
