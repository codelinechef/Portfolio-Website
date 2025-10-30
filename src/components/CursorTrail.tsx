import { useEffect, useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useAccessibility();
  const mousePos = useRef({ x: 0, y: 0 });
  const trail = useRef<Array<{ x: number; y: number; opacity: number }>>([]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
      });

      if (trail.current.length > 20) {
        trail.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.current.forEach((point, index) => {
        const opacity = point.opacity * (index / trail.current.length);
        const size = 3 + (index / trail.current.length) * 5;

        const gradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          size * 2
        );
        gradient.addColorStop(0, `rgba(255, 0, 60, ${opacity})`);
        gradient.addColorStop(1, 'rgba(255, 0, 60, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        point.opacity *= 0.95;
      });

      trail.current = trail.current.filter((p) => p.opacity > 0.01);

      requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ cursor: 'none' }}
    />
  );
};
