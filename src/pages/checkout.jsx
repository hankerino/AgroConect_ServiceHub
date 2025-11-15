import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
    CreditCard, 
    Smartphone, 
    QrCode, 
    Check, 
    Clock,
    Copy,
    ArrowLeft,
    Shield
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Checkout() {
    const { language } = useLanguage();
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [orderData, setOrderData] = useState(null);
    const [pixCode, setPixCode] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("pending");
    const [timeRemaining, setTimeRemaining] = useState(900);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const consultationId = urlParams.get('consultation_id');
        const productId = urlParams.get('product_id');
        const amount = urlParams.get('amount');
        const service = urlParams.get('service');

        const mockOrder = {
            id: consultationId || productId || Date.now(),
            type: consultationId ? 'consultation' : 'product',
            service: decodeURIComponent(service || 'Consulta Especializada'),
            amount: parseFloat(amount) || 150.00,
            description: consultationId ? 'Consulta com Especialista Agrícola' : 'Produto/Serviço Agrícola',
            expertName: consultationId ? 'Especialista Agrícola' : null,
            date: new Date().toISOString()
        };

        setOrderData(mockOrder);
        generatePixCode(mockOrder);
    }, []);

    useEffect(() => {
        if (paymentMethod === "pix" && timeRemaining > 0 && paymentStatus === "pending") {
            const timer = setTimeout(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeRemaining, paymentMethod, paymentStatus]);

    const generatePixCode = (order) => {
        const mockPixCode = `00020126580014br.gov.bcb.pix0136${order.id}520400005303986540${order.amount.toFixed(2)}5802BR5925AGROCONECT SERVICOS LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(7).toUpperCase()}`;
        setPixCode(mockPixCode);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePixPayment = () => {
        setPaymentStatus("processing");
        setTimeout(() => {
            setPaymentStatus("completed");
        }, 3000);
    };

    const handleCreditCardPayment = () => {
        setPaymentStatus("processing");
        setTimeout(() => {
            setPaymentStatus("completed");
        }, 2000);
    };

    const copyPixCode = () => {
        navigator.clipboard.writeText(pixCode);
        alert(text[language].pixCodeCopied);
    };

    const text = {
        pt: {
            title: "Finalizar Pagamento",
            orderSummary: "Resumo do Pedido",
            paymentMethod: "Método de Pagamento",
            total: "Total",
            pix: "PIX",
            creditCard: "Cartão de Crédito",
            pixInstantPayment: "Pagamento Instantâneo",
            pixDescription: "Transfira via PIX usando o QR Code ou código abaixo",
            creditCardDescription: "Pague com cartão de crédito ou débito",
            pixCode: "Código PIX",
            copyCode: "Copiar Código",
            pixCodeCopied: "Código PIX copiado!",
            qrCodeInstruction: "Escaneie o QR Code com seu banco",
            timeRemaining: "Tempo restante",
            minutes: "minutos",
            payWithPix: "Pagar com PIX",
            payWithCard: "Pagar com Cartão",
            processing: "Processando Pagamento...",
            paymentCompleted: "Pagamento Aprovado!",
            paymentFailed: "Pagamento Recusado",
            backToServices: "Voltar aos Serviços",
            cardNumber: "Número do Cartão",
            expiryDate: "Validade",
            cvv: "CVV",
            cardholderName: "Nome no Cartão",
            installments: "Parcelas",
            securePayment: "Pagamento Seguro",
            consultation: "Consulta",
            product: "Produto",
            service: "Serviço"
        },
        en: {
            title: "Complete Payment",
            orderSummary: "Order Summary",
            paymentMethod: "Payment Method",
            total: "Total",
            pix: "PIX",
            creditCard: "Credit Card",
            pixInstantPayment: "Instant Payment",
            pixDescription: "Transfer via PIX using QR Code or code below",
            creditCardDescription: "Pay with credit or debit card",
            pixCode: "PIX Code",
            copyCode: "Copy Code",
            pixCodeCopied: "PIX code copied!",
            qrCodeInstruction: "Scan QR Code with your bank app",
            timeRemaining: "Time remaining",
            minutes: "minutes",
            payWithPix: "Pay with PIX",
            payWithCard: "Pay with Card",
            processing: "Processing Payment...",
            paymentCompleted: "Payment Approved!",
            paymentFailed: "Payment Declined",
            backToServices: "Back to Services",
            cardNumber: "Card Number",
            expiryDate: "Expiry Date",
            cvv: "CVV",
            cardholderName: "Cardholder Name",
            installments: "Installments",
            securePayment: "Secure Payment",
            consultation: "Consultation",
            product: "Product",
            service: "Service"
        }
    };

    if (!orderData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (paymentStatus === "completed") {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <Card className="text-center">
                    <CardContent className="p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            {text[language].paymentCompleted}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Seu pagamento de R$ {orderData.amount.toFixed(2)} foi processado com sucesso.
                        </p>
                        <Button 
                            onClick={() => window.location.href = createPageUrl('Dashboard')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {text[language].backToServices}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Button 
                    variant="ghost" 
                    onClick={() => window.history.back()}
                    size="icon"
                    className="rounded-full"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-700">
                            {text[language].orderSummary}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    {orderData.type === 'consultation' ? text[language].consultation : text[language].service}:
                                </span>
                                <span className="font-medium text-right">{orderData.service}</span>
                            </div>
                            
                            {orderData.expertName && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Especialista:</span>
                                    <span className="font-medium">{orderData.expertName}</span>
                                </div>
                            )}
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>{text[language].total}:</span>
                                <span className="text-green-600">R$ {orderData.amount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">{text[language].securePayment}</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">
                                Seus dados são protegidos com criptografia SSL
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-gray-700">{text[language].paymentMethod}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant={paymentMethod === "pix" ? "default" : "outline"}
                                onClick={() => setPaymentMethod("pix")}
                                className={`h-20 flex flex-col gap-2 ${paymentMethod === 'pix' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            >
                                <Smartphone className="w-6 h-6" />
                                <span>{text[language].pix}</span>
                            </Button>
                            <Button
                                variant={paymentMethod === "card" ? "default" : "outline"}
                                onClick={() => setPaymentMethod("card")}
                                className={`h-20 flex flex-col gap-2 ${paymentMethod === 'card' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span>{text[language].creditCard}</span>
                            </Button>
                        </div>

                        {paymentMethod === "pix" && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{text[language].pixDescription}</p>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <QrCode className="w-24 h-24 text-gray-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>{text[language].pixCode}</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={pixCode} 
                                            readOnly 
                                            className="font-mono text-xs"
                                        />
                                        <Button 
                                            variant="outline" 
                                            onClick={copyPixCode}
                                            className="flex-shrink-0"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-orange-50 p-3 rounded-lg text-center">
                                    <div className="flex items-center justify-center gap-2 text-orange-600 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">{text[language].timeRemaining}</span>
                                    </div>
                                    <span className="text-lg font-bold text-orange-700">
                                        {formatTime(timeRemaining)}
                                    </span>
                                </div>

                                <Button 
                                    onClick={handlePixPayment}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    disabled={paymentStatus === "processing"}
                                >
                                    {paymentStatus === "processing" ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {text[language].processing}
                                        </>
                                    ) : (
                                        <>
                                            <Smartphone className="w-4 h-4 mr-2" />
                                            {text[language].payWithPix}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {paymentMethod === "card" && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{text[language].creditCardDescription}</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label>{text[language].cardNumber}</Label>
                                        <Input placeholder="1234 5678 9012 3456" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>{text[language].expiryDate}</Label>
                                            <Input placeholder="MM/AA" />
                                        </div>
                                        <div>
                                            <Label>{text[language].cvv}</Label>
                                            <Input placeholder="123" />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>{text[language].cardholderName}</Label>
                                        <Input placeholder="Nome como no cartão" />
                                    </div>
                                </div>

                                <Button 
                                    onClick={handleCreditCardPayment}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={paymentStatus === "processing"}
                                >
                                    {paymentStatus === "processing" ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {text[language].processing}
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            {text[language].payWithCard}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
