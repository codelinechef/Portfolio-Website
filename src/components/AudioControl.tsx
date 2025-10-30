import { Music, Volume2 } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { motion } from 'framer-motion';

export const AudioControl = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <motion.button
      onClick={toggleMute}
      className="relative w-14 h-14 rounded-full glass-card flex items-center justify-center group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title="Background Audio"
    >
      <motion.div
        initial={false}
        animate={{ scale: isMuted ? 0 : 1, rotate: isMuted ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Music className="w-5 h-5 text-primary" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: isMuted ? 1 : 0, rotate: isMuted ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Music className="w-5 h-5 text-muted-foreground opacity-30" />
      </motion.div>
    </motion.button>
  );
};