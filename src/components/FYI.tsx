import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';
import { detectGPUSupport, getGPUTier, shouldUseGPUEffects } from '@/utils/gpuDetection';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface GeoLocation {
  city?: string;
  region?: string;
  country?: string;
}

interface SystemLog {
  id: number;
  message: string;
  type: 'INFO' | 'AUDIO' | 'NOTICE' | 'SECURE';
}

const FYI = () => {
  const { playSound } = useAudio();
  const { reducedMotion } = useAccessibility();
  const [gpuStatus, setGpuStatus] = useState<string>('SCANNING...');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const hasPlayedSound = useRef(false);

  const systemLogs: SystemLog[] = [
    { id: 1, message: 'Procedural geometry instantiated.', type: 'INFO' },
    { id: 2, message: 'FFT analysis initialized — ready to vibe.', type: 'AUDIO' },
    { id: 3, message: 'Adaptive render pipeline engaged.', type: 'NOTICE' },
    { id: 4, message: 'Runtime sandbox active — no external calls made.', type: 'SECURE' },
  ];

  const featureMatrix = [
    { feature: 'Shader Sphere', gpu: '✅ WebGL Shader Pipeline', cpu: '⚙️ 2D Canvas Blob Sim' },
    { feature: 'Particle System', gpu: '✅ Real-time Emitters', cpu: '⚙️ CSS Sim Particles' },
    { feature: 'Spatial Audio', gpu: '✅ Positional Stereo', cpu: '⚙️ Flat Stereo Mix' },
    { feature: 'Equalizer', gpu: '✅ Audio-Reactive Bars', cpu: '⚙️ Looped Amplitude Pattern' },
    { feature: 'Animations', gpu: '✅ GPU Motion Curves', cpu: '⚙️ CSS Eased Transitions' },
  ];

  useEffect(() => {
    // Detect GPU
    const hasGPU = detectGPUSupport();
    const tier = getGPUTier();
    const useGPU = shouldUseGPUEffects();
    
    setTimeout(() => {
      setGpuStatus(
        hasGPU && useGPU
          ? 'Hardware Acceleration: ENABLED → Engaging Full WebGL Pipeline.'
          : 'Hardware Acceleration: DISABLED → Running Canvas Emulation Mode.'
      );
      if (!hasPlayedSound.current) {
        playSound('hover');
        hasPlayedSound.current = true;
      }
      
      setTimeout(() => setShowFeatures(true), 800);
      setTimeout(() => setShowLogs(true), 1600);
    }, 1000);

    // Fetch geolocation
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setLocation({
          city: data.city,
          region: data.region,
          country: data.country_name,
        });
        setLocationLoading(false);
      })
      .catch(() => {
        setLocationLoading(false);
      });
  }, [playSound]);

  useEffect(() => {
    if (showLogs && currentLogIndex < systemLogs.length) {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, systemLogs[currentLogIndex]]);
        playSound('click');
        setCurrentLogIndex(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentLogIndex >= systemLogs.length && !locationLoading) {
      setTimeout(() => {
        setShowLocation(true);
        playSound('hover');
      }, 1000);
    }
  }, [showLogs, currentLogIndex, systemLogs.length, playSound, locationLoading]);

  const isGPUEnabled = shouldUseGPUEffects();

  return (
    <section id="fyi" className="min-h-screen relative py-20 overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-pulse" 
             style={{ backgroundSize: '100% 4px' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-neon-cyan to-primary bg-clip-text text-transparent">
            FYI — For Your Interface
          </h2>
          <p className="text-lg text-muted-foreground">
            System Diagnostics & Environmental Awareness
          </p>
        </motion.div>

        {/* GPU Status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="glass-card p-8 rounded-2xl border border-neon-cyan/30">
            <TypewriterText text={gpuStatus} className="text-xl font-mono text-neon-cyan" />
          </div>
        </motion.div>

        {/* Feature Matrix */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto mb-12"
            >
              <div className="glass-card p-8 rounded-2xl border border-neon-cyan/30">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Live Feature Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
                        <th className="text-left py-3 px-4 font-semibold text-neon-cyan">GPU Mode</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">CPU Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureMatrix.map((row, idx) => (
                        <motion.tr
                          key={row.feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.4 }}
                          className="border-b border-border/20 hover:bg-primary/5 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-foreground">{row.feature}</td>
                          <td className={`py-3 px-4 font-mono text-sm ${isGPUEnabled ? 'text-neon-cyan font-semibold' : 'text-muted-foreground opacity-50'}`}>
                            {row.gpu}
                          </td>
                          <td className={`py-3 px-4 font-mono text-sm ${!isGPUEnabled ? 'text-primary font-semibold' : 'text-muted-foreground opacity-50'}`}>
                            {row.cpu}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Logs */}
        <AnimatePresence>
          {showLogs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="glass-card p-8 rounded-2xl border border-neon-cyan/30">
                <h3 className="text-2xl font-bold mb-6 text-foreground">System Logs</h3>
                <div className="space-y-2 font-mono text-sm">
                  {logs.map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <span className={`
                        ${log.type === 'INFO' ? 'text-blue-400' : ''}
                        ${log.type === 'AUDIO' ? 'text-purple-400' : ''}
                        ${log.type === 'NOTICE' ? 'text-yellow-400' : ''}
                        ${log.type === 'SECURE' ? 'text-green-400' : ''}
                        font-bold
                      `}>
                        [{log.type}]
                      </span>
                      <span className="text-muted-foreground">{log.message}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Reveal */}
        <AnimatePresence>
          {showLocation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="max-w-4xl mx-auto mb-12"
            >
              <motion.div
                initial={{ filter: 'blur(8px)' }}
                animate={{ filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="glass-card p-10 rounded-2xl border-2 border-neon-cyan/50 shadow-2xl shadow-neon-cyan/20"
              >
                <p className="text-2xl md:text-3xl text-center font-medium leading-relaxed">
                  {location && location.city ? (
                    <>
                      <span className="text-foreground">Ooh… and I know you're viewing this from </span>
                      <span className="text-neon-cyan font-bold">{location.city}</span>
                      <span className="text-foreground">, </span>
                      <span className="text-primary font-bold">{location.region}</span>
                      <span className="text-foreground">, </span>
                      <span className="text-neon-cyan font-bold">{location.country}</span>
                      <span className="text-foreground">.</span>
                      <br />
                      <span className="text-muted-foreground italic mt-4 block">Small world, isn't it?</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      Ooh… I can't see you clearly through the data cloud — yet.
                    </span>
                  )}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature Outro */}
        <AnimatePresence>
          {showLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 1.2, delay: 1.5 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-neon-cyan to-primary bg-clip-text text-transparent">
                Powered by CodeLineChef — where code meets consciousness.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Typewriter component
const TypewriterText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return (
    <p className={className}>
      {displayText}
      {currentIndex < text.length && <span className="animate-pulse">▋</span>}
    </p>
  );
};

export default FYI;
