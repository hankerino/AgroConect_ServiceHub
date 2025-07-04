import React, { useState, useEffect } from "react";
import { getMarketPrices } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function MarketPrices() {

  const [searchParams] = useSearchParams();

  const normalize = (value, fallback = "all") => {
    return value === null || value === "null" ? fallback : value;
  };
  
  const initialSearchTerm = normalize(searchParams.get("crop"), "");
  const initialLocation = normalize(searchParams.get("location"), "all");
  const initialTrend = normalize(searchParams.get("trend"), "all");
  

  const { language } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedTrend, setSelectedTrend] = useState(initialTrend);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    loadPrices();
  }, []);

  useEffect(() => {
    let result = prices;

    if (searchTerm) {
      result = result.filter(price =>
        price.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation !== "all") {
      result = result.filter(price => price.market_location === selectedLocation);
    }

    if (selectedTrend !== "all") {
      result = result.filter(price => price.trend === selectedTrend);
    }

    setFilteredPrices(result);
  }, [searchTerm, selectedLocation, selectedTrend, prices]);

  const loadPrices = async () => {
    try {
      const priceResults = await getMarketPrices();
      const priceData = priceResults.data;
      setPrices(priceData);
      setFilteredPrices(priceData);
      
      const uniqueLocations = [...new Set(priceData.map(item => item.market_location))];
      setLocations(uniqueLocations.sort());
    } catch (error) {
      console.error("Error loading prices:", error);
    }
  };

  const text = {
    pt: {
      title: "Preços de Mercado",
      subtitle: "Acompanhe os preços atuais de cultivos e insumos agrícolas",
      searchPlaceholder: "Buscar por cultivo...",
      allLocations: "Todas as Localidades",
      allTrends: "Todas as Tendências",
      trends: {
        rising: "Em Alta",
        falling: "Em Baixa",
        stable: "Estável"
      },
      demands: {
        high: "Alta",
        medium: "Média",
        low: "Baixa"
      },
      qualities: {
        premium: "Premium",
        standard: "Padrão",
        basic: "Básico"
      },
      crop: "Produto",
      price: "Preço",
      location: "Localização",
      trend: "Tendência",
      demand: "Demanda",
      quality: "Qualidade",
      date: "Data",
      lastUpdate: "Última atualização:",
      noResults: "Nenhum resultado encontrado."
    },
    en: {
      title: "Market Prices",
      subtitle: "Track current prices for crops and agricultural inputs",
      searchPlaceholder: "Search by crop...",
      allLocations: "All Locations",
      allTrends: "All Trends",
      trends: {
        rising: "Rising",
        falling: "Falling",
        stable: "Stable"
      },
      demands: {
        high: "High",
        medium: "Medium",
        low: "Low"
      },
      qualities: {
        premium: "Premium",
        standard: "Standard",
        basic: "Basic"
      },
      crop: "Product",
      price: "Price",
      location: "Location",
      trend: "Trend",
      demand: "Demand",
      quality: "Quality",
      date: "Date",
      lastUpdate: "Last updated:",
      noResults: "No results found."
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'basic':
        return 'bg-gray-100 text-gray-800';
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
            <Select value={selectedTrend} onValueChange={setSelectedTrend}>
              <SelectTrigger>
                <SelectValue placeholder={text[language].allTrends} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{text[language].allTrends}</SelectItem>
                <SelectItem value="rising">{text[language].trends.rising}</SelectItem>
                <SelectItem value="falling">{text[language].trends.falling}</SelectItem>
                <SelectItem value="stable">{text[language].trends.stable}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {text[language].title}
            <Badge variant="outline">
              {text[language].lastUpdate} {new Date().toLocaleDateString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{text[language].crop}</TableHead>
                <TableHead>{text[language].price}</TableHead>
                <TableHead>{text[language].location}</TableHead>
                <TableHead>{text[language].trend}</TableHead>
                <TableHead>{text[language].demand}</TableHead>
                <TableHead>{text[language].quality}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.length > 0 ? (
                filteredPrices.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">{price.crop_name}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      R$ {price.price_per_kg.toFixed(2)}/kg
                    </TableCell>
                    <TableCell>{price.market_location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(price.trend)}
                        <span>{text[language].trends[price.trend]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDemandColor(price.demand_level)}>
                        {text[language].demands[price.demand_level]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getQualityColor(price.quality_grade)}>
                        {text[language].qualities[price.quality_grade]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    {text[language].noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}