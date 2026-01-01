// NeuroHarmonic - Slider Component

import { motion } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  color?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { trackHeight: 4, thumbSize: 16 },
  md: { trackHeight: 6, thumbSize: 20 },
  lg: { trackHeight: 8, thumbSize: 24 }
};

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
  formatValue = (v) => v.toString(),
  color = 'var(--accent-cyan)',
  disabled = false,
  size = 'md'
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const { trackHeight, thumbSize } = sizeConfig[size];
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = useCallback((clientX: number) => {
    if (!trackRef.current || disabled) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));
    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    onChange(clampedValue);
  }, [min, max, step, onChange, disabled]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    handleChange(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleChange(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ 
      opacity: disabled ? 0.4 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-sm)'
        }}>
          {label && (
            <span style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              {label}
            </span>
          )}
          {showValue && (
            <span style={{ 
              color: color, 
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)'
            }}>
              {formatValue(value)}
            </span>
          )}
        </div>
      )}
      
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          position: 'relative',
          height: thumbSize,
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none'
        }}
      >
        {/* Track background */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: trackHeight,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-full)'
          }}
        />
        
        {/* Filled track */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            height: trackHeight,
            width: `${percentage}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            boxShadow: isDragging ? `0 0 12px ${color}` : 'none'
          }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Thumb */}
        <motion.div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            width: thumbSize,
            height: thumbSize,
            background: '#FFFFFF',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            boxShadow: `var(--shadow-sm), 0 0 0 ${isDragging ? 4 : 0}px ${color}40`,
            transition: 'box-shadow var(--transition-fast)'
          }}
          animate={{ scale: isDragging ? 1.15 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  );
}
