// Standalone test for Mistral AI API basic prompt

import dotenv from "dotenv";
import axios from "axios";

import data from "./data2.js";

// load .env located next to this file
dotenv.config({ path: new URL(".env", import.meta.url).pathname });

console.log("here1");
// const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_KEY="myRZBowpnWTgJtW20cd73a7QJ4L5pgWj";
console.log("Key : ", MISTRAL_API_KEY);

async function testBasicPrompt(prompt, model = "mistral-small") {
  const url = "https://api.mistral.ai/v1/chat/completions";
  const messages = [{ role: "user", content: prompt }];

  try {
    const response = await axios.post(
      url,
      { model, messages, temperature: 0.7 },
      {
        headers: {
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Mistral AI Response:\n", response.data?.choices?.[0]?.message?.content ?? JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Mistral API error:", error.response?.data || error.message);
  }
}

// Example usage
const prompt = "List 3 headlines about Geopolitics in India today";
// testBasicPrompt(prompt);

// const video1 = data[0];

// console.log("Video 1 : ", video1.transcript_only_text);