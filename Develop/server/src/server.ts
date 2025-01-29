import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Import the routes
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Fix: Manually define `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Fix: Ensure correct reference to `client/dist`
const clientBuildPath = path.resolve(__dirname, "../../client/dist");

app.use(express.static(clientBuildPath));

// ✅ Fix: Serve `index.html` from correct location
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for cross-origin requests
app.use(cors());

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
