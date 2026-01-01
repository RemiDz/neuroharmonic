// NeuroHarmonic - Frequency Definitions
// Ancient wisdom meets modern neuroscience

export interface BrainwaveState {
  id: string;
  name: string;
  range: [number, number];
  defaultFreq: number;
  color: string;
  gradient: string;
  description: string;
  benefits: string[];
  useCases: string[];
  recommendedDuration: { min: number; max: number; optimal: number };
  complementaryFrequencies: string[];
}

export const BRAINWAVE_STATES: Record<string, BrainwaveState> = {
  delta: {
    id: 'delta',
    name: 'Delta',
    range: [0.5, 4],
    defaultFreq: 2,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #818cf8 100%)',
    description: 'The deepest brainwave state, associated with dreamless sleep, profound healing, and physical regeneration.',
    benefits: [
      'Deep restorative sleep',
      'Physical healing & regeneration',
      'Immune system boost',
      'Release of growth hormone',
      'Unconscious mind access'
    ],
    useCases: [
      'Pre-sleep preparation',
      'Recovery from illness',
      'Deep meditation practice',
      'Chronic pain relief',
      'Anti-aging protocols'
    ],
    recommendedDuration: { min: 20, max: 60, optimal: 45 },
    complementaryFrequencies: ['174', '285']
  },
  theta: {
    id: 'theta',
    name: 'Theta',
    range: [4, 8],
    defaultFreq: 6,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #5b21b6 0%, #8b5cf6 50%, #a78bfa 100%)',
    description: 'The gateway to deeper consciousness, creativity, and profound meditation. The realm of dreams and intuition.',
    benefits: [
      'Enhanced creativity',
      'Deep meditation states',
      'Memory consolidation',
      'Emotional processing',
      'Intuitive insights',
      'Vivid imagery & visualization'
    ],
    useCases: [
      'Creative brainstorming',
      'Meditation deepening',
      'Lucid dream induction',
      'Trauma processing',
      'Shamanic journeying',
      'Hypnotherapy support'
    ],
    recommendedDuration: { min: 15, max: 45, optimal: 30 },
    complementaryFrequencies: ['396', '417', '528']
  },
  alpha: {
    id: 'alpha',
    name: 'Alpha',
    range: [8, 13],
    defaultFreq: 10,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #22d3ee 100%)',
    description: 'The bridge between conscious and subconscious. A state of relaxed alertness, calm focus, and stress reduction.',
    benefits: [
      'Stress reduction',
      'Calm mental clarity',
      'Enhanced learning',
      'Mind-body connection',
      'Positive mood elevation',
      'Present moment awareness'
    ],
    useCases: [
      'Pre-presentation calm',
      'Study sessions',
      'Light meditation',
      'Anxiety reduction',
      'Creative flow states',
      'Mindfulness practice'
    ],
    recommendedDuration: { min: 10, max: 30, optimal: 20 },
    complementaryFrequencies: ['528', '639', '741']
  },
  beta: {
    id: 'beta',
    name: 'Beta',
    range: [13, 30],
    defaultFreq: 18,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    description: 'Active, alert consciousness. The state of focused attention, problem-solving, and engaged thinking.',
    benefits: [
      'Sharp mental focus',
      'Active problem-solving',
      'Quick thinking',
      'Logical analysis',
      'Task completion',
      'Alert awareness'
    ],
    useCases: [
      'Deep work sessions',
      'Complex problem-solving',
      'Active learning',
      'Writing & analysis',
      'ADHD focus support',
      'Morning activation'
    ],
    recommendedDuration: { min: 15, max: 90, optimal: 45 },
    complementaryFrequencies: ['741', '852']
  },
  gamma: {
    id: 'gamma',
    name: 'Gamma',
    range: [30, 100],
    defaultFreq: 40,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #be185d 0%, #ec4899 50%, #f472b6 100%)',
    description: 'The highest frequency state, associated with peak mental performance, transcendent experiences, and cognitive binding.',
    benefits: [
      'Peak cognitive performance',
      'Heightened perception',
      'Information synthesis',
      'Insight & "aha" moments',
      'Transcendent awareness',
      'Enhanced memory recall'
    ],
    useCases: [
      'Breakthrough thinking',
      'Peak performance states',
      'Advanced meditation',
      'Cognitive enhancement',
      'Pre-competition focus',
      'Complex learning integration'
    ],
    recommendedDuration: { min: 5, max: 20, optimal: 10 },
    complementaryFrequencies: ['852', '963']
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
  {
    hz: 174,
    name: 'Foundation',
    intention: 'Security & Grounding',
    color: '#8b4513',
    description: 'The lowest Solfeggio frequency, providing a sense of security and grounding. Reduces pain and stress at a foundational level.'
  },
  {
    hz: 285,
    name: 'Quantum Healing',
    intention: 'Cellular Regeneration',
    color: '#ff4500',
    description: 'Influences energy fields to heal and regenerate tissues. Restructures damaged organs by sending them the energy to return to optimal form.'
  },
  {
    hz: 396,
    name: 'Liberation',
    intention: 'Releasing Fear & Guilt',
    chakra: 'Root',
    color: '#ff0000',
    description: 'Liberates from guilt and fear, the fundamental obstacles to realization. Cleanses trauma from the root chakra.'
  },
  {
    hz: 417,
    name: 'Transformation',
    intention: 'Facilitating Change',
    chakra: 'Sacral',
    color: '#ff7f00',
    description: 'Produces energy to bring about change. Clears destructive influences of past events and puts you in touch with an inexhaustible source of energy.'
  },
  {
    hz: 528,
    name: 'Miracle Tone',
    intention: 'DNA Repair & Transformation',
    chakra: 'Solar Plexus',
    color: '#ffff00',
    description: 'The "Love Frequency." Said to repair DNA and bring transformation. The most famous Solfeggio frequency, used for healing and miracles.'
  },
  {
    hz: 639,
    name: 'Connection',
    intention: 'Harmonizing Relationships',
    chakra: 'Heart',
    color: '#00ff00',
    description: 'Enables creation of harmonious relationships. Enhances communication, understanding, tolerance, and love.'
  },
  {
    hz: 741,
    name: 'Awakening',
    intention: 'Intuition & Expression',
    chakra: 'Throat',
    color: '#0000ff',
    description: 'Awakens intuition and promotes self-expression. Cleans cells of toxins and leads to a purer, more stable spiritual life.'
  },
  {
    hz: 852,
    name: 'Intuition',
    intention: 'Returning to Spiritual Order',
    chakra: 'Third Eye',
    color: '#4b0082',
    description: 'Raises awareness and returns to spiritual order. Opens communication with the higher self and universe.'
  },
  {
    hz: 963,
    name: 'Divine Connection',
    intention: 'Oneness & Transcendence',
    chakra: 'Crown',
    color: '#9400d3',
    description: 'Awakens the perfect state of oneness. Enables direct connection with Spirit, light, and all-embracing unity.'
  }
];

export interface CarrierFrequency {
  hz: number;
  name: string;
  quality: string;
}

export const CARRIER_FREQUENCIES: CarrierFrequency[] = [
  { hz: 200, name: 'Deep Foundation', quality: 'Warm, grounding base tone' },
  { hz: 250, name: 'Earth Resonance', quality: 'Rich, embodied sensation' },
  { hz: 300, name: 'Heart Center', quality: 'Balanced, centered feeling' },
  { hz: 350, name: 'Solar Warmth', quality: 'Energizing, empowering' },
  { hz: 400, name: 'Clear Mind', quality: 'Bright, focused clarity' },
  { hz: 432, name: 'Universal Harmony', quality: 'Natural, cosmic alignment' },
  { hz: 440, name: 'Concert Pitch', quality: 'Familiar, conventional' },
  { hz: 500, name: 'Ethereal', quality: 'Light, transcendent quality' }
];

export const DEFAULT_CARRIER_FREQUENCY = 300;

export interface NoiseType {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const NOISE_TYPES: NoiseType[] = [
  { id: 'white', name: 'White Noise', description: 'Equal energy at all frequencies - crisp, bright masking', color: '#ffffff' },
  { id: 'pink', name: 'Pink Noise', description: 'Balanced, natural sound like rainfall or wind', color: '#ffb6c1' },
  { id: 'brown', name: 'Brown Noise', description: 'Deep, rumbling bass - like thunder or waterfalls', color: '#8b4513' }
];
