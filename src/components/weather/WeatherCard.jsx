import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    CloudRain, 
    Sun, 
    Cloud, 
    CloudSnow, 
    Thermometer, 
    Droplets, 
    Wind,
    Eye,
    AlertTriangle,
    Gauge
} from "lucide-react";

export default function WeatherCard({ forecast, language = 'pt' }) {
    const text = {
        pt: {
            temperature: "Temperatura",
            humidity: "Umidade",
            precipitation: "Precipitação",
            wind: "Vento",
            pressure: "Pressão",
            uvIndex: "Índice UV",
            agricultural: "Alerta Agrícola",
            alerts: {
                frost_risk: "Risco de Geada",
                drought_warning: "Alerta de Seca",
                pest_favorable: "Condições Favoráveis a Pragas",
                ideal_planting: "Ideal para Plantio",
                harvest_time: "Tempo de Colheita"
            }
        },
        en: {
            temperature: "Temperature",
            humidity: "Humidity",
            precipitation: "Precipitation",
            wind: "Wind",
            pressure: "Pressure",
            uvIndex: "UV Index",
            agricultural: "Agricultural Alert",
            alerts: {
                frost_risk: "Frost Risk",
                drought_warning: "Drought Warning",
                pest_favorable: "Pest Favorable Conditions",
                ideal_planting: "Ideal for Planting",
                harvest_time: "Harvest Time"
            }
        }
    };

    const getWeatherIcon = (condition) => {
        const conditionLower = condition.toLowerCase();
        if (conditionLower.includes('rain') || conditionLower.includes('chuva')) {
            return <CloudRain className="w-6 h-6 text-blue-500" />;
        } else if (conditionLower.includes('snow') || conditionLower.includes('neve')) {
            return <CloudSnow className="w-6 h-6 text-blue-200" />;
        } else if (conditionLower.includes('cloud') || conditionLower.includes('nuvem')) {
            return <Cloud className="w-6 h-6 text-gray-500" />;
        } else {
            return <Sun className="w-6 h-6 text-yellow-500" />;
        }
    };

    const getAlertColor = (alert) => {
        switch (alert) {
            case 'frost_risk':
                return 'bg-blue-100 text-blue-800';
            case 'drought_warning':
                return 'bg-red-100 text-red-800';
            case 'pest_favorable':
                return 'bg-orange-100 text-orange-800';
            case 'ideal_planting':
                return 'bg-green-100 text-green-800';
            case 'harvest_time':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {getWeatherIcon(forecast.weather_condition)}
                        <div>
                            <h3 className="text-lg font-semibold">{forecast.location}</h3>
                            <p className="text-sm text-gray-600">
                                {new Date(forecast.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            {forecast.temperature_max}°C
                        </div>
                        <div className="text-sm text-gray-600">
                            min {forecast.temperature_min}°C
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <div>
                            <p className="text-xs text-gray-500">{text[language].humidity}</p>
                            <p className="font-semibold">{forecast.humidity}%</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <CloudRain className="w-4 h-4 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-500">{text[language].precipitation}</p>
                            <p className="font-semibold">{forecast.precipitation || 0}mm</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500">{text[language].wind}</p>
                            <p className="font-semibold">{forecast.wind_speed || 0} km/h</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-purple-500" />
                        <div>
                            <p className="text-xs text-gray-500">{text[language].pressure}</p>
                            <p className="font-semibold">{forecast.pressure || 0} hPa</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-orange-500" />
                        <div>
                            <p className="text-xs text-gray-500">{text[language].uvIndex}</p>
                            <p className="font-semibold">{forecast.uv_index || 0}</p>
                        </div>
                    </div>

                    {forecast.precipitation_probability && (
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-indigo-500" />
                            <div>
                                <p className="text-xs text-gray-500">Prob. Chuva</p>
                                <p className="font-semibold">{forecast.precipitation_probability}%</p>
                            </div>
                        </div>
                    )}
                </div>

                {forecast.agricultural_alert && (
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-medium">{text[language].agricultural}</span>
                        </div>
                        <Badge className={getAlertColor(forecast.agricultural_alert)}>
                            {text[language].alerts[forecast.agricultural_alert] || forecast.agricultural_alert}
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}