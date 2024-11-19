import { useState, useEffect } from 'react';
import { EmbeddingSpace } from '../types';
import { getEmbedding } from '../services/openai';
import { reductionMethods } from '../services/dimensionalityReduction';

const ALL_WORDS = [
  // Countries and capitals
  'france', 'paris', 'japan', 'tokyo', 'italy', 'rome',
  
  // Gender pairs
  'king', 'queen', 'man', 'woman', 'father', 'mother',
  
  // Time relationships
  'day', 'night', 'summer', 'winter', 'morning', 'evening',
  
  // Size relationships
  'big', 'small', 'giant', 'tiny', 'huge', 'microscopic'
];

export function useEmbeddings() {
  const [spaces, setSpaces] = useState<EmbeddingSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highDimEmbeddings, setHighDimEmbeddings] = useState<number[][]>([]);

  useEffect(() => {
    async function loadEmbeddings() {
      try {
        // Get 10D embeddings for all words
        const embeddings = await Promise.all(
          ALL_WORDS.map(word => getEmbedding(word))
        );
        
        setHighDimEmbeddings(embeddings);

        // Create three different spaces using different reduction methods
        const spaces: EmbeddingSpace[] = [
          {
            id: "pca",
            name: "PCA Space",
            description: "Linear dimensionality reduction preserving global structure",
            points: ALL_WORDS.map((word, idx) => ({
              word,
              position: reductionMethods.pca(embeddings)[idx]
            }))
          },
          {
            id: "umap",
            name: "UMAP Space",
            description: "Non-linear reduction preserving local neighborhoods",
            points: ALL_WORDS.map((word, idx) => ({
              word,
              position: reductionMethods.umap(embeddings)[idx]
            }))
          },
          {
            id: "tsne",
            name: "t-SNE Space",
            description: "Non-linear reduction emphasizing cluster structure",
            points: ALL_WORDS.map((word, idx) => ({
              word,
              position: reductionMethods.tsne(embeddings)[idx]
            }))
          }
        ];

        setSpaces(spaces);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load embeddings');
        setLoading(false);
      }
    }

    loadEmbeddings();
  }, []);

  return { spaces, loading, error, highDimEmbeddings };
}
