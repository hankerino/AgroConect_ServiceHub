'use client';

import { Sprout, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Sprout className="h-6 w-6" />
            <h1 className="text-xl font-semibold">AgroConect</h1>
            <span className="text-sm text-green-100">ServiceHub</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
              <span className="text-sm font-medium">🌐 PT</span>
            </button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
