import OpenAI from 'openai';
import { getCachedEmbedding, setCachedEmbedding } from './cache';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    // Check cache first
    const cached = await getCachedEmbedding(text);
    if (cached) {
      return cached;
    }

    // If not in cache, fetch from API
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 10,
      encoding_format: "float",
    });
    
    const embedding = response.data[0].embedding;
    
    // Cache the result
    await setCachedEmbedding(text, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}