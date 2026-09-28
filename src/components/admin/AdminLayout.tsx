import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Scissors,
  Image as ImageIcon,
  Calendar,
  ShoppingBag,
  Mail,
  Sliders,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Globe,
  Database,
  GraduationCap
} from 'lucide-react';
import { AdminUser, logoutAdmin } from '../../lib/db';
import { getSupabaseConfig } from '../../lib/supabase';

interface AdminLayoutProps {
  currentAdmin: AdminUser;
  currentSection: string;
  onNavigateSection: (section: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentAdmin,
  currentSection,
  onNavigateSection,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConfigured } = getSupabaseConfig();

  const handleNav = (section: string) => {
    onNavigateSection(section);
    setMobileMenuOpen(false);
  };

  const navGroups = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Website Content',
      items: [
        { id: 'homepage', label: 'Homepage Content', icon: <Globe className="w-4 h-4" /> },
        { id: 'about', label: 'About & Story', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'services', label: 'Couture Services', icon: <Scissors className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Couture Catalog & Store',
      items: [
        { id: 'products', label: 'Products & Store', icon: <ShoppingBag className="w-4 h-4 text-[#C9A227]" /> },
        { id: 'collections', label: 'Collections', icon: <FolderKanban className="w-4 h-4" /> },
        { id: 'designs', label: 'Designs & Ensembles', icon: <Scissors className="w-4 h-4" /> },
        { id: 'gallery', label: 'Artisan Gallery', icon: <ImageIcon className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Patron Requests',
      items: [
        { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
        { id: 'orders', label: 'Custom Orders', icon: <ShoppingBag className="w-4 h-4" /> },
        { id: 'messages', label: 'Contact Inquiries', icon: <Mail className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Academy & Training',
      items: [
        { id: 'courses', label: 'Training & Courses', icon: <GraduationCap className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Assets & Config',
      items: [
        { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'settings', label: 'Business & WhatsApp', icon: <Sliders className="w-4 h-4" /> },
        { id: 'profile', label: 'Profile & Security', icon: <Shield className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-stone-800 bg-[#141210] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-medium tracking-tight text-[#FAF7F2]">
              AK COUTURE
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-[#58111A] text-[#C5A059] font-semibold">
              Atelier CMS
            </span>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-400">
              {isConfigured ? 'Supabase Live' : 'Database Ready'}
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-stone-400 hover:text-white hover:bg-stone-800 px-3 py-1.5 rounded transition-colors"
          >
            <span>Preview Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
          </a>

          <div className="flex items-center gap-3 pl-3 border-l border-stone-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-stone-200">{currentAdmin.name}</p>
              <p className="text-[10px] text-stone-500 font-mono">{currentAdmin.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800/80 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-stone-800 bg-[#181614] overflow-y-auto p-4 shrink-0">
          <div className="space-y-6 flex-1">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 px-3">
                  {group.title}
                </span>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => {
                    const isActive = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          isActive
                            ? 'bg-[#58111A] text-white shadow-sm font-semibold'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'
                        }`}
                      >
                        <span className={isActive ? 'text-[#C5A059]' : 'text-stone-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick link to live schema */}
          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 space-y-1">
            <p>Kaur Couture Admin v2.4</p>
            <p className="text-[10px] text-stone-600">Supabase PostgreSQL & Storage</p>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-[#181614] border-r border-stone-800 p-4 flex flex-col z-50 h-full overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <span className="font-serif text-lg text-white">Atelier Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 flex-1">
                {navGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 px-2">
                      {group.title}
                    </span>
                    <div className="space-y-0.5 pt-1">
                      {group.items.map((item) => {
                        const isActive = currentSection === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg ${
                              isActive
                                ? 'bg-[#58111A] text-white font-semibold'
                                : 'text-stone-400 hover:text-stone-100'
                            }`}
                          >
                            <span className={isActive ? 'text-[#C5A059]' : 'text-stone-400'}>{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-800">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-stone-800 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#1C1A18] p-4 sm:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
