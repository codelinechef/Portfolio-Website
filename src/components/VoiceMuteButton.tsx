import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { motion } from 'framer-motion';

export const VoiceMuteButton = () => {
  const { isVoiceMuted, toggleVoiceMute, playGlitchEffect } = useAudio();

  const handleToggle = () => {
    if (!isVoiceMuted) {
      playGlitchEffect();
      setTimeout(toggleVoiceMute, 300);
    } else {
      toggleVoiceMute();
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="relative w-14 h-14 rounded-full glass-card flex items-center justify-center group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isVoiceMuted ? 'Unmute voice' : 'Mute voice'}
      title="Voice Audio"
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: isVoiceMuted ? 0 : 1, 
          rotate: isVoiceMuted ? 180 : 0,
          filter: isVoiceMuted ? 'blur(4px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <Volume2 className="w-5 h-5 text-neon-cyan" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ 
          scale: isVoiceMuted ? 1 : 0, 
          rotate: isVoiceMuted ? 0 : 180,
          filter: isVoiceMuted ? 'blur(0px)' : 'blur(4px)',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      </motion.div>
    </motion.button>
  );
};
