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
  const { data, error } = await supabase.from('ForumPost').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new ForumPost(item)) || [];
}

export async function getCommunityProfiles() {
  const { data, error } = await supabase.from('CommunityProfile').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new CommunityProfile(item)) || [];
}

export async function getVideoPosts() {
  const { data, error } = await supabase.from('VideoPost').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new VideoPost(item)) || [];
}

export async function getCommunityGroups() {
  const { data, error } = await supabase.from('CommunityGroup').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new CommunityGroup(item)) || [];
}

export async function getConsultations() {
  const { data, error } = await supabase.from('Consultation').select('*').order('scheduled_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new Consultation(item)) || [];
}

export async function getDataSources() {
  const { data, error } = await supabase.from('DataSource').select('*');
  if (error) throw error;
  return data?.map(item => new DataSource(item)) || [];
}

export async function getExperts() {
  const { data, error } = await supabase.from('Expert').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new Expert(item)) || [];
}

export async function getTechResources() {
  const { data, error } = await supabase.from('TechResource').select('*').order('publication_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new TechResource(item)) || [];
}

export async function getProducts() {
  const { data, error } = await supabase.from('Product').select('*').order('created_date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new Product(item)) || [];
}

export async function getMarketPrices() {
  const { data, error} = await supabase.from('MarketPrice').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data?.map(item => new MarketPrice(item)) || [];
}

export async function getUsers() {
  const { data, error } = await supabase.from('User').select('*');
  if (error) throw error;
  return data?.map(item => new User(item)) || [];
}

export async function getWeatherForecasts() {
  const { data, error } = await supabase.from('WeatherForecast').select('*');
  if (error) throw error;
  return data?.map(item => new WeatherForecast(item)) || [];
}
