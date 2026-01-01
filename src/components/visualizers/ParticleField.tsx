// NeuroHarmonic - Particle Field Visualizer
// Mesmerizing particle system responding to audio

import { useEffect, useRef } from 'react';
import { useSessionStore } from '../../stores/sessionStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
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
  color = '#00d4ff',
  particleCount = 50
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const { reducedMotion, visualIntensity } = useSessionStore();

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

    const createParticle = (): Particle => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color,
        alpha: Math.random() * 0.5 + 0.3,
        life: 0,
        maxLife: Math.random() * 300 + 200
      };
    };

    // Initialize particles
    particlesRef.current = Array(reducedMotion ? Math.floor(particleCount / 3) : particleCount)
      .fill(null)
      .map(createParticle);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Frequency-based modulation
      const freqMod = isPlaying ? (frequency / 40) * visualIntensity : 0.3;
      const breathCycle = Math.sin(Date.now() * 0.001 * (frequency / 10)) * 0.5 + 0.5;

      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.life++;
        
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle();
          return;
        }

        // Movement with frequency influence
        if (!reducedMotion) {
          particle.x += particle.vx * (1 + freqMod);
          particle.y += particle.vy * (1 + freqMod);

          // Add subtle circular motion based on frequency
          particle.x += Math.sin(particle.life * 0.02) * freqMod * 0.5;
          particle.y += Math.cos(particle.life * 0.02) * freqMod * 0.5;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Life-based alpha
        const lifeRatio = particle.life / particle.maxLife;
        const fadeAlpha = lifeRatio < 0.1 
          ? lifeRatio * 10 
          : lifeRatio > 0.8 
            ? (1 - lifeRatio) * 5 
            : 1;

        const finalAlpha = particle.alpha * fadeAlpha * (0.5 + breathCycle * 0.5);

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * (1 + freqMod * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(finalAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Draw glow
        if (isPlaying && visualIntensity > 0.5) {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10 * finalAlpha;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw connections between nearby particles
      if (!reducedMotion && isPlaying) {
        particlesRef.current.forEach((p1, i) => {
          particlesRef.current.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
              const alpha = (1 - distance / 80) * 0.2 * visualIntensity;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
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
  }, [color, particleCount, isPlaying, frequency, reducedMotion, visualIntensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.8
      }}
    />
  );
}
