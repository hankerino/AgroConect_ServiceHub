'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch('/api/market-prices');
        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setPrices(result.data || []);
        }
      } catch (err) {
        setError('Failed to load market prices');
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Market Prices</h1>
          <p className="text-muted-foreground">
            Real-time agricultural commodity prices and market trends
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prices.map((price) => {
            const trend = price.change >= 0 ? 'up' : 'down';
            const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <Card key={price.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <TrendIcon className={`h-5 w-5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <CardTitle className="mt-4">{price.commodity || price.name}</CardTitle>
                  <CardDescription>{price.location || price.region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        R$ {price.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">per {price.unit || 'kg'}</p>
                    </div>
                    {price.change !== undefined && (
                      <div className={`flex items-center gap-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}%
                        </span>
                      </div>
                    )}
                    {price.date && (
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(price.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
