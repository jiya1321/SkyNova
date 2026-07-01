// ============================================
// Weather Dashboard - Dashboard JavaScript
// WeatherAPI.com Integration and Dashboard Logic
// ============================================

// API Configuration
const API_KEY = "05387861a48f43c8ae740000260107";
const BASE_URL = "https://api.weatherapi.com/v1";

// DOM Elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const citySearch = document.getElementById('citySearch');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');

// Weather Display Elements
const greeting = document.getElementById('greeting');
const currentTime = document.getElementById('currentTime');
const cityName = document.getElementById('cityName');
const countryName = document.getElementById('countryName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const heroBackground = document.getElementById('heroBackground');

// Weather Detail Elements
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uvIndex');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const airQuality = document.getElementById('airQuality');

// Forecast Elements
const forecastCards = document.getElementById('forecastCards');
const hourlyForecast = document.getElementById('hourlyForecast');
const recentSearches = document.getElementById('recentSearches');
const clearAllBtn = document.getElementById('clearAllBtn');
const detectLocationBtn = document.getElementById('detectLocationBtn');

// User Elements
const displayUsername = document.getElementById('displayUsername');
const userAvatar = document.getElementById('userAvatar');

// ============================================
// Network Status Monitoring
// ============================================
window.addEventListener('online', () => {
    showToast('You are back online', 'success');
});

window.addEventListener('offline', () => {
    showToast('You are offline. Please check your internet connection.', 'warning');
});

// ============================================
// Initialize Dashboard
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    initializeTheme();
    initializeUser();
    updateGreeting();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    loadRecentSearches();
    
    // Check initial network status
    if (!navigator.onLine) {
        showToast('No internet connection detected', 'warning');
    }
    
    // Load default city weather
    fetchWeatherData('London');
});

// ============================================
// Authentication Check
// ============================================
function checkAuthentication() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'index.html';
    }
}

// ============================================
// Initialize User
// ============================================
function initializeUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        displayUsername.textContent = loggedInUser.username;
    }
}

// ============================================
// Theme Toggle
// ============================================
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// ============================================
// Sidebar Toggle
// ============================================
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// ============================================
// Navigation
// ============================================
const navItems = document.querySelectorAll('.nav-item[data-section]');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Close sidebar on mobile
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});

// ============================================
// Logout
// ============================================
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('rememberMe');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
});

// ============================================
// Update Greeting Based on Time
// ============================================
function updateGreeting() {
    const hour = new Date().getHours();
    let greetingText = 'Good Morning!';
    
    if (hour >= 12 && hour < 17) {
        greetingText = 'Good Afternoon!';
    } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good Evening!';
    } else if (hour >= 21 || hour < 5) {
        greetingText = 'Good Night!';
    }
    
    greeting.textContent = greetingText;
}

// ============================================
// Update Current Time
// ============================================
function updateCurrentTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentTime.textContent = now.toLocaleDateString('en-US', options);
}

// ============================================
// Fetch Weather Data (WeatherAPI.com)
// ============================================
async function fetchWeatherData(city) {
    showLoading(true);
    
    try {
        // Validate input
        if (!city || city.trim() === '') {
            throw new Error('Please enter a city name');
        }

        // Check for internet connection
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network.');
        }

        // Fetch weather data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city.trim())}&days=7&aqi=yes&alerts=no`;
        
        const response = await fetch(url, { signal: controller.signal });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Check for API error
        if (data.error) {
            throw new Error(data.error.message || 'City not found');
        }
        
        // Validate data structure
        if (!data.location || !data.current || !data.forecast) {
            throw new Error('Invalid weather data received from API');
        }
        
        // Update UI
        updateCurrentWeather(data);
        updateWeatherDetails(data);
        updateForecast(data);
        updateHourlyForecast(data);
        updateWeatherBackground(data.current.condition.text);
        
        // Save to recent searches
        saveRecentSearch(data.location.name);
        
        showLoading(false);
        showToast(`Weather data loaded for ${data.location.name}`, 'success');
        
    } catch (error) {
        showLoading(false);
        
        // Handle specific error types
        if (error.name === 'AbortError') {
            showToast('Request timeout. Server unavailable.', 'error');
        } else {
            showToast(error.message || 'Failed to fetch weather data', 'error');
        }
        
        console.error('Weather API Error:', error);
    }
}

// ============================================
// Update Current Weather Display
// ============================================
function updateCurrentWeather(data) {
    if (!data || !data.location || !data.current) {
        console.error('Invalid weather data for current weather');
        return;
    }
    
    cityName.textContent = data.location.name;
    countryName.textContent = data.location.country || '--';
    
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    
    // Get weather emoji based on condition
    const weatherEmoji = getWeatherEmoji(data.current.condition.text);
    weatherIcon.innerHTML = `<span class="icon-emoji">${weatherEmoji}</span>`;
    
    temperature.textContent = Math.round(data.current.temp_c);
    weatherCondition.textContent = capitalizeFirst(data.current.condition.text);
    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
}

// ============================================
// Update Weather Details
// ============================================
function updateWeatherDetails(data) {
    if (!data || !data.current) {
        console.error('Invalid weather data for details');
        return;
    }
    
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    pressure.textContent = `${data.current.pressure_mb} hPa`;
    visibility.textContent = `${data.current.vis_km} km`;
    
    // Sunrise and Sunset from forecast data
    if (data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) {
        const astro = data.forecast.forecastday[0].astro;
        sunrise.textContent = astro.sunrise || '--';
        sunset.textContent = astro.sunset || '--';
    } else {
        sunrise.textContent = '--';
        sunset.textContent = '--';
    }
    
    // UV Index
    uvIndex.textContent = data.current.uv || '--';
    
    // Air Quality
    if (data.current.air_quality) {
        const aqi = data.current.air_quality['us-epa-index'] || data.current.air_quality.pm2_5 || 50;
        airQuality.textContent = calculateAirQuality(aqi);
    } else {
        airQuality.textContent = 'Good';
    }
}

// ============================================
// Update 7-Day Forecast
// ============================================
function updateForecast(data) {
    forecastCards.innerHTML = '';
    
    if (!data.forecast || !data.forecast.forecastday || !Array.isArray(data.forecast.forecastday)) {
        forecastCards.innerHTML = '<p class="no-searches">Forecast data unavailable</p>';
        return;
    }
    
    // Get forecast days (skip today, get next 7 days)
    const forecastDays = data.forecast.forecastday.slice(1, 8);
    
    if (forecastDays.length === 0) {
        forecastCards.innerHTML = '<p class="no-searches">Forecast data unavailable</p>';
        return;
    }
    
    forecastDays.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const weatherEmoji = getWeatherEmoji(day.day.condition.text);
        const tempMax = Math.round(day.day.maxtemp_c);
        const tempMin = Math.round(day.day.mintemp_c);
        const description = capitalizeFirst(day.day.condition.text);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${formattedDate}</div>
            <div class="forecast-icon">${weatherEmoji}</div>
            <div class="forecast-temps">
                <span class="forecast-temp max">${tempMax}°</span>
                <span class="forecast-temp min">${tempMin}°</span>
            </div>
            <div class="forecast-desc">${description}</div>
        `;
        
        forecastCards.appendChild(card);
    });
}

// ============================================
// Update Hourly Forecast
// ============================================
function updateHourlyForecast(data) {
    hourlyForecast.innerHTML = '';
    
    if (!data.forecast || !data.forecast.forecastday || !data.forecast.forecastday[0] || !data.forecast.forecastday[0].hour) {
        hourlyForecast.innerHTML = '<p class="no-searches">Hourly forecast unavailable</p>';
        return;
    }
    
    // Get next 24 hours from today's forecast
    const currentHour = new Date().getHours();
    const hourlyData = data.forecast.forecastday[0].hour;
    const hourlyForecasts = hourlyData.slice(currentHour, currentHour + 24);
    
    hourlyForecasts.forEach((hour, index) => {
        const time = new Date(hour.time);
        const formattedTime = time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const weatherEmoji = getWeatherEmoji(hour.condition.text);
        const temp = Math.round(hour.temp_c);
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="hourly-time">${formattedTime}</div>
            <div class="hourly-icon">${weatherEmoji}</div>
            <div class="hourly-temp">${temp}°</div>
        `;
        
        hourlyForecast.appendChild(card);
    });
}

// ============================================
// Update Weather Background
// ============================================
function updateWeatherBackground(conditionText) {
    heroBackground.className = 'hero-background';
    
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;
    
    if (isNight) {
        heroBackground.classList.add('night');
    } else {
        const condition = conditionText.toLowerCase();
        
        if (condition.includes('clear') || condition.includes('sunny')) {
            heroBackground.classList.add('sunny');
        } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunder') || condition.includes('shower')) {
            heroBackground.classList.add('rain');
        } else if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
            heroBackground.classList.add('cloudy');
        } else if (condition.includes('snow') || condition.includes('blizzard')) {
            heroBackground.classList.add('snow');
        } else {
            heroBackground.classList.add('sunny');
        }
    }
}

// ============================================
// Get Weather Emoji
// ============================================
function getWeatherEmoji(conditionText) {
    const condition = conditionText.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;
    
    if (condition.includes('clear') || condition.includes('sunny')) {
        return isNight ? '🌙' : '☀️';
    } else if (condition.includes('cloud')) {
        return isNight ? '☁️' : '⛅';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
        return '🌧️';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
        return '⛈️';
    } else if (condition.includes('snow') || condition.includes('blizzard')) {
        return '❄️';
    } else if (condition.includes('mist') || condition.includes('fog')) {
        return '🌫️';
    } else if (condition.includes('haze')) {
        return '🌥️';
    } else {
        return '🌤️';
    }
}

// ============================================
// Calculate Air Quality
// ============================================
function calculateAirQuality(aqi) {
    if (typeof aqi === 'object' && aqi !== null) {
        // If it's an air quality object, use pm2.5
        aqi = aqi.pm2_5 || 50;
    }
    
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
}

// ============================================
// Capitalize First Letter
// ============================================
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// Search Functionality
// ============================================
searchBtn.addEventListener('click', () => {
    const city = citySearch.value.trim();
    if (city) {
        fetchWeatherData(city);
        citySearch.value = '';
    } else {
        showToast('Please enter a city name', 'warning');
    }
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// ============================================
// Unified Location Detection Function
// ============================================
async function fetchWeatherByLocation(lat, lon) {
    showLoading(true);
    
    try {
        // Check for internet connection
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network.');
        }

        // Fetch weather data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=no`;
        
        const response = await fetch(url, { signal: controller.signal });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Check for API error
        if (data.error) {
            throw new Error(data.error.message || 'Location not found');
        }
        
        // Validate data structure
        if (!data.location || !data.current || !data.forecast) {
            throw new Error('Invalid weather data received from API');
        }
        
        // Update UI
        updateCurrentWeather(data);
        updateWeatherDetails(data);
        updateForecast(data);
        updateHourlyForecast(data);
        updateWeatherBackground(data.current.condition.text);
        
        // Save to recent searches
        saveRecentSearch(data.location.name);
        
        showLoading(false);
        showToast(`Weather loaded for ${data.location.name}`, 'success');
        
        return data;
        
    } catch (error) {
        showLoading(false);
        
        if (error.name === 'AbortError') {
            showToast('Request timeout. Server unavailable.', 'error');
        } else {
            showToast(error.message || 'Failed to fetch weather data', 'error');
        }
        
        console.error('Location Weather Error:', error);
        throw error;
    }
}

// ============================================
// Current Location Detection (Top Nav Button)
// ============================================
locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                await fetchWeatherByLocation(lat, lon);
            },
            (error) => {
                let errorMessage = 'Unable to get your location.';
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                    default:
                        errorMessage = 'Unknown error occurred while getting location.';
                }
                
                showToast(errorMessage, 'error');
                console.error('Geolocation Error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        showToast('Geolocation is not supported by your browser', 'warning');
    }
});

// ============================================
// Recent Searches
// ============================================
function getRecentSearches() {
    const searches = localStorage.getItem('recentSearches');
    return searches ? JSON.parse(searches) : [];
}

function saveRecentSearch(city) {
    let searches = getRecentSearches();
    
    // Remove if already exists
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    searches.unshift(city);
    
    // Keep only last 5
    searches = searches.slice(0, 5);
    
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    loadRecentSearches();
}

function loadRecentSearches() {
    const searches = getRecentSearches();
    recentSearches.innerHTML = '';
    
    if (searches.length === 0) {
        recentSearches.innerHTML = '<p class="no-searches">No recent searches</p>';
        if (clearAllBtn) clearAllBtn.style.display = 'none';
        return;
    }
    
    // Show clear all button if there are searches
    if (clearAllBtn) clearAllBtn.style.display = 'inline-block';
    
    searches.forEach(city => {
        const tag = document.createElement('span');
        tag.className = 'search-tag';
        tag.innerHTML = `
            <span class="clock-icon">🕐</span>
            ${city}
            <span class="remove" data-city="${city}">×</span>
        `;
        
        tag.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove')) {
                removeRecentSearch(city);
            } else {
                fetchWeatherData(city);
            }
        });
        
        recentSearches.appendChild(tag);
    });
}

function removeRecentSearch(city) {
    let searches = getRecentSearches();
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    localStorage.setItem('recentSearches', JSON.stringify(searches));
    loadRecentSearches();
    
    // Hide clear all button if no searches left
    if (searches.length === 0 && clearAllBtn) {
        clearAllBtn.style.display = 'none';
    }
}

// ============================================
// Loading Overlay
// ============================================
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✕';
    else if (type === 'warning') icon = '⚠';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// ============================================
// Keyboard Accessibility
// ============================================
document.addEventListener('keydown', (e) => {
    // Escape key closes sidebar
    if (e.key === 'Escape') {
        sidebar.classList.remove('active');
    }
    
    // Ctrl/Cmd + K focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        citySearch.focus();
    }
});

// ============================================
// Notification Button (Placeholder)
// ============================================
document.querySelector('.notification-btn').addEventListener('click', () => {
    showToast('No new notifications', 'success');
});

// ============================================
// Clear All Recent Searches
// ============================================
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
        localStorage.removeItem('recentSearches');
        loadRecentSearches();
        showToast('All recent searches cleared', 'success');
    });
}

// ============================================
// Detect Location Button (Location Banner)
// ============================================
if (detectLocationBtn) {
    detectLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    await fetchWeatherByLocation(lat, lon);
                },
                (error) => {
                    let errorMessage = 'Unable to get your location.';
                    
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location services.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                        default:
                            errorMessage = 'Unknown error occurred while getting location.';
                    }
                    
                    showToast(errorMessage, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            showToast('Geolocation is not supported by your browser', 'error');
        }
    });
}

// ============================================
// Premium Upgrade Button (Placeholder)
// ============================================
document.querySelector('.upgrade-btn')?.addEventListener('click', () => {
    showToast('Premium upgrade coming soon!', 'warning');
});

// ============================================
// View More Insights Button (Placeholder)
// ============================================
document.querySelector('.view-more-btn')?.addEventListener('click', () => {
    showToast('More AI insights coming soon!', 'warning');
});

// ============================================
// Zoom Controls (Placeholder)
// ============================================
document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('Map zoom controls coming soon!', 'warning');
    });
});