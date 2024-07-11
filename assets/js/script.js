"use strict";
// localStorage.clear();
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
// function for display local storage of current data.
const displayItems = (currentStorage) => {
  // create a new element in search section
  const currentData = JSON.parse(localStorage.getItem(currentStorage));
  // console.log(currentDataList);
  historicalSearchSection.innerHTML = "";
  for (let i = 0; i < currentData.length; i++) {
    historicalSearchSection.innerHTML += `<li class="list">${currentData[i].curCity}</li>`;
  }
};

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

displayToggle.addEventListener("click", () => {
  if (
    displayToggle.style.backgroundColor === "" ||
    displayToggle.style.backgroundColor === "rgb(0, 0, 0)"
  ) {
    displayToggle.style.backgroundColor = "#fff";
    headerSection.style.color = "#fff";
    weatherPage.style.backgroundColor = "#000";
    searchSection.style.backgroundColor = "#fff";
  } else if ((displayToggle.style.backgroundColor = "rgb(255, 255, 255)")) {
    headerSection.style.color = "#000";
    displayToggle.style.backgroundColor = "#000";
    weatherPage.style.backgroundColor = "#fff";
  }
});
const search = event => {
  event.preventDefault();
  const apiKey = "2db21fa461df9dce401f9f4b36a8f261";
  const city = searchInput.value;
  fetchCurWeather(city, apiKey);
};
searchBtn.addEventListener("click", search);
