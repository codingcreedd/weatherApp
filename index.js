//asynchronous functions

async function fetchWeatherData(cityName) {
    try {
        console.log('ran')
        const weatherResult = await fetch(`http://api.weatherapi.com/v1/current.json?key=37f27913376d45459b7195029241802&q=${cityName}`);
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
    temp.innerText = `${weatherData.current.temp_c}`;
}

function renderHeaderWeatherInfo(weatherData)
{
    //THIS FUNCTION IS RESPONSIBLE FOR RENDERING THE DATA THAT IS IN THE HEADER 
    const weatherStatusHeader = document.getElementById('weather-status');
    weatherStatusHeader.innerText = `${weatherData.current.condition.text}`;
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