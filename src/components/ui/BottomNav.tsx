// NeuroHarmonic - Bottom Navigation Bar

import { motion } from 'framer-motion';
import { Brain, Heart, Target, Palette, Settings } from 'lucide-react';
import { useAppStore, type Screen } from '../../stores/appStore';

const navItems: Array<{ id: Screen; icon: typeof Brain; label: string }> = [
  { id: 'states', icon: Brain, label: 'States' },
  { id: 'healing', icon: Heart, label: 'Healing' },
  { id: 'focus', icon: Target, label: 'Focus' },
  { id: 'create', icon: Palette, label: 'Create' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

export function BottomNav() {
  const { currentScreen, setCurrentScreen } = useAppStore();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 100,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          maxWidth: 500,
          margin: '0 auto',
          padding: '0 8px'
        }}
      >
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = currentScreen === id;
          
          return (
            <motion.button
              key={id}
              onClick={() => setCurrentScreen(id)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 12px',
                minWidth: 60,
                borderRadius: 'var(--radius-lg)',
                background: isActive ? 'rgba(0, 255, 209, 0.1)' : 'transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              <motion.span
                animate={{
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400
                }}
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.02em'
                }}
              >
                {label}
              </motion.span>
              
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent-cyan)',
                    boxShadow: '0 0 8px var(--glow-cyan)'
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
