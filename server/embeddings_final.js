import dotenv from 'dotenv';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { MistralAIEmbeddings } from '@langchain/mistralai';

//load env file 
dotenv.config({ path: new URL("./.env", import.meta.url).pathname });

// const embeddings = new OpenAIEmbeddings({
//   model: 'text-embedding-3-large',
// });

const FALLBACK_MISTRAL_KEY = 'myRZBowpnWTgJtW20cd73a7QJ4L5pgWj';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || FALLBACK_MISTRAL_KEY;

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_rj70PRbCzlnc@ep-spring-water-a1gbg7ds-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const DB_URL = process.env.DB_URL || FALLBACK_DB_URL;

if (!MISTRAL_API_KEY) {
  throw new Error('MISTRAL_API_KEY not found. Set it in server/.env or as an environment variable.');
}

const embeddings = new MistralAIEmbeddings({
    model: 'mistral-embed',
    apiKey: MISTRAL_API_KEY,
});

export const vectorStore = await PGVectorStore.initialize(embeddings, {
  postgresConnectionOptions: {
    connectionString: DB_URL,
  },
  tableName: 'transcripts',
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'vector',
    contentColumnName: 'content',
    metadataColumnName: 'metadata',
  },
  distanceStrategy: 'cosine',
});

export const addYTVideoToVectorStore = async (videoData) => {
  const { transcript_only_text, videoId } = videoData;
//change to transcript_only_text 
  const docs = [
    new Document({
      pageContent: transcript_only_text,
      metadata: { videoId },
    }),
  ];

  // Split the video into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  await vectorStore.addDocuments(chunks);
};
