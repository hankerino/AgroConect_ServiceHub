import React, { useState } from 'react';
import { CloudSun, CloudRain, Sun, Wind, Droplets, MapPin, CalendarDays } from 'lucide-react';
import { Language } from '../types';

interface WeatherViewProps {
  language: Language['code'];
}

export const WeatherView: React.FC<WeatherViewProps> = ({ language }) => {
  const [location, setLocation] = useState('Rondonópolis, MT');
  const [temp, setTemp] = useState(28);

  const handleChangeLocation = () => {
      const newLoc = prompt("Enter new city name:", location);
      if (newLoc && newLoc.trim() !== "") {
          setLocation(newLoc);
          // Simulate data change
          setTemp(Math.floor(Math.random() * 15) + 20);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <div>
             <h2 className="text-2xl font-bold text-gray-900">Weather Forecast</h2>
             <p className="text-gray-500 text-sm mt-1">Farm Location: {location}</p>
         </div>
         <button
            onClick={handleChangeLocation}
            className="flex items-center text-[#10b981] font-medium bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
         >
             <MapPin size={18} className="mr-2" /> Change Location
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather Card */}
        <div className="bg-gradient-to-br from-[#06b6d4] to-[#0891b2] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-80">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-cyan-100 font-medium text-lg">Now</h3>
                    <p className="text-5xl font-bold mt-2">{temp}°C</p>
                    <p className="text-cyan-50 font-medium mt-1">Partly Cloudy</p>
                </div>
                <CloudSun size={64} className="text-cyan-100 opacity-80" />
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center">
                    <Wind size={20} className="mr-3 text-cyan-200" />
                    <div>
                        <p className="text-xs text-cyan-200">Wind</p>
                        <p className="font-bold">12 km/h</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center">
                    <Droplets size={20} className="mr-3 text-cyan-200" />
                    <div>
                        <p className="text-xs text-cyan-200">Humidity</p>
                        <p className="font-bold">65%</p>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>

        {/* 5 Day Forecast */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                 <CalendarDays size={20} className="mr-2 text-gray-400" /> 5-Day Forecast
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                 {[
                     { day: 'Tomorrow', temp: `${temp + 1}°`, icon: CloudRain, color: 'text-blue-500', rain: '60%' },
                     { day: 'Wed', temp: `${temp - 1}°`, icon: CloudRain, color: 'text-blue-500', rain: '80%' },
                     { day: 'Thu', temp: `${temp + 2}°`, icon: CloudSun, color: 'text-orange-400', rain: '20%' },
                     { day: 'Fri', temp: `${temp + 4}°`, icon: Sun, color: 'text-yellow-500', rain: '0%' },
                     { day: 'Sat', temp: `${temp + 3}°`, icon: CloudSun, color: 'text-orange-400', rain: '10%' },
                 ].map((d, i) => (
                     <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-default">
                         <p className="text-gray-500 font-medium text-sm mb-3">{d.day}</p>
                         <d.icon size={32} className={`mb-3 ${d.color}`} />
                         <p className="text-gray-900 font-bold text-xl">{d.temp}</p>
                         <p className="text-xs text-blue-500 font-medium mt-1">{d.rain} rain</p>
                     </div>
                 ))}
             </div>
        </div>
      </div>

      {/* Spraying Conditions Advisory */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <Wind size={24} />
          </div>
          <div>
              <h4 className="font-bold text-gray-900">Spraying Conditions: Good</h4>
              <p className="text-gray-600 text-sm mt-1">
                  Wind speed is optimal for spraying. Humidity is slightly high, but acceptable. Recommend spraying before 10 AM to avoid peak heat.
              </p>
          </div>
      </div>
    </div>
  );
};