// NeuroHarmonic - Audio Engine Hook

import { useCallback, useEffect, useState } from 'react';
import { audioEngine, AudioEngineConfig } from '../audio/AudioEngine';
import { sessionEngine, SessionState, SessionProgress } from '../audio/SessionEngine';
import { HealingProtocol, ProtocolPhase } from '../data/protocols';
import { useSessionStore } from '../stores/sessionStore';

export function useAudioEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<AudioEngineConfig | null>(null);
  
  const { masterVolume, setCurrentProtocol, setSessionState, setProgress } = useSessionStore();

  const start = useCallback(async (config: Partial<AudioEngineConfig>) => {
    const fullConfig = {
      ...config,
      volume: config.volume ?? masterVolume
    };
    await audioEngine.start(fullConfig);
    setIsPlaying(true);
    setCurrentConfig(audioEngine.getCurrentConfig());
  }, [masterVolume]);

  const stop = useCallback(async () => {
    await audioEngine.stop();
    setIsPlaying(false);
    setCurrentConfig(null);
  }, []);

  const morphTo = useCallback(async (config: Partial<AudioEngineConfig>, durationMs?: number) => {
    await audioEngine.morphTo(config, durationMs);
    setCurrentConfig(audioEngine.getCurrentConfig());
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
    setCurrentConfig(audioEngine.getCurrentConfig());
  }, []);

  const breathSync = useCallback(async (isInhale: boolean, durationMs: number) => {
    await audioEngine.breathSync(isInhale, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  return {
    isPlaying,
    currentConfig,
    start,
    stop,
    morphTo,
    setVolume,
    breathSync
  };
}

export function useSessionEngine() {
  const [state, setState] = useState<SessionState>('idle');
  const [progress, setProgress] = useState<SessionProgress | null>(null);
  const [currentPhase, setCurrentPhase] = useState<ProtocolPhase | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  
  const store = useSessionStore();

  useEffect(() => {
    sessionEngine.setCallbacks({
      onStateChange: (newState) => {
        setState(newState);
        store.setSessionState(newState);
      },
      onProgressUpdate: (newProgress) => {
        setProgress(newProgress);
        store.setProgress(newProgress);
      },
      onPhaseChange: (phase, index) => {
        setCurrentPhase(phase);
        setPhaseIndex(index);
      },
      onComplete: () => {
        const protocol = sessionEngine.getCurrentProtocol();
        if (protocol) {
          store.addSessionToHistory({
            protocolId: protocol.id,
            protocolName: protocol.name,
            completedAt: Date.now(),
            duration: protocol.duration,
            category: protocol.category
          });
          store.updateStreak();
        }
      }
    });
  }, [store]);

  const startSession = useCallback(async (protocol: HealingProtocol) => {
    store.setCurrentProtocol(protocol);
    await sessionEngine.startSession(protocol);
  }, [store]);

  const pause = useCallback(async () => {
    await sessionEngine.pause();
  }, []);

  const resume = useCallback(async () => {
    await sessionEngine.resume();
  }, []);

  const stop = useCallback(async () => {
    await sessionEngine.stop();
    store.setCurrentProtocol(null);
    store.setProgress(null);
  }, [store]);

  return {
    state,
    progress,
    currentPhase,
    phaseIndex,
    startSession,
    pause,
    resume,
    stop,
    currentProtocol: sessionEngine.getCurrentProtocol()
  };
}
