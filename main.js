import { parseApi, showDetails, filterCountries } from "./modules.js";

// Dark Mode Switch
let countries, modeAffectedElements;
let darkModeSwitch = document.querySelector(".mode");
darkModeSwitch.onclick = () => {
  modeAffectedElements = document.querySelectorAll(
    "body, header, .search, .country, .details"
  );
  Array.from(modeAffectedElements).forEach((element) => {
    element.classList.toggle("dark");
  });
};

// Countries API Call
let request = new XMLHttpRequest();
let url = "https://restcountries.com/v3.1/all";
request.open("GET", url);
request.send();
request.onreadystatechange = () => {
  parseApi(request);
  countries = document.querySelectorAll(".country");
  Array.from(countries).forEach((country) => {
    country.onclick = function () {
      showDetails(country);
    };
  });
};

// Search and region filter
let searchBox = document.getElementById("search");
let regionBox = document.getElementById("region");
searchBox.oninput = function () {
  filterCountries(regionBox.value, searchBox.value);
};
regionBox.oninput = function () {
  filterCountries(regionBox.value, searchBox.value);
};
