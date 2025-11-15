import { supabase } from '@/api/supabaseClient';

// Sign in with Google
export const signInWithGoogle = async (redirectTo = null) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo || window.location.origin,
    }
  });
  
  if (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error);
    throw error;
  }
  
  return user;
};
