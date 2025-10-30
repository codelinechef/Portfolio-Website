import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Howl } from 'howler';

interface AudioContextType {
  isMuted: boolean;
  isVoiceMuted: boolean;
  toggleMute: () => void;
  toggleVoiceMute: () => void;
  playSound: (sound: SoundType) => void;
  playSpatialSound: (sound: SoundType, x: number, y: number) => void;
  playGlitchEffect: () => void;
  ambientVolume: number;
  sfxVolume: number;
  analyser: AnalyserNode | null;
}

export type SoundType = 'click' | 'hover' | 'success' | 'navigation' | 'drag' | 'spatial';

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Royalty-free tracks
const AMBIENT_TRACK = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
const VOICE_TRACK = 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3'; // Robotic ambient

// SFX URLs
const SOUND_EFFECTS = {
  click: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
  hover: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3',
  success: 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
  navigation: 'https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3',
  drag: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-win-video-game-notification-269.mp3',
  spatial: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
};

const GLITCH_EFFECT = 'https://assets.mixkit.co/sfx/preview/mixkit-electronic-retro-block-hit-2185.mp3';

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('audio-muted');
    return stored === 'true';
  });

  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    const stored = localStorage.getItem('voice-muted');
    return stored === 'true';
  });

  const ambientRef = useRef<Howl | null>(null);
  const voiceRef = useRef<Howl | null>(null);
  const sfxRef = useRef<Map<SoundType, Howl>>(new Map());
  const glitchRef = useRef<Howl | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API for spatial audio & analyser
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }

    // Initialize ambient audio
    ambientRef.current = new Howl({
      src: [AMBIENT_TRACK],
      loop: true,
      volume: 0.2,
      html5: true,
    });

    // Initialize voice track
    voiceRef.current = new Howl({
      src: [VOICE_TRACK],
      loop: true,
      volume: 0.4,
      html5: true,
    });

    // Connect voice to analyser
    if (analyserRef.current && voiceRef.current) {
      try {
        const ctx = audioContextRef.current;
        if (ctx) {
          const source = ctx.createMediaElementSource(voiceRef.current._sounds[0]._node);
          source.connect(analyserRef.current);
          analyserRef.current.connect(ctx.destination);
        }
      } catch (e) {
        console.warn('Could not connect analyser');
      }
    }

    // Initialize SFX
    Object.entries(SOUND_EFFECTS).forEach(([key, src]) => {
      sfxRef.current.set(key as SoundType, new Howl({
        src: [src],
        volume: 0.5,
        preload: true,
      }));
    });

    // Initialize glitch effect
    glitchRef.current = new Howl({
      src: [GLITCH_EFFECT],
      volume: 0.7,
      preload: true,
    });

    // Start ambient if not muted
    if (!isMuted) {
      ambientRef.current.play();
    }

    // Start voice if not muted
    if (!isVoiceMuted && !isMuted) {
      setTimeout(() => voiceRef.current?.play(), 2000);
    }

    return () => {
      ambientRef.current?.unload();
      voiceRef.current?.unload();
      glitchRef.current?.unload();
      sfxRef.current.forEach(howl => howl.unload());
      audioContextRef.current?.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('audio-muted', isMuted.toString());
    
    if (ambientRef.current) {
      if (isMuted) {
        ambientRef.current.pause();
        voiceRef.current?.pause();
      } else {
        ambientRef.current.play();
        if (!isVoiceMuted) {
          voiceRef.current?.play();
        }
      }
    }
  }, [isMuted, isVoiceMuted]);

  useEffect(() => {
    localStorage.setItem('voice-muted', isVoiceMuted.toString());
    
    if (voiceRef.current && !isMuted) {
      if (isVoiceMuted) {
        voiceRef.current.pause();
      } else {
        voiceRef.current.play();
      }
    }
  }, [isVoiceMuted, isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleVoiceMute = () => {
    setIsVoiceMuted(prev => !prev);
  };

  const playGlitchEffect = () => {
    if (!isMuted && glitchRef.current) {
      glitchRef.current.play();
    }
  };

  const playSound = (sound: SoundType) => {
    if (!isMuted) {
      const howl = sfxRef.current.get(sound);
      howl?.play();
    }
  };

  const playSpatialSound = (sound: SoundType, x: number, y: number) => {
    if (!isMuted) {
      const howl = sfxRef.current.get(sound);
      if (howl) {
        // Normalize position to -1 to 1 range
        const normalizedX = (x / window.innerWidth) * 2 - 1;
        const normalizedY = (y / window.innerHeight) * 2 - 1;
        
        // Apply stereo panning
        howl.stereo(normalizedX);
        
        // Attenuate based on distance from center
        const distance = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
        const volume = Math.max(0.2, 1 - distance * 0.5);
        howl.volume(volume * 0.5);
        
        howl.play();
      }
    }
  };

  return (
    <AudioContext.Provider value={{
      isMuted,
      isVoiceMuted,
      toggleMute,
      toggleVoiceMute,
      playSound,
      playSpatialSound,
      playGlitchEffect,
      ambientVolume: 0.2,
      sfxVolume: 0.5,
      analyser: analyserRef.current,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};