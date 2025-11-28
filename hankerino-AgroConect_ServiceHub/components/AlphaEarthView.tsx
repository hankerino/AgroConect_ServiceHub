import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Layers, Globe, Zap, Droplets, Thermometer, Radio, Wifi, RefreshCw, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { Language } from '../types';

interface AlphaEarthViewProps {
  language: Language['code'];
}

export const AlphaEarthView: React.FC<AlphaEarthViewProps> = ({ language }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);

  // Interactive State
  const [activeLayer, setActiveLayer] = useState<'visual' | 'moisture' | 'thermal' | 'vegetation' | 'radar'>('visual');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('Standby');
  const [dataLatency, setDataLatency] = useState(42);
  const [sensorReading, setSensorReading] = useState<string>('N/A');
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'alert', title: 'Drought Pattern Detected', time: '2m ago', desc: 'Satellite data indicates a 40% reduction in soil moisture for the Central-West region compared to historical averages.' },
    { id: 2, type: 'forecast', title: 'High Yield Probability', time: '1h ago', desc: 'NDVI analysis suggests optimal vegetative growth in Sector A. Estimated yield increase: +12%.' }
  ]);

  // Function to generate mock readings based on layer
  const updateSensorReading = (layer: string) => {
      switch(layer) {
          case 'moisture': setSensorReading('Soil VWC: 0.18 m³/m³ (Low)'); break;
          case 'thermal': setSensorReading('Surface Temp: 34.2°C (+2.1°C)'); break;
          case 'vegetation': setSensorReading('NDVI Index: 0.78 (Healthy)'); break;
          case 'radar': setSensorReading('Backscatter: -12 dB'); break;
          default: setSensorReading('Optical Feed: Nominal'); break;
      }
  };

  // Map rendering logic
  const renderLayerData = useCallback((layer: string) => {
      if (!layerGroupRef.current || !window.L) return;

      // Clear existing layers
      layerGroupRef.current.clearLayers();
      updateSensorReading(layer);

      const center: [number, number] = [-16.4677, -54.6377];

      switch(layer) {
          case 'moisture':
              // Moisture map (Blue circles)
              window.L.circle(center, { radius: 1200, color: 'transparent', fillColor: '#3b82f6', fillOpacity: 0.5 }).addTo(layerGroupRef.current);
              window.L.circle([-16.45, -54.62], { radius: 800, color: 'transparent', fillColor: '#1d4ed8', fillOpacity: 0.6 }).addTo(layerGroupRef.current);
              window.L.circle([-16.48, -54.65], { radius: 600, color: 'transparent', fillColor: '#93c5fd', fillOpacity: 0.4 }).addTo(layerGroupRef.current);
              break;
          case 'thermal':
               // Thermal map (Red/Orange heatmaps)
              window.L.circle(center, { radius: 800, color: 'transparent', fillColor: '#ef4444', fillOpacity: 0.4 }).addTo(layerGroupRef.current);
              window.L.circle([-16.47, -54.65], { radius: 600, color: 'transparent', fillColor: '#f97316', fillOpacity: 0.6 }).addTo(layerGroupRef.current);
              break;
          case 'vegetation':
              // NDVI (Green)
              window.L.circle(center, { radius: 1500, color: 'transparent', fillColor: '#10b981', fillOpacity: 0.3 }).addTo(layerGroupRef.current);
              window.L.polygon([[-16.46, -54.64], [-16.46, -54.62], [-16.48, -54.62], [-16.48, -54.64]], { color: 'transparent', fillColor: '#059669', fillOpacity: 0.7 }).addTo(layerGroupRef.current);
              break;
          case 'radar':
              // Radar (Concentric circles with strokes)
              window.L.circle(center, { radius: 400, color: '#ec4899', weight: 2, fill: false }).addTo(layerGroupRef.current);
              window.L.circle(center, { radius: 900, color: '#ec4899', weight: 1, fill: false, opacity: 0.7 }).addTo(layerGroupRef.current);
              window.L.circle(center, { radius: 1600, color: '#ec4899', weight: 1, fill: false, opacity: 0.4 }).addTo(layerGroupRef.current);
              break;
          default:
              // Visual mode - just show a marker for the farm
              const marker = window.L.marker(center).addTo(layerGroupRef.current);
              marker.bindPopup("<b>Main Farm Hub</b><br>Status: Nominal").openPopup();
              break;
      }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainer.current && !mapInstance.current) {
      // Center on the mock farm location
      const center: [number, number] = [-16.4677, -54.6377];

      mapInstance.current = window.L.map(mapContainer.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(center, 13);

      // Add Esri World Imagery (Satellite)
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }).addTo(mapInstance.current);

      // Add a dark overlay to make data pop
      window.L.rectangle([[-90, -180], [90, 180]], {
          color: '#0f172a',
          fillColor: '#0f172a',
          fillOpacity: 0.5,
          weight: 0
      }).addTo(mapInstance.current);

      // Initialize Layer Group for dynamic content
      layerGroupRef.current = window.L.layerGroup().addTo(mapInstance.current);

      // Initial render call
      renderLayerData('visual');
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [renderLayerData]);

  // Update Map Layers when activeLayer changes
  useEffect(() => {
    if (mapInstance.current && layerGroupRef.current) {
        renderLayerData(activeLayer);
    }
  }, [activeLayer, renderLayerData]);

  const triggerAnalysis = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setSystemStatus('Initializing Scan...');

    // Simulate processing steps with visual feedback
    let progress = 0;
    const interval = setInterval(() => {
        progress += 15;
        setDataLatency(Math.floor(Math.random() * 50) + 20);

        if (progress > 20 && progress < 50) setSystemStatus('Acquiring Satellite Feed...');
        if (progress >= 50 && progress < 80) setSystemStatus('Processing Spectral Data...');
        if (progress >= 80) setSystemStatus('Finalizing Report...');

        if (progress >= 100) {
            clearInterval(interval);
            finishAnalysis();
        }
    }, 500);
  };

  const finishAnalysis = () => {
      setIsAnalyzing(false);
      setSystemStatus('Analysis Complete');

      // Generate new result based on current active layer
      const newAlertId = Date.now();
      let newAlert = null;

      if (activeLayer === 'moisture') {
          newAlert = { id: newAlertId, type: 'alert', title: 'Critical Dry Spot', time: 'Just now', desc: 'Soil moisture dropped below 12% in Sector C-4. Irrigation recommended.' };
      } else if (activeLayer === 'thermal') {
          newAlert = { id: newAlertId, type: 'alert', title: 'Thermal Spike', time: 'Just now', desc: 'Localized temperature increase detected. Possible machinery malfunction or pest outbreak.' };
      } else if (activeLayer === 'vegetation') {
          newAlert = { id: newAlertId, type: 'forecast', title: 'Yield Projection Updated', time: 'Just now', desc: 'Based on current biomass, yield projection increased by 2.5%.' };
      } else {
          newAlert = { id: newAlertId, type: 'alert', title: 'Perimeter Breach', time: 'Just now', desc: 'Radar detected unauthorized movement near the southern fence.' };
      }

      setAlerts(prev => [newAlert, ...prev]);

      // Map Effect: Fly to a random offset location to simulate finding something new
      if (mapInstance.current && window.L) {
          const latOffset = (Math.random() - 0.5) * 0.02;
          const lngOffset = (Math.random() - 0.5) * 0.02;
          const target: [number, number] = [-16.4677 + latOffset, -54.6377 + lngOffset];

          mapInstance.current.flyTo(target, 15, { duration: 2 });

          // Add temporary pulsing marker at detection site
          if (layerGroupRef.current) {
            const marker = window.L.circleMarker(target, {
                radius: 12,
                color: 'white',
                fillColor: activeLayer === 'thermal' ? '#ef4444' : '#10b981',
                fillOpacity: 1,
                className: 'animate-pulse'
            }).addTo(layerGroupRef.current);

            marker.bindPopup(`<b>${newAlert.title}</b><br>${newAlert.desc}`).openPopup();
          }
      }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             <Globe className="text-indigo-600" /> Alpha Earth
           </h2>
           <p className="text-gray-500 text-sm mt-1">Global Intelligence & Planetary Analytics</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={triggerAnalysis}
                disabled={isAnalyzing}
                className={`flex items-center px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all ${isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            >
                {isAnalyzing ? (
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                    <Zap size={16} className="mr-2" />
                )}
                {isAnalyzing ? 'Scanning...' : 'Live Analysis'}
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
         {/* Map Container */}
         <div className="lg:col-span-3 bg-gray-900 rounded-2xl shadow-xl overflow-hidden relative border border-gray-800 group">
             {typeof window !== 'undefined' && !window.L && (
                 <div className="absolute inset-0 flex items-center justify-center text-indigo-400 bg-gray-900 z-50">
                    Initializing Satellite Uplink...
                 </div>
             )}
             <div ref={mapContainer} className="w-full h-full z-0 opacity-90 transition-opacity duration-700" />

             {/* Scanning Overlay Effect */}
             {isAnalyzing && (
                 <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none z-[300] overflow-hidden">
                     <div className="w-full h-1 bg-indigo-400/50 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                 </div>
             )}

             {/* HUD Overlay */}
             <div className="absolute top-6 left-6 z-[400] bg-black/60 backdrop-blur-md text-white p-4 rounded-xl border border-white/10 min-w-[200px] transition-all hover:bg-black/70 shadow-2xl">
                 <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3 flex items-center justify-between gap-4">
                     System Status
                     <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-yellow-400 animate-ping' : 'bg-emerald-500'}`}></div>
                 </h4>
                 <div className="flex items-center gap-3 mb-2">
                    <Globe size={14} className="text-indigo-400" />
                    <span className="text-sm font-medium">{systemStatus}</span>
                 </div>
                 <div className="flex items-center gap-3 mb-3">
                    <Wifi size={14} className={dataLatency > 50 ? 'text-yellow-400' : 'text-emerald-400'} />
                    <span className="text-sm font-medium">Latency: {dataLatency}ms</span>
                 </div>

                 <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-indigo-200 mb-1">
                        <Activity size={12} />
                        <span className="text-[10px] uppercase font-bold">Sensor Reading</span>
                    </div>
                    <p className="text-sm font-mono font-bold text-white">{sensorReading}</p>
                 </div>
             </div>

             {/* Layer Controls */}
             <div className="absolute bottom-6 left-6 right-6 z-[400] flex justify-center gap-4">
                 <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 border border-white/10 text-gray-300 shadow-2xl">
                     <button
                        onClick={() => setActiveLayer('moisture')}
                        className={`flex flex-col items-center gap-1 transition-all transform hover:scale-110 ${activeLayer === 'moisture' ? 'text-blue-400 scale-110' : 'hover:text-white'}`}
                     >
                        <Droplets size={18} />
                        <span className="text-[10px] font-bold uppercase">Moisture</span>
                     </button>
                     <div className="w-px h-6 bg-white/20"></div>
                     <button
                        onClick={() => setActiveLayer('thermal')}
                        className={`flex flex-col items-center gap-1 transition-all transform hover:scale-110 ${activeLayer === 'thermal' ? 'text-orange-400 scale-110' : 'hover:text-white'}`}
                     >
                        <Thermometer size={18} />
                        <span className="text-[10px] font-bold uppercase">Thermal</span>
                     </button>
                     <div className="w-px h-6 bg-white/20"></div>
                     <button
                        onClick={() => setActiveLayer('vegetation')}
                        className={`flex flex-col items-center gap-1 transition-all transform hover:scale-110 ${activeLayer === 'vegetation' ? 'text-emerald-400 scale-110' : 'hover:text-white'}`}
                     >
                        <Layers size={18} />
                        <span className="text-[10px] font-bold uppercase">Vegetation</span>
                     </button>
                     <div className="w-px h-6 bg-white/20"></div>
                     <button
                        onClick={() => setActiveLayer('radar')}
                        className={`flex flex-col items-center gap-1 transition-all transform hover:scale-110 ${activeLayer === 'radar' ? 'text-pink-400 scale-110' : 'hover:text-white'}`}
                     >
                        <Radio size={18} />
                        <span className="text-[10px] font-bold uppercase">Radar</span>
                     </button>
                 </div>
             </div>
         </div>

         {/* Intelligence Sidebar */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col overflow-y-auto h-full">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <Zap size={18} className="text-yellow-500" />
                 Planetary Insights
             </h3>

             <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-xl border animate-in slide-in-from-right duration-300 ${alert.type === 'alert' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-bold uppercase flex items-center gap-1 ${alert.type === 'alert' ? 'text-red-600' : 'text-emerald-600'}`}>
                                {alert.type === 'alert' ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                                {alert.type === 'alert' ? 'Alert' : 'Forecast'}
                            </span>
                            <span className="text-[10px] text-gray-400">{alert.time}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{alert.title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            {alert.desc}
                        </p>
                    </div>
                ))}
             </div>

             <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Global Indices</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Global Soy Index</span>
                        <span className="text-sm font-bold text-green-600">+2.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Ocean Nino Index</span>
                        <span className="text-sm font-bold text-red-500">+1.2°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carbon Capture</span>
                        <span className="text-sm font-bold text-indigo-600">940t</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
      <style>{`
        @keyframes scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};