// NeuroHarmonic - Complete Frequency Data
// Brainwave states, Solfeggio frequencies, and presets

export interface BrainwaveState {
  id: string;
  name: string;
  range: [number, number];
  defaultFrequency: number;
  color: string;
  gradient: string;
  glowColor: string;
  icon: string;
  description: string;
  benefits: string[];
  presets: BrainwavePreset[];
}

export interface BrainwavePreset {
  id: string;
  name: string;
  frequency: number;
  duration: number; // minutes
  description: string;
  solfeggioLayers?: number[];
  carrierFrequency?: number;
}

export const BRAINWAVE_STATES: Record<string, BrainwaveState> = {
  delta: {
    id: 'delta',
    name: 'Delta',
    range: [0.5, 4],
    defaultFrequency: 2,
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)',
    glowColor: 'rgba(124, 58, 237, 0.5)',
    icon: '🌙',
    description: 'Deep sleep, healing, and regeneration. The slowest brainwaves associated with dreamless sleep and profound physical restoration.',
    benefits: [
      'Deep restorative sleep',
      'Physical healing & regeneration',
      'Immune system boost',
      'Growth hormone release',
      'Pain reduction',
      'Anti-aging effects'
    ],
    presets: [
      { id: 'deep-sleep', name: 'Deep Sleep', frequency: 1.5, duration: 45, description: 'Descend into restorative delta sleep', solfeggioLayers: [174] },
      { id: 'physical-healing', name: 'Physical Healing', frequency: 2.5, duration: 30, description: 'Activate cellular repair and regeneration', solfeggioLayers: [285] },
      { id: 'regeneration', name: 'Regeneration', frequency: 3, duration: 30, description: 'Deep tissue and organ recovery', solfeggioLayers: [174, 285] }
    ]
  },
  theta: {
    id: 'theta',
    name: 'Theta',
    range: [4, 8],
    defaultFrequency: 6,
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 50%, #C4B5FD 100%)',
    glowColor: 'rgba(139, 92, 246, 0.5)',
    icon: '🌌',
    description: 'Deep meditation, creativity, and REM sleep. The gateway to the subconscious mind and profound insights.',
    benefits: [
      'Deep meditation states',
      'Enhanced creativity',
      'Emotional healing',
      'Memory consolidation',
      'Intuitive insights',
      'Vivid visualization'
    ],
    presets: [
      { id: 'deep-meditation', name: 'Deep Meditation', frequency: 5, duration: 30, description: 'Journey into profound meditative states', solfeggioLayers: [852] },
      { id: 'creative-flow', name: 'Creative Flow', frequency: 7, duration: 25, description: 'Unlock creative inspiration and ideas', solfeggioLayers: [741] },
      { id: 'memory-enhancement', name: 'Memory Enhancement', frequency: 6, duration: 20, description: 'Strengthen memory consolidation', solfeggioLayers: [417] }
    ]
  },
  alpha: {
    id: 'alpha',
    name: 'Alpha',
    range: [8, 13],
    defaultFrequency: 10,
    color: '#00FFD1',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #00FFD1 50%, #6EE7B7 100%)',
    glowColor: 'rgba(0, 255, 209, 0.5)',
    icon: '🧘',
    description: 'Relaxed alertness and calm focus. The bridge between conscious thinking and the subconscious.',
    benefits: [
      'Stress reduction',
      'Calm mental clarity',
      'Enhanced learning',
      'Positive mood',
      'Mind-body connection',
      'Present moment awareness'
    ],
    presets: [
      { id: 'calm-focus', name: 'Calm Focus', frequency: 10, duration: 20, description: 'Achieve relaxed yet alert concentration', solfeggioLayers: [528] },
      { id: 'stress-relief', name: 'Stress Relief', frequency: 9, duration: 15, description: 'Release tension and find peace', solfeggioLayers: [396, 528] },
      { id: 'light-meditation', name: 'Light Meditation', frequency: 8.5, duration: 20, description: 'Gentle mindfulness and presence', solfeggioLayers: [639] }
    ]
  },
  beta: {
    id: 'beta',
    name: 'Beta',
    range: [13, 30],
    defaultFrequency: 18,
    color: '#FFB800',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FFB800 50%, #FDE047 100%)',
    glowColor: 'rgba(255, 184, 0, 0.5)',
    icon: '⚡',
    description: 'Active thinking, concentration, and problem-solving. The state of focused mental engagement.',
    benefits: [
      'Sharp concentration',
      'Active problem-solving',
      'Quick thinking',
      'Logical analysis',
      'Task completion',
      'Mental alertness'
    ],
    presets: [
      { id: 'concentration', name: 'Concentration', frequency: 18, duration: 45, description: 'Deep focused work and study', solfeggioLayers: [417] },
      { id: 'problem-solving', name: 'Problem Solving', frequency: 20, duration: 30, description: 'Analytical thinking and solutions', solfeggioLayers: [741] },
      { id: 'alertness', name: 'Alertness', frequency: 15, duration: 20, description: 'Wake up and energize your mind', solfeggioLayers: [417] }
    ]
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    range: [30, 100],
    defaultFrequency: 40,
    color: '#FF00FF',
    gradient: 'linear-gradient(135deg, #A21CAF 0%, #FF00FF 50%, #F5D0FE 100%)',
    glowColor: 'rgba(255, 0, 255, 0.5)',
    icon: '✨',
    description: 'Peak cognitive performance and transcendent awareness. The highest frequency state associated with insight and unity.',
    benefits: [
      'Peak mental performance',
      'Heightened perception',
      'Information synthesis',
      'Profound insights',
      'Expanded consciousness',
      'Enhanced memory recall'
    ],
    presets: [
      { id: 'insight', name: 'Insight', frequency: 40, duration: 15, description: 'Breakthrough moments and clarity', solfeggioLayers: [963] },
      { id: 'peak-awareness', name: 'Peak Awareness', frequency: 42, duration: 10, description: 'Heightened sensory processing', solfeggioLayers: [852, 963] },
      { id: 'cognitive-boost', name: 'Cognitive Boost', frequency: 38, duration: 10, description: 'Rapid cognitive enhancement', solfeggioLayers: [741] }
    ]
  }
};

export interface SolfeggioFrequency {
  hz: number;
  name: string;
  intention: string;
  chakra?: string;
  color: string;
  description: string;
}

export const SOLFEGGIO_FREQUENCIES: SolfeggioFrequency[] = [
  { hz: 174, name: 'Foundation', intention: 'Pain Reduction', color: '#8B4513', description: 'The lowest Solfeggio tone, grounding and reducing pain' },
  { hz: 285, name: 'Quantum', intention: 'Tissue Regeneration', color: '#FF4500', description: 'Influences energy fields for healing and tissue repair' },
  { hz: 396, name: 'Liberation', intention: 'Release Fear', chakra: 'Root', color: '#FF0000', description: 'Liberates from guilt and fear, cleanses trauma' },
  { hz: 417, name: 'Change', intention: 'Facilitate Change', chakra: 'Sacral', color: '#FF7F00', description: 'Clears negativity and facilitates positive change' },
  { hz: 528, name: 'Miracle', intention: 'DNA Repair', chakra: 'Solar Plexus', color: '#FFFF00', description: 'The love frequency, said to repair DNA and bring transformation' },
  { hz: 639, name: 'Connection', intention: 'Relationships', chakra: 'Heart', color: '#00FF00', description: 'Enhances communication, understanding, and love' },
  { hz: 741, name: 'Awakening', intention: 'Expression', chakra: 'Throat', color: '#0000FF', description: 'Awakens intuition and promotes self-expression' },
  { hz: 852, name: 'Intuition', intention: 'Third Eye', chakra: 'Third Eye', color: '#4B0082', description: 'Returns to spiritual order, opens third eye' },
  { hz: 963, name: 'Divine', intention: 'Oneness', chakra: 'Crown', color: '#9400D3', description: 'Connects with higher self and universal consciousness' }
];

export const CARRIER_FREQUENCIES = [
  { hz: 100, name: 'Deep Base', quality: 'Very low, grounding' },
  { hz: 150, name: 'Foundation', quality: 'Warm, embodied' },
  { hz: 200, name: 'Heart', quality: 'Balanced, centered' },
  { hz: 250, name: 'Solar', quality: 'Energizing' },
  { hz: 300, name: 'Standard', quality: 'Clear, neutral' },
  { hz: 350, name: 'Bright', quality: 'Uplifting' },
  { hz: 400, name: 'Mental', quality: 'Sharp, focused' },
  { hz: 432, name: 'Universal', quality: 'Natural harmony' },
  { hz: 440, name: 'Concert', quality: 'Standard pitch' },
  { hz: 500, name: 'Ethereal', quality: 'Light, transcendent' }
];

export const DURATIONS = [5, 10, 15, 20, 30, 45, 60, 90, 120];
