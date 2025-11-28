import React, { useState, useEffect } from 'react';
import { Database, Cloud, Wifi, CheckCircle2, RefreshCw, Server, Settings, LogOut, Save } from 'lucide-react';
import { configureSupabase, disconnectSupabase, isSupabaseConfigured, checkConnection } from '../supabaseClient';

export const DataSourcesView: React.FC = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);
    if (configured) {
        checkStatus();
    } else {
        setIsEditing(true);
    }
  }, []);

  const checkStatus = async () => {
      setLoading(true);
      const status = await checkConnection();
      setIsConnected(status);
      setLoading(false);
  };

  const handleSave = async () => {
      if (!url || !key) return;
      setLoading(true);
      const success = configureSupabase(url, key);
      if (success) {
          setIsConfigured(true);
          setIsEditing(false);
          await checkStatus();
      }
      setLoading(false);
  };

  const handleDisconnect = () => {
      disconnectSupabase();
      setIsConfigured(false);
      setIsConnected(false);
      setIsEditing(true);
      setUrl('');
      setKey('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-center">
         <div>
             <h2 className="text-3xl font-bold text-gray-900">Data Sources</h2>
             <p className="text-gray-600 mt-1">Manage connected APIs and data integrations.</p>
         </div>
         <button
            onClick={() => checkStatus()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
         >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Sync All
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Supabase Database - Configurable */}
         <div className={`rounded-xl shadow-sm border p-6 relative overflow-hidden transition-all ${isConfigured ? 'bg-white border-gray-100' : 'bg-gray-50 border-dashed border-gray-300'}`}>
             <div className="absolute top-0 right-0 p-4">
                {isConfigured && (
                    <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle2 size={12} /> {isConnected ? 'Connected' : 'Error'}
                    </div>
                )}
             </div>

             <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isConfigured ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                    <Server size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Supabase Database</h3>
                    <p className="text-sm text-gray-500">PostgreSQL + Realtime</p>
                </div>
             </div>

             {isEditing ? (
                 <div className="space-y-3 mt-4 animate-in fade-in">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project URL</label>
                         <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://xyz.supabase.co"
                            className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anon / Public Key</label>
                         <input
                            type="password"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            placeholder="eyJhbGci..."
                            className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                         />
                     </div>
                     <div className="flex gap-2 pt-2">
                         <button
                            onClick={handleSave}
                            disabled={!url || !key || loading}
                            className="flex-1 bg-[#10b981] text-white text-sm font-bold py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
                         >
                             {loading ? <RefreshCw size={14} className="animate-spin"/> : <Save size={14} />} Connect
                         </button>
                         {isConfigured && (
                             <button onClick={() => setIsEditing(false)} className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
                         )}
                     </div>
                 </div>
             ) : (
                 <div className="space-y-4">
                     <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded break-all">
                        URL: {localStorage.getItem('agro_sb_url')?.substring(0, 20)}...<br/>
                        Status: {isConnected ? 'Healthy' : 'Unreachable'}
                     </div>
                     <div className="flex gap-2">
                         <button
                            onClick={() => setIsEditing(true)}
                            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                         >
                            <Settings size={14} /> Configure
                         </button>
                         <button
                            onClick={handleDisconnect}
                            className="flex items-center justify-center px-3 border border-red-100 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                         >
                            <LogOut size={14} />
                         </button>
                     </div>
                 </div>
             )}
         </div>

         {/* Weather API */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                   <CheckCircle2 size={12} /> Active
                </div>
             </div>
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Cloud size={24} />
             </div>
             <h3 className="font-bold text-gray-900">OpenWeatherMap</h3>
             <p className="text-sm text-gray-500 mb-4">Real-time weather data provider</p>
             <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                Last sync: 2 mins ago<br/>
                Latency: 45ms
             </div>
         </div>

         {/* Market Data */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                   <CheckCircle2 size={12} /> Active
                </div>
             </div>
             <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <Database size={24} />
             </div>
             <h3 className="font-bold text-gray-900">Commodity Prices API</h3>
             <p className="text-sm text-gray-500 mb-4">Live market feeds from B3</p>
             <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                Last sync: 30 secs ago<br/>
                Latency: 120ms
             </div>
         </div>

         {/* IoT Hub */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                   <CheckCircle2 size={12} /> Active
                </div>
             </div>
             <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Wifi size={24} />
             </div>
             <h3 className="font-bold text-gray-900">LoRaWAN Gateway</h3>
             <p className="text-sm text-gray-500 mb-4">Local sensor network hub</p>
             <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                Status: Online<br/>
                Devices: 9/12 connected
             </div>
         </div>
      </div>
    </div>
  );
};