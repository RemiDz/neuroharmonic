// NeuroHarmonic - Core Audio Engine
// Real-time synthesis of binaural beats, isochronic tones, and healing frequencies

import { DEFAULT_CARRIER_FREQUENCY } from '../data/frequencies';

export interface AudioEngineConfig {
  carrierFrequency: number;
  binauralBeatFrequency: number;
  solfeggioFrequency?: number;
  isochronicPulse?: number;
  volume: number;
  noiseType?: 'white' | 'pink' | 'brown';
  noiseVolume?: number;
}

export interface EnvelopeConfig {
  attack: number;    // seconds
  decay: number;     // seconds
  sustain: number;   // 0-1
  release: number;   // seconds
}

const DEFAULT_ENVELOPE: EnvelopeConfig = {
  attack: 2,
  decay: 0.5,
  sustain: 0.8,
  release: 3
};

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Binaural beat oscillators
  private leftOscillator: OscillatorNode | null = null;
  private rightOscillator: OscillatorNode | null = null;
  private leftGain: GainNode | null = null;
  private rightGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  
  // Solfeggio layer
  private solfeggioOscillator: OscillatorNode | null = null;
  private solfeggioGain: GainNode | null = null;
  
  // Isochronic pulse
  private isochronicOscillator: OscillatorNode | null = null;
  private isochronicGain: GainNode | null = null;
  private isochronicLFO: OscillatorNode | null = null;
  
  // Noise generator
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  
  private isPlaying: boolean = false;
  private currentConfig: AudioEngineConfig = {
    carrierFrequency: DEFAULT_CARRIER_FREQUENCY,
    binauralBeatFrequency: 10,
    volume: 0.5
  };
  
  private envelope: EnvelopeConfig = DEFAULT_ENVELOPE;

  constructor() {
    // AudioContext will be created on first user interaction
  }

  private async initAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private createNoiseBuffer(type: 'white' | 'pink' | 'brown'): AudioBuffer {
    const bufferSize = this.audioContext!.sampleRate * 2;
    const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
    const data = buffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    
    return buffer;
  }

  async start(config?: Partial<AudioEngineConfig>): Promise<void> {
    await this.initAudioContext();
    
    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }
    
    if (this.isPlaying) {
      await this.stop();
    }
    
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    // Create master gain with envelope
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(
      this.currentConfig.volume * this.envelope.sustain,
      now + this.envelope.attack
    );
    this.masterGain.connect(ctx.destination);
    
    // Create binaural beat setup
    this.createBinauralBeat(ctx, now);
    
    // Create solfeggio layer if specified
    if (this.currentConfig.solfeggioFrequency) {
      this.createSolfeggioLayer(ctx, now);
    }
    
    // Create isochronic pulse if specified
    if (this.currentConfig.isochronicPulse) {
      this.createIsochronicTone(ctx, now);
    }
    
    // Create noise layer if specified
    if (this.currentConfig.noiseType && this.currentConfig.noiseVolume) {
      this.createNoiseLayer(ctx, now);
    }
    
    this.isPlaying = true;
  }

  private createBinauralBeat(ctx: AudioContext, now: number): void {
    const { carrierFrequency, binauralBeatFrequency } = this.currentConfig;
    const halfBeat = binauralBeatFrequency / 2;
    
    // Create stereo merger
    this.merger = ctx.createChannelMerger(2);
    this.merger.connect(this.masterGain!);
    
    // Left ear oscillator (carrier - half beat)
    this.leftOscillator = ctx.createOscillator();
    this.leftOscillator.type = 'sine';
    this.leftOscillator.frequency.setValueAtTime(carrierFrequency - halfBeat, now);
    
    this.leftGain = ctx.createGain();
    this.leftGain.gain.setValueAtTime(0.5, now);
    
    this.leftOscillator.connect(this.leftGain);
    this.leftGain.connect(this.merger, 0, 0);
    
    // Right ear oscillator (carrier + half beat)
    this.rightOscillator = ctx.createOscillator();
    this.rightOscillator.type = 'sine';
    this.rightOscillator.frequency.setValueAtTime(carrierFrequency + halfBeat, now);
    
    this.rightGain = ctx.createGain();
    this.rightGain.gain.setValueAtTime(0.5, now);
    
    this.rightOscillator.connect(this.rightGain);
    this.rightGain.connect(this.merger, 0, 1);
    
    this.leftOscillator.start(now);
    this.rightOscillator.start(now);
  }

  private createSolfeggioLayer(ctx: AudioContext, now: number): void {
    this.solfeggioOscillator = ctx.createOscillator();
    this.solfeggioOscillator.type = 'sine';
    this.solfeggioOscillator.frequency.setValueAtTime(this.currentConfig.solfeggioFrequency!, now);
    
    this.solfeggioGain = ctx.createGain();
    this.solfeggioGain.gain.setValueAtTime(0.15, now); // Lower volume for background layer
    
    this.solfeggioOscillator.connect(this.solfeggioGain);
    this.solfeggioGain.connect(this.masterGain!);
    
    this.solfeggioOscillator.start(now);
  }

  private createIsochronicTone(ctx: AudioContext, now: number): void {
    // Carrier for isochronic
    this.isochronicOscillator = ctx.createOscillator();
    this.isochronicOscillator.type = 'sine';
    this.isochronicOscillator.frequency.setValueAtTime(this.currentConfig.carrierFrequency * 1.5, now);
    
    // LFO for pulsing
    this.isochronicLFO = ctx.createOscillator();
    this.isochronicLFO.type = 'square';
    this.isochronicLFO.frequency.setValueAtTime(this.currentConfig.isochronicPulse!, now);
    
    // Gain modulated by LFO
    this.isochronicGain = ctx.createGain();
    this.isochronicGain.gain.setValueAtTime(0.2, now);
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.2, now);
    
    this.isochronicLFO.connect(lfoGain);
    lfoGain.connect(this.isochronicGain.gain);
    
    this.isochronicOscillator.connect(this.isochronicGain);
    this.isochronicGain.connect(this.masterGain!);
    
    this.isochronicOscillator.start(now);
    this.isochronicLFO.start(now);
  }

  private createNoiseLayer(ctx: AudioContext, now: number): void {
    const buffer = this.createNoiseBuffer(this.currentConfig.noiseType!);
    
    this.noiseNode = ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;
    
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(this.currentConfig.noiseVolume!, now);
    
    this.noiseNode.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain!);
    
    this.noiseNode.start(now);
  }

  async stop(): Promise<void> {
    if (!this.isPlaying || !this.audioContext) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Fade out gracefully
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, now + this.envelope.release);
    }
    
    // Schedule stop after release
    setTimeout(() => {
      this.cleanup();
    }, this.envelope.release * 1000);
    
    this.isPlaying = false;
  }

  private cleanup(): void {
    const oscillators = [
      this.leftOscillator,
      this.rightOscillator,
      this.solfeggioOscillator,
      this.isochronicOscillator,
      this.isochronicLFO
    ];
    
    oscillators.forEach(osc => {
      try { osc?.stop(); } catch (e) { /* already stopped */ }
      osc?.disconnect();
    });
    
    try { this.noiseNode?.stop(); } catch (e) { /* already stopped */ }
    this.noiseNode?.disconnect();
    
    const gains = [
      this.leftGain,
      this.rightGain,
      this.solfeggioGain,
      this.isochronicGain,
      this.noiseGain,
      this.masterGain
    ];
    
    gains.forEach(gain => gain?.disconnect());
    this.merger?.disconnect();
    
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.solfeggioOscillator = null;
    this.isochronicOscillator = null;
    this.isochronicLFO = null;
    this.noiseNode = null;
    this.leftGain = null;
    this.rightGain = null;
    this.solfeggioGain = null;
    this.isochronicGain = null;
    this.noiseGain = null;
    this.masterGain = null;
    this.merger = null;
  }

  // Smooth frequency morphing
  async morphTo(
    newConfig: Partial<AudioEngineConfig>,
    durationMs: number = 30000
  ): Promise<void> {
    if (!this.isPlaying || !this.audioContext) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const duration = durationMs / 1000;
    
    if (newConfig.binauralBeatFrequency !== undefined) {
      const newHalfBeat = newConfig.binauralBeatFrequency / 2;
      const carrier = newConfig.carrierFrequency ?? this.currentConfig.carrierFrequency;
      
      this.leftOscillator?.frequency.linearRampToValueAtTime(
        carrier - newHalfBeat,
        now + duration
      );
      this.rightOscillator?.frequency.linearRampToValueAtTime(
        carrier + newHalfBeat,
        now + duration
      );
    }
    
    if (newConfig.carrierFrequency !== undefined) {
      const halfBeat = (newConfig.binauralBeatFrequency ?? this.currentConfig.binauralBeatFrequency) / 2;
      
      this.leftOscillator?.frequency.linearRampToValueAtTime(
        newConfig.carrierFrequency - halfBeat,
        now + duration
      );
      this.rightOscillator?.frequency.linearRampToValueAtTime(
        newConfig.carrierFrequency + halfBeat,
        now + duration
      );
    }
    
    if (newConfig.volume !== undefined) {
      this.masterGain?.gain.linearRampToValueAtTime(
        newConfig.volume * this.envelope.sustain,
        now + duration
      );
    }
    
    if (newConfig.solfeggioFrequency !== undefined) {
      if (this.solfeggioOscillator) {
        this.solfeggioOscillator.frequency.linearRampToValueAtTime(
          newConfig.solfeggioFrequency,
          now + duration
        );
      } else {
        // Create new solfeggio layer
        this.createSolfeggioLayer(ctx, now);
        this.solfeggioGain?.gain.setValueAtTime(0, now);
        this.solfeggioGain?.gain.linearRampToValueAtTime(0.15, now + duration);
      }
    }
    
    if (newConfig.isochronicPulse !== undefined && this.isochronicLFO) {
      this.isochronicLFO.frequency.linearRampToValueAtTime(
        newConfig.isochronicPulse,
        now + duration
      );
    }
    
    this.currentConfig = { ...this.currentConfig, ...newConfig };
  }

  // Quick volume adjustment
  setVolume(volume: number): void {
    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(
        volume * this.envelope.sustain,
        now + 0.1
      );
      this.currentConfig.volume = volume;
    }
  }

  setNoiseVolume(volume: number): void {
    if (this.noiseGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.noiseGain.gain.linearRampToValueAtTime(volume, now + 0.1);
      this.currentConfig.noiseVolume = volume;
    }
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

  // Breath synchronization - subtle pitch modulation
  async breathSync(isInhale: boolean, durationMs: number): Promise<void> {
    if (!this.isPlaying || !this.audioContext) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const duration = durationMs / 1000;
    
    const pitchShift = isInhale ? 1.02 : 0.98; // 2% pitch variation
    const targetFreq = this.currentConfig.carrierFrequency * pitchShift;
    const halfBeat = this.currentConfig.binauralBeatFrequency / 2;
    
    this.leftOscillator?.frequency.linearRampToValueAtTime(
      targetFreq - halfBeat,
      now + duration
    );
    this.rightOscillator?.frequency.linearRampToValueAtTime(
      targetFreq + halfBeat,
      now + duration
    );
  }

  // Reset breath sync
  async resetBreathSync(): Promise<void> {
    if (!this.isPlaying || !this.audioContext) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const halfBeat = this.currentConfig.binauralBeatFrequency / 2;
    const carrier = this.currentConfig.carrierFrequency;
    
    this.leftOscillator?.frequency.linearRampToValueAtTime(carrier - halfBeat, now + 0.5);
    this.rightOscillator?.frequency.linearRampToValueAtTime(carrier + halfBeat, now + 0.5);
  }

  // Get current frequency data for visualizations
  getFrequencyData(): Uint8Array | null {
    if (!this.audioContext || !this.masterGain) return null;
    
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;
    this.masterGain.connect(analyser);
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    return dataArray;
  }
}

// Singleton instance
export const audioEngine = new AudioEngine();
