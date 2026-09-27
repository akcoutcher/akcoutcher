import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Scissors,
  Image as ImageIcon,
  Calendar,
  ShoppingBag,
  Mail,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  getCollections,
  getDesigns,
  getGallery,
  getAppointments,
  getCustomOrders,
  getContactMessages,
} from '../../lib/db';
import {
  CollectionItem,
  DesignItem,
  GalleryItem,
  AppointmentItem,
  CustomOrderItem,
  ContactMessageItem,
} from '../../types/database';

interface AdminDashboardPageProps {
  onNavigateSection: (section: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateSection }) => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [orders, setOrders] = useState<CustomOrderItem[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);

  useEffect(() => {
    async function loadAll() {
      try {
        const [c, d, g, a, o, m] = await Promise.all([
          getCollections(false),
          getDesigns(false),
          getGallery(false),
          getAppointments(),
          getCustomOrders(),
          getContactMessages(),
        ]);
        setCollections(c);
        setDesigns(d);
        setGallery(g);
        setAppointments(a);
        setOrders(o);
        setMessages(m);
      } catch (e) {
        console.error('Failed to load dashboard metrics:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const newAppointments = appointments.filter((a) => a.status === 'new');
  const newOrders = orders.filter((o) => o.status === 'new');
  const unreadMessages = messages.filter((m) => m.status === 'unread');

  const stats = [
    {
      title: 'Total Collections',
      count: collections.length,
      icon: <FolderKanban className="w-5 h-5 text-[#C5A059]" />,
      action: 'collections',
    },
    {
      title: 'Total Designs',
      count: designs.length,
      icon: <Scissors className="w-5 h-5 text-[#C5A059]" />,
      action: 'designs',
    },
    {
      title: 'Gallery Images',
      count: gallery.length,
      icon: <ImageIcon className="w-5 h-5 text-[#C5A059]" />,
      action: 'gallery',
    },
    {
      title: 'Pending Appointments',
      count: newAppointments.length,
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      action: 'appointments',
      highlight: newAppointments.length > 0,
    },
    {
      title: 'Custom Orders',
      count: orders.length,
      icon: <ShoppingBag className="w-5 h-5 text-[#C5A059]" />,
      action: 'orders',
      highlight: newOrders.length > 0,
    },
    {
      title: 'Unread Messages',
      count: unreadMessages.length,
      icon: <Mail className="w-5 h-5 text-rose-400" />,
      action: 'messages',
      highlight: unreadMessages.length > 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Atelier Dashboard</h1>
          <p className="text-xs text-stone-400 mt-1">
            Real-time atelier overview, patron appointments, bespoke orders, and catalog status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSection('collections')}
            className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-[#C5A059] hover:bg-[#D4AF37] rounded-lg transition-colors"
          >
            + New Collection
          </button>
          <button
            onClick={() => onNavigateSection('designs')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#58111A] hover:bg-[#6B1D2F] rounded-lg transition-colors"
          >
            + New Design
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div
            key={s.title}
            onClick={() => onNavigateSection(s.action)}
            className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-[#C5A059]/60 ${
              s.highlight
                ? 'bg-stone-900 border-[#C5A059]/50 shadow-md ring-1 ring-[#C5A059]/20'
                : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-stone-400 truncate">{s.title}</span>
              {s.icon}
            </div>
            <div className="text-2xl font-mono font-semibold text-white">
              {loading ? '-' : s.count}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Sections: Appointments, Orders, Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-serif text-lg text-white font-medium">Recent Appointment Requests</h3>
            </div>
            <button
              onClick={() => onNavigateSection('appointments')}
              className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No appointments yet. Requests submitted from the public booking form will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 4).map((appt) => (
                <div
                  key={appt.id}
                  onClick={() => onNavigateSection('appointments')}
                  className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-lg hover:border-stone-700 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-white">{appt.name}</p>
                    <p className="text-stone-400 text-[11px]">{appt.service}</p>
                    <p className="text-stone-500 text-[10px]">
                      {appt.preferred_date} at {appt.preferred_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        appt.status === 'new'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : appt.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Custom Orders */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <h3 className="font-serif text-lg text-white font-medium">Recent Custom Orders</h3>
            </div>
            <button
              onClick={() => onNavigateSection('orders')}
              className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              No custom orders yet. Custom stitching submissions will be listed here.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  onClick={() => onNavigateSection('orders')}
                  className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-lg hover:border-stone-700 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-white">{order.customer_name}</p>
                    <p className="text-stone-400 text-[11px]">{order.dress_type}</p>
                    <p className="text-stone-500 text-[10px]">{order.occasion || 'Custom Commission'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-stone-800 text-stone-300">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-serif text-lg text-white font-medium">Latest Inquiries & Messages</h3>
          </div>
          <button
            onClick={() => onNavigateSection('messages')}
            className="text-xs text-[#C5A059] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No enquiries yet. Messages from the contact form will show up here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.slice(0, 3).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onNavigateSection('messages')}
                className="p-4 bg-stone-950/60 border border-stone-800 rounded-lg hover:border-stone-700 cursor-pointer space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{msg.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      msg.status === 'unread' ? 'bg-rose-950 text-rose-300' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <p className="text-stone-400 text-[11px] truncate">{msg.email}</p>
                <p className="text-stone-300 text-xs line-clamp-2 italic">"{msg.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
