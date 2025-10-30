/**
 * GPU Detection and Performance Utilities
 */

export const detectGPUSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

export const getGPUTier = (): 'high' | 'medium' | 'low' => {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  
  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4 && memory >= 4) return 'medium';
  return 'low';
};

export const shouldUseGPUEffects = (): boolean => {
  const hasGPU = detectGPUSupport();
  const tier = getGPUTier();
  return hasGPU && tier !== 'low';
};

export const getOptimalDPR = (): number => {
  const tier = getGPUTier();
  const dpr = window.devicePixelRatio || 1;
  
  if (tier === 'high') return Math.min(dpr, 2);
  if (tier === 'medium') return Math.min(dpr, 1.5);
  return 1;
};
