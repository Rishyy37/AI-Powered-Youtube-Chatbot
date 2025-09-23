// import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';
import { ChatMistralAI} from '@langchain/mistralai';
import { vectorStore, addYTVideoToVectorStore } from './embeddings_final.js';
import data from './data2.js';
// import { ChatMistralAI } from '@langchain/mistralai';
// import { triggerYoutubeVideoScrape } from './brightdata.js';

await addYTVideoToVectorStore(data[0]);
// await addYTVideoToVectorStore(data[1]);


//Video Scraping Tool (Disabled for now as data2.js is present)
// const triggerYoutubeVideoScrapeTool = tool(
//   async ({ url }) => {
//     console.log('Triggering youtube video scrape', url);

//     const snapshotId = await triggerYoutubeVideoScrape(url);

//     console.log('Youtube video scrape triggered', snapshotId);
//     return snapshotId;
//   },
//   {
//     name: 'triggerYoutubeVideoScrape',
//     description: `
//     Trigger the scraping of a youtube video using the url. 
//     The tool start a scraping job, that usually takes around 7 seconds
//     The tool will return a snapshot/job id, that can be used to check the status of the scraping job
//     Before calling this tool, make sure that it is not already in the vector store
//   `,
//     schema: z.object({
//       url: z.string(),
//     }),
//   }
// );


// retrieval tool
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

// retrieveal similar videos tool
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

// const llm = new ChatAnthropic({
//   modelName: 'claude-3-7-sonnet-latest',
// });

const FALLBACK_MISTRAL_KEY = 'myRZBowpnWTgJtW20cd73a7QJ4L5pgWj';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || FALLBACK_MISTRAL_KEY;

const llm = new ChatMistralAI({
    modelName: 'mistral-small',
    temperature: 0.7,
    apiKey: MISTRAL_API_KEY
})

const checkpointer = new MemorySaver();

export const agent = createReactAgent({
  llm,
  tools: [
    retrieveTool,
    // triggerYoutubeVideoScrapeTool,           //disabled for now
    retrieveSimilarVideosTool,
  ],
  checkpointer,
});
