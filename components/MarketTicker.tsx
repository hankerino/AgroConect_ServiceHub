'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  product: string;
  price: string;
  location: string;
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { product: 'Milho', price: 'R$ 1.50', location: 'Varginha, MG' },
    { product: 'Soja', price: 'R$ 1.85', location: 'Rondonópolis, MT' },
    { product: 'Café', price: 'R$ 8.20', location: 'Patrocínio, MG' },
  ]);

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">Live Market</span>
        </div>
        <div className="flex-1 flex items-center gap-6 overflow-x-auto">
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm whitespace-nowrap">
              <span className="font-medium text-gray-900">{item.product}</span>
              <span className="text-green-600 font-semibold">{item.price}</span>
              <span className="text-gray-500">📍 {item.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
