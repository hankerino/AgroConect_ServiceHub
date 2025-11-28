import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MARKET_DATA } from '../constants';

export const Ticker: React.FC = () => {
  // Duplicate data to ensure seamless scroll
  const displayData = [...MARKET_DATA, ...MARKET_DATA, ...MARKET_DATA];

  return (
    <div className="w-full bg-white border-b border-gray-200 h-12 flex items-center overflow-hidden relative shadow-sm z-40">
      <div className="flex items-center gap-2 pl-6 pr-4 bg-white z-10 h-full border-r border-gray-100">
        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></div>
        <span className="text-sm font-bold text-gray-800 whitespace-nowrap">Live Market</span>
      </div>

      <div className="flex overflow-hidden w-full group py-3">
        <div className="flex animate-scroll hover:pause whitespace-nowrap items-center">
          {displayData.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center px-8 border-r border-gray-100 last:border-0">
              <span className="font-bold text-gray-700 text-sm mr-2">{item.name}</span>
              <span className="text-gray-900 text-sm font-medium mr-3">{item.currency} {item.price.toFixed(2)}</span>

              <div className={`flex items-center text-xs font-semibold ${
                item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {item.change > 0 ? <TrendingUp size={14} className="mr-1" /> :
                 item.change < 0 ? <TrendingDown size={14} className="mr-1" /> :
                 <Minus size={14} className="mr-1" />}
                {Math.abs(item.change)}%
              </div>
              <span className="text-[10px] text-gray-400 ml-2 uppercase tracking-wide">{item.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
