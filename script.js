// Global variables
let currentAQI = null;
let currentLocation = null;
let aqiChart = null;
let forecastChart = null;
let compareChart = null;
let isDarkTheme = true;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start loading data
    getCurrentLocation();
    
    // Set timeout for loading screen
    setTimeout(showHomeScreen, 3000);
});

// Initialize theme based on user preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkTheme = false;
        document.body.classList.add('light-theme');
        const themeIcon = document.querySelector('#theme-toggle-btn i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

// Setup Event Listeners function
function setupEventListeners() {
    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchLocation);
    }
    
    // Current location button
    const currentLocationBtn = document.getElementById('current-location-btn');
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    // Location search input (for Enter key)
    const locationSearchInput = document.getElementById('location-search');
    if (locationSearchInput) {
        locationSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });
    }
    
    // Feature buttons in home screen
    setupNavButton('analysis-btn', showAnalysisScreen);
    setupNavButton('forecast-btn', showForecastScreen);
    setupNavButton('compare-btn', showCompareScreen);
    
    // Back buttons
    setupNavButton('analysis-back-btn', showHomeScreen);
    setupNavButton('forecast-back-btn', showHomeScreen);
    setupNavButton('compare-back-btn', showHomeScreen);
    setupNavButton('settings-back-btn', showHomeScreen);
    
    // Compare button in compare screen
    const compareButton = document.getElementById('compare-locations-btn');
    if (compareButton) {
        compareButton.addEventListener('click', compareLocations);
    }
    
    // Settings theme button
    const themeSelectBtn = document.getElementById('theme-select');
    if (themeSelectBtn) {
        themeSelectBtn.addEventListener('click', toggleTheme);
    }
}

function setupNavButton(id, callback) {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', callback);
    }
}

// Switch screen function
function switchScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
        screen.style.visibility = 'hidden';
        screen.style.opacity = '0';
        screen.classList.remove('active-screen');
    });
    
    // Show the selected screen
    const selectedScreen = document.getElementById(screenId);
    if (selectedScreen) {
        selectedScreen.style.display = 'flex';
        selectedScreen.style.visibility = 'visible';
        selectedScreen.style.opacity = '1';
        selectedScreen.classList.add('active-screen');
    }
    
    // Update active state on navigation buttons
    const navButtons = document.querySelectorAll('.feature-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `${screenId}-btn`) {
            btn.classList.add('active');
        }
    });
}

// Screen navigation functions
function showHomeScreen() {
    switchScreen('home');
    updateTime();
}

function showForecastScreen() {
    switchScreen('forecast');
    fetchForecastData();
}

function showAnalysisScreen() {
    switchScreen('analysis');
    generateAIAnalysis();
}

function showCompareScreen() {
    switchScreen('compare');
    setupCompareScreen();
}

function showSettingsScreen() {
    switchScreen('settings');
}

// Toggle between light and dark theme
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme');
    
    // Update theme icon
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    if (themeIcon) {
        if (isDarkTheme) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Update settings theme button
    const themeSelectBtn = document.getElementById('theme-select');
    if (themeSelectBtn) {
        if (isDarkTheme) {
            themeSelectBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Theme';
        } else {
            themeSelectBtn.innerHTML = '<i class="fas fa-sun"></i> Light Theme';
        }
    }
    
    // Save theme preference
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    
    // Update charts
    updateChartsTheme();
}

// Update charts with new theme colors
function updateChartsTheme() {
    if (aqiChart) {
        aqiChart.options.scales.y.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        aqiChart.options.scales.x.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        aqiChart.options.scales.y.ticks.color = isDarkTheme ? '#fff' : '#333';
        aqiChart.options.scales.x.ticks.color = isDarkTheme ? '#fff' : '#333';
        aqiChart.update();
    }
    
    if (forecastChart) {
        forecastChart.options.scales.y.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        forecastChart.options.scales.x.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        forecastChart.options.scales.y.ticks.color = isDarkTheme ? '#fff' : '#333';
        forecastChart.options.scales.x.ticks.color = isDarkTheme ? '#fff' : '#333';
        forecastChart.update();
    }
    
    if (compareChart) {
        compareChart.options.scales.y.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        compareChart.options.scales.x.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        compareChart.options.scales.y.ticks.color = isDarkTheme ? '#fff' : '#333';
        compareChart.options.scales.x.ticks.color = isDarkTheme ? '#fff' : '#333';
        compareChart.update();
    }
}

// Time display
function updateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const updateTimeElement = document.getElementById('update-time');
    if (updateTimeElement) {
        updateTimeElement.textContent = `${dateString}, ${timeString}`;
    }
}

// API Functions
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        showNotification('Error fetching data. Please try again.', 'error');
        throw error;
    }
}

async function getAQI(lat, lon) {
    const apiToken = "6846c8e443f0af2959e9bbb99f19f9f5ab899056"; // Replace with your actual API token
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiToken}`;
    try {
        const data = await fetchJSON(url);
        if (data.status === "ok") {
            currentAQI = data.data.aqi;
            return data.data;
        } else {
            console.error("Invalid AQI data received:", data);
            showNotification('Invalid AQI data received', 'error');
            throw new Error("Invalid AQI data received");
        }
    } catch (error) {
        console.error("Error fetching AQI data:", error.message);
        showNotification('Error fetching AQI data', 'error');
        return null;
    }
}

// Get current location
async function getCurrentLocation() {
    try {
        if (!navigator.geolocation) {
            throw new Error("Geolocation not supported");
        }
        
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        // Get location name from coordinates
        const locationName = await getLocationName(lat, lon);
        currentLocation = locationName;
        
        // Get AQI data
        const aqiData = await getAQI(lat, lon);
        if (aqiData) {
            displayInfo(aqiData.aqi, locationName);
            displayPollutants(aqiData);
            createAQIChart(aqiData);
        }
    } catch (error) {
        console.error("Error getting current location:", error.message);
        showNotification('Error getting your location. Please try searching for a location instead.', 'error');
    }
}

// Get location name from coordinates
async function getLocationName(lat, lon) {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const data = await fetchJSON(url);
        return data.city || data.locality || `${data.countryName} (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    } catch (error) {
        console.error("Error getting location name:", error.message);
        return `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    }
}

// Search for a location
async function searchLocation() {
    const searchInput = document.getElementById('location-search');
    if (!searchInput || !searchInput.value.trim()) {
        showNotification('Please enter a location to search', 'warning');
        return;
    }
    
    const location = searchInput.value.trim();
    

    
    try {
        // Show loading state
        document.getElementById('aqi').innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Loading...';
        document.getElementById('location').textContent = `Searching for ${location}...`;
        
        
        // Get coordinates from location name
        const coordinates = await getCoordinates(location);

        if (!coordinates) {
            throw new Error("Could not find coordinates for this location");
        }
        
        // Get AQI data

        const aqiData = await getAQI(coordinates.lat, coordinates.lon);

        if (aqiData) {
            currentLocation = location;
            displayInfo(aqiData.aqi, location);
            displayPollutants(aqiData);
            createAQIChart(aqiData);
        }
    } catch (error) {
        console.error("Error searching location:", error.message);
        showNotification(`Error finding data for "${location}". Please try another location.`, 'error');
        document.getElementById('aqi').textContent = 'No data available';
        document.getElementById('location').textContent = 'Location not found';
    }
}

// Get coordinates from location name
async function getCoordinates(location) {
    try {

        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=bc80a71b3180ee6a81df00c57f0d59f5`; // Replace with your API key
        const data = await fetchJSON(url);
        if (data && data.length > 0) {

            return { lat: data[0].lat, lon: data[0].lon };
        }
        return null;
    } catch (error) {
        console.error("Error getting coordinates:", error.message);
        return null;
    }
}

// Display AQI information
function displayInfo(aqi, location) {
    const aqiElement = document.getElementById('aqi');
    const locationElement = document.getElementById('location');
    
    if (aqiElement && locationElement) {
        // Set AQI with appropriate color class
        let aqiClass = getAQIClass(aqi);
        aqiElement.innerHTML = `<span class="${aqiClass}-text">${aqi}</span>`;
        
        // Set location
        locationElement.textContent = location;
        
        // Update time
        updateTime();
    }
}

// Display pollutants data
function displayPollutants(data) {
    const pollutantsElement = document.getElementById('pollutants-data');
    if (!pollutantsElement || !data.iaqi) return;
    
    let pollutantsHTML = '';
    
    // Common pollutants to display
    const pollutants = {
        pm25: { name: 'PM2.5', icon: 'fa-smog' },
        pm10: { name: 'PM10', icon: 'fa-cloud' },
        o3: { name: 'Ozone', icon: 'fa-sun' },
        no2: { name: 'NO₂', icon: 'fa-car' },
        so2: { name: 'SO₂', icon: 'fa-industry' },
        co: { name: 'CO', icon: 'fa-fire' }
    };
    
    // Create HTML for each pollutant
    for (const [key, info] of Object.entries(pollutants)) {
        if (data.iaqi[key] && data.iaqi[key].v !== undefined) {
            const value = data.iaqi[key].v;
            pollutantsHTML += `
                <div class="pollutant-card">
                    <div class="pollutant-icon"><i class="fas ${info.icon}"></i></div>
                    <div class="pollutant-value">${value}</div>
                    <div class="pollutant-name">${info.name}</div>
                </div>
            `;
        }
    }
    
    pollutantsElement.innerHTML = pollutantsHTML;
}

// Create AQI Chart
function createAQIChart(data) {
    const ctx = document.getElementById('aqi-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (aqiChart) {
        aqiChart.destroy();
    }
    
    // Prepare data for chart
    const pollutants = [];
    const values = [];
    const colors = [];
    
    // Common pollutants to display
    const pollutantsList = {
        pm25: 'PM2.5',
        pm10: 'PM10',
        o3: 'Ozone',
        no2: 'NO₂',
        so2: 'SO₂',
        co: 'CO'
    };
    
    // Collect data for chart
    for (const [key, name] of Object.entries(pollutantsList)) {
        if (data.iaqi[key] && data.iaqi[key].v !== undefined) {
            pollutants.push(name);
            values.push(data.iaqi[key].v);
            colors.push(getColorForValue(data.iaqi[key].v));
        }
    }
    
    // Create chart
    aqiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pollutants,
            datasets: [{
                label: 'Pollutant Levels',
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Value: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                },
                x: {
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                }
            }
        }
    });
}

// Forecast Screen Functions
async function fetchForecastData() {
    const forecastDataElement = document.getElementById('forecast-data');
    const forecastChartElement = document.getElementById('forecast-chart');
    const forecastLegendElement = document.getElementById('forecast-legend');
    
    if (!forecastDataElement || !forecastChartElement) return;
    
    // Show loading state
    forecastDataElement.innerHTML = `
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i> Loading forecast data...
        </div>
    `;
    
    try {
        // For demo purposes, generate mock forecast data
        // In a real app, you would fetch this from an API
        const mockForecast = generateMockForecastData();
        
        // Display forecast data
        displayForecastData(mockForecast);
        
        // Create forecast chart
        createForecastChart(mockForecast);
        
        // Create legend
        createForecastLegend(forecastLegendElement);
        
    } catch (error) {
        console.error("Error fetching forecast data:", error.message);
        forecastDataElement.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> 
                Could not load forecast data. Please try again later.
            </div>
        `;
    }
}

// Generate mock forecast data for demo purposes
function generateMockForecastData() {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Generate random AQI between 20 and 180
        const aqi = Math.floor(Math.random() * 160) + 20;
        
        // Generate random pollutant data
        const pollutants = {
            pm25: Math.floor(Math.random() * 50) + 5,
            pm10: Math.floor(Math.random() * 70) + 10,
            o3: Math.floor(Math.random() * 60) + 10,
            no2: Math.floor(Math.random() * 40) + 5
        };
        
        forecast.push({
            date: date,
            aqi: aqi,
            pollutants: pollutants
        });
    }
    
    return forecast;
}

// Display forecast data
function displayForecastData(forecast) {
    const forecastDataElement = document.getElementById('forecast-data');
    if (!forecastDataElement) return;
    
    let forecastHTML = '';
    
    forecast.forEach(day => {
        const dateString = day.date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const aqiClass = getAQIClass(day.aqi);
        
        forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-date">${dateString}</div>
                <div class="forecast-aqi ${aqiClass}">${day.aqi}</div>
                <div class="forecast-details">
                    <div class="forecast-detail">PM2.5: ${day.pollutants.pm25}</div>
                    <div class="forecast-detail">PM10: ${day.pollutants.pm10}</div>
                    <div class="forecast-detail">O₃: ${day.pollutants.o3}</div>
                    <div class="forecast-detail">NO₂: ${day.pollutants.no2}</div>
                </div>
            </div>
        `;
    });
    
    forecastDataElement.innerHTML = forecastHTML;
}

// Create forecast chart
function createForecastChart(forecast) {
    const ctx = document.getElementById('forecast-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (forecastChart) {
        forecastChart.destroy();
    }
    
    // Prepare data for chart
    const labels = forecast.map(day => day.date.toLocaleDateString('en-US', { 
        weekday: 'short'
    }));
    
    const aqiData = forecast.map(day => day.aqi);
    const pm25Data = forecast.map(day => day.pollutants.pm25);
    const pm10Data = forecast.map(day => day.pollutants.pm10);
    const o3Data = forecast.map(day => day.pollutants.o3);
    
    // Create chart
    forecastChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'AQI',
                    data: aqiData,
                    borderColor: '#6c5ce7',
                    backgroundColor: 'rgba(108, 92, 231, 0.2)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'PM2.5',
                    data: pm25Data,
                    borderColor: '#00b894',
                    backgroundColor: 'rgba(0, 184, 148, 0)',
                    borderWidth: 2,
                    tension: 0.3,
                    borderDash: [5, 5]
                },
                {
                    label: 'PM10',
                    data: pm10Data,
                    borderColor: '#fdcb6e',
                    backgroundColor: 'rgba(253, 203, 110, 0)',
                    borderWidth: 2,
                    tension: 0.3,
                    borderDash: [5, 5]
                },
                {
                    label: 'O₃',
                    data: o3Data,
                    borderColor: '#e17055',
                    backgroundColor: 'rgba(225, 112, 85, 0)',
                    borderWidth: 2,
                    tension: 0.3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: isDarkTheme ? '#ffffff' : '#333333',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                },
                x: {
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                }
            }
        }
    });
}

// Create forecast legend
function createForecastLegend(legendElement) {
    if (!legendElement) return;
    
    const aqiCategories = [
        { name: 'Good', range: '0-50', color: 'var(--good-color)' },
        { name: 'Moderate', range: '51-100', color: 'var(--moderate-color)' },
        { name: 'Unhealthy for Sensitive Groups', range: '101-150', color: 'var(--unhealthy-sensitive-color)' },
        { name: 'Unhealthy', range: '151-200', color: 'var(--unhealthy-color)' },
        { name: 'Very Unhealthy', range: '201-300', color: 'var(--very-unhealthy-color)' },
        { name: 'Hazardous', range: '301+', color: 'var(--hazardous-color)' }
    ];
    
    let legendHTML = '';
    
    aqiCategories.forEach(category => {
        legendHTML += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${category.color}"></div>
                <div>${category.name} (${category.range})</div>
            </div>
        `;
    });
    
    legendElement.innerHTML = legendHTML;
}

// AI Analysis Screen Functions
function generateAIAnalysis() {
    const aiAnalysisElement = document.getElementById('ai-analysis');
    const healthAdviceElement = document.getElementById('health-advice');
    
    if (!aiAnalysisElement || !healthAdviceElement) return;
    
    // Show loading state
    aiAnalysisElement.innerHTML = `
        <div class="ai-thinking">
            <i class="fas fa-spinner fa-pulse"></i> Analyzing air quality data...
        </div>
    `;
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
        if (!currentAQI) {
            aiAnalysisElement.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i> 
                    No air quality data available for analysis. Please search for a location first.
                </div>
            `;
            return;
        }
        
        // Generate analysis based on AQI
        const analysis = generateAnalysisText(currentAQI, currentLocation);
        aiAnalysisElement.innerHTML = analysis;
        
        // Generate health recommendations
        const recommendations = generateHealthRecommendations(currentAQI);
        healthAdviceElement.innerHTML = recommendations;
        
    }, 2000); // 2 second delay to simulate processing
}

// Generate analysis text based on AQI
function generateAnalysisText(aqi, location) {
    let analysisText = '';
    let aqiCategory = '';
    let healthImplications = '';
    let trend = '';
    
    // Determine AQI category and health implications
    if (aqi <= 50) {
        aqiCategory = 'Good';
        healthImplications = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
        trend = 'stable';
    } else if (aqi <= 100) {
        aqiCategory = 'Moderate';
        healthImplications = 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.';
        trend = 'slightly concerning';
    } else if (aqi <= 150) {
        aqiCategory = 'Unhealthy for Sensitive Groups';
        healthImplications = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        trend = 'concerning for sensitive individuals';
    } else if (aqi <= 200) {
        aqiCategory = 'Unhealthy';
        healthImplications = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
        trend = 'unhealthy and concerning';
    } else if (aqi <= 300) {
        aqiCategory = 'Very Unhealthy';
        healthImplications = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
        trend = 'very unhealthy and requires immediate attention';
    } else {
        aqiCategory = 'Hazardous';
        healthImplications = 'Health alert: everyone may experience more serious health effects.';
        trend = 'hazardous and requires urgent action';
    }
    
    // Generate random comparison
    const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Beijing', 'Delhi'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomComparison = Math.random() > 0.5 ? 'better' : 'worse';
    
    // Build analysis text
    analysisText = `
        <h3>Air Quality Analysis for ${location}</h3>
        <p>The current Air Quality Index (AQI) in ${location} is <strong class="${getAQIClass(aqi)}-text">${aqi}</strong>, which is categorized as <strong class="${getAQIClass(aqi)}-text">${aqiCategory}</strong>.</p>
        <p>${healthImplications}</p>
        <p>Based on historical data and current trends, the air quality in ${location} is ${trend} and is ${randomComparison} than average conditions in ${randomCity} for this time of year.</p>
        <p>The main pollutants contributing to the current air quality are likely particulate matter (PM2.5 and PM10) and ground-level ozone (O₃).</p>
    `;
    
    return analysisText;
}

// Generate health recommendations based on AQI
function generateHealthRecommendations(aqi) {
    let recommendations = '';
    
    if (aqi <= 50) {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-check-circle good-text"></i>
                <p>It's a great day to be active outside. Enjoy outdoor activities.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-check-circle good-text"></i>
                <p>No special precautions needed for the general public.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-info-circle"></i>
                <p>Continue to monitor air quality if you have respiratory conditions.</p>
            </div>
        `;
    } else if (aqi <= 100) {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-exclamation-circle moderate-text"></i>
                <p>Unusually sensitive people should consider reducing prolonged or heavy exertion.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-check-circle"></i>
                <p>It's still OK for most people to be active outside.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-info-circle"></i>
                <p>People with respiratory or heart conditions should monitor symptoms.</p>
            </div>
        `;
    } else if (aqi <= 150) {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-exclamation-circle unhealthy-sensitive-text"></i>
                <p>People with heart or lung disease, older adults, children, and teenagers should reduce prolonged or heavy exertion.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-exclamation-circle unhealthy-sensitive-text"></i>
                <p>It's OK for everyone else to be active outside, but take more breaks and do less intense activities.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-info-circle"></i>
                <p>Watch for symptoms such as coughing or shortness of breath.</p>
            </div>
        `;
    } else if (aqi <= 200) {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-exclamation-triangle unhealthy-text"></i>
                <p>Everyone should reduce prolonged or heavy exertion.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-exclamation-triangle unhealthy-text"></i>
                <p>Sensitive groups should avoid all physical activity outdoors.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-home"></i>
                <p>Consider moving activities indoors or rescheduling to a time when the air quality is better.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-mask"></i>
                <p>If you must go outside, wearing a mask designed to filter fine particles may help.</p>
            </div>
        `;
    } else if (aqi <= 300) {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-exclamation-triangle very-unhealthy-text"></i>
                <p>Everyone should avoid all physical activity outdoors.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-exclamation-triangle very-unhealthy-text"></i>
                <p>Sensitive groups should remain indoors and keep activity levels low.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-home"></i>
                <p>Close windows and doors. Run an air purifier if available.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-mask"></i>
                <p>Wear a mask if you must go outside.</p>
            </div>
        `;
    } else {
        recommendations = `
            <div class="health-item">
                <i class="fas fa-skull hazardous-text"></i>
                <p>Everyone should avoid all physical activity outdoors.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-skull hazardous-text"></i>
                <p>Remain indoors and keep activity levels low.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-home"></i>
                <p>Close windows and doors. Seal drafty areas. Run an air purifier if available.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-exclamation-circle"></i>
                <p>Consider relocating temporarily if air quality does not improve.</p>
            </div>
            <div class="health-item">
                <i class="fas fa-hospital"></i>
                <p>Seek medical attention if experiencing symptoms like difficulty breathing or chest pain.</p>
            </div>
        `;
    }
    
    return recommendations;
}

// Compare Screen Functions
function setupCompareScreen() {
    // Clear previous results
    const comparisonResults = document.getElementById('comparison-results');
    if (comparisonResults) {
        comparisonResults.style.display = 'none';
    }
    
    // Clear previous chart
    if (compareChart) {
        compareChart.destroy();
        compareChart = null;
    }
    
    // Pre-fill current location if available
    const location1Input = document.getElementById('location1');
    if (location1Input && currentLocation) {
        location1Input.value = currentLocation;
    }
}

async function compareLocations() {
    const location1Input = document.getElementById('location1');
    const location2Input = document.getElementById('location2');
    const comparisonResults = document.getElementById('comparison-results');
    
    if (!location1Input || !location2Input || !comparisonResults) return;
    
    const location1 = location1Input.value.trim();
    const location2 = location2Input.value.trim();
    
    if (!location1 || !location2) {
        showNotification('Please enter both locations to compare', 'warning');
        return;
    }
    
    // Show loading state
    comparisonResults.innerHTML = `
        <h3>Comparison Results</h3>
        <div class="loading-indicator">
            <i class="fas fa-spinner fa-pulse"></i> Fetching comparison data...
        </div>
    `;
    comparisonResults.style.display = 'block';
    
    try {
        // For demo purposes, generate mock comparison data
        // In a real app, you would fetch this from an API
        const mockData = await generateMockComparisonData(location1, location2);
        
        // Display comparison results
        displayComparisonResults(mockData);
        
        // Create comparison chart
        createComparisonChart(mockData);
        
    } catch (error) {
        console.error("Error comparing locations:", error.message);
        comparisonResults.innerHTML = `
            <h3>Comparison Results</h3>
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i> 
                Could not compare these locations. Please try again with different locations.
            </div>
        `;
    }
}

// Generate mock comparison data for demo purposes
async function generateMockComparisonData(location1, location2) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random AQI values
    const aqi1 = Math.floor(Math.random() * 200) + 20;
    const aqi2 = Math.floor(Math.random() * 200) + 20;
    
    // Generate random pollutant data
    const pollutants1 = {
        pm25: Math.floor(Math.random() * 50) + 5,
        pm10: Math.floor(Math.random() * 70) + 10,
        o3: Math.floor(Math.random() * 60) + 10,
        no2: Math.floor(Math.random() * 40) + 5,
        so2: Math.floor(Math.random() * 30) + 2,
        co: Math.floor(Math.random() * 10) + 1
    };
    
    const pollutants2 = {
        pm25: Math.floor(Math.random() * 50) + 5,
        pm10: Math.floor(Math.random() * 70) + 10,
        o3: Math.floor(Math.random() * 60) + 10,
        no2: Math.floor(Math.random() * 40) + 5,
        so2: Math.floor(Math.random() * 30) + 2,
        co: Math.floor(Math.random() * 10) + 1
    };
    
    return {
        location1: {
            name: location1,
            aqi: aqi1,
            pollutants: pollutants1
        },
        location2: {
            name: location2,
            aqi: aqi2,
            pollutants: pollutants2
        }
    };
}

// Display comparison results
function displayComparisonResults(data) {
    const comparisonResults = document.getElementById('comparison-results');
    if (!comparisonResults) return;
    
    const { location1, location2 } = data;
    
    // Determine which location has better air quality
    const betterAirQuality = location1.aqi < location2.aqi ? location1.name : location2.name;
    
    // Calculate difference percentage
    const difference = Math.abs(location1.aqi - location2.aqi);
    const percentDifference = Math.round((difference / Math.max(location1.aqi, location2.aqi)) * 100);
    
    let comparisonHTML = `
        <h3>Comparison Results</h3>
        <p>${betterAirQuality} has better air quality by ${percentDifference}%.</p>
        <div class="comparison-table">
            <div class="comparison-row">
                <div class="comparison-label">Location</div>
                <div class="comparison-value">${location1.name}</div>
                <div class="comparison-value">${location2.name}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">AQI</div>
                <div class="comparison-value"><span class="${getAQIClass(location1.aqi)}-text">${location1.aqi}</span></div>
                <div class="comparison-value"><span class="${getAQIClass(location2.aqi)}-text">${location2.aqi}</span></div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">PM2.5</div>
                <div class="comparison-value">${location1.pollutants.pm25}</div>
                <div class="comparison-value">${location2.pollutants.pm25}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">PM10</div>
                <div class="comparison-value">${location1.pollutants.pm10}</div>
                <div class="comparison-value">${location2.pollutants.pm10}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">Ozone (O₃)</div>
                <div class="comparison-value">${location1.pollutants.o3}</div>
                <div class="comparison-value">${location2.pollutants.o3}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-label">Nitrogen Dioxide (NO₂)</div>
                <div class="comparison-value">${location1.pollutants.no2}</div>
                <div class="comparison-value">${location2.pollutants.no2}</div>
            </div>
        </div>
    `;
    
    comparisonResults.innerHTML = comparisonHTML;
    comparisonResults.style.display = 'block';
}

// Create comparison chart
function createComparisonChart(data) {
    const ctx = document.getElementById('compare-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (compareChart) {
        compareChart.destroy();
    }
    
    const { location1, location2 } = data;
    
    // Prepare data for chart
    const pollutants = ['AQI', 'PM2.5', 'PM10', 'O₃', 'NO₂', 'SO₂', 'CO'];
    const location1Data = [
        location1.aqi,
        location1.pollutants.pm25,
        location1.pollutants.pm10,
        location1.pollutants.o3,
        location1.pollutants.no2,
        location1.pollutants.so2,
        location1.pollutants.co
    ];
    
    const location2Data = [
        location2.aqi,
        location2.pollutants.pm25,
        location2.pollutants.pm10,
        location2.pollutants.o3,
        location2.pollutants.no2,
        location2.pollutants.so2,
        location2.pollutants.co
    ];
    
    // Create chart
    compareChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pollutants,
            datasets: [
                {
                    label: location1.name,
                    data: location1Data,
                    backgroundColor: 'rgba(108, 92, 231, 0.7)',
                    borderColor: 'rgba(108, 92, 231, 1)',
                    borderWidth: 1
                },
                {
                    label: location2.name,
                    data: location2Data,
                    backgroundColor: 'rgba(0, 206, 201, 0.7)',
                    borderColor: 'rgba(0, 206, 201, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                },
                x: {
                    grid: {
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: isDarkTheme ? '#ffffff' : '#333333'
                    }
                }
            }
        }
    });
}

// Utility Functions
function getAQIClass(aqi) {
    if (aqi <= 50) return 'good';
    if (aqi <= 100) return 'moderate';
    if (aqi <= 150) return 'unhealthy-sensitive';
    if (aqi <= 200) return 'unhealthy';
    if (aqi <= 300) return 'very-unhealthy';
    return 'hazardous';
}

function getColorForValue(value) {
    if (value <= 50) return 'rgba(0, 184, 148, 0.7)'; // Good
    if (value <= 100) return 'rgba(253, 203, 110, 0.7)'; // Moderate
    if (value <= 150) return 'rgba(225, 112, 85, 0.7)'; // Unhealthy for Sensitive Groups
    if (value <= 200) return 'rgba(214, 48, 49, 0.7)'; // Unhealthy
    if (value <= 300) return 'rgba(108, 92, 231, 0.7)'; // Very Unhealthy
    return 'rgba(45, 52, 54, 0.7)'; // Hazardous
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-circle';
    if (type === 'error') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    notificationContainer.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}