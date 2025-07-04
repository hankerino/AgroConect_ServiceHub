import React, { useState, useEffect } from "react";
import { getExperts } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Star, Users, MapPin, Building, Briefcase } from "lucide-react";

export default function ExpertDetail() {
    const { language } = useLanguage();
    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const expertId = urlParams.get('id');
        if (expertId) {
            loadExpert(expertId);
        }
    }, []);

    const loadExpert = async (id) => {
        setLoading(true);
        try {
            const expertData = await getExperts().data.find(expert => expert.id === id);
            setExpert(expertData);
        } catch (error) {
            console.error("Error loading expert details:", error);
        }
        setLoading(false);
    };

    const text = {
        pt: {
            back: "Voltar ao Mercado",
            specializations: "Especializações",
            bio: "Biografia",
            organization: "Organização",
            location: "Localização",
            contact: "Contato",
            rating: "Avaliação",
            serviceType: "Tipo de Serviço",
            loading: "Carregando especialista...",
            notFound: "Especialista não encontrado.",
            serviceTypes: {
                free_consultation: "Consulta Gratuita",
                paid_service: "Serviço Pago",
                government_agent: "Agente Governamental"
            }
        },
        en: {
            back: "Back to Marketplace",
            specializations: "Specializations",
            bio: "Biography",
            organization: "Organization",
            location: "Location",
            contact: "Contact",
            rating: "Rating",
            serviceType: "Service Type",
            loading: "Loading expert...",
            notFound: "Expert not found.",
            serviceTypes: {
                free_consultation: "Free Consultation",
                paid_service: "Paid Service",
                government_agent: "Government Agent"
            }
        }
    };
    
    if (loading) {
        return <div className="text-center py-10">{text[language].loading}</div>;
    }

    if (!expert) {
        return <div className="text-center py-10">{text[language].notFound}</div>;
    }

    return (
        <div className="space-y-6">
            <Link to={createPageUrl("Marketplace")}>
                <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {text[language].back}
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-3xl font-bold">{expert.name}</CardTitle>
                        {expert.rating && (
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="text-xl font-bold">{expert.rating.toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                     <Badge variant="secondary" className="w-fit">
                        {text[language].serviceTypes[expert.service_type] || expert.service_type}
                    </Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{text[language].bio}</h3>
                            <p className="text-gray-700 leading-relaxed">{expert.bio}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{text[language].specializations}</h3>
                            <div className="flex flex-wrap gap-2">
                                {expert.specializations.map((spec, index) => (
                                    <Badge key={index} variant="outline">{spec.replace(/_/g, ' ')}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="md:col-span-1 space-y-4 bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg border-b pb-2">{text[language].contact}</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Building className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">{text[language].organization}</p>
                                    <p className="font-semibold">{expert.organization}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">{text[language].location}</p>
                                    <p className="text-gray-700">{expert.location}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                     <p className="text-sm text-gray-500">{text[language].contact}</p>
                                    <p className="text-gray-700">{expert.contact_info}</p>
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                            <Mail className="w-4 h-4 mr-2" />
                            {text[language].contact}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}