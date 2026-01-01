// NeuroHarmonic - Interactive Sound Playground
// Explore and create your own frequency combinations

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Volume2, Waves } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { WaveformVisualizer } from '../components/visualizers/WaveformVisualizer';
import { ParticleField } from '../components/visualizers/ParticleField';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { SOLFEGGIO_FREQUENCIES, BRAINWAVE_STATES, CARRIER_FREQUENCIES } from '../data/frequencies';


export function PlaygroundPage() {
  const { isPlaying, start, stop, morphTo, setVolume } = useAudioEngine();
  
  const [binauralFreq, setBinauralFreq] = useState(10);
  const [carrierFreq, setCarrierFreq] = useState(300);
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [activeSolfeggio, setActiveSolfeggio] = useState<number | null>(null);

  const handlePlay = async () => {
    if (isPlaying) {
      await stop();
    } else {
      await start({
        binauralBeatFrequency: binauralFreq,
        carrierFrequency: carrierFreq,
        volume: masterVolume,
        solfeggioFrequency: activeSolfeggio || undefined
      });
    }
  };

  const handleBinauralChange = (value: number) => {
    setBinauralFreq(value);
    if (isPlaying) {
      morphTo({ binauralBeatFrequency: value }, 1000);
    }
  };

  const handleCarrierChange = (value: number) => {
    setCarrierFreq(value);
    if (isPlaying) {
      morphTo({ carrierFrequency: value }, 1000);
    }
  };

  const handleSolfeggioToggle = (hz: number) => {
    const newValue = activeSolfeggio === hz ? null : hz;
    setActiveSolfeggio(newValue);
    if (isPlaying) {
      morphTo({ solfeggioFrequency: newValue || undefined }, 2000);
    }
  };

  const handleVolumeChange = (value: number) => {
    setMasterVolume(value);
    setVolume(value);
  };

  // Get brainwave type from frequency
  const getBrainwaveType = (freq: number): string => {
    if (freq <= 4) return 'delta';
    if (freq <= 8) return 'theta';
    if (freq <= 13) return 'alpha';
    if (freq <= 30) return 'beta';
    return 'gamma';
  };

  const brainwaveType = getBrainwaveType(binauralFreq);
  const brainwave = BRAINWAVE_STATES[brainwaveType];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: 'var(--spacing-lg)',
        paddingBottom: 'calc(80px + var(--spacing-lg))',
        maxWidth: 600,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Background Particles */}
      {isPlaying && (
        <ParticleField
          isPlaying={isPlaying}
          frequency={binauralFreq}
          color={brainwave?.color || '#00d4ff'}
          particleCount={30}
        />
      )}

      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-xl)', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--spacing-xs)'
        }}>
          Sound Playground 🎵
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Create your own frequency experience
        </p>
      </div>

      {/* Main Visualization */}
      <Card variant="glass" padding="lg" glowColor={brainwave?.color} style={{ marginBottom: 'var(--spacing-xl)', position: 'relative', zIndex: 1 }}>
        {/* Frequency Display */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <motion.div
            animate={{ scale: isPlaying ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            style={{
              fontSize: '3rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              background: brainwave?.gradient || 'var(--accent-cyan)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {binauralFreq.toFixed(1)} Hz
          </motion.div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginTop: 'var(--spacing-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {brainwaveType} waves
          </div>
        </div>

        {/* Waveform */}
        <div style={{
          marginBottom: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-primary)'
        }}>
          <WaveformVisualizer
            frequency={binauralFreq}
            isPlaying={isPlaying}
            brainwaveType={brainwaveType}
            size="full"
          />
        </div>

        {/* Play Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          glow={isPlaying}
          icon={isPlaying ? <Square size={20} fill="white" /> : <Play size={20} fill="white" />}
          onClick={handlePlay}
          style={{
            background: isPlaying ? 'var(--bg-tertiary)' : brainwave?.gradient
          }}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
      </Card>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', position: 'relative', zIndex: 1 }}>
        {/* Binaural Frequency */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <Waves size={18} color={brainwave?.color} />
            <span style={{ fontWeight: 600 }}>Binaural Beat</span>
          </div>
          
          <Slider
            value={binauralFreq}
            min={0.5}
            max={50}
            step={0.1}
            onChange={handleBinauralChange}
            formatValue={(v) => `${v.toFixed(1)} Hz`}
            color={brainwave?.color}
          />

          {/* Quick Presets */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)',
            marginTop: 'var(--spacing-md)',
            flexWrap: 'wrap'
          }}>
            {Object.values(BRAINWAVE_STATES).map((state) => (
              <button
                key={state.id}
                onClick={() => handleBinauralChange(state.defaultFreq)}
                style={{
                  padding: '4px 10px',
                  background: binauralFreq >= state.range[0] && binauralFreq <= state.range[1]
                    ? state.color
                    : 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: binauralFreq >= state.range[0] && binauralFreq <= state.range[1]
                    ? 'white'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
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
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <Volume2 size={18} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 600 }}>Carrier Tone</span>
          </div>
          
          <Slider
            value={carrierFreq}
            min={100}
            max={600}
            step={1}
            onChange={handleCarrierChange}
            formatValue={(v) => `${v} Hz`}
            color="var(--accent-cyan)"
          />

          {/* Carrier Presets */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)',
            marginTop: 'var(--spacing-md)',
            flexWrap: 'wrap'
          }}>
            {CARRIER_FREQUENCIES.map((cf) => (
              <button
                key={cf.hz}
                onClick={() => handleCarrierChange(cf.hz)}
                style={{
                  padding: '4px 10px',
                  background: carrierFreq === cf.hz ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  color: carrierFreq === cf.hz ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {cf.hz} Hz
              </button>
            ))}
          </div>
        </Card>

        {/* Solfeggio Frequencies */}
        <Card variant="default" padding="md">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            marginBottom: 'var(--spacing-md)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontWeight: 600 }}>Solfeggio Layer</span>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--spacing-sm)'
          }}>
            {SOLFEGGIO_FREQUENCIES.map((freq) => (
              <motion.button
                key={freq.hz}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSolfeggioToggle(freq.hz)}
                style={{
                  padding: 'var(--spacing-sm)',
                  background: activeSolfeggio === freq.hz 
                    ? `linear-gradient(135deg, ${freq.color}40, ${freq.color}20)`
                    : 'var(--bg-tertiary)',
                  border: `1px solid ${activeSolfeggio === freq.hz ? freq.color : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: activeSolfeggio === freq.hz ? freq.color : 'var(--text-primary)'
                }}>
                  {freq.hz}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: 2
                }}>
                  {freq.intention.split(' ').slice(0, 2).join(' ')}
                </div>
              </motion.button>
            ))}
          </div>
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
            formatValue={(v) => `${Math.round(v * 100)}%`}
            color="var(--accent-violet)"
          />
        </Card>
      </div>
    </motion.div>
  );
}
