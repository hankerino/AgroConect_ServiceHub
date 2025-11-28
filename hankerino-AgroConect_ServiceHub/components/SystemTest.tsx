import React, { useState, useEffect } from 'react';
import { RefreshCw, User, Database, Cpu, XCircle, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { MOCK_TEST_RESULTS } from '../constants';
import { checkConnection, isSupabaseConfigured } from '../supabaseClient';
import { Language } from '../types';

interface SystemTestProps {
  language: Language['code'];
}

export const SystemTest: React.FC<SystemTestProps> = ({ language }) => {
  const [isCheckingDb, setIsCheckingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<'success' | 'failure' | 'pending' | 'idle' | 'warning'>('idle');
  const [dbMessage, setDbMessage] = useState('Waiting to check...');

  useEffect(() => {
      runDbCheck();
  }, []);

  const runDbCheck = async () => {
    setIsCheckingDb(true);
    setDbStatus('pending');
    setDbMessage('Verifying configuration...');

    setTimeout(async () => {
        if (!isSupabaseConfigured()) {
            setDbStatus('warning');
            setDbMessage('No credentials found. Configure in Data Sources.');
            setIsCheckingDb(false);
            return;
        }

        const isConnected = await checkConnection();
        if (isConnected) {
            setDbStatus('success');
            setDbMessage('Supabase connection verified.');
        } else {
            setDbStatus('failure');
            setDbMessage('Failed to connect. Check credentials.');
        }
        setIsCheckingDb(false);
    }, 800);
  };

  const handleRerunAll = () => {
    runDbCheck();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900">System Feature Test</h2>
        </div>
        <button
            onClick={handleRerunAll}
            disabled={isCheckingDb}
            className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg font-medium shadow-md hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
            <RefreshCw size={18} className={`mr-2 ${isCheckingDb ? 'animate-spin' : ''}`} /> Rerun All Tests
        </button>
      </div>

      <div className="space-y-6">
        {/* User Auth */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                <User size={24} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">User Authentication</h3>
            </div>
            <div className="p-6 bg-gray-50/50">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg text-emerald-700 font-medium">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                    Logged in as: henryquinones101@gmail.com
                </div>
            </div>
        </div>

        {/* AI Model Connection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                <Cpu size={24} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">AI Model (Ollama) Connection</h3>
            </div>
            <div className="p-6 bg-gray-50/50">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-700 font-bold mb-4">
                    <XCircle size={24} className="text-red-500" />
                    Connection failed.
                </div>
                <div className="bg-gray-100 rounded-lg p-4 font-mono text-sm text-gray-600">
                    Failed to connect. Error: Request failed with status code 500.
                </div>
            </div>
        </div>

        {/* Database Connection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                <Database size={24} className="text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">Supabase Database Connection</h3>
            </div>
            <div className="p-6 bg-gray-50/50">
                {dbStatus === 'pending' ? (
                     <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg text-blue-700 font-medium">
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                        Verifying connection...
                     </div>
                ) : dbStatus === 'warning' ? (
                     <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg text-yellow-700 font-medium">
                        <AlertTriangle size={24} className="text-yellow-500" />
                        {dbMessage}
                     </div>
                ) : dbStatus === 'failure' ? (
                     <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-700 font-medium">
                        <XCircle size={24} className="text-red-500" />
                        {dbMessage}
                     </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg text-emerald-700 font-medium">
                        <CheckCircle2 size={24} className="text-emerald-500" />
                        {dbMessage}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};