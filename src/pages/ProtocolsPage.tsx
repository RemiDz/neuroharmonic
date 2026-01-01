// NeuroHarmonic - Healing Protocols Library Page

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { HEALING_PROTOCOLS, HealingProtocol, getProtocolsByCategory } from '../data/protocols';

interface ProtocolsPageProps {
  onSelectProtocol: (protocol: HealingProtocol) => void;
}

type Category = HealingProtocol['category'] | 'all';

const categories: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'emotional', label: 'Emotional', icon: '💗' },
  { id: 'physical', label: 'Physical', icon: '🌿' },
  { id: 'cognitive', label: 'Cognitive', icon: '🧠' },
  { id: 'spiritual', label: 'Spiritual', icon: '🧘' },
  { id: 'adhd', label: 'ADHD', icon: '⚡' }
];

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
}

export function ProtocolsPage({ onSelectProtocol }: ProtocolsPageProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const protocols = activeCategory === 'all' 
    ? HEALING_PROTOCOLS 
    : getProtocolsByCategory(activeCategory);

  // Group protocols by subcategory
  const groupedProtocols = protocols.reduce((acc, protocol) => {
    const key = protocol.subcategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(protocol);
    return acc;
  }, {} as Record<string, HealingProtocol[]>);

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
          Healing Protocols
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Curated sessions for deep transformation
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
        overflowX: 'auto',
        paddingBottom: 'var(--spacing-sm)',
        marginRight: 'calc(-1 * var(--spacing-lg))',
        paddingRight: 'var(--spacing-lg)'
      }}>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              background: activeCategory === cat.id ? 'var(--accent-violet)' : 'var(--bg-secondary)',
              border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-full)',
              color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Protocols List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {Object.entries(groupedProtocols).map(([subcategory, subProtocols]) => (
          <div key={subcategory}>
            <h2 style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 'var(--spacing-md)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {subcategory}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <AnimatePresence mode="popLayout">
                {subProtocols.map((protocol, index) => (
                  <motion.div
                    key={protocol.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      variant="default"
                      padding="none"
                      interactive
                      onClick={() => onSelectProtocol(protocol)}
                    >
                      <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)'
                      }}>
                        {/* Icon */}
                        <div style={{
                          width: 56,
                          height: 56,
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

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            {protocol.name}
                          </h3>
                          
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--spacing-sm)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {protocol.description}
                          </p>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                          }}>
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <Clock size={12} />
                              {formatDuration(protocol.duration)}
                            </span>
                            
                            <span style={{
                              padding: '2px 8px',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-full)',
                              textTransform: 'capitalize'
                            }}>
                              {protocol.intensity}
                            </span>
                            
                            {protocol.bestTimeOfDay && protocol.bestTimeOfDay !== 'anytime' && (
                              <span style={{
                                padding: '2px 8px',
                                background: `${protocol.color}20`,
                                color: protocol.color,
                                borderRadius: 'var(--radius-full)',
                                textTransform: 'capitalize'
                              }}>
                                {protocol.bestTimeOfDay}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Play Button */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: protocol.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <Play size={16} fill="white" style={{ marginLeft: 2 }} />
                          </div>
                        </div>
                      </div>

                      {/* Benefits Tags */}
                      <div style={{
                        padding: '0 var(--spacing-md) var(--spacing-md)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--spacing-xs)'
                      }}>
                        {protocol.benefits.slice(0, 3).map((benefit, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '3px 8px',
                              background: 'var(--bg-tertiary)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
