import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  date: string;

  constructor(data: any) {
    this.temperature = data.main.temp;
    this.humidity = data.main.humidity;
    this.windSpeed = data.wind.speed;
    this.description = data.weather[0].description;
    this.icon = data.weather[0].icon;
    this.date = data.dt_txt;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = "https://api.openweathermap.org/data/2.5";
  private apiKey = process.env.OPENWEATHER_API_KEY;

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          q: query,
          appid: this.apiKey,
          units: "metric",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching location data:", error);
      throw new Error("Failed to fetch location data");
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    return new Weather(response.list[0]);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(1, 6).map((data) => new Weather(data));
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchLocationData(city).then(this.destructureLocationData);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData.list);

    return { currentWeather, forecast };
  }
}

export default new WeatherService();

