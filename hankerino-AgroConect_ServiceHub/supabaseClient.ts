import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'agro_sb_url';
const STORAGE_ANON_KEY = 'agro_sb_key';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  // 1. Try Local Storage (User configured in UI)
  const localUrl = localStorage.getItem(STORAGE_URL_KEY);
  const localKey = localStorage.getItem(STORAGE_ANON_KEY);

  if (localUrl && localKey) {
    try {
      supabaseInstance = createClient(localUrl, localKey);
      return supabaseInstance;
    } catch (e) {
      console.error("Invalid stored credentials", e);
    }
  }

  // 2. Try Environment Variables (Build time config)
  const envUrl = process.env.SUPABASE_URL || '';
  const envKey = process.env.SUPABASE_KEY || '';

  if (envUrl && envKey && envUrl.startsWith('http')) {
    try {
        supabaseInstance = createClient(envUrl, envKey);
        return supabaseInstance;
    } catch(e) {
        console.error("Invalid hardcoded credentials", e);
    }
  }

  return null;
};

export const configureSupabase = (url: string, key: string) => {
  if (!url || !key) return false;
  try {
    const client = createClient(url, key);
    localStorage.setItem(STORAGE_URL_KEY, url);
    localStorage.setItem(STORAGE_ANON_KEY, key);
    supabaseInstance = client;
    return true;
  } catch (e) {
    console.error("Failed to configure Supabase", e);
    return false;
  }
};

export const disconnectSupabase = () => {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_ANON_KEY);
  supabaseInstance = null;
};

export const isSupabaseConfigured = () => {
  return !!getSupabase();
};

export const checkConnection = async () => {
  const client = getSupabase();
  if (!client) return false;

  try {
    // Attempt a lightweight query
    // We query a non-existent table 'health_check' deliberately.
    // If we get a 404/42P01 error, it means we reached the DB (Auth success).
    // If we get a 401/403, auth failed.
    // If network fails, it throws.
    const { error } = await client.from('health_check').select('*').limit(1);

    // 42P01: undefined_table (Postgres) - means connection worked, table just doesn't exist
    if (!error || error.code === '42P01' || error.message?.includes('relation "health_check" does not exist')) {
        return true;
    }

    console.warn('Supabase Check Error:', error);
    return false;
  } catch (e) {
    console.error('Supabase Connection Failed:', e);
    return false;
  }
};