import OpenAI from 'openai';
import { getCachedEmbedding, setCachedEmbedding } from './cache';


// Function to get API key based on environment
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  
  return apiKey;
};

// Create OpenAI client with error handling
const createOpenAIClient = () => {
  try {
    return new OpenAI({
      apiKey: getApiKey(),
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    throw error;
  }
};

const openai = createOpenAIClient();

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const cached = await getCachedEmbedding(text);
    if (cached) {
      return cached;
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 18,
      encoding_format: "float",
    });
    
    const embedding = response.data[0].embedding;
    await setCachedEmbedding(text, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}