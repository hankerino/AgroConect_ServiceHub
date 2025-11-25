'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Sprout, ShoppingCart } from 'lucide-react';

interface StatsData {
  users: number;
  consultations: number;
  products: number;
  soilAnalyses: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsData>({
    users: 0,
    consultations: 0,
    products: 0,
    soilAnalyses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('[v0] Fetching dashboard stats from all API endpoints');
        
        const [usersRes, consultationsRes, productsRes, soilAnalysesRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/consultations'),
          fetch('/api/products'),
          fetch('/api/soil-analyses'),
        ]);

        const [usersData, consultationsData, productsData, soilAnalysesData] = await Promise.all([
          usersRes.json(),
          consultationsRes.json(),
          productsRes.json(),
          soilAnalysesRes.json(),
        ]);

        console.log('[v0] Stats fetched:', {
          users: usersData.count || usersData.data?.length || 0,
          consultations: consultationsData.data?.length || 0,
          products: productsData.data?.length || 0,
          soilAnalyses: soilAnalysesData.count || soilAnalysesData.data?.length || 0,
        });

        setStats({
          users: usersData.count || usersData.data?.length || 0,
          consultations: consultationsData.data?.length || 0,
          products: productsData.data?.length || 0,
          soilAnalyses: soilAnalysesData.count || soilAnalysesData.data?.length || 0,
        });
        
        setError(null);
      } catch (error) {
        console.error('[v0] Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Consultations',
      value: stats.consultations,
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Soil Analyses',
      value: stats.soilAnalyses,
      icon: Sprout,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  if (error) {
    return (
      <div className="mb-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600 text-center">Failed to load statistics: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
