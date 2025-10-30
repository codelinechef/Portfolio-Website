import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface RedZoneTransitionProps {
  onComplete: () => void;
}

export const RedZoneTransition = ({ onComplete }: RedZoneTransitionProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Initializing system breach...",
    "Calibrating neural core…",
    "Taking you to the Red Zone."
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setMessageIndex(1), 800),
      setTimeout(() => setMessageIndex(2), 1600),
      setTimeout(() => onComplete(), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
    >
      {/* Chromatic aberration effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-950 opacity-50" />
      
      {/* Animated particle warp */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            initial={{
              x: '50%',
              y: '50%',
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.02,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Glitch overlay */}
      <motion.div
        className="absolute inset-0 bg-red-500/20 mix-blend-screen"
        animate={{
          opacity: [0, 0.3, 0, 0.5, 0],
          x: [-2, 2, -2, 2, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />

      {/* Message container */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className="font-mono text-2xl md:text-4xl text-red-500 font-bold"
        >
          {messages[messageIndex]}
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="mt-8 h-1 bg-red-950 rounded-full overflow-hidden max-w-md mx-auto"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-400"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Scan line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"
          animate={{
            y: ['0vh', '100vh'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Digital distortion effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};
