/**
 * TerraGuide - Radiant Weather Experience
 * Design: Radiant Ombre + Glassmorphism
 * Features: Day/Night dynamic icons, Morning/Evening themes
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

async function fetchWeatherByCity(city) {
    showLoading();
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Try another location.');
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        await fetchWeatherData(latitude, longitude, name, country);
        addToHistory(name);
        cityInput.value = '';
    } catch (error) {
        showError(error.message);
    }
}

async function fetchWeatherData(lat, lon, cityName, country = '') {
    showLoading();
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
        const res = await fetch(weatherUrl);
        const data = await res.json();

        if (!data.current_weather) {
            throw new Error('Weather data unavailable.');
        }

        displayWeather({
            name: cityName,
            country: country,
            temp: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            conditionCode: data.current_weather.weathercode,
            isDay: data.current_weather.is_day,
            humidity: data.hourly ? data.hourly.relativehumidity_2m[0] : '--'
        });
    } catch (error) {
        showError(error.message);
    }
}

function displayWeather(data) {
    const { name, temp, windspeed, conditionCode, isDay, humidity } = data;
    const condition = getWeatherCondition(conditionCode, isDay);

    cityNameEl.textContent = name;
    temperatureEl.textContent = `${Math.round(temp)}°`;
    conditionEl.textContent = condition.text;
    humidityEl.textContent = humidity;
    windSpeedEl.textContent = windspeed;
    
    weatherIconEl.src = condition.icon;
    weatherIconEl.alt = condition.text;

    // Transition Background based on time and condition
    updateTheme(condition.text, isDay);
    
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.add('hidden');
    initialState.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

/**
 * Map codes to specific Day/Night icons
 */
function getWeatherCondition(code, isDay) {
    const suffix = isDay ? 'd' : 'n';
    const conditions = {
        0: { text: isDay ? 'Sunny' : 'Clear Night', icon: `https://openweathermap.org/img/wn/01${suffix}@4x.png` },
        1: { text: isDay ? 'Mainly Sunny' : 'Clear', icon: `https://openweathermap.org/img/wn/02${suffix}@4x.png` },
        2: { text: 'Partly Cloudy', icon: `https://openweathermap.org/img/wn/03${suffix}@4x.png` },
        3: { text: 'Overcast', icon: `https://openweathermap.org/img/wn/04${suffix}@4x.png` },
        45: { text: 'Foggy', icon: `https://openweathermap.org/img/wn/50${suffix}@4x.png` },
        61: { text: 'Rainy', icon: `https://openweathermap.org/img/wn/10${suffix}@4x.png` },
        63: { text: 'Moderate Rain', icon: `https://openweathermap.org/img/wn/10${suffix}@4x.png` },
        65: { text: 'Heavy Rain', icon: `https://openweathermap.org/img/wn/09${suffix}@4x.png` },
        71: { text: 'Snowy', icon: `https://openweathermap.org/img/wn/13${suffix}@4x.png` },
        95: { text: 'Thunderstorm', icon: `https://openweathermap.org/img/wn/11${suffix}@4x.png` }
    };
    return conditions[code] || { text: 'Variable', icon: `https://openweathermap.org/img/wn/04${suffix}@4x.png` };
}

/**
 * Radiant Background Logic for Morning, Evening, Day, and Night
 */
function updateTheme(condition, isDay) {
    const spheres = document.querySelectorAll('.ombre-sphere');
    const hour = new Date().getHours();
    
    // Default Time-based colors
    let sphere1 = 'conic-gradient(from 180deg at 50% 50%, #4facfe, #00f2fe)';
    let sphere2 = 'conic-gradient(from 0deg at 50% 50%, #f093fb, #f5576c)';

    if (!isDay) {
        // Night Theme
        sphere1 = 'conic-gradient(from 180deg at 50% 50%, #0f0c29, #302b63)';
        sphere2 = 'conic-gradient(from 0deg at 50% 50%, #24243e, #0f0c29)';
    } else if (hour >= 5 && hour < 9) {
        // Morning Theme
        sphere1 = 'conic-gradient(from 180deg at 50% 50%, #ff9a9e, #fad0c4)';
        sphere2 = 'conic-gradient(from 0deg at 50% 50%, #fbc2eb, #a6c1ee)';
    } else if (hour >= 17 && hour < 20) {
        // Evening Theme
        sphere1 = 'conic-gradient(from 180deg at 50% 50%, #ff0844, #ffb199)';
        sphere2 = 'conic-gradient(from 0deg at 50% 50%, #667eea, #764ba2)';
    }

    // Weather adjustments override
    const cond = condition.toLowerCase();
    if (cond.includes('rain')) {
        sphere1 = 'conic-gradient(from 180deg at 50% 50%, #203a43, #2c5364)';
        sphere2 = 'conic-gradient(from 0deg at 50% 50%, #0f2027, #203a43)';
    }

    spheres[0].style.background = sphere1;
    spheres[1].style.background = sphere2;
}

function autoDetectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude, 'My Territory');
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
        const tag = document.createElement('div');
        tag.className = 'recent-tag';
        tag.textContent = city;
        tag.onclick = () => fetchWeatherByCity(city);
        recentList.appendChild(tag);
    });
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.add('hidden');
    initialState.classList.add('hidden');
}

function showError(message) {
    loadingSpinner.classList.add('hidden');
    weatherDisplay.classList.add('hidden');
    initialState.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
}

function updateDate() {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    dateTodayEl.textContent = new Date().toLocaleDateString('en-US', options);
}
