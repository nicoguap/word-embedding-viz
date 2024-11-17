import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Point } from './Point';
import { EmbeddingPoint, SelectedPoint } from '../types';

interface WordEmbeddingVizProps {
  points: EmbeddingPoint[];
}

export const WordEmbeddingViz = ({ points }: WordEmbeddingVizProps) => {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);

  const handlePointClick = (word: string, position: [number, number, number]) => {
    setSelectedPoint(prev => 
      prev?.word === word ? null : { word, position }
    );
  };

  return (
    <div className="relative w-full h-full bg-background">
      <Canvas 
        camera={{ position: [5, 5, 5], fov: 75 }}
        onPointerMissed={() => setSelectedPoint(null)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <gridHelper args={[10, 10]} />
        <axesHelper args={[5]} />
        
        {points.map((embed, idx) => (
          <Point 
            key={idx} 
            position={embed.position} 
            word={embed.word}
            onPointerUp={handlePointClick}
            isSelected={selectedPoint?.word === embed.word}
          />
        ))}
        
        <OrbitControls 
          makeDefault
          enableDamping={false}
        />
      </Canvas>

      {selectedPoint && (
        <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">{selectedPoint.word}</h3>
          <div>x: {selectedPoint.position[0].toFixed(3)}</div>
          <div>y: {selectedPoint.position[1].toFixed(3)}</div>
          <div>z: {selectedPoint.position[2].toFixed(3)}</div>
        </div>
      )}
    </div>
  );
};