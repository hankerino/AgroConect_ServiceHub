'use client';

import { useState, useEffect } from 'react';
import { Database, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DataSourcesPage() {
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDataSources() {
      try {
        const response = await fetch('/api/data-sources');
        const result = await response.json();
        
        if (result.error) {
          setError(result.error);
        } else {
          setDataSources(result.data || []);
        }
      } catch (err) {
        setError('Failed to load data sources');
      } finally {
        setLoading(false);
      }
    }

    fetchDataSources();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Data Sources</h1>
          <p className="text-muted-foreground">
            Manage and monitor all data sources connected to AgroConect
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && dataSources.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No data sources configured yet</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dataSources.map((source) => (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Database className="h-8 w-8 text-green-600" />
                  <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                    {source.status || 'active'}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{source.name}</CardTitle>
                <CardDescription>{source.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {source.description && (
                    <p className="text-muted-foreground">{source.description}</p>
                  )}
                  {source.last_sync && (
                    <p className="text-xs text-muted-foreground">
                      Last sync: {new Date(source.last_sync).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
