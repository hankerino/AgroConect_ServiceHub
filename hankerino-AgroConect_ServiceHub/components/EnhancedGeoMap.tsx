import React, { useEffect, useRef } from 'react';
import { MOCK_SENSORS } from '../constants';
import { SensorItem } from '../types';

declare global {
  interface Window {
    L: any;
  }
}

export const EnhancedGeoMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainer.current && !mapInstance.current) {
      // Initialize map centered on the first sensor or a default location (Rondonópolis, MT)
      const center: [number, number] = [-16.4677, -54.6377];

      mapInstance.current = window.L.map(mapContainer.current).setView(center, 14);

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      // Add field polygons (mock data)
      const fieldStyle = {
        color: '#10b981',
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.2
      };

      // Mock Field Polygon 1 (Sector A)
      const polygon1 = window.L.polygon([
        [-16.464, -54.638],
        [-16.464, -54.634],
        [-16.468, -54.634],
        [-16.468, -54.638]
      ], fieldStyle).addTo(mapInstance.current);
      polygon1.bindPopup("<b>Sector A</b><br>Soybean - Planting Phase");

      // Mock Field Polygon 2 (Sector B)
      const polygon2 = window.L.polygon([
        [-16.470, -54.638],
        [-16.470, -54.632],
        [-16.474, -54.632],
        [-16.474, -54.638]
      ], { ...fieldStyle, color: '#f59e0b' }).addTo(mapInstance.current);
      polygon2.bindPopup("<b>Sector B</b><br>Corn - Harvest Phase");

      // Add markers for sensors
      MOCK_SENSORS.forEach((sensor: SensorItem) => {
        if (sensor.coords) {
          const markerColor = sensor.status === 'active' ? '#10b981' : sensor.status === 'warning' ? '#f59e0b' : '#ef4444';

          // Custom marker icon (simple circle)
          const customIcon = window.L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          const marker = window.L.marker(sensor.coords, { icon: customIcon }).addTo(mapInstance.current);

          marker.bindPopup(`
            <div class="font-sans">
              <h3 class="font-bold text-gray-900">${sensor.name}</h3>
              <p class="text-xs text-gray-500">${sensor.type}</p>
              <div class="mt-2 text-xs">
                <span class="font-semibold">Status:</span>
                <span class="${sensor.status === 'active' ? 'text-green-600' : 'text-red-600'} capitalize">${sensor.status}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Installed: ${sensor.installedDate}</p>
            </div>
          `);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative bg-gray-100">
      {typeof window !== 'undefined' && !window.L && (
         <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            Loading Map...
         </div>
      )}
      <div ref={mapContainer} className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[400] text-xs">
         <h4 className="font-bold text-gray-800 mb-2">Legend</h4>
         <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#10b981] border border-white shadow-sm"></div>
            <span>Active Sensor</span>
         </div>
         <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-white shadow-sm"></div>
            <span>Warning</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444] border border-white shadow-sm"></div>
            <span>Inactive</span>
         </div>
         <div className="mt-2 pt-2 border-t border-gray-100">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-[#10b981] opacity-60"></div>
                <span>Soybean</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#f59e0b] opacity-60"></div>
                <span>Corn</span>
             </div>
         </div>
      </div>
    </div>
  );
};