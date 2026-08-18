// Web Audio API based tactile sound feedback
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playClick(type: 'num' | 'op' | 'equal' | 'clear' = 'num') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      let freq = 440;
      let duration = 0.03;
      let volume = 0.04;

      if (type === 'num') {
        freq = 380;
        duration = 0.025;
        volume = 0.03;
        osc.type = 'sine';
      } else if (type === 'op') {
        freq = 520;
        duration = 0.035;
        volume = 0.04;
        osc.type = 'triangle';
      } else if (type === 'equal') {
        freq = 660;
        duration = 0.06;
        volume = 0.06;
        osc.type = 'sine';
      } else if (type === 'clear') {
        freq = 240;
        duration = 0.04;
        volume = 0.04;
        osc.type = 'triangle';
      }

      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio might be blocked on unprompted autoplay
    }
  }
}

export const soundManager = new SoundManager();
