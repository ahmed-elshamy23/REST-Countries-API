export { insertCountry, filterCountries, parseApi, showDetails };

let main,
  countries,
  detailsContainer,
  countriesContainer = document.querySelector(".countries .container");

function parseApi(request) {
  if (request.readyState === 4 && request.status === 200) {
    countries = JSON.parse(request.responseText);
    countries.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));
    for (let i = 0; i < countries.length; i++) {
      if (countries[i].cca2 === "IL") continue;
      insertCountry(countries[i]);
    }
  }
}

function insertCountry(country) {
  let countryDiv = document.createElement("div");
  countryDiv.innerHTML = `
      <img src="${country.flags.svg}" alt="">
          <h2>${country.name.common}</h2>
          <div class="info">
              <p><span>Population</span>: ${country.population.toLocaleString()}</p>
              <p><span>Region</span>: ${country.region}</p>
              <p><span>Capital</span>: ${country.capital}</p>
      </div>
    `;
  countryDiv.setAttribute("data-name", country.name.common.toLowerCase());
  countryDiv.setAttribute("data-region", country.region);
  countryDiv.classList.add("country");
  countriesContainer.append(countryDiv);
}

function filterCountries(region, target = "") {
  if (region === "") region = "All";
  let allCountries = Array.from(document.querySelectorAll(".country"));
  allCountries.forEach((country) => (country.style.display = "none"));
  if (region === "All" && target === "")
    allCountries.forEach((country) => (country.style.display = "block"));
  else if (region === "All")
    allCountries
      .filter((country) => country.dataset.name.includes(target.toLowerCase()))
      .forEach((country) => (country.style.display = "block"));
  else if (target === "")
    allCountries
      .filter((country) => country.dataset.region === region)
      .forEach((country) => (country.style.display = "block"));
  else {
    allCountries
      .filter(
        (country) =>
          country.dataset.name.includes(target.toLowerCase()) &&
          country.dataset.region === region
      )
      .forEach((country) => (country.style.display = "block"));
  }
}

function showDetails(target) {
  // Determining the target country
  let targetCountry;
  for (let i = 0; i < countries.length; i++)
    if (countries[i].name.common.toLowerCase() === target.dataset.name) {
      targetCountry = countries[i];
      break;
    }

  // Cloning the main countries container to remove it
  main = document.querySelector("main");
  document.querySelector("main").remove();

  // Showing target country details
  detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details");
  detailsContainer.innerHTML = `
  <div class="container">
        <div id="back">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back</span>
        </div>
        <div class="info">
            <img src="${targetCountry.flags.svg}" alt="">
            <div class="text">
                <h2>${targetCountry.name.common}</h2>
                <div class="country-data">
                    <ul>
                        <li><span>Native Name</span>: ${
                          targetCountry.name.nativeName[
                            Object.keys(targetCountry.name.nativeName)[0]
                          ].common
                        }</li>
                        <li><span>Population</span>: ${targetCountry.population.toLocaleString()}</li>
                        <li><span>Region</span>: ${targetCountry.region}</li>
                        <li><span>Sub Region</span>: ${
                          targetCountry.subregion
                        }</li>
                        <li><span>Capital</span>: ${targetCountry.capital}</li>
                    </ul>
                    <ul>
                        <li><span>Top Level Domain</span>: ${targetCountry.tld.join(
                          ", "
                        )}</li>
                        <li class="currencies"><span>Currencies</span>: </li>
                        <li><span>Languages</span>: ${Object.values(
                          targetCountry.languages
                        ).join(", ")}</li>
                    </ul>
                </div>
                <p class="border">Border Countries: </p>
            </div>
        </div>
    </div>`;
  document.body.append(detailsContainer);

  insertBorderCountries(targetCountry);
  insertCurrencies(targetCountry);
  let backButton = document.getElementById("back");
  backButton.onclick = hideDetails;
}

function insertBorderCountries(targetCountry) {
  let bordersContainer = document.querySelector(".border");
  if (targetCountry.hasOwnProperty("borders") === false) {
    bordersContainer.innerHTML += "<span>None</span>";
  } else
    for (let i = 0; i < targetCountry.borders.length; i++) {
      bordersContainer.innerHTML += `
    <span>${getBorderCountryFullName(targetCountry.borders[i])}</span>`;
    }
}

function getBorderCountryFullName(cca3) {
  for (let i = 0; i < countries.length; i++) {
    if (countries[i].cca3 === cca3) return countries[i].name.common;
  }
}

function insertCurrencies(targetCountry) {
  let currenciesContainer = document.querySelector(".currencies");
  for (let i = 0; i < Object.values(targetCountry.currencies).length; i++) {
    if (i === 0) currenciesContainer.innerHTML += " ";
    currenciesContainer.innerHTML += Object.values(targetCountry.currencies)[
      i
    ].name;
    if (i !== Object.values(targetCountry.currencies).length - 1)
      currenciesContainer.innerHTML += ", ";
  }
}

function hideDetails() {
  detailsContainer.remove();
  document.body.append(main);
}
