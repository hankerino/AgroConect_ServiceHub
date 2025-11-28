import React, { useState } from 'react';
import { MOCK_PRODUCTS, MOCK_CONSULTANTS } from '../constants';
import { Search, ShoppingBag, User, ArrowRight, Star } from 'lucide-react';
import { ViewState, Language } from '../types';

interface MarketplaceViewProps {
  language: Language['code'];
  onNavigate: (view: ViewState) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ language, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'experts'>('products');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-4">
         <h2 className="text-3xl font-bold text-gray-900">Agricultural Marketplace</h2>
         <p className="text-gray-600 mt-2">Products, services and experts for your farm</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-12 gap-4">
         <div className="md:col-span-6 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input
                type="text"
                placeholder={activeTab === 'products' ? "Search products..." : "Search experts..."}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
             />
         </div>
         <div className="md:col-span-3">
             <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] text-sm text-gray-700">
                 <option>All Categories</option>
                 <option>Byproducts</option>
                 <option>Fertilizers</option>
                 <option>Services</option>
             </select>
         </div>
         <div className="md:col-span-3">
             <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] text-sm text-gray-700">
                 <option>All Locations</option>
                 <option>Mato Grosso</option>
                 <option>Paraná</option>
                 <option>São Paulo</option>
             </select>
         </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg p-1 inline-flex w-full md:w-auto border border-gray-100 shadow-sm">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:w-48 py-2 px-4 rounded-md font-bold text-sm flex items-center justify-center transition-colors ${
              activeTab === 'products' ? 'bg-emerald-50 text-[#10b981] shadow-sm' : 'bg-white text-gray-500 hover:text-gray-900'
            }`}
          >
              <ShoppingBag size={16} className="mr-2" /> Products
          </button>
          <button
            onClick={() => setActiveTab('experts')}
            className={`flex-1 md:w-48 py-2 px-4 rounded-md font-bold text-sm flex items-center justify-center transition-colors ${
              activeTab === 'experts' ? 'bg-emerald-50 text-[#10b981] shadow-sm' : 'bg-white text-gray-500 hover:text-gray-900'
            }`}
          >
              <User size={16} className="mr-2" /> Experts
          </button>
      </div>

      {/* Content Grid */}
      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-2">
                              {product.tags?.map((tag, idx) => (
                                  <span key={idx} className={`text-xs font-bold px-2 py-1 rounded-md ${tag.color}`}>
                                      {tag.label}
                                  </span>
                              ))}
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                                product.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {product.availability}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-3">{product.name}</h3>
                        <p className="text-gray-500 text-sm mb-6 flex-1">
                            {product.description}
                        </p>

                        <div className="mt-auto">
                            <p className="text-2xl font-bold text-[#10b981] mb-4">
                                R$ {product.price.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/ {product.priceUnit}</span>
                            </p>

                            <button
                              onClick={() => onNavigate(ViewState.PRODUCT_DETAIL)}
                              className="w-full py-3 rounded-xl bg-[#10b981] text-white font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center"
                            >
                                Details <ArrowRight size={16} className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CONSULTANTS.map((consultant) => (
            <div key={consultant.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                    <p className="text-sm text-gray-500">{consultant.specialty}</p>
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">{consultant.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-bold text-gray-900">R$ {consultant.rate}/hr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Availability</span>
                    <span className="text-emerald-600 font-medium">{consultant.availability}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(ViewState.EXPERT_DETAIL)}
                  className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                    View Profile <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};