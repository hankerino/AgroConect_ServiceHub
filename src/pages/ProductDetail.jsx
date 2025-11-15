import React, { useState, useEffect } from "react";
import { getProducts } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Tag, Box, MapPin, PackageCheck, PackageX, PackageSearch } from "lucide-react";

export default function ProductDetail() {
    const { language } = useLanguage();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) {
            loadProduct(productId);
        }
    }, []);

    const loadProduct = async (id) => {
        setLoading(true);
        try {
            const productData = await getProducts().data.find(product => product.id === id);
            setProduct(productData);
        } catch (error) {
            console.error("Error loading product details:", error);
        }
        setLoading(false);
    };

    const text = {
        pt: {
            back: "Voltar ao Mercado",
            price: "Preço",
            category: "Categoria",
            availability: "Disponibilidade",
            location: "Localização",
            seller: "Vendedor",
            contact: "Entrar em Contato",
            loading: "Carregando produto...",
            notFound: "Produto não encontrado.",
            categories: {
                organic_fertilizer: "Fertilizantes Orgânicos",
                gps_rental: "Aluguel de GPS",
                drone_service: "Serviços de Drone",
                byproduct: "Subprodutos",
                compost: "Compostagem",
                pesticide: "Pesticidas"
            },
            availabilities: {
                available: "Disponível",
                out_of_stock: "Fora de Estoque",
                limited: "Limitado"
            }
        },
        en: {
            back: "Back to Marketplace",
            price: "Price",
            category: "Category",
            availability: "Availability",
            location: "Location",
            seller: "Seller",
            contact: "Contact",
            loading: "Loading product...",
            notFound: "Product not found.",
            categories: {
                organic_fertilizer: "Organic Fertilizers",
                gps_rental: "GPS Rental",
                drone_service: "Drone Services",
                byproduct: "Byproducts",
                compost: "Composting",
                pesticide: "Pesticides"
            },
            availabilities: {
                available: "Available",
                out_of_stock: "Out of Stock",
                limited: "Limited"
            }
        }
    };
    
    const getAvailabilityProps = (availability) => {
        switch (availability) {
            case 'available':
                return { icon: <PackageCheck className="w-5 h-5 text-green-500" />, color: 'text-green-600' };
            case 'out_of_stock':
                return { icon: <PackageX className="w-5 h-5 text-red-500" />, color: 'text-red-600' };
            case 'limited':
                return { icon: <PackageSearch className="w-5 h-5 text-yellow-500" />, color: 'text-yellow-600' };
            default:
                return { icon: <PackageSearch className="w-5 h-5 text-gray-500" />, color: 'text-gray-600' };
        }
    };

    if (loading) {
        return <div className="text-center py-10">{text[language].loading}</div>;
    }

    if (!product) {
        return <div className="text-center py-10">{text[language].notFound}</div>;
    }

    const availabilityProps = getAvailabilityProps(product.availability);

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
                    <Badge variant="secondary" className="w-fit mb-2">
                        {text[language].categories[product.category] || product.category}
                    </Badge>
                    <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">Descrição</h3>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
                             <div className="flex items-start gap-3">
                                <Tag className="w-5 h-5 text-green-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">{text[language].price}</p>
                                    <p className="text-lg font-semibold text-green-600">R$ {product.price.toFixed(2)} / {product.unit}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                {availabilityProps.icon}
                                <div>
                                    <p className="text-sm text-gray-500">{text[language].availability}</p>
                                    <p className={`text-lg font-semibold ${availabilityProps.color}`}>
                                        {text[language].availabilities[product.availability] || product.availability}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-4 bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg border-b pb-2">{text[language].seller}</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Box className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                    <p className="font-semibold">{product.seller_name}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                    <p className="text-gray-700">{product.location}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-gray-600 mt-1" />
                                <div>
                                    <p className="text-gray-700">{product.seller_contact}</p>
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                            <Phone className="w-4 h-4 mr-2" />
                            {text[language].contact}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
