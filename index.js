//asynchronous functions

async function fetchWeatherData(cityName) {
    try {
        console.log('ran')
        const weatherResult = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=37f27913376d45459b7195029241802&q=${cityName}&days=10&aqi=no&alerts=no`);
        if (!weatherResult.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherResultJson = await weatherResult.json();
        return weatherResultJson;
    } catch (error) {
        console.error('Error fetching data:', error);
        console.log("Could not fetch data");
        throw error; 
    }
}

//RUNS AT THE BEGINNING BY DEFAULT
fetchWeatherData("Tripoli, Lebanon").then((weatherData) => {
    renderCityCountryName(weatherData);
    renderCityCountryTemp(weatherData);
    renderHeaderWeatherInfo(weatherData);
})

//synchrounous functions

function getCityName(inputText) {
    const trimmedInput = inputText.trim();

    const regex = /([^,\/\-]+)[,\/\-\s]+([^,\/\-\s]+)/;

    const match = trimmedInput.match(regex);

    if (match) {
        const city = match[1].trim();
        const country = match[2].trim();
        return `${city}, ${country}`;
    } else if (trimmedInput !== '') {
        // If input is not empty but doesn't match any pattern, return the input itself
        return trimmedInput;
    } else {
        // If input is empty, return "Tripoli, Lebanon" as default
        return "Tripoli, Lebanon";
    }
}


function renderCityCountryName(weatherData)
{
    const cityCountryInput = document.getElementById('city-country-search');
    const cityCountryName = document.getElementById('city-name-info');
    cityCountryName.innerText = `${weatherData.location.name}, ${weatherData.location.country}`;
}

function renderCityCountryTemp(weatherData)
{
    const temp = document.querySelector('.temperature');
    temp.innerText = `${weatherData.current.temp_c}°`;
}

function renderHeaderWeatherInfo(weatherData)
{
    //THIS FUNCTION IS RESPONSIBLE FOR RENDERING THE DATA THAT IS IN THE HEADER 
    const weatherStatusHeader = document.getElementById('weather-status');
    weatherStatusHeader.innerText = `${weatherData.current.condition.text}`;

    const highTemp = document.getElementById('high-temp');
    const lowTemp = document.getElementById('low-temp');
    const currentDay = new Date().toISOString().split('T')[0];
    const forecastData = weatherData.forecast.forecastday;
    const currentDayForecast = forecastData.find(day => day.date === currentDay);
    const maxTempC = currentDayForecast.day.maxtemp_c;
    const minTempC = currentDayForecast.day.mintemp_c;

    highTemp.innerText = `H: ${maxTempC}°`;
    lowTemp.innerText = `L: ${minTempC}°`;

    const todayDate = document.getElementById('today');
    const currentDate = new Date();
    const dayOfWeek = currentDate.toLocaleString('en-US', { weekday: 'long' });
    todayDate.innerText = `${dayOfWeek}`;

}

function addWeatherInfoDiv(time, icon, temperature) {
    //This function is responsible for adding one info div at a specific time
    const section = document.createElement('section');
    section.classList.add('weather-info-section');

    const div = document.createElement('div');
    div.classList.add('weather-info-div');

    const timeParagraph = document.createElement('p');
    timeParagraph.classList.add('time');
    timeParagraph.textContent = `${time}`;

    const iconDiv = document.createElement('div');
    iconDiv.classList.add('weather-status-icon');

    const Icon = document.createElement('img');
    Icon.src = `${icon}`;
    

    const tempParagraph = document.createElement('p');
    tempParagraph.classList.add('weather-temp');
    tempParagraph.innerHTML = `${temperature}&deg;`; 
    iconDiv.appendChild(Icon);

    div.appendChild(timeParagraph);
    div.appendChild(iconDiv);
    div.appendChild(tempParagraph);

    section.appendChild(div);

    const container = document.getElementById('container'); 
    container.appendChild(section);
}


const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', () => {
    const cityCountryInput = document.getElementById('city-country-search');
    const cityName = getCityName(cityCountryInput.value);

    fetchWeatherData(cityName).then((weatherData) => {
        renderCityCountryName(weatherData);
        renderCityCountryTemp(weatherData);
        renderHeaderWeatherInfo(weatherData);
    })
    .catch(error => {
        console.error('Error handling data:', error);
    });
});