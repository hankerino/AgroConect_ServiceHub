import React, { useRef, useState, useMemo } from 'react';
import { Mic, X, Loader2, Volume2, AudioWaveform } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../constants';
import { Language } from '../types';

// --- Helper Functions for Audio Encoding/Decoding ---
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768; // Convert float [-1.0, 1.0] to int16
  }
  return {
    data: arrayBufferToBase64(int16.buffer),
    mimeType: 'audio/pcm;rate=16000',
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface VoiceAssistantProps {
  language: Language['code'];
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ language }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [error, setError] = useState<string | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const closeSessionRef = useRef<(() => void) | null>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY || '' }), []);

  const cleanup = () => {
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => {
            if(session && typeof session.close === 'function') {
                session.close();
            }
        }).catch(() => {});
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputSourceRef.current) inputSourceRef.current.disconnect();
    if (processorRef.current) processorRef.current.disconnect();
    if (outputNodeRef.current) outputNodeRef.current.disconnect();

    if (inputAudioContextRef.current?.state !== 'closed') inputAudioContextRef.current?.close();
    if (outputAudioContextRef.current?.state !== 'closed') outputAudioContextRef.current?.close();

    audioQueueRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;

    setIsActive(false);
    setStatus('idle');
    setError(null);
  };

  const startSession = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
      }
      setIsActive(true);
      setStatus('connecting');
      setError(null);

      const InputContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new InputContextClass({ sampleRate: 16000 });
      const outputCtx = new InputContextClass({ sampleRate: 24000 });

      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);
      outputNodeRef.current = outputNode;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: () => {
            setStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);

            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (message: LiveServerMessage) => {
             const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
                setStatus('speaking');
                if (outputCtx.state === 'suspended') {
                    await outputCtx.resume();
                }
                const currentTime = outputCtx.currentTime;
                if (nextStartTimeRef.current < currentTime) {
                    nextStartTimeRef.current = currentTime;
                }
                const audioBuffer = await decodeAudioData(
                    base64ToUint8Array(audioData),
                    outputCtx
                );
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;

                audioQueueRef.current.push(source);

                source.onended = () => {
                    audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
                    if (audioQueueRef.current.length === 0) {
                        setStatus('listening');
                    }
                };
             }
             if (message.serverContent?.interrupted) {
                 audioQueueRef.current.forEach(s => {
                     try { s.stop(); } catch(e) {}
                 });
                 audioQueueRef.current = [];
                 nextStartTimeRef.current = 0;
                 setStatus('listening');
             }
          },
          onclose: () => cleanup(),
          onerror: (err) => {
              console.error(err);
              setError("Connection error.");
              cleanup();
          }
        }
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (err: any) {
      setError(err.message || "Failed to start.");
      setIsActive(false);
      setStatus('idle');
    }
  };

  return (
    <>
      <div className="w-full bg-[#10b981] rounded-xl p-8 shadow-sm relative overflow-hidden flex items-center justify-between">
        <div className="relative z-10 text-white">
          <h2 className="text-3xl font-bold mb-1">Voice Assistant</h2>
          <p className="text-emerald-50 text-lg opacity-90 font-medium">Talk to me for instant help</p>
        </div>

        <button
          onClick={startSession}
          className="relative z-10 bg-white text-[#10b981] h-14 w-20 rounded-xl flex items-center justify-center shadow-lg hover:bg-emerald-50 transition-colors transform hover:scale-105 active:scale-95"
          aria-label="Start Voice Assistant"
        >
          <Mic size={28} />
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      {isActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={cleanup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center justify-center pt-4">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                status === 'speaking' ? 'bg-emerald-100 ring-4 ring-emerald-200' :
                status === 'listening' ? 'bg-blue-50 ring-4 ring-blue-100' :
                'bg-gray-50'
              }`}>
                {status === 'connecting' && <Loader2 size={48} className="text-emerald-500 animate-spin" />}
                {status === 'listening' && <Mic size={48} className="text-blue-500 animate-pulse" />}
                {status === 'speaking' && <Volume2 size={48} className="text-emerald-600 animate-bounce" />}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {status === 'connecting' && 'Connecting...'}
                {status === 'listening' && 'Listening...'}
                {status === 'speaking' && 'AgroConect Speaking...'}
              </h3>

              <p className="text-center text-gray-500 mb-8">
                {status === 'listening' ? 'Go ahead, I am listening.' :
                 status === 'speaking' ? 'Processing your request...' :
                 'Establishing secure connection...'}
              </p>

              <button
                onClick={cleanup}
                className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};