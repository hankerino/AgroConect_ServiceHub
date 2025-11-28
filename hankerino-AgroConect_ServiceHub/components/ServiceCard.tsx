import React from 'react';
import { ServiceItem, Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  item: ServiceItem;
  onClick: () => void;
  language: Language['code'];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item, onClick, language }) => {
  const Icon = item.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-100 flex flex-col h-full"
    >
      <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5 shadow-sm group-hover:scale-105 transition-transform duration-200`}>
        <Icon size={26} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">{item.title}</h3>
        <p className="text-sm text-gray-500 font-medium">{item.subtitle}</p>
      </div>

      <div className="mt-6 flex items-center text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
        Open <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};