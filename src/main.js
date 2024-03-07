document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('form[role="search"]');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var searchTerm = form.querySelector('input[type="search"]').value.trim();
        if (searchTerm !== '') {
            fetchWeatherData(searchTerm);
            fetchForecastData(searchTerm);
        } else {
            alert('Please enter a city name.');
        }
    });

    var addToFavoriteBtn = document.getElementById('addToFavoriteBtn');
    addToFavoriteBtn.addEventListener('click', function() {
        var weatherInfo = document.getElementById('weatherInfo').innerHTML;
        localStorage.setItem('favoriteWeather', weatherInfo);
        alert('Weather added to favorites!');
    });

    var favoriteWeather = localStorage.getItem('favoriteWeather');
    if (favoriteWeather) {
        document.getElementById('weatherInfo').innerHTML = favoriteWeather;
    }
});

function fetchWeatherData(city) {
    var apiKey = '0bcc93536226014de2b799082c16e39d';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeatherInfo(data);
        })
        .catch(error => {
            console.error('There was a problem fetching the weather data:', error);
            alert('There was a problem fetching the weather data. Please try again.');
        });
}

function fetchForecastData(city) {
    var apiKey = '0bcc93536226014de2b799082c16e39d';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayForecastInfo(data);
        })
        .catch(error => {
            console.error('There was a problem fetching the forecast data:', error);
            alert('There was a problem fetching the forecast data. Please try again.');
        });
}

function displayWeatherInfo(data) {
    var weatherInfo = document.getElementById('weatherInfo');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>

        Coordinates: [${data.coord.lat}, ${data.coord.lon}]</p>
        <p>Weather Description: ${data.weather[0].description}</p>
        <p>Current Temperature: ${Math.round(data.main.temp - 273.15)}°C</p>
        <p>Min Temperature: ${Math.round(data.main.temp_min - 273.15)}°C</p>
        <p>Max Temperature: ${Math.round(data.main.temp_max - 273.15)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
}

function displayForecastInfo(data) {
    var forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '';

    // Group forecast data by day
    var groupedForecast = groupForecastByDay(data.list);

    // Iterate over each day's forecast
    Object.keys(groupedForecast).forEach(day => {
        var dayForecast = groupedForecast[day];
        var date = new Date(dayForecast[0].dt * 1000);
        var dayOfWeek = getDayOfWeek(date.getDay());

        // Create a container for the day's forecast
        var dayContainer = document.createElement('div');
        dayContainer.classList.add('day-forecast');

        // Add day of week to the container
        var dayHeader = document.createElement('h3');
        dayHeader.textContent = dayOfWeek;
        dayContainer.appendChild(dayHeader);

        // Iterate over each forecast item for the day
        dayForecast.forEach(forecast => {
            // Create forecast item element
            var forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');

            // Populate forecast item with data
            forecastItem.innerHTML = `
                <p>Date/Time: ${forecast.dt_txt}</p>
                <p>Description: ${forecast.weather[0].description}</p>
                <p>Temperature: ${Math.round(forecast.main.temp - 273.15)}°C</p>
            `;

            // Append forecast item to day container
            dayContainer.appendChild(forecastItem);
        });

        // Append day container to forecastInfo
        forecastInfo.appendChild(dayContainer);
    });
}

function groupForecastByDay(forecastList) {
    var groupedForecast = {};
    forecastList.forEach(forecast => {
        var date = new Date(forecast.dt * 1000);
        var dayKey = date.toLocaleDateString();
        if (!groupedForecast[dayKey]) {
            groupedForecast[dayKey] = [];
        }
        groupedForecast[dayKey].push(forecast);
    });
    return groupedForecast;
}

function getDayOfWeek(dayIndex) {
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
}
function displayForecastInfo(data) {
    var forecastInfo = document.getElementById('forecastInfo');
    forecastInfo.innerHTML = '';

    // Group forecast data by day
    var groupedForecast = groupForecastByDay(data.list);

    // Iterate over each day's forecast
    Object.keys(groupedForecast).forEach(day => {
        var dayForecast = groupedForecast[day];
        var date = new Date(dayForecast[0].dt * 1000);
        var dayOfWeek = getDayOfWeek(date.getDay());

        // Create a container for the day's forecast
        var dayContainer = document.createElement('div');
        dayContainer.classList.add('day-forecast');

        // Add day of week to the container
        var dayHeader = document.createElement('h3');
        dayHeader.textContent = dayOfWeek;
        dayContainer.appendChild(dayHeader);

        // Iterate over each forecast item for the day
        dayForecast.forEach(forecast => {
            // Create forecast card element
            var forecastCard = document.createElement('div');
            forecastCard.classList.add('card', 'forecast-card');

            // Populate forecast card with data
            forecastCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">Date/Time: ${forecast.dt_txt}</h5>
                    <p class="card-text">Description: ${forecast.weather[0].description}</p>
                    <p class="card-text">Temperature: ${Math.round(forecast.main.temp - 273.15)}°C</p>
                </div>
            `;

            // Append forecast card to day container
            dayContainer.appendChild(forecastCard);
        });

        // Append day container to forecastInfo
        forecastInfo.appendChild(dayContainer);
    });
}


