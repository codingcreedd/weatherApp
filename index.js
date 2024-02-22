//asynchronous functions

async function fetchWeatherData(cityName) {
    try {
        console.log('ran')
        const weatherResult = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=37f27913376d45459b7195029241802&q=${cityName}&days=10&aqi=no&alerts=no`, {mode: 'cors'});
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
    renderDayInfo(weatherData);
    renderDays(weatherData);
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

function getForcastDay(weatherData)
{
    const currentDay = new Date().toISOString().split('T')[0];
    const forecastData = weatherData.forecast.forecastday;
    const currentDayForecast = forecastData.find(day => day.date === currentDay);
    return currentDayForecast;
}

function renderHeaderWeatherInfo(weatherData)
{
    //THIS FUNCTION IS RESPONSIBLE FOR RENDERING THE DATA THAT IS IN THE HEADER 
    const weatherStatusHeader = document.getElementById('weather-status');
    weatherStatusHeader.innerText = `${weatherData.current.condition.text}`;

    const highTemp = document.getElementById('high-temp');
    const lowTemp = document.getElementById('low-temp');
    const maxTempC = getForcastDay(weatherData).day.maxtemp_c;
    const minTempC = getForcastDay(weatherData).day.mintemp_c;

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
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');

    // Format the date as "YYYY-MM-DD HH:00"
    const formattedDateTime = `${year}-${month}-${day} ${hour}:00`;

    getForcastDay(weatherData).hour.forEach(currentHour => {
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

function renderDayInfo(weatherData){
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');
    const chanceOfRain = document.getElementById('chance-of-rain');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');

    sunrise.innerText = `Sunrise: ${getForcastDay(weatherData).astro.sunrise}`;
    sunset.innerText = `Sunset: ${getForcastDay(weatherData).astro.sunset}`;
    chanceOfRain.innerText = `Chance of Rain: ${getForcastDay(weatherData).day.daily_chance_of_rain}%`;
    humidity.innerText = `Humidity: ${getForcastDay(weatherData).day.avghumidity}%`;
    wind.innerText = `Wind: ${getForcastDay(weatherData).day.maxwind_mph * 1.609} kph`;
    
}

function extractYearMonthDay(dateString) {
    const parts = dateString.split('-');

    const year = parseInt(parts[0]); 
    const month = parseInt(parts[1]); 
    const day = parseInt(parts[2]); 

    return { year, month, day };
}

function convertDateToDayOfWeek(year, month, day) {
    const date = new Date(year, month - 1, day);

    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });

    return dayOfWeek;
}

function renderDay(day, icon, lowTemp, highTemp) {
    // Create the outer div for the day
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('week-day-div');

    // Create and set the text for the day of the week
    const dayOfWeek = document.createElement('p');
    dayOfWeek.id = 'week-day';
    dayOfWeek.textContent = day;

    // Create and set the icon image source
    const iconImg = document.createElement('img');
    iconImg.id = 'Icon';
    iconImg.src = icon;
    iconImg.alt = 'Weather Icon';

    // Create and set the text for the high temperature
    const highTempParagraph = document.createElement('p');
    highTempParagraph.id = 'high-temp-day';
    highTempParagraph.textContent = highTemp;

    // Create and set the text for the low temperature
    const lowTempParagraph = document.createElement('p');
    lowTempParagraph.id = 'low-temp-day';
    lowTempParagraph.textContent = lowTemp;

    // Append all elements to the dayDiv
    dayDiv.appendChild(dayOfWeek);
    dayDiv.appendChild(iconImg);
    dayDiv.appendChild(highTempParagraph);
    dayDiv.appendChild(lowTempParagraph);

    // Append the dayDiv to the parent container with class "days"
    const daysContainer = document.querySelector('.days');
    daysContainer.appendChild(dayDiv);
}

function renderDays(weatherData){
    const forecastDay = weatherData.forecast.forecastday;
    for(let i = 1; i <= 6; i++){
        const date = forecastDay[i].date;
        const extractedDate = extractYearMonthDay(date);
        const day = convertDateToDayOfWeek(extractedDate.year, extractedDate.month, extractedDate.day);
        renderDay(day, forecastDay[i].day.condition.icon, forecastDay[i].day.mintemp_c, forecastDay[i].day.maxtemp_c);
    }
}

function removeDays(){
    const daysContainer = document.querySelector('.days');
    while(daysContainer.firstChild){
        daysContainer.removeChild(daysContainer.firstChild);
    }
}


const searchButton = document.getElementById('search-btn');
searchButton.addEventListener('click', () => {
    removeAllWeatherDivInfoFromDOM();
    removeDays();
    const cityCountryInput = document.getElementById('city-country-search');
    const cityName = getCityName(cityCountryInput.value);

    fetchWeatherData(cityName).then((weatherData) => {
        renderCityCountryName(weatherData);
        renderCityCountryTemp(weatherData);
        renderHeaderWeatherInfo(weatherData);
        renderWeatherInfoAtAllTimes(weatherData);
        renderDayInfo(weatherData);
        renderDays(weatherData);
    })
    .catch(error => {
        console.error('Error handling data:', error);
    });
});