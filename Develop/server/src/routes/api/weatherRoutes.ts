import { Router, type Request, type Response } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url"; // ✅ Required for ES modules
import WeatherService from "../../service/weatherService.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// ✅ Fix: Manually define `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE = path.join(__dirname, "../../../data/searchHistory.json");

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }

    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: Read search history file
    let history = [];
    try {
      const data = await fs.readFile(HISTORY_FILE, "utf8");
      history = JSON.parse(data);
    } catch (readError) {
      console.error("Error reading search history:", readError);
    }

    // Prevent duplicate city entries
    if (!history.some((entry: any) => entry.city.toLowerCase() === city.toLowerCase())) {
      const newEntry = { id: uuidv4(), city };
      history.push(newEntry);

      // TODO: Save updated history
      try {
        await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
      } catch (writeError) {
        console.error("Error saving search history:", writeError);
        return res.status(500).json({ error: "Failed to save search history" });
      }
    }

    // ✅ Ensure response is always returned
    return res.json({ city, weather: weatherData });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({ error: "Failed to retrieve weather data" });
  }
});

export default router;
