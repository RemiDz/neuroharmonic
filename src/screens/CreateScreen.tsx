// NeuroHarmonic - Custom Session Creator

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, Waves, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { WaveformDisplay } from '../components/visualizers/WaveformDisplay';
import { ParticleField } from '../components/visualizers/ParticleField';
import { AudioEngine } from '../audio/AudioEngine';
import { useAppStore } from '../stores/appStore';
import { BRAINWAVE_STATES, SOLFEGGIO_FREQUENCIES, CARRIER_FREQUENCIES } from '../data/frequencies';

export function CreateScreen() {
  const { masterVolume, setMasterVolume, carrierFrequency, setCarrierFrequency } = useAppStore();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatFrequency, setBeatFrequency] = useState(10);
  const [activeSolfeggio, setActiveSolfeggio] = useState<number[]>([]);
  const [noiseType, setNoiseType] = useState<'white' | 'pink' | 'brown' | null>(null);
  const [noiseVolume, setNoiseVolume] = useState(0.3);

  const handlePlay = async () => {
    if (isPlaying) {
      await AudioEngine.stop();
      setIsPlaying(false);
    } else {
      await AudioEngine.start({
        carrierFrequency,
        beatFrequency,
        volume: masterVolume,
        solfeggioFrequencies: activeSolfeggio,
        noiseType,
        noiseVolume
      });
      setIsPlaying(true);
    }
  };

  const handleBeatFrequencyChange = (value: number) => {
    setBeatFrequency(value);
    if (isPlaying) {
      AudioEngine.morphTo({ beatFrequency: value }, 1);
    }
  };

  const handleCarrierChange = (value: number) => {
    setCarrierFrequency(value);
    if (isPlaying) {
      AudioEngine.morphTo({ carrierFrequency: value }, 1);
    }
  };

  const toggleSolfeggio = (hz: number) => {
    setActiveSolfeggio(prev => {
      const newArr = prev.includes(hz) 
        ? prev.filter(f => f !== hz)
        : [...prev, hz];
      
      if (isPlaying) {
        AudioEngine.morphTo({ solfeggioFrequencies: newArr }, 2);
      }
      
      return newArr;
    });
  };

  const handleNoiseChange = (type: typeof noiseType) => {
    setNoiseType(type);
    if (isPlaying) {
      AudioEngine.setNoiseType(type);
    }
  };

  const handleNoiseVolumeChange = (volume: number) => {
    setNoiseVolume(volume);
    if (isPlaying) {
      AudioEngine.setNoiseVolume(volume);
    }
  };

  const handleVolumeChange = (volume: number) => {
    setMasterVolume(volume);
    if (isPlaying) {
      AudioEngine.setVolume(volume);
    }
  };

  // Determine brainwave type from frequency
  const getBrainwaveType = (freq: number): string => {
    if (freq <= 4) return 'delta';
    if (freq <= 8) return 'theta';
    if (freq <= 13) return 'alpha';
    if (freq <= 30) return 'beta';
    return 'gamma';
  };

  const brainwaveType = getBrainwaveType(beatFrequency);
  const brainwave = BRAINWAVE_STATES[brainwaveType];

  return (
    <div style={{ 
      padding: 'var(--space-lg)', 
      paddingBottom: 100,
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Background */}
      {isPlaying && (
        <ParticleField
          isPlaying={isPlaying}
          frequency={beatFrequency}
          color={brainwave.color}
          particleCount={40}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-lg)', position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--space-xs)'
        }}>
          Sound Playground 🎨
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Create your own frequency experience
        </p>
      </motion.div>

      {/* Main Display */}
      <Card 
        variant="glass" 
        padding="lg" 
        glowColor={brainwave.color}
        style={{ marginBottom: 'var(--space-xl)', position: 'relative', zIndex: 1 }}
      >
        {/* Frequency Display */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <motion.div
            animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            style={{
              fontSize: '3rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: brainwave.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {beatFrequency.toFixed(1)} Hz
          </motion.div>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {brainwave.name} Waves
          </div>
        </div>

        {/* Waveform */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <WaveformDisplay
            isPlaying={isPlaying}
            frequency={beatFrequency}
            color={brainwave.color}
            height={100}
          />
        </div>

        {/* Play Button */}
        <Button
          variant={isPlaying ? 'secondary' : 'primary'}
          size="lg"
          fullWidth
          glow={isPlaying}
          icon={isPlaying ? <Pause size={22} /> : <Play size={22} />}
          onClick={handlePlay}
          gradient={isPlaying ? undefined : brainwave.gradient}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
      </Card>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-lg)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Binaural Beat */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
          }}>
            <Waves size={18} color={brainwave.color} />
            <span style={{ fontWeight: 600 }}>Binaural Beat</span>
          </div>
          
          <Slider
            value={beatFrequency}
            min={0.5}
            max={50}
            step={0.1}
            onChange={handleBeatFrequencyChange}
            formatValue={(v: number) => `${v.toFixed(1)} Hz`}
            color={brainwave.color}
          />

          {/* Brainwave Presets */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-md)',
            flexWrap: 'wrap'
          }}>
            {Object.values(BRAINWAVE_STATES).map((state) => (
              <button
                key={state.id}
                onClick={() => handleBeatFrequencyChange(state.defaultFrequency)}
                style={{
                  padding: '6px 12px',
                  background: brainwaveType === state.id ? state.color : 'var(--bg-elevated)',
                  color: brainwaveType === state.id ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                {state.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Carrier Frequency */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
          }}>
            <Volume2 size={18} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 600 }}>Carrier Frequency</span>
          </div>
          
          <Slider
            value={carrierFrequency}
            min={100}
            max={500}
            step={1}
            onChange={handleCarrierChange}
            formatValue={(v: number) => `${v} Hz`}
            color="var(--accent-cyan)"
          />

          <div style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-md)',
            flexWrap: 'wrap'
          }}>
            {CARRIER_FREQUENCIES.slice(0, 6).map((cf) => (
              <button
                key={cf.hz}
                onClick={() => handleCarrierChange(cf.hz)}
                style={{
                  padding: '6px 12px',
                  background: carrierFrequency === cf.hz ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                  color: carrierFrequency === cf.hz ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem'
                }}
              >
                {cf.hz}Hz
              </button>
            ))}
          </div>
        </Card>

        {/* Solfeggio Frequencies */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
          }}>
            <Sparkles size={18} color="var(--accent-magenta)" />
            <span style={{ fontWeight: 600 }}>Solfeggio Layer</span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-sm)'
          }}>
            {SOLFEGGIO_FREQUENCIES.map((freq) => {
              const isActive = activeSolfeggio.includes(freq.hz);
              return (
                <motion.button
                  key={freq.hz}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSolfeggio(freq.hz)}
                  style={{
                    padding: 'var(--space-sm)',
                    background: isActive ? `${freq.color}30` : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? freq.color : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isActive ? freq.color : 'var(--text-primary)'
                  }}>
                    {freq.hz}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    marginTop: 2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {freq.intention}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Card>

        {/* Noise Layer */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
          }}>
            <span style={{ fontSize: '1.1rem' }}>🌊</span>
            <span style={{ fontWeight: 600 }}>Ambient Noise</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)'
          }}>
            {[
              { id: null, label: 'Off', emoji: '🔇' },
              { id: 'white' as const, label: 'White', emoji: '⚪' },
              { id: 'pink' as const, label: 'Pink', emoji: '🌸' },
              { id: 'brown' as const, label: 'Brown', emoji: '🟤' }
            ].map(({ id, label, emoji }) => (
              <button
                key={label}
                onClick={() => handleNoiseChange(id)}
                style={{
                  flex: 1,
                  padding: 'var(--space-sm)',
                  background: noiseType === id ? 'var(--accent-violet)' : 'var(--bg-elevated)',
                  color: noiseType === id ? '#fff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {noiseType && (
            <Slider
              value={noiseVolume}
              min={0}
              max={1}
              step={0.01}
              onChange={handleNoiseVolumeChange}
              label="Noise Volume"
              formatValue={(v: number) => `${Math.round(v * 100)}%`}
              color="var(--accent-violet)"
            />
          )}
        </Card>

        {/* Master Volume */}
        <Card variant="default" padding="md">
          <Slider
            value={masterVolume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            label="Master Volume"
            formatValue={(v: number) => `${Math.round(v * 100)}%`}
            color="var(--accent-emerald)"
          />
        </Card>
      </div>
    </div>
  );
}

function Pause({ size, ...props }: { size: number; [key: string]: unknown }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}
