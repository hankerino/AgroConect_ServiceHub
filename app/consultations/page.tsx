'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User } from 'lucide-react';
import { Header } from '@/components/Header';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch('/api/consultations');
        const data = await response.json();
        setConsultations(data.data || []);
      } catch (error) {
        console.error('[v0] Error fetching consultations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultations</h1>
          <p className="text-gray-600">Connect with agricultural experts</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : consultations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map((consultation: any) => (
              <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    {consultation.title || 'Consultation'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {consultation.expert_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {consultation.expert_name}
                      </div>
                    )}
                    {consultation.created_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Consultations Yet</h3>
              <p className="text-gray-500">Consultations will appear here once they are scheduled.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
