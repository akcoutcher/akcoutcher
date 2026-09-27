import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration can come from environment variables or custom runtime settings
const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Safely extracts the Supabase project ref from a standard Supabase JWT anon key.
 * Supabase anon keys contain { "iss": "supabase", "ref": "<project_ref>", "role": "anon" }.
 */
export const extractRefFromJwt = (jwt: string | undefined | null): string | null => {
  if (!jwt || typeof jwt !== 'string') return null;
  const trimmed = jwt.trim();
  try {
    const parts = trimmed.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr =
      typeof window !== 'undefined' && typeof window.atob === 'function'
        ? window.atob(base64)
        : typeof atob === 'function'
        ? atob(base64)
        : null;
    if (!jsonStr) return null;
    const payload = JSON.parse(jsonStr);
    if (payload?.iss === 'supabase' && typeof payload?.ref === 'string' && payload.ref.length >= 6) {
      return payload.ref;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Validates whether a string is a valid HTTP or HTTPS URL
 */
export const isValidHttpUrl = (urlString: string | undefined | null): boolean => {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (
    !trimmed ||
    trimmed === 'MY_SUPABASE_URL' ||
    trimmed === 'YOUR_SUPABASE_URL' ||
    trimmed === 'https://your-project-id.supabase.co' ||
    trimmed.includes('your-project-id') ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.startsWith('sb_publishable_') ||
    trimmed.startsWith('eyJ')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.length > 3 &&
      parsed.hostname.includes('.')
    );
  } catch {
    return false;
  }
};

/**
 * Validates whether an Anon Key is not a placeholder or invalid string
 */
export const isValidSupabaseKey = (key: string | undefined | null): boolean => {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (
    !trimmed ||
    trimmed === 'MY_SUPABASE_ANON_KEY' ||
    trimmed === 'YOUR_SUPABASE_ANON_KEY' ||
    trimmed.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') ||
    trimmed === 'undefined' ||
    trimmed === 'null'
  ) {
    return false;
  }
  return trimmed.length > 20;
};

/**
 * Normalizes a user-provided or environment Supabase URL.
 * Automatically handles:
 * - Missing protocol ('xyz.supabase.co' -> 'https://xyz.supabase.co')
 * - Publishable key accidentally entered in the URL slot (resolves ref from anon key JWT)
 * - Empty URL when valid anon key with ref is provided
 */
export const normalizeSupabaseUrl = (
  rawUrl: string | undefined | null,
  rawKey: string | undefined | null
): string => {
  let url = rawUrl ? rawUrl.trim() : '';

  // If the user pasted a publishable key (sb_publishable_...) or a JWT into the URL field
  if (url.startsWith('sb_publishable_') || url.startsWith('eyJ')) {
    url = '';
  }

  // Prepend https:// if user provided bare hostname
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    if (url.includes('.supabase.co') || url.includes('.')) {
      url = `https://${url}`;
    }
  }

  // If valid HTTP(S) URL, return it
  if (isValidHttpUrl(url)) {
    return url;
  }

  // If URL is not valid, try resolving from the Anon Key JWT project ref
  if (rawKey && isValidSupabaseKey(rawKey)) {
    const projectRef = extractRefFromJwt(rawKey);
    if (projectRef) {
      const derivedUrl = `https://${projectRef}.supabase.co`;
      if (isValidHttpUrl(derivedUrl)) {
        return derivedUrl;
      }
    }
  }

  return '';
};

export interface SupabaseConfigState {
  url: string;
  rawUrl: string;
  key: string;
  rawKey: string;
  isConfigured: boolean;
  detectedRef: string | null;
  isUrlPublishableKey: boolean;
}

export const getSupabaseConfig = (): SupabaseConfigState => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('kaur_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('kaur_supabase_anon_key') : null;

  const rawUrl = localUrl && localUrl.trim() !== '' ? localUrl.trim() : envUrl;
  const rawKey = localKey && localKey.trim() !== '' ? localKey.trim() : envKey;

  const detectedRef = extractRefFromJwt(rawKey);
  const normalizedUrl = normalizeSupabaseUrl(rawUrl, rawKey);
  const normalizedKey = isValidSupabaseKey(rawKey) ? rawKey.trim() : '';

  const isConfigured = Boolean(normalizedUrl && normalizedKey);
  const isUrlPublishableKey = rawUrl.startsWith('sb_publishable_');

  return {
    url: normalizedUrl,
    rawUrl,
    key: normalizedKey,
    rawKey,
    isConfigured,
    detectedRef,
    isUrlPublishableKey,
  };
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
  // Clear cached client so it re-initializes on next call
  cachedClient = null;
  currentUrl = null;
  currentKey = null;
};

let cachedClient: SupabaseClient | null = null;
let currentUrl: string | null = null;
let currentKey: string | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !isValidHttpUrl(url)) {
    return null;
  }

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
    console.warn('Supabase client could not be initialized:', error);
    return null;
  }
};

export const isSupabaseLive = async (): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from('site_settings').select('id').limit(1);
    if (error) {
      // PGRST116 means zero rows found, which is normal
      if (error.code === 'PGRST116') return true;
      // PGRST205 means table not created yet in Supabase (needs schema.sql)
      if (error.code === 'PGRST205') {
        console.info('Supabase project connected, but site_settings table not yet created.');
        return false;
      }
      console.warn('Supabase test query warning:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
