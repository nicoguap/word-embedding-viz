import { useState, useEffect, useCallback } from 'react';
import { EmbeddingSpace, EmbeddingPoint } from '../types';
import { getEmbedding } from '../services/openai';

const INITIAL_WORDS = [
  'france', 'paris', 'japan', 'tokyo', 'italy', 'rome',
  'king', 'queen', 'man', 'woman', 'father', 'mother',
  'day', 'night', 'summer', 'winter', 'morning', 'evening',
  'big', 'small', 'giant', 'tiny', 'huge', 'microscopic',
  'happy', 'sad', 'angry', 'calm', 'excited', 'bored',
  'dog', 'cat', 'bird', 'fish', 'lion', 'elephant',
  'red', 'blue', 'green', 'yellow', 'black', 'white',
  'earth', 'moon', 'sun', 'star', 'planet', 'galaxy'
];

export function useEmbeddings() {
  const [words, setWords] = useState<string[]>(INITIAL_WORDS);
  const [spaces, setSpaces] = useState<EmbeddingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastAddedWord, setLastAddedWord] = useState<string | null>(null);

  const updateSpaces = useCallback(async (words: string[], embeddings: number[][]) => {
    // First, normalize the entire embedding space
    const allValues = embeddings.flat();
    const globalMax = Math.max(...allValues);
    const globalMin = Math.min(...allValues);
    const globalRange = globalMax - globalMin;

    // Global normalization to [-1, 1]
    const normalizedEmbeddings = embeddings.map(embedding => 
      embedding.map(value => {
        // Add a tiny bit of randomness to prevent perfect alignment
        const normalizedValue = 2 * ((value - globalMin) / globalRange) - 1;
        const jitter = (Math.random() - 0.5) * 0.1; // Small random offset
        return normalizedValue + jitter;
      })
    );

    return [{
      id: "raw",
      name: "Raw Embedding Space",
      description: "18-dimensional embedding space",
      points: words.map((word, idx) => ({
        word,
        position: normalizedEmbeddings[idx]
      }))
    }];
  }, []);

  const addWord = async (newWord: string) => {
    setLoading(true);
    try {
      const newEmbedding = await getEmbedding(newWord);
      const updatedWords = [...words, newWord];
      
      const updatedSpaces = await updateSpaces(
        updatedWords, 
        [...spaces[0].points.map(p => p.position), newEmbedding]
      );
      
      setWords(updatedWords);
      setSpaces(updatedSpaces);
      setLastAddedWord(newWord);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add word');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadEmbeddings() {
      try {
        const embeddings = await Promise.all(
          words.map(word => getEmbedding(word))
        );
        
        const initialSpaces = await updateSpaces(words, embeddings);
        setSpaces(initialSpaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load embeddings');
      } finally {
        setLoading(false);
      }
    }

    loadEmbeddings();
  }, []);

  return { spaces, loading, error, addWord, lastAddedWord };
}