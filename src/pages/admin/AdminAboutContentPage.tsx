import React, { useState, useEffect } from 'react';
import { AboutContent, SiteSettings } from '../../types/database';
import { getAboutContent, updateAboutContent, getSettings, updateSettings } from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import { Save, User, Sparkles } from 'lucide-react';

export const AdminAboutContentPage: React.FC = () => {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getAboutContent(), getSettings()]).then(([a, s]) => {
      setAbout(a);
      setSettings(s);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about || !settings) return;
    setSaving(true);
    try {
      await Promise.all([updateAboutContent(about), updateSettings(settings)]);
      showToast('About content & Owner Profile saved successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!about || !settings) {
    return <div className="text-stone-400 text-sm">Loading about content...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">About Atelier & Owner Profile</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage your boutique heritage narrative, founder biography, vision, and high-resolution portrait.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg shadow-md transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
        </button>
      </div>

      {/* 1. DEDICATED OWNER PROFILE SECTION */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <User className="w-5 h-5 text-[#C5A059]" />
          <h2 className="font-serif text-xl text-[#FAF7F2]">
            Founder & Master Couturier Profile
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <ImageUploadField
              label="Owner Portrait Photograph"
              value={settings.owner_image_url}
              onChange={(url) => setSettings({ ...settings, owner_image_url: url })}
              aspectRatioHint="Recommended: 3:4 vertical editorial portrait"
              initialAspect={3 / 4}
              description="Supports cropping, rotation, zoom, and live preview before saving."
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Owner / Couturier Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.owner_name}
                  onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={settings.owner_title}
                  onChange={(e) => setSettings({ ...settings, owner_title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Short Quote / Highlight Bio (Appears on Homepage)
              </label>
              <textarea
                rows={2}
                value={settings.owner_short_bio}
                onChange={(e) => setSettings({ ...settings, owner_short_bio: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Full Biography (Appears on About Page)
              </label>
              <textarea
                rows={4}
                value={settings.owner_full_bio}
                onChange={(e) => setSettings({ ...settings, owner_full_bio: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATELIER STORY & HERITAGE */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-6">
        <h2 className="font-serif text-xl text-[#FAF7F2] border-b border-stone-800 pb-3">
          Atelier History & Philosophy
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                About Page Headline
              </label>
              <input
                type="text"
                value={about.heading}
                onChange={(e) => setAbout({ ...about, heading: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Years of Experience Marker
              </label>
              <input
                type="text"
                value={about.experience_years}
                onChange={(e) => setAbout({ ...about, experience_years: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Atelier Story Paragraph
            </label>
            <textarea
              rows={4}
              value={about.story}
              onChange={(e) => setAbout({ ...about, story: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Vision
              </label>
              <textarea
                rows={3}
                value={about.vision}
                onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Mission
              </label>
              <textarea
                rows={3}
                value={about.mission}
                onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Punjabi Heritage & Artisanship Text
            </label>
            <textarea
              rows={3}
              value={about.heritage_text}
              onChange={(e) => setAbout({ ...about, heritage_text: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Publish About Content'}</span>
        </button>
      </div>
    </form>
  );
};
