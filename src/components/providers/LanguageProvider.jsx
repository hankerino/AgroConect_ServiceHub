import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/api/supabaseClient';

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserAndLanguage = useCallback(async () => {
    setLoading(true);
    const browserLang = navigator.language.split('-')[0];
    const initialLang = browserLang === 'en' ? 'en' : 'pt';
    
    try {
      const { data: { user: userData }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      setUser(userData);
      setLanguage(userData?.user_metadata?.preferred_language || initialLang);
    } catch (error) {
      setUser(null);
      setLanguage(initialLang);
      console.log("User not authenticated, using browser language.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadUserAndLanguage();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          setLanguage(session.user.user_metadata?.preferred_language || language);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserAndLanguage, language]);
  
  const switchLanguage = async (newLang) => {
    if (!['en', 'pt'].includes(newLang)) return;
    
    setLanguage(newLang);
    if (user) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { preferred_language: newLang }
        });
        if (error) throw error;
        
        // Optimistically update user in context
        setUser(prevUser => ({
          ...prevUser, 
          user_metadata: { ...prevUser.user_metadata, preferred_language: newLang }
        }));
      } catch (error) {
        console.error("Failed to save language preference:", error);
        // Revert on error if needed
        loadUserAndLanguage();
      }
    }
  };

  const value = {
    language,
    user,
    loading,
    switchLanguage,
    reloadUser: loadUserAndLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
