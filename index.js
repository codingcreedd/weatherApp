//asynchronous functions

async function fetchWeatherData()
{
    let cityCountryInput = document.getElementById('city-country-search');
    const weatherResult = await fetch(`http://api.weatherapi.com/v1/current.json?key=37f27913376d45459b7195029241802&q=${getCityName(cityCountryInput.value)}`)
    
}

//synchrounous functions

function getCityName(inputText) {
    const trimmedInput = inputText.trim();

    const regex = /([^,\/\-]+)[,\/\-\s]+([^,\/\-]+)/;

    const match = trimmedInput.match(regex);

    if (match) {
        const city = match[1].trim();
        const country = match[2].trim();
        return `${city}, ${country}`;
    } else {
        // If no match is found, return "Tripoli, Lebanon" which is the default city-country that is rendered
        return "Tripoli, Lebanon";
    }
}