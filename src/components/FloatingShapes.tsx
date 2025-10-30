import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import { getOptimalDPR } from '@/utils/gpuDetection';

const FloatingShape = ({ position, color, speed }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

export const FloatingShapes = () => {
  const { theme } = useTheme();
  const shapeColor = theme === 'dark' ? '#60a5fa' : '#ff6fa3';

  const shapes = [
    { position: [-3, 2, -2], speed: 0.8 },
    { position: [3, -1, -3], speed: 1.2 },
    { position: [-2, -2, -1], speed: 0.6 },
    { position: [4, 3, -4], speed: 1.0 },
  ];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={getOptimalDPR()}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {shapes.map((shape, i) => (
          <FloatingShape
            key={i}
            position={shape.position}
            color={shapeColor}
            speed={shape.speed}
          />
        ))}
      </Canvas>
    </div>
  );
};
