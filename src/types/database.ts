export type ContentStatus = 'published' | 'draft' | 'archived';

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  google_maps_url: string;
  opening_hours: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  logo_url: string;
  favicon_url: string;
  owner_image_url: string;
  owner_name: string;
  owner_title: string;
  owner_short_bio: string;
  owner_full_bio: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  og_image_url: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageContent {
  id: string;
  hero_heading: string;
  hero_subtitle: string;
  hero_image_url: string;
  hero_primary_btn_text: string;
  hero_primary_btn_link: string;
  hero_secondary_btn_text: string;
  hero_secondary_btn_link: string;
  about_section_heading: string;
  about_section_subheading: string;
  about_section_text: string;
  craftsmanship_heading: string;
  craftsmanship_text: string;
  craftsmanship_image_url: string;
  cta_heading: string;
  cta_subheading: string;
  cta_btn_text: string;
  cta_btn_link: string;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  heading: string;
  subheading: string;
  story: string;
  vision: string;
  mission: string;
  experience_years: string;
  heritage_text: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  full_details?: string;
  image_url: string;
  price_starting_from: string;
  sort_order: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  cover_image: string;
  featured: boolean;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DesignItem {
  id: string;
  name: string;
  slug: string;
  code?: string;
  description: string;
  category: string;
  collection_id?: string | null;
  price: number | null;
  price_label: string;
  cover_image: string;
  images: string[];
  fabric_details?: string;
  embroidery_details?: string;
  featured: boolean;
  status: ContentStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  image_url: string;
  sort_order: number;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export interface AppointmentItem {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  service: string;
  message: string;
  status: AppointmentStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export type CustomOrderStatus = 
  | 'new' 
  | 'contacted' 
  | 'designing' 
  | 'approved' 
  | 'in_production' 
  | 'ready' 
  | 'completed' 
  | 'cancelled';

export interface CustomOrderItem {
  id: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  dress_type: string;
  occasion: string;
  preferred_colour: string;
  fabric_preference: string;
  measurements: string;
  budget: string;
  required_date: string;
  reference_image?: string;
  additional_notes?: string;
  admin_notes?: string;
  status: CustomOrderStatus;
  created_at: string;
  updated_at: string;
}

export type ContactMessageStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface ContactMessageItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  admin_reply_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'superadmin' | 'admin';
  created_at: string;
  updated_at: string;
}
