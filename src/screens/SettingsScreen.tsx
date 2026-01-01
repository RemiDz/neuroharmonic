// NeuroHarmonic - Settings Screen

import { motion } from 'framer-motion';
import { Volume2, Accessibility, Info, Flame, Clock, Target } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Slider } from '../components/ui/Slider';
import { useAppStore } from '../stores/appStore';
import { CARRIER_FREQUENCIES } from '../data/frequencies';

export function SettingsScreen() {
  const {
    masterVolume,
    setMasterVolume,
    carrierFrequency,
    setCarrierFrequency,
    visualIntensity,
    setVisualIntensity,
    reducedMotion,
    setReducedMotion,
    currentStreak,
    longestStreak,
    totalMinutes,
    pomodorosCompleted
  } = useAppStore();

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
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Customize your experience
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {/* Journey Stats */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-md)'
          }}>
            Your Journey
          </h2>

          <Card variant="glass" padding="lg">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-lg)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  <Flame size={18} color="var(--accent-amber)" />
                  <span style={{
                    fontSize: '1.75rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--accent-amber)'
                  }}>
                    {currentStreak}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Current Streak
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  <Target size={18} color="var(--accent-violet)" />
                  <span style={{
                    fontSize: '1.75rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--accent-violet)'
                  }}>
                    {longestStreak}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Best Streak
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  <Clock size={18} color="var(--accent-cyan)" />
                  <span style={{
                    fontSize: '1.75rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)'
                  }}>
                    {totalMinutes}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Minutes
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  <span style={{ fontSize: '1.1rem' }}>🍅</span>
                  <span style={{
                    fontSize: '1.75rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)'
                  }}>
                    {pomodorosCompleted}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Focus Sessions
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Audio Settings */}
        <section>
          <h2 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 'var(--space-md)'
          }}>
            Audio
          </h2>

          <Card variant="default" padding="lg">
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <Slider
                value={masterVolume}
                min={0}
                max={1}
                step={0.01}
                onChange={setMasterVolume}
                label="Default Volume"
                formatValue={(v: number) => `${Math.round(v * 100)}%`}
                color="var(--accent-cyan)"
              />
            </div>

            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-md)'
              }}>
                <Volume2 size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  Preferred Carrier Frequency
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--space-xs)'
              }}>
                {CARRIER_FREQUENCIES.map((cf) => (
                  <button
                    key={cf.hz}
                    onClick={() => setCarrierFrequency(cf.hz)}
                    style={{
                      padding: '8px 14px',
                      background: carrierFrequency === cf.hz ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                      color: carrierFrequency === cf.hz ? '#000' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: carrierFrequency === cf.hz ? 600 : 400
                    }}
                  >
                    {cf.hz} Hz
                  </button>
                ))}
              </div>
              
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginTop: 'var(--space-sm)'
              }}>
                {CARRIER_FREQUENCIES.find(cf => cf.hz === carrierFrequency)?.quality}
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
            marginBottom: 'var(--space-md)'
          }}>
            Visuals
          </h2>

          <Card variant="default" padding="lg">
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <Slider
                value={visualIntensity}
                min={0}
                max={1}
                step={0.01}
                onChange={setVisualIntensity}
                label="Visual Intensity"
                formatValue={(v: number) => `${Math.round(v * 100)}%`}
                color="var(--accent-magenta)"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-sm) 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <Accessibility size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '0.9rem' }}>Reduced Motion</span>
              </div>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                  width: 52,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  background: reducedMotion ? 'var(--accent-cyan)' : 'var(--bg-elevated)',
                  border: 'none',
                  position: 'relative',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <motion.div
                  animate={{ x: reducedMotion ? 24 : 2 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: 2,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
              </button>
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
            marginBottom: 'var(--space-md)'
          }}>
            About
          </h2>

          <Card variant="glass" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>
                🧠✨
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                marginBottom: 'var(--space-xs)',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-magenta))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                NeuroHarmonic
              </h3>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: 'var(--space-lg)'
              }}>
                Sound Healing & ADHD Support
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.6
              }}>
                Combining cutting-edge neuroscience with ancient wisdom
                to help you heal, focus, and thrive.
              </p>
              <div style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-sm)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Version 2.0.0 • Made with 💜
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
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <Info size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h4 style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: '#EF4444',
                marginBottom: 'var(--space-xs)'
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
    </div>
  );
}
