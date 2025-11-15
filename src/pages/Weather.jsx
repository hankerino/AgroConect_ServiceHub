import React, { useState, useEffect } from "react";
import { getWeatherForecasts } from "@/api/entities";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    MapPin, 
    RefreshCw, 
    Search,
    CloudRain, 
    Sun, 
    AlertTriangle,
    TrendingUp,
    Calendar
} from "lucide-react";
import WeatherCard from "../components/weather/WeatherCard";
import { WeatherService } from "../components/weather/WeatherService";
import { useSearchParams } from "react-router-dom";

export default function Weather() {

    const [searchParams] = useSearchParams();

    const normalize = (value, fallback = "all") => {
        return value === null || value === "null" ? fallback : value;
    };

    const initialSearchLocation = normalize(searchParams.get("location"), "");

    const { language, user } = useLanguage();
    const [forecasts, setForecasts] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(initialSearchLocation);
    const [selectedCoords, setSelectedCoords] = useState(null);
    const weatherService = new WeatherService();

    useEffect(() => {
        // Load user's location or default to major agricultural centers
        if (user && user.location) {
            handleLocationSearch(user.location);
        } else {
            // Default to Cuiabá, MT (major agricultural center)
            loadWeatherData(-15.6014, -56.0979);
        }
    }, [user]);

    const loadWeatherData = async (latitude, longitude) => {
        setLoading(true);
        try {
            // Get current weather
            const current = await weatherService.getCurrentWeather(latitude, longitude);
            setCurrentWeather(current);

            // Get 7-day forecast
            const forecast = await weatherService.getForecast(latitude, longitude);
            setForecasts(forecast);

            // Save forecasts to database (optional for caching)
            // for (const dailyForecast of forecast) {
            //     await WeatherForecast.create(dailyForecast);
            // }
        } catch (error) {
            console.error("Error loading weather data:", error);
        }
        setLoading(false);
    };

    const handleLocationSearch = async (searchLocation) => {
        // Mock geocoding - in production, use a geocoding service
        const agricultureCenters = {
            'cuiaba': { lat: -15.6014, lng: -56.0979, name: 'Cuiabá, MT' },
            'rondonopolis': { lat: -16.4707, lng: -54.6386, name: 'Rondonópolis, MT' },
            'sorriso': { lat: -12.5496, lng: -55.7195, name: 'Sorriso, MT' },
            'cascavel': { lat: -24.9555, lng: -53.4552, name: 'Cascavel, PR' },
            'londrina': { lat: -23.3045, lng: -51.1696, name: 'Londrina, PR' },
            'rio verde': { lat: -17.7973, lng: -50.9249, name: 'Rio Verde, GO' },
            'catalao': { lat: -18.1659, lng: -47.9469, name: 'Catalão, GO' },
            'uberlandia': { lat: -18.9113, lng: -48.2622, name: 'Uberlândia, MG' },
            'ribeirao preto': { lat: -21.1775, lng: -47.8103, name: 'Ribeirão Preto, SP' },
            'passo fundo': { lat: -28.2633, lng: -52.4069, name: 'Passo Fundo, RS' }
        };

        const searchKey = searchLocation.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
        const found = agricultureCenters[searchKey] || Object.values(agricultureCenters).find(center => 
            center.name.toLowerCase().includes(searchKey)
        );

        if (found) {
            setSelectedCoords({ lat: found.lat, lng: found.lng });
            loadWeatherData(found.lat, found.lng);
        }
    };

    const handleRefresh = () => {
        if (selectedCoords) {
            loadWeatherData(selectedCoords.lat, selectedCoords.lng);
        } else if (currentWeather) {
            loadWeatherData(currentWeather.latitude, currentWeather.longitude);
        }
    };

    const text = {
        pt: {
            title: "Previsão do Tempo Agrícola",
            subtitle: "Informações meteorológicas para planejamento agrícola",
            searchPlaceholder: "Buscar localização (ex: Sorriso, MT)",
            currentWeather: "Tempo Atual",
            forecast7days: "Previsão 7 Dias",
            agriculturalInsights: "Insights Agrícolas",
            refresh: "Atualizar",
            search: "Buscar",
            noData: "Nenhum dado disponível",
            loadingWeather: "Carregando dados meteorológicos...",
            recommendations: {
                title: "Recomendações Agrícolas",
                planting: "Condições ideais para plantio",
                irrigation: "Considere irrigação nos próximos dias",
                harvest: "Bom período para colheita",
                pestControl: "Condições favoráveis para pragas - monitore"
            }
        },
        en: {
            title: "Agricultural Weather Forecast",
            subtitle: "Meteorological information for agricultural planning",
            searchPlaceholder: "Search location (e.g: Sorriso, MT)",
            currentWeather: "Current Weather",
            forecast7days: "7-Day Forecast",
            agriculturalInsights: "Agricultural Insights",
            refresh: "Refresh",
            search: "Search",
            noData: "No data available",
            loadingWeather: "Loading weather data...",
            recommendations: {
                title: "Agricultural Recommendations",
                planting: "Ideal conditions for planting",
                irrigation: "Consider irrigation in the coming days",
                harvest: "Good period for harvest",
                pestControl: "Favorable conditions for pests - monitor"
            }
        }
    };

    const getAgriculturalRecommendations = () => {
        if (!forecasts.length) return [];
        
        const recommendations = [];
        const avgHumidity = forecasts.slice(0, 3).reduce((sum, f) => sum + f.humidity, 0) / 3;
        const totalPrecipitation = forecasts.slice(0, 3).reduce((sum, f) => sum + (f.precipitation || 0), 0);
        const hasHighTemp = forecasts.some(f => f.temperature_max > 30);
        
        if (avgHumidity > 80 && totalPrecipitation > 20) {
            recommendations.push({
                type: 'warning',
                message: text[language].recommendations.pestControl
            });
        }
        
        if (totalPrecipitation < 5 && hasHighTemp) {
            recommendations.push({
                type: 'info',
                message: text[language].recommendations.irrigation
            });
        }
        
        if (avgHumidity > 60 && avgHumidity < 80 && !hasHighTemp) {
            recommendations.push({
                type: 'success',
                message: text[language].recommendations.planting
            });
        }
        
        return recommendations;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">{text[language].title}</h1>
                <p className="text-lg text-gray-600 mt-2">{text[language].subtitle}</p>
            </div>

            {/* Search and Controls */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder={text[language].searchPlaceholder}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLocationSearch(location);
                                    }
                                }}
                                className="pl-10"
                            />
                        </div>
                        <Button 
                            onClick={() => handleLocationSearch(location)}
                            disabled={loading}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            {text[language].search}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {loading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="text-gray-600">{text[language].loadingWeather}</p>
                    </CardContent>
                </Card>
            )}

            {/* Current Weather */}
            {currentWeather && !loading && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sun className="w-6 h-6" />
                        {text[language].currentWeather}
                    </h2>
                    <WeatherCard forecast={currentWeather} language={language} />
                </div>
            )}

            {/* Agricultural Recommendations */}
            {forecasts.length > 0 && !loading && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            {text[language].recommendations.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {getAgriculturalRecommendations().map((rec, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${
                                        rec.type === 'warning' ? 'bg-orange-50 border border-orange-200' :
                                        rec.type === 'success' ? 'bg-green-50 border border-green-200' :
                                        'bg-blue-50 border border-blue-200'
                                    }`}
                                >
                                    <AlertTriangle className={`w-5 h-5 ${
                                        rec.type === 'warning' ? 'text-orange-500' :
                                        rec.type === 'success' ? 'text-green-500' :
                                        'text-blue-500'
                                    }`} />
                                    <span className="text-sm font-medium">{rec.message}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 7-Day Forecast */}
            {forecasts.length > 0 && !loading && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        {text[language].forecast7days}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {forecasts.slice(1).map((forecast, index) => (
                            <WeatherCard 
                                key={index} 
                                forecast={forecast} 
                                language={language} 
                            />
                        ))}
                    </div>
                </div>
            )}

            {!currentWeather && !loading && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <CloudRain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">{text[language].noData}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
