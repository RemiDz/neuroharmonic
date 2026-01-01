// NeuroHarmonic - Waveform Display
// Real-time audio waveform visualization

import { useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/appStore';

interface WaveformDisplayProps {
  isPlaying: boolean;
  frequency: number;
  color?: string;
  height?: number;
}

export function WaveformDisplay({
  isPlaying,
  frequency,
  color = '#00FFD1',
  height = 120
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { reducedMotion, visualIntensity } = useAppStore();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, height);

      if (reducedMotion && !isPlaying) {
        // Static wave
        drawStaticWave(ctx, rect.width);
      } else {
        drawAnimatedWave(ctx, rect.width);
      }

      if (isPlaying && !reducedMotion) {
        timeRef.current += 0.016;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const drawStaticWave = (ctx: CanvasRenderingContext2D, width: number) => {
      const centerY = height / 2;
      const amplitude = (height / 3) * visualIntensity * 0.5;
      
      ctx.beginPath();
      ctx.strokeStyle = `${color}60`;
      ctx.lineWidth = 2;

      for (let x = 0; x < width; x++) {
        const progress = x / width;
        const wave = Math.sin(progress * Math.PI * 4) * amplitude;
        const y = centerY + wave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const drawAnimatedWave = (ctx: CanvasRenderingContext2D, width: number) => {
      const centerY = height / 2;
      const amplitude = (height / 3) * visualIntensity;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `${color}00`);
      gradient.addColorStop(0.2, `${color}80`);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(0.8, `${color}80`);
      gradient.addColorStop(1, `${color}00`);

      // Main wave
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const progress = x / width;
        
        const wave1 = Math.sin((progress * Math.PI * 4) + (timeRef.current * frequency * 0.1)) * amplitude;
        const wave2 = Math.sin((progress * Math.PI * 6) + (timeRef.current * frequency * 0.15)) * (amplitude * 0.3);
        const wave3 = Math.sin((progress * Math.PI * 2) + (timeRef.current * frequency * 0.05)) * (amplitude * 0.4);
        
        const y = centerY + wave1 + wave2 + wave3;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Glow effect
      if (isPlaying) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 * visualIntensity;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Secondary wave
      ctx.beginPath();
      ctx.strokeStyle = `${color}30`;
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x++) {
        const progress = x / width;
        const wave = Math.sin((progress * Math.PI * 8) + (timeRef.current * frequency * 0.2) + Math.PI / 4) * (amplitude * 0.3);
        const y = centerY + wave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequency, color, height, reducedMotion, visualIntensity]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${color}10 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height
        }}
      />
    </div>
  );
}
