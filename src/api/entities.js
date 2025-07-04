import { supabaseClient } from './base44Client';

// Consultation API
export const getConsultations = async () => {
  const { data: Consultation, error: consultationError } = await supabaseClient
    .from('Consultation')
    .select('*')
    .order('scheduled_date', { ascending: false });
  
  return { data: Consultation, error: consultationError };
};

// Forum Post API
export const getForumPosts = async () => {
  const { data: ForumPost, error: forumPostError } = await supabaseClient
    .from('ForumPost')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: ForumPost, error: forumPostError };
};

// Market Price API
export const getMarketPrices = async () => {
    const { data: MarketPrice, error: marketPriceError } = await supabaseClient
    .from('MarketPrice')
    .select('*')
    .order('date', { ascending: false });
  
  return { data: MarketPrice, error: marketPriceError };
};

// Product API
export const getProducts = async () => {
  const { data: Product, error: productError } = await supabaseClient
    .from('Product')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: Product, error: productError };
};

// Resource API
export const getResources = async () => {
  const { data: Resource, error: resourceError } = await supabaseClient
    .from('Resource')
    .select('*');
  
  return { data: Resource, error: resourceError };
};

// Expert API
export const getExperts = async () => {
  const { data: Expert, error: expertError } = await supabaseClient
    .from('Expert')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: Expert, error: expertError };
};

// Data Source API
export const getDataSources = async () => {
  const { data: DataSource, error: dataSourceError } = await supabaseClient
    .from('DataSource')
    .select('*');
  
  return { data: DataSource, error: dataSourceError };
};

// Weather Forecast API
export const getWeatherForecasts = async () => {
  const { data: WeatherForecast, error: weatherForecastError } = await supabaseClient
    .from('WeatherForecast')
    .select('*');
  
  return { data: WeatherForecast, error: weatherForecastError };
};

// Sensor API
export const getSensors = async () => {
  const { data: Sensor, error: sensorError } = await supabaseClient
    .from('Sensor')
    .select('*');
  
  return { data: Sensor, error: sensorError };
};

// Tech Resource API
export const getTechResources = async () => {
  const { data: TechResource, error: techResourceError } = await supabaseClient
    .from('TechResource')
    .select('*')
    .order('publication_date', { ascending: false });
  
  return { data: TechResource, error: techResourceError };
};

// Community Profile API
export const getCommunityProfiles = async () => {
  const { data: CommunityProfile, error: communityProfileError } = await supabaseClient
    .from('CommunityProfile')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: CommunityProfile, error: communityProfileError };
};

// Video Post API
export const getVideoPosts = async () => {
  const { data: VideoPost, error: videoPostError } = await supabaseClient
    .from('VideoPost')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: VideoPost, error: videoPostError };
};

// Community Group API
export const getCommunityGroups = async () => {
  const { data: CommunityGroup, error: communityGroupError } = await supabaseClient
    .from('CommunityGroup')
    .select('*')
    .order('created_date', { ascending: false });
  
  return { data: CommunityGroup, error: communityGroupError };
};

// Auth SDK
export const getUsers = () => {
  return [];
};