// NeuroHarmonic - Session Player Component
// The heart of the healing experience

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { HealingProtocol } from '../../data/protocols';
import { useSessionEngine } from '../../hooks/useAudioEngine';
import { useSessionStore } from '../../stores/sessionStore';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Card } from '../ui/Card';
import { WaveformVisualizer } from '../visualizers/WaveformVisualizer';
import { ParticleField } from '../visualizers/ParticleField';

interface SessionPlayerProps {
  protocol: HealingProtocol;
  onClose: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getBrainwaveType(frequency: number): string {
  if (frequency <= 4) return 'delta';
  if (frequency <= 8) return 'theta';
  if (frequency <= 13) return 'alpha';
  if (frequency <= 30) return 'beta';
  return 'gamma';
}

export function SessionPlayer({ protocol, onClose }: SessionPlayerProps) {
  const { state, progress, currentPhase, startSession, pause, resume, stop } = useSessionEngine();
  const { masterVolume, setMasterVolume, intention, setIntention } = useSessionStore();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showIntention, setShowIntention] = useState(true);
  const [localIntention, setLocalIntention] = useState('');

  useEffect(() => {
    // Auto-start after intention is set or dismissed
    if (!showIntention && state === 'idle') {
      startSession(protocol);
    }
  }, [showIntention, state, protocol, startSession]);

  const handleSetIntention = () => {
    setIntention(localIntention);
    setShowIntention(false);
  };

  const handleSkipIntention = () => {
    setShowIntention(false);
  };

  const handlePlayPause = () => {
    if (state === 'playing' || state === 'morphing') {
      pause();
    } else if (state === 'paused') {
      resume();
    }
  };

  const handleStop = async () => {
    await stop();
    onClose();
  };

  const currentFrequency = progress?.currentFrequency ?? protocol.phases[0].targetFrequency;
  const brainwaveType = getBrainwaveType(currentFrequency);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <ParticleField
        isPlaying={state === 'playing' || state === 'morphing'}
        frequency={currentFrequency}
        color={protocol.color}
        particleCount={40}
      />

      {/* Intention Setting Modal */}
      <AnimatePresence>
        {showIntention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-lg)',
              zIndex: 10
            }}
          >
            <Card variant="glass" padding="lg" style={{ maxWidth: 400, width: '100%' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                marginBottom: 'var(--spacing-md)',
                textAlign: 'center'
              }}>
                Set Your Intention
              </h2>
              
              <p style={{
                color: 'var(--text-secondary)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-lg)',
                fontSize: '0.9rem'
              }}>
                What would you like to focus on during this session?
              </p>

              <textarea
                value={localIntention}
                onChange={(e) => setLocalIntention(e.target.value)}
                placeholder="I am open to healing..."
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  minHeight: 100,
                  resize: 'none',
                  marginBottom: 'var(--spacing-lg)'
                }}
              />

              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <Button
                  variant="ghost"
                  onClick={handleSkipIntention}
                  fullWidth
                >
                  Skip
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSetIntention}
                  fullWidth
                >
                  Begin Session
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--spacing-lg)',
        paddingTop: 'var(--spacing-2xl)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}
        >
          <span style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
            {protocol.icon}
          </span>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            {protocol.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {currentPhase?.name || protocol.phases[0].name}
          </p>
        </motion.div>

        {/* Visualization Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-xl)'
        }}>
          <WaveformVisualizer
            frequency={currentFrequency}
            isPlaying={state === 'playing' || state === 'morphing'}
            brainwaveType={brainwaveType}
            size="full"
          />

          {/* Frequency Display */}
          <motion.div
            animate={{
              scale: state === 'playing' ? [1, 1.02, 1] : 1
            }}
            transition={{
              duration: 2,
              repeat: state === 'playing' ? Infinity : 0,
              ease: 'easeInOut'
            }}
            style={{
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '3rem',
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
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {brainwaveType} waves
            </div>
          </motion.div>

          {/* Intention Display */}
          {intention && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                maxWidth: 300,
                fontSize: '0.9rem'
              }}
            >
              "{intention}"
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span>{formatTime(progress?.elapsedTime ?? 0)}</span>
            <span>-{formatTime(progress?.remainingTime ?? protocol.duration)}</span>
          </div>
          
          <div style={{
            height: 6,
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: protocol.gradient,
                borderRadius: 'var(--radius-full)'
              }}
              animate={{ width: `${(progress?.totalProgress ?? 0) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-lg)',
          paddingBottom: 'var(--spacing-2xl)'
        }}>
          {/* Volume Control */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              {masterVolume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </motion.button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 'var(--spacing-md)',
                    background: 'var(--bg-secondary)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    width: 150
                  }}
                >
                  <Slider
                    value={masterVolume}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={setMasterVolume}
                    formatValue={(v) => `${Math.round(v * 100)}%`}
                    color={protocol.color}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            disabled={state === 'idle'}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: protocol.gradient,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              boxShadow: `0 0 30px ${protocol.color}50`
            }}
          >
            {state === 'playing' || state === 'morphing' ? (
              <Pause size={28} fill="white" />
            ) : (
              <Play size={28} fill="white" style={{ marginLeft: 4 }} />
            )}
          </motion.button>

          {/* Stop Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleStop}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <Square size={18} fill="currentColor" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
