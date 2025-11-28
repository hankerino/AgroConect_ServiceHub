import React from 'react';

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  location: string;
  change: number; // Percentage change
  currency: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Language {
  code: 'en' | 'de' | 'pt';
  label: string;
  flag: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  MARKET_PRICES = 'MARKET_PRICES',
  WEATHER = 'WEATHER',
  COMMUNITY = 'COMMUNITY',
  MARKETPLACE = 'MARKETPLACE',
  LEARNING = 'LEARNING',
  CONSULTATIONS = 'CONSULTATIONS',
  MY_SENSORS = 'MY_SENSORS',
  SYSTEM_TEST = 'SYSTEM_TEST',
  SENSOR_PLANNER = 'SENSOR_PLANNER',
  CHECKOUT = 'CHECKOUT',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  EXPERT_DETAIL = 'EXPERT_DETAIL',
  GEOSPATIAL = 'GEOSPATIAL',
  ALPHA_EARTH = 'ALPHA_EARTH',
  PROFILE = 'PROFILE',
  DATA_SOURCES = 'DATA_SOURCES',
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<any>;
  view: ViewState;
  color: string;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  category: string;
  image?: string;
  rating?: number;
  tags?: { label: string; color: string }[];
  description: string;
  availability: 'Available' | 'Limited' | 'Out of Stock';
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string; // URL or initial
  title: string;
  preview: string;
  replies: number;
  likes: number;
  tag: string;
  time: string;
}

export interface SensorItem {
  id: string;
  name: string;
  type: string;
  installedDate: string;
  status: 'active' | 'inactive' | 'warning';
  location?: string;
  iconType: 'chart' | 'camera' | 'water' | 'cloud' | 'lightning' | 'chemistry';
  coords?: [number, number]; // Latitude, Longitude
}

export interface SystemTestResult {
  id: string;
  name: string;
  status: 'success' | 'failure' | 'pending';
  message?: string;
  details?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  duration: string;
  author: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  rate: number;
  rating: number;
  availability: string;
  image?: string;
}