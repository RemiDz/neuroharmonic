// NeuroHarmonic - Settings Page

import { motion } from 'framer-motion';
import { 
  Volume2, Eye, Moon, Accessibility, 
  Smartphone, Info, ChevronRight, X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { useSessionStore } from '../stores/sessionStore';
import { CARRIER_FREQUENCIES } from '../data/frequencies';

interface SettingsPageProps {
  onClose: () => void;
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const {
    masterVolume,
    setMasterVolume,
    visualIntensity,
    setVisualIntensity,
    preferredCarrierFrequency,
    setPreferredCarrierFrequency,
    reducedMotion,
    setReducedMotion,
    darkMode,
    setDarkMode,
    currentStreak,
    longestStreak,
    totalMinutes,
    sessionHistory
  } = useSessionStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        zIndex: 200,
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--spacing-lg)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <h1 style={{
          fontSize: '1.25rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 600
        }}>
          Settings
        </h1>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={20} />
        </motion.button>
      </div>

      <div style={{
        padding: 'var(--spacing-lg)',
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}>
        {/* Audio Settings */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-md)'
          }}>
            Audio
          </h2>

          <Card variant="default" padding="md">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <Slider
                value={masterVolume}
                min={0}
                max={1}
                step={0.01}
                onChange={setMasterVolume}
                label="Default Volume"
                formatValue={(v) => `${Math.round(v * 100)}%`}
                color="var(--accent-cyan)"
              />
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Preferred Carrier Frequency
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-xs)'
              }}>
                {CARRIER_FREQUENCIES.map((cf) => (
                  <button
                    key={cf.hz}
                    onClick={() => setPreferredCarrierFrequency(cf.hz)}
                    style={{
                      padding: '6px 12px',
                      background: preferredCarrierFrequency === cf.hz 
                        ? 'var(--accent-violet)' 
                        : 'var(--bg-tertiary)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      color: preferredCarrierFrequency === cf.hz 
                        ? 'white' 
                        : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}
                  >
                    {cf.hz} Hz
                  </button>
                ))}
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: 'var(--spacing-sm)'
              }}>
                {CARRIER_FREQUENCIES.find(cf => cf.hz === preferredCarrierFrequency)?.quality}
              </p>
            </div>
          </Card>
        </section>

        {/* Visual Settings */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-md)'
          }}>
            Visual
          </h2>

          <Card variant="default" padding="md">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <Slider
                value={visualIntensity}
                min={0}
                max={1}
                step={0.01}
                onChange={setVisualIntensity}
                label="Visual Intensity"
                formatValue={(v) => `${Math.round(v * 100)}%`}
                color="var(--accent-magenta)"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--spacing-sm) 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Accessibility size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.9rem' }}>Reduced Motion</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  background: reducedMotion ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <motion.div
                  animate={{ x: reducedMotion ? 20 : 0 }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: 2,
                    left: 2
                  }}
                />
              </button>
            </div>
          </Card>
        </section>

        {/* Statistics */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-md)'
          }}>
            Your Journey
          </h2>

          <Card variant="glass" padding="md">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-amber)'
                }}>
                  {currentStreak}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Current Streak
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-violet)'
                }}>
                  {longestStreak}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Best Streak
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)'
                }}>
                  {totalMinutes}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Minutes
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-emerald)'
                }}>
                  {sessionHistory.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sessions
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* About */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--spacing-md)'
          }}>
            About
          </h2>

          <Card variant="default" padding="md">
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: 'var(--spacing-sm)'
              }}>
                🧠✨
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                NeuroHarmonic
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                marginBottom: 'var(--spacing-md)'
              }}>
                Sound Healing & ADHD Support
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                lineHeight: 1.6
              }}>
                Combining cutting-edge neuroscience with ancient wisdom 
                to help you heal, focus, and thrive.
              </p>
              <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Version 1.0.0 • Made with 💜
              </div>
            </div>
          </Card>
        </section>

        {/* Safety Notice */}
        <Card 
          variant="default" 
          padding="md"
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <Info size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#ef4444',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Safety Notice
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Binaural beats and isochronic tones should not be used by those with 
                epilepsy or a history of seizures. Consult a healthcare provider if you 
                have concerns. This app is not a substitute for medical treatment.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
