// NeuroHarmonic - Healing Protocol Definitions

export interface ProtocolPhase {
  name: string;
  duration: number; // seconds
  targetFrequency: number; // Hz (binaural beat target)
  carrierFrequency?: number;
  solfeggioLayer?: number;
  isochronicPulse?: number;
  volume: number; // 0-1
  description?: string;
}

export interface HealingProtocol {
  id: string;
  name: string;
  category: 'emotional' | 'physical' | 'cognitive' | 'spiritual' | 'adhd';
  subcategory: string;
  description: string;
  duration: number; // total seconds
  phases: ProtocolPhase[];
  icon: string;
  color: string;
  gradient: string;
  benefits: string[];
  bestTimeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  intensity: 'gentle' | 'moderate' | 'deep';
}

export const HEALING_PROTOCOLS: HealingProtocol[] = [
  // ADHD Support Protocols
  {
    id: 'focus-boost',
    name: 'Focus Intensifier',
    category: 'adhd',
    subcategory: 'Focus',
    description: 'A quick 2-minute gamma burst to sharpen focus and initiate deep work. Perfect for task initiation.',
    duration: 120,
    phases: [
      { name: 'Activation', duration: 30, targetFrequency: 18, volume: 0.4, description: 'Beta warm-up' },
      { name: 'Peak Focus', duration: 60, targetFrequency: 40, volume: 0.5, description: 'Gamma peak' },
      { name: 'Sustain', duration: 30, targetFrequency: 25, volume: 0.45, description: 'High beta maintenance' }
    ],
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
    benefits: ['Instant focus activation', 'Task initiation support', 'Mental clarity boost'],
    bestTimeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'hyperfocus-exit',
    name: 'Hyperfocus Exit Ramp',
    category: 'adhd',
    subcategory: 'Transitions',
    description: 'Gentle 5-minute descent from intense focus to relaxed awareness. Helps with healthy task transitions.',
    duration: 300,
    phases: [
      { name: 'Acknowledge', duration: 60, targetFrequency: 20, volume: 0.4 },
      { name: 'Soften', duration: 90, targetFrequency: 14, volume: 0.35 },
      { name: 'Release', duration: 90, targetFrequency: 10, volume: 0.3 },
      { name: 'Arrive', duration: 60, targetFrequency: 8, volume: 0.25 }
    ],
    icon: '🌅',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #8b5cf6 100%)',
    benefits: ['Smooth task transitions', 'Prevents mental fatigue', 'Emotional regulation'],
    bestTimeOfDay: 'anytime',
    intensity: 'gentle'
  },
  {
    id: 'overwhelm-reset',
    name: 'Overwhelm Reset',
    category: 'adhd',
    subcategory: 'Regulation',
    description: 'Emergency 3-minute calming protocol. Rapidly shifts from chaos to calm.',
    duration: 180,
    phases: [
      { name: 'Ground', duration: 45, targetFrequency: 10, solfeggioLayer: 396, volume: 0.35 },
      { name: 'Stabilize', duration: 90, targetFrequency: 7.83, solfeggioLayer: 528, volume: 0.4 },
      { name: 'Center', duration: 45, targetFrequency: 10, volume: 0.35 }
    ],
    icon: '🌊',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    benefits: ['Rapid anxiety reduction', 'Sensory overwhelm relief', 'Emotional grounding'],
    bestTimeOfDay: 'anytime',
    intensity: 'gentle'
  },
  {
    id: 'morning-activation',
    name: 'Morning Activation',
    category: 'adhd',
    subcategory: 'Routines',
    description: 'Wake up your brain gently but effectively. 10-minute journey from sleep inertia to alert readiness.',
    duration: 600,
    phases: [
      { name: 'Gentle Wake', duration: 120, targetFrequency: 8, volume: 0.25 },
      { name: 'Energize', duration: 180, targetFrequency: 12, volume: 0.35 },
      { name: 'Activate', duration: 180, targetFrequency: 16, volume: 0.4 },
      { name: 'Ready', duration: 120, targetFrequency: 18, volume: 0.45 }
    ],
    icon: '🌅',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    benefits: ['Overcomes sleep inertia', 'Natural awakening', 'Day preparation'],
    bestTimeOfDay: 'morning',
    intensity: 'gentle'
  },
  {
    id: 'deep-work-45',
    name: 'Deep Work Session',
    category: 'adhd',
    subcategory: 'Focus',
    description: 'Full 45-minute focus session with warm-up and cool-down phases built in.',
    duration: 2700,
    phases: [
      { name: 'Settle', duration: 180, targetFrequency: 10, volume: 0.3 },
      { name: 'Ramp Up', duration: 300, targetFrequency: 14, volume: 0.35 },
      { name: 'Deep Focus', duration: 1800, targetFrequency: 18, volume: 0.4 },
      { name: 'Wind Down', duration: 300, targetFrequency: 12, volume: 0.35 },
      { name: 'Complete', duration: 120, targetFrequency: 10, volume: 0.3 }
    ],
    icon: '🎯',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    benefits: ['Extended concentration', 'Flow state induction', 'Productive work sessions'],
    bestTimeOfDay: 'morning',
    intensity: 'moderate'
  },

  // Emotional Healing Protocols
  {
    id: 'anxiety-dissolve',
    name: 'Anxiety Dissolution',
    category: 'emotional',
    subcategory: 'Anxiety',
    description: 'Alpha-theta protocol designed to dissolve anxious thought patterns and restore inner peace.',
    duration: 1200,
    phases: [
      { name: 'Acknowledge', duration: 180, targetFrequency: 10, solfeggioLayer: 396, volume: 0.35 },
      { name: 'Release', duration: 300, targetFrequency: 7, solfeggioLayer: 417, volume: 0.4 },
      { name: 'Transform', duration: 420, targetFrequency: 6, solfeggioLayer: 528, volume: 0.45 },
      { name: 'Peace', duration: 300, targetFrequency: 10, solfeggioLayer: 639, volume: 0.35 }
    ],
    icon: '🦋',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    benefits: ['Anxiety relief', 'Mental calm', 'Emotional balance', 'Stress reduction'],
    bestTimeOfDay: 'evening',
    intensity: 'gentle'
  },
  {
    id: 'self-compassion',
    name: 'Self-Compassion Cultivation',
    category: 'emotional',
    subcategory: 'Self-Love',
    description: 'Heart-centered frequencies to develop deeper self-acceptance and inner kindness.',
    duration: 900,
    phases: [
      { name: 'Open Heart', duration: 180, targetFrequency: 8, solfeggioLayer: 639, volume: 0.35 },
      { name: 'Self-Love', duration: 420, targetFrequency: 6, solfeggioLayer: 528, volume: 0.4 },
      { name: 'Integration', duration: 300, targetFrequency: 10, solfeggioLayer: 639, volume: 0.35 }
    ],
    icon: '💗',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    benefits: ['Self-acceptance', 'Inner peace', 'Emotional healing', 'Heart opening'],
    bestTimeOfDay: 'anytime',
    intensity: 'gentle'
  },

  // Physical Support Protocols
  {
    id: 'sleep-optimize',
    name: 'Sleep Optimization',
    category: 'physical',
    subcategory: 'Sleep',
    description: 'Progressive descent into deep delta waves for restorative sleep.',
    duration: 2400,
    phases: [
      { name: 'Unwind', duration: 300, targetFrequency: 10, volume: 0.3 },
      { name: 'Deepen', duration: 600, targetFrequency: 6, volume: 0.35 },
      { name: 'Pre-Sleep', duration: 600, targetFrequency: 4, solfeggioLayer: 174, volume: 0.35 },
      { name: 'Delta Entry', duration: 900, targetFrequency: 2, solfeggioLayer: 174, volume: 0.3 }
    ],
    icon: '🌙',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
    benefits: ['Faster sleep onset', 'Deeper sleep', 'Better recovery', 'Reduced insomnia'],
    bestTimeOfDay: 'night',
    intensity: 'deep'
  },
  {
    id: 'pain-relief',
    name: 'Pain Management',
    category: 'physical',
    subcategory: 'Pain',
    description: 'Endorphin-releasing frequencies combined with deep relaxation for natural pain relief.',
    duration: 1500,
    phases: [
      { name: 'Relax', duration: 300, targetFrequency: 10, solfeggioLayer: 174, volume: 0.35 },
      { name: 'Endorphin Release', duration: 600, targetFrequency: 3.5, solfeggioLayer: 285, volume: 0.4 },
      { name: 'Integration', duration: 600, targetFrequency: 7.83, solfeggioLayer: 528, volume: 0.35 }
    ],
    icon: '🌿',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    benefits: ['Natural pain relief', 'Deep relaxation', 'Endorphin release', 'Body healing'],
    bestTimeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'energy-restore',
    name: 'Energy Restoration',
    category: 'physical',
    subcategory: 'Energy',
    description: 'Quick energy boost without caffeine. Raises alertness and vitality naturally.',
    duration: 600,
    phases: [
      { name: 'Ground', duration: 120, targetFrequency: 10, volume: 0.3 },
      { name: 'Energize', duration: 300, targetFrequency: 15, solfeggioLayer: 417, volume: 0.4 },
      { name: 'Stabilize', duration: 180, targetFrequency: 12, volume: 0.35 }
    ],
    icon: '⚡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    benefits: ['Natural energy boost', 'Mental alertness', 'Fatigue relief', 'Vitality increase'],
    bestTimeOfDay: 'afternoon',
    intensity: 'moderate'
  },

  // Cognitive Enhancement Protocols
  {
    id: 'memory-consolidation',
    name: 'Memory Consolidation',
    category: 'cognitive',
    subcategory: 'Memory',
    description: 'Theta-dominant protocol to enhance memory encoding and consolidation.',
    duration: 1200,
    phases: [
      { name: 'Prepare', duration: 180, targetFrequency: 10, volume: 0.3 },
      { name: 'Theta Deep', duration: 720, targetFrequency: 6, solfeggioLayer: 852, volume: 0.4 },
      { name: 'Integration', duration: 300, targetFrequency: 10, volume: 0.35 }
    ],
    icon: '🧠',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    benefits: ['Enhanced memory', 'Better recall', 'Learning support', 'Information retention'],
    bestTimeOfDay: 'evening',
    intensity: 'moderate'
  },
  {
    id: 'creative-breakthrough',
    name: 'Creative Breakthrough',
    category: 'cognitive',
    subcategory: 'Creativity',
    description: 'Alpha-theta border crossing for enhanced creativity and novel idea generation.',
    duration: 1500,
    phases: [
      { name: 'Relax Mind', duration: 300, targetFrequency: 10, volume: 0.35 },
      { name: 'Creative Threshold', duration: 600, targetFrequency: 7.5, solfeggioLayer: 741, volume: 0.4 },
      { name: 'Insight Zone', duration: 450, targetFrequency: 6, volume: 0.4 },
      { name: 'Return', duration: 150, targetFrequency: 10, volume: 0.35 }
    ],
    icon: '🎨',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    benefits: ['Creative inspiration', 'Novel ideas', 'Artistic flow', 'Problem-solving'],
    bestTimeOfDay: 'morning',
    intensity: 'moderate'
  },

  // Spiritual/Meditative Protocols
  {
    id: 'chakra-journey',
    name: 'Chakra Balancing Journey',
    category: 'spiritual',
    subcategory: 'Chakras',
    description: 'Progressive journey through all seven chakras with corresponding Solfeggio frequencies.',
    duration: 2100,
    phases: [
      { name: 'Root', duration: 300, targetFrequency: 7.83, solfeggioLayer: 396, volume: 0.35 },
      { name: 'Sacral', duration: 300, targetFrequency: 7.83, solfeggioLayer: 417, volume: 0.35 },
      { name: 'Solar Plexus', duration: 300, targetFrequency: 7.83, solfeggioLayer: 528, volume: 0.35 },
      { name: 'Heart', duration: 300, targetFrequency: 7.83, solfeggioLayer: 639, volume: 0.35 },
      { name: 'Throat', duration: 300, targetFrequency: 7.83, solfeggioLayer: 741, volume: 0.35 },
      { name: 'Third Eye', duration: 300, targetFrequency: 7.83, solfeggioLayer: 852, volume: 0.35 },
      { name: 'Crown', duration: 300, targetFrequency: 7.83, solfeggioLayer: 963, volume: 0.35 }
    ],
    icon: '🌈',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 14%, #eab308 28%, #22c55e 42%, #3b82f6 56%, #6366f1 70%, #a855f7 84%, #ec4899 100%)',
    benefits: ['Energy balancing', 'Chakra alignment', 'Holistic healing', 'Spiritual growth'],
    bestTimeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'deep-meditation',
    name: 'Deep Meditation',
    category: 'spiritual',
    subcategory: 'Meditation',
    description: 'Progressive descent into profound meditative states.',
    duration: 1800,
    phases: [
      { name: 'Settle', duration: 300, targetFrequency: 10, volume: 0.3 },
      { name: 'Deepen', duration: 300, targetFrequency: 8, volume: 0.35 },
      { name: 'Theta Gate', duration: 600, targetFrequency: 6, solfeggioLayer: 852, volume: 0.4 },
      { name: 'Deep State', duration: 450, targetFrequency: 4.5, volume: 0.4 },
      { name: 'Return', duration: 150, targetFrequency: 10, volume: 0.3 }
    ],
    icon: '🧘',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    benefits: ['Deep meditation', 'Inner stillness', 'Expanded awareness', 'Spiritual connection'],
    bestTimeOfDay: 'morning',
    intensity: 'deep'
  },
  {
    id: 'lucid-dream',
    name: 'Lucid Dream Induction',
    category: 'spiritual',
    subcategory: 'Dreams',
    description: 'Theta-dominant protocol designed to induce lucid dreaming awareness.',
    duration: 2400,
    phases: [
      { name: 'Relaxation', duration: 600, targetFrequency: 8, volume: 0.3 },
      { name: 'Theta Descent', duration: 900, targetFrequency: 5, solfeggioLayer: 852, volume: 0.35 },
      { name: 'REM Trigger', duration: 600, targetFrequency: 4, isochronicPulse: 6, volume: 0.35 },
      { name: 'Dream State', duration: 300, targetFrequency: 3.5, volume: 0.3 }
    ],
    icon: '🌙',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    benefits: ['Lucid dreaming', 'Dream recall', 'Subconscious access', 'Night exploration'],
    bestTimeOfDay: 'night',
    intensity: 'deep'
  }
];

export const getProtocolsByCategory = (category: HealingProtocol['category']) => 
  HEALING_PROTOCOLS.filter(p => p.category === category);

export const getProtocolById = (id: string) => 
  HEALING_PROTOCOLS.find(p => p.id === id);

export const getMicroSessions = () => 
  HEALING_PROTOCOLS.filter(p => p.duration <= 300);

export const getProtocolsByTimeOfDay = (time: HealingProtocol['bestTimeOfDay']) => 
  HEALING_PROTOCOLS.filter(p => p.bestTimeOfDay === time || p.bestTimeOfDay === 'anytime');
