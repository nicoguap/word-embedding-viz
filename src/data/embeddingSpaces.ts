import { EmbeddingSpace } from '../types';

export const embeddingSpaces: EmbeddingSpace[] = [
  {
    id: 1,
    name: "Word2Vec Space",
    description: "Traditional word2vec embeddings",
    points: [
      { word: "hello", position: [1, 1, 1] },
      { word: "world", position: [-1, -1, -1] },
      { word: "computer", position: [2, -1, 1] },
      { word: "data", position: [-2, 1, -1] },
    ]
  },
  {
    id: 2,
    name: "GloVe Space",
    description: "Global vectors for word representation",
    points: [
      { word: "science", position: [1, -2, 2] },
      { word: "algorithm", position: [-1, 2, -2] },
      { word: "neural", position: [2, 2, -1] },
      { word: "network", position: [-2, -2, 1] },
    ]
  },
  {
    id: 3,
    name: "FastText Space",
    description: "Subword-based embeddings",
    points: [
      { word: "artificial", position: [2, 1, -1] },
      { word: "intelligence", position: [-2, 1, 1] },
      { word: "machine", position: [1, -1, 2] },
      { word: "learning", position: [-1, 2, 2] },
    ]
  }
];