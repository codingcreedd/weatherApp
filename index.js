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
    renderWeatherInfoAtAllTimes(weatherData);
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
    const container = document.querySelector('.weather-info-section');

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

    container.appendChild(div);
}

function removeAllWeatherDivInfoFromDOM(){
    const container = document.querySelector('.weather-info-section');
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
}

function renderWeatherInfoAtAllTimes(weatherData){
    const currentDay = new Date().toISOString().split('T')[0];
    const forecastData = weatherData.forecast.forecastday;
    const currentDayForecast = forecastData.find(day => day.date === currentDay);
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');

    // Format the date as "YYYY-MM-DD HH:00"
    const formattedDateTime = `${year}-${month}-${day} ${hour}:00`;

    currentDayForecast.hour.forEach(currentHour => {
        const time = extractTime(currentHour.time);
        const timeIn12HourFormat = convertTo12HourClock(time);

        addWeatherInfoDiv(timeIn12HourFormat, currentHour.condition.icon, currentHour.temp_c);
        console.log('rannn')
    })
}

function extractTime(datetime) {
    const parts = datetime.split(' ');
    // Get the second part, which is the time
    const time = parts[1];
    return time;
}

function convertTo12HourClock(time) {
    const [hours, minutes] = time.split(':');

    let hours12 = parseInt(hours);

    if (hours12 > 12) {
        hours12 -= 12;
    }

    if (hours12 === 0) {
        hours12 = 12;
    }

    const period = hours < 12 ? 'AM' : 'PM';

    return `${hours12}:${minutes} ${period}`;
}

const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', () => {
    removeAllWeatherDivInfoFromDOM();
    const cityCountryInput = document.getElementById('city-country-search');
    const cityName = getCityName(cityCountryInput.value);

    fetchWeatherData(cityName).then((weatherData) => {
        renderCityCountryName(weatherData);
        renderCityCountryTemp(weatherData);
        renderHeaderWeatherInfo(weatherData);
        renderWeatherInfoAtAllTimes(weatherData);
    })
    .catch(error => {
        console.error('Error handling data:', error);
    });
});