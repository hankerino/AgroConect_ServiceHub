import React, { useState } from 'react';
import { Menu, Bell, Search, User, ChevronDown, ChevronRight, Sprout } from 'lucide-react';
import { ViewState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  language: Language['code'];
  setLanguage: (lang: Language['code']) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Menu items based on the "MySensors" screenshot dropdown
  const menuItems = [
    { name: t.dashboard, view: ViewState.DASHBOARD },
    { name: t.alphaEarth, view: ViewState.ALPHA_EARTH },
    { name: t.geospatialMaps, view: ViewState.GEOSPATIAL },
    { name: 'Profile', view: ViewState.PROFILE },
    { name: 'DataSources', view: ViewState.DATA_SOURCES },
    { name: t.marketPrices, view: ViewState.MARKET_PRICES },
    { name: t.weather, view: ViewState.WEATHER },
    { name: t.learningCenter, view: ViewState.LEARNING },
    { name: t.marketplace, view: ViewState.MARKETPLACE },
    { name: 'Product Detail', view: ViewState.PRODUCT_DETAIL },
    { name: 'Expert Detail', view: ViewState.EXPERT_DETAIL },
    { name: t.community, view: ViewState.COMMUNITY },
    { name: 'Consultations', view: ViewState.CONSULTATIONS },
    { name: 'Checkout', view: ViewState.CHECKOUT },
    { name: t.systemHealth, view: ViewState.SYSTEM_TEST },
    { name: 'Sensor Planner', view: ViewState.SENSOR_PLANNER },
    { name: t.mySensors, view: ViewState.MY_SENSORS },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[72px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center cursor-pointer gap-3" onClick={() => setView(ViewState.DASHBOARD)}>
              <div className="bg-[#10b981] p-2 rounded-full">
                <Sprout className="text-white h-5 w-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">AgroConect</h1>
                <p className="text-[11px] text-gray-500 font-medium leading-none">ServiceHub</p>
              </div>
            </div>

            {/* Desktop Navigation - Simplified for robust list */}
            <div className="hidden lg:flex ml-12 items-center relative group cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 <span className="text-sm font-bold text-gray-700 mr-2">
                    {currentView.replace(/_/g, ' ')}
                 </span>
                 <ChevronDown size={16} className="text-gray-400" />

                  {/* Desktop Dropdown */}
                 <div className={`absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 top-full max-h-[80vh] overflow-y-auto ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                  <div className="py-2">
                    {menuItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setView(item.view);
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2.5 text-sm ${
                            currentView === item.view
                              ? 'bg-emerald-50 text-emerald-600 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.name}
                        </button>
                    ))}
                  </div>
                </div>
            </div>

          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3 sm:space-x-5">
             <div className="flex items-center space-x-2">
               <button onClick={() => setLanguage('en')} className={`text-xl ${language === 'en' ? 'opacity-100' : 'opacity-40 grayscale hover:opacity-100'}`}>🇺🇸</button>
               <button onClick={() => setLanguage('de')} className={`text-xl ${language === 'de' ? 'opacity-100' : 'opacity-40 grayscale hover:opacity-100'}`}>🇩🇪</button>
               <button onClick={() => setLanguage('pt')} className={`text-xl ${language === 'pt' ? 'opacity-100' : 'opacity-40 grayscale hover:opacity-100'}`}>🇧🇷</button>
             </div>

            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
               <Search size={18} className="text-gray-400" />
               <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-24 lg:w-48 text-gray-600 placeholder-gray-400 outline-none"
               />
            </div>

            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-1 cursor-pointer" onClick={() => setView(ViewState.PROFILE)}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">Henry Quinones</p>
                <div className="flex items-center justify-end">
                  <span className="h-2 w-2 bg-[#10b981] rounded-full mr-1.5"></span>
                  <p className="text-xs text-gray-500 font-medium">Conectado</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#10b981] border border-emerald-200 shadow-sm hover:bg-emerald-200 transition-colors">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 absolute top-[72px] left-0 right-0 shadow-lg z-40 max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="px-4 pt-3 pb-4 space-y-2">
             {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setView(item.view);
                    setIsMenuOpen(false);
                  }}
                  className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left ${
                    currentView === item.view
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {item.name}
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </button>
             ))}
          </div>
        </div>
      )}
    </header>
  );
};