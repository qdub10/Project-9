import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface Weather {
  temperature: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

// TODO: Complete the WeatherService class
class WeatherService {
  getSearchHistory() {
    throw new Error("Method not implemented.");
  }
  private baseURL = "https://api.openweathermap.org/data/2.5";
  private apiKey = process.env.OPENWEATHER_API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.error("❌ ERROR: OpenWeather API Key is missing!");
      throw new Error("Missing API key in .env file");
    }
    console.log("✅ OpenWeather API Key Loaded");
  }

  // TODO: Fetch location data based on city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    console.log(`🌎 Fetching location for: ${city}`);

    const url = `${this.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}`;
    console.log(`🔗 Location API URL: ${url}`);

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Location Data Received:`, data.coord);
      return data.coord;
    } catch (error: any) {
      console.error(`❌ Location API Error: ${error.message}`);
      throw new Error("Failed to fetch location data");
    }
  }

  // TODO: Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    console.log(`🌤 Fetching weather for coordinates:`, coordinates);

    const url = `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;

    console.log(`🔗 Weather API URL: ${url}`);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Weather API Data Received");

      return this.buildForecastArray(data);
    } catch (error: any) {
      console.error(`❌ Weather API Error: ${error.message}`);
      throw new Error("Failed to fetch weather data from OpenWeather API");
    }
  }

  // TODO: Build an array of weather data from API response
  private buildForecastArray(weatherData: any): Weather[] {
    return weatherData.list.slice(0, 5).map((data: any) => ({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    }));
  }

  // TODO: Get weather data for a city
  async getWeatherForCity(city: string): Promise<{ city: string; weather: Weather[] }> {
    console.log(`🔍 Searching weather for city: ${city}`);

    const coordinates = await this.fetchLocationData(city);
    const weatherArray = await this.fetchWeatherData(coordinates);

    // ✅ FIXED: Ensure JSON response has NO extra nesting
    return { city, weather: weatherArray };
  }
}

export default new WeatherService();
