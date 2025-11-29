# AI-Powered-Youtube-Chatbot

A conversational AI chatbot that answers questions about YouTube videos using Retrieval-Augmented Generation (RAG) and multiple LLM providers.

## 🎯 Overview

This project combines:
- **YouTube Transcript Extraction**: Automatically scrapes and processes YouTube video transcripts
- **Vector Search**: Uses PostgreSQL with pgvector for semantic search
- **Multi-LLM Support**: Works with OpenAI, Anthropic, Mistral, and Google Gemini
- **React Frontend**: Modern, responsive chat interface
- **LangGraph Agent**: Intelligent agent that retrieves relevant video content and generates answers

## 🏗️ Architecture

```
┌─────────────────┐
│  React Client   │ (TypeScript + Vite)
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│ Express Server  │ (Node.js)
└────────┬────────┘
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
┌────────┐ ┌──────────┐ ┌────────┐
│ LLM    │ │ Vector   │ │ Tools  │
│ Models │ │ Store    │ │ (RAG)  │
└────────┘ └──────────┘ └────────┘
```

## 🚀 Features

- **Intelligent Video Search**: Ask questions about YouTube video content
- **Context-Aware Responses**: Uses RAG to retrieve relevant video segments
- **Persistent Chat**: Maintains conversation history with thread IDs
- **Multiple LLM Providers**: Switch between different AI models
- **Vector Database**: Fast semantic search across transcripts
- **Responsive UI**: Works on desktop and mobile devices

## 📁 Project Structure

### Client (`client/`)
React TypeScript application using Vite

- `src/App.tsx` - Main chat component with message handling
- `src/index.css` - Dark theme styling
- `src/main.tsx` - React entry point
- `vite.config.ts` - Vite configuration

**Key Features:**
- Real-time message streaming
- Loading animations
- Chat reset functionality
- Responsive design

### Server (`server/`)
Node.js backend with LangChain integration

#### Core Files:
- `index.js` - Express server and API endpoints
- `agent_final.js` - LangGraph agent with Mistral AI (production)
- `agent.js` - Alternative agent with OpenAI/Anthropic
- `embeddings_final.js` - Vector store setup with Mistral embeddings
- `embeddings.js` - Alternative embeddings with OpenAI

#### Supporting Files:
- `brightdata.js` - YouTube scraping integration
- `data.js` - Sample video data
- `data2.js` - Additional video data

## 🔧 API Endpoints

### POST `/generate`
Generate AI response for a query

**Request:**
```json
{
  "query": "What is this video about?",
  "thread_id": 1234567890
}
```

**Response:**
```text
AI-generated answer based on video transcript...
```

### GET `/`
Health check endpoint

## 🗄️ Data Flow

```
User Query
    ↓
LangGraph Agent
    ├─→ retrieveTool: Search vector store for relevant transcript chunks
    ├─→ retrieveSimilarVideosTool: Find related videos
    └─→ LLM: Generate contextual response
    ↓
Response sent to client
```

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Database
DB_URL=postgresql://user:password@host/database

# API Keys
MISTRAL_API_KEY=your_mistral_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key

# YouTube Scraping
BRIGHTDATA_API_KEY=your_brightdata_key
API_URL=http://localhost:3000

# Server
PORT=3000
```

## 📦 Installation

### Prerequisites
- Node.js 16+
- PostgreSQL with pgvector extension
- API keys for at least one LLM provider

### Setup

**Client:**
```bash
cd client
npm install
npm run dev
```

**Server:**
```bash
cd server
npm install
npm start
```

## 🎮 Usage

1. Start the server on `http://localhost:3000`
2. Start the client on `http://localhost:5173`
3. Enter a YouTube video URL or ask questions about video content
4. The agent retrieves relevant transcript chunks and generates answers
5. Click "New Chat" to reset conversation

## 🤖 LLM Models

The project supports multiple LLM providers:

| Provider | Model | File |
|----------|-------|------|
| Mistral | mistral-small | `agent_final.js` |
| OpenAI | gpt-4 | `agent.js` |
| Anthropic | claude-3-7-sonnet | `agent.js` |
| Google | gemini-pro | `test_agent.js` |

## 🔍 How RAG Works

```
YouTube Transcript
    ↓
Split into chunks (1000 chars, 200 overlap)
    ↓
Generate embeddings (Mistral/OpenAI)
    ↓
Store in PostgreSQL vector DB
    ↓
User Query → Generate embedding → Similarity search → Top 3-30 chunks
    ↓
Pass to LLM with context → Generate answer
```

## 📱 Frontend Interface

### Chat Container
- **Header**: Chat title and reset button
- **Messages**: Scrollable conversation with user/AI message distinction
- **Input**: Textarea with send button
- **Loading**: Animated dots during response generation

### Styling
- Dark theme with purple accent (`#bb86fc`)
- Responsive breakpoints for tablet and mobile
- Smooth animations and transitions

## 🚢 Deployment

The project uses **Genezio** for serverless deployment:
- Frontend: Static hosting
- Backend: Serverless functions
- Database: PostgreSQL (external)

Configuration in `genezio.yaml`

## 🛠️ Technologies Used

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3 (dark theme)

**Backend:**
- Node.js
- Express
- LangChain/LangGraph
- pgvector
- PostgreSQL

**AI/ML:**
- LangGraph (agent framework)
- Mistral AI
- OpenAI
- Anthropic Claude
- Google Gemini

---

**Start chatting with your YouTube videos now!** 🎬💬