/**
 * Static API replacements for when using output: 'export'
 * These functions call Supabase directly instead of using API routes
 */

import { supabase } from '@/src/config/supabase';

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch products' };
  }
}

export async function getMarketPrices() {
  try {
    const { data, error } = await supabase
      .from('MarketPrice')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch market prices' };
  }
}

export async function getConsultations() {
  try {
    const { data, error } = await supabase
      .from('Consultation')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch consultations' };
  }
}

export async function getForumPosts() {
  try {
    const { data, error } = await supabase
      .from('ForumPost')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch forum posts' };
  }
}

export async function getWeatherForecasts() {
  try {
    const { data, error } = await supabase
      .from('WeatherForecast')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching weather forecasts:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch weather forecasts' };
  }
}

export async function getSoilAnalyses() {
  try {
    const { data, error } = await supabase
      .from('SoilAnalysis')
      .select('*')
      .order('created_date', { ascending: false });
    
    if (error) {
      // Table might not exist
      return { data: [], count: 0, error: null };
    }
    
    return { data: data || [], count: data?.length || 0, error: null };
  } catch (error) {
    console.error('Error fetching soil analyses:', error);
    return { data: [], count: 0, error: null };
  }
}

export async function getTechResources() {
  try {
    const { data, error } = await supabase
      .from('TechResource')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching tech resources:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch tech resources' };
  }
}

export async function getVideoPosts() {
  try {
    const { data, error } = await supabase
      .from('VideoPost')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching video posts:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch video posts' };
  }
}

export async function getExperts() {
  try {
    const { data, error } = await supabase
      .from('Expert')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching experts:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch experts' };
  }
}

export async function getDataSources() {
  try {
    const { data, error } = await supabase
      .from('DataSource')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch data sources' };
  }
}

export async function getUsers() {
  // Base44 has no User table
  return { data: [], count: 0, error: null };
}

export async function getCommunityGroups() {
  try {
    const { data, error } = await supabase
      .from('CommunityGroup')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching community groups:', error);
    return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch community groups' };
  }
}
