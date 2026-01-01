// NeuroHarmonic - Focus/ADHD Support Screen

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Rocket, Heart, 
  RefreshCw, Moon, Zap, Timer
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { WaveformDisplay } from '../components/visualizers/WaveformDisplay';
import { AudioEngine } from '../audio/AudioEngine';
import { useAppStore } from '../stores/appStore';
import { getQuickTools, type HealingProtocol } from '../data/protocols';
import { SessionPlayer } from '../components/session/SessionPlayer';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

const TIMER_FREQUENCIES = {
  focus: 18,
  shortBreak: 10,
  longBreak: 8
};

const TIMER_COLORS = {
  focus: '#FFB800',
  shortBreak: '#00FFD1',
  longBreak: '#8B5CF6'
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const quickTools = [
  { id: 'focus-boost', icon: Rocket, label: '2-Min Boost', description: 'Gamma burst for task initiation', color: '#FFB800' },
  { id: 'overwhelm-reset', icon: Heart, label: 'Calm Reset', description: 'Instant alpha drop', color: '#00FFD1' },
  { id: 'transition-help', icon: RefreshCw, label: 'Transition', description: 'Smooth task switching', color: '#8B5CF6' },
  { id: 'wind-down', icon: Moon, label: 'Wind Down', description: 'Gradual descent', color: '#6366F1' }
];

export function FocusScreen() {
  const { masterVolume, carrierFrequency, pomodorosCompleted, incrementPomodoros } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'timer' | 'tools'>('timer');
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState<HealingProtocol | null>(null);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const protocols = getQuickTools();

  const currentColor = TIMER_COLORS[timerMode];
  const currentFrequency = TIMER_FREQUENCIES[timerMode];

  const startTimer = useCallback(async () => {
    await AudioEngine.start({
      carrierFrequency,
      beatFrequency: currentFrequency,
      volume: masterVolume,
      solfeggioFrequencies: timerMode === 'focus' ? [417] : [528]
    });
    setIsRunning(true);
  }, [carrierFrequency, currentFrequency, masterVolume, timerMode]);

  const pauseTimer = useCallback(async () => {
    await AudioEngine.stop();
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(async () => {
    await AudioEngine.stop();
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[timerMode]);
  }, [timerMode]);

  const handleTimerComplete = useCallback(async () => {
    await AudioEngine.stop();
    setIsRunning(false);
    
    if (timerMode === 'focus') {
      const newCount = pomodorosCompleted + 1;
      incrementPomodoros();
      
      // Long break every 4 pomodoros
      if (newCount % 4 === 0) {
        setTimerMode('longBreak');
        setTimeLeft(TIMER_DURATIONS.longBreak);
      } else {
        setTimerMode('shortBreak');
        setTimeLeft(TIMER_DURATIONS.shortBreak);
      }
    } else {
      setTimerMode('focus');
      setTimeLeft(TIMER_DURATIONS.focus);
    }
  }, [timerMode, pomodorosCompleted, incrementPomodoros]);

  const selectQuickTool = (id: string) => {
    const protocol = protocols.find(p => p.id === id);
    if (protocol) {
      setActiveProtocol(protocol);
    }
  };

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      AudioEngine.stop();
    };
  }, []);

  const progress = 1 - (timeLeft / TIMER_DURATIONS[timerMode]);

  return (
    <div style={{ padding: 'var(--space-lg)', paddingBottom: 100 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-lg)' }}
      >
        <h1 style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--space-xs)'
        }}>
          Focus Tools ⚡
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Designed for your unique brain
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)',
        background: 'var(--bg-tertiary)',
        padding: 4,
        borderRadius: 'var(--radius-lg)'
      }}>
        {[
          { id: 'timer' as const, label: 'Focus Timer', icon: Timer },
          { id: 'tools' as const, label: 'Quick Tools', icon: Zap }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-xs)',
              padding: 'var(--space-md)',
              background: activeTab === id ? 'var(--accent-cyan)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: activeTab === id ? '#000' : 'var(--text-muted)',
              fontWeight: activeTab === id ? 600 : 400,
              fontSize: '0.9rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Icon size={18} />
            {label}
          </button>
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
            <Card variant="glass" padding="lg" glowColor={currentColor}>
              {/* Mode Selector */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-xl)'
              }}>
                {(['focus', 'shortBreak', 'longBreak'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      if (!isRunning) {
                        setTimerMode(mode);
                        setTimeLeft(TIMER_DURATIONS[mode]);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      background: timerMode === mode ? `${TIMER_COLORS[mode]}20` : 'transparent',
                      border: `1px solid ${timerMode === mode ? TIMER_COLORS[mode] : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-full)',
                      color: timerMode === mode ? TIMER_COLORS[mode] : 'var(--text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: timerMode === mode ? 600 : 400,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {mode === 'focus' ? '🎯 Focus' : mode === 'shortBreak' ? '☕ Break' : '🌿 Long Break'}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                {/* Circular Progress */}
                <div style={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                  margin: '0 auto var(--space-lg)'
                }}>
                  <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="var(--bg-elevated)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={currentColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 90}
                      animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress) }}
                      transition={{ duration: 0.5 }}
                      style={{
                        filter: `drop-shadow(0 0 8px ${currentColor})`
                      }}
                    />
                  </svg>
                  
                  {/* Time display */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontSize: '2.75rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: currentColor
                    }}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>

                {/* Pomodoro count */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)'
                }}>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: i < (pomodorosCompleted % 4) ? 'var(--accent-amber)' : 'var(--bg-elevated)',
                        transition: 'background var(--transition-fast)'
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {pomodorosCompleted} sessions completed today
                </div>
              </div>

              {/* Waveform */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <WaveformDisplay
                  isPlaying={isRunning}
                  frequency={currentFrequency}
                  color={currentColor}
                  height={80}
                />
              </div>

              {/* Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-lg)'
              }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <RotateCcw size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isRunning ? pauseTimer : startTimer}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${currentColor} 0%, ${currentColor}CC 100%)`,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 30px ${currentColor}50`
                  }}
                >
                  {isRunning ? (
                    <Pause size={28} fill="black" color="black" />
                  ) : (
                    <Play size={28} fill="black" color="black" style={{ marginLeft: 4 }} />
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setTimerMode(timerMode === 'focus' ? 'shortBreak' : 'focus');
                    setTimeLeft(TIMER_DURATIONS[timerMode === 'focus' ? 'shortBreak' : 'focus']);
                  }}
                  disabled={isRunning}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--bg-elevated)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    opacity: isRunning ? 0.5 : 1
                  }}
                >
                  <RefreshCw size={20} />
                </motion.button>
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
            {/* Quick Tools Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-xl)'
            }}>
              {quickTools.map(({ id, icon: Icon, label, description, color }) => (
                <Card
                  key={id}
                  variant="default"
                  padding="lg"
                  interactive
                  onClick={() => selectQuickTool(id)}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: `${color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-md)'
                  }}>
                    <Icon size={24} color={color} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>
                    {label}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {description}
                  </p>
                </Card>
              ))}
            </div>

            {/* Emergency Reset */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectQuickTool('overwhelm-reset')}
              style={{
                width: '100%',
                padding: 'var(--space-lg)',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
              }}
            >
              <Heart size={24} />
              Emergency Calm Reset
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Player */}
      <AnimatePresence>
        {activeProtocol && (
          <SessionPlayer
            protocol={activeProtocol}
            onClose={() => setActiveProtocol(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
