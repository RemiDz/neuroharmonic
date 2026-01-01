// NeuroHarmonic - Healing Protocols Screen

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Search, X } from 'lucide-react';
import { HEALING_PROTOCOLS, type HealingProtocol, getProtocolsByCategory } from '../data/protocols';
import { Card } from '../components/ui/Card';
import { SessionPlayer } from '../components/session/SessionPlayer';

type Category = HealingProtocol['category'] | 'all';

const categories: Array<{ id: Category; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'emotional', label: 'Emotional', icon: '💗' },
  { id: 'physical', label: 'Physical', icon: '🌿' },
  { id: 'cognitive', label: 'Cognitive', icon: '🧠' },
  { id: 'spiritual', label: 'Spiritual', icon: '🧘' },
  { id: 'adhd', label: 'Focus', icon: '⚡' }
];

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function HealingScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProtocol, setActiveProtocol] = useState<HealingProtocol | null>(null);

  let protocols = activeCategory === 'all' 
    ? HEALING_PROTOCOLS 
    : getProtocolsByCategory(activeCategory);

  // Filter by search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    protocols = protocols.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.benefits.some(b => b.toLowerCase().includes(query))
    );
  }

  // Group by subcategory
  const groupedProtocols = protocols.reduce((acc, protocol) => {
    const key = protocol.subcategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(protocol);
    return acc;
  }, {} as Record<string, HealingProtocol[]>);

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
          Healing Protocols
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Curated sessions for transformation
        </p>
      </motion.div>

      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: 'var(--space-lg)'
      }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input
          type="text"
          placeholder="Search protocols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-md)',
            paddingLeft: 48,
            paddingRight: searchQuery ? 48 : 'var(--space-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-xl)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-sm)',
        marginRight: '-var(--space-lg)',
        paddingRight: 'var(--space-lg)'
      }}>
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-xs)',
              padding: '8px 16px',
              background: activeCategory === cat.id ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: activeCategory === cat.id ? '#000' : 'var(--text-secondary)',
              fontWeight: activeCategory === cat.id ? 600 : 400,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Protocols List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {Object.entries(groupedProtocols).map(([subcategory, subProtocols]) => (
          <div key={subcategory}>
            <h2 style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-md)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {subcategory}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {subProtocols.map((protocol, index) => (
                <motion.div
                  key={protocol.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    variant="default"
                    padding="md"
                    interactive
                    onClick={() => setActiveProtocol(protocol)}
                  >
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                      {/* Icon */}
                      <div style={{
                        width: 52,
                        height: 52,
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
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
                          {protocol.name}
                        </h3>
                        <p style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginBottom: 8,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {protocol.description}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-md)',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={12} />
                            {formatDuration(protocol.duration)}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            background: 'var(--bg-elevated)',
                            borderRadius: 'var(--radius-full)',
                            textTransform: 'capitalize'
                          }}>
                            {protocol.intensity}
                          </span>
                        </div>
                      </div>

                      {/* Play */}
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: protocol.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        alignSelf: 'center'
                      }}>
                        <Play size={16} fill="white" color="white" style={{ marginLeft: 2 }} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {protocols.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-2xl)',
            color: 'var(--text-muted)'
          }}>
            No protocols found
          </div>
        )}
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
