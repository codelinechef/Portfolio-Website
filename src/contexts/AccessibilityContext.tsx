import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  disableAllEffects: boolean;
  toggleDisableAllEffects: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem('reduced-motion');
    if (stored) return stored === 'true';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [disableAllEffects, setDisableAllEffects] = useState(() => {
    const stored = localStorage.getItem('disable-all-effects');
    return stored === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (reducedMotion || disableAllEffects) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.style.removeProperty('--animation-duration');
      root.removeAttribute('data-reduced-motion');
    }

    localStorage.setItem('reduced-motion', reducedMotion.toString());
    localStorage.setItem('disable-all-effects', disableAllEffects.toString());
  }, [reducedMotion, disableAllEffects]);

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  const toggleDisableAllEffects = () => {
    setDisableAllEffects(prev => !prev);
  };

  return (
    <AccessibilityContext.Provider value={{
      reducedMotion,
      toggleReducedMotion,
      disableAllEffects,
      toggleDisableAllEffects,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};