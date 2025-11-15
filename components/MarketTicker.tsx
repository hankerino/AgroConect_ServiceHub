'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  id?: string;
  product: string;
  price: string;
  location: string;
  date?: string;
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { product: 'Milho', price: 'R$ 1.50', location: 'Varginha, MG' },
    { product: 'Soja', price: 'R$ 1.85', location: 'Rondonópolis, MT' },
    { product: 'Café', price: 'R$ 8.20', location: 'Patrocínio, MG' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        console.log('[v0] Fetching market prices from API');
        const response = await fetch('/api/market-prices');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          console.log('[v0] Market data received:', result.data);
          const formattedData = result.data.slice(0, 3).map((item: any) => ({
            product: item.product || item.name,
            price: typeof item.price === 'number' 
              ? `R$ ${item.price.toFixed(2)}` 
              : item.price,
            location: item.location || item.city || 'Brasil',
          }));
          setMarketData(formattedData);
        }
      } catch (error) {
        console.error('[v0] Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isLoading ? 'Loading Market' : 'Live Market'}
          </span>
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
