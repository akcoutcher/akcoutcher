import React, { useState, useEffect } from 'react';
import { HomepageContent } from '../../types/database';
import { getHomepageContent, updateHomepageContent } from '../../lib/db';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { useToast } from '../../components/common/Toast';
import { Save, Eye, Sparkles } from 'lucide-react';

export const AdminHomepageContentPage: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getHomepageContent().then(setContent);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    try {
      await updateHomepageContent(content);
      showToast('Homepage content updated and published successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to save homepage content', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return <div className="text-stone-400 text-sm">Loading homepage settings...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <h1 className="font-serif text-3xl text-white font-medium">Homepage CMS Content</h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage hero messaging, high-resolution campaign photography, storytelling, and call-to-actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Site</span>
          </a>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-stone-950 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 rounded-lg transition-all shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION SETTINGS */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-6">
        <h2 className="font-serif text-xl text-[#FAF7F2] border-b border-stone-800 pb-3">
          1. Hero Section
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Hero Main Headline *
            </label>
            <input
              type="text"
              required
              value={content.hero_heading}
              onChange={(e) => setContent({ ...content, hero_heading: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Hero Subtitle / Tagline
            </label>
            <textarea
              rows={3}
              value={content.hero_subtitle}
              onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059] resize-none"
            />
          </div>

          <ImageUploadField
            label="Hero Background Campaign Image"
            value={content.hero_image_url}
            onChange={(url) => setContent({ ...content, hero_image_url: url })}
            aspectRatioHint="Recommended: 16:9 cinematic widescreen (min 1920x1080)"
            initialAspect={16 / 9}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.hero_primary_btn_text}
                onChange={(e) => setContent({ ...content, hero_primary_btn_text: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Primary Button Link
              </label>
              <input
                type="text"
                value={content.hero_primary_btn_link}
                onChange={(e) => setContent({ ...content, hero_primary_btn_link: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={content.hero_secondary_btn_text}
                onChange={(e) => setContent({ ...content, hero_secondary_btn_text: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Secondary Button Link
              </label>
              <input
                type="text"
                value={content.hero_secondary_btn_link}
                onChange={(e) => setContent({ ...content, hero_secondary_btn_link: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATELIER STORY ON HOMEPAGE */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-6">
        <h2 className="font-serif text-xl text-[#FAF7F2] border-b border-stone-800 pb-3">
          2. Atelier Story Section
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Section Subtitle / Kicker
              </label>
              <input
                type="text"
                value={content.about_section_subheading}
                onChange={(e) => setContent({ ...content, about_section_subheading: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                Section Main Heading
              </label>
              <input
                type="text"
                value={content.about_section_heading}
                onChange={(e) => setContent({ ...content, about_section_heading: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              Story Paragraph
            </label>
            <textarea
              rows={4}
              value={content.about_section_text}
              onChange={(e) => setContent({ ...content, about_section_text: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <ImageUploadField
            label="Craftsmanship & Atelier Detail Photography"
            value={content.craftsmanship_image_url}
            onChange={(url) => setContent({ ...content, craftsmanship_image_url: url })}
            aspectRatioHint="Recommended: 4:3 high-res artisan needlework photograph"
            initialAspect={4 / 3}
          />
        </div>
      </div>

      {/* 3. CTA BANNER SECTION */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 space-y-6">
        <h2 className="font-serif text-xl text-[#FAF7F2] border-b border-stone-800 pb-3">
          3. Bottom Consultation Call-to-Action
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              CTA Heading
            </label>
            <input
              type="text"
              value={content.cta_heading}
              onChange={(e) => setContent({ ...content, cta_heading: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              CTA Subheading / Explanation
            </label>
            <input
              type="text"
              value={content.cta_subheading}
              onChange={(e) => setContent({ ...content, cta_subheading: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                CTA Button Text
              </label>
              <input
                type="text"
                value={content.cta_btn_text}
                onChange={(e) => setContent({ ...content, cta_btn_text: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                CTA Button Link
              </label>
              <input
                type="text"
                value={content.cta_btn_link}
                onChange={(e) => setContent({ ...content, cta_btn_link: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
              />
            </div>
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
          <span>{saving ? 'Publishing Changes...' : 'Save & Publish Homepage'}</span>
        </button>
      </div>
    </form>
  );
};
