// NeuroHarmonic - Particle Field Visualizer
// Audio-reactive particle system

import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../../stores/appStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ParticleFieldProps {
  isPlaying: boolean;
  frequency: number;
  color?: string;
  particleCount?: number;
}

export function ParticleField({
  isPlaying,
  frequency,
  color = '#00FFD1',
  particleCount = 60
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const { reducedMotion, visualIntensity } = useAppStore();

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 400 + 200
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const rect = canvas.getBoundingClientRect();
    const count = reducedMotion ? Math.floor(particleCount / 3) : particleCount;
    particlesRef.current = Array(count)
      .fill(null)
      .map(() => createParticle(rect.width, rect.height));

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const freqMod = isPlaying ? (frequency / 40) * visualIntensity : 0.3;
      const breathCycle = Math.sin(Date.now() * 0.001 * (frequency / 10)) * 0.5 + 0.5;

      particlesRef.current.forEach((particle, index) => {
        particle.life++;
        
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle(rect.width, rect.height);
          return;
        }

        if (!reducedMotion) {
          particle.x += particle.vx * (1 + freqMod * 0.5);
          particle.y += particle.vy * (1 + freqMod * 0.5);
          particle.x += Math.sin(particle.life * 0.015) * freqMod * 0.3;
          particle.y += Math.cos(particle.life * 0.015) * freqMod * 0.3;
        }

        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        const lifeRatio = particle.life / particle.maxLife;
        const fadeAlpha = lifeRatio < 0.1 
          ? lifeRatio * 10 
          : lifeRatio > 0.8 
            ? (1 - lifeRatio) * 5 
            : 1;

        const finalAlpha = particle.alpha * fadeAlpha * (0.5 + breathCycle * 0.5) * visualIntensity;

        ctx.beginPath();
        ctx.arc(
          particle.x, 
          particle.y, 
          particle.size * (1 + freqMod * 0.3), 
          0, 
          Math.PI * 2
        );
        
        const hex = Math.floor(finalAlpha * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${color}${hex}`;
        ctx.fill();

        if (isPlaying && visualIntensity > 0.5) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 * finalAlpha;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw connections
      if (!reducedMotion && isPlaying) {
        particlesRef.current.forEach((p1, i) => {
          particlesRef.current.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const alpha = (1 - distance / 100) * 0.15 * visualIntensity;
              const hex = Math.floor(alpha * 255).toString(16).padStart(2, '0');
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${color}${hex}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, particleCount, isPlaying, frequency, reducedMotion, visualIntensity, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
