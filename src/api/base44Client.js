// import { createClient } from '@base44/sdk';
// // import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// // Create a client with authentication required
// export const base44 = createClient({
//   appId: "685a67ffa2e3e5975077a34f", 
//   requiresAuth: false // Ensure authentication is required for all operations
// });



import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables. Please check your .env file.');
// }

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);