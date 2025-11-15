// Mock Supabase client for preview - this will work when deployed with real credentials
const createMockClient = () => ({
  from: (table) => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
  auth: {
    getUser: () => ({ data: { user: null }, error: null }),
    signIn: () => ({ data: null, error: null }),
    signOut: () => ({ data: null, error: null }),
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default supabaseClient
