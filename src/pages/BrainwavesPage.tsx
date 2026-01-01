// NeuroHarmonic - Brainwaves Navigator Page
// Interactive exploration of brainwave states

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { WaveformVisualizer } from '../components/visualizers/WaveformVisualizer';
import { BRAINWAVE_STATES, BrainwaveState } from '../data/frequencies';
import { useAudioEngine } from '../hooks/useAudioEngine';

export function BrainwavesPage() {
  const [selectedState, setSelectedState] = useState<BrainwaveState>(BRAINWAVE_STATES.alpha);
  const [frequency, setFrequency] = useState(selectedState.defaultFreq);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const { isPlaying, start, stop, morphTo } = useAudioEngine();

  const handleStateSelect = (state: BrainwaveState) => {
    setSelectedState(state);
    setFrequency(state.defaultFreq);
    
    if (isPlaying) {
      morphTo({ binauralBeatFrequency: state.defaultFreq }, 5000);
    }
  };

  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    if (isPlaying) {
      morphTo({ binauralBeatFrequency: value }, 500);
    }
  };

  const handlePlayToggle = async () => {
    if (isPlaying) {
      await stop();
    } else {
      await start({
        binauralBeatFrequency: frequency,
        carrierFrequency: 300,
        volume: 0.5
      });
    }
  };

  const brainwaveStates = Object.values(BRAINWAVE_STATES);

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
          Brainwave Navigator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Explore and tune your mental state
        </p>
      </div>

      {/* State Selector */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
        overflowX: 'auto',
        paddingBottom: 'var(--spacing-sm)'
      }}>
        {brainwaveStates.map((state) => (
          <motion.button
            key={state.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStateSelect(state)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: selectedState.id === state.id ? state.gradient : 'var(--bg-secondary)',
              border: `1px solid ${selectedState.id === state.id ? 'transparent' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              color: selectedState.id === state.id ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            {state.name}
          </motion.button>
        ))}
      </div>

      {/* Selected State Card */}
      <Card
        variant="glass"
        padding="lg"
        glowColor={selectedState.color}
        style={{ marginBottom: 'var(--spacing-xl)' }}
      >
        {/* Visualization */}
        <div style={{
          marginBottom: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-primary)'
        }}>
          <WaveformVisualizer
            frequency={frequency}
            isPlaying={isPlaying}
            brainwaveType={selectedState.id}
            size="full"
          />
        </div>

        {/* Frequency Display & Control */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            background: selectedState.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {frequency.toFixed(1)} Hz
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginTop: 'var(--spacing-xs)'
          }}>
            {selectedState.name} Wave ({selectedState.range[0]}-{selectedState.range[1]} Hz)
          </div>
        </div>

        {/* Frequency Slider */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <Slider
            value={frequency}
            min={selectedState.range[0]}
            max={selectedState.range[1]}
            step={0.1}
            onChange={handleFrequencyChange}
            color={selectedState.color}
            showValue={false}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: 'var(--spacing-xs)'
          }}>
            <span>{selectedState.range[0]} Hz</span>
            <span>{selectedState.range[1]} Hz</span>
          </div>
        </div>

        {/* Play Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          glow={isPlaying}
          icon={<Play size={20} fill={isPlaying ? 'transparent' : 'white'} />}
          onClick={handlePlayToggle}
          style={{
            background: isPlaying ? 'var(--bg-tertiary)' : selectedState.gradient
          }}
        >
          {isPlaying ? 'Stop' : 'Start Session'}
        </Button>
      </Card>

      {/* Info Accordion */}
      <Card variant="default" padding="none">
        <motion.button
          onClick={() => setExpandedInfo(!expandedInfo)}
          style={{
            width: '100%',
            padding: 'var(--spacing-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Info size={18} color={selectedState.color} />
            <span style={{ fontWeight: 500 }}>About {selectedState.name} Waves</span>
          </div>
          {expandedInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.button>

        <AnimatePresence>
          {expandedInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                padding: 'var(--spacing-md)',
                paddingTop: 0,
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--spacing-lg)',
                  lineHeight: 1.6
                }}>
                  {selectedState.description}
                </p>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-sm)',
                    color: selectedState.color
                  }}>
                    Benefits
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-xs)'
                  }}>
                    {selectedState.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        style={{
                          padding: '4px 10px',
                          background: `${selectedState.color}20`,
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          color: selectedState.color
                        }}
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <h4 style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    Best For
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-xs)'
                  }}>
                    {selectedState.useCases.map((useCase, i) => (
                      <li
                        key={i}
                        style={{
                          padding: '4px 10px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <Clock size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Recommended: {selectedState.recommendedDuration.optimal} min
                    ({selectedState.recommendedDuration.min}-{selectedState.recommendedDuration.max} min range)
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
