const apiKey = "d18209071bdea397a0c96ee89b27cabd"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city_input");
const cityName = document.getElementById("city_name");
const currentTemp = document.getElementById("current_temp");
const weatherDesc = document.getElementById("weather_desc");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind_speed");
const forecastContainer = document.getElementById("forecast");
const weatherIcon = document.getElementById("weather_icon");

document.addEventListener("DOMContentLoaded", () => {
    getWeatherData("Kafue"); 
});

searchBtn.addEventListener("click", function () {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert("Please enter a city name!");
    }
});

async function getWeatherData(city) {
    try {
        
        const currentWeatherResponse = await fetch(
            `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const currentWeatherData = await currentWeatherResponse.json();

        if (currentWeatherData.cod !== 200) {
            alert(currentWeatherData.message);
            return;
        }

        cityName.textContent = `City: ${currentWeatherData.name}`;
        currentTemp.textContent = `Temperature: ${currentWeatherData.main.temp}°C`;
        weatherDesc.textContent = `Weather: ${currentWeatherData.weather[0].description}`;
        humidity.textContent = `Humidity: ${currentWeatherData.main.humidity}%`;
        windSpeed.textContent = `Wind Speed: ${currentWeatherData.wind.speed} km/h`;

        const iconCode = currentWeatherData.weather[0].icon;
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${currentWeatherData.weather[0].description}">`;

        const forecastResponse = await fetch(
            `${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
            alert(forecastData.message);
            return;
        }

        forecastContainer.innerHTML = "";
        for (let i = 0; i < forecastData.list.length; i += 8) {
            const forecast = forecastData.list[i];
            const forecastCard = document.createElement("div");
            forecastCard.classList.add("forecast-card");

            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const temp = `${forecast.main.temp}°C`;
            const desc = forecast.weather[0].description;
            const iconCode = forecast.weather[0].icon;

            forecastCard.innerHTML = `
                <h4>${date}</h4>
                <div><img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}"></div>
                <p>${temp}</p>
                <p>${desc}</p>
            `;
            forecastContainer.appendChild(forecastCard);
        }
    } catch (error) {
        alert("Something went wrong. Please try again later.");
        console.error(error);
    }
}
