import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Instagram, Facebook, Phone, QrCode, Camera } from "lucide-react";
import { CommunityProfile } from "@/api/entities";

export default function SocialSignup({ onSignupComplete, language = 'pt' }) {
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        location: '',
        farm_type: '',
        specialties: [],
        social_connections: {
            whatsapp: '',
            instagram: '',
            facebook: '',
            phone: ''
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const text = {
        pt: {
            title: "Junte-se à Comunidade AgroConect",
            subtitle: "Conecte-se com agricultores de todo o Brasil",
            step1: "Informações Básicas",
            step2: "Conecte suas Redes Sociais",
            step3: "Finalizar Perfil",
            displayName: "Nome de Exibição",
            bio: "Conte um pouco sobre você",
            location: "Localização",
            farmType: "Tipo de Propriedade",
            specialties: "Especialidades",
            whatsapp: "WhatsApp",
            instagram: "Instagram",
            facebook: "Facebook",
            phone: "Telefone",
            farmTypes: {
                small_scale: "Pequena Propriedade",
                medium_scale: "Média Propriedade",
                large_scale: "Grande Propriedade",
                organic: "Agricultura Orgânica",
                cooperative: "Cooperativa",
                consultant: "Consultor"
            },
            next: "Próximo",
            back: "Voltar",
            finish: "Criar Perfil",
            optional: "Opcional",
            connecting: "Criando perfil...",
            bioPlaceholder: "Ex: Agricultor há 10 anos, especialista em soja e milho...",
            locationPlaceholder: "Ex: Sorriso, MT",
            whatsappPlaceholder: "Ex: (65) 99999-9999",
            instagramPlaceholder: "Ex: @minha_fazenda",
            facebookPlaceholder: "Ex: Fazenda Silva",
            phonePlaceholder: "Ex: (65) 3333-4444"
        },
        en: {
            title: "Join AgroConect Community",
            subtitle: "Connect with farmers across Brazil",
            step1: "Basic Information",
            step2: "Connect Your Social Media",
            step3: "Complete Profile",
            displayName: "Display Name",
            bio: "Tell us about yourself",
            location: "Location",
            farmType: "Farm Type",
            specialties: "Specialties",
            whatsapp: "WhatsApp",
            instagram: "Instagram",
            facebook: "Facebook",
            phone: "Phone",
            farmTypes: {
                small_scale: "Small Farm",
                medium_scale: "Medium Farm",
                large_scale: "Large Farm",
                organic: "Organic Farming",
                cooperative: "Cooperative",
                consultant: "Consultant"
            },
            next: "Next",
            back: "Back",
            finish: "Create Profile",
            optional: "Optional",
            connecting: "Creating profile...",
            bioPlaceholder: "Ex: Farmer for 10 years, specialist in soy and corn...",
            locationPlaceholder: "Ex: Sorriso, MT",
            whatsappPlaceholder: "Ex: (65) 99999-9999",
            instagramPlaceholder: "Ex: @my_farm",
            facebookPlaceholder: "Ex: Silva Farm",
            phonePlaceholder: "Ex: (65) 3333-4444"
        }
    };

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSpecialtyAdd = (specialty) => {
        if (specialty && !formData.specialties.includes(specialty)) {
            setFormData(prev => ({
                ...prev,
                specialties: [...prev.specialties, specialty]
            }));
        }
    };

    const handleSpecialtyRemove = (specialty) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.filter(s => s !== specialty)
        }));
    };

    const generateQRCode = () => {
        // Generate a unique QR code identifier
        return `agroconect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const profileData = {
                ...formData,
                qr_code: generateQRCode(),
                verification_status: 'pending'
            };
            
            const newProfile = await CommunityProfile.create(profileData);
            onSignupComplete(newProfile);
        } catch (error) {
            console.error("Error creating profile:", error);
        }
        setIsSubmitting(false);
    };

    const renderStep1 = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="display_name">{text[language].displayName} *</Label>
                <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="João Silva"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="location">{text[language].location} *</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={text[language].locationPlaceholder}
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="farm_type">{text[language].farmType} *</Label>
                <Select value={formData.farm_type} onValueChange={(value) => handleInputChange('farm_type', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(text[language].farmTypes).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div>
                <Label htmlFor="bio">{text[language].bio}</Label>
                <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder={text[language].bioPlaceholder}
                    rows={3}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
                Conecte suas redes sociais para facilitar o contato com outros agricultores ({text[language].optional})
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        {text[language].whatsapp}
                    </Label>
                    <Input
                        id="whatsapp"
                        value={formData.social_connections.whatsapp}
                        onChange={(e) => handleInputChange('social_connections.whatsapp', e.target.value)}
                        placeholder={text[language].whatsappPlaceholder}
                    />
                </div>
                
                <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        {text[language].phone}
                    </Label>
                    <Input
                        id="phone"
                        value={formData.social_connections.phone}
                        onChange={(e) => handleInputChange('social_connections.phone', e.target.value)}
                        placeholder={text[language].phonePlaceholder}
                    />
                </div>
                
                <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        {text[language].instagram}
                    </Label>
                    <Input
                        id="instagram"
                        value={formData.social_connections.instagram}
                        onChange={(e) => handleInputChange('social_connections.instagram', e.target.value)}
                        placeholder={text[language].instagramPlaceholder}
                    />
                </div>
                
                <div>
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-700" />
                        {text[language].facebook}
                    </Label>
                    <Input
                        id="facebook"
                        value={formData.social_connections.facebook}
                        onChange={(e) => handleInputChange('social_connections.facebook', e.target.value)}
                        placeholder={text[language].facebookPlaceholder}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <div>
                <Label>{text[language].specialties}</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {specialty}
                            <button
                                onClick={() => handleSpecialtyRemove(specialty)}
                                className="ml-1 text-red-500 hover:text-red-700"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                </div>
                <Input
                    placeholder="Digite uma especialidade e pressione Enter"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSpecialtyAdd(e.target.value);
                            e.target.value = '';
                        }
                    }}
                />
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Seu QR Code será gerado automaticamente</span>
                </div>
                <p className="text-sm text-gray-600">
                    Outros agricultores poderão escanear seu QR code para se conectar com você instantaneamente.
                </p>
            </div>
        </div>
    );

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">
                    {text[language].title}
                </CardTitle>
                <p className="text-center text-gray-600">{text[language].subtitle}</p>
                <div className="flex justify-center space-x-2 mt-4">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= step
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {step}
                        </div>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">
                            {currentStep === 1 && text[language].step1}
                            {currentStep === 2 && text[language].step2}
                            {currentStep === 3 && text[language].step3}
                        </h3>
                        
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>
                    
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                        >
                            {text[language].back}
                        </Button>
                        
                        {currentStep < 3 ? (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={currentStep === 1 && (!formData.display_name || !formData.location || !formData.farm_type)}
                            >
                                {text[language].next}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.display_name}
                            >
                                {isSubmitting ? text[language].connecting : text[language].finish}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}