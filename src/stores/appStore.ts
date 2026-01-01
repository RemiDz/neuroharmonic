// NeuroHarmonic - Global Application State (Zustand)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HealingProtocol } from '../data/protocols';

export type Screen = 'states' | 'healing' | 'focus' | 'create' | 'settings';

export interface SessionHistoryEntry {
  id: string;
  protocolId: string;
  protocolName: string;
  completedAt: number;
  duration: number;
  category: string;
}

interface AppState {
  // Navigation
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  
  // Active session
  activeProtocol: HealingProtocol | null;
  setActiveProtocol: (protocol: HealingProtocol | null) => void;
  isSessionActive: boolean;
  setSessionActive: (active: boolean) => void;
  sessionProgress: number; // 0-1
  setSessionProgress: (progress: number) => void;
  
  // Audio settings
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  carrierFrequency: number;
  setCarrierFrequency: (freq: number) => void;
  noiseVolume: number;
  setNoiseVolume: (volume: number) => void;
  
  // Visual settings
  visualizationType: 'waveform' | 'particles' | 'mandala' | 'aurora' | 'cosmic' | 'none';
  setVisualizationType: (type: AppState['visualizationType']) => void;
  visualIntensity: number; // 0-1
  setVisualIntensity: (intensity: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  
  // Session history & streaks
  sessionHistory: SessionHistoryEntry[];
  addSessionToHistory: (entry: Omit<SessionHistoryEntry, 'id'>) => void;
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  updateStreak: () => void;
  totalMinutes: number;
  
  // Pomodoro state
  pomodorosCompleted: number;
  incrementPomodoros: () => void;
  resetPomodoros: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentScreen: 'states',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      
      // Active session
      activeProtocol: null,
      setActiveProtocol: (protocol) => set({ activeProtocol: protocol }),
      isSessionActive: false,
      setSessionActive: (active) => set({ isSessionActive: active }),
      sessionProgress: 0,
      setSessionProgress: (progress) => set({ sessionProgress: progress }),
      
      // Audio settings
      masterVolume: 0.5,
      setMasterVolume: (volume) => set({ masterVolume: volume }),
      carrierFrequency: 200,
      setCarrierFrequency: (freq) => set({ carrierFrequency: freq }),
      noiseVolume: 0.3,
      setNoiseVolume: (volume) => set({ noiseVolume: volume }),
      
      // Visual settings
      visualizationType: 'particles',
      setVisualizationType: (type) => set({ visualizationType: type }),
      visualIntensity: 0.7,
      setVisualIntensity: (intensity) => set({ visualIntensity: intensity }),
      reducedMotion: false,
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      
      // Session history
      sessionHistory: [],
      addSessionToHistory: (entry) => set((state) => ({
        sessionHistory: [
          { ...entry, id: crypto.randomUUID() },
          ...state.sessionHistory.slice(0, 99) // Keep last 100
        ],
        totalMinutes: state.totalMinutes + Math.round(entry.duration / 60)
      })),
      
      // Streaks
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      totalMinutes: 0,
      
      updateStreak: () => {
        const today = getToday();
        const { lastSessionDate, currentStreak, longestStreak } = get();
        
        if (lastSessionDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak: number;
        if (lastSessionDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1;
        }
        
        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastSessionDate: today
        });
      },
      
      // Pomodoro
      pomodorosCompleted: 0,
      incrementPomodoros: () => set((state) => ({ pomodorosCompleted: state.pomodorosCompleted + 1 })),
      resetPomodoros: () => set({ pomodorosCompleted: 0 })
    }),
    {
      name: 'neuroharmonic-storage',
      partialize: (state) => ({
        masterVolume: state.masterVolume,
        carrierFrequency: state.carrierFrequency,
        noiseVolume: state.noiseVolume,
        visualizationType: state.visualizationType,
        visualIntensity: state.visualIntensity,
        reducedMotion: state.reducedMotion,
        sessionHistory: state.sessionHistory,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastSessionDate: state.lastSessionDate,
        totalMinutes: state.totalMinutes,
        pomodorosCompleted: state.pomodorosCompleted
      })
    }
  )
);
