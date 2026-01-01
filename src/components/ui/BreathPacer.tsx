// NeuroHarmonic - Breath Pacer Component
// Synchronized breathing guide with audio

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useAudioEngine } from '../../hooks/useAudioEngine';

interface BreathPacerProps {
  isActive: boolean;
  onToggle: () => void;
  inhaleTime?: number; // seconds
  holdTime?: number;
  exhaleTime?: number;
  restTime?: number;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const phaseLabels: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  hold: 'Hold',
  exhale: 'Breathe Out',
  rest: 'Rest'
};

const phaseColors: Record<BreathPhase, string> = {
  inhale: 'var(--accent-cyan)',
  hold: 'var(--accent-violet)',
  exhale: 'var(--accent-magenta)',
  rest: 'var(--text-muted)'
};

export function BreathPacer({
  isActive,
  onToggle,
  inhaleTime = 4,
  holdTime = 4,
  exhaleTime = 4,
  restTime = 2
}: BreathPacerProps) {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(inhaleTime);
  const [totalCycles, setTotalCycles] = useState(0);
  const { breathSync } = useAudioEngine();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getPhaseTime = useCallback((p: BreathPhase) => {
    switch (p) {
      case 'inhale': return inhaleTime;
      case 'hold': return holdTime;
      case 'exhale': return exhaleTime;
      case 'rest': return restTime;
    }
  }, [inhaleTime, holdTime, exhaleTime, restTime]);

  const getNextPhase = useCallback((current: BreathPhase): BreathPhase => {
    switch (current) {
      case 'inhale': return holdTime > 0 ? 'hold' : 'exhale';
      case 'hold': return 'exhale';
      case 'exhale': return restTime > 0 ? 'rest' : 'inhale';
      case 'rest': return 'inhale';
    }
  }, [holdTime, restTime]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setPhase(currentPhase => {
            const nextPhase = getNextPhase(currentPhase);
            
            // Sync audio with breath
            if (nextPhase === 'inhale') {
              breathSync(true, inhaleTime * 1000);
              setTotalCycles(c => c + 1);
            } else if (nextPhase === 'exhale') {
              breathSync(false, exhaleTime * 1000);
            }
            
            return nextPhase;
          });
          
          // Return the time for the next phase
          return getPhaseTime(getNextPhase(phase));
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, phase, getNextPhase, getPhaseTime, breathSync, inhaleTime, exhaleTime]);

  // Reset when toggled off
  useEffect(() => {
    if (!isActive) {
      setPhase('inhale');
      setCountdown(inhaleTime);
    }
  }, [isActive, inhaleTime]);

  // Calculate scale for the breathing circle
  const getScale = () => {
    const maxScale = 1.3;
    const minScale = 0.7;
    const phaseProgress = 1 - (countdown / getPhaseTime(phase));
    
    switch (phase) {
      case 'inhale':
        return minScale + (maxScale - minScale) * phaseProgress;
      case 'hold':
        return maxScale;
      case 'exhale':
        return maxScale - (maxScale - minScale) * phaseProgress;
      case 'rest':
        return minScale;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-lg)'
    }}>
      {/* Breathing Circle */}
      <div style={{
        position: 'relative',
        width: 200,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Outer ring */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${phaseColors[phase]}20`,
          }}
        />
        
        {/* Animated circle */}
        <motion.div
          animate={{ 
            scale: isActive ? getScale() : 1,
            opacity: isActive ? 1 : 0.5
          }}
          transition={{ 
            duration: 0.5,
            ease: 'easeInOut'
          }}
          style={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${phaseColors[phase]}30 0%, ${phaseColors[phase]}10 100%)`,
            border: `2px solid ${phaseColors[phase]}60`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isActive ? `0 0 40px ${phaseColors[phase]}30` : 'none'
          }}
        >
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: phaseColors[phase],
              marginBottom: 4
            }}
          >
            {phaseLabels[phase]}
          </motion.span>
          
          <motion.span
            style={{
              fontSize: '2rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            {countdown}
          </motion.span>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)'
      }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            background: isActive ? 'var(--bg-tertiary)' : 'var(--accent-cyan)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          {isActive ? 'Pause' : 'Start Breathing'}
        </motion.button>
      </div>

      {/* Cycle Counter */}
      {totalCycles > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          {totalCycles} breath{totalCycles !== 1 ? 's' : ''} completed
        </motion.div>
      )}

      {/* Pattern Info */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <span>In: {inhaleTime}s</span>
        {holdTime > 0 && <span>Hold: {holdTime}s</span>}
        <span>Out: {exhaleTime}s</span>
        {restTime > 0 && <span>Rest: {restTime}s</span>}
      </div>
    </div>
  );
}
