import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const HISTORY_FILE = path.join(__dirname, "../../data/searchHistory.json");

// : Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf8");
      return JSON.parse(data) as City[];
    } catch (error) {
      return []; // Return an empty array if the file doesn't exist or is empty
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2), "utf8");
    } catch (error) {
      console.error("Failed to write search history:", error);
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();

    // Prevent duplicate city entries
    if (!cities.some((entry) => entry.name.toLowerCase() === cityName.toLowerCase())) {
      const newCity = new City(cityName);
      cities.push(newCity);
      await this.write(cities);
    }
  }
}

export default new HistoryService();

