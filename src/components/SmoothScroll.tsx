import { useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const { reducedMotion, disableAllEffects } = useAccessibility();

  useEffect(() => {
    if (reducedMotion || disableAllEffects) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      // some versions support these; harmless if ignored
      smoothTouch: true as any,
      syncTouch: true as any,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [reducedMotion, disableAllEffects]);

  return <>{children}</>;
};
