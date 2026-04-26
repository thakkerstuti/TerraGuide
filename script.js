/**
 * TerraGuide - Premium Weather Application
 * Features: City search, Geolocation, Dynamic Themes, Search History
 */

// --- CONFIGURATION ---
// Replace with your own OpenWeatherMap API Key
const API_KEY = 'YOUR_API_KEY'; 
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
    if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

getLocationBtn.addEventListener('click', autoDetectLocation);

// --- FUNCTIONS ---

/**
 * Fetch weather data from API
 * @param {string} query - City name or coordinates
 * @param {boolean} isCoords - Whether query is lat/lon object
 */
async function fetchWeather(query, isCoords = false) {
    showLoading();
    
    let url = '';
    if (isCoords) {
        url = `${API_BASE_URL}?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=metric`;
    } else {
        url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'City not found');
        }

        displayWeather(data);
        if (!isCoords) addToHistory(data.name);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Display weather data in the UI
 * @param {Object} data - API response data
 */
function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    const { temp, humidity } = main;
    const { description, icon, main: conditionMain } = weather[0];
    const { speed } = wind;

    // Update UI elements
    cityNameEl.textContent = `${name}, ${sys.country}`;
    temperatureEl.textContent = Math.round(temp);
    conditionEl.textContent = description;
    humidityEl.textContent = `${humidity}%`;
    windSpeedEl.textContent = `${speed} m/s`;
    
    // Weather Icon (using OWM default icons)
    weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    weatherIconEl.alt = description;

    // Update background theme
    updateTheme(conditionMain);
    
    // Manage visibility
    loadingSpinner.classList.add('hidden');
    errorMessage.classList.add('hidden');
    initialState.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

/**
 * Update dynamic background theme based on weather condition
 * @param {string} condition - Main weather condition (e.g., Clear, Clouds, Rain)
 */
function updateTheme(condition) {
    document.body.className = ''; // Reset
    const cond = condition.toLowerCase();
    
    if (cond.includes('clear')) {
        document.body.classList.add('theme-clear');
    } else if (cond.includes('cloud')) {
        document.body.classList.add('theme-clouds');
    } else if (cond.includes('rain') || cond.includes('drizzle')) {
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
 * Detect user's current location using Geolocation API
 */
function autoDetectLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                fetchWeather(coords, true);
            },
            (error) => {
                console.warn('Geolocation denied or failed:', error.message);
                // If it fails, we just stay in initial state or do nothing
                if (initialState.classList.contains('hidden') && weatherDisplay.classList.contains('hidden')) {
                    initialState.classList.remove('hidden');
                }
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

/**
 * Handle Search History with LocalStorage
 */
function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    
    // Remove if already exists (to bring it to top)
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to start
    history.unshift(city);
    
    // Keep only last 5
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
        tag.onclick = () => fetchWeather(city);
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
    errorMessage.classList.remove('hidden');
    errorText.textContent = message;
}

function updateDate() {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateTodayEl.textContent = new Date().toLocaleDateString('en-US', options);
}
