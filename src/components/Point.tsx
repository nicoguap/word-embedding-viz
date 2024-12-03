import { useRef } from 'react';
import * as THREE from 'three';
import { PointProps } from '../types';

export const Point = ({ position, word, onPointerUp, isSelected }: PointProps) => {
  const ref = useRef<THREE.Mesh>(null);
  
  // Convert position array to THREE.js Vector3 compatible format
  const [x, y, z] = position;
  const threePosition: [number, number, number] = [x, y, z];
  
  return (
    <mesh 
      ref={ref}
      position={threePosition}
      onPointerUp={(e) => {
        e.stopPropagation();
        onPointerUp(word, threePosition);
      }}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial 
        color={isSelected ? "#FF0000" : "#ffffcc"}
        emissive={isSelected ? "#FF0000" : "#999999"}
        emissiveIntensity={0.9}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};