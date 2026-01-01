// NeuroHarmonic - Main Application
// Revolutionary Sound Healing & ADHD Support

import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from './stores/appStore';
import { BottomNav } from './components/ui/BottomNav';
import { StatesScreen } from './screens/StatesScreen';
import { HealingScreen } from './screens/HealingScreen';
import { FocusScreen } from './screens/FocusScreen';
import { CreateScreen } from './screens/CreateScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import './styles/globals.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

function App() {
  const { currentScreen } = useAppStore();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'states':
        return <StatesScreen />;
      case 'healing':
        return <HealingScreen />;
      case 'focus':
        return <FocusScreen />;
      case 'create':
        return <CreateScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <StatesScreen />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      {/* Main Content */}
      <main style={{ 
        paddingTop: 'max(var(--space-lg), env(safe-area-inset-top))',
        paddingBottom: 'calc(var(--nav-height) + var(--space-lg))',
        minHeight: '100vh'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default App;
