import React, { useState } from 'react';
import { MarketChart } from './MarketChart';
import { MARKET_DATA } from '../constants';
import { TrendingUp, TrendingDown, Minus, Filter, Download, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Language } from '../types';

interface MarketViewProps {
  language: Language['code'];
}

export const MarketView: React.FC<MarketViewProps> = ({ language }) => {
  const [showAll, setShowAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'gainers' | 'losers'>('all');

  const displayedData = MARKET_DATA.filter(item => {
      if (activeFilter === 'gainers') return item.change > 0;
      if (activeFilter === 'losers') return item.change < 0;
      return true;
  });

  const topMovers = showAll ? displayedData : displayedData.slice(0, 5);

  const handleExport = () => {
      setIsExporting(true);
      setTimeout(() => {
          setIsExporting(false);
          alert("Report downloaded successfully!");
      }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Market Analysis</h2>
           <p className="text-gray-500 text-sm mt-1">Real-time commodity prices and trends</p>
        </div>
        <div className="flex gap-2 relative">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium shadow-sm transition-colors ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
                <Filter size={16} className="mr-2" /> Filter
            </button>

            {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95">
                    <button onClick={() => setActiveFilter('all')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center">
                        All Commodities {activeFilter === 'all' && <Check size={14} className="text-emerald-600"/>}
                    </button>
                    <button onClick={() => setActiveFilter('gainers')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center">
                        Gainers Only {activeFilter === 'gainers' && <Check size={14} className="text-emerald-600"/>}
                    </button>
                    <button onClick={() => setActiveFilter('losers')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between items-center">
                        Losers Only {activeFilter === 'losers' && <Check size={14} className="text-emerald-600"/>}
                    </button>
                </div>
            )}

            <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm font-medium hover:bg-emerald-600 shadow-sm disabled:opacity-70 transition-all"
            >
                {isExporting ? (
                    <>Downloading...</>
                ) : (
                    <><Download size={16} className="mr-2" /> Export Report</>
                )}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-gray-900">Price History (6 Months)</h3>
             <select className="text-sm border-gray-200 rounded-md text-gray-500 bg-gray-50 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                 <option>Soja vs Milho</option>
                 <option>Café</option>
                 <option>Boi Gordo</option>
             </select>
          </div>
          <MarketChart />
        </div>

        {/* Top Movers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-center">
                Movers
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{activeFilter}</span>
            </h3>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                {topMovers.length > 0 ? topMovers.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div>
                            <p className="font-bold text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.location}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-semibold text-gray-900">{item.currency} {item.price.toFixed(2)}</p>
                             <div className={`flex items-center justify-end text-xs font-bold ${
                                item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'
                              }`}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                              </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 text-gray-400 text-sm">No commodities found for this filter.</div>
                )}
            </div>
            <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-2 text-sm text-[#10b981] font-medium hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
                {showAll ? (
                    <>Show Less <ChevronUp size={14} /></>
                ) : (
                    <>View All Commodities <ChevronDown size={14} /></>
                )}
            </button>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-900">Regional Prices Table</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Commodity</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Unit</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Change (24h)</th>
                        <th className="px-6 py-3">Trend</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {MARKET_DATA.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                            <td className="px-6 py-4">{item.currency} {item.price.toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-500">{item.unit}</td>
                            <td className="px-6 py-4 text-gray-500">{item.location}</td>
                            <td className={`px-6 py-4 font-medium ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {item.change > 0 ? '+' : ''}{item.change}%
                            </td>
                            <td className="px-6 py-4">
                                {item.change > 0 ? <TrendingUp size={16} className="text-green-500" /> : <TrendingDown size={16} className="text-red-500" />}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};