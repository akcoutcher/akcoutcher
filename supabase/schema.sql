-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR KAUR COUTURE PUNJABI BOUTIQUE
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Tables

-- Site Settings (Single row for core business contact, SEO & branding)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  business_name TEXT NOT NULL DEFAULT 'Kaur Couture',
  tagline TEXT DEFAULT 'Where Tradition Meets Your Style',
  phone TEXT DEFAULT '+91 98765 43210',
  whatsapp_number TEXT DEFAULT '919876543210',
  email TEXT DEFAULT 'contact@kaurcouture.com',
  address TEXT DEFAULT '14 Heritage Boulevard, Model Town, Ludhiana, Punjab 141002',
  google_maps_url TEXT DEFAULT 'https://maps.google.com',
  opening_hours TEXT DEFAULT 'Mon - Sat: 10:30 AM - 8:00 PM | Sun: By Appointment',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  youtube_url TEXT DEFAULT 'https://youtube.com',
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  owner_image_url TEXT DEFAULT '',
  owner_name TEXT DEFAULT 'Simran Kaur',
  owner_title TEXT DEFAULT 'Creative Director & Master Couturier',
  owner_short_bio TEXT DEFAULT 'Crafting heirloom Punjabi silhouettes, bridal couture, and bespoke zardozi embroidery for discerning women globally.',
  owner_full_bio TEXT DEFAULT 'With over 18 years dedicated to preserving authentic Punjabi textile heritage, Simran Kaur unites centuries-old tilla, gota patti, and hand-phulkari needlework with modern couture tailoring. Every bespoke suit and bridal ensemble is individually envisioned, patterned, and perfected.',
  meta_title TEXT DEFAULT 'Kaur Couture | Bespoke Punjabi Suits & Bridal Wear',
  meta_description TEXT DEFAULT 'Discover luxury Punjabi salwar suits, bridal wear, custom zardozi embroidery, and bespoke tailoring crafted with master artisans.',
  keywords TEXT DEFAULT 'Punjabi suits, bridal wear, Patiala salwar, custom stitching, zardozi embroidery, boutique',
  og_image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Content (CMS editable sections)
CREATE TABLE IF NOT EXISTS homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  hero_heading TEXT NOT NULL DEFAULT 'Where Tradition Meets Your Style',
  hero_subtitle TEXT DEFAULT 'Bespoke Punjabi bridal couture, regal silhouettes, and handcrafted heritage embroidery tailored to your exact measurements.',
  hero_image_url TEXT DEFAULT '',
  hero_primary_btn_text TEXT DEFAULT 'Explore Collections',
  hero_primary_btn_link TEXT DEFAULT '/collections',
  hero_secondary_btn_text TEXT DEFAULT 'Book Appointment',
  hero_secondary_btn_link TEXT DEFAULT '/book-appointment',
  about_section_heading TEXT DEFAULT 'A Legacy of Punjabi Grace & Artisanship',
  about_section_subheading TEXT DEFAULT 'THE ATELIER STORY',
  about_section_text TEXT DEFAULT 'At Kaur Couture, every garment is a celebration of Punjab’s rich sartorial soul. From handspun raw silks to antique gold tilla threadwork, we curate bespoke ensembles that transcend seasonal trends.',
  craftsmanship_heading TEXT DEFAULT 'Master Hand-Embroidery & Bespoke Stitching',
  craftsmanship_text TEXT DEFAULT 'Each motif is painstakingly rendered by generational karigars. We offer custom fitting sessions, bespoke fabric selection, and personalized design consultations.',
  craftsmanship_image_url TEXT DEFAULT '',
  cta_heading TEXT DEFAULT 'Design Your Dream Bridal & Festive Ensembles',
  cta_subheading TEXT DEFAULT 'Experience personal couture consultations in our atelier or via private virtual appointment.',
  cta_btn_text TEXT DEFAULT 'Schedule Consultation',
  cta_btn_link TEXT DEFAULT '/book-appointment',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About Content
CREATE TABLE IF NOT EXISTS about_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  heading TEXT NOT NULL DEFAULT 'Heirloom Craftsmanship Reimagined',
  subheading TEXT DEFAULT 'ABOUT OUR ATELIER',
  story TEXT DEFAULT 'Founded in the heart of Punjab, Kaur Couture emerged from a passionate devotion to authentic textile arts and flawless silhouette architecture. We believe every woman deserves clothing that honors tradition while celebrating her personal poise.',
  vision TEXT DEFAULT 'To establish authentic Punjabi couture on global runways while preserving traditional handcraft techniques for future generations.',
  mission TEXT DEFAULT 'To deliver peerless tailored fit, ethically commissioned artisan needlework, and an intimate couture experience for every bride and patron.',
  experience_years TEXT DEFAULT '18+',
  heritage_text TEXT DEFAULT 'Rooted in traditional Phulkari, Dabka, Marodi, and Gotapatti craftsmanship passed through generations of master artisans.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  full_details TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  price_starting_from TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Couture',
  description TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Designs Table
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'Bridal Suits',
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  price NUMERIC DEFAULT NULL,
  price_label TEXT DEFAULT 'Price on Request',
  cover_image TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  fabric_details TEXT DEFAULT '',
  embroidery_details TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category TEXT DEFAULT 'Bridal',
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT DEFAULT '',
  email TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom Orders Table
CREATE TABLE IF NOT EXISTS custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT DEFAULT '',
  email TEXT NOT NULL,
  dress_type TEXT NOT NULL,
  occasion TEXT DEFAULT '',
  preferred_colour TEXT DEFAULT '',
  fabric_preference TEXT DEFAULT '',
  measurements TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  required_date DATE,
  reference_image TEXT DEFAULT '',
  additional_notes TEXT DEFAULT '',
  admin_notes TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'designing', 'approved', 'in_production', 'ready', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  admin_reply_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Library Table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT DEFAULT '',
  mime_type TEXT DEFAULT 'image/jpeg',
  size_bytes BIGINT DEFAULT 0,
  alt_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Profiles Table
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT 'Boutique Administrator',
  role TEXT DEFAULT 'superadmin' CHECK (role IN ('superadmin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ====================================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Public READ policies for public marketing content
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read homepage_content" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);

CREATE POLICY "Public read published services" ON services FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read published collections" ON collections FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read published designs" ON designs FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read published gallery" ON gallery FOR SELECT 
  USING (status = 'published' OR auth.role() = 'authenticated');

CREATE POLICY "Public read media" ON media FOR SELECT USING (true);

-- Public INSERT policies for client interactive submissions
CREATE POLICY "Public submit appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit custom_orders" ON custom_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public submit contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin FULL ACCESS policies (Admin can read, update, insert, delete)
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write homepage_content" ON homepage_content FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write about_content" ON about_content FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write services" ON services FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write collections" ON collections FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write designs" ON designs FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin write gallery" ON gallery FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage appointments" ON appointments FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage custom_orders" ON custom_orders FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage contact_messages" ON contact_messages FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin manage media" ON media FOR ALL 
  USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin view profile" ON admin_profiles FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update profile" ON admin_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ====================================================================
-- 4. STORAGE BUCKETS CONFIGURATION
-- ====================================================================
-- In Supabase dashboard: Storage -> Create Bucket:
-- 1. 'media-assets' (Public bucket: ON)
-- 2. 'order-references' (Public bucket: ON or Private with signed URL)

-- Storage RLS (Insert into storage.buckets if needed via SQL):
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media-assets', 'media-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-references', 'order-references', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read media-assets" ON storage.objects FOR SELECT 
  USING (bucket_id = 'media-assets');

CREATE POLICY "Admin upload media-assets" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'media-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update media-assets" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'media-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete media-assets" ON storage.objects FOR DELETE 
  USING (bucket_id = 'media-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Public upload order references" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'order-references');

CREATE POLICY "Admin view order references" ON storage.objects FOR SELECT 
  USING (bucket_id = 'order-references' AND auth.role() = 'authenticated');
