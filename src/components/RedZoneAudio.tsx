import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const RED_ZONE_AMBIENT = 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3';
const DATA_CHIRP = 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3';

export const RedZoneAudio = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('redzone-audio-muted');
    return stored === 'true';
  });

  const ambientRef = useRef<Howl | null>(null);
  const chirpRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize ambient drone
    ambientRef.current = new Howl({
      src: [RED_ZONE_AMBIENT],
      loop: true,
      volume: 0.3,
      html5: true,
    });

    // Initialize data chirp
    chirpRef.current = new Howl({
      src: [DATA_CHIRP],
      volume: 0.4,
      preload: true,
    });

    if (!isMuted) {
      ambientRef.current.play();
    }

    // Play chirp periodically
    const chirpInterval = setInterval(() => {
      if (!isMuted && chirpRef.current) {
        chirpRef.current.play();
      }
    }, 3000);

    return () => {
      ambientRef.current?.unload();
      chirpRef.current?.unload();
      clearInterval(chirpInterval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('redzone-audio-muted', isMuted.toString());

    if (ambientRef.current) {
      if (isMuted) {
        ambientRef.current.pause();
      } else {
        ambientRef.current.play();
      }
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-red-600/20 border border-red-500 backdrop-blur-md flex items-center justify-center hover:bg-red-600/40 transition-all"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isMuted ? 'Unmute Red Zone Audio' : 'Mute Red Zone Audio'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-red-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-red-400" />
      )}
    </motion.button>
  );
};
