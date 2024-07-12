"use strict";
// localStorage.clear();
// historical list items
const apiKey = "2db21fa461df9dce401f9f4b36a8f261";
// const apiKey1 = "44f639294e93ba1e46baa71627abe1bf";
// current data
const currentCityInput = document.querySelector("#current-city");
const currentDateInput = document.querySelector("#current-date");
const currentTemp = document.querySelector("#current-temperature");
const currentWind = document.querySelector("#current-wind");
const currentHumidity = document.querySelector("#current-humidity");
// toggle display button
const displayToggle = document.querySelector(".display-toggle");
// body
const weatherPage = document.querySelector("#weather-page");
// header
const headerSection = document.querySelector("#header-section");
// search
const searchSection = document.querySelector("#search-section");
// search-input
const searchInput = document.querySelector("#search-city");
// search-btn
const searchBtn = document.querySelector("#search-btn");
// history of search
const historicalSearchSection = document.createElement("ul");
// display of the history of search
historicalSearchSection.classList = "flex-column historical-section";
historicalSearchSection.style.textAlign = "left";
historicalSearchSection.style.padding = ".25rem 1rem .25rem 1rem";
historicalSearchSection.style.margin = ".25rem 1rem .25rem 1rem";
historicalSearchSection.style.border = "1px solid var(--black)";
// end
searchSection.appendChild(historicalSearchSection);
const dataNow = [];
const dataFore = [];
// function for display local storage of current data.
const displayItems = (currentStorage) => {
  // create a new element in search section
  const aList = document.createElement('li');
  const currentData = JSON.parse(localStorage.getItem(currentStorage));
  // console.log(currentDataList);
  // historicalSearchSection.innerHTML = "";
  for (let i = 0; i < currentData.length; i++) {
    aList.textContent = currentData[i].curCity;
    aList.classList = "list";
    historicalSearchSection.appendChild(aList);
    // historicalSearchSection.children.addEventListener("click", clickableListItems);
    // Select the unordered list
  const ul = document.querySelector('.historical-section');
  // console.log(ul);

  // Select all list items within the unordered list
  const listItems = ul.getElementsByTagName('li');

  // Loop through each list item
  for (let i = 0; i < listItems.length; i++) {
      // Apply a clickable action to each list item
      listItems[i].addEventListener('click', function() {
        fetchHistoricalCurWeather(listItems[i].textContent, apiKey); 
        fetchForeHistoricalWeather(listItems[i].textContent, apiKey);
      });
  }

  }

};
window.onload = displayItems('current-data');

const kelvinToFeirenheit = (temp) => {
  const temperatureCurrentF = (
    ((temp - 273.15) * 9) / 5 +
    32
  ).toFixed(2);
  return temperatureCurrentF;
}

const timestampToDate = (timestamp) => {
    const currentDate = new Date(timestamp * 1000).toLocaleDateString();
    return currentDate;
}

const mpsToMPH = (mps) => {
  const windCurrentSpeed = (mps * 2.237).toFixed(2);
  return windCurrentSpeed;
}

const storeToLocalStorage = (key, list) => {
  localStorage.setItem(key, JSON.stringify(list));
}

const fetchHistoricalCurWeather = (city, apiKey) => {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(currentData => {
      currentCityInput.textContent = currentData.name;
      currentDateInput.textContent = ` (${timestampToDate(currentData.dt)})`;
      currentTemp.textContent = `${kelvinToFeirenheit(currentData.main.temp)} `;
      currentWind.textContent = `${mpsToMPH(currentData.wind.speed)} `;
      currentHumidity.textContent = `${currentData.main.humidity} `;
    });
};
const fetchCurWeather = (city, apiKey) => {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(currentData => {
      currentCityInput.textContent = currentData.name;
      currentDateInput.textContent = ` (${timestampToDate(currentData.dt)})`;
      currentTemp.textContent = `${kelvinToFeirenheit(currentData.main.temp)} `;
      currentWind.textContent = `${mpsToMPH(currentData.wind.speed)} `;
      currentHumidity.textContent = `${currentData.main.humidity} `;
      const currentDataObject = {
        curCity: currentData.name,
        curDate: timestampToDate(currentData.dt),
        curTemp: kelvinToFeirenheit(currentData.main.temp),
        curWind: mpsToMPH(currentData.wind.speed),
        curHumidity: currentData.main.humidity
      };
      dataNow.push(currentDataObject);
      storeToLocalStorage("current-data", dataNow)
      displayItems("current-data");
    });
};
const fetchForeHistoricalWeather = (city, apiKey) => {
  const ForeWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(ForeWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(foreData => {
      const forecastList = foreData.list;
      const forecastBoxes = document.querySelectorAll('.box');
      for (let i = 0; i < 5; i++) {
        const dailyForecast = forecastList[i * 8]; // 8 entries per day (3-hour intervals)

        const dateFore = new Date(dailyForecast.dt_txt).toDateString();
        const tempFore = kelvinToFeirenheit(dailyForecast.main.temp);
        const windSpeedFore = mpsToMPH(dailyForecast.wind.speed);
        const humidityFore = dailyForecast.main.humidity;
        const iconCode = dailyForecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;


        forecastBoxes[i].innerHTML = `
            <p>Date: ${dateFore}</p>
            <img src="${iconUrl}"> 
            <p>Temp: ${tempFore} °F</p>
            <p>Wind: ${windSpeedFore} MPH</p>
            <p>Humidity: ${humidityFore} %</p>
        `;
      }
    })
}
const fetchForeWeather = (city, apiKey) => {
  const ForeWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
  fetch(ForeWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(foreData => {
      const forecastList = foreData.list;
      const forecastBoxes = document.querySelectorAll('.box');
      for (let i = 0; i < 5; i++) {
        const dailyForecast = forecastList[i * 8]; // 8 entries per day (3-hour intervals)

        const dateFore = new Date(dailyForecast.dt_txt).toDateString();
        const tempFore = kelvinToFeirenheit(dailyForecast.main.temp);
        const windSpeedFore = mpsToMPH(dailyForecast.wind.speed);
        const humidityFore = dailyForecast.main.humidity;
        const iconCode = dailyForecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        forecastBoxes[i].innerHTML = `
            <p>Date: ${dateFore}</p>
            <img src="${iconUrl}">  
            <p>Temp: ${tempFore} °F</p>
            <p>Wind: ${windSpeedFore} MPH</p>
            <p>Humidity: ${humidityFore} %</p>
        `;
        const currentDataObject = {
          ForeCity: city,
          ForeDate: dateFore,
          ForeTemp: tempFore,
          ForeWind: windSpeedFore,
          ForeHumidity: humidityFore 
        };
      dataFore.push(currentDataObject);
      storeToLocalStorage("forecast-data", dataFore)
    }
    });
}

displayToggle.addEventListener("click", () => {
  if (
    displayToggle.style.backgroundColor === "" ||
    displayToggle.style.backgroundColor === "rgb(0, 0, 0)"
  ) {
    displayToggle.style.backgroundColor = "#fff";
    headerSection.style.color = "#fff";
    weatherPage.style.backgroundColor = "#000";
    searchSection.style.backgroundColor = "#fff";
  } else if (displayToggle.style.backgroundColor = "rgb(255, 255, 255)") {
    headerSection.style.color = "#000";
    displayToggle.style.backgroundColor = "#000";
    weatherPage.style.backgroundColor = "#fff";
  }
});
const search = event => {
  event.preventDefault();
  const city = searchInput.value;
  if (city) {
    fetchCurWeather(city, apiKey);
    fetchForeWeather(city, apiKey);
  }
};
searchBtn.addEventListener("click", search);
