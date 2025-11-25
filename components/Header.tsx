'use client';

import { useState } from 'react';
import { Sprout, Menu, Home, TrendingUp, Users, BookOpen, ShoppingCart, Calendar, MessageSquare, Cloud, Leaf, X, Target, Database, DollarSign, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/data-sources', label: 'Data Sources', icon: Database },
    { href: '/market-prices', label: 'Market Prices', icon: DollarSign },
    { href: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/learning', label: 'Learning Center', icon: BookOpen },
    { href: '/consultations', label: 'Consultations', icon: Calendar },
    { href: '/community', label: 'Forum', icon: MessageSquare },
    { href: '/weather', label: 'Weather', icon: Cloud },
    { href: '/soil-analysis', label: 'Soil Analysis', icon: Leaf },
    { href: '/sensor-planner', label: 'Sensor Planner', icon: Target },
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgroConect</h1>
                <span className="text-xs text-emerald-100">ServiceHub</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm">
                <span className="text-sm font-medium">🌐 PT</span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-lg"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Sprout className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">Navigation</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all group"
                      >
                        <Icon className="h-5 w-5 text-emerald-600 group-hover:text-emerald-700" />
                        <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Menu Footer */}
              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  AgroConect ServiceHub © 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
