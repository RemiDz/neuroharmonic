// NeuroHarmonic - Waveform Visualizer
// Beautiful real-time brainwave visualization

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../../stores/sessionStore';
import { BRAINWAVE_STATES } from '../../data/frequencies';

interface WaveformVisualizerProps {
  frequency: number;
  isPlaying: boolean;
  brainwaveType?: string;
  intensity?: number;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function WaveformVisualizer({
  frequency,
  isPlaying,
  brainwaveType = 'alpha',
  intensity = 0.7,
  size = 'md'
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const { reducedMotion, visualIntensity } = useSessionStore();
  const [dimensions, setDimensions] = useState({ width: 300, height: 150 });

  const brainwave = BRAINWAVE_STATES[brainwaveType] || BRAINWAVE_STATES.alpha;

  const sizeMap = {
    sm: { width: 200, height: 80 },
    md: { width: 300, height: 120 },
    lg: { width: 400, height: 160 },
    full: { width: 0, height: 200 } // Will be set by container
  };

  useEffect(() => {
    if (size === 'full' && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setDimensions({
              width: entry.contentRect.width,
              height: sizeMap.full.height
            });
          }
        });
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
      }
    } else {
      setDimensions(sizeMap[size]);
    }
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const effectiveIntensity = intensity * visualIntensity;
    let time = 0;

    const draw = () => {
      if (reducedMotion && !isPlaying) {
        // Static wave for reduced motion
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        drawStaticWave(ctx);
        return;
      }

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const centerY = dimensions.height / 2;
      const amplitude = (dimensions.height / 3) * effectiveIntensity;
      
      // Create gradient for wave
      const gradient = ctx.createLinearGradient(0, 0, dimensions.width, 0);
      gradient.addColorStop(0, `${brainwave.color}00`);
      gradient.addColorStop(0.2, `${brainwave.color}80`);
      gradient.addColorStop(0.5, brainwave.color);
      gradient.addColorStop(0.8, `${brainwave.color}80`);
      gradient.addColorStop(1, `${brainwave.color}00`);

      // Draw main wave
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;

      for (let x = 0; x < dimensions.width; x++) {
        const progress = x / dimensions.width;
        
        // Multiple wave layers for organic feel
        const wave1 = Math.sin((progress * Math.PI * 4) + (time * frequency * 0.1)) * amplitude;
        const wave2 = Math.sin((progress * Math.PI * 6) + (time * frequency * 0.15)) * (amplitude * 0.3);
        const wave3 = Math.sin((progress * Math.PI * 2) + (time * frequency * 0.05)) * (amplitude * 0.5);
        
        const y = centerY + wave1 + wave2 + wave3;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw glow effect
      ctx.shadowColor = brainwave.color;
      ctx.shadowBlur = 15 * effectiveIntensity;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw secondary wave (lighter)
      ctx.beginPath();
      ctx.strokeStyle = `${brainwave.color}40`;
      ctx.lineWidth = 1;

      for (let x = 0; x < dimensions.width; x++) {
        const progress = x / dimensions.width;
        const wave = Math.sin((progress * Math.PI * 8) + (time * frequency * 0.2) + Math.PI / 4) * (amplitude * 0.4);
        const y = centerY + wave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      if (isPlaying) {
        time += 0.016; // ~60fps
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const drawStaticWave = (ctx: CanvasRenderingContext2D) => {
      const centerY = dimensions.height / 2;
      const amplitude = (dimensions.height / 3) * effectiveIntensity * 0.5;
      
      ctx.beginPath();
      ctx.strokeStyle = `${brainwave.color}60`;
      ctx.lineWidth = 2;

      for (let x = 0; x < dimensions.width; x++) {
        const progress = x / dimensions.width;
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

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequency, isPlaying, brainwave, dimensions, intensity, visualIntensity, reducedMotion]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        width: size === 'full' ? '100%' : dimensions.width,
        height: dimensions.height,
        overflow: 'hidden',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${brainwave.color}15 0%, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />
      
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}
