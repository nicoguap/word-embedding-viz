export interface EmbeddingSpace {
  id: string;
  name: string;
  description: string;
  points: EmbeddingPoint[];
}

export interface EmbeddingPoint {
  word: string;
  position: [number, number, number];
}

export interface PointProps {
  position: [number, number, number];
  word: string;
  onPointerUp: (word: string, position: [number, number, number]) => void;
  isSelected: boolean;
}

export interface SelectedPoint {
  word: string;
  position: [number, number, number];
}