// NeuroHarmonic - Session State Management with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HealingProtocol } from '../data/protocols';
import { SessionState, SessionProgress } from '../audio/SessionEngine';

interface SessionHistoryEntry {
  protocolId: string;
  protocolName: string;
  completedAt: number;
  duration: number;
  category: string;
}

interface SessionStore {
  // Current session
  currentProtocol: HealingProtocol | null;
  sessionState: SessionState;
  progress: SessionProgress | null;
  intention: string;
  
  // History & streaks
  sessionHistory: SessionHistoryEntry[];
  currentStreak: number;
  longestStreak: number;
  lastSessionDate: string | null;
  totalMinutes: number;
  
  // User preferences
  preferredCarrierFrequency: number;
  masterVolume: number;
  visualIntensity: number; // 0-1
  reducedMotion: boolean;
  darkMode: boolean;
  
  // Actions
  setCurrentProtocol: (protocol: HealingProtocol | null) => void;
  setSessionState: (state: SessionState) => void;
  setProgress: (progress: SessionProgress | null) => void;
  setIntention: (intention: string) => void;
  
  addSessionToHistory: (entry: SessionHistoryEntry) => void;
  updateStreak: () => void;
  
  setPreferredCarrierFrequency: (freq: number) => void;
  setMasterVolume: (volume: number) => void;
  setVisualIntensity: (intensity: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setDarkMode: (dark: boolean) => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentProtocol: null,
      sessionState: 'idle',
      progress: null,
      intention: '',
      
      sessionHistory: [],
      currentStreak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      totalMinutes: 0,
      
      preferredCarrierFrequency: 300,
      masterVolume: 0.5,
      visualIntensity: 0.7,
      reducedMotion: false,
      darkMode: true,
      
      // Actions
      setCurrentProtocol: (protocol) => set({ currentProtocol: protocol }),
      setSessionState: (state) => set({ sessionState: state }),
      setProgress: (progress) => set({ progress }),
      setIntention: (intention) => set({ intention }),
      
      addSessionToHistory: (entry) => set((state) => ({
        sessionHistory: [...state.sessionHistory, entry],
        totalMinutes: state.totalMinutes + Math.round(entry.duration / 60)
      })),
      
      updateStreak: () => {
        const today = getToday();
        const { lastSessionDate, currentStreak, longestStreak } = get();
        
        if (lastSessionDate === today) {
          // Already practiced today
          return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak: number;
        if (lastSessionDate === yesterdayStr) {
          // Continuing streak
          newStreak = currentStreak + 1;
        } else {
          // Starting new streak
          newStreak = 1;
        }
        
        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastSessionDate: today
        });
      },
      
      setPreferredCarrierFrequency: (freq) => set({ preferredCarrierFrequency: freq }),
      setMasterVolume: (volume) => set({ masterVolume: volume }),
      setVisualIntensity: (intensity) => set({ visualIntensity: intensity }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setDarkMode: (dark) => set({ darkMode: dark })
    }),
    {
      name: 'neuroharmonic-session-storage',
      partialize: (state) => ({
        sessionHistory: state.sessionHistory,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastSessionDate: state.lastSessionDate,
        totalMinutes: state.totalMinutes,
        preferredCarrierFrequency: state.preferredCarrierFrequency,
        masterVolume: state.masterVolume,
        visualIntensity: state.visualIntensity,
        reducedMotion: state.reducedMotion,
        darkMode: state.darkMode
      })
    }
  )
);
