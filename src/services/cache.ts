import { set, get } from 'idb-keyval';

interface CacheEntry {
  embedding: number[];
  timestamp: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedEmbedding(word: string): Promise<number[] | null> {
  try {
    const entry = await get(`embedding_${word}`) as CacheEntry | undefined;
    
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION) {
      return entry.embedding;
    }
    
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

export async function setCachedEmbedding(word: string, embedding: number[]): Promise<void> {
  try {
    const entry: CacheEntry = {
      embedding,
      timestamp: Date.now()
    };
    await set(`embedding_${word}`, entry);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}