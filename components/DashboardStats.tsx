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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [consultationsRes, productsRes] = await Promise.all([
          fetch('/api/consultations'),
          fetch('/api/products'),
        ]);

        const consultationsData = await consultationsRes.json();
        const productsData = await productsRes.json();

        setStats({
          users: 1247,
          consultations: consultationsData.data?.length || 0,
          products: productsData.data?.length || 0,
          soilAnalyses: 89,
        });
      } catch (error) {
        console.error('[v0] Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
