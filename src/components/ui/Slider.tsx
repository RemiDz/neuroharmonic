// NeuroHarmonic - Slider Component

import { motion } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';

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
}

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
  disabled = false
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleChange(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    handleChange(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleChange(e.clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleChange(e.touches[0].clientX);
    };
    
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleChange]);

  return (
    <div style={{ 
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }}>
      {(label || showValue) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
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
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'relative',
          height: '8px',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-full)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          touchAction: 'none'
        }}
      >
        {/* Filled track */}
        <motion.div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percentage}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            boxShadow: isDragging ? `0 0 10px ${color}` : 'none'
          }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Thumb */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: `${percentage}%`,
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 2px 8px rgba(0,0,0,0.3), 0 0 0 3px ${isDragging ? color : 'transparent'}`
          }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  );
}
