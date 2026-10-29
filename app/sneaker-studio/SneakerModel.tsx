'use client';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect } from 'react';


type SneakerModelProps = {
  color: string;
};
export default function SneakerModel({ color }: SneakerModelProps) {
  const { scene } = useGLTF('/models/sneaker-1024.glb');
  useEffect(() => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if ('color' in material) {
          material.color.set(color);
        }
      });
    }
  });
}, [scene, color]);
  
  

  return <primitive object={scene} scale={8} />;
}