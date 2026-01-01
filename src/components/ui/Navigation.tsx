// NeuroHarmonic - Bottom Navigation Component

import { motion } from 'framer-motion';
import { 
  Home, 
  Brain, 
  Heart, 
  Zap, 
  Sparkles,
  Settings
} from 'lucide-react';

type NavItem = 'home' | 'brainwaves' | 'protocols' | 'adhd' | 'playground' | 'settings';

interface NavigationProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
}

const navItems: Array<{ id: NavItem; icon: typeof Home; label: string }> = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'brainwaves', icon: Brain, label: 'Brainwaves' },
  { id: 'protocols', icon: Heart, label: 'Healing' },
  { id: 'adhd', icon: Zap, label: 'Focus' },
  { id: 'playground', icon: Sparkles, label: 'Play' }
];

export function Navigation({ activeItem, onNavigate }: NavigationProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, var(--bg-primary) 0%, var(--bg-glass) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        paddingBottom: 'max(var(--spacing-sm), env(safe-area-inset-bottom))',
        zIndex: 100
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '500px',
          margin: '0 auto'
        }}
      >
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeItem === id;
          
          return (
            <motion.button
              key={id}
              onClick={() => onNavigate(id)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: 'var(--spacing-sm)',
                minWidth: '60px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)'
                  }}
                />
              )}
              
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={22} />
              </motion.div>
              
              <motion.span
                animate={{
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
                style={{
                  fontSize: '0.65rem',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {label}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        top: 'var(--spacing-md)',
        right: 'var(--spacing-md)',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-secondary)',
        zIndex: 50
      }}
    >
      <Settings size={20} />
    </motion.button>
  );
}
