import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, QrCode, X, CheckCircle2 } from "lucide-react";

export default function QRCodeScanner({ onScanSuccess, onClose, isOpen }) {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState("");
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (isOpen && isScanning) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, isScanning]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setError("");
        } catch (err) {
            setError("Não foi possível acessar a câmera. Verifique as permissões.");
            console.error("Camera access error:", err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleScanClick = () => {
        setIsScanning(true);
    };

    const handleStopScan = () => {
        setIsScanning(false);
        stopCamera();
    };

    const simulateQRScan = () => {
        // Simulate QR code detection for demo
        const mockProfile = {
            id: "farmer_123",
            display_name: "João Silva",
            location: "Sorriso, MT",
            farm_type: "medium_scale",
            specialties: ["soja", "milho", "algodão"],
            bio: "Agricultor há 15 anos, especialista em cultivos de verão"
        };
        
        onScanSuccess(mockProfile);
        handleStopScan();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        Escanear QR Code
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {!isScanning ? (
                        <div className="text-center space-y-4">
                            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                                <QrCode className="w-16 h-16 text-gray-400" />
                            </div>
                            <p className="text-gray-600">
                                Escaneie o QR code de outro agricultor para se conectar instantaneamente
                            </p>
                            <Button onClick={handleScanClick} className="w-full">
                                <Camera className="w-4 h-4 mr-2" />
                                Iniciar Scanner
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-64 object-cover rounded-lg bg-black"
                                />
                                <div className="absolute inset-0 border-2 border-white rounded-lg pointer-events-none">
                                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
                                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
                                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>
                                </div>
                            </div>
                            
                            {error && (
                                <Badge variant="destructive" className="w-full justify-center">
                                    {error}
                                </Badge>
                            )}
                            
                            <div className="flex space-x-2">
                                <Button onClick={handleStopScan} variant="outline" className="flex-1">
                                    <X className="w-4 h-4 mr-2" />
                                    Parar
                                </Button>
                                {/* Demo button */}
                                <Button onClick={simulateQRScan} className="flex-1 bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Simular Scan
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
