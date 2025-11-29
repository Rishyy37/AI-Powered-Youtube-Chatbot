import dotenv from "dotenv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import data from "./data2.js";
import axios from "axios";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { MistralAIEmbeddings } from "@langchain/mistralai";



// load .env located next to this file
dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

const api_data = data[0];

//Avoid unnecessary API calls if data2.js is present
// const { api_data } = await axios.get(
//   'https://api.scrapecreators.com/v1/youtube/video/transcript?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dru44DngJYoA',
//   {
//     headers: {
//       'x-api-key': 'vt1zLuWD4SOjADYmSa41GJTvWi92'
//     }
//   }
// );

export const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const docs = [
  new Document({
    pageContent: api_data.transcript_only_text,
    metadata: {
      video_id: api_data.videoId,
    },
  }),
];

const chunks = await splitter.splitDocuments(docs);

// Use OPENAI_API_KEY from .env
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// if (!OPENAI_API_KEY) {
//   console.warn("OPENAI_API_KEY not set in .env");
// }

//OPEN AI embedding model
// const embeddings = new OpenAIEmbeddings({
//   model: "text-embedding-3-large",
//   apiKey: OPENAI_API_KEY,
// });

// Mistral embedding model
const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments(chunks);

const retrievedDocs = await vectorStore.similaritySearch("What is the main topic of the video?", 3);

console.log("Retrieved Docs : ", retrievedDocs);
// console.log("Chunks : ", chunks);

// console.log("_".repeat(50));

// console.log("Embeddings : ", embeddings);