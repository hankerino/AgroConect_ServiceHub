import React, { useState } from 'react';
import { EnhancedGeoMap } from './EnhancedGeoMap';
import { Layers, Locate, Plus, Settings } from 'lucide-react';
import { Language } from '../types';

interface GeospatialViewProps {
  language: Language['code'];
}

export const GeospatialView: React.FC<GeospatialViewProps> = ({ language }) => {
  const [layerType, setLayerType] = useState<'satellite' | 'street'>('street');

  const handleAddField = () => {
      alert("Click on map points to draw a new field boundary. (Simulation mode enabled)");
  };

  const handleToggleLayers = () => {
      setLayerType(prev => prev === 'street' ? 'satellite' : 'street');
      // Note: In a real app, this state would be passed to EnhancedGeoMap to change tile layers
      alert(`Switched to ${layerType === 'street' ? 'Satellite' : 'Street'} view.`);
  };

  const handleLocate = () => {
      // Reload map component to center
      // In real app, use a ref to map instance to call .flyTo()
      alert("Recentering map on farm location...");
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Geospatial Maps</h2>
           <p className="text-gray-500 text-sm mt-1">Real-time field monitoring and sensor distribution</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={handleToggleLayers}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm"
            >
                <Layers size={16} className="mr-2" /> {layerType === 'street' ? 'Satellite' : 'Street'}
            </button>
            <button
                onClick={handleAddField}
                className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg text-sm font-medium hover:bg-emerald-600 shadow-sm"
            >
                <Plus size={16} className="mr-2" /> Add Field
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
         {/* Map Container */}
         <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-1 min-h-[500px] lg:min-h-0 relative">
             <EnhancedGeoMap />

             {/* Floating Action Button for Location */}
             <button
                onClick={handleLocate}
                className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md z-[400] text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
             >
                <Locate size={20} />
             </button>
         </div>

         {/* Sidebar Controls */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col overflow-y-auto">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
                Field Overview
                <Settings size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
             </h3>

             <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <p className="text-xs text-emerald-600 font-medium">Total Area</p>
                      <p className="text-xl font-bold text-emerald-800">1,240 <span className="text-xs font-normal">ha</span></p>
                   </div>
                   <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium">Sensors</p>
                      <p className="text-xl font-bold text-blue-800">9 <span className="text-xs font-normal">active</span></p>
                   </div>
                </div>

                {/* Fields List */}
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Fields</h4>
                   <div className="space-y-3">
                      <div className="p-3 border border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition-colors bg-white shadow-sm">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800 text-sm">Sector A</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Healthy</span>
                         </div>
                         <p className="text-xs text-gray-500">Soybean • 450 ha</p>
                         <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                         </div>
                         <p className="text-[10px] text-gray-400 mt-1 text-right">85% Growth</p>
                      </div>

                      <div className="p-3 border border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition-colors bg-white shadow-sm">
                         <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-gray-800 text-sm">Sector B</span>
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Harvest</span>
                         </div>
                         <p className="text-xs text-gray-500">Corn • 320 ha</p>
                         <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                         </div>
                         <p className="text-[10px] text-gray-400 mt-1 text-right">Ready</p>
                      </div>
                   </div>
                </div>

                {/* Alerts */}
                <div>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Alerts</h4>
                   <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-3 items-start">
                       <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                       <div>
                          <p className="text-xs font-bold text-gray-800">Low Moisture Alert</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Sector C • Sensor #8</p>
                       </div>
                   </div>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};