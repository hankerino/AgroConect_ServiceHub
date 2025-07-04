
import React, { useState, useEffect } from "react";
import { getProducts } from "@/api/entities";
import { getExperts } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Store, MapPin, Phone, Mail, Star, Users } from "lucide-react";

export default function Marketplace() {
    const { language } = useLanguage();
    const [products, setProducts] = useState([]);
    const [experts, setExperts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredExperts, setFilteredExperts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchTerm, selectedCategory, selectedLocation, products, experts]);

    const loadData = async () => {
        try {

            const productResults = await getProducts();
            const expertResults = await getExperts();

            const productData = productResults.data;
            const expertData = expertResults.data;

            setProducts(productData);
            setExperts(expertData);
            
            // Extract unique locations
            const productLocations = productData.map(p => p.location);
            const expertLocations = expertData.map(e => e.location);
            const allLocations = [...new Set([...productLocations, ...expertLocations])];
            setLocations(allLocations.sort());
        } catch (error) {
            console.error("Error loading marketplace data:", error);
        }
    };

    const applyFilters = () => {
        let filteredProds = products;
        let filteredExps = experts;

        if (searchTerm) {
            filteredProds = filteredProds.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.seller_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            filteredExps = filteredExps.filter(expert =>
                expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                expert.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (selectedCategory !== "all") {
            filteredProds = filteredProds.filter(product => product.category === selectedCategory);
        }

        if (selectedLocation !== "all") {
            filteredProds = filteredProds.filter(product => 
                product.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
            filteredExps = filteredExps.filter(expert => 
                expert.location.toLowerCase().includes(selectedLocation.toLowerCase())
            );
        }

        setFilteredProducts(filteredProds);
        setFilteredExperts(filteredExps);
    };

    const text = {
        pt: {
            title: "Mercado Agrícola",
            subtitle: "Produtos, serviços e especialistas para sua propriedade",
            searchPlaceholder: "Buscar produtos ou serviços...",
            allCategories: "Todas as Categorias",
            allLocations: "Todas as Localizações",
            products: "Produtos e Serviços",
            experts: "Especialistas",
            categories: {
                organic_fertilizer: "Fertilizantes Orgânicos",
                gps_rental: "Aluguel de GPS",
                drone_service: "Serviços de Drone",
                byproduct: "Subprodutos Agrícolas",
                compost: "Compostagem",
                pesticide: "Defensivos Agrícolas"
            },
            contact: "Contato",
            rating: "Avaliação",
            location: "Localização",
            price: "Preço",
            availability: "Disponibilidade",
            available: "Disponível",
            out_of_stock: "Fora de Estoque",
            limited: "Limitado",
            specializations: "Especializações",
            organization: "Organização",
            serviceType: "Tipo de Serviço",
            serviceTypes: {
                free_consultation: "Consulta Gratuita",
                paid_service: "Serviço Pago",
                government_agent: "Agente Governamental"
            },
            noResults: "Nenhum resultado encontrado. Tente ajustar os filtros.",
            viewProfile: "Ver Perfil",
            noExperts: "Nenhum especialista encontrado. Tente ajustar os filtros.",
            units: {
                saco_50kg: "saco 50kg",
                saco_30kg: "saco 30kg", 
                saco_25kg: "saco 25kg",
                saco_20kg: "saco 20kg",
                saco_40kg: "saco 40kg",
                litro: "litro",
                unidade: "unidade",
                metro_cubico: "m³",
                por_dia: "por dia",
                por_semana: "por semana",
                por_hectare: "por hectare",
                por_hora: "por hora"
            },
            buy: "Comprar"
        },
        en: {
            title: "Agricultural Marketplace",
            subtitle: "Products, services and experts for your farm",
            searchPlaceholder: "Search products or services...",
            allCategories: "All Categories",
            allLocations: "All Locations",
            products: "Products & Services",
            experts: "Experts",
            categories: {
                organic_fertilizer: "Organic Fertilizers",
                gps_rental: "GPS Rental",
                drone_service: "Drone Services",
                byproduct: "Agricultural Byproducts",
                compost: "Composting",
                pesticide: "Agricultural Pesticides"
            },
            contact: "Contact",
            rating: "Rating",
            location: "Location",
            price: "Price",
            availability: "Availability",
            available: "Available",
            out_of_stock: "Out of Stock",
            limited: "Limited",
            specializations: "Specializations",
            organization: "Organization",
            serviceType: "Service Type",
            serviceTypes: {
                free_consultation: "Free Consultation",
                paid_service: "Paid Service",
                government_agent: "Government Agent"
            },
            noResults: "No results found. Try adjusting the filters.",
            viewProfile: "View Profile",
            noExperts: "No experts found. Try adjusting the filters.",
            units: {
                saco_50kg: "50kg bag",
                saco_30kg: "30kg bag",
                saco_25kg: "25kg bag", 
                saco_20kg: "20kg bag",
                saco_40kg: "40kg bag",
                litro: "liter",
                unidade: "unit",
                metro_cubico: "m³",
                por_dia: "per day",
                por_semana: "per week",
                por_hectare: "per hectare",
                por_hora: "per hour"
            },
            buy: "Buy"
        }
    };

    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'out_of_stock':
                return 'bg-red-100 text-red-800';
            case 'limited':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // This function is no longer directly used for Badge color in Experts tab per new outline,
    // but kept for completeness if needed elsewhere or for future changes.
    const getServiceTypeColor = (serviceType) => {
        switch (serviceType) {
            case 'free_consultation':
                return 'bg-green-100 text-green-800';
            case 'paid_service':
                return 'bg-blue-100 text-blue-800';
            case 'government_agent':
                return 'bg-purple-100 text-purple-800';
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

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder={text[language].searchPlaceholder}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder={text[language].allCategories} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{text[language].allCategories}</SelectItem>
                                {Object.entries(text[language].categories).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger>
                                <SelectValue placeholder={text[language].allLocations} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{text[language].allLocations}</SelectItem>
                                {locations.map(location => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs for Products and Experts */}
            <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="products" className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        {text[language].products}
                    </TabsTrigger>
                    <TabsTrigger value="experts" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {text[language].experts}
                    </TabsTrigger>
                </TabsList>

                {/* Products Tab */}
                <TabsContent value="products">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Card key={product.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {text[language].categories[product.category] || product.category}
                                            </Badge>
                                            <Badge className={getAvailabilityColor(product.availability)}>
                                                {text[language][product.availability] || product.availability}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <div className="flex-1">
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {product.description}
                                            </p>
                                            
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">{text[language].price}:</span>
                                                    <span className="font-semibold text-green-600">
                                                        R$ {product.price.toFixed(2)} / {text[language].units[product.unit] || product.unit}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{product.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <p className="font-medium text-gray-800 mb-1">{product.seller_name}</p>
                                            <p className="text-xs text-gray-500 mb-3">{product.seller_contact}</p>
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1"
                                                    onClick={() => window.location.href = createPageUrl(`ProductDetail?id=${product.id}`)}
                                                >
                                                    <Phone className="w-4 h-4 mr-2" />
                                                    {text[language].contact}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => {
                                                        const checkoutUrl = createPageUrl(`checkout?product_id=${product.id}&amount=${product.price}&service=${encodeURIComponent(product.name)}`);
                                                        window.location.href = checkoutUrl;
                                                    }}
                                                >
                                                    {text[language].buy}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Store className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">{text[language].noResults}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Experts Tab */}
                <TabsContent value="experts">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredExperts.length > 0 ? (
                            filteredExperts.map((expert) => (
                                <Card key={expert.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{expert.name}</CardTitle>
                                                <p className="text-sm text-gray-600">{expert.organization}</p>
                                            </div>
                                            {expert.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="font-semibold">{expert.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Badge variant="outline" className="w-fit">{text[language].serviceTypes[expert.service_type]}</Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-gray-700 line-clamp-3">{expert.bio}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {
                                                    Array.isArray(expert.specializations) ? 
                                                        expert.specializations.slice(0, 3).map((spec, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">{spec.replace(/_/g, ' ')}</Badge>
                                                        )) : 
                                                        <span className="text-xs text-gray-500">No specializations</span>
                                                }
                                            </div>
                                        </div>
                                        <div className="border-t pt-4 flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1"
                                                onClick={() => window.location.href = createPageUrl(`ExpertDetail?id=${expert.id}`)}
                                            >
                                                <Users className="w-4 h-4 mr-2" />
                                                {text[language].viewProfile}
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={() => {
                                                    const checkoutUrl = createPageUrl(`checkout?consultation_id=${expert.id}&amount=150&service=${encodeURIComponent(expert.name)}`);
                                                    window.location.href = checkoutUrl;
                                                }}
                                            >
                                                {text[language].contact}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">{text[language].noExperts}</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
