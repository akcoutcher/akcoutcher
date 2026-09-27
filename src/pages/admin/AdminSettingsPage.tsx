import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types/database';
import { getSettings, updateSettings } from '../../lib/db';
import { getSupabaseConfig, saveCustomSupabaseConfig, isSupabaseLive } from '../../lib/supabase';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import {
  Save,
  MessageCircle,
  Building,
  Globe,
  Share2,
  Database,
  CheckCircle2,
  Copy,
  AlertCircle
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<boolean | null>(null);

  // Custom Supabase inputs
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    getSettings().then(setSettings);
    const { url, key } = getSupabaseConfig();
    setCustomUrl(url || '');
    setCustomKey(key || '');
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setTestingSupabase(true);
    const live = await isSupabaseLive();
    setSupabaseStatus(live);
    setTestingSupabase(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      // Save Supabase credentials if modified
      saveCustomSupabaseConfig(customUrl, customKey);

      await updateSettings(settings);
      showToast('Business & WhatsApp settings updated successfully!', 'success');
      checkConnection();
    } catch (e) {
      console.error(e);
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const copySqlSchema = () => {
    const sqlText = `-- Kaur Couture Supabase SQL Schema
-- See full schema in /supabase/schema.sql in the project root.`;
    navigator.clipboard.writeText(sqlText);
    showToast('Schema reference copied! Complete SQL is located in /supabase/schema.sql', 'info');
  };

  if (!settings) {
    return <div className="text-stone-400 text-sm">Loading boutique settings...</div>;
  }

  const cleanWhatsapp = settings.whatsapp_number ? settings.whatsapp_number.replace(/[^0-9]/g, '') : '';
  const testWhatsappUrl = cleanWhatsapp ? `https://wa.me/${cleanWhatsapp}` : '#';

  return (
    <form onSubmit={handleSaveSettings} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Business & Atelier Settings</h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure contact coordinates, WhatsApp concierge integration, social handles, and branding.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 1. WHATSAPP CONCIERGE INTEGRATION (Requirement 16) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-stone-800 pb-3">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="font-serif text-xl text-white">WhatsApp Integration</h2>
            <p className="text-xs text-stone-400">
              Enter your WhatsApp Business number once. All "Chat on WhatsApp" and design inquiry buttons will automatically use it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              WhatsApp Number (with Country Code, no + or spaces) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 919876543210 (91 for India, 1 for USA/Canada, 44 for UK)"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059] font-mono"
            />
          </div>

          <div className="pt-5 flex items-center gap-3">
            {cleanWhatsapp ? (
              <a
                href={testWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-200 bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 rounded transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Test WhatsApp Link: https://wa.me/{cleanWhatsapp}</span>
              </a>
            ) : (
              <span className="text-xs text-stone-500">Enter a number to preview the direct link</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. CORE BUSINESS DETAILS (Requirement 17) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-stone-800 pb-3">
          <Building className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-white">Boutique Identity & Showroom Contact</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Boutique Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Primary Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Atelier Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Atelier Physical Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Google Maps Location URL
            </label>
            <input
              type="url"
              value={settings.google_maps_url}
              onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Opening Hours
            </label>
            <input
              type="text"
              value={settings.opening_hours}
              onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-stone-800">
          <ImageUploadField
            label="Boutique Wordmark Logo (Optional - will show elegant typography if blank)"
            value={settings.logo_url}
            onChange={(url) => setSettings({ ...settings, logo_url: url })}
            aspectRatioHint="Recommended: PNG with transparent background"
          />
        </div>
      </div>

      {/* 3. SOCIAL MEDIA ACCOUNTS */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-stone-800 pb-3">
          <Share2 className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-white">Social Media Channels</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/kaurcouture"
              value={settings.instagram_url}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/kaurcouture"
              value={settings.facebook_url}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              YouTube Channel URL
            </label>
            <input
              type="url"
              placeholder="https://youtube.com/@kaurcouture"
              value={settings.youtube_url}
              onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC SEO SETTINGS (Requirement 25) */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-stone-800 pb-3">
          <Globe className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-white">Dynamic SEO & Social Sharing</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Meta Title (Browser Tab & Search Results)
            </label>
            <input
              type="text"
              value={settings.meta_title}
              onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Meta Description (Search Snippet)
            </label>
            <textarea
              rows={2}
              value={settings.meta_description}
              onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Search Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={settings.keywords}
              onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* 5. SUPABASE BACKEND CONFIGURATION & SCHEMA RUNNER */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="font-serif text-xl text-white">Supabase PostgreSQL & Storage Setup</h2>
              <p className="text-xs text-stone-400">
                Configure your cloud Supabase database URL and Anon Key for live cloud sync.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={checkConnection}
            disabled={testingSupabase}
            className="px-3 py-1 text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-300 rounded"
          >
            {testingSupabase ? 'Testing...' : 'Check Status'}
          </button>
        </div>

        <div className="flex items-center gap-2 p-3 bg-stone-950 border border-stone-800 rounded-lg text-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              supabaseStatus ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="font-mono">
            {supabaseStatus
              ? 'Status: Supabase Connected & Operating Live'
              : 'Status: Local Database Active (Enter your Supabase URL & Anon Key below for cloud PostgreSQL sync)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              VITE_SUPABASE_URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              VITE_SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059] font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-xs text-stone-400">
            A complete PostgreSQL database schema with RLS security policies is saved at <code className="text-[#C5A059] font-mono">/supabase/schema.sql</code>.
          </p>
          <button
            type="button"
            onClick={copySqlSchema}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#C5A059] bg-stone-950 border border-stone-700 hover:border-[#C5A059] rounded"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Schema Path</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
};
