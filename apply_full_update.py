import re

with open('src/core/animations/GSAPRobotAnimator.ts', 'r') as f:
    code = f.read()

# 1. Insert helper functions before export class BaseRobotAnimation or at appropriate position
helpers_code = """
// ----------------------------------------------------------------------
// AT-Field 幾何学力場バリアエフェクト
// ----------------------------------------------------------------------
export function mountATFieldBarrierEffect(container: HTMLElement, options: { sizePercent?: number } = {}): any {
  const wrapper = document.createElement('div');
  const id = 'at_' + Math.random().toString(36).substring(2, 7);
  const size = options.sizePercent || 120;

  wrapper.className = 'absolute pointer-events-none will-change-transform flex items-center justify-center';
  wrapper.style.width = `${size}%`;
  wrapper.style.height = `${size}%`;
  wrapper.style.left = `${(100 - size) / 2}%`;
  wrapper.style.top = `${(100 - size) / 2}%`;
  wrapper.style.zIndex = '35';
  wrapper.style.opacity = '0';
  wrapper.style.transform = 'scale(0.3)';

  wrapper.innerHTML = `
    <svg viewBox="0 0 400 400" class="w-full h-full filter drop-shadow-[0_0_24px_#f59e0b] drop-shadow-[0_0_45px_#ea580c]">
      <defs>
        <!-- ATフィールド 黄金・琥珀グラデーション -->
        <linearGradient id="${id}-at-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98" />
          <stop offset="25%" stop-color="#fef08a" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.75" />
          <stop offset="90%" stop-color="#ea580c" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#c2410c" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="${id}-at-inner" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.35" />
          <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.3" />
        </linearGradient>

        <!-- 位相干渉縞パターン -->
        <pattern id="${id}-phase-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fef08a" stroke-width="0.8" stroke-opacity="0.45" />
        </pattern>
      </defs>

      <!-- 1. 最外周 ATフィールド 正八角形障壁 -->
      <polygon points="120,20 280,20 380,120 380,280 280,380 120,380 20,280 20,120"
        fill="url(#${id}-at-inner)" stroke="url(#${id}-at-grad)" stroke-width="7.5" stroke-linejoin="round" />
      
      <!-- 位相グリッドオーバーレイ -->
      <polygon points="120,20 280,20 380,120 380,280 280,380 120,380 20,280 20,120"
        fill="url(#${id}-phase-grid)" opacity="0.65" />

      <!-- 2. 中間 同心八角形リング -->
      <polygon points="135,55 265,55 345,135 345,265 265,345 135,345 55,265 55,135"
        fill="none" stroke="#fde047" stroke-width="3.5" stroke-dasharray="16,8" opacity="0.95" />

      <!-- 3. 内側 同心八角形コア防壁 -->
      <polygon points="150,90 250,90 310,150 310,250 250,310 150,310 90,250 90,150"
        fill="none" stroke="#ffffff" stroke-width="3.2" opacity="0.9" />

      <!-- 4. 放射状エネルギーリブ・幾何学力場ライン -->
      <line x1="20" y1="120" x2="90" y2="150" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="20" y1="280" x2="90" y2="250" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="380" y1="120" x2="310" y2="150" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="380" y1="280" x2="310" y2="250" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="120" y1="20" x2="150" y2="90" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="280" y1="20" x2="250" y2="90" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="120" y1="380" x2="150" y2="310" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />
      <line x1="280" y1="380" x2="250" y2="310" stroke="#fef08a" stroke-width="3" stroke-linecap="round" />

      <!-- 5. 8隅の位相アンカーノード -->
      <circle cx="120" cy="20" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="280" cy="20" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="380" cy="120" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="380" cy="280" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="280" cy="380" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="120" cy="380" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="20" cy="280" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
      <circle cx="20" cy="120" r="5.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />

      <!-- 6. 中央エネルギーコア -->
      <circle cx="200" cy="200" r="20" fill="#ffffff" opacity="0.9" />
      <polygon points="190,172 210,172 228,190 228,210 210,228 190,228 172,210 172,190"
        fill="none" stroke="#f59e0b" stroke-width="2.5" />
    </svg>
  `;

  container.appendChild(wrapper);
  return {
    wrapper,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };
}

// ----------------------------------------------------------------------
// 8連装フルバースト・スマートミサイルエフェクト
// ----------------------------------------------------------------------
export function mountEightMissileBarrageEffect(container: HTMLElement): any {
  const wrapper = document.createElement('div');
  wrapper.className = 'absolute inset-0 pointer-events-none z-30 overflow-visible';
  
  // 8発のミサイル定義（左右背中ポッドから4発ずつ）
  const missiles: Array<{
    el: HTMLElement;
    body: SVGElement;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    arcY: number;
    rot: number;
    delay: number;
  }> = [];

  const missileConfigs = [
    // 左背部ポッド 4発 (奇数)
    { startX: 26, startY: 18, targetX: 240, targetY: -80, arcY: -140, rot: -45, delay: 0.0 },
    { startX: 22, startY: 24, targetX: 260, targetY: -30, arcY: -110, rot: -30, delay: 0.12 },
    { startX: 18, startY: 30, targetX: 280, targetY: 20, arcY: -80, rot: -15, delay: 0.24 },
    { startX: 14, startY: 36, targetX: 250, targetY: 70, arcY: -50, rot: 5, delay: 0.36 },
    // 右背部ポッド 4発 (偶数)
    { startX: 74, startY: 18, targetX: 270, targetY: -110, arcY: -160, rot: -50, delay: 0.06 },
    { startX: 78, startY: 24, targetX: 290, targetY: -50, arcY: -130, rot: -35, delay: 0.18 },
    { startX: 82, startY: 30, targetX: 310, targetY: 0, arcY: -100, rot: -20, delay: 0.30 },
    { startX: 86, startY: 36, targetX: 290, targetY: 50, arcY: -65, rot: 0, delay: 0.42 },
  ];

  missileConfigs.forEach((cfg, idx) => {
    const mDiv = document.createElement('div');
    const mid = `m_${idx}_` + Math.random().toString(36).substring(2, 6);
    mDiv.className = 'absolute w-12 h-6 pointer-events-none will-change-transform';
    mDiv.style.left = `${cfg.startX}%`;
    mDiv.style.top = `${cfg.startY}%`;
    mDiv.style.opacity = '0';
    mDiv.style.transform = 'scale(0.4)';
    mDiv.style.filter = 'drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 16px #f97316)';

    mDiv.innerHTML = `
      <svg viewBox="0 0 120 40" class="w-full h-full">
        <defs>
          <linearGradient id="${mid}-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="30%" stop-color="#e2e8f0" />
            <stop offset="70%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#ef4444" />
          </linearGradient>
          <linearGradient id="${mid}-flame" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="40%" stop-color="#f97316" />
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- 推進バーニア炎 -->
        <polygon points="15,20 0,10 5,20 0,30" fill="url(#${mid}-flame)" />
        <!-- ミサイル本体 -->
        <path d="M 15,12 L 80,10 L 105,20 L 80,30 L 15,28 Z" fill="url(#${mid}-body)" stroke="#0f172a" stroke-width="2" />
        <!-- 弾頭ノーズコーン -->
        <path d="M 80,10 L 105,20 L 80,30 Z" fill="#ef4444" />
        <!-- 安定尾翼 -->
        <polygon points="18,12 8,2 25,12" fill="#3b82f6" />
        <polygon points="18,28 8,38 25,28" fill="#3b82f6" />
        <line x1="45" y1="11" x2="45" y2="29" stroke="#0f172a" stroke-width="2" />
        <circle cx="75" cy="20" r="2.5" fill="#fef08a" />
      </svg>
    `;

    wrapper.appendChild(mDiv);
    missiles.push({
      el: mDiv,
      body: mDiv.querySelector('svg')!,
      ...cfg
    });
  });

  container.appendChild(wrapper);
  return {
    wrapper,
    missiles,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };
}

// ----------------------------------------------------------------------
// 紅蓮・突進突き 直線火炎貫通衝撃波エフェクト
// ----------------------------------------------------------------------
export function mountFlamePierceShockwaveEffect(container: HTMLElement): any {
  const wrapper = document.createElement('div');
  const id = 'fp_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none z-30 opacity-0 will-change-transform flex items-center justify-center';

  wrapper.innerHTML = `
    <svg viewBox="0 0 500 200" class="w-full h-full filter drop-shadow-[0_0_25px_#f97316] drop-shadow-[0_0_40px_#ef4444]">
      <defs>
        <!-- 突進貫通ビームランス -->
        <linearGradient id="${id}-thrust-lance" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="25%" stop-color="#fde047" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#ea580c" stop-opacity="0.85" />
          <stop offset="90%" stop-color="#dc2626" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- 1. 水平貫通火炎ショックウェーブコーン -->
      <polygon points="160,100 480,40 460,100 480,160" fill="url(#${id}-thrust-lance)" />
      <!-- 2. 直線貫通レーザー芯線 -->
      <line x1="160" y1="100" x2="495" y2="100" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
      <!-- 3. 環状衝撃波リング（突進マッハリング） -->
      <ellipse cx="230" cy="100" rx="14" ry="48" fill="none" stroke="#fef08a" stroke-width="4.5" opacity="0.95" />
      <ellipse cx="320" cy="100" rx="18" ry="64" fill="none" stroke="#f97316" stroke-width="3.5" opacity="0.8" />
      <!-- 4. 貫通先端スパークバースト -->
      <polygon points="495,100 470,80 480,100 470,120" fill="#ffffff" />
      <circle cx="490" cy="100" r="15" fill="#fde047" opacity="0.85" />
    </svg>
  `;

  container.appendChild(wrapper);
  return {
    wrapper,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };
}

// ----------------------------------------------------------------------
// ビームサーベル・断空斬 正面斬撃一閃エフェクト
// ----------------------------------------------------------------------
export function mountFrontalSlashCutEffect(container: HTMLElement): any {
  const wrapper = document.createElement('div');
  const id = 'fsc_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none z-30 opacity-0 will-change-transform flex items-center justify-center';

  wrapper.innerHTML = `
    <svg viewBox="0 0 400 400" class="w-full h-full filter drop-shadow-[0_0_30px_#06b6d4] drop-shadow-[0_0_50px_#38bdf8]">
      <defs>
        <!-- 正面両断シアンブレード閃光 -->
        <linearGradient id="${id}-front-cut" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="30%" stop-color="#67e8f9" stop-opacity="0.95" />
          <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- 1. 正面鋭角両断アーク三日月 -->
      <path d="M 280,40 C 260,140 210,260 90,360 C 140,260 210,140 280,40 Z" fill="url(#${id}-front-cut)" />
      <!-- 2. 超高輝度ホワイトコア切断線 -->
      <path d="M 275,45 C 255,145 205,260 95,355" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" fill="none" />
      <!-- 3. 放電プラズマ放熱ライン -->
      <line x1="200" y1="180" x2="270" y2="150" stroke="#a5f3fc" stroke-width="3" stroke-linecap="round" />
      <line x1="160" y1="240" x2="120" y2="280" stroke="#a5f3fc" stroke-width="3" stroke-linecap="round" />
      <circle cx="210" cy="180" r="12" fill="#ffffff" />
    </svg>
  `;

  container.appendChild(wrapper);
  return {
    wrapper,
    cleanup: () => {
      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    }
  };
}
"""

# Place helpers before export abstract class BaseRobotAnimation
if "export function mountATFieldBarrierEffect" not in code:
    code = code.replace("export abstract class BaseRobotAnimation", helpers_code + "\n\nexport abstract class BaseRobotAnimation")

# 2. Update ShieldBarrierAnimation
shield_barrier_code = """export class ShieldBarrierAnimation extends BaseRobotAnimation {
  id = 'shield_barrier';
  name = 'エネルギーシールド防御 (Shield Barrier)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.8;
  loop = true;
  description = '両腕を前面に構え、機体全周に黄金色の幾何学力場【ATフィールド】を展開して敵の攻撃を完全遮断。';
  technicalHighlights = [
    '機体全周への幾何学ATフィールド正八角形力場展開 (mountATFieldBarrierEffect)',
    '左右アームの前面クロスガード支持フォーム',
    '被弾インパクト時の位相力場反発＆光波パルス'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: 'クロスガード構え・力場励起', type: 'draw' },
    { time: 0.35, label: '【展開】ATフィールド防壁展開！', type: 'charge' },
    { time: 0.85, label: '敵弾直撃・幾何学力場反発ガード！', type: 'hit' },
    { time: 1.35, label: '位相干渉減衰・通常復帰', type: 'draw' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let barrier: any = null;
    if (fxContainer && typeof document !== 'undefined') {
      barrier = mountATFieldBarrierEffect(fxContainer, { sizePercent: 125 });
    }

    tl.eventCallback('onComplete', () => {
      barrier?.cleanup?.();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.8, scale: 1.25, duration: 0.35, ease: 'power2.out' }, 0.25);
    }

    // 1. 防御態勢：腰を落とし、両腕を前面に展開してクロスガード
    tl.to(container, { y: 4, scaleY: 0.95, duration: 0.2, ease: 'power2.in' });
    if (body) tl.to(body, { scale: 0.96, y: 2, duration: 0.2 }, '<');
    if (head) tl.to(head, { y: 4, scale: 0.92, duration: 0.2 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: -14, scaleY: 0.9, y: 3, duration: 0.2 }, '<');
    if (legRight) tl.to(legRight, { skewX: 14, scaleY: 0.9, y: 3, duration: 0.2 }, '<');
    if (!legLeft && !legRight && legs) tl.to(legs, { scaleY: 0.88, y: 4, duration: 0.2 }, '<');

    if (armLeft) tl.to(armLeft, { rotation: 40, x: 12, y: -6, scale: 1.15, duration: 0.22, ease: 'back.out(2)' }, '<');
    if (armRight) tl.to(armRight, { rotation: -30, x: -8, y: -2, duration: 0.22 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 35, scaleX: 1.2, y: -4, duration: 0.22 }, '<');

    // 2. ATフィールド幾何学力場が瞬時に展開・拡大！
    if (barrier) {
      tl.to(barrier.wrapper, { opacity: 1, scale: 1.08, duration: 0.22, ease: 'back.out(2.5)' }, '>-0.05');
      tl.to(barrier.wrapper, { scale: 1.0, duration: 0.15, ease: 'power2.out' }, '>');
    }

    // 3. 敵弾直撃！力場が強くたわみ、反発して衝撃を完全無効化
    tl.to(container, { x: -7, duration: 0.08, ease: 'power4.out' }, '+0.2');
    if (barrier) {
      tl.to(barrier.wrapper, { scale: 1.14, duration: 0.08, ease: 'power4.out' }, '<');
      tl.to(barrier.wrapper, { scale: 1.0, duration: 0.25, ease: 'elastic.out(1, 0.4)' }, '>');
    }
    tl.to(container, { x: 0, duration: 0.25, ease: 'elastic.out(1, 0.4)' }, '<');

    // 4. 力場維持＆余韻
    tl.to({}, { duration: 0.25 });

    // 5. ATフィールド収束＆基本姿勢復帰
    if (barrier) {
      tl.to(barrier.wrapper, { opacity: 0, scale: 0.7, duration: 0.3, ease: 'power2.in' }, '>');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, duration: 0.25 }, '<');
    }

    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, '<');
  }
}"""

# Replace ShieldBarrierAnimation
code = re.sub(r'export class ShieldBarrierAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', shield_barrier_code, code)

# 3. Update ShieldBlockItemAnimation
shield_block_code = """export class ShieldBlockItemAnimation extends BaseRobotAnimation {
  id = 'shield_block_item';
  name = '要塞ナノバリア (Nano Barrier)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.6;
  loop = true;
  description = '左腕のナノマテリアル防壁から全方位ATフィールド力場を展開し、あらゆる被弾を跳ね返す。';
  technicalHighlights = ['全方位幾何学ATフィールド展開', '被弾時の弾性反発ガード'];
  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;
    let barrier: any = null;
    if (fxContainer && typeof document !== 'undefined') {
      barrier = mountATFieldBarrierEffect(fxContainer, { sizePercent: 120 });
    }
    tl.eventCallback('onComplete', () => {
      barrier?.cleanup?.();
    });
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.7, scale: 1.2, duration: 0.3 }, 0.2);
    }
    tl.to(container, { y: 4, duration: 0.2 });
    if (armLeft) tl.to(armLeft, { rotation: 45, x: 10, y: -8, scale: 1.2, duration: 0.2, ease: 'back.out(2)' }, '<');
    if (barrier) {
      tl.to(barrier.wrapper, { opacity: 1, scale: 1.0, duration: 0.22, ease: 'back.out(2)' }, '>');
    }
    tl.to(container, { x: 8, duration: 0.08, ease: 'power4.out' }, '+0.25');
    if (barrier) {
      tl.to(barrier.wrapper, { scale: 1.12, duration: 0.08 }, '<');
      tl.to(barrier.wrapper, { scale: 1.0, duration: 0.2 }, '>');
    }
    tl.to(container, { x: 0, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, '<');
    if (barrier) {
      tl.to(barrier.wrapper, { opacity: 0, scale: 0.6, duration: 0.25 }, '+0.15');
    }
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, duration: 0.2 }, '<');
    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.3, ease: 'power2.inOut' }, '>');
  }
}"""
code = re.sub(r'export class ShieldBlockItemAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', shield_block_code, code)

# 4. Update MissileBarrageAnimation (8 Missiles from back)
missile_barrage_code = """export class MissileBarrageAnimation extends BaseRobotAnimation {
  id = 'missile_barrage';
  name = 'フルバースト・ミサイル (Missile Barrage)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.4;
  loop = true;
  description = '背部ウェポンコンテナのハッチを全開にし、8発のスマート誘導ミサイルを天空へ一斉射出！広域絨毯爆撃を敢行する。';
  technicalHighlights = [
    '背部左右ポッドからの8発連続スマートミサイル射出 (mountEightMissileBarrageEffect)',
    'ミサイルごとの独立放物線弾道＆噴射ジェットスモーク',
    '発射時の反動シェイク＆広角フルオープンポーズ'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: '背部ミサイルハッチ開放', type: 'draw' },
    { time: 0.35, label: '1〜2発目・背部発射！', type: 'slash' },
    { time: 0.50, label: '3〜4発目・斉射！', type: 'slash' },
    { time: 0.65, label: '5〜6発目・連射！', type: 'slash' },
    { time: 0.80, label: '7〜8発目・フルバースト！', type: 'flame' },
    { time: 1.35, label: '全弾目標着弾・大爆発！', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let barrageFx: any = null;
    if (fxContainer && typeof document !== 'undefined') {
      barrageFx = mountEightMissileBarrageEffect(fxContainer);
    }

    tl.eventCallback('onComplete', () => {
      barrageFx?.cleanup?.();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.85, scale: 1.3, duration: 0.4 }, 0.2);
    }

    // 1. ハッチ開放＆踏ん張りフォーム（両腕を外側に展開、脚部をしっかり固定）
    tl.to(container, { y: 6, scaleY: 0.94, duration: 0.25, ease: 'power2.out' });
    if (head) tl.to(head, { y: 2, rotation: -12, duration: 0.25 }, '<');
    if (legLeft) tl.to(legLeft, { x: -10, rotation: -12, scaleY: 0.88, duration: 0.25 }, '<');
    if (legRight) tl.to(legRight, { x: 10, rotation: 12, scaleY: 0.88, duration: 0.25 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -110, x: -16, y: -6, duration: 0.3, ease: 'back.out(1.5)' }, '<');
    if (armRight) tl.to(armRight, { rotation: 110, x: 16, y: -6, duration: 0.3, ease: 'back.out(1.5)' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { scaleX: 1.25, y: -4, duration: 0.3 }, '<');

    // 2. 8発のミサイルが背中から連続発射！
    if (barrageFx && barrageFx.missiles) {
      barrageFx.missiles.forEach((m: any) => {
        const fireTime = 0.35 + m.delay;
        tl.to(m.el, {
          opacity: 1,
          scale: 1.0,
          duration: 0.06,
          ease: 'power1.out'
        }, fireTime);

        tl.to(m.el, {
          x: m.targetX,
          duration: 0.65,
          ease: 'power1.in'
        }, fireTime);

        tl.to(m.el, {
          y: m.arcY,
          duration: 0.28,
          ease: 'power2.out'
        }, fireTime);

        tl.to(m.el, {
          rotation: m.rot,
          duration: 0.28,
          ease: 'power2.out'
        }, fireTime);

        tl.to(m.el, {
          y: m.targetY,
          duration: 0.37,
          ease: 'power2.in'
        }, fireTime + 0.28);

        tl.to(m.el, {
          rotation: m.rot + 40,
          duration: 0.37,
          ease: 'power2.in'
        }, fireTime + 0.28);

        tl.to(m.el, {
          opacity: 0,
          scale: 1.6,
          duration: 0.12,
          ease: 'power4.out'
        }, fireTime + 0.62);
      });
    }

    // 3. 発射反動シェイク
    tl.to(container, {
      x: 'random(-4, 4)',
      y: 'random(4, 9)',
      repeat: 12,
      duration: 0.05,
      ease: 'none'
    }, 0.35);

    // 4. 爆発着弾シェイク
    tl.to(container, {
      x: 'random(-5, 5)',
      y: 'random(-3, 3)',
      repeat: 8,
      duration: 0.04,
      ease: 'none'
    }, 1.3);

    // 5. 復帰
    tl.to({}, { duration: 0.35 });
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 1, duration: 0.3 }, '<');
    }

    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.45,
      ease: 'power2.out'
    }, '>');
  }
}"""
code = re.sub(r'export class MissileBarrageAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', missile_barrage_code, code)

# 5. Update FlameBladeThrustAnimation (伸張刺突)
flame_thrust_code = """export class FlameBladeThrustAnimation extends BaseRobotAnimation {
  id = 'flame_blade_thrust';
  name = '紅蓮・突進突き (Flame Blade Thrust)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.6;
  loop = true;
  description = '剣を持った右腕を真っ直ぐ相手へ限界まで伸ばし、全身のブースト推進力で超高速突進して装甲を貫通する紅蓮の必殺刺突撃！';
  technicalHighlights = [
    '剣を持つ腕を真正面へフル伸長する直線刺突フォーム (Arm Extension & Horizontal Blade)',
    '後方タメからの超高速ロケット推進突進 (Container X: +55px)',
    '刀身先端からの直線火炎貫通衝撃波 (mountFlamePierceShockwaveEffect)'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: '炎刃抜刀・刺突引き絞り', type: 'draw' },
    { time: 0.35, label: 'バーニア点火・突進開始！', type: 'flame' },
    { time: 0.55, label: '【紅蓮一閃】腕を伸ばし急所刺突貫通！', type: 'slash' },
    { time: 0.80, label: '装甲破砕・火炎バースト！', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let blade: any = null;
    let pierceFx: any = null;
    let shatterFx: any = null;

    if (fxContainer && typeof document !== 'undefined') {
      blade = mountPlasmaBlade(fxContainer, {
        hand: 'right',
        sizePercent: 62,
        initialRotation: 85,
        withHandGrip: true,
        armPartKey: refs.armPartKey
      });
      pierceFx = mountFlamePierceShockwaveEffect(fxContainer);
      shatterFx = mountGroundShatterEffect(fxContainer);
      tl.set(blade.wrapper, { opacity: 1 });
      tl.set(blade.el, { opacity: 0 });
    }

    tl.eventCallback('onComplete', () => {
      blade?.cleanup?.();
      pierceFx?.cleanup?.();
      shatterFx?.cleanup?.();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.75, scale: 1.25, duration: 0.3 }, 0.25);
    }

    // 1. タメ姿勢：右腕を後ろへ引き絞り、剣先を正面に向ける
    tl.to(container, { x: -16, y: 3, skewX: 12, scaleX: 0.96, duration: 0.28, ease: 'power2.in' });
    if (head) tl.to(head, { rotation: -12, x: -3, duration: 0.28 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: 14, scaleY: 0.92, duration: 0.28 }, '<');
    if (legRight) tl.to(legRight, { skewX: -8, scaleY: 0.92, duration: 0.28 }, '<');

    if (armRight) tl.to(armRight, { rotation: 15, x: -10, y: 2, duration: 0.28 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -40, x: -8, duration: 0.28 }, '<');
    if (blade) {
      tl.to(blade.wrapper, { rotation: 15, x: -10, y: 2, duration: 0.28 }, '<');
      tl.to(blade.el, { opacity: 1, rotation: 80, duration: 0.2 }, '<');
    }

    // 2. 超高速突進！剣を持った腕を真っ直ぐ相手に向けて最大限伸ばす！
    tl.to(container, {
      x: 55, y: -2, scaleX: 1.15, skewX: -16, duration: 0.16, ease: 'power4.out'
    }, '>');
    if (head) tl.to(head, { rotation: 15, x: 8, duration: 0.16 }, '<');

    if (armRight) {
      tl.to(armRight, {
        rotation: 8, x: 42, y: -4, scaleX: 1.25, duration: 0.16, ease: 'power4.out'
      }, '<');
    }
    if (blade) {
      tl.to(blade.wrapper, {
        rotation: 8, x: 42, y: -4, duration: 0.16, ease: 'power4.out'
      }, '<');
      tl.to(blade.el, {
        rotation: 90, scale: 1.2, duration: 0.16, ease: 'power4.out'
      }, '<');
    }
    if (armLeft) tl.to(armLeft, { rotation: -60, x: -12, duration: 0.16 }, '<');

    // 3. 直線貫通火炎ショックウェーブ炸裂！
    if (pierceFx) {
      tl.to(pierceFx.wrapper, { opacity: 1, scaleX: 1.3, duration: 0.08, ease: 'power4.out' }, '<0.02');
      tl.to(pierceFx.wrapper, { opacity: 0, scaleX: 1.6, duration: 0.22, ease: 'power2.out' }, '>');
    }
    if (shatterFx) {
      tl.to(shatterFx.el, { opacity: 1, scale: 1.2, duration: 0.08 }, '<');
      tl.to(shatterFx.el, { opacity: 0, scale: 1.5, duration: 0.25 }, '>');
    }

    // 4. 貫通インパクト画面振動
    tl.to(container, { x: '+=3', y: '+=2', repeat: 4, yoyo: true, duration: 0.035, ease: 'rough' }, '<-0.1');

    // 5. 突き刺し後の残心
    tl.to({}, { duration: 0.25 });

    // 6. 腕を引き、基本姿勢へ復帰
    if (blade) {
      tl.to(blade.el, { opacity: 0, duration: 0.2 }, '>');
      tl.to(blade.wrapper, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power2.out' }, '<');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, duration: 0.25 }, '<');
    }

    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, '<');
  }
}"""
code = re.sub(r'export class FlameBladeThrustAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', flame_thrust_code, code)

# 6. Update BeamSaberJudgementAnimation (正面両断一閃)
beam_saber_code = """export class BeamSaberJudgementAnimation extends BaseRobotAnimation {
  id = 'beam_saber_judgement';
  name = 'ビームサーベル・断空斬 (Saber Judgement)';
  category = RobotAnimationCategory.COMBAT;
  duration = 1.7;
  loop = true;
  description = '剣を持った腕を正面へ真っ直ぐ伸ばし、高出力プラズマブレードでロボットの正面空間を一刀両断に鋭く切り裂く一閃！';
  technicalHighlights = [
    '剣を持つ腕を正面へ伸ばし、正面空間を鋭角両断する斬撃スイング (Frontal Slash)',
    'ロボット正面に展開する超高輝度プラズマ切断線 (mountFrontalSlashCutEffect)',
    '正面一閃時の火花スパーク＆踏み込み体重移動'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: 'サーベル抜刀・正面構え', type: 'draw' },
    { time: 0.35, label: '極限プラズマ励起', type: 'flame' },
    { time: 0.55, label: '【断空斬】腕を伸ばし正面空間を一刀両断！', type: 'slash' },
    { time: 0.80, label: '両断エネルギー激突放熱！', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let blade: any = null;
    let cutFx: any = null;
    let shatterFx: any = null;

    if (fxContainer && typeof document !== 'undefined') {
      blade = mountPlasmaBlade(fxContainer, {
        hand: 'right',
        sizePercent: 64,
        initialRotation: -50,
        withHandGrip: true,
        armPartKey: refs.armPartKey
      });
      cutFx = mountFrontalSlashCutEffect(fxContainer);
      shatterFx = mountGroundShatterEffect(fxContainer);
      tl.set(blade.wrapper, { opacity: 1 });
      tl.set(blade.el, { opacity: 0 });
    }

    tl.eventCallback('onComplete', () => {
      blade?.cleanup?.();
      cutFx?.cleanup?.();
      shatterFx?.cleanup?.();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.8, scale: 1.3, duration: 0.3 }, 0.2);
    }

    // 1. 構え：サーベルを振り上げ、右腕を上段へ引き絞る
    tl.to(container, { x: -6, y: 2, scaleY: 0.96, duration: 0.25, ease: 'power2.out' });
    if (head) tl.to(head, { rotation: -10, y: 1, duration: 0.25 }, '<');
    if (armRight) tl.to(armRight, { rotation: -75, x: -8, y: -16, duration: 0.25, ease: 'power2.out' }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -45, x: -6, y: -8, duration: 0.25 }, '<');
    if (blade) {
      tl.to(blade.wrapper, { rotation: -75, x: -8, y: -16, duration: 0.25, ease: 'power2.out' }, '<');
      tl.to(blade.el, { opacity: 1, rotation: -30, scale: 1.1, duration: 0.2 }, '<');
    }

    // 2. 踏み込みとともに剣を持った腕を正面へ真っ直ぐ伸ばし、正面空間を鋭く切り下ろす！
    tl.to(container, {
      x: 24, y: 2, scaleX: 1.1, scaleY: 0.92, duration: 0.14, ease: 'power4.in'
    }, '>');
    if (head) tl.to(head, { rotation: 14, x: 4, duration: 0.14 }, '<');
    if (legRight) tl.to(legRight, { skewX: 12, duration: 0.14 }, '<');
    if (legLeft) tl.to(legLeft, { skewX: -12, duration: 0.14 }, '<');

    if (armRight) {
      tl.to(armRight, {
        rotation: 45, x: 32, y: 8, scaleX: 1.2, duration: 0.14, ease: 'power4.out'
      }, '<');
    }
    if (blade) {
      tl.to(blade.wrapper, {
        rotation: 45, x: 32, y: 8, duration: 0.14, ease: 'power4.out'
      }, '<');
      tl.to(blade.el, {
        rotation: 40, scale: 1.35, duration: 0.14, ease: 'power4.out'
      }, '<');
    }
    if (armLeft) tl.to(armLeft, { rotation: 30, x: 8, duration: 0.14 }, '<');

    // 3. 正面両断プラズマ切断線エフェクトが鮮烈に炸裂！
    if (cutFx) {
      tl.to(cutFx.wrapper, { opacity: 1, scale: 1.25, duration: 0.08, ease: 'power4.out' }, '<0.02');
      tl.to(cutFx.wrapper, { opacity: 0, scale: 1.5, duration: 0.28, ease: 'power2.out' }, '>');
    }
    if (shatterFx) {
      tl.to(shatterFx.el, { opacity: 1, scale: 1.3, duration: 0.08 }, '<');
      tl.to(shatterFx.el, { opacity: 0, scale: 1.6, duration: 0.25 }, '>');
    }

    // 4. 鋭い一撃の画面シェイク
    tl.to(container, { x: '+=3', y: '+=2', repeat: 4, yoyo: true, duration: 0.035, ease: 'rough' }, '<-0.1');

    // 5. 振り下ろした後の残心姿勢
    tl.to({}, { duration: 0.25 });

    // 6. サーベル消灯＆基本姿勢復帰
    if (blade) {
      tl.to(blade.el, { opacity: 0, duration: 0.2 }, '>');
      tl.to(blade.wrapper, { x: 0, y: 0, rotation: 0, duration: 0.35, ease: 'power2.out' }, '<');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, duration: 0.25 }, '<');
    }

    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, '<');
  }
}"""
code = re.sub(r'export class BeamSaberJudgementAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', beam_saber_code, code)

# 7. Remove the 4 classes: TwoHandedSniperScopeShotAnimation, GatlingRushAnimation, PowerSmashAnimation, PointBlankPlasmaBurstAnimation
code = re.sub(r'export class TwoHandedSniperScopeShotAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', '', code)
code = re.sub(r'export class GatlingRushAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', '', code)
code = re.sub(r'export class PowerSmashAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', '', code)
code = re.sub(r'export class PointBlankPlasmaBurstAnimation extends BaseRobotAnimation \{[\s\S]*?\n\}', '', code)

# 8. Update GSAPRobotAnimationRegistry.initializeDefaultPatterns
# Remove any instantiation of the 4 removed classes
registry_replacement = """      // 1. 戦闘・アクション (Combat & Attacks)
      new ShieldBarrierAnimation(),
      new ShieldBlockItemAnimation(),
      new MissileBarrageAnimation(),
      new MissileFireItemAnimation(),
      new FlameBladeCycloneAnimation(),
      new FlameBladeThrustAnimation(),
      new BeamSaberJudgementAnimation(),
      new DualSaberMirageDanceAnimation(),
      new UltimateOmegaCrossSlashAnimation(),
      new EMPDisruptorAnimation(),
      new ApocalypseOmegaBurstAnimation(),
      new OverdriveAnimation(),
      new FlyingKickAnimation(),
      new JetDashAnimation(),"""

code = re.sub(r'// 1\. 戦闘・アクション \(Combat & Attacks\)[\s\S]*?new JetDashAnimation\(\),', registry_replacement, code)

with open('src/core/animations/GSAPRobotAnimator.ts', 'w') as f:
    f.write(code)

print("Updated GSAPRobotAnimator.ts successfully.")
