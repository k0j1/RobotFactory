/**
 * 工房パーティクルシステム (WorkshopParticleEngine & WorkshopParticle)
 * 厳格なOOP（オブジェクト指向）原則に基づく設計。
 * 
 * ダッシュボードおよびクラフト（製造）画面において、
 * 木漏れ日や作業場の光に舞う微粒子（floating dust motes）や
 * 柔らかな光のスパーク（light sparks）を優しく上品に描画し、
 * 工房環境の生命感とクラフトマンシップの温もりを演出します。
 */

export interface ParticleConfig {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minSpeedY?: number;
  maxSpeedY?: number;
  colors?: string[];
}

/**
 * 個々の微粒子・光の塵クラス
 */
export class WorkshopParticle {
  public x: number = 0;
  public y: number = 0;
  public size: number = 2;
  public speedX: number = 0;
  public speedY: number = -0.3;
  public opacity: number = 0;
  public maxOpacity: number = 0.5;
  public pulseAngle: number = 0;
  public pulseSpeed: number = 0.02;
  public swayAngle: number = 0;
  public swaySpeed: number = 0.015;
  public swayRadius: number = 0.5;
  public color: string = '245, 195, 95'; // RGB
  public isSpark: boolean = false;

  constructor(private boundsWidth: number, private boundsHeight: number) {
    this.reset(true);
  }

  /**
   * パーティクルの初期化 / 画面外離脱時の再スポーン
   * @param randomY 初回配置時は画面全体にランダム配置
   */
  public reset(randomY: boolean = false): void {
    this.x = Math.random() * this.boundsWidth;
    this.y = randomY ? Math.random() * this.boundsHeight : this.boundsHeight + 10 + Math.random() * 20;
    
    // スパーク（小さな光点）か、ゆったり漂う微粒子（ダストモート）か
    this.isSpark = Math.random() < 0.25;
    
    if (this.isSpark) {
      this.size = 1.0 + Math.random() * 1.8;
      this.maxOpacity = 0.35 + Math.random() * 0.45;
      this.speedY = -(0.3 + Math.random() * 0.45);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.pulseSpeed = 0.04 + Math.random() * 0.06;
      // 輝く琥珀・黄金・温白色
      const sparkColors = ['255, 220, 130', '255, 235, 180', '240, 180, 80'];
      this.color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
    } else {
      this.size = 1.5 + Math.random() * 2.8;
      this.maxOpacity = 0.15 + Math.random() * 0.30;
      this.speedY = -(0.1 + Math.random() * 0.25);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.pulseSpeed = 0.015 + Math.random() * 0.025;
      // 柔らかな工房の陽光ダスト
      const dustColors = ['240, 200, 140', '230, 215, 185', '245, 225, 190'];
      this.color = dustColors[Math.floor(Math.random() * dustColors.length)];
    }

    this.pulseAngle = Math.random() * Math.PI * 2;
    this.swayAngle = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.01 + Math.random() * 0.02;
    this.swayRadius = 0.3 + Math.random() * 0.6;
    this.opacity = 0;
  }

  /**
   * 物理座標と輝度の更新
   */
  public update(): void {
    // 緩やかな左右のゆらぎと上昇
    this.swayAngle += this.swaySpeed;
    this.x += this.speedX + Math.sin(this.swayAngle) * this.swayRadius;
    this.y += this.speedY;

    // 明滅・フェードパルス計算
    this.pulseAngle += this.pulseSpeed;
    const pulseFactor = (Math.sin(this.pulseAngle) + 1) / 2; // 0.0 ~ 1.0
    this.opacity = pulseFactor * this.maxOpacity;

    // 画面上部または左右外への到達判定
    if (this.y < -20 || this.x < -20 || this.x > this.boundsWidth + 20) {
      this.reset(false);
    }
  }

  /**
   * キャンバスへの描画
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.opacity <= 0.01) return;

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    if (this.isSpark) {
      // スパーク用の微細な光彩グロー
      ctx.shadowColor = `rgba(${this.color}, ${this.opacity})`;
      ctx.shadowBlur = 4;
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    } else {
      // 柔らかなダストモート
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    }

    ctx.fill();
    ctx.restore();
  }

  /**
   * 描画境界のリサイズ反映
   */
  public updateBounds(width: number, height: number): void {
    this.boundsWidth = width;
    this.boundsHeight = height;
  }
}

/**
 * パーティクル統括エンジンクラス
 */
export class WorkshopParticleEngine {
  private particles: WorkshopParticle[] = [];
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(private particleCount: number = 28) {}

  /**
   * キャンバスを初期化してパーティクルを生成
   */
  public init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.resize();
    this.initParticles();
  }

  /**
   * パーティクルの初期プール生成
   */
  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new WorkshopParticle(this.width, this.height));
    }
  }

  /**
   * キャンバスサイズを親要素に追従
   */
  public resize(): void {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const dpr = window.devicePixelRatio || 1;
    this.width = Math.max(rect.width, 300);
    this.height = Math.max(rect.height, 400);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }

    this.particles.forEach((p) => p.updateBounds(this.width, this.height));
  }

  /**
   * アニメーションループ開始
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  /**
   * アニメーションループ停止（画面非表示・タブ切り替え時のリソース消費防止）
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * メイン描画ループ (requestAnimationFrame)
   */
  private loop = (): void => {
    if (!this.isRunning) return;

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.update();
        p.draw(this.ctx);
      }
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * 破棄処理
   */
  public destroy(): void {
    this.stop();
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
  }
}
