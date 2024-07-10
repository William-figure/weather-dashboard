"use strict";
const displayToggle = document.querySelector(".display-toggle");
const weatherPage = document.querySelector("#weather-page");
console.log(typeof displayToggle.style.backgroundColor);
displayToggle.addEventListener("click", () => {
  if (
    displayToggle.style.backgroundColor === ""||displayToggle.style.backgroundColor === "rgb(0, 0, 0)") {
    displayToggle.style.backgroundColor = "#fff";
    weatherPage.style.backgroundColor = "#000";
    weatherPage.style.color = "#fff";
  }
  else if (displayToggle.style.backgroundColor = "rgb(255, 255, 255)") {
    displayToggle.style.backgroundColor = "#000";
    weatherPage.style.backgroundColor = "#fff";
    weatherPage.style.color = "#000";
  }


})
