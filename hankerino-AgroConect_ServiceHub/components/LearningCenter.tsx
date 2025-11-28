import React from 'react';
import { Search, BookOpen, Clock, User } from 'lucide-react';
import { MOCK_LEARNING_RESOURCES } from '../constants';
import { Language } from '../types';

interface LearningCenterProps {
  language: Language['code'];
}

export const LearningCenter: React.FC<LearningCenterProps> = ({ language }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center md:text-left md:flex md:items-end md:justify-between">
         <div>
             <h2 className="text-3xl font-bold text-gray-900">Learning Center</h2>
             <p className="text-gray-600 text-lg mt-2">Technical resources for precision agriculture</p>
         </div>
         <div className="hidden md:block opacity-20">
             <BookOpen size={64} className="text-[#10b981]" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent bg-white shadow-sm"
              />
          </div>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] bg-white shadow-sm text-gray-700">
              <option>All Categories</option>
              <option>Sensors</option>
              <option>Remote Sensing</option>
              <option>Drones</option>
          </select>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10b981] bg-white shadow-sm text-gray-700">
              <option>All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
          </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LEARNING_RESOURCES.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex gap-2 mb-4">
                      {resource.tags.map((tag, idx) => (
                          <span key={idx} className={`text-xs font-bold px-3 py-1 rounded-md ${tag.color}`}>
                              {tag.label}
                          </span>
                      ))}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {resource.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                      {resource.description}
                  </p>

                  <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                          <div className="flex items-center">
                              <Clock size={14} className="mr-1.5" />
                              {resource.duration}
                          </div>
                          <div className="flex items-center">
                              <User size={14} className="mr-1.5" />
                              {resource.author.split(' ')[0]}...
                          </div>
                      </div>

                      <button className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center">
                          <BookOpen size={16} className="mr-2" /> Read More
                      </button>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};