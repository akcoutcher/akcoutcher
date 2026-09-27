import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration can come from environment variables or custom runtime settings
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const getSupabaseConfig = () => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('kaur_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('kaur_supabase_anon_key') : null;

  const url = (localUrl && localUrl.trim() !== '') ? localUrl.trim() : (envUrl && envUrl !== 'https://your-project-id.supabase.co' ? envUrl : '');
  const key = (localKey && localKey.trim() !== '') ? localKey.trim() : (envKey && !envKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') ? envKey : '');

  return { url, key, isConfigured: Boolean(url && key) };
};

export const saveCustomSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('kaur_supabase_url', url.trim());
      localStorage.setItem('kaur_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('kaur_supabase_url');
      localStorage.removeItem('kaur_supabase_anon_key');
    }
  }
};

let cachedClient: SupabaseClient | null = null;
let currentUrl: string | null = null;
let currentKey: string | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentUrl = url;
    currentKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
};

export const isSupabaseLive = async (): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('site_settings').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.warn('Supabase test query warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
