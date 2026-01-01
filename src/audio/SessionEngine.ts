// NeuroHarmonic - Session Engine
// Manages protocol playback with smooth phase transitions

import { audioEngine } from './AudioEngine';
import type { AudioEngineConfig } from './AudioEngine';
import type { HealingProtocol, ProtocolPhase } from '../data/protocols';

export type SessionState = 'idle' | 'playing' | 'paused' | 'morphing' | 'complete';

export interface SessionProgress {
  currentPhaseIndex: number;
  currentPhaseName: string;
  phaseProgress: number; // 0-1
  totalProgress: number; // 0-1
  elapsedTime: number; // seconds
  remainingTime: number; // seconds
  currentFrequency: number;
}

export interface SessionCallbacks {
  onStateChange?: (state: SessionState) => void;
  onProgressUpdate?: (progress: SessionProgress) => void;
  onPhaseChange?: (phase: ProtocolPhase, index: number) => void;
  onComplete?: () => void;
}

export class SessionEngine {
  private protocol: HealingProtocol | null = null;
  private state: SessionState = 'idle';
  private startTime: number = 0;
  private pausedAt: number = 0;
  private currentPhaseIndex: number = 0;
  private phaseStartTime: number = 0;
  private callbacks: SessionCallbacks = {};
  private progressInterval: number | null = null;
  private morphTimeout: number | null = null;

  setCallbacks(callbacks: SessionCallbacks): void {
    this.callbacks = callbacks;
  }

  async startSession(protocol: HealingProtocol): Promise<void> {
    this.protocol = protocol;
    this.currentPhaseIndex = 0;
    this.startTime = Date.now();
    this.phaseStartTime = Date.now();
    
    // Start with first phase
    const firstPhase = protocol.phases[0];
    await this.startPhase(firstPhase);
    
    this.state = 'playing';
    this.callbacks.onStateChange?.(this.state);
    this.callbacks.onPhaseChange?.(firstPhase, 0);
    
    // Start progress tracking
    this.startProgressTracking();
  }

  private async startPhase(phase: ProtocolPhase): Promise<void> {
    const config: Partial<AudioEngineConfig> = {
      binauralBeatFrequency: phase.targetFrequency,
      volume: phase.volume,
      carrierFrequency: phase.carrierFrequency,
      solfeggioFrequency: phase.solfeggioLayer,
      isochronicPulse: phase.isochronicPulse
    };

    if (!audioEngine.getIsPlaying()) {
      await audioEngine.start(config);
    } else {
      // Morph to new phase over 30 seconds (or remaining phase time if less)
      const morphDuration = Math.min(30000, phase.duration * 1000 * 0.3);
      this.state = 'morphing';
      this.callbacks.onStateChange?.(this.state);
      
      await audioEngine.morphTo(config, morphDuration);
      
      this.state = 'playing';
      this.callbacks.onStateChange?.(this.state);
    }
  }

  private startProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.progressInterval = window.setInterval(() => {
      if (this.state !== 'playing' && this.state !== 'morphing') return;
      if (!this.protocol) return;

      const now = Date.now();
      const elapsedTotal = (now - this.startTime) / 1000;
      const elapsedPhase = (now - this.phaseStartTime) / 1000;
      
      const currentPhase = this.protocol.phases[this.currentPhaseIndex];
      const phaseProgress = Math.min(1, elapsedPhase / currentPhase.duration);
      const totalProgress = elapsedTotal / this.protocol.duration;

      // Calculate current interpolated frequency
      let currentFrequency = currentPhase.targetFrequency;
      if (this.currentPhaseIndex > 0) {
        const prevPhase = this.protocol.phases[this.currentPhaseIndex - 1];
        const morphProgress = Math.min(1, elapsedPhase / 30); // 30 second morph
        currentFrequency = prevPhase.targetFrequency + 
          (currentPhase.targetFrequency - prevPhase.targetFrequency) * morphProgress;
      }

      const progress: SessionProgress = {
        currentPhaseIndex: this.currentPhaseIndex,
        currentPhaseName: currentPhase.name,
        phaseProgress,
        totalProgress: Math.min(1, totalProgress),
        elapsedTime: elapsedTotal,
        remainingTime: Math.max(0, this.protocol.duration - elapsedTotal),
        currentFrequency
      };

      this.callbacks.onProgressUpdate?.(progress);

      // Check for phase completion
      if (phaseProgress >= 1) {
        this.advancePhase();
      }
    }, 100);
  }

  private advancePhase(): void {
    if (!this.protocol) return;

    this.currentPhaseIndex++;

    if (this.currentPhaseIndex >= this.protocol.phases.length) {
      this.completeSession();
      return;
    }

    const nextPhase = this.protocol.phases[this.currentPhaseIndex];
    this.phaseStartTime = Date.now();
    this.callbacks.onPhaseChange?.(nextPhase, this.currentPhaseIndex);
    this.startPhase(nextPhase);
  }

  private async completeSession(): Promise<void> {
    this.stopProgressTracking();
    await audioEngine.stop();
    this.state = 'complete';
    this.callbacks.onStateChange?.(this.state);
    this.callbacks.onComplete?.();
  }

  async pause(): Promise<void> {
    if (this.state !== 'playing' && this.state !== 'morphing') return;
    
    this.pausedAt = Date.now();
    await audioEngine.stop();
    this.state = 'paused';
    this.callbacks.onStateChange?.(this.state);
  }

  async resume(): Promise<void> {
    if (this.state !== 'paused' || !this.protocol) return;
    
    // Adjust times for pause duration
    const pauseDuration = Date.now() - this.pausedAt;
    this.startTime += pauseDuration;
    this.phaseStartTime += pauseDuration;
    
    // Restart current phase
    const currentPhase = this.protocol.phases[this.currentPhaseIndex];
    await audioEngine.start({
      binauralBeatFrequency: currentPhase.targetFrequency,
      volume: currentPhase.volume,
      carrierFrequency: currentPhase.carrierFrequency,
      solfeggioFrequency: currentPhase.solfeggioLayer,
      isochronicPulse: currentPhase.isochronicPulse
    });
    
    this.state = 'playing';
    this.callbacks.onStateChange?.(this.state);
  }

  async stop(): Promise<void> {
    this.stopProgressTracking();
    await audioEngine.stop();
    this.state = 'idle';
    this.protocol = null;
    this.callbacks.onStateChange?.(this.state);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.morphTimeout) {
      clearTimeout(this.morphTimeout);
      this.morphTimeout = null;
    }
  }

  getState(): SessionState {
    return this.state;
  }

  getCurrentProtocol(): HealingProtocol | null {
    return this.protocol;
  }
}

export const sessionEngine = new SessionEngine();
