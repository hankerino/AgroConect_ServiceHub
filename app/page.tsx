'use client';

import { Header } from '@/components/Header';
import { MarketTicker } from '@/components/MarketTicker';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { ServiceCard } from '@/components/ServiceCard';
import { TrendingUp, Users, BookOpen, ShoppingCart, MessageSquare, Cloud, Sprout, Calendar } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <MarketTicker />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            What Can We Do Today?
          </h1>
          <p className="text-xl text-green-600 font-medium mb-2">
            Welcome back, Henry Quinones!
          </p>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Conectado</span>
          </div>
        </div>

        {/* Voice Assistant */}
        <div className="mb-8">
          <VoiceAssistant />
        </div>

        {/* Our Services */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard
              title="Market Prices"
              icon={TrendingUp}
              href="/marketplace"
              iconColor="text-blue-600"
              iconBg="bg-blue-100"
            />
            
            <ServiceCard
              title="Community"
              icon={Users}
              href="/community"
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            
            <ServiceCard
              title="Learning Center"
              icon={BookOpen}
              href="/learning"
              iconColor="text-orange-600"
              iconBg="bg-orange-100"
            />
            
            <ServiceCard
              title="Products"
              icon={ShoppingCart}
              href="/marketplace"
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
            
            <ServiceCard
              title="Consultations"
              icon={Calendar}
              href="/consultations"
              iconColor="text-red-600"
              iconBg="bg-red-100"
            />
            
            <ServiceCard
              title="Forum"
              icon={MessageSquare}
              href="/community"
              iconColor="text-indigo-600"
              iconBg="bg-indigo-100"
            />
            
            <ServiceCard
              title="Weather"
              icon={Cloud}
              href="/weather"
              iconColor="text-cyan-600"
              iconBg="bg-cyan-100"
            />
            
            <ServiceCard
              title="Soil Analysis"
              icon={Sprout}
              href="/soil-analysis"
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
