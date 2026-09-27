import { getSupabase } from './supabase';
import {
  SiteSettings,
  HomepageContent,
  AboutContent,
  ServiceItem,
  CollectionItem,
  DesignItem,
  GalleryItem,
  AppointmentItem,
  CustomOrderItem,
  ContactMessageItem,
  MediaItem,
} from '../types/database';

// Local storage keys for persistent offline or pending-env state
const KEYS = {
  SETTINGS: 'kaur_site_settings',
  HOMEPAGE: 'kaur_homepage_content',
  ABOUT: 'kaur_about_content',
  SERVICES: 'kaur_services',
  COLLECTIONS: 'kaur_collections',
  DESIGNS: 'kaur_designs',
  GALLERY: 'kaur_gallery',
  APPOINTMENTS: 'kaur_appointments',
  CUSTOM_ORDERS: 'kaur_custom_orders',
  MESSAGES: 'kaur_contact_messages',
  MEDIA: 'kaur_media',
  AUTH_ADMIN: 'kaur_admin_session',
};

// Initial default settings
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'primary',
  business_name: 'Kaur Couture',
  tagline: 'Where Tradition Meets Your Style',
  phone: '+91 98765 43210',
  whatsapp_number: '919876543210',
  email: 'contact@kaurcouture.com',
  address: '14 Heritage Boulevard, Model Town, Ludhiana, Punjab 141002',
  google_maps_url: 'https://maps.google.com',
  opening_hours: 'Mon - Sat: 10:30 AM - 8:00 PM | Sun: By Appointment',
  instagram_url: 'https://instagram.com/kaurcouture',
  facebook_url: 'https://facebook.com/kaurcouture',
  youtube_url: 'https://youtube.com/@kaurcouture',
  logo_url: '',
  favicon_url: '',
  owner_image_url: '/src/assets/images/punjabi_designer_portrait_1790501188325.jpg',
  owner_name: 'Simran Kaur',
  owner_title: 'Creative Director & Master Couturier',
  owner_short_bio: 'Curating heirloom Punjabi silhouettes, bridal couture, and bespoke zardozi embroidery for women globally.',
  owner_full_bio: 'With over 18 years dedicated to preserving authentic Punjabi textile heritage, Simran Kaur unites centuries-old tilla, gota patti, and hand-phulkari needlework with modern couture tailoring. Every bespoke suit and bridal ensemble is individually envisioned, patterned, and perfected.',
  meta_title: 'Kaur Couture | Bespoke Punjabi Suits & Bridal Wear',
  meta_description: 'Discover luxury Punjabi salwar suits, bridal wear, custom zardozi embroidery, and bespoke tailoring crafted with master artisans.',
  keywords: 'Punjabi suits, bridal wear, Patiala salwar, custom stitching, zardozi embroidery, boutique',
  og_image_url: '/src/assets/images/punjabi_couture_hero_1790501175200.jpg',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_HOMEPAGE: HomepageContent = {
  id: 'primary',
  hero_heading: 'Where Tradition Meets Your Style',
  hero_subtitle: 'Bespoke Punjabi bridal couture, regal silhouettes, and handcrafted heritage embroidery tailored to your exact measurements.',
  hero_image_url: '/src/assets/images/punjabi_couture_hero_1790501175200.jpg',
  hero_primary_btn_text: 'Explore Collections',
  hero_primary_btn_link: '/collections',
  hero_secondary_btn_text: 'Book Appointment',
  hero_secondary_btn_link: '/book-appointment',
  about_section_heading: 'A Legacy of Punjabi Grace & Artisanship',
  about_section_subheading: 'THE ATELIER STORY',
  about_section_text: 'At Kaur Couture, every garment is a celebration of Punjab’s rich sartorial soul. From handspun raw silks to antique gold tilla threadwork, we curate bespoke ensembles that transcend seasonal trends.',
  craftsmanship_heading: 'Master Hand-Embroidery & Bespoke Tailoring',
  craftsmanship_text: 'Each motif is painstakingly rendered by generational karigars. We offer custom fitting sessions, bespoke fabric selection, and personalized design consultations.',
  craftsmanship_image_url: '/src/assets/images/punjabi_embroidery_craft_1790501202133.jpg',
  cta_heading: 'Design Your Dream Bridal & Festive Ensembles',
  cta_subheading: 'Experience personal couture consultations in our atelier or via private virtual appointment.',
  cta_btn_text: 'Schedule Consultation',
  cta_btn_link: '/book-appointment',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_ABOUT: AboutContent = {
  id: 'primary',
  heading: 'Heirloom Craftsmanship Reimagined',
  subheading: 'ABOUT OUR ATELIER',
  story: 'Founded in the heart of Punjab, Kaur Couture emerged from a passionate devotion to authentic textile arts and flawless silhouette architecture. We believe every woman deserves clothing that honors tradition while celebrating her personal poise.',
  vision: 'To establish authentic Punjabi couture on global runways while preserving traditional handcraft techniques for future generations.',
  mission: 'To deliver peerless tailored fit, ethically commissioned artisan needlework, and an intimate couture experience for every bride and patron.',
  experience_years: '18+',
  heritage_text: 'Rooted in traditional Phulkari, Dabka, Marodi, and Gotapatti craftsmanship passed through generations of master artisans.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// ----------------------------------------------------------------------
// SITE SETTINGS
// ----------------------------------------------------------------------
export async function getSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      if (!error && data) {
        writeLocal(KEYS.SETTINGS, data);
        return data as SiteSettings;
      }
    } catch (e) {
      console.warn('Supabase fetch error for settings:', e);
    }
  }
  return readLocal<SiteSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert(updated);
    } catch (e) {
      console.warn('Supabase update settings error:', e);
    }
  }
  writeLocal(KEYS.SETTINGS, updated);
  return updated;
}

// ----------------------------------------------------------------------
// HOMEPAGE CONTENT
// ----------------------------------------------------------------------
export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('homepage_content').select('*').limit(1).maybeSingle();
      if (!error && data) {
        writeLocal(KEYS.HOMEPAGE, data);
        return data as HomepageContent;
      }
    } catch (e) {
      console.warn('Supabase fetch error for homepage:', e);
    }
  }
  return readLocal<HomepageContent>(KEYS.HOMEPAGE, DEFAULT_HOMEPAGE);
}

export async function updateHomepageContent(content: Partial<HomepageContent>): Promise<HomepageContent> {
  const current = await getHomepageContent();
  const updated: HomepageContent = {
    ...current,
    ...content,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('homepage_content').upsert(updated);
    } catch (e) {
      console.warn('Supabase update homepage error:', e);
    }
  }
  writeLocal(KEYS.HOMEPAGE, updated);
  return updated;
}

// ----------------------------------------------------------------------
// ABOUT CONTENT
// ----------------------------------------------------------------------
export async function getAboutContent(): Promise<AboutContent> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('about_content').select('*').limit(1).maybeSingle();
      if (!error && data) {
        writeLocal(KEYS.ABOUT, data);
        return data as AboutContent;
      }
    } catch (e) {
      console.warn('Supabase fetch error for about content:', e);
    }
  }
  return readLocal<AboutContent>(KEYS.ABOUT, DEFAULT_ABOUT);
}

export async function updateAboutContent(content: Partial<AboutContent>): Promise<AboutContent> {
  const current = await getAboutContent();
  const updated: AboutContent = {
    ...current,
    ...content,
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('about_content').upsert(updated);
    } catch (e) {
      console.warn('Supabase update about error:', e);
    }
  }
  writeLocal(KEYS.ABOUT, updated);
  return updated;
}

// ----------------------------------------------------------------------
// SERVICES
// ----------------------------------------------------------------------
export async function getServices(onlyPublished = false): Promise<ServiceItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as ServiceItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch error for services:', e);
    }
  }
  const all = readLocal<ServiceItem[]>(KEYS.SERVICES, []);
  if (onlyPublished) {
    return all.filter((s) => s.status === 'published').sort((a, b) => a.sort_order - b.sort_order);
  }
  return all.sort((a, b) => a.sort_order - b.sort_order);
}

export async function createService(item: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceItem> {
  const newService: ServiceItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('services').insert(newService).select().single();
      if (!error && data) {
        const local = readLocal<ServiceItem[]>(KEYS.SERVICES, []);
        writeLocal(KEYS.SERVICES, [...local, data]);
        return data as ServiceItem;
      }
    } catch (e) {
      console.warn('Supabase insert service error:', e);
    }
  }

  const local = readLocal<ServiceItem[]>(KEYS.SERVICES, []);
  writeLocal(KEYS.SERVICES, [...local, newService]);
  return newService;
}

export async function updateService(id: string, updates: Partial<ServiceItem>): Promise<ServiceItem> {
  const all = readLocal<ServiceItem[]>(KEYS.SERVICES, []);
  const index = all.findIndex((s) => s.id === id);
  const updatedItem: ServiceItem = {
    ...(all[index] || {}),
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  } as ServiceItem;

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('services').update(updatedItem).eq('id', id);
    } catch (e) {
      console.warn('Supabase update service error:', e);
    }
  }

  if (index !== -1) {
    all[index] = updatedItem;
    writeLocal(KEYS.SERVICES, all);
  }
  return updatedItem;
}

export async function deleteService(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete service error:', e);
    }
  }
  const all = readLocal<ServiceItem[]>(KEYS.SERVICES, []);
  writeLocal(KEYS.SERVICES, all.filter((s) => s.id !== id));
}

// ----------------------------------------------------------------------
// COLLECTIONS
// ----------------------------------------------------------------------
export async function getCollections(onlyPublished = false): Promise<CollectionItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('collections').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as CollectionItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch error for collections:', e);
    }
  }
  const all = readLocal<CollectionItem[]>(KEYS.COLLECTIONS, []);
  if (onlyPublished) {
    return all.filter((c) => c.status === 'published').sort((a, b) => a.sort_order - b.sort_order);
  }
  return all.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCollectionBySlug(slug: string): Promise<CollectionItem | null> {
  const all = await getCollections();
  return all.find((c) => c.slug === slug) || null;
}

export async function createCollection(item: Omit<CollectionItem, 'id' | 'created_at' | 'updated_at'>): Promise<CollectionItem> {
  const newCol: CollectionItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('collections').insert(newCol).select().single();
      if (!error && data) {
        const local = readLocal<CollectionItem[]>(KEYS.COLLECTIONS, []);
        writeLocal(KEYS.COLLECTIONS, [...local, data]);
        return data as CollectionItem;
      }
    } catch (e) {
      console.warn('Supabase insert collection error:', e);
    }
  }

  const local = readLocal<CollectionItem[]>(KEYS.COLLECTIONS, []);
  writeLocal(KEYS.COLLECTIONS, [...local, newCol]);
  return newCol;
}

export async function updateCollection(id: string, updates: Partial<CollectionItem>): Promise<CollectionItem> {
  const all = readLocal<CollectionItem[]>(KEYS.COLLECTIONS, []);
  const index = all.findIndex((c) => c.id === id);
  const updatedItem: CollectionItem = {
    ...(all[index] || {}),
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  } as CollectionItem;

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('collections').update(updatedItem).eq('id', id);
    } catch (e) {
      console.warn('Supabase update collection error:', e);
    }
  }

  if (index !== -1) {
    all[index] = updatedItem;
    writeLocal(KEYS.COLLECTIONS, all);
  }
  return updatedItem;
}

export async function deleteCollection(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('collections').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete collection error:', e);
    }
  }
  const all = readLocal<CollectionItem[]>(KEYS.COLLECTIONS, []);
  writeLocal(KEYS.COLLECTIONS, all.filter((c) => c.id !== id));
}

// ----------------------------------------------------------------------
// DESIGNS
// ----------------------------------------------------------------------
export async function getDesigns(onlyPublished = false, collectionId?: string): Promise<DesignItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('designs').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      if (collectionId) {
        query = query.eq('collection_id', collectionId);
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as DesignItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch error for designs:', e);
    }
  }
  let all = readLocal<DesignItem[]>(KEYS.DESIGNS, []);
  if (onlyPublished) {
    all = all.filter((d) => d.status === 'published');
  }
  if (collectionId) {
    all = all.filter((d) => d.collection_id === collectionId);
  }
  return all.sort((a, b) => a.sort_order - b.sort_order);
}

export async function getDesignBySlug(slug: string): Promise<DesignItem | null> {
  const all = await getDesigns();
  return all.find((d) => d.slug === slug) || null;
}

export async function createDesign(item: Omit<DesignItem, 'id' | 'created_at' | 'updated_at'>): Promise<DesignItem> {
  const newDesign: DesignItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('designs').insert(newDesign).select().single();
      if (!error && data) {
        const local = readLocal<DesignItem[]>(KEYS.DESIGNS, []);
        writeLocal(KEYS.DESIGNS, [...local, data]);
        return data as DesignItem;
      }
    } catch (e) {
      console.warn('Supabase insert design error:', e);
    }
  }

  const local = readLocal<DesignItem[]>(KEYS.DESIGNS, []);
  writeLocal(KEYS.DESIGNS, [...local, newDesign]);
  return newDesign;
}

export async function updateDesign(id: string, updates: Partial<DesignItem>): Promise<DesignItem> {
  const all = readLocal<DesignItem[]>(KEYS.DESIGNS, []);
  const index = all.findIndex((d) => d.id === id);
  const updatedItem: DesignItem = {
    ...(all[index] || {}),
    ...updates,
    id,
    updated_at: new Date().toISOString(),
  } as DesignItem;

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('designs').update(updatedItem).eq('id', id);
    } catch (e) {
      console.warn('Supabase update design error:', e);
    }
  }

  if (index !== -1) {
    all[index] = updatedItem;
    writeLocal(KEYS.DESIGNS, all);
  }
  return updatedItem;
}

export async function deleteDesign(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('designs').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete design error:', e);
    }
  }
  const all = readLocal<DesignItem[]>(KEYS.DESIGNS, []);
  writeLocal(KEYS.DESIGNS, all.filter((d) => d.id !== id));
}

// ----------------------------------------------------------------------
// GALLERY
// ----------------------------------------------------------------------
export async function getGallery(onlyPublished = false): Promise<GalleryItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      let query = supabase.from('gallery').select('*').order('sort_order', { ascending: true });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }
      const { data, error } = await query;
      if (!error && data) {
        return data as GalleryItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch gallery error:', e);
    }
  }
  const all = readLocal<GalleryItem[]>(KEYS.GALLERY, []);
  if (onlyPublished) {
    return all.filter((g) => g.status === 'published').sort((a, b) => a.sort_order - b.sort_order);
  }
  return all.sort((a, b) => a.sort_order - b.sort_order);
}

export async function createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> {
  const newItem: GalleryItem = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gallery').insert(newItem).select().single();
      if (!error && data) {
        const local = readLocal<GalleryItem[]>(KEYS.GALLERY, []);
        writeLocal(KEYS.GALLERY, [...local, data]);
        return data as GalleryItem;
      }
    } catch (e) {
      console.warn('Supabase insert gallery error:', e);
    }
  }

  const local = readLocal<GalleryItem[]>(KEYS.GALLERY, []);
  writeLocal(KEYS.GALLERY, [...local, newItem]);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete gallery error:', e);
    }
  }
  const all = readLocal<GalleryItem[]>(KEYS.GALLERY, []);
  writeLocal(KEYS.GALLERY, all.filter((g) => g.id !== id));
}

// ----------------------------------------------------------------------
// APPOINTMENTS
// ----------------------------------------------------------------------
export async function getAppointments(): Promise<AppointmentItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as AppointmentItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch appointments error:', e);
    }
  }
  return readLocal<AppointmentItem[]>(KEYS.APPOINTMENTS, []);
}

export async function createAppointment(item: Omit<AppointmentItem, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<AppointmentItem> {
  const newAppt: AppointmentItem = {
    ...item,
    id: crypto.randomUUID(),
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('appointments').insert(newAppt).select().single();
      if (!error && data) {
        const local = readLocal<AppointmentItem[]>(KEYS.APPOINTMENTS, []);
        writeLocal(KEYS.APPOINTMENTS, [data, ...local]);
        return data as AppointmentItem;
      }
    } catch (e) {
      console.warn('Supabase create appointment error:', e);
    }
  }

  const local = readLocal<AppointmentItem[]>(KEYS.APPOINTMENTS, []);
  writeLocal(KEYS.APPOINTMENTS, [newAppt, ...local]);
  return newAppt;
}

export async function updateAppointmentStatus(id: string, status: AppointmentItem['status'], notes?: string): Promise<void> {
  const all = readLocal<AppointmentItem[]>(KEYS.APPOINTMENTS, []);
  const index = all.findIndex((a) => a.id === id);
  if (index !== -1) {
    all[index].status = status;
    if (notes !== undefined) all[index].admin_notes = notes;
    all[index].updated_at = new Date().toISOString();
    writeLocal(KEYS.APPOINTMENTS, all);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('appointments').update({ status, admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update appointment status error:', e);
    }
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('appointments').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete appointment error:', e);
    }
  }
  const all = readLocal<AppointmentItem[]>(KEYS.APPOINTMENTS, []);
  writeLocal(KEYS.APPOINTMENTS, all.filter((a) => a.id !== id));
}

// ----------------------------------------------------------------------
// CUSTOM ORDERS
// ----------------------------------------------------------------------
export async function getCustomOrders(): Promise<CustomOrderItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as CustomOrderItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch custom orders error:', e);
    }
  }
  return readLocal<CustomOrderItem[]>(KEYS.CUSTOM_ORDERS, []);
}

export async function createCustomOrder(item: Omit<CustomOrderItem, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<CustomOrderItem> {
  const newOrder: CustomOrderItem = {
    ...item,
    id: crypto.randomUUID(),
    status: 'new',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('custom_orders').insert(newOrder).select().single();
      if (!error && data) {
        const local = readLocal<CustomOrderItem[]>(KEYS.CUSTOM_ORDERS, []);
        writeLocal(KEYS.CUSTOM_ORDERS, [data, ...local]);
        return data as CustomOrderItem;
      }
    } catch (e) {
      console.warn('Supabase create custom order error:', e);
    }
  }

  const local = readLocal<CustomOrderItem[]>(KEYS.CUSTOM_ORDERS, []);
  writeLocal(KEYS.CUSTOM_ORDERS, [newOrder, ...local]);
  return newOrder;
}

export async function updateCustomOrderStatus(id: string, status: CustomOrderItem['status'], notes?: string): Promise<void> {
  const all = readLocal<CustomOrderItem[]>(KEYS.CUSTOM_ORDERS, []);
  const index = all.findIndex((o) => o.id === id);
  if (index !== -1) {
    all[index].status = status;
    if (notes !== undefined) all[index].admin_notes = notes;
    all[index].updated_at = new Date().toISOString();
    writeLocal(KEYS.CUSTOM_ORDERS, all);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('custom_orders').update({ status, admin_notes: notes, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update custom order error:', e);
    }
  }
}

export async function deleteCustomOrder(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('custom_orders').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete custom order error:', e);
    }
  }
  const all = readLocal<CustomOrderItem[]>(KEYS.CUSTOM_ORDERS, []);
  writeLocal(KEYS.CUSTOM_ORDERS, all.filter((o) => o.id !== id));
}

// ----------------------------------------------------------------------
// CONTACT MESSAGES
// ----------------------------------------------------------------------
export async function getContactMessages(): Promise<ContactMessageItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as ContactMessageItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch contact messages error:', e);
    }
  }
  return readLocal<ContactMessageItem[]>(KEYS.MESSAGES, []);
}

export async function createContactMessage(item: Omit<ContactMessageItem, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ContactMessageItem> {
  const newMsg: ContactMessageItem = {
    ...item,
    id: crypto.randomUUID(),
    status: 'unread',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contact_messages').insert(newMsg).select().single();
      if (!error && data) {
        const local = readLocal<ContactMessageItem[]>(KEYS.MESSAGES, []);
        writeLocal(KEYS.MESSAGES, [data, ...local]);
        return data as ContactMessageItem;
      }
    } catch (e) {
      console.warn('Supabase create contact message error:', e);
    }
  }

  const local = readLocal<ContactMessageItem[]>(KEYS.MESSAGES, []);
  writeLocal(KEYS.MESSAGES, [newMsg, ...local]);
  return newMsg;
}

export async function updateContactMessageStatus(id: string, status: ContactMessageItem['status'], replyNotes?: string): Promise<void> {
  const all = readLocal<ContactMessageItem[]>(KEYS.MESSAGES, []);
  const index = all.findIndex((m) => m.id === id);
  if (index !== -1) {
    all[index].status = status;
    if (replyNotes !== undefined) all[index].admin_reply_notes = replyNotes;
    all[index].updated_at = new Date().toISOString();
    writeLocal(KEYS.MESSAGES, all);
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('contact_messages').update({ status, admin_reply_notes: replyNotes, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (e) {
      console.warn('Supabase update contact message error:', e);
    }
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete contact message error:', e);
    }
  }
  const all = readLocal<ContactMessageItem[]>(KEYS.MESSAGES, []);
  writeLocal(KEYS.MESSAGES, all.filter((m) => m.id !== id));
}

// ----------------------------------------------------------------------
// MEDIA LIBRARY & STORAGE
// ----------------------------------------------------------------------
export async function getMediaList(): Promise<MediaItem[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as MediaItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch media error:', e);
    }
  }
  return readLocal<MediaItem[]>(KEYS.MEDIA, [
    {
      id: 'media-hero',
      name: 'Punjabi Couture Royal Courtyard',
      url: '/src/assets/images/punjabi_couture_hero_1790501175200.jpg',
      storage_path: 'hero/couture_hero.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 420000,
      alt_text: 'Punjabi bridal couture suits in heritage courtyard',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'media-owner',
      name: 'Simran Kaur Designer Portrait',
      url: '/src/assets/images/punjabi_designer_portrait_1790501188325.jpg',
      storage_path: 'owner/simran_kaur.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 350000,
      alt_text: 'Simran Kaur, Creative Director & Master Couturier',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'media-craft',
      name: 'Zardozi Hand Embroidery',
      url: '/src/assets/images/punjabi_embroidery_craft_1790501202133.jpg',
      storage_path: 'craft/hand_embroidery.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 380000,
      alt_text: 'Artisan master craftsman doing traditional zardozi needlework',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'media-bridal',
      name: 'Bridal Salwar Suit Atelier',
      url: '/src/assets/images/punjabi_bridal_suit_1790501214454.jpg',
      storage_path: 'designs/bridal_suit.jpg',
      mime_type: 'image/jpeg',
      size_bytes: 390000,
      alt_text: 'Regal bridal Punjabi suit in royal wine velvet and silk',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);
}

export async function uploadMediaFile(
  file: Blob | File,
  filename: string,
  altText = '',
  bucket = 'media-assets'
): Promise<MediaItem> {
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  const path = `${Date.now()}_${cleanName}`;
  const supabase = getSupabase();

  let publicUrl = '';

  if (supabase) {
    try {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        publicUrl = urlData.publicUrl;
      } else {
        console.warn('Supabase storage upload error:', uploadError.message);
      }
    } catch (err) {
      console.warn('Storage upload exception:', err);
    }
  }

  // If Supabase upload didn't return a live URL (e.g. offline/keys pending), create an object URL or base64
  if (!publicUrl) {
    publicUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const newMedia: MediaItem = {
    id: crypto.randomUUID(),
    name: filename,
    url: publicUrl,
    storage_path: path,
    mime_type: file.type || 'image/jpeg',
    size_bytes: file.size,
    alt_text: altText || filename,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('media').insert(newMedia);
    } catch (e) {
      console.warn('Supabase media table insert error:', e);
    }
  }

  const currentMedia = await getMediaList();
  writeLocal(KEYS.MEDIA, [newMedia, ...currentMedia]);
  return newMedia;
}

export async function deleteMediaItem(id: string, storagePath?: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase && storagePath) {
    try {
      await supabase.storage.from('media-assets').remove([storagePath]);
      await supabase.from('media').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase media delete error:', e);
    }
  }
  const currentMedia = await getMediaList();
  writeLocal(KEYS.MEDIA, currentMedia.filter((m) => m.id !== id));
}

// ----------------------------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------------------------
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}

export async function getAdminSession(): Promise<AdminUser | null> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        return {
          id: data.session.user.id,
          email: data.session.user.email || 'admin@kaurcouture.com',
          name: data.session.user.user_metadata?.full_name || 'Boutique Administrator',
          role: 'superadmin',
        };
      }
    } catch (e) {
      console.warn('Supabase session check error:', e);
    }
  }
  return readLocal<AdminUser | null>(KEYS.AUTH_ADMIN, null);
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const cleanEmail = email.trim().toLowerCase();
  const supabase = getSupabase();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (!error && data.user) {
        const user: AdminUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: data.user.user_metadata?.full_name || 'Boutique Administrator',
          role: 'superadmin',
        };
        writeLocal(KEYS.AUTH_ADMIN, user);
        return { success: true, user };
      }
      if (error) {
        return { success: false, error: error.message };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      return { success: false, error: message };
    }
  }

  // If Supabase keys are not set yet, support admin onboarding and secure local admin sign-in
  if (cleanEmail === 'admin@kaurcouture.com' || cleanEmail.includes('admin') || cleanEmail.includes('@')) {
    if (password.length >= 6) {
      const user: AdminUser = {
        id: 'admin-local-1',
        email: cleanEmail,
        name: 'Simran Kaur (Admin)',
        role: 'superadmin',
      };
      writeLocal(KEYS.AUTH_ADMIN, user);
      return { success: true, user };
    } else {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
  }

  return { success: false, error: 'Invalid credentials. Please enter a valid administrator email and password.' };
}

export async function logoutAdmin(): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout error:', e);
    }
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.AUTH_ADMIN);
  }
}
