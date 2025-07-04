
import React, { useState, useEffect } from "react";
import { getConsultations } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Calendar, Clock, Video, Phone, Plus } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useSearchParams } from "react-router-dom";

export default function Consultations() {

    const [searchParams] = useSearchParams();

    const normalize = (value, fallback = "all") => {
        return value === null || value === "null" ? fallback : value;
    };

    const initialSearchTerm = normalize(searchParams.get("name"), "");
    const initialSelectedType = normalize(searchParams.get("type"), "all");
    // const initialSelectedStatus = normalize(searchParams.get("status"), "all");

    const { language } = useLanguage();
    const [consultations, setConsultations] = useState([]);
    const [filteredConsultations, setFilteredConsultations] = useState([]);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [selectedType, setSelectedType] = useState(initialSelectedType);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showBookingDialog, setShowBookingDialog] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        expert_name: '',
        expert_specialty: '',
        consultation_type: '',
        scheduled_date: '',
        description: '',
        duration: 60
    });

    useEffect(() => {
        loadConsultations();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedType, selectedStatus, consultations]);

    const loadConsultations = async () => {
        try {
            const consultationResults = await getConsultations();
            const data = consultationResults.data;
            setConsultations(data);
        } catch (error) {
            console.error("Error loading consultations:", error);
        }
    };

    const applyFilters = () => {
        let result = consultations;

        if (searchTerm) {
            result = result.filter(consultation =>
                consultation.expert_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                consultation.expert_specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedType !== "all") {
            result = result.filter(consultation => consultation.consultation_type === selectedType);
        }

        if (selectedStatus !== "all") {
            result = result.filter(consultation => consultation.status === selectedStatus);
        }

        setFilteredConsultations(result);
    };

    const handleBookConsultation = async () => {
        try {
            const consultationData = {
                ...bookingForm,
                price: 150.00, // Default price
                meeting_link: `https://meet.agroconect.com/${Date.now()}`
            };
            
            const newConsultation = await getConsultations().data.create(consultationData);
            setShowBookingDialog(false);
            setBookingForm({
                expert_name: '',
                expert_specialty: '',
                consultation_type: '',
                scheduled_date: '',
                duration: 60,
                description: '',
                status: 'scheduled',
            });
            loadConsultations();

            // Redirect to checkout page
            const checkoutUrl = createPageUrl(`checkout?consultation_id=${newConsultation.id}&amount=${consultationData.price}&service=${encodeURIComponent(consultationData.consultation_type)}`);
            window.location.href = checkoutUrl;
            
        } catch (error) {
            console.error("Error booking consultation:", error);
        }
    };

    const text = {
        pt: {
            title: "Consultas Especializadas",
            subtitle: "Agende consultas com especialistas em agricultura",
            searchPlaceholder: "Buscar por especialista...",
            allTypes: "Todos os Tipos",
            allStatuses: "Todos os Status",
            bookConsultation: "Agendar Consulta",
            consultationTypes: {
                crop_disease: "Doenças de Cultivos",
                soil_analysis: "Análise de Solo",
                pest_control: "Controle de Pragas",
                irrigation: "Irrigação",
                fertilization: "Fertilização",
                harvest_planning: "Planejamento de Colheita",
                market_strategy: "Estratégia de Mercado"
            },
            statuses: {
                scheduled: "Agendada",
                completed: "Concluída",
                cancelled: "Cancelada",
                rescheduled: "Reagendada"
            },
            expertName: "Nome do Especialista",
            expertSpecialty: "Especialidade",
            consultationType: "Tipo de Consulta",
            scheduledDate: "Data e Hora",
            duration: "Duração (minutos)",
            description: "Descrição",
            price: "Preço",
            joinMeeting: "Entrar na Reunião",
            reschedule: "Reagendar",
            cancel: "Cancelar",
            noResults: "Nenhuma consulta encontrada.",
            book: "Agendar",
            close: "Fechar",
            pay: "Pagar" // New text entry
        },
        en: {
            title: "Expert Consultations",
            subtitle: "Schedule consultations with agriculture specialists",
            searchPlaceholder: "Search by expert...",
            allTypes: "All Types",
            allStatuses: "All Statuses",
            bookConsultation: "Book Consultation",
            consultationTypes: {
                crop_disease: "Crop Diseases",
                soil_analysis: "Soil Analysis",
                pest_control: "Pest Control",
                irrigation: "Irrigation",
                fertilization: "Fertilization",
                harvest_planning: "Harvest Planning",
                market_strategy: "Market Strategy"
            },
            statuses: {
                scheduled: "Scheduled",
                completed: "Completed",
                cancelled: "Cancelled",
                rescheduled: "Rescheduled"
            },
            expertName: "Expert Name",
            expertSpecialty: "Specialty",
            consultationType: "Consultation Type",
            scheduledDate: "Date & Time",
            duration: "Duration (minutes)",
            description: "Description",
            price: "Price",
            joinMeeting: "Join Meeting",
            reschedule: "Reschedule",
            cancel: "Cancel",
            noResults: "No consultations found.",
            book: "Book",
            close: "Close",
            pay: "Pay" // New text entry
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'rescheduled':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
                <p className="text-lg text-gray-600 mt-2">{text[language].subtitle}</p>
            </div>

            {/* Filters and Book Button */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    placeholder={text[language].searchPlaceholder}
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder={text[language].allTypes} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{text[language].allTypes}</SelectItem>
                                    {Object.entries(text[language].consultationTypes).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder={text[language].allStatuses} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{text[language].allStatuses}</SelectItem>
                                    {Object.entries(text[language].statuses).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                            <DialogTrigger asChild>
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    {text[language].bookConsultation}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>{text[language].bookConsultation}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>{text[language].expertName}</Label>
                                            <Input
                                                value={bookingForm.expert_name}
                                                onChange={(e) => setBookingForm({...bookingForm, expert_name: e.target.value})}
                                                placeholder="Dr. João Silva"
                                            />
                                        </div>
                                        <div>
                                            <Label>{text[language].expertSpecialty}</Label>
                                            <Input
                                                value={bookingForm.expert_specialty}
                                                onChange={(e) => setBookingForm({...bookingForm, expert_specialty: e.target.value})}
                                                placeholder="Entomologia Agrícola"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>{text[language].consultationType}</Label>
                                            <Select 
                                                value={bookingForm.consultation_type} 
                                                onValueChange={(value) => setBookingForm({...bookingForm, consultation_type: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(text[language].consultationTypes).map(([key, label]) => (
                                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>{text[language].scheduledDate}</Label>
                                            <Input
                                                type="datetime-local"
                                                value={bookingForm.scheduled_date}
                                                onChange={(e) => setBookingForm({...bookingForm, scheduled_date: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label>{text[language].description}</Label>
                                        <Textarea
                                            value={bookingForm.description}
                                            onChange={(e) => setBookingForm({...bookingForm, description: e.target.value})}
                                            placeholder="Descreva o problema ou questão que deseja discutir..."
                                            rows={3}
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                                            {text[language].close}
                                        </Button>
                                        <Button onClick={handleBookConsultation}>
                                            {text[language].book}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>

            {/* Consultations List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredConsultations.length > 0 ? (
                    filteredConsultations.map((consultation) => (
                        <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className={getStatusColor(consultation.status)}>
                                                {text[language].statuses[consultation.status]}
                                            </Badge>
                                            <Badge variant="outline">
                                                {text[language].consultationTypes[consultation.consultation_type]}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg">{consultation.expert_name}</CardTitle>
                                        <p className="text-sm text-gray-600">{consultation.expert_specialty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-green-600">R$ {consultation.price?.toFixed(2)}</p>
                                        {consultation.price > 0 && (
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={() => {
                                                    const checkoutUrl = createPageUrl(`checkout?consultation_id=${consultation.id}&amount=${consultation.price}&service=${encodeURIComponent('Consulta com ' + consultation.expert_name)}`);
                                                    window.location.href = checkoutUrl;
                                                }}
                                                className="mt-2"
                                            >
                                                {text[language].pay}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(consultation.scheduled_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(consultation.scheduled_date).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{consultation.duration} min</span>
                                        </div>
                                    </div>
                                    
                                    {consultation.description && (
                                        <p className="text-gray-700 text-sm">{consultation.description}</p>
                                    )}
                                    
                                    <div className="flex gap-2 pt-2">
                                        {consultation.status === 'scheduled' && (
                                            <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                                                <Video className="w-4 h-4 mr-2" />
                                                {text[language].joinMeeting}
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {text[language].reschedule}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">{text[language].noResults}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
