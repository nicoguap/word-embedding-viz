import { useState, useEffect } from 'react';
import { EmbeddingSpace } from '../types';
import { getEmbeddingsForWords } from '../services/openai';

const SAMPLE_WORD_SETS = {
  emotions: ['happy', 'sad', 'angry', 'excited', 'calm'],
  colors: ['red', 'blue', 'green', 'yellow', 'purple'],
  animals: ['dog', 'cat', 'bird', 'fish', 'lion'],
};

export function useEmbeddings() {
  const [spaces, setSpaces] = useState<EmbeddingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEmbeddings() {
      try {
        const embeddingSpaces = await Promise.all(
          Object.entries(SAMPLE_WORD_SETS).map(async ([name, words]) => {
            const points = await getEmbeddingsForWords(words);
            return {
              id: name,
              name: `${name.charAt(0).toUpperCase()}${name.slice(1)} Space`,
              description: `Embedding space for ${name}`,
              points,
            };
          })
        );

        setSpaces(embeddingSpaces);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load embeddings');
        setLoading(false);
      }
    }

    loadEmbeddings();
  }, []);

  return { spaces, loading, error };
}