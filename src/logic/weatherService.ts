export interface WeatherData {
    temperature: number;
    condition: string;
}

export const getTemperature = async (city: string): Promise<WeatherData | null> => {
    try {
        // 1. Geocoding to get lat/long
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) return null;

        const { latitude, longitude } = geoData.results[0];

        // 2. Fetch weather for coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (!weatherData.current_weather) return null;

        return {
            temperature: Math.round(weatherData.current_weather.temperature),
            condition: getWeatherCondition(weatherData.current_weather.weathercode),
        };
    } catch (error) {
        console.error("Weather fetch failed:", error);
        return null;
    }
};

const getWeatherCondition = (code: number): string => {
    // Simple mapping based on WMO Weather interpretation codes
    if (code === 0) return "Clear Skies";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rain Showers";
    if (code <= 99) return "Thunderstorm";
    return "Variable";
};
