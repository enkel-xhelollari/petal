const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");

const currencyMultiplierBuy = {
  EUR: 2,
  USD: 3,
  GBP: 4,
  CAD: 5,
  CHF: 6,
  AUD: 7,
};

const currencyMultiplierSell = {
  EUR: 7,
  USD: 4,
  GBP: 4,
  CAD: 5,
  CHF: 6,
  AUD: 7,
};

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    // selecting USD by default as FROM currency and NPR as TO currency
    let selected =
      i == 0
        ? currency_code == "EUR"
          ? "selected"
          : ""
        : currency_code == "ALL"
        ? "selected"
        : "";
    // creating option tag with passing currency code as a text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    // inserting options tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); // calling loadFlag with passing target element as an argument
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      // if currency code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); // selecting img tag of particular drop list
      // passing country code of a selected currency code in a img url
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); //preventing form from submitting
  getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value; // temporary currency code of FROM drop list
  fromCurrency.value = toCurrency.value; // passing TO currency code to FROM currency code
  toCurrency.value = tempCode; // passing temporary currency code to TO currency code
  loadFlag(fromCurrency); // calling loadFlag with passing select element (fromCurrency) of FROM
  loadFlag(toCurrency); // calling loadFlag with passing select element (toCurrency) of TO
  getExchangeRate(); // calling getExchangeRate
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  let amountVal = amount.value;
  // if user don't enter any value or enter 0 then we'll put 1 value by default in the input field
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://v6.exchangerate-api.com/v6/167eb2dba403da8bcaea84bf/latest/${fromCurrency.value}`;
  // fetching api response and returning it with parsing into js obj and in another then method receiving that obj
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value]; // getting user selected TO currency rate
      //let totalExRate = ((amountVal - (amountVal * 0.05)) * exchangeRate).toFixed(2); // multiplying user entered value with selected TO currency rate
      let totalExRate = (amountVal * (exchangeRate * 0.99)).toFixed(2); // multiplying user entered value with selected TO currency rate
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      // if user is offline or any other error occured while fetching data then catch function will run
      exchangeRateTxt.innerText = "Something went wrong";
    });
}

// Table

// Make a GET request to the API
const apiUrl =
  "https://v6.exchangerate-api.com/v6/167eb2dba403da8bcaea84bf/latest/ALL";

// Mapping of currency codes to flag icons
const currencyFlags = {
  USD: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/US_flag_51_stars.svg/2560px-US_flag_51_stars.svg.png", // Replace with actual flag URLs
  EUR: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/255px-Flag_of_Europe.svg.png",
  GBP: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
  CAD: "https://www.worldatlas.com/img/flag/ca-flag.jpg",
  CHF: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png",
  AUD: "https://e7.pngegg.com/pngimages/382/452/png-clipart-flag-of-united-kingdom-raven-products-flag-of-australia-australia-flag-blue-flag-thumbnail.png",
  // Add more currency codes and flag URLs as needed
};

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Get the rates object from the API response
    const rates = data.conversion_rates;

    // Get the rate for Albanian Lek (ALL)
    const allRate = rates.ALL;

    // Get the table body element
    const tableBody = document.getElementById("currencyTableBody");

    // Retrieve the currencies
    const currencies = Object.keys(rates);

    // Define the most used currencies
    const mostUsedCurrencies = ["USD", "EUR", "GBP", "CAD", "CHF", "AUD"]; // Add more if needed

    // Loop through each currency and its rate, only for the most used currencies
    for (let currency of mostUsedCurrencies) {
      // Create a new table row
      const row = document.createElement("tr");

      // Create currency cell
      const currencyCell = document.createElement("td");

      // Create flag element and set its background image
      const flagElement = document.createElement("span");
      flagElement.classList.add("flag-icon");
      flagElement.style.backgroundImage = `url(${currencyFlags[currency]})`;

      // Create currency text node
      const currencyTextNode = document.createTextNode(` ${currency}`);

      // Append flag element and currency text node to currency cell
      currencyCell.appendChild(flagElement);
      currencyCell.appendChild(currencyTextNode);

      row.appendChild(currencyCell);

      // Create rate cell 1
      const rateCell1 = document.createElement("td");
      rateCell1.textContent = (
        (1 / rates[currency]) *
        currencyMultiplierBuy[currency] *
        allRate
      ).toFixed(2); // Calculate the rate relative to Albanian Lek (ALL)
      row.appendChild(rateCell1);

      // Create rate cell 2
      const rateCell2 = document.createElement("td");
      rateCell2.textContent = (
        (1 / rates[currency]) *
        currencyMultiplierSell[currency] *
        allRate
      ).toFixed(2); // Calculate the rate relative to Albanian Lek (ALL)
      row.appendChild(rateCell2);

      // Append the row to the table body
      tableBody.appendChild(row);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
