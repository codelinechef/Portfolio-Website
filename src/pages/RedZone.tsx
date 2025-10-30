import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '@/contexts/AudioContext';
import { detectGPUSupport, getGPUTier, shouldUseGPUEffects } from '@/utils/gpuDetection';
import { useAccessibility } from '@/contexts/AccessibilityContext';
// Heavy visuals/audio removed for smooth performance
import { X } from 'lucide-react';

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

const RedZone = () => {
  const navigate = useNavigate();
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
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showExitButton, setShowExitButton] = useState(false);
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

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowExitButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

    // Fetch geolocation with high accuracy; fallback to IP-based lookup
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((res) => res.json())
            .then((geo) => {
              setLocation({
                city: geo.city || geo.locality || geo.localityInfo?.administrative?.[0]?.name,
                region: geo.principalSubdivision || geo.localityInfo?.administrative?.[1]?.name,
                country: geo.countryName,
              });
              setLocationLoading(false);
            })
            .catch(() => {
              // Fallback to IP API if reverse geocode fails
              fetch('https://ipapi.co/json/')
                .then((res) => res.json())
                .then((data) => {
                  setLocation({
                    city: data.city,
                    region: data.region,
                    country: data.country_name,
                  });
                  setLocationLoading(false);
                })
                .catch(() => setLocationLoading(false));
            });
        },
        () => {
          // Permission denied or error — fallback to IP-based
          fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
              setLocation({
                city: data.city,
                region: data.region,
                country: data.country_name,
              });
              setLocationLoading(false);
            })
            .catch(() => setLocationLoading(false));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          setLocation({
            city: data.city,
            region: data.region,
            country: data.country_name,
          });
          setLocationLoading(false);
        })
        .catch(() => setLocationLoading(false));
    }
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

  const handleExit = () => {
    playSound('navigation');
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0000] via-[#1a0000] to-[#0a0000] text-white overflow-hidden relative">
      {/* Heavy audio/particles/cursor effects removed */}
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent animate-pulse" 
             style={{ backgroundSize: '100% 4px' }} />
      </div>

      {/* Status Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-black/50 border-b border-red-500/30"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono text-sm text-red-400">
              SYSTEM MODE: RED ZONE — ENCRYPTED ENVIRONMENT
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-lg text-red-500 font-bold">
              {formatTime(timeRemaining)}
            </span>
            {showExitButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleExit}
                className="px-4 py-2 bg-red-600/20 border border-red-500 text-red-400 font-mono hover:bg-red-600/40 transition-all flex items-center gap-2 rounded"
              >
                <X size={16} />
                EXIT RED ZONE
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-4 font-['Orbitron'] bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent">
            RED ZONE
          </h1>
          <p className="text-xl text-red-300 font-mono">
            Welcome to the Red Zone — where systems think for themselves.
          </p>
        </motion.div>

        {/* GPU Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20">
            <TypewriterText text={gpuStatus} className="text-xl font-mono text-red-400" />
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
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20">
                <h3 className="text-2xl font-bold mb-6 text-red-400 font-['Orbitron']">Live Feature Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-red-500/30">
                        <th className="text-left py-3 px-4 font-semibold text-white font-mono">Feature</th>
                        <th className="text-left py-3 px-4 font-semibold text-red-400 font-mono">GPU Mode</th>
                        <th className="text-left py-3 px-4 font-semibold text-red-600 font-mono">CPU Mode</th>
                      </tr>
                    </thead>
                    <tbody>
                      {featureMatrix.map((row, idx) => (
                        <motion.tr
                          key={row.feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.4 }}
                          className="border-b border-red-500/20 hover:bg-red-500/10 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-white font-mono">{row.feature}</td>
                          <td className={`py-3 px-4 font-mono text-sm ${isGPUEnabled ? 'text-red-400 font-semibold' : 'text-gray-600 opacity-50'}`}>
                            {row.gpu}
                          </td>
                          <td className={`py-3 px-4 font-mono text-sm ${!isGPUEnabled ? 'text-red-600 font-semibold' : 'text-gray-600 opacity-50'}`}>
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
              <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/20">
                <h3 className="text-2xl font-bold mb-6 text-red-400 font-['Orbitron']">System Logs</h3>
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
                      <span className="text-gray-400">{log.message}</span>
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
                className="bg-black/40 backdrop-blur-md p-10 rounded-2xl border-2 border-red-500/50 shadow-2xl shadow-red-500/30"
              >
                <p className="text-2xl md:text-3xl text-center font-medium leading-relaxed font-mono">
                  {location && location.city ? (
                    <>
                      <span className="text-white">Ooh… I see you, </span>
                      <span className="text-red-500 font-bold">{location.city}</span>
                      <span className="text-white">.</span>
                      <br />
                      <span className="text-gray-400">The system recognizes your coordinates: </span>
                      <span className="text-red-400 font-bold">{location.region}</span>
                      <span className="text-white">, </span>
                      <span className="text-red-500 font-bold">{location.country}</span>
                      <span className="text-white">.</span>
                      <br />
                      <span className="text-gray-500 italic mt-4 block">Welcome to the Red Zone.</span>
                    </>
                  ) : (
                    <span className="text-gray-400">
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
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 via-red-400 to-red-600 bg-clip-text text-transparent font-['Orbitron']">
                Powered by CodeLineChef — where code meets consciousness.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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

export default RedZone;
