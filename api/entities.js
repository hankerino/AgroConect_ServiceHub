import { supabase } from '@/src/api/supabaseClient.js';

// Entity classes (simplified for backward compatibility)
export class ForumPost {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class CommunityProfile {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class VideoPost {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class CommunityGroup {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class Consultation {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class DataSource {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class Expert {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class User {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class TechResource {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class Product {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class MarketPrice {
  constructor(data) {
    Object.assign(this, data);
  }
}

export class WeatherForecast {
  constructor(data) {
    Object.assign(this, data);
  }
}

// Getter functions
export async function getForumPosts() {
  const { data, error } = await supabase.from('forum_posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data?.map(item => new ForumPost(item)) || [];
}

export async function getCommunityProfiles() {
  const { data, error } = await supabase.from('community_profiles').select('*');
  if (error) throw error;
  return data?.map(item => new CommunityProfile(item)) || [];
}

export async function getVideoPosts() {
  const { data, error } = await supabase.from('video_posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data?.map(item => new VideoPost(item)) || [];
}

export async function getCommunityGroups() {
  const { data, error } = await supabase.from('community_groups').select('*');
  if (error) throw error;
  return data?.map(item => new CommunityGroup(item)) || [];
}

export async function getConsultations() {
  console.log('[v0] getConsultations called');
  let { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
  
  if (!data || data.length === 0) {
    console.log('[v0] Trying PascalCase table name: Consultation');
    const result = await supabase.from('Consultation').select('*').order('scheduled_date', { ascending: false });
    data = result.data;
    error = result.error;
  }
  
  console.log('[v0] Consultations result:', { dataLength: data?.length, error: error?.message });
  if (error) throw error;
  return data?.map(item => new Consultation(item)) || [];
}

export async function getDataSources() {
  const { data, error } = await supabase.from('data_sources').select('*');
  if (error) throw error;
  return data?.map(item => new DataSource(item)) || [];
}

export async function getExperts() {
  const { data, error } = await supabase.from('experts').select('*');
  if (error) throw error;
  return data?.map(item => new Expert(item)) || [];
}

export async function getTechResources() {
  const { data, error } = await supabase.from('tech_resources').select('*');
  if (error) throw error;
  return data?.map(item => new TechResource(item)) || [];
}

export async function getProducts() {
  console.log('[v0] getProducts called');
  let { data, error } = await supabase.from('products').select('*');
  
  if (!data || data.length === 0) {
    console.log('[v0] Trying PascalCase table name: Product');
    const result = await supabase.from('Product').select('*').order('created_date', { ascending: false });
    data = result.data;
    error = result.error;
  }
  
  console.log('[v0] Products result:', { dataLength: data?.length, error: error?.message });
  if (error) throw error;
  return data?.map(item => new Product(item)) || [];
}

export async function getMarketPrices() {
  console.log('[v0] getMarketPrices called');
  console.log('[v0] Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  // Try lowercase first
  let { data, error } = await supabase.from('market_prices').select('*').order('date', { ascending: false });
  
  // If no data, try PascalCase
  if (!data || data.length === 0) {
    console.log('[v0] Trying PascalCase table name: MarketPrice');
    const result = await supabase.from('MarketPrice').select('*').order('date', { ascending: false });
    data = result.data;
    error = result.error;
  }
  
  console.log('[v0] Market prices result:', { dataLength: data?.length, error: error?.message });
  if (error) throw error;
  return data?.map(item => new MarketPrice(item)) || [];
}

export async function getUsers() {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data?.map(item => new User(item)) || [];
}

export async function getWeatherForecasts() {
  const { data, error } = await supabase.from('weather_forecasts').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new WeatherForecast(item)) || [];
}
