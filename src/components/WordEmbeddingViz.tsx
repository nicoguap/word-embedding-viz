import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Point } from './Point';
import * as THREE from 'three';
import { EmbeddingPoint, SelectedPoint } from '../types';


// Add to the top of the existing component:
interface WordEmbeddingVizProps {
  points: EmbeddingPoint[];
  onAddWord?: (word: string) => Promise<void>;
  isLoading?: boolean;
  dimensionIndices: [number, number, number];
  title: string;
  selectedWord?: string | null;
  onWordSelect?: (word: string | null) => void;
  selectedDim?: number | null;
  onSelectDim?: (dim: number | null) => void;
}

// Add this new component above the main WordEmbeddingViz component
function AutoRotate({ orbitControlsRef }: { orbitControlsRef: React.RefObject<any> }) {
  useFrame(() => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.autoRotate = true;
      orbitControlsRef.current.autoRotateSpeed = 0.5;
    }
  });
  return null;
}

export const WordEmbeddingViz = ({ 
  points, 
  dimensionIndices, 
  title,
  selectedWord,
  onWordSelect,
  selectedDim,
  onSelectDim
}: WordEmbeddingVizProps) => {
  const orbitControlsRef = useRef<any>(null);

  // Map the points to use the specified dimensions and ensure they're valid 3D points
  const mappedPoints = points.map(point => {
    // Ensure we have values for all three dimensions
    const x = point.position[dimensionIndices[0]] ?? 0;
    const y = point.position[dimensionIndices[1]] ?? 0;
    const z = point.position[dimensionIndices[2]] ?? 0;
    
    return {
      ...point,
      position: [x, y, z] as [number, number, number]
    };
  });

  const handlePointClick = (word: string, position: [number, number, number]) => {
    onWordSelect?.(word === selectedWord ? null : word);
    onSelectDim?.(dimensionIndices[0]);
  };

  return (
    <div className="relative w-full h-full bg-background dark:bg-slate-950">
      <div className="absolute top-2 left-2 z-10 text-white font-bold">
        {title}
      </div>
      <Canvas 
        camera={{ position: [10, 10, 10], fov: 75 }}
        onPointerMissed={() => onWordSelect?.(null)}
      >
        <AutoRotate orbitControlsRef={orbitControlsRef} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        
        <gridHelper 
          args={[10, 10]} 
          rotation={[0, 0, 0]}
          material={new THREE.LineBasicMaterial({ 
            color: "#666666",  // Darker gray for better visibility
            opacity: 0.4,
            transparent: true
          })}
        />
        
        <axesHelper args={[5]}>
          <lineBasicMaterial attach="material" color="#ffffff" opacity={0.7} transparent />
        </axesHelper>
        
        {mappedPoints.map((embed, idx) => (
          <Point 
            key={idx} 
            position={embed.position} 
            word={embed.word}
            onPointerUp={handlePointClick}
            isSelected={selectedWord === embed.word && selectedDim === dimensionIndices[0]}
          />
        ))}
        
        <OrbitControls 
          ref={orbitControlsRef}
          makeDefault
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {selectedWord && selectedDim === dimensionIndices[0] && (
        <div className="absolute top-10 left-4 bg-gray-800/90 text-white p-3 rounded-lg shadow-lg text-base">
          <h6 className="font-bold mb-1 text-sm">{selectedWord}</h6>
          {mappedPoints.find(p => p.word === selectedWord)?.position.map((val, i) => (
            <div key={i} className="text-sm">{['x', 'y', 'z'][i]}: {val.toFixed(3)}</div>
          ))}
        </div>
      )}
    </div>
  );
};