// ...existing code...
import dotenv from "dotenv";
import axios from "axios";
import { writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// load .env next to this file
dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const API_KEY = process.env.SCRAPE_CREATORS_API || process.env.SCRAPE_CREATORS_API_KEY || 'vt1zLuWD4SOjADYmSa41GJTvWi92';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetches the API response and saves api_data to a JSON file.
 * @param {string} url - Full GET URL for the transcript API (including encoded query params).
 * @param {string} outFile - Filename to write the api_data to (relative to this file).
 */
export async function fetchAndSaveApiData(url, outFile = "api_data.json") {
  if (!API_KEY) throw new Error("SCRAPE_CREATORS_API key not found in .env");

  const res = await axios.get(url, {
    headers: { "x-api-key": API_KEY },
  });

  // many APIs wrap payload in { api_data: { ... } }, fall back to whole response if missing
  const api_data = res.data?.api_data ?? res.data;

  const outPath = path.resolve(__dirname, outFile);
  await writeFile(outPath, JSON.stringify(api_data, null, 2), "utf8");
  console.log("Saved api_data to", outPath);
  return api_data;
}

// CLI usage when run directly:
// node server/save_api_data.js "https://api.scrapecreators.com/v1/youtube/video/transcript?url=ENCODED_URL" optionalOutputFile.json
// ...existing code...
if (process.argv[1] === __filename) {
  // Hardcoded YouTube video (URL must be URL-encoded in the query param)
  const url =
    "https://api.scrapecreators.com/v1/youtube/video/transcript?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dru44DngJYoA";

  const outFile = process.argv[3] ?? "api_data.json";

  fetchAndSaveApiData(url, outFile).catch((err) => {
    console.error("Error fetching/saving api_data:", err.response?.data ?? err.message);
    process.exit(1);
  });
}
// ...existing code...