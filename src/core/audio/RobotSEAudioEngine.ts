/**
 * ロボット・モーションスタジオ用 Web Audio 効果音シンセサイザー (OOP設計)
 * 外部音声ファイルへの依存をゼロにし、Web Audio API でリアルタイムに高品質なSEを生成
 */

export type SEType = 'draw' | 'swing' | 'slash' | 'hit' | 'flame' | 'spark';

export class RobotSEAudioEngine {
  private static instance: RobotSEAudioEngine | null = null;
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private constructor() {
    // 遅延初期化
  }

  public static getInstance(): RobotSEAudioEngine {
    if (!RobotSEAudioEngine.instance) {
      RobotSEAudioEngine.instance = new RobotSEAudioEngine();
    }
    return RobotSEAudioEngine.instance;
  }

  /**
   * AudioContextの取得とユーザー操作による解放 (AutoPlay対策)
   */
  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.audioCtx.currentTime);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.audioCtx.currentTime);
    }
  }

  /**
   * SEの再生ディスパッチャー
   */
  public playSE(type: SEType): void {
    if (this.isMuted) return;
    const ctx = this.ensureAudioContext();
    if (!ctx || !this.masterGain) return;

    try {
      switch (type) {
        case 'draw':
          this.playDrawBlade(ctx);
          break;
        case 'swing':
          this.playSwordSwing(ctx);
          break;
        case 'slash':
          this.playFireSlash(ctx);
          break;
        case 'flame':
          this.playFlameIgnition(ctx);
          break;
        case 'hit':
          this.playExplosionHit(ctx);
          break;
        case 'spark':
          this.playSparks(ctx);
          break;
      }
    } catch (e) {
      console.warn('RobotSEAudioEngine playback error:', e);
    }
  }

  /**
   * 1. 抜刀音 (Metallic Blade Draw)
   * 澄んだ金属光沢音：高域サイン波のスイープとディケイ
   */
  private playDrawBlade(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * 2. 剣の風切り音 (Blade Swing Whoosh)
   * バンドパスフィルタノイズによる「ヒュンッ！」という鋭い風切り
   */
  private playSwordSwing(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + 0.22);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.25);
  }

  /**
   * 3. ファイア・スラッシュ斬撃音 (Fire Slash)
   * 鋭いノイズ一閃＋炎のバースト＋ノコギリ波の切り裂き音
   */
  private playFireSlash(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // A. 鋭い金属切り裂きノコギリ波
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.25);

    // B. 火炎斬撃ノイズ
    const dur = 0.35;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + dur);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);

    noiseSource.start(now);
    noiseSource.stop(now + dur);
  }

  /**
   * 4. 炎着火音 (Flame Ignition Aura)
   * 低域の「フォオオッ！」という燃焼サウンド
   */
  private playFlameIgnition(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const dur = 0.45;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.0, now);
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(900, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + dur);
  }

  /**
   * 5. 爆破着弾音 (Explosion Impact Hit)
   * 「ドォン！」という重厚なサブベース＋ノイズインパクト
   */
  private playExplosionHit(ctx: AudioContext): void {
    const now = ctx.currentTime;

    // 重低音サブベース
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    subGain.gain.setValueAtTime(0.7, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain!);
    subOsc.start(now);
    subOsc.stop(now + 0.35);

    // 衝撃ノイズ
    const dur = 0.28;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + dur);
  }

  /**
   * 6. スパーク音 (Sparks)
   */
  private playSparks(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2200, now);
    osc.frequency.setValueAtTime(3400, now + 0.02);
    osc.frequency.setValueAtTime(1800, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain!);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}
