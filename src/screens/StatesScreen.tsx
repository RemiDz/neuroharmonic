// NeuroHarmonic - Brainwave States Screen

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronRight, Clock } from 'lucide-react';
import { BRAINWAVE_STATES, type BrainwaveState, type BrainwavePreset } from '../data/frequencies';
import { Card } from '../components/ui/Card';
import { WaveformDisplay } from '../components/visualizers/WaveformDisplay';
import { SessionPlayer } from '../components/session/SessionPlayer';
import type { HealingProtocol } from '../data/protocols';

function createProtocolFromPreset(state: BrainwaveState, preset: BrainwavePreset): HealingProtocol {
  return {
    id: `${state.id}-${preset.id}`,
    name: preset.name,
    category: 'cognitive',
    subcategory: state.name,
    icon: state.icon,
    description: preset.description,
    benefits: state.benefits.slice(0, 4),
    duration: preset.duration * 60,
    phases: [
      { name: 'Ramp Up', duration: 120, beatFrequency: (preset.frequency + 10) / 2, solfeggioLayers: preset.solfeggioLayers },
      { name: state.name, duration: (preset.duration * 60) - 180, beatFrequency: preset.frequency, solfeggioLayers: preset.solfeggioLayers },
      { name: 'Wind Down', duration: 60, beatFrequency: 10, solfeggioLayers: preset.solfeggioLayers }
    ],
    color: state.color,
    gradient: state.gradient,
    timeOfDay: 'anytime',
    intensity: 'moderate'
  };
}

export function StatesScreen() {
  const [selectedState, setSelectedState] = useState<BrainwaveState | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<HealingProtocol | null>(null);
  
  const states = Object.values(BRAINWAVE_STATES);

  const handlePresetSelect = (state: BrainwaveState, preset: BrainwavePreset) => {
    const protocol = createProtocolFromPreset(state, preset);
    setActiveProtocol(protocol);
  };

  return (
    <div style={{ padding: 'var(--space-lg)', paddingBottom: 100 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-xl)' }}
      >
        <h1 style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--space-xs)'
        }}>
          Brainwave States
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Select a state to tune your mind
        </p>
      </motion.div>

      {/* State Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {states.map((state, index) => (
          <motion.div
            key={state.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              variant="default"
              padding="none"
              interactive
              onClick={() => setSelectedState(selectedState?.id === state.id ? null : state)}
              glowColor={selectedState?.id === state.id ? state.color : undefined}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: 'var(--space-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)'
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    background: state.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}
                >
                  {state.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {state.name}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      color: state.color,
                      background: `${state.color}20`,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {state.range[0]}-{state.range[1]} Hz
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginTop: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {state.benefits.slice(0, 2).join(' • ')}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ rotate: selectedState?.id === state.id ? 90 : 0 }}
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ChevronRight size={22} />
                </motion.div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {selectedState?.id === state.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: 'var(--space-lg)',
                      paddingTop: 0,
                      borderTop: '1px solid var(--border-subtle)'
                    }}>
                      {/* Waveform Preview */}
                      <div style={{
                        marginBottom: 'var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: 'var(--bg-primary)'
                      }}>
                        <WaveformDisplay
                          isPlaying={false}
                          frequency={state.defaultFrequency}
                          color={state.color}
                          height={80}
                        />
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: 'var(--space-lg)'
                      }}>
                        {state.description}
                      </p>

                      {/* Presets */}
                      <h4 style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        marginBottom: 'var(--space-md)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Quick Sessions
                      </h4>
                      
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-sm)'
                      }}>
                        {state.presets.map((preset) => (
                          <motion.button
                            key={preset.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePresetSelect(state, preset);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: 'var(--space-md)',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 500, marginBottom: 2 }}>
                                {preset.name}
                              </div>
                              <div style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-xs)'
                              }}>
                                <Clock size={12} />
                                {preset.duration} min • {preset.frequency} Hz
                              </div>
                            </div>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: state.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Play size={16} fill="white" color="white" style={{ marginLeft: 2 }} />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

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
