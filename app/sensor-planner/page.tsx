'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Target, Undo, Trash2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dynamically import map component to avoid SSR issues
const SensorMap = dynamic(() => import('@/components/SensorMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p>Loading map...</p>
    </div>
  ),
});

interface SavedPlan {
  id: string;
  name: string;
  area: number;
  sensorCount: number;
  createdAt: string;
  coordinates: any[];
}

export default function SensorPlannerPage() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [sensorRecommendation, setSensorRecommendation] = useState(0);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [drawnShapes, setDrawnShapes] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved plans from localStorage
    const saved = localStorage.getItem('sensorPlans');
    if (saved) {
      setSavedPlans(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Calculate sensor recommendation (1 sensor per 2 hectares)
    const sensors = Math.ceil(calculatedArea / 2);
    setSensorRecommendation(sensors);
  }, [calculatedArea]);

  const handleStartDrawing = () => {
    setIsDrawing(!isDrawing);
  };

  const handleAreaCalculated = (area: number, shapes: any[]) => {
    setCalculatedArea(area);
    setDrawnShapes(shapes);
  };

  const handleUndo = () => {
    console.log('[v0] Undo last drawing action');
    // This will be handled by the map component
  };

  const handleClear = () => {
    console.log('[v0] Clearing all drawings');
    setCalculatedArea(0);
    setDrawnShapes([]);
    setSensorRecommendation(0);
  };

  const handleSavePlan = () => {
    if (calculatedArea === 0) {
      toast({
        title: 'No area drawn',
        description: 'Please draw an area on the map before saving.',
        variant: 'destructive',
      });
      return;
    }

    const newPlan: SavedPlan = {
      id: Date.now().toString(),
      name: `Plan ${new Date().toLocaleDateString()}`,
      area: calculatedArea,
      sensorCount: sensorRecommendation,
      createdAt: new Date().toISOString(),
      coordinates: drawnShapes,
    };

    const updatedPlans = [...savedPlans, newPlan];
    setSavedPlans(updatedPlans);
    localStorage.setItem('sensorPlans', JSON.stringify(updatedPlans));

    toast({
      title: 'Plan saved',
      description: `Successfully saved plan with ${calculatedArea.toFixed(4)} hectares.`,
    });
  };

  const handleDeletePlan = (id: string) => {
    const updatedPlans = savedPlans.filter((plan) => plan.id !== id);
    setSavedPlans(updatedPlans);
    localStorage.setItem('sensorPlans', JSON.stringify(updatedPlans));

    toast({
      title: 'Plan deleted',
      description: 'Successfully deleted the plan.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-96 bg-white border-r overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold">Sensor Planner</h1>
            </div>
            <p className="text-gray-600 text-sm">
              Draw on the map to calculate area and save your placement plans.
            </p>
          </div>

          <Button
            onClick={handleStartDrawing}
            className="w-full mb-6"
            variant={isDrawing ? 'destructive' : 'default'}
          >
            {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
          </Button>

          {/* Calculated Area */}
          <Card className="p-4 mb-4 bg-gray-50">
            <div className="text-sm text-gray-600 mb-1">Calculated Area:</div>
            <div className="text-3xl font-bold text-green-600">
              {calculatedArea.toFixed(4)}
            </div>
            <div className="text-sm text-green-600 font-medium">hectares</div>
          </Card>

          {/* Sensor Recommendation */}
          <Card className="p-4 mb-6 bg-gray-50">
            <div className="text-sm text-gray-600 mb-1">
              Sensor Recommendation:
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {sensorRecommendation}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              sensors (approx. 1 per 2 hectares)
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={handleUndo}
              variant="outline"
              className="flex-1"
              disabled={calculatedArea === 0}
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
              disabled={calculatedArea === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <Button
            onClick={handleSavePlan}
            className="w-full mb-6"
            variant="secondary"
            disabled={calculatedArea === 0}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>

          {/* Saved Plans */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Saved Plans
            </h2>

            {savedPlans.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No saved plans yet.
              </p>
            ) : (
              <div className="space-y-2">
                {savedPlans.map((plan) => (
                  <Card key={plan.id} className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{plan.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600">
                        Area: <span className="font-medium text-green-600">{plan.area.toFixed(4)} ha</span>
                      </div>
                      <div className="text-gray-600">
                        Sensors: <span className="font-medium">{plan.sensorCount}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <SensorMap
            isDrawing={isDrawing}
            onAreaCalculated={handleAreaCalculated}
            onClear={calculatedArea === 0}
          />
        </div>
      </div>
    </div>
  );
}
