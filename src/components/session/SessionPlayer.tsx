// NeuroHarmonic - Session Player
// Full-screen session playback with visualizations

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import type { HealingProtocol } from '../../data/protocols';
import { AudioEngine } from '../../audio/AudioEngine';
import { useAppStore } from '../../stores/appStore';
import { Slider } from '../ui/Slider';
import { ParticleField } from '../visualizers/ParticleField';
import { WaveformDisplay } from '../visualizers/WaveformDisplay';

interface SessionPlayerProps {
  protocol: HealingProtocol;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SessionPlayer({ protocol, onClose }: SessionPlayerProps) {
  const { masterVolume, setMasterVolume, carrierFrequency, addSessionToHistory, updateStreak } = useAppStore();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [, setPhaseElapsedSeconds] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPhase = protocol.phases[currentPhaseIndex];
  
  const totalProgress = totalElapsed / protocol.duration;
  
  const currentFrequency = currentPhase.beatFrequency;

  const startSession = useCallback(async () => {
    await AudioEngine.start({
      carrierFrequency,
      beatFrequency: currentPhase.beatFrequency,
      volume: masterVolume,
      solfeggioFrequencies: currentPhase.solfeggioLayers || [],
      isochronicRate: currentPhase.isochronicRate || 0
    });
    setIsPlaying(true);
  }, [carrierFrequency, currentPhase, masterVolume]);

  const pauseSession = useCallback(async () => {
    await AudioEngine.stop();
    setIsPlaying(false);
  }, []);

  const stopSession = useCallback(async () => {
    await AudioEngine.stop();
    setIsPlaying(false);
    
    // Record completed session if at least 30 seconds
    if (totalElapsed >= 30) {
      addSessionToHistory({
        protocolId: protocol.id,
        protocolName: protocol.name,
        completedAt: Date.now(),
        duration: totalElapsed,
        category: protocol.category
      });
      updateStreak();
    }
    
    onClose();
  }, [totalElapsed, protocol, addSessionToHistory, updateStreak, onClose]);

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPhaseElapsedSeconds(prev => {
          const newElapsed = prev + 1;
          
          // Check if phase complete
          if (newElapsed >= currentPhase.duration) {
            const nextIndex = currentPhaseIndex + 1;
            
            if (nextIndex >= protocol.phases.length) {
              // Session complete
              stopSession();
              return prev;
            }
            
            // Move to next phase
            setCurrentPhaseIndex(nextIndex);
            const nextPhase = protocol.phases[nextIndex];
            
            // Morph audio to next phase
            AudioEngine.morphTo({
              beatFrequency: nextPhase.beatFrequency,
              solfeggioFrequencies: nextPhase.solfeggioLayers || [],
              isochronicRate: nextPhase.isochronicRate || 0
            }, 30);
            
            return 0;
          }
          
          return newElapsed;
        });
        
        setTotalElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentPhaseIndex, currentPhase.duration, protocol.phases, stopSession]);

  // Volume sync
  useEffect(() => {
    if (isPlaying) {
      AudioEngine.setVolume(masterVolume);
    }
  }, [masterVolume, isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      AudioEngine.stop();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowControls(prev => !prev)}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Background Visualization */}
      <ParticleField
        isPlaying={isPlaying}
        frequency={currentFrequency}
        color={protocol.color}
        particleCount={50}
      />

      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: 'var(--space-lg)',
              paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={stopSession}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={22} color="white" />
              </button>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                  {currentPhase.name}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {protocol.name}
                </div>
              </div>
              
              <div style={{ width: 44 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-xl)',
          position: 'relative',
          zIndex: 5
        }}
      >
        {/* Frequency Display */}
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.02, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut'
          }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <div style={{
            fontSize: 'clamp(3rem, 12vw, 5rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            background: protocol.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {currentFrequency.toFixed(1)} Hz
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            {currentFrequency <= 4 ? 'Delta' : 
             currentFrequency <= 8 ? 'Theta' : 
             currentFrequency <= 13 ? 'Alpha' : 
             currentFrequency <= 30 ? 'Beta' : 'Gamma'} Waves
          </div>
        </motion.div>

        {/* Waveform */}
        <div style={{ width: '100%', maxWidth: 400, marginBottom: 'var(--space-xl)' }}>
          <WaveformDisplay
            isPlaying={isPlaying}
            frequency={currentFrequency}
            color={protocol.color}
            height={100}
          />
        </div>

        {/* Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            isPlaying ? pauseSession() : startSession();
          }}
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: protocol.gradient,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 0 40px ${protocol.color}50`
          }}
        >
          {isPlaying ? (
            <Pause size={36} fill="white" color="white" />
          ) : (
            <Play size={36} fill="white" color="white" style={{ marginLeft: 4 }} />
          )}
        </motion.button>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'var(--space-lg)',
              paddingBottom: 'max(var(--space-lg), env(safe-area-inset-bottom))',
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
              zIndex: 10
            }}
          >
            {/* Progress */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <span>{formatTime(totalElapsed)}</span>
                <span>-{formatTime(protocol.duration - totalElapsed)}</span>
              </div>
              
              <div style={{
                height: 6,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: protocol.gradient,
                    borderRadius: 'var(--radius-full)'
                  }}
                  animate={{ width: `${totalProgress * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Volume */}
            <Slider
              value={masterVolume}
              min={0}
              max={1}
              step={0.01}
              onChange={setMasterVolume}
              label="Volume"
              formatValue={(v: number) => `${Math.round(v * 100)}%`}
              color={protocol.color}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
