
// WeatherService for fetching weather data from OpenWeatherMap API
// This would typically integrate with a real weather API

export class WeatherService {
    constructor() {
        // In a real implementation, you would get your API key from a secure source.
        // 'process' is not available in the browser, so we'll use a placeholder.
        this.apiKey = 'demo';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    // Get current weather for a location
    async getCurrentWeather(latitude, longitude) {
        try {
            // For demo purposes, return mock data
            // In production, replace with actual API call
            return this.getMockCurrentWeather(latitude, longitude);
        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw error;
        }
    }

    // Get 7-day forecast for a location
    async getForecast(latitude, longitude) {
        try {
            // For demo purposes, return mock data
            // In production, replace with actual API call
            return this.getMockForecast(latitude, longitude);
        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    // Mock current weather data for demo
    getMockCurrentWeather(latitude, longitude) {
        const locations = this.getLocationName(latitude, longitude);
        
        return {
            location: locations,
            latitude,
            longitude,
            date: new Date().toISOString().split('T')[0],
            temperature_max: Math.round(25 + Math.random() * 10),
            temperature_min: Math.round(15 + Math.random() * 8),
            humidity: Math.round(60 + Math.random() * 30),
            precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 20) : 0,
            precipitation_probability: Math.round(Math.random() * 100),
            wind_speed: Math.round(5 + Math.random() * 15),
            wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
            weather_condition: this.getRandomWeatherCondition(),
            uv_index: Math.round(Math.random() * 11),
            pressure: Math.round(1000 + Math.random() * 50),
            agricultural_alert: this.getRandomAlert()
        };
    }

    // Mock 7-day forecast data
    getMockForecast(latitude, longitude) {
        const forecasts = [];
        const location = this.getLocationName(latitude, longitude);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            forecasts.push({
                location,
                latitude,
                longitude,
                date: date.toISOString().split('T')[0],
                temperature_max: Math.round(22 + Math.random() * 12),
                temperature_min: Math.round(12 + Math.random() * 8),
                humidity: Math.round(50 + Math.random() * 40),
                precipitation: Math.random() > 0.6 ? Math.round(Math.random() * 25) : 0,
                precipitation_probability: Math.round(Math.random() * 100),
                wind_speed: Math.round(3 + Math.random() * 20),
                wind_direction: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
                weather_condition: this.getRandomWeatherCondition(),
                uv_index: Math.round(Math.random() * 11),
                pressure: Math.round(995 + Math.random() * 60),
                agricultural_alert: i === 0 ? this.getRandomAlert() : null
            });
        }
        
        return forecasts;
    }

    getLocationName(latitude, longitude) {
        // Mock location mapping based on coordinates
        // In production, use reverse geocoding
        const locations = [
            { lat: -15.6014, lng: -56.0979, name: "Cuiabá, MT" },
            { lat: -25.4284, lng: -49.2733, name: "Curitiba, PR" },
            { lat: -16.6799, lng: -49.2550, name: "Goiânia, GO" },
            { lat: -19.8157, lng: -43.9542, name: "Belo Horizonte, MG" },
            { lat: -23.5505, lng: -46.6333, name: "São Paulo, SP" },
            { lat: -30.0346, lng: -51.2177, name: "Porto Alegre, RS" },
            { lat: -12.9714, lng: -38.5014, name: "Salvador, BA" }
        ];

        // Find closest location
        let closest = locations[0];
        let minDistance = this.calculateDistance(latitude, longitude, closest.lat, closest.lng);
        
        for (const location of locations) {
            const distance = this.calculateDistance(latitude, longitude, location.lat, location.lng);
            if (distance < minDistance) {
                minDistance = distance;
                closest = location;
            }
        }
        
        return closest.name;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
    }

    getRandomWeatherCondition() {
        const conditions = [
            'Ensolarado', 'Parcialmente nublado', 'Nublado', 
            'Chuva leve', 'Chuva moderada', 'Chuva forte',
            'Céu limpo', 'Neblina'
        ];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    getRandomAlert() {
        const alerts = [
            'ideal_planting', 'frost_risk', 'drought_warning', 
            'pest_favorable', 'harvest_time', null, null, null
        ];
        return alerts[Math.floor(Math.random() * alerts.length)];
    }

    // Real API implementation would look like this:
    /*
    async getCurrentWeatherAPI(latitude, longitude) {
        const response = await fetch(
            `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric&lang=pt_br`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        return {
            location: `${data.name}, ${data.sys.country}`,
            latitude: data.coord.lat,
            longitude: data.coord.lon,
            date: new Date().toISOString().split('T')[0],
            temperature_max: Math.round(data.main.temp_max),
            temperature_min: Math.round(data.main.temp_min),
            humidity: data.main.humidity,
            precipitation: data.rain ? data.rain['1h'] || 0 : 0,
            wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            wind_direction: this.degreesToDirection(data.wind.deg),
            weather_condition: data.weather[0].description,
            pressure: data.main.pressure,
            uv_index: 0 // Would need separate UV API call
        };
    }
    */

    degreesToDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degrees / 22.5) % 16];
    }
}
