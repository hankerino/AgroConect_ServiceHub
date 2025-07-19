import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mic, MicOff, Volume2, Loader2, X } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";

export default function VoiceAssistant({ language = 'pt', onResponse }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'pt' ? 'pt-BR' : 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceInput(finalTranscript);
        }
        setInterimTranscript(interim);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        
        let errorMessage = language === 'pt' ? 
          'Erro no reconhecimento de voz. Tente novamente.' : 
          'Speech recognition error. Please try again.';
          
        if (event.error === 'not-allowed') {
          errorMessage = language === 'pt' ? 
            'Acesso ao microfone foi negado. Permita o acesso e tente novamente.' :
            'Microphone access denied. Please allow access and try again.';
        }
        
        alert(errorMessage);
      };
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setShowModal(true);
      setTranscript('');
      setResponse('');
      setInterimTranscript('');
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setShowModal(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const closeModal = () => {
    stopListening();
    setShowModal(false);
    setTranscript('');
    setResponse('');
    setInterimTranscript('');
  };

  const processVoiceInput = async (input) => {
    setIsProcessing(true);
    try {
      let systemPrompt = '';
      
      if (language === 'pt') {
        systemPrompt = `Você é um assistente agrícola especializado para agricultores brasileiros. Você tem conhecimento profundo sobre:

AGRICULTURA BRASILEIRA:
- Cultivos típicos do Brasil (soja, milho, café, cana-de-açúcar, algodão, feijão)
- Biomas e regiões agrícolas (Cerrado, Mata Atlântica, Caatinga, Pampa)
- Problemas específicos como seca histórica, volatilidade de fertilizantes
- Cooperativas e extensão rural (EMATER, EMBRAPA, SENAR)

INSUMOS E CUSTOS:
- Preços de fertilizantes (ureia, potássio, NPK)
- Alternativas orgânicas (esterco bovino, compostagem)
- Compras coletivas e logística de insumos

TECNOLOGIA AGRÍCOLA:
- GPS e agricultura de precisão
- Drones para mapeamento e pulverização
- Sensoriamento remoto e NDVI
- Regulamentações ANAC para drones

EXTENSÃO TÉCNICA:
- Assistência técnica gratuita e paga
- Programas governamentais de financiamento
- Capacitação em tecnologias

Responda sempre em português brasileiro, de forma prática e específica para a realidade do produtor rural brasileiro. Use termos técnicos apropriados mas explique de forma clara.`;
      } else {
        systemPrompt = `You are an agricultural assistant specialized for Brazilian farmers operating in English. You have deep knowledge about:

BRAZILIAN AGRICULTURE:
- Typical Brazilian crops (soy, corn, coffee, sugarcane, cotton, beans)
- Biomes and agricultural regions (Cerrado, Atlantic Forest, Caatinga, Pampa)  
- Specific challenges like historical droughts, fertilizer volatility
- Cooperatives and rural extension (EMATER, EMBRAPA, SENAR)

INPUTS AND COSTS:
- Fertilizer prices (urea, potassium, NPK)
- Organic alternatives (cattle manure, composting)
- Collective purchasing and input logistics

AGRICULTURAL TECHNOLOGY:
- GPS and precision agriculture
- Drones for mapping and spraying
- Remote sensing and NDVI
- ANAC regulations for drones

TECHNICAL EXTENSION:
- Free and paid technical assistance
- Government financing programs
- Technology training

Always respond in clear English with practical advice specific to Brazilian rural producers. Use appropriate technical terms but explain clearly.`;
      }
      
      const userPrompt = `${systemPrompt}\n\nPergunta do agricultor: ${input}`;
      
      const result = await InvokeLLM({
        prompt: userPrompt,
        add_context_from_internet: true
      });
      
      setResponse(result);
      if (onResponse) {
        onResponse({ question: input, answer: result });
      }
      
      // Text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result);
        utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const errorMsg = language === 'pt' ? 
        'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.' :
        'Sorry, there was an error processing your question. Please try again.';
      setResponse(errorMsg);
    }
    setIsProcessing(false);
  };

  const text = {
    pt: {
      title: "Assistente de Voz",
      subtitle: "Fale com o AgroConect",
      listening: "Ouvindo...",
      processing: "Processando...",
      clickToStart: "Clique para falar",
      notSupported: "Reconhecimento de voz não suportado neste navegador",
      yourQuestion: "Sua pergunta:",
      response: "Resposta:",
      tellMeHelp: "Diga-me como posso ajudá-lo com sua propriedade rural",
      speechAppear: "Sua fala aparecerá aqui...",
      stop: "Parar",
      cancel: "Cancelar",
      close: "Fechar",
      exampleQuestions: [
        "Como controlar pragas na soja?",
        "Qual o preço atual da ureia?",
        "Como fazer compostagem orgânica?",
        "Preciso de assistência técnica"
      ]
    },
    en: {
      title: "Voice Assistant",
      subtitle: "Talk to AgroConect", 
      listening: "Listening...",
      processing: "Processing...",
      clickToStart: "Click to speak",
      notSupported: "Voice recognition not supported in this browser",
      yourQuestion: "Your question:",
      response: "Response:",
      tellMeHelp: "Tell me how I can help with your farm",
      speechAppear: "Your speech will appear here...",
      stop: "Stop",
      cancel: "Cancel",
      close: "Close",
      exampleQuestions: [
        "How to control soy pests?",
        "What's the current urea price?",
        "How to make organic compost?",
        "I need technical assistance"
      ]
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">{text[language].notSupported}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <style jsx>{`
        .microphone-pulse {
          animation: pulse 2s infinite;
          will-change: transform;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        .recording {
          background: #ef4444 !important;
          animation: recordingPulse 1s infinite;
        }
        
        @keyframes recordingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .voice-wave {
          display: inline-block;
          width: 4px;
          height: 20px;
          background: #3b82f6;
          margin: 0 2px;
          animation: wave 1s infinite ease-in-out;
          will-change: transform;
        }
        
        .voice-wave:nth-child(2) { animation-delay: 0.1s; }
        .voice-wave:nth-child(3) { animation-delay: 0.2s; }
        .voice-wave:nth-child(4) { animation-delay: 0.3s; }
        .voice-wave:nth-child(5) { animation-delay: 0.4s; }
        
        @keyframes wave {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1); }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-2xl mx-auto space-y-6 fade-in">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {text[language].title}
              </h3>
              <p className="text-gray-600">
                {text[language].subtitle}
              </p>
              
              <div className="relative">
                <Button
                  onClick={startListening}
                  disabled={isProcessing}
                  className={`w-20 h-20 rounded-full text-white font-semibold transition-all duration-300 microphone-pulse ${
                    isProcessing ? 'opacity-50 bg-gray-400' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Mic className="w-8 h-8" />
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                {text[language].clickToStart}
              </p>

              {/* Example Questions */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  {language === 'pt' ? 'Exemplos de perguntas:' : 'Example questions:'}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {text[language].exampleQuestions.map((question, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-green-50"
                      onClick={() => processVoiceInput(question)}
                    >
                      {question}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="fade-in">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">{text[language].response}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(response);
                        utterance.lang = language === 'pt' ? 'pt-BR' : 'en-US';
                        utterance.rate = 0.9;
                        speechSynthesis.speak(utterance);
                      }
                    }}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{response}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Voice Input Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-white text-3xl transition-all duration-300 ${
                isListening ? 'bg-red-500 recording' : 'bg-blue-500'
              }`}>
                <Mic />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold">
              {isListening ? text[language].listening : text[language].title}
            </DialogTitle>
            <DialogDescription>
              {text[language].tellMeHelp}
            </DialogDescription>
          </DialogHeader>
          
          {/* Voice Wave Animation */}
          {isListening && (
            <div className="flex justify-center items-center mb-6">
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
            </div>
          )}
          
          {/* Transcript Display */}
          {(transcript || interimTranscript) && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 min-h-[60px]">
              <p className="text-gray-700">
                {transcript}
                <span className="text-gray-500 italic">{interimTranscript}</span>
              </p>
            </div>
          )}
          
          {isProcessing && (
            <div className="text-center mb-6">
              <Badge variant="secondary" className="animate-pulse">
                {text[language].processing}
              </Badge>
            </div>
          )}
          
          {/* Control Buttons */}
          <div className="flex space-x-4">
            {isListening && (
              <Button
                onClick={stopListening}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                <MicOff className="w-4 h-4 mr-2" />
                {text[language].stop}
              </Button>
            )}
            <Button
              onClick={closeModal}
              variant={isListening ? "outline" : "default"}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {isListening ? text[language].cancel : text[language].close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}