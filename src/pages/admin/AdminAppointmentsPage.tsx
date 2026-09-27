import React, { useState, useEffect } from 'react';
import { AppointmentItem } from '../../types/database';
import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../../lib/db';
import { useToast } from '../../components/common/Toast';
import { Calendar, Phone, Mail, MessageCircle, Trash2, CheckCircle2, XCircle, Search, Edit3 } from 'lucide-react';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: AppointmentItem['status']) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const appt = appointments.find((a) => a.id === id);
      if (appt) {
        await updateAppointmentStatus(id, appt.status, noteText);
        showToast('Internal note saved', 'success');
        setEditingNotesId(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      showToast('Appointment record deleted', 'success');
      setDeleteConfirmId(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete appointment', 'error');
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Appointment Requests</h1>
          <p className="text-xs text-stone-400 mt-1">
            Review and confirm personal bridal fittings, atelier visits, and virtual styling sessions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 border border-stone-800 p-3 rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'new', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-[#58111A] text-white font-semibold'
                  : 'text-stone-400 hover:text-white bg-stone-900'
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
            placeholder="Search by patron name, phone, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-950 border border-stone-700 rounded text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-stone-400 text-sm py-12 text-center">Loading appointments...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-stone-900/40 border border-dashed border-stone-800 rounded-xl p-16 text-center space-y-2">
          <Calendar className="w-8 h-8 text-[#C5A059] mx-auto mb-2" />
          <h3 className="font-serif text-xl text-white">No appointment requests yet</h3>
          <p className="text-xs text-stone-400">
            {searchTerm || statusFilter !== 'all'
              ? 'No requests match your selected filters.'
              : 'Public requests submitted through /book-appointment will be queued here for confirmation.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => {
            const cleanWhatsapp = (appt.whatsapp || appt.phone).replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Hello ${appt.name}, this is Kaur Couture regarding your appointment request for ${appt.preferred_date} at ${appt.preferred_time}.`
            )}`;

            return (
              <div
                key={appt.id}
                className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4 hover:border-stone-700 transition-colors shadow-sm text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-base text-white">{appt.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        appt.status === 'new'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : appt.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : appt.status === 'completed'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-2">
                    <select
                      value={appt.status}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value as any)}
                      className="bg-stone-950 border border-stone-700 text-white text-[11px] rounded px-2.5 py-1 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="new">New (Pending)</option>
                      <option value="confirmed">Confirm Appointment</option>
                      <option value="completed">Mark Completed</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(appt.id)}
                      className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-300">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">Requested Service</span>
                    <p className="font-medium text-white text-xs mt-0.5">{appt.service}</p>
                    <p className="text-stone-400 text-[11px] mt-1">
                      Preferred: <strong>{appt.preferred_date}</strong> at <strong>{appt.preferred_time}</strong>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">Contact Methods</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <a href={`tel:${appt.phone}`} className="hover:text-white">{appt.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-[#C5A059]" />
                      <a href={`mailto:${appt.email}`} className="hover:text-white truncate">{appt.email}</a>
                    </div>
                  </div>

                  <div className="flex items-center justify-start md:justify-end gap-2">
                    {cleanWhatsapp && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 rounded text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {appt.message && (
                  <div className="p-3 bg-stone-950/70 border border-stone-800 rounded text-stone-300 text-xs">
                    <span className="text-[10px] uppercase text-stone-500 font-semibold block mb-0.5">Patron Notes:</span>
                    <p className="italic font-light">"{appt.message}"</p>
                  </div>
                )}

                {/* Internal Admin Notes */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                  {editingNotesId === appt.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="e.g. Confirmed for room 2 fitting, requested extra organza fabric swatches..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full px-2.5 py-1 bg-stone-950 border border-stone-700 rounded text-white text-xs"
                      />
                      <button
                        onClick={() => handleSaveNotes(appt.id)}
                        className="px-3 py-1 bg-[#C5A059] text-stone-950 font-semibold rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-2 py-1 text-stone-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-stone-400">
                        {appt.admin_notes ? (
                          <>Internal Note: <strong className="text-stone-200">{appt.admin_notes}</strong></>
                        ) : (
                          <span className="text-stone-600">No internal admin notes added.</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNotesId(appt.id);
                          setNoteText(appt.admin_notes || '');
                        }}
                        className="text-[#C5A059] hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{appt.admin_notes ? 'Edit Note' : 'Add Note'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1A18] border border-stone-800 rounded-xl max-w-sm w-full p-6 space-y-4 text-center">
            <h4 className="font-serif text-xl text-white">Delete Appointment Record?</h4>
            <p className="text-xs text-stone-400">Are you sure you want to permanently delete this appointment?</p>
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
