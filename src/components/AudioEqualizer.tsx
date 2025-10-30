import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const AudioEqualizer = () => {
  const { analyser, isMuted, isVoiceMuted } = useAudio();
  const { disableAllEffects } = useAccessibility();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [bars, setBars] = useState<number[]>(new Array(32).fill(0));

  useEffect(() => {
    if (disableAllEffects || !analyser) {
      // Fallback: simulated animation
      const interval = setInterval(() => {
        if (!isMuted && !isVoiceMuted) {
          setBars(prev => prev.map(() => Math.random() * 100));
        } else {
          setBars(new Array(32).fill(0));
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      if (!isMuted && !isVoiceMuted) {
        analyser.getByteFrequencyData(dataArray);
        const barCount = 32;
        const step = Math.floor(dataArray.length / barCount);
        const newBars = [];
        
        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step];
          newBars.push((value / 255) * 100);
        }
        
        setBars(newBars);
      } else {
        setBars(new Array(32).fill(0));
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isMuted, isVoiceMuted, disableAllEffects]);

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5, duration: 0.6 }}
    >
      <div className="glass-card px-3 py-2 rounded-full flex items-center gap-0.5">
        {bars.map((height, i) => (
          <motion.div
            key={i}
            className="w-0.5 bg-gradient-to-t from-primary to-neon-cyan rounded-full"
            style={{
              height: `${Math.max(3, height * 0.25)}px`,
              opacity: height > 0 ? 0.8 : 0.3,
            }}
            animate={{
              height: `${Math.max(3, height * 0.25)}px`,
            }}
            transition={{
              duration: 0.1,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
