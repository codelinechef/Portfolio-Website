import { useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const { reducedMotion, disableAllEffects } = useAccessibility();

  useEffect(() => {
    if (reducedMotion || disableAllEffects) return;

    const isLowEnd = (navigator.hardwareConcurrency || 2) < 4;
    const lenis = new Lenis({
      duration: isLowEnd ? 1.1 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -12 * t)),
      smoothWheel: !isLowEnd,
      wheelMultiplier: isLowEnd ? 0.7 : 0.9,
      touchMultiplier: isLowEnd ? 1.2 : 1.5,
      // some versions support these; harmless if ignored
      smoothTouch: true as any,
      syncTouch: true as any,
    });

    let running = true;
    function raf(time: number) {
      if (!running) return;
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const onVisibility = () => {
      const hidden = document.hidden;
      running = !hidden;
      if (hidden) {
        // lenis.stop(); // some versions support stop/start
      } else {
        requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      lenis.destroy();
    };
  }, [reducedMotion, disableAllEffects]);

  return <>{children}</>;
};
