// NeuroHarmonic - Complete Healing Protocols Library

export interface ProtocolPhase {
  name: string;
  duration: number; // seconds
  beatFrequency: number;
  carrierFrequency?: number;
  solfeggioLayers?: number[];
  isochronicRate?: number;
  description?: string;
}

export interface HealingProtocol {
  id: string;
  name: string;
  category: 'emotional' | 'physical' | 'cognitive' | 'spiritual' | 'adhd';
  subcategory: string;
  icon: string;
  description: string;
  benefits: string[];
  duration: number; // total seconds
  phases: ProtocolPhase[];
  color: string;
  gradient: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  intensity: 'gentle' | 'moderate' | 'deep';
}

export const HEALING_PROTOCOLS: HealingProtocol[] = [
  // ═══════════════════════════════════════════════════════════════
  // EMOTIONAL HEALING PROTOCOLS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'anxiety-relief',
    name: 'Anxiety Relief',
    category: 'emotional',
    subcategory: 'Anxiety',
    icon: '🦋',
    description: 'Alpha waves combined with the 528Hz love frequency to dissolve anxious thoughts and restore inner peace.',
    benefits: ['Reduces anxiety', 'Calms racing thoughts', 'Lowers cortisol', 'Promotes relaxation'],
    duration: 20 * 60,
    phases: [
      { name: 'Grounding', duration: 180, beatFrequency: 12, solfeggioLayers: [396], description: 'Establish a calm baseline' },
      { name: 'Release', duration: 420, beatFrequency: 10, solfeggioLayers: [528], description: 'Let go of tension' },
      { name: 'Calm', duration: 480, beatFrequency: 8, solfeggioLayers: [528, 639], description: 'Deep relaxation' },
      { name: 'Peace', duration: 120, beatFrequency: 10, solfeggioLayers: [528], description: 'Gentle return' }
    ],
    color: '#00FFD1',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #00FFD1 100%)',
    timeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'depression-support',
    name: 'Depression Support',
    category: 'emotional',
    subcategory: 'Depression',
    icon: '🌅',
    description: 'Theta waves with the 396Hz liberation frequency to lift mood and release stagnant emotional energy.',
    benefits: ['Lifts mood', 'Releases emotional blocks', 'Promotes hope', 'Increases energy'],
    duration: 30 * 60,
    phases: [
      { name: 'Acknowledge', duration: 300, beatFrequency: 8, solfeggioLayers: [396], description: 'Honor current feelings' },
      { name: 'Release', duration: 600, beatFrequency: 6, solfeggioLayers: [396, 417], description: 'Let go of heaviness' },
      { name: 'Transform', duration: 600, beatFrequency: 5, solfeggioLayers: [417, 528], description: 'Shift perspective' },
      { name: 'Uplift', duration: 300, beatFrequency: 10, solfeggioLayers: [528], description: 'Rise into lightness' }
    ],
    color: '#FFB800',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FFB800 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'anger-release',
    name: 'Anger Release',
    category: 'emotional',
    subcategory: 'Anger',
    icon: '🔥',
    description: 'Progressive alpha-theta journey to safely process and release pent-up anger and frustration.',
    benefits: ['Releases anger safely', 'Reduces irritability', 'Promotes forgiveness', 'Restores calm'],
    duration: 15 * 60,
    phases: [
      { name: 'Acknowledge', duration: 180, beatFrequency: 12, solfeggioLayers: [396], description: 'Recognize the anger' },
      { name: 'Express', duration: 300, beatFrequency: 10, solfeggioLayers: [417], description: 'Allow the energy to move' },
      { name: 'Transform', duration: 300, beatFrequency: 7, solfeggioLayers: [528], description: 'Convert to understanding' },
      { name: 'Peace', duration: 120, beatFrequency: 10, solfeggioLayers: [639], description: 'Return to harmony' }
    ],
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #DC2626 0%, #F97316 100%)',
    timeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'grief-processing',
    name: 'Grief Processing',
    category: 'emotional',
    subcategory: 'Grief',
    icon: '💙',
    description: 'Gentle theta waves with 741Hz awakening frequency for safe emotional processing and healing.',
    benefits: ['Honors grief', 'Promotes healing', 'Supports acceptance', 'Opens the heart'],
    duration: 25 * 60,
    phases: [
      { name: 'Hold Space', duration: 300, beatFrequency: 8, solfeggioLayers: [639], description: 'Create safe container' },
      { name: 'Feel', duration: 600, beatFrequency: 5, solfeggioLayers: [741], description: 'Allow emotions to flow' },
      { name: 'Release', duration: 450, beatFrequency: 6, solfeggioLayers: [741, 528], description: 'Let go with love' },
      { name: 'Integrate', duration: 150, beatFrequency: 10, solfeggioLayers: [528], description: 'Find peace' }
    ],
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)',
    timeOfDay: 'evening',
    intensity: 'gentle'
  },
  {
    id: 'self-compassion',
    name: 'Self-Compassion',
    category: 'emotional',
    subcategory: 'Self-Love',
    icon: '💗',
    description: 'Heart-centered theta session with 639Hz connection frequency to cultivate deep self-love.',
    benefits: ['Builds self-love', 'Reduces self-criticism', 'Heals inner child', 'Promotes acceptance'],
    duration: 20 * 60,
    phases: [
      { name: 'Open Heart', duration: 240, beatFrequency: 8, solfeggioLayers: [639], description: 'Soften into receiving' },
      { name: 'Self-Love', duration: 600, beatFrequency: 6, solfeggioLayers: [528, 639], description: 'Embrace yourself fully' },
      { name: 'Forgiveness', duration: 240, beatFrequency: 7, solfeggioLayers: [639], description: 'Release judgment' },
      { name: 'Integration', duration: 120, beatFrequency: 10, solfeggioLayers: [528], description: 'Embody compassion' }
    ],
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #BE185D 0%, #F472B6 100%)',
    timeOfDay: 'anytime',
    intensity: 'gentle'
  },

  // ═══════════════════════════════════════════════════════════════
  // PHYSICAL HEALING PROTOCOLS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pain-management',
    name: 'Pain Management',
    category: 'physical',
    subcategory: 'Pain',
    icon: '🌿',
    description: 'Deep delta waves combined with 174Hz foundation frequency for natural endorphin release and pain relief.',
    benefits: ['Reduces pain perception', 'Releases endorphins', 'Deep relaxation', 'Promotes healing'],
    duration: 30 * 60,
    phases: [
      { name: 'Relax', duration: 300, beatFrequency: 8, solfeggioLayers: [174], description: 'Release muscle tension' },
      { name: 'Deepen', duration: 600, beatFrequency: 4, solfeggioLayers: [174, 285], description: 'Enter deep relaxation' },
      { name: 'Heal', duration: 720, beatFrequency: 2, solfeggioLayers: [285], description: 'Endorphin release' },
      { name: 'Emerge', duration: 180, beatFrequency: 8, solfeggioLayers: [528], description: 'Gentle return' }
    ],
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    timeOfDay: 'anytime',
    intensity: 'deep'
  },
  {
    id: 'sleep-induction',
    name: 'Sleep Induction',
    category: 'physical',
    subcategory: 'Sleep',
    icon: '🌙',
    description: 'Progressive delta descent for natural, deep sleep without grogginess.',
    benefits: ['Falls asleep naturally', 'Deeper sleep', 'Reduces insomnia', 'Wakes refreshed'],
    duration: 45 * 60,
    phases: [
      { name: 'Unwind', duration: 600, beatFrequency: 10, solfeggioLayers: [528], description: 'Release the day' },
      { name: 'Descend', duration: 900, beatFrequency: 6, solfeggioLayers: [396], description: 'Slow down' },
      { name: 'Pre-Sleep', duration: 600, beatFrequency: 3, solfeggioLayers: [174], description: 'Approach sleep' },
      { name: 'Sleep', duration: 600, beatFrequency: 1.5, solfeggioLayers: [174], description: 'Deep delta' }
    ],
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #4338CA 0%, #818CF8 100%)',
    timeOfDay: 'night',
    intensity: 'deep'
  },
  {
    id: 'immune-boost',
    name: 'Immune Boost',
    category: 'physical',
    subcategory: 'Immunity',
    icon: '🛡️',
    description: 'Theta-alpha bridge with 285Hz quantum healing frequency to support immune function.',
    benefits: ['Supports immune system', 'Reduces inflammation', 'Promotes healing', 'Stress reduction'],
    duration: 20 * 60,
    phases: [
      { name: 'Calm', duration: 300, beatFrequency: 10, solfeggioLayers: [285], description: 'Reduce stress hormones' },
      { name: 'Activate', duration: 600, beatFrequency: 7, solfeggioLayers: [285, 528], description: 'Stimulate healing' },
      { name: 'Integrate', duration: 300, beatFrequency: 10, solfeggioLayers: [528], description: 'Balance restored' }
    ],
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #5EEAD4 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'energy-restoration',
    name: 'Energy Restoration',
    category: 'physical',
    subcategory: 'Energy',
    icon: '⚡',
    description: 'Alpha-beta bridge to naturally boost energy without caffeine.',
    benefits: ['Natural energy boost', 'Mental clarity', 'Reduces fatigue', 'Improves vitality'],
    duration: 15 * 60,
    phases: [
      { name: 'Ground', duration: 180, beatFrequency: 10, solfeggioLayers: [417], description: 'Center yourself' },
      { name: 'Energize', duration: 480, beatFrequency: 14, solfeggioLayers: [417], description: 'Build energy' },
      { name: 'Sustain', duration: 240, beatFrequency: 12, solfeggioLayers: [528], description: 'Maintain vitality' }
    ],
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
    timeOfDay: 'afternoon',
    intensity: 'moderate'
  },
  {
    id: 'inflammation-reduction',
    name: 'Inflammation Reduction',
    category: 'physical',
    subcategory: 'Inflammation',
    icon: '💧',
    description: 'Delta waves with 174Hz and 285Hz frequencies for cellular healing.',
    benefits: ['Reduces inflammation', 'Cellular repair', 'Pain relief', 'Accelerates recovery'],
    duration: 25 * 60,
    phases: [
      { name: 'Prepare', duration: 300, beatFrequency: 8, solfeggioLayers: [174], description: 'Relax deeply' },
      { name: 'Heal', duration: 900, beatFrequency: 3, solfeggioLayers: [174, 285], description: 'Cellular regeneration' },
      { name: 'Restore', duration: 300, beatFrequency: 8, solfeggioLayers: [285], description: 'Integration' }
    ],
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #67E8F9 100%)',
    timeOfDay: 'evening',
    intensity: 'deep'
  },

  // ═══════════════════════════════════════════════════════════════
  // COGNITIVE ENHANCEMENT PROTOCOLS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'study-focus',
    name: 'Study Focus',
    category: 'cognitive',
    subcategory: 'Focus',
    icon: '📚',
    description: 'Sustained beta waves with 417Hz for extended periods of concentrated study.',
    benefits: ['Enhanced concentration', 'Better retention', 'Reduced distraction', 'Mental stamina'],
    duration: 45 * 60,
    phases: [
      { name: 'Prepare', duration: 300, beatFrequency: 12, solfeggioLayers: [417], description: 'Settle into focus' },
      { name: 'Focus', duration: 2100, beatFrequency: 15, solfeggioLayers: [417], description: 'Deep concentration' },
      { name: 'Rest', duration: 300, beatFrequency: 10, solfeggioLayers: [528], description: 'Mental break' }
    ],
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'memory-consolidation',
    name: 'Memory Consolidation',
    category: 'cognitive',
    subcategory: 'Memory',
    icon: '🧠',
    description: 'Theta waves to strengthen memory encoding and consolidation.',
    benefits: ['Stronger memory', 'Better recall', 'Enhanced learning', 'Information retention'],
    duration: 20 * 60,
    phases: [
      { name: 'Relax', duration: 240, beatFrequency: 10, description: 'Calm the mind' },
      { name: 'Encode', duration: 720, beatFrequency: 6, solfeggioLayers: [852], description: 'Memory processing' },
      { name: 'Integrate', duration: 240, beatFrequency: 10, description: 'Consolidation' }
    ],
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #F9A8D4 100%)',
    timeOfDay: 'evening',
    intensity: 'moderate'
  },
  {
    id: 'creative-breakthrough',
    name: 'Creative Breakthrough',
    category: 'cognitive',
    subcategory: 'Creativity',
    icon: '🎨',
    description: 'Theta waves with 852Hz intuition frequency for creative inspiration.',
    benefits: ['Unlocks creativity', 'Novel ideas', 'Artistic flow', 'Problem-solving'],
    duration: 30 * 60,
    phases: [
      { name: 'Open', duration: 360, beatFrequency: 10, solfeggioLayers: [741], description: 'Release blocks' },
      { name: 'Create', duration: 960, beatFrequency: 7.5, solfeggioLayers: [852], description: 'Creative flow' },
      { name: 'Capture', duration: 480, beatFrequency: 10, solfeggioLayers: [741], description: 'Solidify ideas' }
    ],
    color: '#F472B6',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A78BFA 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'mental-clarity',
    name: 'Mental Clarity',
    category: 'cognitive',
    subcategory: 'Clarity',
    icon: '💎',
    description: 'Alpha waves with 963Hz divine frequency for crystal-clear thinking.',
    benefits: ['Clear thinking', 'Cuts through fog', 'Better decisions', 'Mental sharpness'],
    duration: 15 * 60,
    phases: [
      { name: 'Clear', duration: 300, beatFrequency: 12, solfeggioLayers: [741], description: 'Dissolve confusion' },
      { name: 'Sharpen', duration: 480, beatFrequency: 10, solfeggioLayers: [963], description: 'Enhance clarity' },
      { name: 'Stabilize', duration: 120, beatFrequency: 10, solfeggioLayers: [528], description: 'Ground insights' }
    ],
    color: '#E879F9',
    gradient: 'linear-gradient(135deg, #C026D3 0%, #F0ABFC 100%)',
    timeOfDay: 'anytime',
    intensity: 'gentle'
  },
  {
    id: 'learning-boost',
    name: 'Learning Boost',
    category: 'cognitive',
    subcategory: 'Learning',
    icon: '📖',
    description: 'Alpha-beta transition for optimal learning state.',
    benefits: ['Faster learning', 'Better absorption', 'Enhanced focus', 'Improved retention'],
    duration: 30 * 60,
    phases: [
      { name: 'Ready', duration: 300, beatFrequency: 10, solfeggioLayers: [417], description: 'Prepare to learn' },
      { name: 'Absorb', duration: 900, beatFrequency: 12, solfeggioLayers: [417], description: 'Optimal learning' },
      { name: 'Integrate', duration: 600, beatFrequency: 8, solfeggioLayers: [528], description: 'Process information' }
    ],
    color: '#34D399',
    gradient: 'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },

  // ═══════════════════════════════════════════════════════════════
  // SPIRITUAL / MEDITATIVE PROTOCOLS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'chakra-journey',
    name: 'Chakra Journey',
    category: 'spiritual',
    subcategory: 'Chakras',
    icon: '🌈',
    description: 'Progressive journey through all seven chakras with corresponding Solfeggio frequencies.',
    benefits: ['Energy balancing', 'Chakra alignment', 'Spiritual healing', 'Wholeness'],
    duration: 40 * 60,
    phases: [
      { name: 'Root', duration: 300, beatFrequency: 7.83, solfeggioLayers: [396], description: 'Grounding & security' },
      { name: 'Sacral', duration: 300, beatFrequency: 7.83, solfeggioLayers: [417], description: 'Creativity & emotion' },
      { name: 'Solar Plexus', duration: 300, beatFrequency: 7.83, solfeggioLayers: [528], description: 'Power & will' },
      { name: 'Heart', duration: 420, beatFrequency: 7.83, solfeggioLayers: [639], description: 'Love & connection' },
      { name: 'Throat', duration: 300, beatFrequency: 7.83, solfeggioLayers: [741], description: 'Expression & truth' },
      { name: 'Third Eye', duration: 420, beatFrequency: 7.83, solfeggioLayers: [852], description: 'Intuition & insight' },
      { name: 'Crown', duration: 360, beatFrequency: 7.83, solfeggioLayers: [963], description: 'Divine connection' }
    ],
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 14%, #EAB308 28%, #22C55E 42%, #3B82F6 56%, #8B5CF6 70%, #EC4899 84%, #F472B6 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'third-eye-activation',
    name: 'Third Eye Activation',
    category: 'spiritual',
    subcategory: 'Third Eye',
    icon: '👁️',
    description: 'Theta waves with 852Hz and 963Hz for third eye opening and intuition enhancement.',
    benefits: ['Enhanced intuition', 'Inner vision', 'Expanded perception', 'Spiritual insight'],
    duration: 25 * 60,
    phases: [
      { name: 'Prepare', duration: 300, beatFrequency: 8, solfeggioLayers: [741], description: 'Clear the channel' },
      { name: 'Activate', duration: 900, beatFrequency: 6.5, solfeggioLayers: [852], description: 'Third eye opening' },
      { name: 'Expand', duration: 240, beatFrequency: 5, solfeggioLayers: [852, 963], description: 'Higher vision' },
      { name: 'Ground', duration: 60, beatFrequency: 10, solfeggioLayers: [396], description: 'Return safely' }
    ],
    color: '#4F46E5',
    gradient: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 50%, #C084FC 100%)',
    timeOfDay: 'evening',
    intensity: 'deep'
  },
  {
    id: 'heart-coherence',
    name: 'Heart Coherence',
    category: 'spiritual',
    subcategory: 'Heart',
    icon: '💚',
    description: 'Alpha waves with heart-opening frequencies for coherence and love.',
    benefits: ['Heart-brain coherence', 'Emotional balance', 'Increased compassion', 'Inner peace'],
    duration: 20 * 60,
    phases: [
      { name: 'Center', duration: 240, beatFrequency: 10, solfeggioLayers: [528], description: 'Find your center' },
      { name: 'Open', duration: 660, beatFrequency: 10, solfeggioLayers: [528, 639], description: 'Heart opening' },
      { name: 'Radiate', duration: 300, beatFrequency: 10, solfeggioLayers: [639], description: 'Share love' }
    ],
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #16A34A 0%, #4ADE80 100%)',
    timeOfDay: 'morning',
    intensity: 'gentle'
  },
  {
    id: 'shamanic-journey',
    name: 'Shamanic Journey',
    category: 'spiritual',
    subcategory: 'Shamanic',
    icon: '🦅',
    description: 'Deep theta with rhythmic isochronic pulses simulating shamanic drumming.',
    benefits: ['Altered states', 'Vision quests', 'Spirit connection', 'Inner wisdom'],
    duration: 30 * 60,
    phases: [
      { name: 'Descent', duration: 420, beatFrequency: 6, isochronicRate: 4, description: 'Enter the journey' },
      { name: 'Journey', duration: 1080, beatFrequency: 4.5, isochronicRate: 4.5, solfeggioLayers: [852], description: 'Spirit world' },
      { name: 'Return', duration: 300, beatFrequency: 8, isochronicRate: 0, description: 'Come back safely' }
    ],
    color: '#92400E',
    gradient: 'linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)',
    timeOfDay: 'evening',
    intensity: 'deep'
  },
  {
    id: 'lucid-dream-prep',
    name: 'Lucid Dream Prep',
    category: 'spiritual',
    subcategory: 'Dreams',
    icon: '🌙',
    description: 'Theta waves with isochronic pulses to induce lucid dreaming awareness.',
    benefits: ['Lucid dreaming', 'Dream recall', 'Consciousness in sleep', 'Night exploration'],
    duration: 20 * 60,
    phases: [
      { name: 'Relax', duration: 360, beatFrequency: 8, description: 'Release the day' },
      { name: 'Theta Gate', duration: 540, beatFrequency: 5, isochronicRate: 5, solfeggioLayers: [852], description: 'Approach dream state' },
      { name: 'Lucid Zone', duration: 300, beatFrequency: 4, isochronicRate: 6, description: 'Awareness threshold' }
    ],
    color: '#7C3AED',
    gradient: 'linear-gradient(135deg, #5B21B6 0%, #8B5CF6 50%, #C4B5FD 100%)',
    timeOfDay: 'night',
    intensity: 'deep'
  },

  // ═══════════════════════════════════════════════════════════════
  // ADHD SUPPORT PROTOCOLS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'focus-boost',
    name: 'Focus Boost',
    category: 'adhd',
    subcategory: 'Focus',
    icon: '🚀',
    description: '2-minute gamma burst for instant task initiation and focus activation.',
    benefits: ['Instant focus', 'Task initiation', 'Mental clarity', 'Activation energy'],
    duration: 2 * 60,
    phases: [
      { name: 'Activate', duration: 30, beatFrequency: 20, description: 'Quick activation' },
      { name: 'Peak', duration: 60, beatFrequency: 40, description: 'Gamma burst' },
      { name: 'Sustain', duration: 30, beatFrequency: 18, description: 'Maintain focus' }
    ],
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #D97706 0%, #FBBF24 100%)',
    timeOfDay: 'anytime',
    intensity: 'moderate'
  },
  {
    id: 'overwhelm-reset',
    name: 'Overwhelm Reset',
    category: 'adhd',
    subcategory: 'Regulation',
    icon: '😌',
    description: 'Instant alpha drop with breathing guide for emotional regulation.',
    benefits: ['Reduces overwhelm', 'Emotional reset', 'Calms nervous system', 'Restores control'],
    duration: 3 * 60,
    phases: [
      { name: 'Ground', duration: 45, beatFrequency: 10, solfeggioLayers: [396], description: 'Find your ground' },
      { name: 'Stabilize', duration: 90, beatFrequency: 7.83, solfeggioLayers: [528], description: 'Earth resonance' },
      { name: 'Reset', duration: 45, beatFrequency: 10, description: 'Return balanced' }
    ],
    color: '#06B6D4',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #22D3EE 100%)',
    timeOfDay: 'anytime',
    intensity: 'gentle'
  },
  {
    id: 'transition-help',
    name: 'Transition Helper',
    category: 'adhd',
    subcategory: 'Transitions',
    icon: '🔄',
    description: 'Smooth frequency shift for easier task switching and mental flexibility.',
    benefits: ['Easier transitions', 'Mental flexibility', 'Reduced friction', 'Flow between tasks'],
    duration: 5 * 60,
    phases: [
      { name: 'Release', duration: 90, beatFrequency: 14, description: 'Let go of last task' },
      { name: 'Neutral', duration: 120, beatFrequency: 10, solfeggioLayers: [417], description: 'Clear space' },
      { name: 'Prepare', duration: 90, beatFrequency: 16, description: 'Ready for next' }
    ],
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
    timeOfDay: 'anytime',
    intensity: 'gentle'
  },
  {
    id: 'wind-down',
    name: 'Wind Down',
    category: 'adhd',
    subcategory: 'Transitions',
    icon: '💤',
    description: 'Gradual descent from any state to calm for end of day or work session.',
    benefits: ['Gentle deactivation', 'Stress release', 'Prepares for rest', 'Prevents burnout'],
    duration: 10 * 60,
    phases: [
      { name: 'Slow', duration: 180, beatFrequency: 12, description: 'Begin slowing' },
      { name: 'Calm', duration: 300, beatFrequency: 9, solfeggioLayers: [528], description: 'Deeper relaxation' },
      { name: 'Peace', duration: 120, beatFrequency: 7, solfeggioLayers: [528], description: 'Quiet mind' }
    ],
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)',
    timeOfDay: 'evening',
    intensity: 'gentle'
  },
  {
    id: 'deep-work-session',
    name: 'Deep Work Session',
    category: 'adhd',
    subcategory: 'Focus',
    icon: '🎯',
    description: 'Full 45-minute focus session with built-in warm-up and cool-down.',
    benefits: ['Extended focus', 'Flow state', 'Productive work', 'Healthy transitions'],
    duration: 45 * 60,
    phases: [
      { name: 'Settle', duration: 180, beatFrequency: 10, description: 'Calm the mind' },
      { name: 'Ramp Up', duration: 300, beatFrequency: 14, description: 'Build focus' },
      { name: 'Deep Focus', duration: 1800, beatFrequency: 18, solfeggioLayers: [417], description: 'Peak concentration' },
      { name: 'Wind Down', duration: 300, beatFrequency: 12, description: 'Gentle exit' },
      { name: 'Complete', duration: 120, beatFrequency: 10, solfeggioLayers: [528], description: 'Integration' }
    ],
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  },
  {
    id: 'morning-activation',
    name: 'Morning Activation',
    category: 'adhd',
    subcategory: 'Routines',
    icon: '☀️',
    description: 'Wake up your brain gently and effectively, overcoming sleep inertia.',
    benefits: ['Overcomes sleep inertia', 'Natural awakening', 'Mental alertness', 'Ready for day'],
    duration: 10 * 60,
    phases: [
      { name: 'Wake', duration: 120, beatFrequency: 8, description: 'Gentle waking' },
      { name: 'Energize', duration: 240, beatFrequency: 12, solfeggioLayers: [417], description: 'Building energy' },
      { name: 'Activate', duration: 180, beatFrequency: 16, description: 'Full alertness' },
      { name: 'Ready', duration: 60, beatFrequency: 14, description: 'Sustained energy' }
    ],
    color: '#FBBF24',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FDE047 100%)',
    timeOfDay: 'morning',
    intensity: 'moderate'
  }
];

// Helper functions
export const getProtocolsByCategory = (category: HealingProtocol['category']) =>
  HEALING_PROTOCOLS.filter(p => p.category === category);

export const getProtocolById = (id: string) =>
  HEALING_PROTOCOLS.find(p => p.id === id);

export const getMicroSessions = () =>
  HEALING_PROTOCOLS.filter(p => p.duration <= 300);

export const getQuickTools = () =>
  HEALING_PROTOCOLS.filter(p => p.category === 'adhd' && p.duration <= 600);
