import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import { getOptimalDPR, shouldUseGPUEffects } from '@/utils/gpuDetection';
import { useAccessibility } from '@/contexts/AccessibilityContext';

// Particle system component
const ParticleField = ({ theme }: { theme: 'light' | 'dark' }) => {
  const ref = useRef<THREE.Points>(null);
  const isLowEnd = (navigator.hardwareConcurrency || 2) < 4;
  const particleCount = isLowEnd ? (theme === 'dark' ? 600 : 400) : (theme === 'dark' ? 900 : 600);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color = new THREE.Color(theme === 'dark' ? '#9AFF9A' : '#ff6fa3');
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Color with variation
      const colorVariation = new THREE.Color(color);
      colorVariation.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
      colors[i * 3] = colorVariation.r;
      colors[i * 3 + 1] = colorVariation.g;
      colors[i * 3 + 2] = colorVariation.b;
    }
    
    return [positions, colors];
  }, [theme]);

  useFrame((state) => {
    if (paused || !ref.current) return;
    const speedFactor = isLowEnd ? 0.4 : 1;
    ref.current.rotation.x = state.clock.elapsedTime * 0.05 * speedFactor;
    ref.current.rotation.y = state.clock.elapsedTime * 0.075 * speedFactor;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export const ParallaxBackground = () => {
  const { theme } = useTheme();
  const { reducedMotion, disableAllEffects } = useAccessibility();
  const useGPU = shouldUseGPUEffects();

  if (disableAllEffects || reducedMotion || !useGPU) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={getOptimalDPR()}>
        <ParticleField theme={theme} />
      </Canvas>
    </div>
  );
};
