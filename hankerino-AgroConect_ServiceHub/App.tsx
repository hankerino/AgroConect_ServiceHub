import React, { useState } from 'react';
import { Header } from './components/Header';
import { Ticker } from './components/Ticker';
import { VoiceAssistant } from './components/VoiceAssistant';
import { ServiceCard } from './components/ServiceCard';
import { MarketView } from './components/MarketView';
import { WeatherView } from './components/WeatherView';
import { CommunityView } from './components/CommunityView';
import { MarketplaceView } from './components/MarketplaceView';
import { MySensors } from './components/MySensors';
import { SystemTest } from './components/SystemTest';
import { LearningCenter } from './components/LearningCenter';
import { GeospatialView } from './components/GeospatialView';
import { AlphaEarthView } from './components/AlphaEarthView';
import { ProfileView } from './components/ProfileView';
import { ConsultationsView } from './components/ConsultationsView';
import { CheckoutView } from './components/CheckoutView';
import { SensorPlannerView } from './components/SensorPlannerView';
import { ProductDetailView } from './components/ProductDetailView';
import { ExpertDetailView } from './components/ExpertDetailView';
import { DataSourcesView } from './components/DataSourcesView';
import { ViewState, Language } from './types';
import { SERVICES, TRANSLATIONS } from './constants';
import { Sprout, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [language, setLanguage] = useState<Language['code']>('en');

  const t = TRANSLATIONS[language];

  const renderContent = () => {
    switch (currentView) {
      case ViewState.MARKET_PRICES:
        return (
          <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <MarketView language={language} />
          </>
        );
      case ViewState.WEATHER:
        return (
           <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <WeatherView language={language} />
           </>
        );
      case ViewState.COMMUNITY:
         return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <CommunityView language={language} />
            </>
         );
      case ViewState.MARKETPLACE:
         return (
             <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <MarketplaceView language={language} onNavigate={setCurrentView} />
            </>
         );
      case ViewState.MY_SENSORS:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <MySensors language={language} />
            </>
          );
      case ViewState.SYSTEM_TEST:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <SystemTest language={language} />
            </>
          );
      case ViewState.LEARNING:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <LearningCenter language={language} />
            </>
          );
      case ViewState.GEOSPATIAL:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <GeospatialView language={language} />
            </>
          );
      case ViewState.ALPHA_EARTH:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <AlphaEarthView language={language} />
            </>
          );
      case ViewState.PROFILE:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <ProfileView language={language} />
            </>
          );
      case ViewState.CONSULTATIONS:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <ConsultationsView onNavigate={setCurrentView} />
            </>
          );
      case ViewState.CHECKOUT:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <CheckoutView />
            </>
          );
      case ViewState.SENSOR_PLANNER:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <SensorPlannerView />
            </>
          );
      case ViewState.PRODUCT_DETAIL:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.MARKETPLACE)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Marketplace
            </button>
            <ProductDetailView />
            </>
          );
      case ViewState.EXPERT_DETAIL:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.MARKETPLACE)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> Back to Marketplace
            </button>
            <ExpertDetailView />
            </>
          );
      case ViewState.DATA_SOURCES:
          return (
            <>
            <button
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="mb-6 text-sm text-gray-500 hover:text-[#10b981] flex items-center font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" /> {t.backToDashboard}
            </button>
            <DataSourcesView />
            </>
          );
      case ViewState.DASHBOARD:
      default:
        return (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Hero Section - Matching Screenshot */}
            <div className="text-center pt-8 pb-4">
              <h1 className="text-4xl sm:text-[42px] font-extrabold text-gray-900 mb-3 tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-[#10b981] font-semibold mb-4">
                {t.welcomeBack}, Henry Quinones!
              </p>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-[#10b981] border border-emerald-100 text-xs font-bold tracking-wide uppercase shadow-sm">
                <CheckCircle2 size={14} className="mr-1.5" />
                {t.connected}
              </div>
            </div>

            {/* Voice Assistant Section - Full Width Banner */}
            <div className="w-full">
               <VoiceAssistant language={language} />
            </div>

            {/* Services Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.ourServices}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service) => (
                  <ServiceCard
                    key={service.id}
                    item={service}
                    language={language}
                    onClick={() => setCurrentView(service.view)}
                  />
                ))}
              </div>
            </div>

            {/* Featured Block (Learning Center Teaser) */}
            <div className="bg-[#064e3b] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-start gap-6">
                   <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md hidden sm:block">
                     <Sprout size={40} className="text-emerald-300" />
                   </div>
                   <div>
                       <h2 className="text-2xl font-bold mb-2">{t.featuredCourseTitle}</h2>
                       <p className="text-emerald-100/80 max-w-lg leading-relaxed">
                         {t.featuredCourseDesc}
                       </p>
                   </div>
                 </div>
                 <button
                  onClick={() => setCurrentView(ViewState.LEARNING)}
                  className="px-8 py-4 bg-white text-[#064e3b] rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-all transform hover:-translate-y-1 whitespace-nowrap"
                 >
                   {t.startLearning}
                 </button>
               </div>

               {/* Decorative Circles */}
               <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#10b981] opacity-20 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black opacity-20 rounded-full blur-3xl"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <Header
        currentView={currentView}
        setView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
      />
      <Ticker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="font-medium">&copy; 2024 AgroConect ServiceHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}