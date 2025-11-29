import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';

import { vectorStore, addYTVideoToVectorStore } from './embeddings.js';
import data from './data.js';
import { triggerYoutubeVideoScrape } from './brightdata.js';

// Mistral AI API integration
import axios from 'axios';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

// Custom Mistral LLM wrapper for LangChain
class ChatMistral {
  constructor({ modelName = "mistral-small", temperature = 0.7 } = {}) {
    this.modelName = modelName;
    this.temperature = temperature;
  }

  async call(messages) {
    const url = "https://api.mistral.ai/v1/chat/completions";
    try {
      const response = await axios.post(
        url,
        {
          model: this.modelName,
          messages,
          temperature: this.temperature,
          max_tokens: 512,
        },
        {
          headers: {
            "Authorization": `Bearer ${MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Mistral API error:", error.response?.data || error.message);
      throw new Error("Failed to get response from Mistral AI");
    }
  }

  // LangChain expects an invoke method
  async invoke(input) {
    // input is { messages: [...] }
    return { content: await this.call(input.messages) };
  }
}

// Tools (same as agent.js)
const triggerYoutubeVideoScrapeTool = tool(
  async ({ url }) => {
    console.log('Triggering youtube video scrape', url);

    const snapshotId = await triggerYoutubeVideoScrape(url);

    console.log('Youtube video scrape triggered', snapshotId);
    return snapshotId;
  },
  {
    name: 'triggerYoutubeVideoScrape',
    description: `
    Trigger the scraping of a youtube video using the url. 
    The tool start a scraping job, that usually takes around 7 seconds
    The tool will return a snapshot/job id, that can be used to check the status of the scraping job
    Before calling this tool, make sure that it is not already in the vector store
  `,
    schema: z.object({
      url: z.string(),
    }),
  }
);

const retrieveTool = tool(
  async ({ query, video_id }, { configurable: {} }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 3, {
      video_id,
    });

    const serializedDocs = retrievedDocs
      .map((doc) => doc.pageContent)
      .join('\n ');

    return serializedDocs;
  },
  {
    name: 'retrieve',
    description:
      'Retrieve the most relevant chunks of text from the transcript for a specific youtube video',
    schema: z.object({
      query: z.string(),
      video_id: z.string().describe('The id of the video to retrieve'),
    }),
  }
);

const retrieveSimilarVideosTool = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 30);

    const ids = retrievedDocs.map((doc) => doc.metadata.video_id).join('\n ');

    return ids;
  },
  {
    name: 'retrieveSimilarVideos',
    description: 'Retrieve the ids of the most similar videos to the query',
    schema: z.object({
      query: z.string(),
    }),
  }
);

// Use Mistral LLM instead of OpenAI/Anthropic
const llm = new ChatMistral({
  modelName: 'mistral-small',
  temperature: 0.7,
});

const checkpointer = new MemorySaver();

export const agent = createReactAgent({
  llm,
  tools: [
    retrieveTool,
    triggerYoutubeVideoScrapeTool,
    retrieveSimilarVideosTool,
  ],
  checkpointer,
});