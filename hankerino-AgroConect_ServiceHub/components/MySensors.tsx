import React, { useState } from 'react';
import { Plus, BarChart3, Camera, Droplets, Cloud, Zap, FlaskConical, MapPin, Calendar } from 'lucide-react';
import { MOCK_SENSORS } from '../constants';
import { Language, SensorItem } from '../types';

interface MySensorsProps {
  language: Language['code'];
}

export const MySensors: React.FC<MySensorsProps> = ({ language }) => {
  const [sensors, setSensors] = useState<SensorItem[]>(MOCK_SENSORS);

  const getIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart3 size={24} className="text-gray-400" />;
      case 'camera': return <Camera size={24} className="text-gray-400" />;
      case 'water': return <Droplets size={24} className="text-blue-400" />;
      case 'cloud': return <Cloud size={24} className="text-gray-400" />;
      case 'lightning': return <Zap size={24} className="text-yellow-400" />;
      case 'chemistry': return <FlaskConical size={24} className="text-purple-400" />;
      default: return <BarChart3 size={24} className="text-gray-400" />;
    }
  };

  const handleAddSensor = () => {
      const name = prompt("Enter Sensor Name (e.g., North Field Moisture):");
      if (!name) return;

      const newSensor: SensorItem = {
          id: Date.now().toString(),
          name: name,
          type: 'Generic Sensor',
          installedDate: new Date().toLocaleDateString(),
          status: 'active',
          iconType: 'chart',
          location: 'Main Farm'
      };

      setSensors([newSensor, ...sensors]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">My Sensors</h2>
           <p className="text-gray-600 text-base mt-1">Manage the sensors installed on your property.</p>
        </div>
        <button
            onClick={handleAddSensor}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium shadow-md hover:bg-gray-800 transition-colors"
        >
            <Plus size={18} className="mr-2" /> Add Sensor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center gap-3">
                 {getIcon(sensor.iconType)}
                 <h3 className="text-lg font-bold text-gray-900">{sensor.name}</h3>
               </div>
               <div className={`h-2 w-2 rounded-full ${sensor.status === 'active' ? 'bg-green-500' : sensor.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            </div>

            <div className="space-y-4">
               <div className="text-sm text-gray-500">
                 <span className="block">Sensor ID: <span className="font-mono text-gray-800">{sensor.id.substring(0,8)}</span></span>
               </div>

               <div className="flex items-center text-sm text-gray-600">
                 <MapPin size={16} className="mr-2" />
                 {sensor.location || 'Unknown Location'}
               </div>

               <div className="flex items-center text-sm text-gray-600">
                 <Calendar size={16} className="mr-2" />
                 Installed on: {sensor.installedDate}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};