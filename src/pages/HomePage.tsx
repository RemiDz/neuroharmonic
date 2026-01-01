// NeuroHarmonic - Home Page
// The welcoming gateway to healing

import { motion } from 'framer-motion';
import { Play, Clock, Flame, Sparkles, Brain, Heart, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useSessionStore } from '../stores/sessionStore';
import { HEALING_PROTOCOLS, getMicroSessions, getProtocolsByTimeOfDay } from '../data/protocols';
import type { HealingProtocol } from '../data/protocols';

interface HomePageProps {
  onSelectProtocol: (protocol: HealingProtocol) => void;
  onNavigate: (page: string) => void;
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getGreeting(): string {
  const time = getTimeOfDay();
  switch (time) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Welcome back';
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function HomePage({ onSelectProtocol, onNavigate }: HomePageProps) {
  const { currentStreak, totalMinutes, sessionHistory } = useSessionStore();
  
  const timeOfDay = getTimeOfDay();
  const recommendedProtocols = getProtocolsByTimeOfDay(timeOfDay).slice(0, 3);
  const microSessions = getMicroSessions();
  
  const quickActions = [
    { id: 'focus-boost', icon: Zap, label: 'Quick Focus', color: '#f59e0b' },
    { id: 'overwhelm-reset', icon: Heart, label: 'Calm Reset', color: '#06b6d4' },
    { id: 'energy-restore', icon: Sparkles, label: 'Energy Boost', color: '#10b981' }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{
        padding: 'var(--spacing-lg)',
        paddingBottom: 'calc(80px + var(--spacing-lg))',
        maxWidth: 600,
        margin: '0 auto'
      }}
    >
      {/* Header */}
      <motion.div variants={staggerItem} style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontFamily: 'var(--font-display)',
          marginBottom: 'var(--spacing-xs)'
        }}>
          {getGreeting()} ✨
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Ready to tune your mind?
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={staggerItem}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <Card variant="glass" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Flame size={16} color="var(--accent-amber)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem' }}>
              {currentStreak}
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Day Streak
          </div>
        </Card>
        
        <Card variant="glass" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Clock size={16} color="var(--accent-cyan)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem' }}>
              {totalMinutes}
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Total Minutes
          </div>
        </Card>
        
        <Card variant="glass" padding="md" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Brain size={16} color="var(--accent-violet)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem' }}>
              {sessionHistory.length}
            </span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Sessions
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem} style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)'
        }}>
          Quick Start
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--spacing-md)'
        }}>
          {quickActions.map(({ id, icon: Icon, label, color }) => {
            const protocol = HEALING_PROTOCOLS.find(p => p.id === id);
            if (!protocol) return null;
            
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectProtocol(protocol)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `${color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={color} />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {formatDuration(protocol.duration)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recommended for You */}
      <motion.div variants={staggerItem} style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)'
        }}>
          Recommended for {timeOfDay === 'night' ? 'Tonight' : `This ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {recommendedProtocols.map((protocol) => (
            <Card
              key={protocol.id}
              variant="default"
              padding="md"
              interactive
              onClick={() => onSelectProtocol(protocol)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)'
              }}
            >
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: protocol.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {protocol.icon}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  marginBottom: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {protocol.name}
                </h3>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {protocol.subcategory} • {formatDuration(protocol.duration)}
                </p>
              </div>
              
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Play size={14} fill="currentColor" style={{ marginLeft: 2 }} />
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Micro Sessions */}
      <motion.div variants={staggerItem}>
        <h2 style={{
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: 'var(--spacing-md)',
          color: 'var(--text-secondary)'
        }}>
          Frequency Shots • 1-5 min
        </h2>
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          overflowX: 'auto',
          paddingBottom: 'var(--spacing-sm)',
          marginRight: 'calc(-1 * var(--spacing-lg))',
          paddingRight: 'var(--spacing-lg)'
        }}>
          {microSessions.map((protocol) => (
            <motion.button
              key={protocol.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProtocol(protocol)}
              style={{
                minWidth: 140,
                padding: 'var(--spacing-md)',
                background: protocol.gradient,
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>
                {protocol.icon}
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'white',
                marginBottom: 2
              }}>
                {protocol.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                {formatDuration(protocol.duration)}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
