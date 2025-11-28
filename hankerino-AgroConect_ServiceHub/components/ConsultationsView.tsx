import React from 'react';
import { MOCK_CONSULTANTS } from '../constants';
import { Star, Video, MessageSquare } from 'lucide-react';
import { ViewState } from '../types';

interface ConsultationsViewProps {
  onNavigate?: (view: ViewState) => void;
}

export const ConsultationsView: React.FC<ConsultationsViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">Expert Consultations</h2>
           <p className="text-gray-600 mt-1">Connect with top agronomists and specialists for personalized advice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CONSULTANTS.map((consultant) => (
          <div
            key={consultant.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onNavigate && onNavigate(ViewState.EXPERT_DETAIL)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold">
                {consultant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                <p className="text-sm text-gray-500">{consultant.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{consultant.rating}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate</span>
                <span className="font-bold text-gray-900">R$ {consultant.rate}/hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Availability</span>
                <span className="text-emerald-600 font-medium">{consultant.availability}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate(ViewState.EXPERT_DETAIL); }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Video size={16} /> Book
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate(ViewState.EXPERT_DETAIL); }}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={16} /> Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};