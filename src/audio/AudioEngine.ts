// NeuroHarmonic - Professional Audio Engine
// Real-time binaural beats, isochronic tones, solfeggio frequencies, and noise generation

export interface AudioEngineConfig {
  carrierFrequency: number;      // 100-500 Hz
  beatFrequency: number;         // 0.5-40 Hz (binaural beat)
  volume: number;                // 0-1
  solfeggioFrequencies: number[]; // Active solfeggio layers
  isochronicRate?: number;       // Pulses per second (0 = disabled)
  noiseType?: 'white' | 'pink' | 'brown' | null;
  noiseVolume?: number;
}

export interface ChannelState {
  isPlaying: boolean;
  volume: number;
}

// Solfeggio frequency definitions
export const SOLFEGGIO_FREQUENCIES = {
  174: { name: 'Foundation', description: 'Pain reduction, security' },
  285: { name: 'Quantum Healing', description: 'Tissue regeneration' },
  396: { name: 'Liberation', description: 'Release fear and guilt' },
  417: { name: 'Transformation', description: 'Facilitate change' },
  528: { name: 'Miracle', description: 'DNA repair, love frequency' },
  639: { name: 'Connection', description: 'Harmonize relationships' },
  741: { name: 'Awakening', description: 'Intuition and expression' },
  852: { name: 'Intuition', description: 'Third eye activation' },
  963: { name: 'Divine', description: 'Crown chakra, oneness' }
} as const;

export type SolfeggioHz = keyof typeof SOLFEGGIO_FREQUENCIES;

class AudioEngineClass {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Binaural beat nodes
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  
  // Solfeggio nodes (up to 9 simultaneous)
  private solfeggioOscillators: Map<number, OscillatorNode> = new Map();
  private solfeggioGains: Map<number, GainNode> = new Map();
  private solfeggioMasterGain: GainNode | null = null;
  
  // Isochronic nodes
  private isochronicOscillator: OscillatorNode | null = null;
  private isochronicGain: GainNode | null = null;
  private isochronicLFO: OscillatorNode | null = null;
  private isochronicLFOGain: GainNode | null = null;
  
  // Noise nodes
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseBuffer: { white: AudioBuffer | null; pink: AudioBuffer | null; brown: AudioBuffer | null } = {
    white: null, pink: null, brown: null
  };
  
  // State
  private isPlaying = false;
  private currentConfig: AudioEngineConfig = {
    carrierFrequency: 200,
    beatFrequency: 10,
    volume: 0.5,
    solfeggioFrequencies: [],
    isochronicRate: 0,
    noiseType: null,
    noiseVolume: 0.3
  };
  
  // Fade duration for smooth transitions (seconds)
  private readonly FADE_DURATION = 0.5;
  private readonly MORPH_DURATION = 30; // Default morph time

  // Initialize audio context (call on user interaction)
  async initialize(): Promise<void> {
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return;
    }
    
    this.audioContext = new AudioContext();
    
    // Create master gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.audioContext.destination);
    
    // Pre-generate noise buffers
    this.generateNoiseBuffers();
  }

  private generateNoiseBuffers(): void {
    if (!this.audioContext) return;
    
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = sampleRate * 4; // 4 seconds of noise
    
    // White noise
    const whiteBuffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const whiteData = whiteBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      whiteData[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer.white = whiteBuffer;
    
    // Pink noise (1/f)
    const pinkBuffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const pinkData = pinkBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      pinkData[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    this.noiseBuffer.pink = pinkBuffer;
    
    // Brown noise (1/f²)
    const brownBuffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const brownData = brownBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      brownData[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = brownData[i];
      brownData[i] *= 3.5;
    }
    this.noiseBuffer.brown = brownBuffer;
  }

  // Start audio with configuration
  async start(config?: Partial<AudioEngineConfig>): Promise<void> {
    await this.initialize();
    
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }
    
    if (this.isPlaying) {
      // If already playing, morph to new config
      await this.morphTo(config || {});
      return;
    }
    
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    // Create binaural beat
    this.createBinauralBeat();
    
    // Create solfeggio layer
    this.createSolfeggioLayer();
    
    // Create isochronic if enabled
    if (this.currentConfig.isochronicRate && this.currentConfig.isochronicRate > 0) {
      this.createIsochronicTone();
    }
    
    // Create noise if enabled
    if (this.currentConfig.noiseType) {
      this.createNoiseLayer();
    }
    
    // Fade in master
    this.masterGain!.gain.setValueAtTime(0, now);
    this.masterGain!.gain.linearRampToValueAtTime(
      this.currentConfig.volume,
      now + this.FADE_DURATION
    );
    
    this.isPlaying = true;
  }

  private createBinauralBeat(): void {
    const ctx = this.audioContext!;
    const { carrierFrequency, beatFrequency } = this.currentConfig;
    
    // Create stereo merger for binaural effect
    this.merger = ctx.createChannelMerger(2);
    this.binauralGain = ctx.createGain();
    this.binauralGain.gain.value = 0.6;
    
    // Left oscillator (carrier frequency)
    this.leftOscillator = ctx.createOscillator();
    this.leftOscillator.type = 'sine';
    this.leftOscillator.frequency.value = carrierFrequency;
    
    // Right oscillator (carrier + beat frequency)
    this.rightOscillator = ctx.createOscillator();
    this.rightOscillator.type = 'sine';
    this.rightOscillator.frequency.value = carrierFrequency + beatFrequency;
    
    // Connect: each oscillator to one channel
    this.leftOscillator.connect(this.merger, 0, 0);
    this.rightOscillator.connect(this.merger, 0, 1);
    this.merger.connect(this.binauralGain);
    this.binauralGain.connect(this.masterGain!);
    
    this.leftOscillator.start();
    this.rightOscillator.start();
  }

  private createSolfeggioLayer(): void {
    const ctx = this.audioContext!;
    
    // Master gain for all solfeggio
    this.solfeggioMasterGain = ctx.createGain();
    this.solfeggioMasterGain.gain.value = 0.15;
    this.solfeggioMasterGain.connect(this.masterGain!);
    
    // Create oscillators for each active solfeggio frequency
    for (const freq of this.currentConfig.solfeggioFrequencies) {
      this.addSolfeggioFrequency(freq);
    }
  }

  private addSolfeggioFrequency(freq: number): void {
    if (!this.audioContext || !this.solfeggioMasterGain) return;
    if (this.solfeggioOscillators.has(freq)) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + this.FADE_DURATION);
    
    osc.connect(gain);
    gain.connect(this.solfeggioMasterGain);
    
    osc.start();
    
    this.solfeggioOscillators.set(freq, osc);
    this.solfeggioGains.set(freq, gain);
  }

  private removeSolfeggioFrequency(freq: number): void {
    if (!this.audioContext) return;
    
    const osc = this.solfeggioOscillators.get(freq);
    const gain = this.solfeggioGains.get(freq);
    
    if (osc && gain) {
      const now = this.audioContext.currentTime;
      gain.gain.linearRampToValueAtTime(0, now + this.FADE_DURATION);
      
      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        } catch (e) { /* already stopped */ }
        this.solfeggioOscillators.delete(freq);
        this.solfeggioGains.delete(freq);
      }, this.FADE_DURATION * 1000);
    }
  }

  private createIsochronicTone(): void {
    const ctx = this.audioContext!;
    const { carrierFrequency, isochronicRate } = this.currentConfig;
    
    if (!isochronicRate || isochronicRate <= 0) return;
    
    // Carrier oscillator
    this.isochronicOscillator = ctx.createOscillator();
    this.isochronicOscillator.type = 'sine';
    this.isochronicOscillator.frequency.value = carrierFrequency * 1.5;
    
    // Gain for amplitude modulation
    this.isochronicGain = ctx.createGain();
    this.isochronicGain.gain.value = 0.3;
    
    // LFO for pulsing
    this.isochronicLFO = ctx.createOscillator();
    this.isochronicLFO.type = 'square';
    this.isochronicLFO.frequency.value = isochronicRate;
    
    // LFO gain to control modulation depth
    this.isochronicLFOGain = ctx.createGain();
    this.isochronicLFOGain.gain.value = 0.3;
    
    // Connect LFO to modulate the gain
    this.isochronicLFO.connect(this.isochronicLFOGain);
    this.isochronicLFOGain.connect(this.isochronicGain.gain);
    
    this.isochronicOscillator.connect(this.isochronicGain);
    this.isochronicGain.connect(this.masterGain!);
    
    this.isochronicOscillator.start();
    this.isochronicLFO.start();
  }

  private createNoiseLayer(): void {
    const ctx = this.audioContext!;
    const { noiseType, noiseVolume } = this.currentConfig;
    
    if (!noiseType || !this.noiseBuffer[noiseType]) return;
    
    this.noiseNode = ctx.createBufferSource();
    this.noiseNode.buffer = this.noiseBuffer[noiseType];
    this.noiseNode.loop = true;
    
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = noiseVolume || 0.3;
    
    this.noiseNode.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain!);
    
    this.noiseNode.start();
  }

  // Smooth morph to new configuration
  async morphTo(config: Partial<AudioEngineConfig>, durationSeconds?: number): Promise<void> {
    if (!this.audioContext || !this.isPlaying) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const duration = durationSeconds ?? this.MORPH_DURATION;
    
    // Update config
    const newConfig = { ...this.currentConfig, ...config };
    
    // Morph binaural frequencies
    if (config.carrierFrequency !== undefined || config.beatFrequency !== undefined) {
      const carrier = newConfig.carrierFrequency;
      const beat = newConfig.beatFrequency;
      
      if (this.leftOscillator && this.rightOscillator) {
        this.leftOscillator.frequency.linearRampToValueAtTime(carrier, now + duration);
        this.rightOscillator.frequency.linearRampToValueAtTime(carrier + beat, now + duration);
      }
    }
    
    // Morph volume
    if (config.volume !== undefined && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(config.volume, now + duration);
    }
    
    // Update solfeggio frequencies
    if (config.solfeggioFrequencies !== undefined) {
      const current = new Set(this.currentConfig.solfeggioFrequencies);
      const next = new Set(config.solfeggioFrequencies);
      
      // Remove frequencies no longer needed
      for (const freq of current) {
        if (!next.has(freq)) {
          this.removeSolfeggioFrequency(freq);
        }
      }
      
      // Add new frequencies
      for (const freq of next) {
        if (!current.has(freq)) {
          this.addSolfeggioFrequency(freq);
        }
      }
    }
    
    // Update isochronic rate
    if (config.isochronicRate !== undefined && this.isochronicLFO) {
      if (config.isochronicRate > 0) {
        this.isochronicLFO.frequency.linearRampToValueAtTime(config.isochronicRate, now + duration);
      }
    }
    
    // Update noise
    if (config.noiseType !== undefined && config.noiseType !== this.currentConfig.noiseType) {
      // Fade out current noise
      if (this.noiseGain && this.noiseNode) {
        this.noiseGain.gain.linearRampToValueAtTime(0, now + this.FADE_DURATION);
        const oldNode = this.noiseNode;
        const oldGain = this.noiseGain;
        setTimeout(() => {
          try {
            oldNode.stop();
            oldNode.disconnect();
            oldGain.disconnect();
          } catch (e) { /* already stopped */ }
        }, this.FADE_DURATION * 1000);
      }
      
      // Start new noise type
      if (config.noiseType) {
        this.currentConfig.noiseType = config.noiseType;
        this.createNoiseLayer();
      }
    }
    
    if (config.noiseVolume !== undefined && this.noiseGain) {
      this.noiseGain.gain.linearRampToValueAtTime(config.noiseVolume, now + 0.5);
    }
    
    this.currentConfig = newConfig;
  }

  // Stop all audio with fade out
  async stop(): Promise<void> {
    if (!this.audioContext || !this.isPlaying) return;
    
    const now = this.audioContext.currentTime;
    
    // Fade out master
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, now + this.FADE_DURATION);
    }
    
    // Schedule cleanup after fade
    setTimeout(() => {
      this.cleanup();
    }, this.FADE_DURATION * 1000 + 100);
    
    this.isPlaying = false;
  }

  private cleanup(): void {
    // Stop all oscillators
    const oscillators = [
      this.leftOscillator,
      this.rightOscillator,
      this.isochronicOscillator,
      this.isochronicLFO,
      ...this.solfeggioOscillators.values()
    ];
    
    for (const osc of oscillators) {
      try {
        osc?.stop();
        osc?.disconnect();
      } catch (e) { /* already stopped */ }
    }
    
    // Stop noise
    try {
      this.noiseNode?.stop();
      this.noiseNode?.disconnect();
    } catch (e) { /* already stopped */ }
    
    // Disconnect gains
    const gains = [
      this.binauralGain,
      this.isochronicGain,
      this.isochronicLFOGain,
      this.noiseGain,
      this.solfeggioMasterGain,
      ...this.solfeggioGains.values()
    ];
    
    for (const gain of gains) {
      gain?.disconnect();
    }
    
    this.merger?.disconnect();
    
    // Clear references
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.binauralGain = null;
    this.merger = null;
    this.isochronicOscillator = null;
    this.isochronicGain = null;
    this.isochronicLFO = null;
    this.isochronicLFOGain = null;
    this.noiseNode = null;
    this.noiseGain = null;
    this.solfeggioMasterGain = null;
    this.solfeggioOscillators.clear();
    this.solfeggioGains.clear();
  }

  // Set master volume
  setVolume(volume: number): void {
    if (!this.audioContext || !this.masterGain) return;
    
    const now = this.audioContext.currentTime;
    this.masterGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      now + 0.1
    );
    this.currentConfig.volume = volume;
  }

  // Set noise volume
  setNoiseVolume(volume: number): void {
    if (!this.audioContext || !this.noiseGain) return;
    
    const now = this.audioContext.currentTime;
    this.noiseGain.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, volume)),
      now + 0.1
    );
    this.currentConfig.noiseVolume = volume;
  }

  // Set binaural beat frequency (fast morph)
  setBeatFrequency(freq: number): void {
    if (!this.audioContext || !this.rightOscillator) return;
    
    const now = this.audioContext.currentTime;
    const carrier = this.currentConfig.carrierFrequency;
    this.rightOscillator.frequency.linearRampToValueAtTime(carrier + freq, now + 0.5);
    this.currentConfig.beatFrequency = freq;
  }

  // Set carrier frequency
  setCarrierFrequency(freq: number): void {
    if (!this.audioContext || !this.leftOscillator || !this.rightOscillator) return;
    
    const now = this.audioContext.currentTime;
    const beat = this.currentConfig.beatFrequency;
    this.leftOscillator.frequency.linearRampToValueAtTime(freq, now + 0.5);
    this.rightOscillator.frequency.linearRampToValueAtTime(freq + beat, now + 0.5);
    this.currentConfig.carrierFrequency = freq;
  }

  // Toggle solfeggio frequency
  toggleSolfeggio(freq: number): void {
    const current = new Set(this.currentConfig.solfeggioFrequencies);
    
    if (current.has(freq)) {
      current.delete(freq);
      this.removeSolfeggioFrequency(freq);
    } else {
      current.add(freq);
      this.addSolfeggioFrequency(freq);
    }
    
    this.currentConfig.solfeggioFrequencies = Array.from(current);
  }

  // Set noise type
  setNoiseType(type: 'white' | 'pink' | 'brown' | null): void {
    this.morphTo({ noiseType: type }, 1);
  }

  // Getters
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentConfig(): AudioEngineConfig {
    return { ...this.currentConfig };
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  // Create analyzer for visualizations
  createAnalyzer(): AnalyserNode | null {
    if (!this.audioContext || !this.masterGain) return null;
    
    const analyzer = this.audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    this.masterGain.connect(analyzer);
    return analyzer;
  }
}

// Export singleton
export const AudioEngine = new AudioEngineClass();
