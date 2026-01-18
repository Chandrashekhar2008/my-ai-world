import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// This allows the AI to run for up to 30 seconds for complex searches
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, provider = 'gemini' } = await req.json();

  // 1. Select the AI Brain (Gemini is usually faster for students)
  const model = provider === 'gemini' 
    ? google('gemini-2.0-flash-exp') 
    : openai('gpt-4o');

  const result = streamText({
    model,
    messages,
    maxSteps: 5, // Crucial: Allows the AI to search, read, and search again
    system: `You are a world-class AI Assistant with real-time web access. 
             Always use the webSearch tool if the user asks about current events, 
             stock prices, weather, or news. Be concise and professional.`,
    tools: {
      webSearch: tool({
        description: 'Search the internet for real-time information using Tavily',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              api_key: process.env.TAVILY_API_KEY, 
              query,
              search_depth: "advanced" 
            }),
          });
          const data = await response.json();
          return data;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}