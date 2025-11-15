'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceClick = () => {
    setIsListening(!isListening);
  };

  return (
    <Card className="bg-green-600 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">Voice Assistant</h3>
            <p className="text-green-50">Talk to me for instant help</p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            className={`rounded-full w-14 h-14 ${
              isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={handleVoiceClick}
          >
            {isListening ? (
              <Square className="h-6 w-6 text-white" fill="currentColor" />
            ) : (
              <Mic className={`h-6 w-6 ${isListening ? 'text-white' : 'text-green-600'}`} />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
