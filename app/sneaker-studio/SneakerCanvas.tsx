"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

import SneakerModel from "./SneakerModel";
import SneakerCanvasBoundary from "./SneakerCanvasBoundary";

function SceneObject({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2} />

      <group ref={groupRef}>
        <SneakerModel color={color} />
      </group>
    </>
  );
}

export default function SneakerCanvas({
  color,
}: {
  color: string;
}) {
  return (
    <SneakerCanvasBoundary>
      <Canvas
        camera={{ position: [3, 2, 4], fov: 50 }}
        fallback={
          <img
            src="/images/sneaker-fallback.webp"
            alt="Blue athletic sneaker product preview"
            style={{
              width: "100%",
              height: "400px",
              objectFit: "contain",
              backgroundColor: "#f3f4f6",
            }}
          />
        }
      >
        <SceneObject color={color} />
        <OrbitControls enableZoom={true} zoomSpeed={1.2} />
      </Canvas>
    </SneakerCanvasBoundary>
  );
}