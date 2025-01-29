import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById(
  'search-form'
) as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById(
  'search-input'
) as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById(
  'history'
) as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById(
  'search-title'
) as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById(
  'weather-img'
) as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById(
  'temp'
) as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById(
  'wind'
) as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById(
  'humidity'
) as HTMLParagraphElement;

/*

API Calls

*/

// ✅ FIXED: API request now correctly sends `{ city: "Boston" }`
const fetchWeather = async (city: string) => {
  console.log(`🌎 Fetching weather for: ${city}`);

  const response = await fetch('http://localhost:3001/api/weather/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city }), // ✅ FIXED: Sending correctly formatted data
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const weatherData = await response.json();
  console.log('✅ Weather Data Received:', weatherData);

  if (!weatherData.weather || !Array.isArray(weatherData.weather)) {
    throw new Error('Invalid weather data format');
  }

  renderCurrentWeather(weatherData.weather[0]); // ✅ FIXED: Display first entry
  renderForecast(weatherData.weather.slice(1)); // ✅ FIXED: Display remaining entries
};

// ✅ Fetch search history from backend
const fetchSearchHistory = async () => {
  const response = await fetch('http://localhost:3001/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch search history: ${response.statusText}`);
  }

  return response.json();
};

// ✅ Delete city from search history
const deleteCityFromHistory = async (id: string) => {
  await fetch(`http://localhost:3001/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  const { city, description, temperature, wind_speed, humidity, icon } =
    currentWeather;

  heading.textContent = `${city}`;
  weatherIcon.setAttribute('src', icon);
  weatherIcon.setAttribute('alt', description);
  tempEl.textContent = `Temp: ${temperature}°F`;
  windEl.textContent = `Wind: ${wind_speed} m/s`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (todayContainer) {
    todayContainer.innerHTML = '';
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  forecast.forEach((day) => renderForecastCard(day));
};

const renderForecastCard = (forecast: any) => {
  const { description, temperature, wind_speed, humidity, icon } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } =
    createForecastCard();

  // Add content to elements
  cardTitle.textContent = description;
  weatherIcon.setAttribute('src', icon);
  tempEl.textContent = `Temp: ${temperature}°F`;
  windEl.textContent = `Wind: ${wind_speed} m/s`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (forecastContainer) {
    forecastContainer.append(col);
  }
};

const renderSearchHistory = async () => {
  const historyList = await fetchSearchHistory();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML =
        '<p class="text-center">No Previous Search History</p>';
    }

    historyList.reverse().forEach((city: any) => {
      const historyItem = buildHistoryListItem(city);
      searchHistoryContainer.append(historyItem);
    });
  }
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

const buildHistoryListItem = (city: any) => {
  const newBtn = createHistoryButton(city.name);
  const deleteBtn = createDeleteButton();
  deleteBtn.dataset.city = JSON.stringify(city);
  const historyDiv = createHistoryDiv();
  historyDiv.append(newBtn, deleteBtn);
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    alert('❌ City cannot be blank');
    return;
  }

  const search = searchInput.value.trim();
  fetchWeather(search).then(() => {
    getAndRenderHistory();
  });
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.history-btn')) {
    const city = target.textContent || '';
    fetchWeather(city).then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityID = JSON.parse(target.getAttribute('data-city') || '{}').id;
  deleteCityFromHistory(cityID).then(getAndRenderHistory);
};

/*

Initial Render

*/

const getAndRenderHistory = () => fetchSearchHistory().then(renderSearchHistory);

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
function createHistoryButton(name: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('history-btn');
  button.textContent = name;
  return button;
}

function createDeleteButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('delete-btn');
  button.textContent = 'Delete';
  return button;
}

function createHistoryDiv(): HTMLDivElement {
  const div = document.createElement('div');
  div.classList.add('history-item');
  return div;
}

