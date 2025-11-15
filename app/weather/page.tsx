'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { Header } from '@/components/Header';

export default function WeatherPage() {
  const [forecasts, setForecasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setForecasts(data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Forecast</h1>
          <p className="text-gray-600">Plan your agricultural activities</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : forecasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {forecasts.map((forecast: any) => (
              <Card key={forecast.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-cyan-600" />
                    {forecast.date ? new Date(forecast.date).toLocaleDateString() : 'Forecast'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {forecast.temperature && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temperature:</span>
                        <span className="font-semibold">{forecast.temperature}°C</span>
                      </div>
                    )}
                    {forecast.humidity && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Humidity:</span>
                        <span className="font-semibold">{forecast.humidity}%</span>
                      </div>
                    )}
                    {forecast.description && (
                      <p className="text-sm text-gray-600 mt-2">{forecast.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Cloud className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Weather Data</h3>
              <p className="text-gray-500">Weather forecasts will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
