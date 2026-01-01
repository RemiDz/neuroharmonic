// NeuroHarmonic - Mandala Generator
// Sacred geometry that breathes with the audio

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../../stores/sessionStore';

interface MandalaGeneratorProps {
  isPlaying: boolean;
  frequency: number;
  color?: string;
  layers?: number;
  size?: number;
}

export function MandalaGenerator({
  isPlaying,
  frequency,
  color = '#8b5cf6',
  layers = 6,
  size = 300
}: MandalaGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { reducedMotion, visualIntensity } = useSessionStore();
  const rotation = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = (size / 2) * 0.9;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Breathing effect based on frequency
      const breathe = isPlaying 
        ? Math.sin(Date.now() * 0.001 * (frequency / 10)) * 0.1 + 1
        : 1;

      // Rotation speed based on frequency
      if (isPlaying && !reducedMotion) {
        rotation.current += (frequency / 1000) * 0.5;
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);

      // Draw layers
      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = (maxRadius * (layer + 1) / layers) * breathe;
        const petals = 6 + layer * 2;
        const layerAlpha = (1 - layer / layers) * 0.8 * visualIntensity;

        // Parse color and add alpha
        const alphaHex = Math.floor(layerAlpha * 255).toString(16).padStart(2, '0');

        ctx.save();
        ctx.rotate((layer * Math.PI) / layers);

        // Draw petals
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          
          ctx.save();
          ctx.rotate(angle);

          // Petal shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          
          // Bezier curves for organic petal shape
          const petalLength = layerRadius * 0.8;
          const petalWidth = layerRadius * 0.3;
          
          ctx.bezierCurveTo(
            petalWidth * 0.5, petalLength * 0.3,
            petalWidth, petalLength * 0.6,
            0, petalLength
          );
          ctx.bezierCurveTo(
            -petalWidth, petalLength * 0.6,
            -petalWidth * 0.5, petalLength * 0.3,
            0, 0
          );

          ctx.strokeStyle = `${color}${alphaHex}`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner details
          if (layer < layers - 2) {
            ctx.beginPath();
            ctx.moveTo(0, petalLength * 0.2);
            ctx.lineTo(0, petalLength * 0.7);
            ctx.strokeStyle = `${color}${Math.floor(layerAlpha * 0.5 * 255).toString(16).padStart(2, '0')}`;
            ctx.stroke();
          }

          ctx.restore();
        }

        // Draw connecting circles
        ctx.beginPath();
        ctx.arc(0, 0, layerRadius * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `${color}${Math.floor(layerAlpha * 0.4 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      // Center dot
      ctx.beginPath();
      ctx.arc(0, 0, 5 * breathe, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Outer glow
      if (isPlaying) {
        ctx.beginPath();
        ctx.arc(0, 0, 8 * breathe, 0, Math.PI * 2);
        ctx.shadowColor = color;
        ctx.shadowBlur = 20 * visualIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, layers, color, isPlaying, frequency, reducedMotion, visualIntensity]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size
        }}
      />
    </motion.div>
  );
}
