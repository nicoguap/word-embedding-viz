import OpenAI from 'openai';
import { EmbeddingPoint } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      dimensions: 3, // Since we're visualizing in 3D
      encoding_format: "float",
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}

export async function getEmbeddingsForWords(words: string[]): Promise<EmbeddingPoint[]> {
  const embeddings = await Promise.all(
    words.map(async (word) => {
      const embedding = await getEmbedding(word);
      return {
        word,
        position: embedding as [number, number, number]
      };
    })
  );
  
  return embeddings;
}