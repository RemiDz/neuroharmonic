// NeuroHarmonic - Main Application
// A revolutionary sound healing & ADHD support experience

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigation, SettingsButton } from './components/ui/Navigation';
import { SessionPlayer } from './components/session/SessionPlayer';
import { HomePage } from './pages/HomePage';
import { BrainwavesPage } from './pages/BrainwavesPage';
import { ProtocolsPage } from './pages/ProtocolsPage';
import { ADHDPage } from './pages/ADHDPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SettingsPage } from './pages/SettingsPage';
import type { HealingProtocol } from './data/protocols';
import './styles/globals.css';

type Page = 'home' | 'brainwaves' | 'protocols' | 'adhd' | 'playground';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeProtocol, setActiveProtocol] = useState<HealingProtocol | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSelectProtocol = useCallback((protocol: HealingProtocol) => {
    setActiveProtocol(protocol);
  }, []);

  const handleCloseSession = useCallback(() => {
    setActiveProtocol(null);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as Page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onSelectProtocol={handleSelectProtocol} 
            onNavigate={handleNavigate}
          />
        );
      case 'brainwaves':
        return <BrainwavesPage />;
      case 'protocols':
        return <ProtocolsPage onSelectProtocol={handleSelectProtocol} />;
      case 'adhd':
        return <ADHDPage onSelectProtocol={handleSelectProtocol} />;
      case 'playground':
        return <PlaygroundPage />;
      default:
        return <HomePage onSelectProtocol={handleSelectProtocol} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      position: 'relative'
    }}>
      {/* Sacred geometry background pattern */}
      <div className="sacred-pattern" />

      {/* Settings Button */}
      <SettingsButton onClick={() => setShowSettings(true)} />

      {/* Main Content */}
      <main style={{ 
        paddingTop: 'var(--spacing-lg)',
        minHeight: '100vh'
      }}>
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <Navigation 
        activeItem={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Session Player Overlay */}
      <AnimatePresence>
        {activeProtocol && (
          <SessionPlayer 
            protocol={activeProtocol} 
            onClose={handleCloseSession}
          />
        )}
      </AnimatePresence>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPage onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
