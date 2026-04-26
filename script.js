/**
 * TerraGuide - Premium Weather Application
 * Features: City search, Geolocation, Dynamic Themes, Search History
 * Using Open-Meteo API (No Key Required for testing)
 */

// --- DOM ELEMENTS ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const initialState = document.getElementById('initial-state');
const getLocationBtn = document.getElementById('get-location-btn');
const recentList = document.getElementById('recent-list');
const recentContainer = document.getElementById('recent-searches');

// Weather Card Elements
const cityNameEl = document.getElementById('city-name');
const dateTodayEl = document.getElementById('date-today');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('weather-condition');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    loadSearchHistory();
    
    // Auto-detect location on load
    autoDetectLocation();
});

// --- EVENT LISTENERS ---
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeatherByCity(city);
    }
});

getLocationBtn.addEventListener('click', autoDetectLocation);

// --- FUNCTIONS ---

/**
 * Fetch weather by city name (Geocoding + Weather API)
 */
async function fetchWeatherByCity(city) {
    showLoading();
    try {
        // 1. Geocoding API to get coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please try another name.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        await fetchWeatherData(latitude, longitude, `${name}, ${country || ''}`);
        addToHistory(name);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Fetch weather data by coordinates
 */
async function fetchWeatherData(lat, lon, locationLabel) {
    showLoading();
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
        const res = await fetch(weatherUrl);
        const data = await res.json();

        if (!data.current_weather) {
            throw new Error('Weather data unavailable.');
        }

        displayWeather({
            name: locationLabel,
            temp: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            conditionCode: data.current_weather.weathercode,
            humidity: data.hourly ? data.hourly.relativehumidity_2m[0] : '--'
        });
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Display weather data in the UI
 */
function displayWeather(data) {
    const { name, temp, windspeed, conditionCode, humidity } = data;
    const condition = getWeatherCondition(conditionCode);

    // Update UI elements
    cityNameEl.textContent = name;
    temperatureEl.textContent = Math.round(temp);
    conditionEl.textContent = condition.text;
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${windspeed} km/h`;
    
    // Weather Icon (using dynamic icons based on condition)
    weatherIconEl.src = condition.icon;
    weatherIconEl.alt = condition.text;

    // Update background theme
    updateTheme(condition.text);
    
    // Manage visibility
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.add('hidden');
    initialState.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

/**
 * Map Open-Meteo WMO codes to human-readable text and icons
 */
function getWeatherCondition(code) {
    const conditions = {
        0: { text: 'Clear Sky', icon: 'https://openweathermap.org/img/wn/01d@4x.png' },
        1: { text: 'Mainly Clear', icon: 'https://openweathermap.org/img/wn/02d@4x.png' },
        2: { text: 'Partly Cloudy', icon: 'https://openweathermap.org/img/wn/03d@4x.png' },
        3: { text: 'Overcast', icon: 'https://openweathermap.org/img/wn/04d@4x.png' },
        45: { text: 'Foggy', icon: 'https://openweathermap.org/img/wn/50d@4x.png' },
        61: { text: 'Slight Rain', icon: 'https://openweathermap.org/img/wn/10d@4x.png' },
        63: { text: 'Moderate Rain', icon: 'https://openweathermap.org/img/wn/10d@4x.png' },
        65: { text: 'Heavy Rain', icon: 'https://openweathermap.org/img/wn/09d@4x.png' },
        71: { text: 'Slight Snow', icon: 'https://openweathermap.org/img/wn/13d@4x.png' },
        95: { text: 'Thunderstorm', icon: 'https://openweathermap.org/img/wn/11d@4x.png' }
    };

    // Default to cloudy if code not found
    return conditions[code] || { text: 'Cloudy', icon: 'https://openweathermap.org/img/wn/04d@4x.png' };
}

/**
 * Update dynamic background theme
 */
function updateTheme(condition) {
    document.body.className = ''; 
    const cond = condition.toLowerCase();
    
    if (cond.includes('clear')) {
        document.body.classList.add('theme-clear');
    } else if (cond.includes('cloud') || cond.includes('overcast')) {
        document.body.classList.add('theme-clouds');
    } else if (cond.includes('rain')) {
        document.body.classList.add('theme-rain');
    } else if (cond.includes('snow')) {
        document.body.classList.add('theme-snow');
    } else if (cond.includes('thunder')) {
        document.body.classList.add('theme-thunderstorm');
    } else {
        document.body.classList.add('theme-default');
    }
}

/**
 * Detect user's current location
 */
function autoDetectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude, 'Current Location');
            },
            (error) => {
                console.warn('Geolocation denied:', error.message);
                if (weatherDisplay.classList.contains('hidden')) {
                    initialState.classList.remove('hidden');
                }
            }
        );
    }
}

/**
 * Handle Search History
 */
function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    history = history.slice(0, 5);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    loadSearchHistory();
}

function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (history.length === 0) {
        recentContainer.classList.add('hidden');
        return;
    }
    recentContainer.classList.remove('hidden');
    recentList.innerHTML = '';
    history.forEach(city => {
        const tag = document.createElement('span');
        tag.className = 'recent-tag';
        tag.textContent = city;
        tag.onclick = () => fetchWeatherByCity(city);
        recentList.appendChild(tag);
    });
}

// --- UTILITY FUNCTIONS ---

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.add('hidden');
    initialState.classList.add('hidden');
}

function showError(message) {
    loadingSpinner.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
    initialState.classList.add('hidden'); // Explicitly hide initial state
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
}

function updateDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateTodayEl.textContent = new Date().toLocaleDateString('en-US', options);
}
