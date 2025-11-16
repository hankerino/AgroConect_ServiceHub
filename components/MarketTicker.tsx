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
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-prices', {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        if (result.data && result.data.length > 0) {
          const formattedData = result.data.slice(0, 5).map((item: any) => {
            const productName = item.crop_name || 'Produto';
            const priceValue = item.price_per_kg 
              ? `R$ ${Number(item.price_per_kg).toFixed(2)}` 
              : 'N/A';
            const locationName = item.market_location || 'Brasil';
            
            return {
              product: productName,
              price: priceValue,
              location: locationName,
            };
          });
          
          setMarketData(formattedData);
          setError(null);
        }
      } catch (error) {
        console.error('[v0] Error fetching market data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border-b border-red-200 py-2 px-4">
        <div className="flex items-center gap-2 text-sm text-red-600">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>Market data unavailable: {error}</span>
        </div>
      </div>
    );
  }

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
          {isLoading ? (
            <span className="text-sm text-gray-500">Loading prices...</span>
          ) : marketData.length === 0 ? (
            <span className="text-sm text-gray-500">No market data available</span>
          ) : (
            marketData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="font-medium text-gray-900">{item.product}</span>
                <span className="text-green-600 font-semibold">{item.price}</span>
                <span className="text-gray-500">📍 {item.location}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
