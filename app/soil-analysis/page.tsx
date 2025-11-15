'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sprout, FileText } from 'lucide-react';
import { Header } from '@/components/Header';

export default function SoilAnalysisPage() {
  const [analyses, setAnalyses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('/api/soil-analyses');
        const data = await response.json();
        setAnalyses(data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching soil analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Soil Analysis</h1>
          <p className="text-gray-600">AI-powered soil health assessments</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyses.map((analysis: any) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-600" />
                    Analysis #{analysis.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {analysis.location && (
                      <p className="text-sm text-gray-600">Location: {analysis.location}</p>
                    )}
                    {analysis.created_at && (
                      <p className="text-sm text-gray-600">
                        Date: {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    )}
                    {analysis.status && (
                      <p className="text-sm">
                        Status: <span className="font-semibold text-emerald-600">{analysis.status}</span>
                      </p>
                    )}
                  </div>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Sprout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analyses Yet</h3>
              <p className="text-gray-500 mb-4">Start your first soil analysis to get detailed insights.</p>
              <Button>
                <Sprout className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
