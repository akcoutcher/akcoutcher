import React, { useState, useEffect } from 'react';
import { ContactMessageItem, ContactMessageStatus } from '../../types/database';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from '../../lib/db';
import { useToast } from '../../components/common/Toast';
import { Mail, Phone, Trash2, Search, Check, Archive, MessageSquare } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ContactMessageStatus) => {
    try {
      await updateContactMessageStatus(id, newStatus);
      showToast(`Message marked as ${newStatus}`, 'success');
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessage(id);
      showToast('Message deleted', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete message', 'error');
    }
  };

  const filtered = messages.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Inquiries & Contact Messages</h1>
          <p className="text-xs text-stone-400 mt-1">
            Read and respond to inquiries submitted through the boutique contact form.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'unread', 'read', 'replied', 'archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-colors ${
                statusFilter === st ? 'bg-[#58111A] text-white font-semibold' : 'text-stone-400 hover:text-white bg-stone-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search by patron name, email, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading inquiries...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-2">
          <Mail className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
          <h3 className="font-serif text-xl text-white">No inquiries yet</h3>
          <p className="text-xs text-stone-400">
            {searchTerm || statusFilter !== 'all'
              ? 'No messages match your selected filter.'
              : 'Messages sent via the Contact page will be listed here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-all space-y-3 text-xs ${
                msg.status === 'unread'
                  ? 'bg-stone-900 border-[#C5A059]/40 ring-1 ring-[#C5A059]/10'
                  : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/70 pb-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm text-white">{msg.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      msg.status === 'unread'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : msg.status === 'replied'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg.id, e.target.value as any)}
                    className="bg-stone-950 border border-stone-700 text-white text-[11px] rounded px-2 py-1"
                  >
                    <option value="unread">Mark Unread</option>
                    <option value="read">Mark Read</option>
                    <option value="replied">Mark Replied</option>
                    <option value="archived">Archive</option>
                  </select>

                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent('Reply from Kaur Couture Atelier')}`}
                    className="px-2.5 py-1 text-[11px] font-medium text-stone-200 bg-stone-800 hover:bg-stone-700 rounded transition-colors"
                  >
                    Reply via Email
                  </a>

                  <button
                    onClick={() => setDeleteConfirmId(msg.id)}
                    className="p-1 text-stone-400 hover:text-red-400"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#C5A059]" />
                  <a href={`mailto:${msg.email}`} className="hover:text-white">{msg.email}</a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#C5A059]" />
                    <a href={`tel:${msg.phone}`} className="hover:text-white">{msg.phone}</a>
                  </div>
                )}
              </div>

              <p className="text-stone-200 leading-relaxed font-light whitespace-pre-line pt-1">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Message?</h4>
            <p className="text-xs text-stone-400">Permanently remove this inquiry from the database?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs text-stone-300 bg-stone-800 rounded"
              >
                Cancel
              </button>
              <button
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
