import { useRef } from 'react';
import * as THREE from 'three';
import { PointProps } from '../types';

export const Point = ({ position, word, onPointerUp, isSelected }: PointProps) => {
  const ref = useRef<THREE.Mesh>(null);
  
  return (
    <mesh 
      ref={ref}
      position={position}
      onPointerUp={(e) => {
        e.stopPropagation();
        onPointerUp(word, position);
      }}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial 
        color={isSelected ? "#ff0000" : "#0000ff"} 
      />
    </mesh>
  );
};