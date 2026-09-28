"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

type ModelViewerProps = {
  modelUrl: string;
};

function Model({ modelUrl }: ModelViewerProps) {
  const { scene } = useGLTF(modelUrl);

  return <primitive object={scene} scale={2} />;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
  return (
    <Canvas camera={{ position: [0, 1, 5] }}>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={3} />

      <Model modelUrl={modelUrl} />

      <OrbitControls />
    </Canvas>
  );
}