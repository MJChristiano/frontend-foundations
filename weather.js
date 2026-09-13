const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const weatherMapEl = document.getElementById("weatherMap");
const weatherForm = document.getElementById("weatherSearchForm");
const cityInput = document.getElementById("cityInput");

async function fetchWeather(lat, lon, locationName) {
    if (cityNameEl) cityNameEl.textContent = "Loading weather...";
    if (tempEl) tempEl.textContent = "--";
    if (conditionEl) conditionEl.textContent = "Fetching live forecast...";

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

    if (weatherMapEl) {
        const mapBounds = `${lon - 0.12}%2C${lat - 0.08}%2C${lon + 0.12}%2C${lat + 0.08}`;
        weatherMapEl.src = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=${lat}%2C${lon}`;
    }

    try {
        const response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error("Weather data missing from API response");
        }

        if (cityNameEl) cityNameEl.textContent = locationName;
        if (tempEl) tempEl.textContent = `${Math.round(data.current.temperature_2m)} °F`;
        if (conditionEl) {
            conditionEl.innerHTML = `Humidity: ${data.current.relative_humidity_2m}% &bull; Wind Speed: ${Math.round(data.current.wind_speed_10m)} mph`;
        }

    } catch (error) {
        console.error("API Error:", error);
        if (cityNameEl) cityNameEl.textContent = "Failed to load weather data.";
        if (conditionEl) conditionEl.textContent = "Please check your local internet connection.";
    }
}

async function searchLocation(query) {
    if (cityNameEl) cityNameEl.textContent = `Searching "${query}"...`;
    if (conditionEl) conditionEl.textContent = "Locating coordinates...";

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
        const response = await fetch(geoUrl);

        if (!response.ok) {
            throw new Error("Geocoding service unavailable.");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error(`Location "${query}" not found.`);
        }

        const location = data.results[0];
        const nameParts = [location.name];
        if (location.admin1) nameParts.push(location.admin1);
        if (location.country) nameParts.push(location.country);

        await fetchWeather(location.latitude, location.longitude, nameParts.join(", "));

    } catch (error) {
        console.error("Search Error:", error);
        if (cityNameEl) cityNameEl.textContent = "Location not found";
        if (tempEl) tempEl.textContent = "--";
        if (conditionEl) conditionEl.textContent = error.message || "Try entering a city name or ZIP code.";
    }
}

if (weatherForm && cityInput) {
    weatherForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = cityInput.value.trim();
        if (query) {
            searchLocation(query);
            weatherForm.reset();
        }
    });
}

// Initial default weather load (New York, USA)
fetchWeather(40.7128, -74.0060, "New York, New York, United States");