// NeuroHarmonic - ADHD Support Suite
// Powerful tools designed specifically for ADHD minds

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Zap, Heart, Brain, 
  Timer, Volume2, Sparkles, RefreshCw, Coffee
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { WaveformVisualizer } from '../components/visualizers/WaveformVisualizer';
import { MandalaGenerator } from '../components/visualizers/MandalaGenerator';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { HEALING_PROTOCOLS, HealingProtocol } from '../data/protocols';

interface ADHDPageProps {
  onSelectProtocol: (protocol: HealingProtocol) => void;
}

type TimerMode = 'focus' | 'break';

const FOCUS_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function ADHDPage({ onSelectProtocol }: ADHDPageProps) {
  const [activeTab, setActiveTab] = useState<'timer' | 'tools' | 'sensory'>('timer');
  
  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio Engine
  const { isPlaying, start, stop, morphTo } = useAudioEngine();
  
  // Visual Focus State
  const [visualMode, setVisualMode] = useState<'wave' | 'mandala' | 'none'>('wave');
  const [visualIntensity, setVisualIntensity] = useState(0.7);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    
    if (timerMode === 'focus') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      // Long break every 4 pomodoros
      if (newCount % 4 === 0) {
        setTimeLeft(LONG_BREAK);
      } else {
        setTimeLeft(SHORT_BREAK);
      }
      setTimerMode('break');
      
      // Shift to alpha for break
      if (isPlaying) {
        morphTo({ binauralBeatFrequency: 10 }, 10000);
      }
    } else {
      setTimeLeft(FOCUS_TIME);
      setTimerMode('focus');
      
      // Shift back to beta for focus
      if (isPlaying) {
        morphTo({ binauralBeatFrequency: 18 }, 10000);
      }
    }
  };

  const startTimer = async () => {
    setIsTimerRunning(true);
    
    if (!isPlaying) {
      await start({
        binauralBeatFrequency: timerMode === 'focus' ? 18 : 10,
        carrierFrequency: 300,
        volume: 0.4
      });
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = async () => {
    setIsTimerRunning(false);
    setTimeLeft(timerMode === 'focus' ? FOCUS_TIME : SHORT_BREAK);
    await stop();
  };

  const skipToNext = () => {
    handleTimerComplete();
  };

  // Quick Action Protocols
  const quickActions = [
    { 
      id: 'focus-boost', 
      icon: Zap, 
      label: 'Focus Boost', 
      description: '2 min gamma burst',
      color: '#f59e0b' 
    },
    { 
      id: 'overwhelm-reset', 
      icon: Heart, 
      label: 'Calm Reset', 
      description: '3 min anxiety relief',
      color: '#06b6d4' 
    },
    { 
      id: 'hyperfocus-exit', 
      icon: RefreshCw, 
      label: 'Exit Hyperfocus', 
      description: '5 min transition',
      color: '#8b5cf6' 
    },
    { 
      id: 'morning-activation', 
      icon: Coffee, 
      label: 'Wake Up', 
      description: '10 min activation',
      color: '#10b981' 
    }
  ];

  const tabs = [
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'tools', label: 'Quick Tools', icon: Zap },
    { id: 'sensory', label: 'Sensory', icon: Sparkles }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: 'var(--spacing-lg)',
        paddingBottom: 'calc(80px + var(--spacing-lg))',
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--spacing-xs)'
        }}>
          ADHD Support Suite ⚡
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Tools designed for your unique brain
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
        background: 'var(--bg-secondary)',
        padding: 'var(--spacing-xs)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(id as any)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: activeTab === id ? 'var(--accent-violet)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: activeTab === id ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.85rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={16} />
            <span style={{ display: 'none', '@media (min-width: 400px)': { display: 'inline' } } as any}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'timer' && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Pomodoro Timer Card */}
            <Card variant="glass" padding="lg" glowColor={timerMode === 'focus' ? '#f59e0b' : '#06b6d4'}>
              {/* Mode Indicator */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  background: timerMode === 'focus' ? '#f59e0b20' : '#06b6d420',
                  color: timerMode === 'focus' ? '#f59e0b' : '#06b6d4',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {timerMode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
                </div>
              </div>

              {/* Timer Display */}
              <motion.div
                animate={{ scale: isTimerRunning ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 2, repeat: isTimerRunning ? Infinity : 0 }}
                style={{
                  textAlign: 'center',
                  marginBottom: 'var(--spacing-xl)'
                }}
              >
                <div style={{
                  fontSize: '4rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  background: timerMode === 'focus' 
                    ? 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)'
                    : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {formatTime(timeLeft)}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)',
                  marginTop: 'var(--spacing-sm)'
                }}>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: i < (pomodorosCompleted % 4) 
                          ? 'var(--accent-amber)' 
                          : 'var(--bg-tertiary)'
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {pomodorosCompleted} pomodoros completed
                </div>
              </motion.div>

              {/* Visualization */}
              {visualMode !== 'none' && (
                <div style={{
                  marginBottom: 'var(--spacing-lg)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-primary)'
                }}>
                  {visualMode === 'wave' && (
                    <WaveformVisualizer
                      frequency={timerMode === 'focus' ? 18 : 10}
                      isPlaying={isPlaying}
                      brainwaveType={timerMode === 'focus' ? 'beta' : 'alpha'}
                      intensity={visualIntensity}
                      size="md"
                    />
                  )}
                  {visualMode === 'mandala' && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-md)' }}>
                      <MandalaGenerator
                        isPlaying={isPlaying}
                        frequency={timerMode === 'focus' ? 18 : 10}
                        color={timerMode === 'focus' ? '#f59e0b' : '#06b6d4'}
                        size={150}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-md)'
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <RotateCcw size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: timerMode === 'focus'
                      ? 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)'
                      : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: `0 0 30px ${timerMode === 'focus' ? '#f59e0b50' : '#06b6d450'}`
                  }}
                >
                  {isTimerRunning ? (
                    <Pause size={28} fill="white" />
                  ) : (
                    <Play size={28} fill="white" style={{ marginLeft: 4 }} />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={skipToNext}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--bg-tertiary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <RefreshCw size={20} />
                </motion.button>
              </div>

              {/* Visual Mode Selector */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-lg)'
              }}>
                {(['wave', 'mandala', 'none'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setVisualMode(mode)}
                    style={{
                      padding: 'var(--spacing-xs) var(--spacing-md)',
                      background: visualMode === mode ? 'var(--bg-tertiary)' : 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-full)',
                      color: visualMode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div
            key="tools"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)'
            }}>
              {quickActions.map(({ id, icon: Icon, label, description, color }) => {
                const protocol = HEALING_PROTOCOLS.find(p => p.id === id);
                if (!protocol) return null;

                return (
                  <Card
                    key={id}
                    variant="default"
                    padding="lg"
                    interactive
                    onClick={() => onSelectProtocol(protocol)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `${color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={28} color={color} />
                    </div>
                    
                    <div>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: 4
                      }}>
                        {label}
                      </h3>
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}>
                        {description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Emergency Reset Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const protocol = HEALING_PROTOCOLS.find(p => p.id === 'overwhelm-reset');
                if (protocol) onSelectProtocol(protocol);
              }}
              style={{
                width: '100%',
                padding: 'var(--spacing-lg)',
                marginTop: 'var(--spacing-xl)',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Heart size={24} />
              Emergency Calm Reset
            </motion.button>
          </motion.div>
        )}

        {activeTab === 'sensory' && (
          <motion.div
            key="sensory"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card variant="glass" padding="lg">
              <h3 style={{
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-lg)'
              }}>
                Visual Focus Tools
              </h3>

              {/* Mandala Display */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 'var(--spacing-xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <MandalaGenerator
                  isPlaying={isPlaying}
                  frequency={10}
                  color="var(--accent-violet)"
                  layers={8}
                  size={250}
                />
              </div>

              {/* Intensity Slider */}
              <Slider
                value={visualIntensity}
                min={0}
                max={1}
                step={0.01}
                onChange={setVisualIntensity}
                label="Visual Intensity"
                formatValue={(v) => `${Math.round(v * 100)}%`}
                color="var(--accent-violet)"
              />

              <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: 'var(--spacing-md)'
                }}>
                  Ambient Sounds
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--spacing-sm)'
                }}>
                  {[
                    { id: 'white', label: 'White', emoji: '🌫️' },
                    { id: 'pink', label: 'Pink', emoji: '🌸' },
                    { id: 'brown', label: 'Brown', emoji: '🌊' }
                  ].map(({ id, label, emoji }) => (
                    <button
                      key={id}
                      style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{emoji}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {label} Noise
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
