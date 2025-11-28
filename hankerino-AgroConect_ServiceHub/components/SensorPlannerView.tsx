import React, { useState } from 'react';
import { Map, Plus, Ruler, MousePointer2 } from 'lucide-react';

export const SensorPlannerView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'select' | 'add' | 'measure'>('select');

  const handleSave = () => {
      alert("Draft plan saved successfully.");
  };

  const handleDeploy = () => {
      const confirm = window.confirm("Are you sure you want to deploy this configuration to the field team?");
      if (confirm) {
          alert("Deployment orders sent!");
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <div>
             <h2 className="text-3xl font-bold text-gray-900">Sensor Planner</h2>
             <p className="text-gray-600 mt-1">Design your IoT network coverage.</p>
         </div>
         <div className="flex gap-2">
           <button onClick={handleSave} className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 shadow-sm hover:bg-gray-50">Save Draft</button>
           <button onClick={handleDeploy} className="px-4 py-2 bg-[#10b981] text-white rounded-lg font-medium shadow-sm hover:bg-emerald-600">Deploy Config</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-4">Tools</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTool('select')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium border transition-colors ${activeTool === 'select' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-gray-700 border-transparent hover:bg-gray-50'}`}
            >
               <MousePointer2 size={18} /> Select
            </button>
            <button
              onClick={() => setActiveTool('add')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium border transition-colors ${activeTool === 'add' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-gray-700 border-transparent hover:bg-gray-50'}`}
            >
               <Plus size={18} /> Add Node
            </button>
            <button
              onClick={() => setActiveTool('measure')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium border transition-colors ${activeTool === 'measure' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'text-gray-700 border-transparent hover:bg-gray-50'}`}
            >
               <Ruler size={18} /> Measure Range
            </button>
          </div>

          <h3 className="font-bold text-gray-900 mt-6 mb-4">Available Devices</h3>
          <div className="space-y-3 overflow-y-auto flex-1">
             <div className="p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white group">
                <p className="font-bold text-sm text-gray-800 group-hover:text-emerald-600">DIRTS Sensor</p>
                <p className="text-xs text-gray-500">Soil degradable</p>
             </div>
             <div className="p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white group">
                <p className="font-bold text-sm text-gray-800 group-hover:text-emerald-600">Weather Station</p>
                <p className="text-xs text-gray-500">Solar powered</p>
             </div>
             <div className="p-3 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white group">
                <p className="font-bold text-sm text-gray-800 group-hover:text-emerald-600">Gateway</p>
                <p className="text-xs text-gray-500">LoRaWAN Hub</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-gray-100 rounded-xl border border-gray-200 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-10">
               {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className="border border-gray-400"></div>
               ))}
            </div>
            <p className="text-gray-400 font-medium flex items-center gap-2">
               <Map size={24} /> Interactive Map Area (Click to place)
            </p>

            {/* Mock placed sensors */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform"></div>
            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform flex items-center justify-center text-white text-[10px] font-bold">GW</div>
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform"></div>

            {/* Mock Range Circle */}
            <div className="absolute top-1/2 left-1/2 w-64 h-64 border-2 border-blue-500/30 bg-blue-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};