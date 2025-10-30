import { Settings, Eye, EyeOff } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useAudio } from '@/contexts/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { reducedMotion, toggleReducedMotion, disableAllEffects, toggleDisableAllEffects } = useAccessibility();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-20 right-0 p-4 glass-card rounded-2xl shadow-2xl min-w-[280px]"
          >
            <h3 className="font-semibold mb-4 text-foreground">Accessibility</h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Reduced Motion
                </span>
                <button
                  onClick={toggleReducedMotion}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    reducedMotion ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label="Toggle reduced motion"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-background rounded-full shadow-md"
                    animate={{ x: reducedMotion ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Mute Audio
                </span>
                <button
                  onClick={toggleMute}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isMuted ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label="Toggle audio"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-background rounded-full shadow-md"
                    animate={{ x: isMuted ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Disable All Effects
                </span>
                <button
                  onClick={toggleDisableAllEffects}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    disableAllEffects ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-label="Toggle all effects"
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-background rounded-full shadow-md"
                    animate={{ x: disableAllEffects ? 26 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </label>
            </div>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              These settings help make the site more accessible by reducing animations and audio.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full glass-card flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Accessibility settings"
      >
        {isOpen ? (
          <EyeOff className="w-5 h-5 text-primary" />
        ) : (
          <Settings className="w-5 h-5 text-primary" />
        )}
      </motion.button>
    </div>
  );
};