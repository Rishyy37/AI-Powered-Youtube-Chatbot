import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

// Use Google Gemini model
const llm = new ChatGoogleGenerativeAI({
    modelName: 'gemini-pro',
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY
});

const agent = createReactAgent({
    llm, 
    tools: []
});

(async () => {
    const results = await agent.invoke({
        messages: [{ role: 'user', content: 'How many countries are there in the world?' }]
    });

    console.log(results);
})();