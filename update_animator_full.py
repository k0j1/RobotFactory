import re

with open('src/core/animations/GSAPRobotAnimator.ts', 'r') as f:
    code = f.read()

# 1. Add AT-Field, 8-Missile Barrage, Flame Thrust Pierce, and Frontal Slash helpers if not present
new_helpers = """
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

print("Helper block prepared.")
