import { Router, Request, Response } from "express";
import WeatherService from "../../service/weatherService.js";

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
    console.log("🔥 Incoming Request Body:", req.body);

    try {
        const city = req.body.city;
        if (!city) {
            console.error("❌ Missing city in request");
            return res.status(400).json({ error: "City name is required" });
        }

        console.log("✅ Fetching weather for:", city);
        const weatherData = await WeatherService.getWeatherForCity(city);

        console.log("✅ Weather Data Sent:", JSON.stringify(weatherData, null, 2));

        // ✅ FIXED: Ensure JSON is correctly formatted without extra nesting
        res.setHeader("Content-Type", "application/json");
        return res.json(weatherData);
    } catch (error: any) {
        console.error("❌ Backend Error:", error.message);
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Failed to retrieve weather data", details: error.message });
    }
});

// TODO: GET search history
router.get("/history", async (req: Request, res: Response) => {
    try {
        console.log("📜 Fetching search history...");
        const history = await WeatherService.getSearchHistory();
        res.setHeader("Content-Type", "application/json");
        res.json(history);
    } catch (error: any) {
        console.error("❌ Error fetching search history:", error.message);
        res.status(500).json({ error: "Failed to retrieve search history" });
    }
});

// * BONUS TODO: DELETE city from search history


export default router;
