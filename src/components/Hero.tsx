import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { ParallaxBackground } from './ParallaxBackground';
import { Suspense, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shouldUseGPUEffects, getOptimalDPR } from '@/utils/gpuDetection';
import { useAccessibility } from '@/contexts/AccessibilityContext';

// Animated Sphere Component
const AnimatedSphere = ({ theme }: { theme: 'light' | 'dark' }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isLowEnd = (navigator.hardwareConcurrency || 2) < 4;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const floatSpeed = isLowEnd ? 0.3 : 0.5;
      const floatAmp = isLowEnd ? 0.2 : 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmp;

      // Base autonomous rotation (ensures motion in both themes)
      const t = state.clock.elapsedTime;
      const rotSpeed = isLowEnd ? 0.35 : 0.5;
      const rotAmp = isLowEnd ? 0.15 : 0.2;
      const baseX = Math.sin(t * rotSpeed) * rotAmp;
      const baseY = Math.cos(t * rotSpeed) * rotAmp;

      // Target rotation combines base motion with mouse influence
      const mouseInfluence = isLowEnd ? 0.06 : 0.1;
      const targetX = baseX + mousePosition.current.y * mouseInfluence;
      const targetY = baseY + mousePosition.current.x * mouseInfluence;

      // Smoothly approach target
      const lerp = isLowEnd ? 0.035 : 0.05;
      meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * lerp;
      meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * lerp;
    }
  });

  // Track mouse movement
  const handlePointerMove = (event: any) => {
    mousePosition.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };

  const color = theme === 'dark' ? '#60a5fa' : '#ff6fa3';

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} onPointerMove={handlePointerMove}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};


export const Hero = () => {
  const { theme } = useTheme();
  const { playSound, playSpatialSound } = useAudio();
  const { disableAllEffects, reducedMotion } = useAccessibility();
  const [isDragging, setIsDragging] = useState(false);
  const isLowEnd = (navigator.hardwareConcurrency || 2) < 4;
  
  const sphereX = useMotionValue(0);
  const sphereY = useMotionValue(0);
  const sphereSpringX = useSpring(sphereX, { stiffness: 150, damping: 20 });
  const sphereSpringY = useSpring(sphereY, { stiffness: 150, damping: 20 });

  const useGPU = shouldUseGPUEffects() && !disableAllEffects && !reducedMotion;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <ParallaxBackground />
      
      {/* 3D Sphere or Fallback */}
      {useGPU ? (
        <motion.div 
          className="absolute inset-0"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{
            left: -window.innerWidth / 3,
            right: window.innerWidth / 3,
            top: -window.innerHeight / 3,
            bottom: window.innerHeight / 3,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(_, info) => {
            sphereX.set(info.offset.x);
            sphereY.set(info.offset.y);
            playSpatialSound('spatial', info.point.x, info.point.y);
          }}
          style={{
            x: sphereSpringX,
            y: sphereSpringY,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={getOptimalDPR()}
            style={{ pointerEvents: 'none' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color={theme === 'dark' ? '#a855f7' : '#ff6fa3'} />
              <AnimatedSphere theme={theme} />
            </Suspense>
          </Canvas>
        </motion.div>
      ) : (
        <motion.div
          className="absolute left-1/2 top-1/2 w-64 h-64 rounded-full"
          drag
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={{
            left: -window.innerWidth / 3,
            right: window.innerWidth / 3,
            top: -window.innerHeight / 3,
            bottom: window.innerHeight / 3,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(_, info) => {
            playSpatialSound('spatial', info.point.x, info.point.y);
          }}
          style={{
            background: theme === 'dark' 
              ? 'radial-gradient(circle, rgba(96, 165, 250, 0.6) 0%, rgba(168, 85, 247, 0.3) 100%)'
              : 'radial-gradient(circle, rgba(255, 111, 163, 0.6) 0%, rgba(255, 182, 193, 0.3) 100%)',
            filter: 'blur(40px)',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          animate={{
            scale: isDragging ? 1.05 : reducedMotion || isLowEnd ? 1 : [1, 1.04, 1],
          }}
          transition={{
            scale: reducedMotion || isLowEnd
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-cyan via-primary to-neon-pink bg-clip-text text-transparent"
              style={{ fontFamily: '"Orbitron", sans-serif' }}
            >
              CodeLineChef
            </h2>
          </motion.div>

          <motion.h1
            className={`text-6xl md:text-8xl font-bold mb-6 ${
              theme === 'dark' ? 'neon-glow' : 'neon-glow-pink'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Anant Sharma
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl mb-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Software Developer with specialization in AI and Machine Learning
          </motion.p>

          <motion.div
            className="flex gap-3 justify-center flex-wrap mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #SoftwareDeveloper
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #AIEngineer
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #AIML
            </span>
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.a
              href="#projects"
              onClick={() => playSound('click')}
              className="magnetic-hover px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              onClick={() => playSound('click')}
              className="magnetic-hover px-8 py-4 rounded-full glass-card font-semibold hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center">
          <motion.div
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};
