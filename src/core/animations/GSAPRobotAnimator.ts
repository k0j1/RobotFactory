import gsap from 'gsap';
import { HandAnchorManager } from './HandAnchorManager';

export interface RobotDOMRefs {
  container?: HTMLElement | null;
  head?: HTMLElement | null;
  body?: HTMLElement | null;
  arms?: HTMLElement | null;
  armLeft?: HTMLElement | null;
  armRight?: HTMLElement | null;
  legs?: HTMLElement | null;
  legLeft?: HTMLElement | null;
  legRight?: HTMLElement | null;
  scanLine?: HTMLElement | null;
  auraOverlay?: HTMLElement | null;
  sparkles?: HTMLElement | null;
  fxContainer?: HTMLElement | null;
  armPartKey?: string;
  [key: string]: any;
}

export enum RobotAnimationCategory {
  COMBAT = 'combat',
  ACROBATIC = 'acrobatic',
  MECHANICAL = 'mechanical',
  EMOTION = 'emotion'
}

export interface AnimationSEMarker {
  time: number;
  label: string;
  type: string;
}

export interface RobotAnimationPattern {
  id: string;
  name: string;
  category: RobotAnimationCategory;
  duration: number;
  loop?: boolean;
  description: string;
  technicalHighlights: string[];
  seMarkers?: AnimationSEMarker[];
  build: (refs: RobotDOMRefs, tl: gsap.core.Timeline) => void;
}

export type IRobotAnimationPattern = RobotAnimationPattern;

export const ROBOT_ANIMATION_CATEGORIES = [
  { id: RobotAnimationCategory.COMBAT, name: '戦闘・攻撃 (Combat)', description: 'ビームサーベル抜刀一刀両断、二刀流乱舞、精密スナイパー狙撃等の戦闘アクション', iconName: 'GiBroadsword' },
  { id: RobotAnimationCategory.ACROBATIC, name: '特殊・機能 (Acrobatics)', description: 'ブレイクダンス、パーツ分解展開、高速ダッシュ等の高難度モーション', iconName: 'GiAcrobatic' },
  { id: RobotAnimationCategory.MECHANICAL, name: '点検・動作 (Mechanical)', description: 'スキャン診断、ホバー浮遊、急速充電、キャリブレーション等の駆動ルーチン', iconName: 'GiGears' },
  { id: RobotAnimationCategory.EMOTION, name: '感情・仕草 (Emotions)', description: '歓喜のポーズ、パニック、敬礼おじぎ、手拍子等のエモーショナルな表現', iconName: 'GiHeartPlus' }
];


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


export abstract class BaseRobotAnimation implements RobotAnimationPattern {
  abstract id: string;
  abstract name: string;
  abstract category: RobotAnimationCategory;
  abstract duration: number;
  loop?: boolean;
  abstract description: string;
  abstract technicalHighlights: string[];
  seMarkers?: AnimationSEMarker[];
  abstract build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void;

  protected resetElements(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    const targets = [
      refs.container, refs.head, refs.body, refs.arms, refs.legs,
      refs.armLeft, refs.armRight, refs.legLeft, refs.legRight
    ].filter(Boolean);
    if (targets.length > 0) {
      tl.set(targets, {
        x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1,
        skewX: 0, skewY: 0, opacity: 1, filter: 'none'
      });
    }

    const conf = refs.armPartKey ? HandAnchorManager.getInstance().getHandConfig(refs.armPartKey) : null;
    const leftOrigin = conf ? `${conf.leftShoulder.x}% ${conf.leftShoulder.y}%` : '25% 46%';
    const rightOrigin = conf ? `${conf.rightShoulder.x}% ${conf.rightShoulder.y}%` : '75% 46%';

    if (refs.container) tl.set(refs.container, { transformOrigin: '50% 80%' });
    if (refs.head) tl.set(refs.head, { transformOrigin: '50% 32%' });
    if (refs.body) tl.set(refs.body, { transformOrigin: '50% 55%' });
    if (refs.arms) tl.set(refs.arms, { transformOrigin: '50% 46%' });
    if (refs.armLeft) tl.set(refs.armLeft, { transformOrigin: leftOrigin });
    if (refs.armRight) tl.set(refs.armRight, { transformOrigin: rightOrigin });
    if (refs.legs) tl.set(refs.legs, { transformOrigin: '50% 75%' });
    if (refs.legLeft) tl.set(refs.legLeft, { transformOrigin: '38% 72%' });
    if (refs.legRight) tl.set(refs.legRight, { transformOrigin: '62% 72%' });

    if (refs.scanLine) tl.set(refs.scanLine, { opacity: 0, y: -50 });
    if (refs.auraOverlay) tl.set(refs.auraOverlay, { opacity: 0, scale: 0.8 });
    if (refs.sparkles) tl.set(refs.sparkles, { opacity: 0 });
    if (refs.fxContainer && typeof document !== 'undefined') {
      refs.fxContainer.innerHTML = '';
    }
  }
}


export function getPlasmaBladeSVG(s: any = "sw"): any {return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" class="drop-shadow-[0_0_12px_rgba(0,229,255,0.85)] filter">
  <defs>
    <!-- ビーム核心部（白光） -->
    <linearGradient id="${s}-beam-core" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="15%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#e0f7fa"/>
      <stop offset="85%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>

    <!-- ビーム外周プラズマ（グラデーションシアン） -->
    <linearGradient id="${s}-beam-aura" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.8"/>
      <stop offset="30%" stop-color="#18ffff" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#18ffff" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#00e5ff" stop-opacity="0.8"/>
    </linearGradient>

    <!-- サーベル柄（メタリックシルバー） -->
    <linearGradient id="${s}-hilt-metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cfd8dc"/>
      <stop offset="30%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#90a4ae"/>
      <stop offset="100%" stop-color="#37474f"/>
    </linearGradient>

    <!-- 柄のダークアーマー -->
    <linearGradient id="${s}-hilt-dark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#263238"/>
      <stop offset="50%" stop-color="#102027"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>

    <!-- 発光スイッチ/インジケーター -->
    <linearGradient id="${s}-glow-red" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff5252"/>
      <stop offset="100%" stop-color="#ff0000"/>
    </linearGradient>
  </defs>

  <!-- 全体太ストロークグループ -->
  <g stroke="#000a12" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">

    <!-- 1. ビームプラズマ外周（オーラ部分：2倍に長さを延長） -->
    <path d="M 150,5 C 132,60 128,150 138,235 L 162,235 C 172,150 168,60 150,5 Z" fill="url(#${s}-beam-aura)" stroke="none" />

    <!-- 2. ビーム核心部（超高熱コア光線：2倍に長さを延長） -->
    <path d="M 150,10 C 138,65 136,150 143,235 L 157,235 C 164,150 162,65 150,10 Z" fill="url(#${s}-beam-core)" stroke="none" />

    <!-- 3. ビーム先端・基部の放電エフェクト粒子 -->
    <ellipse cx="150" cy="235" rx="14" ry="4" fill="#ffffff" stroke="none" />
    <polygon points="150,2 145,18 150,12 155,18" fill="#ffffff" stroke="none" />

    <!-- 4. 噴出口（エミッターノズル：刃に合わせて配置を調整） -->
    <path d="M 134,230 L 166,230 L 162,245 L 138,245 Z" fill="url(#${s}-hilt-dark)" />
    <rect x="136" y="245" width="28" height="5" fill="url(#${s}-hilt-metal)" />

    <!-- 5. サーベルグリップ（ヒルト本体） -->
    <rect x="138" y="250" width="24" height="40" rx="3" fill="url(#${s}-hilt-metal)" />

    <!-- メカニカル溝・フィン構造 -->
    <rect x="136" y="256" width="28" height="3" fill="url(#${s}-hilt-dark)" />
    <rect x="136" y="264" width="28" height="3" fill="url(#${s}-hilt-dark)" />
    <rect x="136" y="272" width="28" height="3" fill="url(#${s}-hilt-dark)" />

    <!-- 6. 起動スイッチ / 出力調整ダイヤル -->
    <rect x="146" y="280" width="8" height="6" rx="1" fill="url(#${s}-glow-red)" />
    <circle cx="150" cy="283" r="1.5" fill="#ffffff" stroke="none" />

    <!-- 7. 柄頭（エンドキャップ / リングフック部） -->
    <path d="M 136,290 L 164,290 L 160,298 L 140,298 Z" fill="url(#${s}-hilt-dark)" />

  </g>
</svg>
  `}

export function mountPlasmaBlade(s: any = {}, t: any = {}): any {const i=document.createElement("div"),a=document.createElement("div"),o="sw_"+Math.random().toString(36).substring(2,7),d=t.sizePercent||54,c=t.withHandGrip!==!1,h=HandAnchorManager.getInstance().getHandConfig(t.armPartKey||"arm_r1_v0"),f=t.customShoulderCoord||(t.hand==="right"?h.rightShoulder:h.leftShoulder),x=t.customHandCoord||(t.hand==="right"?h.rightHand:h.leftHand);if(i.className="absolute inset-0 w-full h-full pointer-events-none will-change-transform",i.style.transformOrigin=`${f.x}% ${f.y}%`,a.className="absolute pointer-events-none will-change-transform",a.style.width=`${d}%`,a.style.height=`${d}%`,t.hand==="right"){const b=x.x-.5*d,v=x.y-89.33/100*d;a.style.left=`${b}%`,a.style.top=`${v}%`,a.style.transformOrigin="50% 89.33%",t.initialRotation!==void 0&&(a.style.transform=`rotate(${t.initialRotation}deg)`)}else{const b=x.x-.5*d,v=x.y-89.33/100*d;a.style.left=`${b}%`,a.style.top=`${v}%`,a.style.transformOrigin="50% 89.33%";const w=t.initialRotation||0;a.style.transform=`scaleX(-1) rotate(${w}deg)`}let p=getPlasmaBladeSVG(o);return c&&(p=p.replace("</svg>",`
    <!-- 手甲・拳カバー（柄を握り込むマニピュレーター） -->
    <g stroke="#000a12" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <!-- 手甲ベースプレート -->
      <rect x="136" y="260" width="28" height="18" rx="3" fill="#37474f" />
      <rect x="139" y="263" width="22" height="12" rx="2" fill="#546e7a" />
      <!-- 指のナックル関節 -->
      <line x1="140" y1="267" x2="160" y2="267" stroke="#90a4ae" stroke-width="2"/>
      <line x1="140" y1="271" x2="160" y2="271" stroke="#90a4ae" stroke-width="2"/>
      <!-- リベット光沢 -->
      <circle cx="141" cy="269" r="1.5" fill="#00e5ff" />
      <circle cx="159" cy="269" r="1.5" fill="#00e5ff" />
    </g>
    `+"</svg>")),a.innerHTML=p,i.appendChild(a),s.appendChild(i),{wrapper:i,el:a,cleanup:()=>{i.parentNode&&i.parentNode.removeChild(i)}}}

export function mountBeamSlashEffect(s: any = {}): any {const t=document.createElement("div"),i="fs_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center",t.innerHTML=`
    <svg viewBox="0 0 360 360" class="w-full h-full filter drop-shadow-[0_0_25px_#ea580c]">
      <defs>
        <!-- 巨大火炎三日月グラデーション -->
        <linearGradient id="${i}-fire-crescent" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="20%" stop-color="#fef08a" stop-opacity="0.95"/>
          <stop offset="50%" stop-color="#f97316" stop-opacity="0.85"/>
          <stop offset="80%" stop-color="#dc2626" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0"/>
        </linearGradient>
        <!-- 火炎爆風放射グラデーション -->
        <radialGradient id="${i}-fire-burst" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#fdba74"/>
          <stop offset="70%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#991b1b" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- 放射状の火炎爆風 -->
      <circle cx="180" cy="180" r="140" fill="url(#${i}-fire-burst)" opacity="0.4" />

      <!-- メインの巨大火炎三日月スラッシュ刃 -->
      <path d="M 30,320 C 50,130 210,40 330,30 C 230,90 110,180 55,330 Z" fill="url(#${i}-fire-crescent)"/>

      <!-- 追従する第二の鋭利な熱線 -->
      <path d="M 45,310 C 65,145 200,65 315,50 C 220,105 120,195 70,320 Z" fill="#ffffff" opacity="0.6"/>

      <!-- 飛散する火炎スパーク -->
      <circle cx="280" cy="80" r="6" fill="#fef08a" />
      <circle cx="240" cy="60" r="4" fill="#f97316" />
      <circle cx="310" cy="120" r="5" fill="#f97316" />
      <circle cx="80" cy="270" r="5" fill="#fef08a" />
      <circle cx="120" cy="240" r="3" fill="#ea580c" />
      <circle cx="160" cy="200" r="4.5" fill="#ffffff" />
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}

export function mountGroundShatterEffect(s: any = {}): any {const t=document.createElement("div"),i="tr_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center",t.innerHTML=`
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_0_15px_#00e5ff]">
      <defs>
        <linearGradient id="${i}-trail" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="25%" stop-color="#a5f3fc" stop-opacity="0.9"/>
          <stop offset="65%" stop-color="#00e5ff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0891b2" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M 20,270 C 40,110 180,35 285,25 C 195,75 95,155 45,280 Z" fill="url(#${i}-trail)"/>
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}

export function getSniperRifleSVG(s: any = "sn"): any {return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%" class="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] filter">
  <defs>
    <!-- メタルグラデーション (暗部・重量感) -->
    <linearGradient id="${s}-heavy-metal-dark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- メタルグラデーション (装甲・明部) -->
    <linearGradient id="${s}-heavy-metal-light" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#94a3b8"/>
      <stop offset="40%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>

    <!-- スコープレンズ発光 (シアン) -->
    <linearGradient id="${s}-heavy-scope-lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5f3fc"/>
      <stop offset="50%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#083344"/>
    </linearGradient>

    <!-- メカニカルフレーム（装甲ストック） -->
    <linearGradient id="${s}-heavy-frame" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <!-- 全体太ストローク・グループ -->
  <g stroke="#090d16" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">

    <!-- 1. メインバレル（基部銃身） -->
    <rect x="75" y="141" width="60" height="10" rx="2" fill="url(#${s}-heavy-metal-dark)"/>

    <!-- 【極限延長】超・長尺ノズル構造（x=135〜298まで超ロング化） -->
    <!-- 第1段: バレルジョイントマウント -->
    <rect x="135" y="139" width="15" height="14" rx="2" fill="url(#${s}-heavy-metal-dark)"/>
    
    <!-- 第2段: 超・長尺メインノズル（x=150から270まで120px以上ストレート延長） -->
    <path d="M 150,137 L 270,137 L 270,155 L 150,155 Z" fill="url(#${s}-heavy-metal-light)"/>
    
    <!-- 第3段: 銃口先端マルチポートスリットノズル（x=270〜294） -->
    <path d="M 270,138 L 294,138 L 294,154 L 270,154 Z" fill="url(#${s}-heavy-metal-dark)"/>
    
    <!-- 第4段: 限界先端ノズルホール（最右端 x=298） -->
    <rect x="294" y="140" width="4" height="12" rx="1" fill="#090d16"/>

    <!-- ノズル側面の連続超ロング放熱スリット（16本のラインで長さと精密度を表現） -->
    <line x1="160" y1="139" x2="160" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="167" y1="139" x2="167" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="174" y1="139" x2="174" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="181" y1="139" x2="181" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="188" y1="139" x2="188" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="195" y1="139" x2="195" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="202" y1="139" x2="202" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="209" y1="139" x2="209" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="216" y1="139" x2="216" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="223" y1="139" x2="223" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="230" y1="139" x2="230" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="237" y1="139" x2="237" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="244" y1="139" x2="244" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="251" y1="139" x2="251" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="258" y1="139" x2="258" y2="153" stroke="#090d16" stroke-width="2"/>
    <line x1="265" y1="139" x2="265" y2="153" stroke="#090d16" stroke-width="2"/>

    <!-- 先端センサー発光部 -->
    <circle cx="276" cy="146" r="2" fill="#06b6d4" stroke="none"/>
    <circle cx="282" cy="146" r="2" fill="#06b6d4" stroke="none"/>
    <circle cx="288" cy="146" r="2" fill="#06b6d4" stroke="none"/>

    <!-- 2. シャーシ＆ハンドガード（位置を左に引き配置） -->
    <polygon points="45,134 135,134 125,166 40,166" fill="url(#${s}-heavy-metal-light)"/>
    
    <!-- 放熱構造・アクセント -->
    <rect x="50" y="138" width="75" height="12" rx="2" fill="url(#${s}-heavy-metal-dark)"/>
    <line x1="58" y1="144" x2="72" y2="144" stroke="#06b6d4" stroke-width="3"/>
    <line x1="80" y1="144" x2="94" y2="144" stroke="#06b6d4" stroke-width="3"/>
    <line x1="102" y1="144" x2="116" y2="144" stroke="#06b6d4" stroke-width="3"/>

    <!-- トップレール -->
    <rect x="35" y="128" width="95" height="6" fill="url(#${s}-heavy-metal-dark)"/>

    <!-- 3. スコープ（照準器） -->
    <rect x="55" y="122" width="10" height="8" fill="url(#${s}-heavy-metal-dark)"/>
    <rect x="85" y="122" width="10" height="8" fill="url(#${s}-heavy-metal-dark)"/>

    <path d="M 35,104 L 65,112 L 115,112 L 140,102 L 155,102 L 155,124 L 140,124 L 115,120 L 65,120 L 35,126 Z" fill="url(#${s}-heavy-metal-dark)"/>
    <rect x="85" y="98" width="14" height="8" fill="url(#${s}-heavy-metal-light)"/>
    <rect x="87" y="106" width="10" height="6" fill="url(#${s}-heavy-metal-dark)"/>

    <ellipse cx="155" cy="113" rx="4" ry="11" fill="url(#${s}-heavy-scope-lens)"/>
    <ellipse cx="35" cy="115" rx="3" ry="10" fill="url(#${s}-heavy-scope-lens)"/>

    <!-- 4. マガジン（弾倉） -->
    <polygon points="75,166 105,166 93,210 63,210" fill="url(#${s}-heavy-frame)"/>
    <line x1="81" y1="172" x2="72" y2="204" stroke="url(#${s}-heavy-metal-light)" stroke-width="3"/>
    <line x1="91" y1="172" x2="82" y2="204" stroke="url(#${s}-heavy-metal-light)" stroke-width="3"/>

    <!-- 5. ピストルグリップ & トリガー -->
    <path d="M 40,166 L 60,166 L 45,212 L 28,208 Z" fill="url(#${s}-heavy-frame)"/>
    <path d="M 60,166 C 75,166 75,182 60,182 Z" fill="none" stroke="#090d16" stroke-width="5"/>
    <path d="M 68,169 C 65,174 68,178 68,178" fill="none" stroke="url(#${s}-heavy-metal-light)" stroke-width="4"/>

    <!-- 6. ストック（銃床） -->
    <path d="M 40,140 L 12,142 C 4,142 2,155 2,175 L 2,192 L 14,192 L 30,168 L 40,166 Z" fill="url(#${s}-heavy-frame)"/>
    <rect x="12" y="132" width="24" height="10" rx="3" fill="url(#${s}-heavy-metal-light)"/>
    <rect x="2" y="148" width="5" height="42" rx="2" fill="#090d16"/>

    <!-- 7. バイポッド（超ロングノズルを支える安定配置） -->
    <circle cx="140" cy="150" r="6" fill="url(#${s}-heavy-metal-light)"/>
    <line x1="140" y1="152" x2="120" y2="218" stroke="url(#${s}-heavy-metal-dark)" stroke-width="6"/>
    <line x1="140" y1="152" x2="155" y2="218" stroke="url(#${s}-heavy-metal-dark)" stroke-width="6"/>
    <rect x="112" y="215" width="12" height="8" rx="2" fill="#090d16"/>
    <rect x="150" y="215" width="12" height="8" rx="2" fill="#090d16"/>

  </g>
</svg>
  `}

export function mountSniperRifle(s: any = {}, t: any = {}): any {const i=document.createElement("div"),a=document.createElement("div"),o="sn_"+Math.random().toString(36).substring(2,7),d=t.sizePercent||72,c=t.hand||"right",u=t.withHandGrip!==!1,f=HandAnchorManager.getInstance().getHandConfig(t.armPartKey||"arm_r1_v0"),x=t.customShoulderCoord||(c==="right"?f.rightShoulder:f.leftShoulder),p=t.customHandCoord||(c==="right"?f.rightHand:f.leftHand);if(i.className="absolute inset-0 w-full h-full pointer-events-none will-change-transform",i.style.transformOrigin=`${x.x}% ${x.y}%`,a.className="absolute pointer-events-none will-change-transform",a.style.width=`${d}%`,a.style.height=`${d}%`,c==="right"){const v=p.x-.22*d,w=p.y-58/100*d;a.style.left=`${v}%`,a.style.top=`${w}%`,a.style.transformOrigin="22% 58%",t.initialRotation!==void 0&&(a.style.transform=`rotate(${t.initialRotation}deg)`)}else{const v=p.x-.78*d,w=p.y-58/100*d;a.style.left=`${v}%`,a.style.top=`${w}%`,a.style.transformOrigin="78% 58%";const j=t.initialRotation||0;a.style.transform=`scaleX(-1) rotate(${j}deg)`}let b=getSniperRifleSVG(o);if(u){const v=`
    <!-- 両手持ちマニピュレーター（左手グリップ把持＆右手トリガー操作） -->
    <g id="${o}-two-handed-mount" stroke="#090d16" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <!-- 1. 左手マニピュレーター（メインピストルグリップをがっちり包み込んで握る） -->
      <g id="${o}-left-grip-hand">
        <!-- 手甲メインプレート -->
        <rect x="32" y="178" width="24" height="26" rx="4" fill="#334155" />
        <rect x="35" y="181" width="18" height="20" rx="3" fill="#64748b" />
        <!-- フィンガー関節スリットライン -->
        <line x1="36" y1="187" x2="52" y2="187" stroke="#94a3b8" stroke-width="2"/>
        <line x1="36" y1="193" x2="52" y2="193" stroke="#94a3b8" stroke-width="2"/>
        <line x1="36" y1="199" x2="52" y2="199" stroke="#94a3b8" stroke-width="2"/>
        <!-- 左手パワーLEDインジケーター（シアン発光） -->
        <circle cx="36" cy="183" r="1.5" fill="#06b6d4" stroke="none" />
        <circle cx="51" cy="183" r="1.5" fill="#06b6d4" stroke="none" />
        <circle cx="44" cy="202" r="1.5" fill="#06b6d4" stroke="none" />
      </g>

      <!-- 2. 右手マニピュレーター（トリガーガードに指を掛け、人差し指でトリガーを引く） -->
      <g id="${o}-right-trigger-hand">
        <!-- トリガー側手甲プレート -->
        <rect x="62" y="164" width="22" height="22" rx="3" fill="#334155" />
        <rect x="65" y="167" width="16" height="16" rx="2" fill="#64748b" />
        <!-- トリガーを引き込む人差し指フィンガー -->
        <path d="M 64,171 L 70,173 L 69,178 L 63,177 Z" fill="#94a3b8" />
        <line x1="66" y1="174" x2="80" y2="174" stroke="#94a3b8" stroke-width="2"/>
        <line x1="66" y1="179" x2="80" y2="179" stroke="#94a3b8" stroke-width="2"/>
        <!-- 右手トリガーLEDインジケーター（シアン発光） -->
        <circle cx="66" cy="168" r="1.5" fill="#06b6d4" stroke="none" />
        <circle cx="80" cy="168" r="1.5" fill="#06b6d4" stroke="none" />
        <circle cx="73" cy="184" r="1.5" fill="#06b6d4" stroke="none" />
      </g>
    </g>
    `;b=b.replace("</svg>",v+"</svg>")}return a.innerHTML=b,i.appendChild(a),s.appendChild(i),{wrapper:i,el:a,cleanup:()=>{i.parentNode&&i.parentNode.removeChild(i)}}}

export function mountSniperShotEffect(s: any = {}): any {const t=document.createElement("div"),i="sns_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center",t.innerHTML=`
    <svg viewBox="0 0 400 300" class="w-full h-full filter drop-shadow-[0_0_20px_#06b6d4]">
      <defs>
        <!-- 貫通ビームレール -->
        <linearGradient id="${i}-beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="20%" stop-color="#a5f3fc" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </linearGradient>
        <!-- マズル衝撃波リング -->
        <radialGradient id="${i}-ring" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- 1. 超高エネルギー貫通ビーム光線 -->
      <polygon points="180,146 390,135 390,157 180,146" fill="url(#${i}-beam)" opacity="0.95" />
      <line x1="180" y1="146" x2="395" y2="146" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>

      <!-- 2. プラズマ放電リング（2段） -->
      <ellipse cx="210" cy="146" rx="8" ry="24" fill="none" stroke="#a5f3fc" stroke-width="3" opacity="0.85"/>
      <ellipse cx="250" cy="146" rx="10" ry="32" fill="none" stroke="#06b6d4" stroke-width="2.5" opacity="0.7"/>

      <!-- 3. マズルフラッシュ星型スパーク -->
      <path d="M 180,146 L 165,130 L 175,146 L 160,150 L 175,152 L 170,165 L 180,155 L 195,160 L 185,150 L 205,146 L 185,142 L 192,130 Z" fill="#ffffff" />
      <circle cx="180" cy="146" r="14" fill="url(#${i}-ring)" />

      <!-- 4. 弾道周囲の超高圧粒子 -->
      <circle cx="230" cy="138" r="2.5" fill="#a5f3fc" />
      <circle cx="280" cy="154" r="2" fill="#38bdf8" />
      <circle cx="340" cy="140" r="3" fill="#ffffff" />
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}

export function mountDualSabers(s: any = {}, t: any = {}): any {const i=t.themeColor||"cyan",a={cyan:{bg:"linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.92) 15%, rgba(15,23,42,0.98) 40%, rgba(15,23,42,0.98) 75%, rgba(6,182,212,0.92) 90%, transparent 100%)",border:"#06b6d4",glow:"0 0 35px rgba(6,182,212,0.85)",textColor:"#a5f3fc",titleColor:"#ffffff",slashColor:"#38bdf8"},amber:{bg:"linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.92) 15%, rgba(28,25,23,0.98) 40%, rgba(28,25,23,0.98) 75%, rgba(245,158,11,0.92) 90%, transparent 100%)",border:"#f59e0b",glow:"0 0 35px rgba(245,158,11,0.85)",textColor:"#fef08a",titleColor:"#ffffff",slashColor:"#fbbf24"},crimson:{bg:"linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.92) 15%, rgba(24,24,27,0.98) 40%, rgba(24,24,27,0.98) 75%, rgba(239,68,68,0.92) 90%, transparent 100%)",border:"#ef4444",glow:"0 0 35px rgba(239,68,68,0.85)",textColor:"#fecaca",titleColor:"#ffffff",slashColor:"#f87171"},emerald:{bg:"linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.92) 15%, rgba(6,78,59,0.98) 40%, rgba(6,78,59,0.98) 75%, rgba(16,185,129,0.92) 90%, transparent 100%)",border:"#10b981",glow:"0 0 35px rgba(16,185,129,0.85)",textColor:"#a7f3d0",titleColor:"#ffffff",slashColor:"#34d399"}}[i],o=document.createElement("div");o.className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden";const d=document.createElement("div");d.className="absolute inset-0 bg-white pointer-events-none opacity-0 z-40";const c=document.createElement("div");c.className="relative w-full h-[68px] flex items-center justify-between px-6 opacity-0 will-change-transform",c.style.background=a.bg,c.style.borderTop=`2px solid ${a.border}`,c.style.borderBottom=`2px solid ${a.border}`,c.style.boxShadow=a.glow;const u=document.createElement("div");u.className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden",u.innerHTML=`
    <svg viewBox="0 0 500 70" class="w-full h-full preserve-3d" preserveAspectRatio="none">
      <line x1="60" y1="0" x2="30" y2="70" stroke="${a.slashColor}" stroke-width="4" />
      <line x1="90" y1="0" x2="60" y2="70" stroke="${a.slashColor}" stroke-width="2" />
      <line x1="420" y1="0" x2="390" y2="70" stroke="${a.slashColor}" stroke-width="3" />
      <line x1="450" y1="0" x2="420" y2="70" stroke="${a.slashColor}" stroke-width="5" />
    </svg>
  `,c.appendChild(u);const h=document.createElement("div");h.className="relative z-10 flex flex-col justify-center";const f=document.createElement("div");f.className="text-[11px] font-black tracking-[0.25em] uppercase font-mono drop-shadow-md",f.style.color=a.textColor,f.textContent=t.subtitle||"CRITICAL OVERDRIVE";const x=document.createElement("div");x.className="text-xl sm:text-2xl font-black italic tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]",x.style.color=a.titleColor,x.textContent=t.title||"【奥義】",h.appendChild(f),h.appendChild(x),c.appendChild(h);const p=document.createElement("div");return p.className="relative z-10 flex items-center gap-1.5 opacity-90",p.innerHTML=`
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
      <circle cx="30" cy="20" r="14" stroke="${a.border}" stroke-width="2.5" stroke-dasharray="4 2"/>
      <circle cx="30" cy="20" r="6" fill="${a.border}"/>
      <line x1="5" y1="20" x2="55" y2="20" stroke="${a.border}" stroke-width="1.5"/>
      <line x1="30" y1="2" x2="30" y2="38" stroke="${a.border}" stroke-width="1.5"/>
      <polygon points="50,10 58,20 50,30" fill="${a.border}" />
    </svg>
  `,c.appendChild(p),o.appendChild(d),o.appendChild(c),s.appendChild(o),{wrapper:o,banner:c,titleEl:x,subtitleEl:f,flashEl:d,cleanup:()=>{o.parentNode&&o.parentNode.removeChild(o)}}}

export function mountDualSlashEffect(s: any = {}): any {const t=document.createElement("div"),i="en_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center z-15",t.innerHTML=`
    <svg viewBox="0 0 400 400" class="w-full h-full filter drop-shadow-[0_0_30px_#06b6d4]">
      <defs>
        <!-- 放射状エネルギーパルス -->
        <radialGradient id="${i}-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="30%" stop-color="#a5f3fc" stop-opacity="0.8"/>
          <stop offset="65%" stop-color="#06b6d4" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- 渦巻く粒子リング -->
      <circle cx="200" cy="200" r="120" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="12 16" opacity="0.85"/>
      <circle cx="200" cy="200" r="160" fill="none" stroke="#a5f3fc" stroke-width="2" stroke-dasharray="20 30" opacity="0.7"/>

      <!-- 中心エネルギーコア -->
      <circle cx="200" cy="200" r="90" fill="url(#${i}-core)"/>

      <!-- 放射状集中スピードライン (16本) -->
      ${[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map(a=>{const o=a*Math.PI/180,d=200+Math.cos(o)*195,c=200+Math.sin(o)*195,u=200+Math.cos(o)*110,h=200+Math.sin(o)*110;return`<line x1="${d}" y1="${c}" x2="${u}" y2="${h}" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>`}).join("")}
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}

export function mountIaidoSlashEffect(s: any = {}): any {const t=document.createElement("div"),i="omg_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center z-25",t.innerHTML=`
    <svg viewBox="0 0 450 450" class="w-full h-full filter drop-shadow-[0_0_35px_#00e5ff]">
      <defs>
        <linearGradient id="${i}-slash1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="30%" stop-color="#a5f3fc" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#00e5ff" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${i}-slash2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="30%" stop-color="#fef08a" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#f97316" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- スラッシュ 1 (左上から右下への極大三日月光刃) -->
      <path d="M 40,40 C 180,180 270,270 410,410 C 270,310 180,220 40,40 Z" fill="url(#${i}-slash1)"/>
      <line x1="20" y1="20" x2="430" y2="430" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>

      <!-- スラッシュ 2 (右上から左下への極大火炎刃) -->
      <path d="M 410,40 C 270,180 180,270 40,410 C 180,310 270,220 410,40 Z" fill="url(#${i}-slash2)"/>
      <line x1="430" y1="20" x2="20" y2="430" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>

      <!-- 中心炸裂星型インパクト -->
      <circle cx="225" cy="225" r="30" fill="#ffffff" filter="drop-shadow(0 0 20px #ffffff)"/>
      <circle cx="225" cy="225" r="60" fill="none" stroke="#a5f3fc" stroke-width="4" opacity="0.8"/>
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}

export function mountDramaticCutinEffect(s: any = {}): any {const t=document.createElement("div"),i="obm_"+Math.random().toString(36).substring(2,7);return t.className="absolute inset-0 pointer-events-none opacity-0 will-change-transform flex items-center justify-center z-25",t.innerHTML=`
    <svg viewBox="0 0 500 350" class="w-full h-full filter drop-shadow-[0_0_40px_#06b6d4]">
      <defs>
        <!-- 極太超電導ビームバレル -->
        <linearGradient id="${i}-hyperbeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="15%" stop-color="#a5f3fc" stop-opacity="1"/>
          <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.95"/>
          <stop offset="85%" stop-color="#0284c7" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
        </linearGradient>
        <!-- ビームコア高圧シリンダー -->
        <linearGradient id="${i}-beamcore" x1="0%" y1="50%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- 1. 超極太貫通メインビーム本体 -->
      <polygon points="120,175 490,120 490,230 120,175" fill="url(#${i}-hyperbeam)" opacity="0.95" />
      <polygon points="130,175 495,145 495,205 130,175" fill="#ffffff" opacity="0.9" />
      <line x1="120" y1="175" x2="500" y2="175" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>

      <!-- 2. 螺旋状プラズマ電磁フィールド (4連リング) -->
      <ellipse cx="170" cy="175" rx="14" ry="42" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.95"/>
      <ellipse cx="230" cy="175" rx="18" ry="58" fill="none" stroke="#a5f3fc" stroke-width="4" opacity="0.9"/>
      <ellipse cx="300" cy="175" rx="22" ry="74" fill="none" stroke="#38bdf8" stroke-width="3.5" opacity="0.85"/>
      <ellipse cx="380" cy="175" rx="26" ry="90" fill="none" stroke="#0284c7" stroke-width="3" opacity="0.75"/>

      <!-- 3. マズル超新星フラッシュ -->
      <circle cx="125" cy="175" r="38" fill="#ffffff" />
      <path d="M 125,175 L 90,140 L 115,175 L 80,185 L 115,190 L 95,220 L 125,200 L 150,230 L 135,185 L 175,175 L 135,165 L 155,130 Z" fill="#a5f3fc" />
    </svg>
  `,s.appendChild(t),{el:t,cleanup:()=>{t.parentNode&&t.parentNode.removeChild(t)}}}


/**
 * スナイパー・スコープ接眼照準HUD＆レーザー照準光線エフェクト
 * ロボットの顔（目）がスコープに密着した際に展開するホログラフィック照準HUD
 */
export function mountSniperScopeHUDEffect(container: HTMLElement): { 
  wrapper: HTMLDivElement; 
  laser: SVGLineElement; 
  hud: SVGGElement; 
  cleanup: () => void 
} {
  const wrapper = document.createElement('div');
  const uid = 'scope_hud_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform';
  wrapper.innerHTML = `
    <svg viewBox="0 0 400 300" class="w-full h-full filter drop-shadow-[0_0_8px_#06b6d4]">
      <!-- 1. 前方へ伸びる超微細レーザー照準光線（スコープ先端から射出） -->
      <line id="${uid}-laser" x1="260" y1="116" x2="395" y2="116" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.85"/>
      <circle cx="395" cy="116" r="3" fill="#06b6d4" opacity="0.9"/>

      <!-- 2. スコープ接眼ホログラフィックHUDレティクル（顔・目の位置に展開） -->
      <g id="${uid}-hud" transform="translate(170, 115)">
        <!-- 外周リング -->
        <circle cx="0" cy="0" r="28" fill="none" stroke="#06b6d4" stroke-width="1.5" opacity="0.75"/>
        <circle cx="0" cy="0" r="24" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 2" opacity="0.6"/>
        <circle cx="0" cy="0" r="16" fill="rgba(6, 182, 212, 0.08)" stroke="#a5f3fc" stroke-width="0.8"/>
        
        <!-- 十字レティクルライン -->
        <line x1="-32" y1="0" x2="-8" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
        <line x1="8" y1="0" x2="32" y2="0" stroke="#06b6d4" stroke-width="1.5"/>
        <line x1="0" y1="-32" x2="0" y2="-8" stroke="#06b6d4" stroke-width="1.5"/>
        <line x1="0" y1="8" x2="0" y2="32" stroke="#06b6d4" stroke-width="1.5"/>

        <!-- ミリラジアン目盛り -->
        <line x1="-16" y1="-3" x2="-16" y2="3" stroke="#38bdf8" stroke-width="1"/>
        <line x1="16" y1="-3" x2="16" y2="3" stroke="#38bdf8" stroke-width="1"/>
        <line x1="-3" y1="-16" x2="3" y2="-16" stroke="#38bdf8" stroke-width="1"/>
        <line x1="-3" y1="16" x2="3" y2="16" stroke="#38bdf8" stroke-width="1"/>

        <!-- 中心エイムドット -->
        <circle cx="0" cy="0" r="2" fill="#ffffff"/>

        <!-- HUDインフォメーションテキスト -->
        <text x="6" y="-12" fill="#06b6d4" font-size="6" font-family="monospace" font-weight="bold" letter-spacing="1">LOCK ON</text>
        <text x="6" y="20" fill="#38bdf8" font-size="5" font-family="monospace">R: 2400m</text>
      </g>
    </svg>
  `;
  container.appendChild(wrapper);
  const laser = wrapper.querySelector(`#${uid}-laser`) as SVGLineElement;
  const hud = wrapper.querySelector(`#${uid}-hud`) as SVGGElement;

  return {
    wrapper,
    laser,
    hud,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}






export class DualSlashComboAnimation extends BaseRobotAnimation {
  seMarkers: AnimationSEMarker[] = [{time:.25,label:"二刀抜刀",type:"draw"},{time:.38,label:"左・袈裟斬り",type:"slash"},{time:.58,label:"右・逆袈裟斬り",type:"slash"},{time:.82,label:"X字クロスフィニッシュ",type:"slash"},{time:.98,label:"交差インパクト",type:"hit"}];
  id="dual_slash_combo";
  name="二刀流クロススラッシュ (Dual Slash)";
  category = "combat" as RobotAnimationCategory;
  duration=1.7;
  loop = true;
  description="左右両腕に炎の曲刀を2振り構え、左腕の袈裟斬り、右腕の逆袈裟斬り、そして両腕同時X字クロスフィニッシュを叩き込む。";
  technicalHighlights=["左右両手に炎の曲刀SVGを同時装備 (Left: 反転装備 / Right: 通常装備)","左右アームの独立逆位相スイング & 刀身の追従","フィニッシュ時の同時X字クロス交差 & 炎の閃光"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,arms:d,armLeft:c,armRight:u,legs:h,legLeft:f,legRight:x,fxContainer:p}=t;let b=null,v=null,w=null;p&&typeof document<"u"&&(b=mountPlasmaBlade(p,{hand:"right",initialRotation:-20,armPartKey:t.armPartKey}),v=mountPlasmaBlade(p,{hand:"left",initialRotation:-20,armPartKey:t.armPartKey}),w=mountGroundShatterEffect(p),i.set([b.wrapper,v.wrapper],{opacity:1}),i.set([b.el,v.el],{opacity:1})),i.eventCallback("onComplete",()=>{b==null||b.cleanmountBeamSlashEffect(),v==null||v.cleanmountBeamSlashEffect(),w==null||w.cleanmountBeamSlashEffect()}),i.to(a,{y:2,duration:.25}),c&&i.to(c,{rotation:-40,x:-8,y:-4,duration:.25,ease:"back.out(2)"},"<"),v&&(i.to(v.wrapper,{rotation:-40,x:-8,y:-4,duration:.25,ease:"back.out(2)"},"<"),i.to(v.el,{rotation:-20,duration:.25,ease:"back.out(2)"},"<")),u&&i.to(u,{rotation:-40,x:8,y:-4,duration:.25,ease:"back.out(2)"},"<"),b&&(i.to(b.wrapper,{rotation:-40,x:8,y:-4,duration:.25,ease:"back.out(2)"},"<"),i.to(b.el,{rotation:-20,duration:.25,ease:"back.out(2)"},"<")),!c&&!u&&d&&i.to(d,{rotation:-30,duration:.25},"<"),i.to(a,{x:8,duration:.12,ease:"power4.in"}),c&&i.to(c,{rotation:65,x:12,y:6,duration:.12,ease:"power4.in"},"<"),v&&(i.to(v.wrapper,{rotation:65,x:12,y:6,duration:.12,ease:"power4.in"},"<"),i.to(v.el,{rotation:20,duration:.12,ease:"power4.in"},"<")),u&&i.to(u,{rotation:-60,x:-6,duration:.12},"<"),b&&i.to(b.wrapper,{rotation:-60,x:-6,duration:.12},"<"),f&&i.to(f,{skewX:-10,duration:.12},"<"),i.to(a,{x:16,duration:.12,ease:"power4.in"},"+=0.06"),u&&i.to(u,{rotation:70,x:14,y:-8,duration:.12,ease:"power4.in"},"<"),b&&(i.to(b.wrapper,{rotation:70,x:14,y:-8,duration:.12,ease:"power4.in"},"<"),i.to(b.el,{rotation:20,duration:.12,ease:"power4.in"},"<")),c&&i.to(c,{rotation:-20,x:-4,duration:.12},"<"),v&&i.to(v.wrapper,{rotation:-20,x:-4,duration:.12},"<"),x&&i.to(x,{skewX:12,duration:.12},"<"),i.to(a,{x:24,y:-4,duration:.15,ease:"back.out(2)"},"+=0.08"),c&&i.to(c,{rotation:55,x:10,y:-2,duration:.12,ease:"power4.out"},"<"),v&&(i.to(v.wrapper,{rotation:55,x:10,y:-2,duration:.12,ease:"power4.out"},"<"),i.to(v.el,{rotation:15,duration:.12,ease:"power4.out"},"<")),u&&i.to(u,{rotation:55,x:10,y:-2,duration:.12,ease:"power4.out"},"<"),b&&(i.to(b.wrapper,{rotation:55,x:10,y:-2,duration:.12,ease:"power4.out"},"<"),i.to(b.el,{rotation:15,duration:.12,ease:"power4.out"},"<")),w&&(i.to(w.el,{opacity:1,scale:1.25,rotation:-20,duration:.08},"<"),i.to(w.el,{opacity:0,scale:1.4,duration:.18},">")),i.to(a,{x:"+=2",y:"+=2",duration:.04,yoyo:!0,repeat:3});const j=[a,o,d,c,u,h,f,x].filter(Boolean);i.to(j,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.45,ease:"power2.out"},"+=0.15"),v&&(i.to(v.wrapper,{x:0,y:0,rotation:0,duration:.45,ease:"power2.out"},"<"),i.to(v.el,{x:0,y:0,rotation:-20,duration:.45,ease:"power2.out"},"<")),b&&(i.to(b.wrapper,{x:0,y:0,rotation:0,duration:.45,ease:"power2.out"},"<"),i.to(b.el,{x:0,y:0,rotation:-20,duration:.45,ease:"power2.out"},"<"))
  }
}



export class RocketPunchAnimation extends BaseRobotAnimation {
  id="rocket_punch";
  name="ロケットパンチ (Rocket Punch)";
  category = "combat" as RobotAnimationCategory;
  duration=1.8;
  loop = true;
  description="右腕アームのみを猛烈なブーストで標的へ射出！左腕は防御構えを維持し、旋回帰還後にガッチリ再結合。";
  technicalHighlights=["右腕 (ArmRight) の単独分離＆360度ロケットスピン射出 (X: +85px)","左腕 (ArmLeft) の防御ガード保持と体幹ブレ補正","ドッキング時のImpact Bounceとロック衝撃"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,arms:d,armLeft:c,armRight:u,legs:h,legLeft:f,legRight:x}=t;i.to(a,{x:-4,duration:.25},"<"),u&&i.to(u,{x:-16,rotation:-30,duration:.25,ease:"power2.in"},"<"),c&&i.to(c,{x:2,rotation:20,duration:.25,ease:"power2.out"},"<"),!u&&!c&&d&&i.to(d,{x:-12,rotation:-20,duration:.25},"<"),f&&i.to(f,{skewX:-6,duration:.25},"<"),x&&i.to(x,{skewX:8,duration:.25},"<"),i.to(a,{x:-8,duration:.15,ease:"power2.out"},"<").to(o,{rotation:10,duration:.2},"<"),u?i.to(u,{x:88,y:-15,rotation:360,duration:.35,ease:"power4.out"},"<"):d&&i.to(d,{x:85,y:-15,rotation:360,duration:.35,ease:"power4.out"},"<"),u?(i.to(u,{x:60,y:-45,rotation:540,duration:.3,ease:"power1.inOut"}),i.to(u,{x:0,y:0,rotation:720,duration:.4,ease:"back.out(2)"}).to(a,{x:0,duration:.4},"<")):d&&(i.to(d,{x:60,y:-45,rotation:540,duration:.3,ease:"power1.inOut"}),i.to(d,{x:0,y:0,rotation:720,duration:.4,ease:"back.out(2)"}).to(a,{x:0,duration:.4},"<"));const p=[a,o,d,c,u,h,f,x].filter(Boolean);i.to(a,{y:3,duration:.08,yoyo:!0,repeat:1}).to(p,{x:0,y:0,rotation:0,scale:1,duration:.2},"<")
  }
}



export class ShieldBarrierAnimation extends BaseRobotAnimation {
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
}



export class BreakdanceAnimation extends BaseRobotAnimation {
  id="breakdance";
  name="ブレイクダンス (Breakdance)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=2.2;
  loop = true;
  description="左右の脚を互い違いに蹴り出すウィンドミル＆ポッピング！左右手足の独立フリーズポーズ。";
  technicalHighlights=["左右脚部 (LegLeft/LegRight) の対向開脚キック (Rotation: ±55deg)","左右アームのグラウンド支持＆タッティングポーズ","決めポーズでのアイソレーション固定"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legs:f,legLeft:x,legRight:p}=t;i.to(o,{rotation:15,duration:.12},"<").to(d,{skewX:8,duration:.12},"<"),u&&i.to(u,{rotation:-40,x:-6,duration:.12,ease:"steps(3)"},"<"),h&&i.to(h,{rotation:30,x:4,duration:.12,ease:"steps(3)"},"<"),!u&&!h&&c&&i.to(c,{rotation:-40,x:-6,duration:.12,ease:"steps(3)"},"<"),u&&i.to(u,{rotation:40,x:6,duration:.12,ease:"steps(3)"}),h&&i.to(h,{rotation:-30,x:-4,duration:.12,ease:"steps(3)"},"<"),i.to(o,{rotation:-15,duration:.12},"<"),x&&i.to(x,{skewX:-15,duration:.12},"<"),p&&i.to(p,{skewX:15,duration:.12},"<"),i.to(a,{rotation:180,scaleX:-1,y:-15,duration:.3,ease:"power2.inOut"}),u&&i.to(u,{rotation:-90,duration:.3},"<"),h&&i.to(h,{rotation:90,duration:.3},"<"),x&&i.to(x,{rotation:55,duration:.3},"<"),p&&i.to(p,{rotation:-55,duration:.3},"<"),i.to(a,{rotation:360,scaleX:1,y:0,duration:.3,ease:"power2.out"}),u&&i.to(u,{rotation:75,x:12,y:-10,duration:.08,ease:"power4.out"}),h&&i.to(h,{rotation:-60,x:-8,y:-6,duration:.08,ease:"power4.out"},"<"),i.to(o,{rotation:-20,y:-4,duration:.08},"<"),x&&i.to(x,{skewX:20,scaleY:.85,duration:.08},"<"),p&&i.to(p,{skewX:-10,scaleY:1.05,duration:.08},"<"),i.to({},{duration:.4});const b=[a,o,d,c,u,h,f,x,p].filter(Boolean);i.to(b,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.35,ease:"back.out(2)"})
  }
}



export class ExplodedViewAnimation extends BaseRobotAnimation {
  id="exploded_view";
  name="パーツ分解展開図 (Exploded View)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=2.4;
  loop = true;
  description="頭部・胴体・左腕・右腕・左脚・右脚が6方向に完全分離して空中に浮遊し、瞬時に再結合。";
  technicalHighlights=["6パーツ (Head, Body, ArmLeft, ArmRight, LegLeft, LegRight) の放射状完全分離","Sine波による部位ごとの無重力ホバー位相差","結合時の磁力スナップイージング (Back.out(3))"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,body:o,arms:d,armLeft:c,armRight:u,legs:h,legLeft:f,legRight:x}=t;i.to(a,{y:-40,scale:1.08,duration:.5,ease:"back.out(1.8)"}).to(o,{scale:.92,duration:.5,ease:"power2.out"},"<"),c&&i.to(c,{x:-38,y:-10,rotation:-15,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),u&&i.to(u,{x:38,y:-10,rotation:15,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),!c&&!u&&d&&i.to(d,{x:34,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),f&&i.to(f,{x:-20,y:38,rotation:12,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),x&&i.to(x,{x:20,y:38,rotation:-12,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),!f&&!x&&h&&i.to(h,{y:35,scale:1.05,duration:.5,ease:"back.out(1.8)"},"<"),i.to(a,{y:-44,duration:.45,yoyo:!0,repeat:1,ease:"sine.inOut"}).to(o,{scale:.96,duration:.45,yoyo:!0,repeat:1,ease:"sine.inOut"},"<"),c&&i.to(c,{x:-42,duration:.4,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05"),u&&i.to(u,{x:42,duration:.4,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05"),f&&i.to(f,{y:42,duration:.5,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.1"),x&&i.to(x,{y:42,duration:.5,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.1");const p=[a,o,d,c,u,h,f,x].filter(Boolean);i.to(p,{x:0,y:0,rotation:0,scale:1,duration:.35,ease:"back.out(2.5)"})
  }
}



export class OverdriveAnimation extends BaseRobotAnimation {
  id="overdrive";
  name="オーバードライブ覚醒 (Overdrive)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=2;
  loop = true;
  description="出力リミッターを解除！全身が高周波共振し、金色のオーラを噴出させながら戦闘モード突入。";
  technicalHighlights=["高周波振動 (Rough / Jitter Shake) によるリミッター解除表現","AuraOverlayの急膨張パルスとSparklesの明滅","全身の脈動スケール (Scale: 1.12)"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legs:f,legLeft:x,legRight:p,auraOverlay:b,sparkles:v}=t;i.to(a,{scale:.9,y:5,duration:.3,ease:"power2.in"}),b&&i.to(b,{opacity:1,scale:1.4,duration:.2,ease:"power4.out"},"<0.2"),v&&i.to(v,{opacity:1,duration:.2},"<"),i.to(a,{scale:1.15,y:-8,duration:.25,ease:"elastic.out(1, 0.3)"}).to(o,{rotation:10,y:-3,duration:.25},"<"),u&&i.to(u,{rotation:-40,y:-10,duration:.25},"<"),h&&i.to(h,{rotation:-40,y:-10,duration:.25},"<"),!u&&!h&&c&&i.to(c,{rotation:-40,y:-10,duration:.25},"<"),i.to(a,{x:"random(-3, 3)",y:"random(-10, -6)",repeat:8,duration:.06,ease:"none"}),b&&i.to(b,{opacity:0,scale:.8,duration:.4},"-=0.2"),v&&i.to(v,{opacity:0,duration:.3},"<");const w=[a,o,d,c,u,h,f,x,p].filter(Boolean);i.to(w,{x:0,y:0,rotation:0,scale:1,duration:.45,ease:"power2.out"})
  }
}



export class JetDashAnimation extends BaseRobotAnimation {
  id = "jet_dash";
  name = "ジェット超加速ダッシュ (Jet Dash)";
  category = "combat" as RobotAnimationCategory;
  duration = 1.6;
  loop = true;
  description = "脚部を格納して姿勢を前傾させ、背部ジェットバーニアの爆発的推進力で一気に間合いを詰める高速ダッシュ！";
  technicalHighlights = [
    "脚部ボディ格納＆前傾姿勢ブーストフォーム",
    "ジェットバーニア噴射炎 (mountJetpackPlumeEffect) による猛加速",
    "急制動スライディング＆脚部ダンパー展開着地"
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: "ブーストフォーム移行・脚部格納", type: "draw" },
    { time: 0.35, label: "ジェット爆熱点火！", type: "dash" },
    { time: 0.7, label: "超音速急加速！", type: "flame" },
    { time: 1.1, label: "急制動スライディング", type: "hit" }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;
    
    let plumeFx: { wrapper: HTMLElement; flameL: SVGElement; flameR: SVGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      plumeFx = mountJetpackPlumeEffect(fxContainer, 'forward');
      tl.set(plumeFx.wrapper, { opacity: 0 });
    }
    tl.eventCallback('onComplete', () => {
      plumeFx?.cleanup();
    });

    // 1. 脚部格納＆前傾チャージ
    const legElements = [legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { x: -8, y: 2, skewX: 12, rotation: -6, duration: 0.22, ease: "power2.in" });
    tl.to(legElements, { scaleY: 0.05, y: -24, opacity: 0, duration: 0.2, ease: "power2.in" }, "<");
    if (armRight) tl.to(armRight, { rotation: 55, x: 10, y: -4, duration: 0.22 }, "<");
    if (armLeft) tl.to(armLeft, { rotation: -40, x: -8, duration: 0.22 }, "<");

    // 2. ジェット点火＆超加速突進
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 1, duration: 0.1 }, ">");
      tl.to([plumeFx.flameL, plumeFx.flameR], {
        scaleX: 1.4, scaleY: 1.2, duration: 0.08, repeat: 6, yoyo: true, ease: "none"
      }, "<");
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.7, scale: 1.25, duration: 0.25 }, "<");
    }

    tl.to(container, { x: 65, y: -16, skewX: -18, rotation: 12, duration: 0.35, ease: "power4.out" }, "<-0.05");

    // 3. 急制動＆脚部展開着地
    tl.to(container, { x: 20, y: 0, skewX: 14, rotation: -10, duration: 0.3, ease: "power3.out" });
    if (plumeFx) tl.to(plumeFx.wrapper, { opacity: 0, duration: 0.2 }, "<");
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, duration: 0.25 }, "<");
    tl.to(legElements, { scaleY: 1, y: 0, opacity: 1, duration: 0.28, ease: "back.out(2)" }, "<");

    const all = [container, head, body, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, skewX: 0, scale: 1, duration: 0.25 }, ">");
  }
}



export class FlyingKickAnimation extends BaseRobotAnimation {
  id="flying_kick";
  name="跳び回し蹴り (Flying Kick)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=1.6;
  loop = true;
  description="左脚を軸にして踏み込み、右脚を真横に振り抜く鋭い跳び回し蹴り！アームでバランスを制御。";
  technicalHighlights=["右脚 (LegRight) の独立ハイキック (Rotation: 85deg, X: +24px)","左脚 (LegLeft) の軸足サスペンション屈伸","腕部カウンターウェイト旋回"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legs:f,legLeft:x,legRight:p}=t;i.to(a,{x:-10,y:4,duration:.2,ease:"power2.in"}),x&&i.to(x,{scaleY:.8,skewX:10,duration:.2},"<"),p&&i.to(p,{scaleY:.9,y:2,duration:.2},"<"),u&&i.to(u,{rotation:30,duration:.2},"<"),h&&i.to(h,{rotation:-40,duration:.2},"<"),i.to(a,{x:22,y:-16,rotation:-12,duration:.18,ease:"back.out(2)"}).to(o,{rotation:12,duration:.18},"<"),p&&i.to(p,{rotation:80,x:28,y:-12,scaleX:1.15,duration:.15,ease:"power4.out"},"<"),x&&i.to(x,{rotation:-25,scaleY:.85,duration:.18},"<"),u&&i.to(u,{rotation:-60,x:-10,duration:.15},"<"),h&&i.to(h,{rotation:50,x:12,duration:.15},"<"),i.to(a,{x:"+=2",duration:.04,yoyo:!0,repeat:2}),i.to(a,{x:0,y:0,rotation:0,duration:.35,ease:"bounce.out"});const b=[o,d,c,u,h,f,x,p].filter(Boolean);i.to(b,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.3,ease:"power2.out"},"<0.1")
  }
}



export class MarchSprintAnimation extends BaseRobotAnimation {
  id="march_sprint";
  name="手足交互疾走 (Sprint Run)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=1.6;
  loop = true;
  description="左腕と右脚、右腕と左脚が完全に逆位相で大きく振れる本格的なダイナミック走行ループ。";
  technicalHighlights=["対角手足の完全逆位相サイン波駆動 (Phased Alternating Limbs)","走行時の上下ボビングバウンス (Container Y-Bounce: 6Hz)","スピード感あふれる頭部・体幹の微小ロール"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legs:f,legLeft:x,legRight:p}=t,b=gsap.timeline({repeat:2});b.to(a,{y:-6,duration:.15,ease:"power1.out"}).to(o,{rotation:4,duration:.15},"<"),u&&b.to(u,{rotation:55,x:8,duration:.15,ease:"sine.inOut"},"<"),h&&b.to(h,{rotation:-50,x:-8,duration:.15,ease:"sine.inOut"},"<"),x&&b.to(x,{rotation:-35,y:-2,duration:.15,ease:"sine.inOut"},"<"),p&&b.to(p,{rotation:40,y:3,duration:.15,ease:"sine.inOut"},"<"),b.to(a,{y:0,duration:.1,ease:"power1.in"}),b.to(a,{y:-6,duration:.15,ease:"power1.out"}).to(o,{rotation:-4,duration:.15},"<"),u&&b.to(u,{rotation:-50,x:-8,duration:.15,ease:"sine.inOut"},"<"),h&&b.to(h,{rotation:55,x:8,duration:.15,ease:"sine.inOut"},"<"),x&&b.to(x,{rotation:40,y:3,duration:.15,ease:"sine.inOut"},"<"),p&&b.to(p,{rotation:-35,y:-2,duration:.15,ease:"sine.inOut"},"<"),b.to(a,{y:0,duration:.1,ease:"power1.in"}),i.add(b);const v=[a,o,d,c,u,h,f,x,p].filter(Boolean);i.to(v,{x:0,y:0,rotation:0,scale:1,duration:.3,ease:"power2.out"})
  }
}



export class SpinTornadoAnimation extends BaseRobotAnimation {
  id="spin_tornado";
  name="サイクロン回転 (Spin Tornado)";
  category = "acrobatic" as RobotAnimationCategory;
  duration=1.8;
  loop = true;
  description="左右の腕を大きく水平に広げて超高速スピン！回転竜巻を発生させて周囲の全方位を攻撃。";
  technicalHighlights=["左右アームの水平T字展開 (Left: -85deg, Right: +85deg)","ScaleX: -1 と 1 の高速フリップによる擬似3D 360°回転スピン","スピン停止時のめまい微振動"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,arms:d,armLeft:c,armRight:u,legLeft:h,legRight:f}=t;c&&i.to(c,{rotation:-85,scaleX:1.2,duration:.25,ease:"back.out(2)"}),u&&i.to(u,{rotation:85,scaleX:1.2,duration:.25,ease:"back.out(2)"},"<"),h&&i.to(h,{rotation:-15,y:-4,duration:.25},"<"),f&&i.to(f,{rotation:15,y:-4,duration:.25},"<"),!c&&!u&&d&&i.to(d,{rotation:90,scaleX:1.3,duration:.25,ease:"back.out(2)"});const x=gsap.timeline();for(let b=0;b<4;b++)x.to(a,{scaleX:-1,y:-6,duration:.08,ease:"none"}).to(a,{scaleX:1,y:0,duration:.08,ease:"none"});i.add(x),i.to(a,{rotation:-10,duration:.15,ease:"power2.out"}).to(o,{rotation:-15,duration:.15},"<");const p=[a,o,d,c,u].filter(Boolean);i.to(p,{rotation:0,scale:1,scaleX:1,duration:.4,ease:"elastic.out(1, 0.4)"})
  }
}



export class PrecisionScanAnimation extends BaseRobotAnimation {
  id="precision_scan";
  name="精密センサー診断 (Precision Scan)";
  category = "mechanical" as RobotAnimationCategory;
  duration=2.4;
  loop = true;
  description="頭部センサーが左右をスキャン。左腕・右腕・左脚・右脚の各サーボモーターを順番に自己診断。";
  technicalHighlights=["ScanLine要素の上下リニア走査とクリッピング演出","左右アームおよび左右レッグの個別サーボ可動域テスト (Staggered Servo Test)","診断完了時の緑色LEDパルス"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,arms:o,armLeft:d,armRight:c,legs:u,legLeft:h,legRight:f,scanLine:x}=t;i.to(a,{rotation:-25,x:-4,duration:.4,ease:"power2.inOut"}).to(a,{rotation:25,x:4,duration:.6,ease:"power2.inOut"}).to(a,{rotation:0,x:0,duration:.3,ease:"power1.out"}),x&&i.to(x,{opacity:.9,y:-40,duration:.1},"<-0.5").to(x,{y:40,duration:.8,ease:"power1.inOut"}).to(x,{opacity:0,duration:.2}),d&&i.to(d,{rotation:-30,duration:.15,yoyo:!0,repeat:1,ease:"sine.inOut"},"-=0.3"),c&&i.to(c,{rotation:30,duration:.15,yoyo:!0,repeat:1,ease:"sine.inOut"},"-=0.15"),!d&&!c&&o&&i.to(o,{y:-6,rotation:15,duration:.25,yoyo:!0,repeat:1,ease:"sine.inOut"},"-=0.3"),h&&i.to(h,{scaleY:.88,y:2,duration:.12,yoyo:!0,repeat:1},"<"),f&&i.to(f,{scaleY:.88,y:2,duration:.12,yoyo:!0,repeat:1},"+=0.05"),i.to(a,{y:-2,duration:.15,yoyo:!0,repeat:1})
  }
}



export class BioBreathingAnimation extends BaseRobotAnimation {
  id="bio_breathing";
  name="生体同調アイドル (Bio Breathing)";
  category = "mechanical" as RobotAnimationCategory;
  duration=2;
  loop = true;
  description="まるで生きているかのように滑らかな関節の呼吸サイクル。左腕・右腕・脚部が優しく連動。";
  technicalHighlights=["Sine.easeInOut による極めて滑らかな微小脈動ループ","左右の腕にわずかな位相差をつけたオーガニックな連動","CPU負荷を最小限に抑えた最適化カーブ"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,body:o,arms:d,armLeft:c,armRight:u,legs:h,legLeft:f,legRight:x}=t;i.to(o,{y:-3,scaleY:1.03,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"}).to(a,{y:-4,rotation:2,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.1"),c&&i.to(c,{y:-2,rotation:-3,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.15"),u&&i.to(u,{y:-2,rotation:3,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.2"),!c&&!u&&d&&i.to(d,{y:-2,rotation:-4,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.15"),f&&i.to(f,{scaleY:.97,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05"),x&&i.to(x,{scaleY:.97,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05"),!f&&!x&&h&&i.to(h,{scaleY:.97,duration:1,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05")
  }
}



export class HoverFlightAnimation extends BaseRobotAnimation {
  id = "hover_flight";
  name = "反重力ホバー浮遊 (Hover Flight)";
  category = "mechanical" as RobotAnimationCategory;
  duration = 2.4;
  loop = true;
  description = "脚部をボディ内に格納し、底面ジェットバーニアの反重力プラズマ推進で宙に浮遊。気流に乗って優雅に揺らめく。";
  technicalHighlights = [
    "レッグパーツ完全格納＆ツインジェットパック点火",
    "浮遊オフセット (Y: -22px) 上での多重サイン波ホバリング合成",
    "姿勢制御バーニア推力によるリアルタイム微振動"
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: "レッグ格納・バーニア点火", type: "draw" },
    { time: 0.6, label: "反重力ホバー浮遊開始", type: "flame" },
    { time: 1.8, label: "降下・レッグ展開着地", type: "hit" }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;
    
    let plumeFx: { wrapper: HTMLElement; flameL: SVGElement; flameR: SVGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      plumeFx = mountJetpackPlumeEffect(fxContainer, 'up');
      tl.set(plumeFx.wrapper, { opacity: 0 });
    }
    tl.eventCallback('onComplete', () => {
      plumeFx?.cleanup();
    });

    // 1. 脚部をボディにしまい込み、バーニア点火
    const legElements = [legs, legLeft, legRight].filter(Boolean);
    tl.to(legElements, { scaleY: 0.05, y: -26, opacity: 0, duration: 0.28, ease: "power2.in" });
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 1, duration: 0.2 }, "<0.1");
      tl.to([plumeFx.flameL, plumeFx.flameR], {
        scaleY: 0.9, scaleX: 0.85, duration: 0.2, repeat: 9, yoyo: true, ease: "sine.inOut"
      }, "<");
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.4, scale: 1.1, duration: 0.3 }, "<");
    }

    // 2. 宙へふわりと浮上
    tl.to(container, { y: -22, rotation: 2, duration: 0.45, ease: "power2.out" }, "<0.1");
    if (armLeft) tl.to(armLeft, { rotation: -18, x: -4, y: 2, duration: 0.4 }, "<");
    if (armRight) tl.to(armRight, { rotation: 18, x: 4, y: 2, duration: 0.4 }, "<");
    if (head) tl.to(head, { rotation: -3, duration: 0.4 }, "<");

    // 3. 上空でのホバリング浮遊ループ
    tl.to(container, { y: -28, rotation: -2, duration: 0.55, ease: "sine.inOut" });
    tl.to(container, { y: -18, rotation: 2, duration: 0.55, ease: "sine.inOut" });
    if (head) tl.to(head, { rotation: 3, duration: 0.55, ease: "sine.inOut" }, "<");

    // 4. 接地降下・レッグ展開復帰
    tl.to(container, { y: 0, rotation: 0, duration: 0.35, ease: "power2.inOut" });
    if (plumeFx) tl.to(plumeFx.wrapper, { opacity: 0, duration: 0.2 }, "<0.1");
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, duration: 0.25 }, "<");
    tl.to(legElements, { scaleY: 1, y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.8)" }, "<0.1");

    const all = [container, head, body, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.25 }, ">");
  }
}



export class FastRechargeAnimation extends BaseRobotAnimation {
  id="fast_recharge";
  name="急速エネルギー充電 (Fast Recharge)";
  category = "mechanical" as RobotAnimationCategory;
  duration=1.8;
  loop = true;
  description="充電ドックに接続！大地から大電流を吸い上げ、バッテリーゲージを満タンまでチャージ。";
  technicalHighlights=["段階的パルス充電 (Step Charge) による蓄電シミュレーション","AuraOverlayの蓄積発光とSparkles放電","フルチャージ完了時の起動サージ"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legLeft:f,legRight:x,auraOverlay:p,sparkles:b}=t;i.to(a,{y:4,scaleY:.95,duration:.25,ease:"power1.out"}),p&&i.to(p,{opacity:.4,scale:.95,duration:.25}).to(p,{opacity:.7,scale:1.1,duration:.25}).to(p,{opacity:1,scale:1.25,duration:.25}),b&&i.to(b,{opacity:.8,duration:.4},"<-0.3"),i.to(d,{scale:1.08,duration:.3,ease:"power2.out"},"<").to(o,{y:-3,duration:.2},"<"),u&&i.to(u,{rotation:-25,duration:.2},"<"),h&&i.to(h,{rotation:25,duration:.2},"<"),f&&i.to(f,{scaleY:.9,duration:.2},"<"),x&&i.to(x,{scaleY:.9,duration:.2},"<"),!u&&!h&&c&&i.to(c,{rotation:-25,duration:.2},"<"),i.to(a,{y:-6,scale:1.08,duration:.15,ease:"back.out(2)"}),p&&i.to(p,{opacity:0,duration:.3},"<"),b&&i.to(b,{opacity:0,duration:.2},"<");const v=[a,o,d,c,u,h].filter(Boolean);i.to(v,{x:0,y:0,rotation:0,scale:1,scaleY:1,duration:.35,ease:"power2.out"})
  }
}



export class SleepStandbyAnimation extends BaseRobotAnimation {
  id="sleep_standby";
  name="省電力スリープ (Sleep Standby)";
  category = "mechanical" as RobotAnimationCategory;
  duration=2.6;
  loop = true;
  description="首を傾げてシステムをスリープへ移行。超低周波のスタンバイモードでゆっくりと呼吸。";
  technicalHighlights=["Power2.in による電源シャットダウン風の重力脱力沈み込み","超低速 (0.2Hz) スリープ微動","再起動時の起動パルス"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,body:o,arms:d,armLeft:c,armRight:u,legs:h,legLeft:f,legRight:x}=t;i.to(a,{y:7,rotation:18,duration:.7,ease:"power2.inOut"}).to(o,{y:4,scaleY:.96,duration:.7,ease:"power2.inOut"},"<"),c&&i.to(c,{y:6,rotation:12,duration:.7,ease:"power2.inOut"},"<"),u&&i.to(u,{y:6,rotation:18,duration:.7,ease:"power2.inOut"},"<"),!c&&!u&&d&&i.to(d,{y:6,rotation:15,duration:.7,ease:"power2.inOut"},"<"),f&&i.to(f,{scaleY:.94,duration:.7},"<"),x&&i.to(x,{scaleY:.94,duration:.7},"<"),i.to(o,{y:2,duration:.6,yoyo:!0,repeat:1,ease:"sine.inOut"}).to(a,{y:5,duration:.6,yoyo:!0,repeat:1,ease:"sine.inOut"},"<"),i.to(a,{y:0,rotation:0,duration:.4,ease:"back.out(2)"});const p=[o,d,c,u,h,f,x].filter(Boolean);i.to(p,{x:0,y:0,rotation:0,scale:1,scaleY:1,duration:.4,ease:"power2.out"},"<0.05")
  }
}



export class CalibrationAnimation extends BaseRobotAnimation {
  id="calibration";
  name="関節キャリブレーション (Calibration)";
  category = "mechanical" as RobotAnimationCategory;
  duration=2;
  loop = true;
  description="左腕・右腕・頭部・脚部を順番に動かして可動範囲とトルクをチェックする初期化シーケンス。";
  technicalHighlights=["左腕 (ArmLeft) と右腕 (ArmRight) の独立可動角チェック","メカニカルな段階角度チェック (Angle Stepping)","全関節シンクロ動作確認"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,arms:o,armLeft:d,armRight:c,legs:u,legLeft:h,legRight:f}=t;d&&i.to(d,{rotation:-60,duration:.25,ease:"power2.inOut"}).to(d,{rotation:40,duration:.25,ease:"power2.inOut"}).to(d,{rotation:0,duration:.15}),c&&i.to(c,{rotation:60,duration:.25,ease:"power2.inOut"}).to(c,{rotation:-40,duration:.25,ease:"power2.inOut"}).to(c,{rotation:0,duration:.15}),!d&&!c&&o&&i.to(o,{rotation:-60,duration:.3,ease:"power2.inOut"}).to(o,{rotation:60,duration:.3,ease:"power2.inOut"}).to(o,{rotation:0,duration:.2}),i.to(a,{rotation:-30,duration:.2,ease:"power2.inOut"}).to(a,{rotation:30,duration:.2,ease:"power2.inOut"}).to(a,{rotation:0,duration:.15}),h&&i.to(h,{scaleY:.8,y:4,duration:.15,yoyo:!0,repeat:1,ease:"sine.inOut"}),f&&i.to(f,{scaleY:.8,y:4,duration:.15,yoyo:!0,repeat:1,ease:"sine.inOut"},"<0.05"),i.to(a,{y:-3,duration:.15,yoyo:!0,repeat:1}),d&&i.to(d,{y:-4,duration:.15,yoyo:!0,repeat:1},"<"),c&&i.to(c,{y:-4,duration:.15,yoyo:!0,repeat:1},"<")
  }
}






export class PanicTroubledAnimation extends BaseRobotAnimation {
  id="panic_troubled";
  name="パニック・オーバーヒート (Panic)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.6;
  loop = true;
  description="両手で頭を抱えて右往左往！冷却が追いつかずオーバーヒート気味にオロオロ激しく震える。";
  technicalHighlights=["左右腕 (ArmLeft/ArmRight) の独立頭部抱え込みポジション","高周波左右ジッターシェイク (X: ±6px, Freq: 20Hz)","Bodyの温度上昇風のパルス"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,arms:d,armLeft:c,armRight:u,legLeft:h,legRight:f}=t;i.to(o,{y:4,scale:.95,duration:.25},"<"),c&&i.to(c,{rotation:45,x:8,y:-14,duration:.25,ease:"power2.out"},"<"),u&&i.to(u,{rotation:-45,x:-8,y:-14,duration:.25,ease:"power2.out"},"<"),h&&i.to(h,{rotation:-20,x:-4,duration:.25},"<"),f&&i.to(f,{rotation:20,x:4,duration:.25},"<"),!c&&!u&&d&&i.to(d,{rotation:-110,y:-18,scaleX:.9,duration:.25,ease:"power2.out"},"<"),i.to(a,{x:"random(-6, 6)",y:"random(-2, 2)",rotation:"random(-5, 5)",repeat:12,duration:.06,ease:"none"}),i.to(o,{y:6,rotation:10,duration:.3,ease:"power2.out"});const x=[a,o,d,c,u].filter(Boolean);i.to(x,{x:0,y:0,rotation:0,scale:1,scaleX:1,duration:.35,ease:"power2.out"},"<0.15")
  }
}



export class PoliteBowAnimation extends BaseRobotAnimation {
  id="polite_bow";
  name="職人への一礼・敬礼 (Polite Bow)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.8;
  loop = true;
  description="背筋をまっすぐに伸ばし、職人へ感謝を込めて丁寧なおじぎをして敬礼。";
  technicalHighlights=["クリーンな多関節連動による美しい90度おじぎ","おじぎ最深部での静止時間（マナー表現）","復帰時のスマートな背筋伸長"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,arms:c,armLeft:u,armRight:h,legLeft:f,legRight:x}=t;u&&i.to(u,{rotation:10,y:2,duration:.2,ease:"power1.out"}),h&&i.to(h,{rotation:-10,y:2,duration:.2,ease:"power1.out"},"<"),f&&i.to(f,{scaleY:.95,duration:.2},"<"),x&&i.to(x,{scaleY:.95,duration:.2},"<"),!u&&!h&&c&&i.to(c,{rotation:10,y:2,duration:.2,ease:"power1.out"}),i.to(a,{y:6,duration:.4,ease:"power2.inOut"}).to(d,{rotation:18,duration:.4,ease:"power2.inOut"},"<").to(o,{rotation:28,y:8,duration:.4,ease:"power2.inOut"},"<"),u&&i.to(u,{rotation:20,y:6,duration:.4,ease:"power2.inOut"},"<"),h&&i.to(h,{rotation:20,y:6,duration:.4,ease:"power2.inOut"},"<"),i.to({},{duration:.4});const p=[a,d,o,c,u,h].filter(Boolean);i.to(p,{x:0,y:0,rotation:0,duration:.5,ease:"power2.out"})
  }
}






export class CuriousTiltAnimation extends BaseRobotAnimation {
  id="curious_tilt";
  name="好奇心の首かしげ (Curious Tilt)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.8;
  loop = true;
  description="興味深そうに首をピクッと左右に傾げ、未知の素材やマスターの手元をじっと観察。";
  technicalHighlights=["Back.out によるキレのある首傾げ動作 (Rotation: -28 / +28deg)","目の焦点合わせを意識したBodyの寄り","ピコッと反応するアンテナ表現"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,armLeft:d,armRight:c,legLeft:u,legRight:h}=t;i.to(o,{rotation:-26,x:-3,y:-2,duration:.3,ease:"back.out(2)"}),d&&i.to(d,{rotation:-15,y:-2,duration:.3},"<"),c&&i.to(c,{rotation:10,y:2,duration:.3},"<").to(a,{x:2,duration:.3},"<"),i.to({},{duration:.35}),i.to(o,{rotation:26,x:3,y:-2,duration:.35,ease:"back.out(2)"}),d&&i.to(d,{rotation:15,y:2,duration:.35},"<"),c&&i.to(c,{rotation:-10,y:-2,duration:.35},"<"),i.to({},{duration:.35}),i.to([a,o],{x:0,y:0,rotation:0,duration:.3,ease:"power2.out"})
  }
}



export class NodAgreeAnimation extends BaseRobotAnimation {
  id="nod_agree";
  name="納得の力強い頷き (Nod Agree)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.6;
  loop = true;
  description="「了解！」「任せて！」と力強くコクコクと2回頷き、頼もしく合図を送る。";
  technicalHighlights=["2段の力強い垂直Nodイージング (Power3.inOut)","左右腕の力強いサムズアップ風ガッツ連動","キリッとした姿勢保持"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{head:a,arms:o,armLeft:d,armRight:c,legLeft:u,legRight:h}=t;i.to(a,{y:8,rotation:12,duration:.2,ease:"power2.in"}),d&&i.to(d,{y:-4,rotation:-12,duration:.2},"<"),c&&i.to(c,{y:-4,rotation:12,duration:.2},"<"),u&&i.to(u,{y:2,scaleY:.9,duration:.2},"<"),h&&i.to(h,{y:2,scaleY:.9,duration:.2},"<"),!d&&!c&&o&&i.to(o,{y:-4,rotation:-15,duration:.2},"<"),i.to(a,{y:-2,rotation:0,duration:.2,ease:"power2.out"}),i.to(a,{y:10,rotation:15,duration:.18,ease:"power2.in"}),d&&i.to(d,{y:-6,rotation:-20,scale:1.05,duration:.18},"<"),c&&i.to(c,{y:-6,rotation:20,scale:1.05,duration:.18},"<"),!d&&!c&&o&&i.to(o,{y:-6,rotation:-25,scale:1.05,duration:.18},"<"),i.to(a,{y:0,rotation:0,duration:.25,ease:"back.out(2)"});const f=[a,o,d,c].filter(Boolean);i.to(f,{x:0,y:0,rotation:0,scale:1,duration:.3,ease:"power2.out"})
  }
}



export class BanzaiCheerAnimation extends BaseRobotAnimation {
  id="banzai_cheer";
  name="バンザイ大歓喜 (Banzai!)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.5;
  loop = true;
  description="両腕を高く突き上げて「バンザイ！」と全身で喜びを表現。足も元気よくステップします。";
  technicalHighlights=["左右の腕 (ArmLeft/ArmRight) の完全独立バンザイポーズ","左右の足 (LegLeft/LegRight) の独立ステップアニメーション"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,armLeft:d,armRight:c,legLeft:u,legRight:h,sparkles:f}=t;f&&i.to(f,{opacity:1,duration:.3}),i.to(o,{y:-6,rotation:-10,duration:.25,ease:"back.out(2)"},"<").to(a,{y:-15,duration:.25,ease:"power2.out"},"<"),d&&i.to(d,{rotation:160,x:-10,y:-20,duration:.25,ease:"back.out(2)"},"<"),c&&i.to(c,{rotation:-160,x:10,y:-20,duration:.25,ease:"back.out(2)"},"<"),u&&i.to(u,{scaleY:1.1,duration:.25},"<"),h&&i.to(h,{y:-10,rotation:15,duration:.25,ease:"power2.out"},"<"),i.to(o,{rotation:10,duration:.2,yoyo:!0,repeat:3,ease:"sine.inOut"}).to(a,{rotation:5,duration:.2,yoyo:!0,repeat:3,ease:"sine.inOut"},"<"),d&&i.to(d,{rotation:140,duration:.2,yoyo:!0,repeat:3,ease:"sine.inOut"},"<"),c&&i.to(c,{rotation:-140,duration:.2,yoyo:!0,repeat:3,ease:"sine.inOut"},"<"),h&&i.to(h,{y:0,rotation:0,duration:.2},"<0.2"),u&&i.to(u,{y:-10,rotation:-15,duration:.2},"<0.2"),u&&i.to(u,{y:0,rotation:0,duration:.2},"<0.4"),f&&i.to(f,{opacity:0,duration:.25});const x=[a,o,d,c,u,h].filter(Boolean);i.to(x,{x:0,y:0,rotation:0,scale:1,scaleY:1,duration:.4,ease:"power2.out"})
  }
}



export class YayRejoiceAnimation extends BaseRobotAnimation {
  id="yay_rejoice";
  name="やった～！大はしゃぎ (Yay!)";
  category = "emotion" as RobotAnimationCategory;
  duration=1.2;
  loop = true;
  description="腕を前後に振りながらピョンピョン跳ねる、無邪気で可愛らしい喜ぶアクション。";
  technicalHighlights=["左右腕の非対称な前後スイング","左右足の交互ジャンプ (Independent Legs)"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,armLeft:d,armRight:c,legLeft:u,legRight:h,sparkles:f}=t;f&&i.to(f,{opacity:1,duration:.2}),i.to(a,{y:-12,duration:.15,yoyo:!0,repeat:5,ease:"sine.inOut"},"<"),i.to(o,{rotation:10,duration:.15,yoyo:!0,repeat:5,ease:"sine.inOut"},"<"),d&&i.to(d,{rotation:-60,x:-10,y:-10,duration:.15,yoyo:!0,repeat:5,ease:"sine.inOut"},"<"),c&&i.to(c,{rotation:60,x:10,y:-10,duration:.15,yoyo:!0,repeat:5,ease:"sine.inOut"},"<"),u&&i.to(u,{y:-8,rotation:-10,duration:.3,yoyo:!0,repeat:2,ease:"power1.inOut"},"<"),h&&i.to(h,{y:-8,rotation:10,duration:.3,yoyo:!0,repeat:2,ease:"power1.inOut"},"<0.15"),f&&i.to(f,{opacity:0,duration:.2});const x=[a,o,d,c,u,h].filter(Boolean);i.to(x,{x:0,y:0,rotation:0,duration:.3,ease:"power2.out"})
  }
}



export class MissileBarrageAnimation extends BaseRobotAnimation {
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
}






export class ShieldBlockItemAnimation extends BaseRobotAnimation {
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
}



export class MissileFireItemAnimation extends BaseRobotAnimation {
  id="missile_fire_item";
  name="スマートミサイル発射 (Missile Launch)";
  category = "combat" as RobotAnimationCategory;
  duration=2;
  loop = true;
  description="背中または肩からスマートミサイルを射出！ミサイルが弧を描いて飛んでいきます。";
  technicalHighlights=["動的SVGによるミサイルオブジェクトの生成","GSAPモーションパス風の曲線軌道アニメーション"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,armLeft:c,armRight:u,legLeft:h,legRight:f,fxContainer:x}=t;let p=null,b=null;x&&typeof document<"u"&&(p=document.createElement("div"),p.className="absolute w-12 h-6 pointer-events-none drop-shadow-[0_0_6px_#ef4444]",p.style.top="10%",p.style.left="40%",p.style.opacity="0",p.innerHTML='<svg viewBox="0 0 100 40" class="w-full h-full text-red-500 fill-current"><path d="M0,15 L20,10 L80,10 L100,20 L80,30 L20,30 L0,25 Z"/></svg>',x.appendChild(p),b=document.createElement("div"),b.className="absolute w-16 h-16 pointer-events-none rounded-full bg-stone-300 blur-md opacity-0",b.style.top="5%",b.style.left="35%",x.appendChild(b)),i.eventCallback("onComplete",()=>{p&&p.parentNode&&p.parentNode.removeChild(p),b&&b.parentNode&&b.parentNode.removeChild(b)}),i.to(d,{y:4,duration:.3,ease:"power2.inOut"}).to(o,{rotation:-10,duration:.3},"<").to(a,{rotation:5,duration:.3},"<"),h&&i.to(h,{scaleY:.9,x:-5,duration:.3},"<"),f&&i.to(f,{scaleY:.9,x:5,duration:.3},"<"),c&&i.to(c,{rotation:20,x:-5,duration:.3},"<"),u&&i.to(u,{rotation:20,x:5,duration:.3},"<"),i.to(a,{y:8,duration:.1,ease:"power4.out"},"+=0.2"),p&&(i.to(p,{opacity:1,duration:.05},"<"),i.to(p,{x:300,duration:.6,ease:"power1.in"},"<"),i.to(p,{y:-100,duration:.3,ease:"power2.out"},"<"),i.to(p,{rotation:-15,duration:.3,ease:"power2.out"},"<"),i.to(p,{y:20,duration:.3,ease:"power2.in"},"<0.3"),i.to(p,{rotation:25,duration:.3,ease:"power2.in"},"<")),b&&(i.to(b,{opacity:.8,scale:1.5,duration:.2},"<"),i.to(b,{opacity:0,scale:3,duration:.4},">"));const v=[a,o,d,c,u,h,f].filter(Boolean);i.to(v,{x:0,y:0,rotation:0,scale:1,scaleY:1,duration:.5,ease:"power2.inOut"},"+=0.2")
  }
}



export class FlameBladeCycloneAnimation extends BaseRobotAnimation {
  seMarkers: AnimationSEMarker[] = [{time:.2,label:"旋風跳躍構え",type:"draw"},{time:.4,label:"720°火炎旋風",type:"slash"},{time:.75,label:"全周囲炎刃風",type:"flame"},{time:1.05,label:"着地衝撃",type:"hit"}];
  id="flame_blade_cyclone";
  name="炎刃・旋風回転斬り (Flame Cyclone)";
  category = "combat" as RobotAnimationCategory;
  duration=1.6;
  loop = true;
  description="炎の曲刀を真横に突き出し、低空跳躍から全身を高速360度×2回転させて全周囲を薙ぎ払う豪快な回転奥義。";
  technicalHighlights=["炎の曲刀SVGの水平固定マウント","3D風の高速スピン回転 (Container rotation: 720deg & Y軸浮遊)","全方位への炎の円舞エフェクト"];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,armLeft:c,armRight:u,legLeft:h,legRight:f,fxContainer:x}=t;let p=null,b=null;x&&typeof document<"u"&&(p=mountPlasmaBlade(x,{hand:"right",sizePercent:54,initialRotation:45,armPartKey:t.armPartKey}),b=mountGroundShatterEffect(x),i.set(p.wrapper,{opacity:1}),i.set(p.el,{opacity:0})),i.eventCallback("onComplete",()=>{p==null||p.cleanmountBeamSlashEffect(),b==null||b.cleanmountBeamSlashEffect()}),i.to(a,{y:4,scaleY:.92,duration:.2,ease:"power2.in"}),u&&i.to(u,{rotation:45,x:10,duration:.2},"<"),p&&(i.to(p.wrapper,{rotation:45,x:10,duration:.2},"<"),i.to(p.el,{opacity:1,rotation:20,duration:.2},"<")),c&&i.to(c,{rotation:-45,x:-10,duration:.2},"<"),i.to(a,{y:-25,scaleY:1.08,duration:.18,ease:"power2.out"}),h&&i.to(h,{scaleY:.8,duration:.18},"<"),f&&i.to(f,{scaleY:.8,duration:.18},"<"),i.to(a,{rotation:720,duration:.65,ease:"power2.inOut"}),b&&(i.to(b.el,{opacity:.85,scale:1.3,rotation:360,duration:.3},"<"),i.to(b.el,{opacity:0,scale:1.5,duration:.35},">")),i.to(a,{y:2,scaleY:.9,duration:.15,ease:"power3.out"}),i.to(a,{x:"+=2",y:"+=2",duration:.04,yoyo:!0,repeat:2}),i.to({},{duration:.2}),p&&(i.to(p.el,{opacity:0,duration:.2},">"),i.to(p.wrapper,{x:0,y:0,rotation:0,duration:.35,ease:"power2.out"},"<"));const v=[a,o,d,c,u,h,f].filter(Boolean);i.to(v,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.35,ease:"power2.out"},"<")
  }
}



export class FlameBladeThrustAnimation extends BaseRobotAnimation {
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
}




export class BeamSaberJudgementAnimation extends BaseRobotAnimation {
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
}



export class DualSaberMirageDanceAnimation extends BaseRobotAnimation {
  id="dual_saber_mirage_dance";
  name="双剣・幻影乱舞 (Mirage Saber Dance)";
  category = "combat" as RobotAnimationCategory;
  duration=1.9;
  loop = true;
  description="左右両腕に長刀ビームサーベルを構え、左右交互の神速4連スラッシュからX字クロスフィニッシュを叩き込む高速連撃奥義。";
  technicalHighlights=["左右両腕への長刀ビームサーベル同時マウント＆独立軌道制御","左袈裟→右逆袈裟→左水平薙ぎ払い→右切り上げの神速4連撃","フィニッシュ時の同時X字クロス交差と強烈なプラズマ閃光"];
  seMarkers: AnimationSEMarker[] = [{time:.2,label:"双剣起動",type:"draw"},{time:.4,label:"1段目・左袈裟斬り",type:"slash"},{time:.6,label:"2段目・右逆袈裟",type:"slash"},{time:.82,label:"3段目・左薙ぎ払い",type:"slash"},{time:1.05,label:"X字クロスフィニッシュ！",type:"slash"},{time:1.25,label:"交差爆砕インパクト",type:"hit"}];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,armLeft:c,armRight:u,legLeft:h,legRight:f,fxContainer:x}=t;let p=null,b=null,v=null;x&&typeof document<"u"&&(p=mountPlasmaBlade(x,{hand:"right",sizePercent:54,initialRotation:-30,armPartKey:t.armPartKey}),b=mountPlasmaBlade(x,{hand:"left",sizePercent:54,initialRotation:-30,armPartKey:t.armPartKey}),v=mountGroundShatterEffect(x),i.set([p.wrapper,b.wrapper],{opacity:1}),i.set([p.el,b.el],{opacity:0})),i.eventCallback("onComplete",()=>{p==null||p.cleanmountBeamSlashEffect(),b==null||b.cleanmountBeamSlashEffect(),v==null||v.cleanmountBeamSlashEffect()}),i.to(a,{y:2,scaleY:.95,duration:.2}),c&&i.to(c,{rotation:-40,x:-8,y:-4,duration:.2},"<"),u&&i.to(u,{rotation:-40,x:8,y:-4,duration:.2},"<"),b&&(i.to(b.wrapper,{rotation:-40,x:-8,y:-4,duration:.2},"<"),i.to(b.el,{opacity:1,duration:.2},"<")),p&&(i.to(p.wrapper,{rotation:-40,x:8,y:-4,duration:.2},"<"),i.to(p.el,{opacity:1,duration:.2},"<")),i.to(a,{x:12,duration:.12,ease:"power3.out"}),c&&i.to(c,{rotation:65,x:14,duration:.12,ease:"power4.out"},"<"),b&&(i.to(b.wrapper,{rotation:65,x:14,duration:.12,ease:"power4.out"},"<"),i.to(b.el,{rotation:25,duration:.12},"<")),o&&i.to(o,{rotation:10,duration:.12},"<"),i.to(a,{x:18,duration:.14,ease:"power3.out"}),u&&i.to(u,{rotation:70,x:16,duration:.14,ease:"power4.out"},"<"),p&&(i.to(p.wrapper,{rotation:70,x:16,duration:.14,ease:"power4.out"},"<"),i.to(p.el,{rotation:20,duration:.14},"<")),c&&i.to(c,{rotation:-20,x:-4,duration:.14},"<"),b&&i.to(b.wrapper,{rotation:-20,x:-4,duration:.14},"<"),i.to(a,{x:22,duration:.14,ease:"power3.out"}),c&&i.to(c,{rotation:80,x:18,duration:.14,ease:"power4.out"},"<"),b&&(i.to(b.wrapper,{rotation:80,x:18,duration:.14,ease:"power4.out"},"<"),i.to(b.el,{rotation:35,duration:.14},"<")),u&&i.to(u,{rotation:-30,x:-6,duration:.14},"<"),p&&i.to(p.wrapper,{rotation:-30,x:-6,duration:.14},"<"),i.to(a,{x:28,y:-3,scaleX:1.1,duration:.15,ease:"back.out(2)"}),c&&i.to(c,{rotation:55,x:12,y:-6,duration:.15,ease:"power4.out"},"<"),u&&i.to(u,{rotation:55,x:14,y:-6,duration:.15,ease:"power4.out"},"<"),b&&(i.to(b.wrapper,{rotation:55,x:12,y:-6,duration:.15,ease:"power4.out"},"<"),i.to(b.el,{rotation:30,duration:.15},"<")),p&&(i.to(p.wrapper,{rotation:55,x:14,y:-6,duration:.15,ease:"power4.out"},"<"),i.to(p.el,{rotation:-30,duration:.15},"<")),v&&(i.to(v.el,{opacity:1,scale:1.4,rotation:45,duration:.08},"<"),i.to(v.el,{opacity:0,scale:1.6,duration:.2},">")),i.to(a,{x:"+=2",y:"+=2",duration:.035,yoyo:!0,repeat:4}),i.to({},{duration:.2}),b&&(i.to(b.el,{opacity:0,duration:.25},">"),i.to(b.wrapper,{x:0,y:0,rotation:0,duration:.35,ease:"power2.out"},"<")),p&&(i.to(p.el,{opacity:0,duration:.25},"<"),i.to(p.wrapper,{x:0,y:0,rotation:0,duration:.35,ease:"power2.out"},"<"));const w=[a,o,d,c,u,h,f].filter(Boolean);i.to(w,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.35,ease:"power2.out"},"<")
  }
}









export class UltimateOmegaCrossSlashAnimation extends BaseRobotAnimation {
  id="ultimate_omega_cross_slash";
  name="【必殺奥義】星断オメガクロス (Omega Slash)";
  category = "combat" as RobotAnimationCategory;
  duration=3.2;
  loop = true;
  description="【必殺技カットイン＆極大エフェクト演出】極限プラズマをチャージした長刀ビームサーベルで超神速踏み込みを行い、空間を切り裂く極大X字クロス両断を叩き込む終極奥義！";
  technicalHighlights=["ドラマチック必殺技カットインバナー（Eye / Cut-in Banner）のインプレース演出","超高密度集中スピードライン＆極大エネルギーオーラのタイムライン連動","両腕ビームサーベルによる神速クロス踏み込み＆画面全体を両断するX字極大斬撃光線","重厚な画面フラッシュ、衝撃波振動シェイク、そして静寂の残心ポーズ"];
  seMarkers: AnimationSEMarker[] = [{time:.2,label:"抜刀＆構え",type:"draw"},{time:.5,label:"必殺カットイン！",type:"cutin"},{time:1.1,label:"エネルギー極大充填",type:"charge"},{time:1.65,label:"神速踏み込み",type:"flame"},{time:1.95,label:"星断オメガクロス一閃！",type:"slash"},{time:2.15,label:"終極爆砕フィニッシュ！",type:"hyper"}];

  build(t: RobotDOMRefs, i: gsap.core.Timeline): void {
    this.resetElements(t,i);const{container:a,head:o,body:d,armLeft:c,armRight:u,legLeft:h,legRight:f,fxContainer:x}=t;let p=null,b=null,v=null,w=null,j=null;x&&typeof document<"u"&&(p=mountPlasmaBlade(x,{hand:"right",sizePercent:66,initialRotation:-15,armPartKey:t.armPartKey}),b=mountPlasmaBlade(x,{hand:"left",sizePercent:66,initialRotation:15,armPartKey:t.armPartKey}),v=mountDualSabers(x,{title:"星断・オメガクロス斬",subtitle:"ULTIMATE SWORD FINISHER",themeColor:"cyan"}),w=mountDualSlashEffect(x),j=mountIaidoSlashEffect(x),i.set([p.wrapper,b.wrapper],{opacity:1}),i.set([p.el,b.el],{opacity:0})),i.eventCallback("onComplete",()=>{p==null||p.cleanmountBeamSlashEffect(),b==null||b.cleanmountBeamSlashEffect(),v==null||v.cleanmountBeamSlashEffect(),w==null||w.cleanmountBeamSlashEffect(),j==null||j.cleanmountBeamSlashEffect()}),i.to(a,{y:6,scaleY:.96,duration:.35,ease:"power2.out"}),u&&i.to(u,{rotation:-35,x:6,duration:.35,ease:"power2.out"},"<"),c&&i.to(c,{rotation:35,x:-6,duration:.35,ease:"power2.out"},"<"),p&&(i.to(p.wrapper,{rotation:-35,x:6,duration:.35,ease:"power2.out"},"<"),i.to(p.el,{opacity:1,duration:.3},"<")),b&&(i.to(b.wrapper,{rotation:35,x:-6,duration:.35,ease:"power2.out"},"<"),i.to(b.el,{opacity:1,duration:.3},"<")),v&&(i.to(v.flashEl,{opacity:.85,duration:.08,ease:"power2.out"}),i.to(v.flashEl,{opacity:0,duration:.15},">"),i.fromTo(v.banner,{opacity:0,x:-60,scaleY:.3},{opacity:1,x:0,scaleY:1,duration:.22,ease:"back.out(1.8)"},"<"),i.to(v.banner,{x:10,duration:.5,ease:"none"}),i.to(v.banner,{opacity:0,x:60,scaleY:.2,duration:.18,ease:"power3.in"},">")),w&&(i.fromTo(w.el,{opacity:0,scale:.5,rotation:-90},{opacity:1,scale:1.25,rotation:180,duration:.55,ease:"power2.out"},"<-0.2"),i.to(w.el,{rotation:360,scale:1.35,duration:.3,ease:"none"})),i.to(a,{y:12,scaleX:1.08,scaleY:.92,duration:.45,ease:"power3.inOut"},"<"),o&&i.to(o,{y:3,rotation:-5,duration:.45},"<"),u&&i.to(u,{rotation:-60,x:-10,duration:.45},"<"),c&&i.to(c,{rotation:60,x:10,duration:.45},"<"),p&&i.to(p.wrapper,{rotation:-60,x:-10,duration:.45},"<"),b&&i.to(b.wrapper,{rotation:60,x:10,duration:.45},"<"),i.to(a,{x:38,y:-8,scaleX:1.15,scaleY:.95,duration:.14,ease:"power4.in"}),w&&i.to(w.el,{opacity:0,scale:1.6,duration:.1},"<"),u&&i.to(u,{rotation:85,x:30,y:10,duration:.1,ease:"power4.out"},"<"),c&&i.to(c,{rotation:-85,x:30,y:-10,duration:.1,ease:"power4.out"},"<"),p&&i.to(p.wrapper,{rotation:85,x:30,y:10,duration:.1,ease:"power4.out"},"<"),b&&i.to(b.wrapper,{rotation:-85,x:30,y:-10,duration:.1,ease:"power4.out"},"<"),j&&(i.fromTo(j.el,{opacity:0,scale:.4,rotation:-25},{opacity:1,scale:1.3,rotation:0,duration:.12,ease:"power4.out"},"<"),i.to(j.el,{scale:1.5,opacity:0,duration:.35,ease:"power2.out"},">")),v&&(i.to(v.flashEl,{opacity:.95,duration:.05},"<-0.3"),i.to(v.flashEl,{opacity:0,duration:.25},">")),i.to(a,{x:"+=6",y:"+=6",duration:.03,yoyo:!0,repeat:7},"<-0.3"),i.to(a,{x:20,y:4,duration:.2,ease:"power2.out"}),i.to({},{duration:.5}),p&&(i.to(p.el,{opacity:0,duration:.3},">"),i.to(p.wrapper,{x:0,y:0,rotation:0,duration:.4,ease:"power2.out"},"<")),b&&(i.to(b.el,{opacity:0,duration:.3},"<"),i.to(b.wrapper,{x:0,y:0,rotation:0,duration:.4,ease:"power2.out"},"<"));const S=[a,o,d,c,u,h,f].filter(Boolean);i.to(S,{x:0,y:0,rotation:0,scale:1,scaleX:1,scaleY:1,skewX:0,duration:.4,ease:"power2.out"},"<")
  }
}



/**
 * 両手持ちスコープ精密狙撃 (Two-Handed Sniper Scope Shot)
 * スコープに顔（目）を密着させ、左手でグリップを握り、右手でトリガーを引き、
 * 超電導貫通ビームレール弾を撃ち放つ本格精密スナイパーアニメーション。
 */

/**
 * ため息・落胆エフェクト（青白いため息クラウド＆青ざめ縦線）
 */
export function mountSighEffect(container: HTMLElement): {
  wrapper: HTMLDivElement;
  cloud: SVGGElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  const uid = 'sigh_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform';
  wrapper.innerHTML = `
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_2px_6px_rgba(59,130,246,0.5)]">
      <!-- 青ざめ縦線（頭部上方） -->
      <g id="${uid}-drop-lines" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" opacity="0.6">
        <line x1="135" y1="50" x2="135" y2="85" stroke-dasharray="4 3"/>
        <line x1="145" y1="42" x2="145" y2="90" stroke-dasharray="6 3"/>
        <line x1="155" y1="45" x2="155" y2="85" stroke-dasharray="4 3"/>
        <line x1="165" y1="52" x2="165" y2="80" stroke-dasharray="5 3"/>
      </g>
      <!-- ため息クラウド（口元付近からフワ〜と漂う） -->
      <g id="${uid}-cloud" transform="translate(165, 125)">
        <path d="M 0,0 Q 8,-12 20,-8 Q 32,-4 30,8 Q 28,18 16,18 Q 4,18 0,0 Z" fill="rgba(191,219,254,0.75)" stroke="#93c5fd" stroke-width="1.5"/>
        <circle cx="34" cy="4" r="3" fill="rgba(191,219,254,0.6)"/>
        <circle cx="42" cy="0" r="2" fill="rgba(191,219,254,0.5)"/>
      </g>
    </svg>
  `;
  container.appendChild(wrapper);
  const cloud = wrapper.querySelector(`#${uid}-cloud`) as SVGGElement;
  return {
    wrapper,
    cloud,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}

/**
 * 激怒エフェクト（怒りマーク 💢 ＆ 頭部スチーム蒸気）
 */
export function mountAngryMarksEffect(container: HTMLElement): {
  wrapper: HTMLDivElement;
  marks: SVGGElement;
  steam: SVGGElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  const uid = 'angry_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform';
  wrapper.innerHTML = `
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
      <!-- 怒りマーク（頭の右上） -->
      <g id="${uid}-marks" transform="translate(180, 50)">
        <!-- 漫画風の💢マーク -->
        <path d="M -12,-4 L -4,-12 M -4,-12 L 4,-12 M 4,-12 L 12,-4 M 12,-4 L 12,4 M 12,4 L 4,12 M 4,12 L -4,12 M -4,12 L -12,4 Z" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="8" y1="-8" x2="-8" y2="8" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <!-- 頭部左右からのスチーム蒸気 -->
      <g id="${uid}-steam" stroke="#fca5a5" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8">
        <path d="M 120,65 Q 110,45 105,35" stroke-dasharray="6 4"/>
        <path d="M 180,65 Q 190,45 195,35" stroke-dasharray="6 4"/>
      </g>
    </svg>
  `;
  container.appendChild(wrapper);
  const marks = wrapper.querySelector(`#${uid}-marks`) as SVGGElement;
  const steam = wrapper.querySelector(`#${uid}-steam`) as SVGGElement;
  return {
    wrapper,
    marks,
    steam,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}

/**
 * 涙エフェクト（大粒涙滴 or 噴水スプラッシュ涙）
 */
export function mountTearsEffect(container: HTMLElement, mode: 'drops' | 'fountain' = 'drops'): {
  wrapper: HTMLDivElement;
  leftTears: SVGGElement;
  rightTears: SVGGElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  const uid = 'tears_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform';
  
  const innerContent = mode === 'drops' ? `
    <!-- 目元からポロポロこぼれ落ちる大粒の涙 -->
    <g id="${uid}-left" transform="translate(132, 100)">
      <path d="M 0,0 C -3,6 -5,12 0,16 C 5,12 3,6 0,0 Z" fill="#38bdf8" opacity="0.9"/>
      <path d="M -4,18 C -7,24 -8,30 -3,34 C 2,30 0,24 -4,18 Z" fill="#7dd3fc" opacity="0.75" transform="scale(0.8)"/>
    </g>
    <g id="${uid}-right" transform="translate(168, 100)">
      <path d="M 0,0 C -3,6 -5,12 0,16 C 5,12 3,6 0,0 Z" fill="#38bdf8" opacity="0.9"/>
      <path d="M 4,18 C 1,24 0,30 5,34 C 10,30 8,24 4,18 Z" fill="#7dd3fc" opacity="0.75" transform="scale(0.8)"/>
    </g>
  ` : `
    <!-- 左右へビシャビシャ吹き出す大号泣の噴水スプラッシュ涙 -->
    <g id="${uid}-left" transform="translate(130, 95)">
      <path d="M 0,0 Q -25,-20 -55,-5 Q -75,10 -85,35" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="-55" cy="-5" r="4" fill="#67e8f9"/>
      <circle cx="-80" cy="25" r="5" fill="#38bdf8"/>
      <circle cx="-35" cy="-18" r="3" fill="#bae6fd"/>
    </g>
    <g id="${uid}-right" transform="translate(170, 95)">
      <path d="M 0,0 Q 25,-20 55,-5 Q 75,10 85,35" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <circle cx="55" cy="-5" r="4" fill="#67e8f9"/>
      <circle cx="80" cy="25" r="5" fill="#38bdf8"/>
      <circle cx="35" cy="-18" r="3" fill="#bae6fd"/>
    </g>
  `;

  wrapper.innerHTML = `
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(56,189,248,0.7)]">
      ${innerContent}
    </svg>
  `;
  container.appendChild(wrapper);
  const leftTears = wrapper.querySelector(`#${uid}-left`) as SVGGElement;
  const rightTears = wrapper.querySelector(`#${uid}-right`) as SVGGElement;
  return {
    wrapper,
    leftTears,
    rightTears,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}

/**
 * 軽快な音符エフェクト（スキップ時に頭上にふわふわ浮かぶ♪♫マーク）
 */
export function mountMusicNotesEffect(container: HTMLElement): {
  wrapper: HTMLDivElement;
  note1: SVGGElement;
  note2: SVGGElement;
  note3: SVGGElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  const uid = 'notes_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform';
  wrapper.innerHTML = `
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.6)]">
      <!-- 音符1 (♪) -->
      <g id="${uid}-note1" transform="translate(110, 65)">
        <path d="M 6,0 L 6,18 A 4,4 0 1,1 0,18 A 4,4 0 0,1 6,18 Z M 6,4 Q 14,-2 14,8" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <!-- 音符2 (♫) -->
      <g id="${uid}-note2" transform="translate(185, 55)">
        <path d="M 4,0 L 4,16 A 3.5,3.5 0 1,1 -1,16 A 3.5,3.5 0 0,1 4,16 Z M 16,3 L 16,19 A 3.5,3.5 0 1,1 11,19 A 3.5,3.5 0 0,1 16,19 Z M 4,0 L 16,3 L 16,6 L 4,3 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <!-- 音符3 (プチ♪) -->
      <g id="${uid}-note3" transform="translate(150, 40)">
        <path d="M 5,0 L 5,14 A 3,3 0 1,1 0,14 A 3,3 0 0,1 5,14 Z M 5,3 Q 11,-1 11,7" fill="#f472b6" stroke="#db2777" stroke-width="1.2" stroke-linecap="round"/>
      </g>
    </svg>
  `;
  container.appendChild(wrapper);
  const note1 = wrapper.querySelector(`#${uid}-note1`) as SVGGElement;
  const note2 = wrapper.querySelector(`#${uid}-note2`) as SVGGElement;
  const note3 = wrapper.querySelector(`#${uid}-note3`) as SVGGElement;
  return {
    wrapper,
    note1,
    note2,
    note3,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}



/**
 * ジェットパックのツインバーニア噴射炎エフェクトマウント
 */
export function mountJetpackPlumeEffect(container: HTMLElement, mode: 'up' | 'forward' = 'up'): {
  wrapper: HTMLElement;
  flameL: SVGElement;
  flameR: SVGElement;
  cleanup: () => void;
} {
  const wrapper = document.createElement('div');
  const uid = 'plume_' + Math.random().toString(36).substring(2, 7);
  wrapper.className = 'absolute inset-0 pointer-events-none opacity-0 will-change-transform z-5';
  
  const isUp = mode === 'up';
  
  wrapper.innerHTML = `
    <svg viewBox="0 0 300 300" class="w-full h-full filter drop-shadow-[0_0_15px_rgba(56,189,248,0.9)]">
      <defs>
        <!-- プラズマジェットのグラデーション -->
        <linearGradient id="${uid}-grad-core" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="30%" stop-color="#38bdf8" />
          <stop offset="65%" stop-color="#0284c7" />
          <stop offset="100%" stop-color="#0369a1" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="${uid}-grad-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="35%" stop-color="#f59e0b" />
          <stop offset="70%" stop-color="#ef4444" />
          <stop offset="100%" stop-color="#dc2626" stop-opacity="0" />
        </linearGradient>
      </defs>
      <!-- 左バーニア噴射炎（レッグパーツ収納時のボディ直下ノズルから噴射） -->
      <g id="${uid}-flame-l" transform="${isUp ? 'translate(132, 175)' : 'translate(112, 165) rotate(70)'}">
        <!-- バーニアノズルリング -->
        <rect x="-8" y="-4" width="16" height="5" rx="2" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.2" />
        <!-- 外炎 -->
        <path d="M -9,0 Q -15,30 0,65 Q 15,30 9,0 Z" fill="url(#${uid}-grad-flame)" opacity="0.95" />
        <!-- 内芯プラズマコア -->
        <path d="M -5,0 Q -7,22 0,46 Q 7,22 5,0 Z" fill="url(#${uid}-grad-core)" />
        <!-- 推進スパーク -->
        <circle cx="0" cy="56" r="3" fill="#fef08a" opacity="0.9" />
      </g>
      <!-- 右バーニア噴射炎（レッグパーツ収納時のボディ直下ノズルから噴射） -->
      <g id="${uid}-flame-r" transform="${isUp ? 'translate(168, 175)' : 'translate(136, 188) rotate(70)'}">
        <!-- バーニアノズルリング -->
        <rect x="-8" y="-4" width="16" height="5" rx="2" fill="#1e293b" stroke="#0ea5e9" stroke-width="1.2" />
        <!-- 外炎 -->
        <path d="M -9,0 Q -15,30 0,65 Q 15,30 9,0 Z" fill="url(#${uid}-grad-flame)" opacity="0.95" />
        <!-- 内芯プラズマコア -->
        <path d="M -5,0 Q -7,22 0,46 Q 7,22 5,0 Z" fill="url(#${uid}-grad-core)" />
        <!-- 推進スパーク -->
        <circle cx="0" cy="56" r="3" fill="#fef08a" opacity="0.9" />
      </g>
    </svg>
  `;
  container.appendChild(wrapper);
  const flameL = wrapper.querySelector(`#${uid}-flame-l`) as SVGElement;
  const flameR = wrapper.querySelector(`#${uid}-flame-r`) as SVGElement;
  return {
    wrapper,
    flameL,
    flameR,
    cleanup: () => {
      if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
    }
  };
}



/**
 * 1. がっかり・脱力ため息 (Disappointed Sigh)
 * 首と肩がガクッと落ち、身体全体が脱力して沈み込み、深くため息をつく。
 */
export class DisappointedSlumpAnimation extends BaseRobotAnimation {
  id = 'disappointed_slump';
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: 'ガクッ...ショック脱力', type: 'charge' },
    { time: 0.70, label: 'はぁ〜...ため息スモーク', type: 'spark' }
  ];
  name = 'がっかり・脱力ため息 (Disappointed Sigh)';
  category = RobotAnimationCategory.EMOTION;
  duration = 2.2;
  loop = true;
  description = '肩をガクッと落とし、頭をだらりと垂れて脱力。ため息スモークを吐きながら切なく項垂れる。';
  technicalHighlights = [
    '頭部 (Head) の力ない前方垂れ下がり傾斜 (Y: +8px, Rotation: 14deg)',
    '左右腕 (ArmLeft/ArmRight) のだらり脱力ドロップ',
    '口元からのため息クラウド (mountSighEffect) と青ざめ縦線エフェクト',
    'ため息時の全身の深い沈み込みと脱力バウンス'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let sighFx: { wrapper: HTMLDivElement; cloud: SVGGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      sighFx = mountSighEffect(fxContainer);
      tl.set(sighFx.wrapper, { opacity: 0 });
    }

    tl.eventCallback('onComplete', () => {
      sighFx?.cleanup();
    });

    // 青ざめオーラのうっすら表示
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.3, scale: 0.95, duration: 0.5, ease: 'power1.out' });
    }

    // 1. ショック！一瞬ビクッと固まる
    tl.to(container, { y: -3, scaleY: 1.02, duration: 0.12, ease: 'power1.out' });
    if (head) tl.to(head, { y: -2, duration: 0.12 }, '<');

    // 2. ガクッ...と全身の力が抜けて肩・頭が落ちる
    tl.to(container, { y: 6, scaleY: 0.96, duration: 0.6, ease: 'power2.inOut' });
    if (head) tl.to(head, { y: 9, rotation: 14, duration: 0.6, ease: 'power2.inOut' }, '<');
    if (body) tl.to(body, { y: 4, rotation: -2, duration: 0.6 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 12, y: 6, duration: 0.6, ease: 'bounce.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: -12, y: 6, duration: 0.6, ease: 'bounce.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { y: 6, rotation: 4, duration: 0.6 }, '<');
    if (legLeft) tl.to(legLeft, { scaleY: 0.94, y: 2, duration: 0.6 }, '<');
    if (legRight) tl.to(legRight, { scaleY: 0.94, y: 2, duration: 0.6 }, '<');

    // 3. ため息エフェクト展開（はぁ〜...）
    if (sighFx) {
      tl.to(sighFx.wrapper, { opacity: 1, duration: 0.4 }, '+=0.1');
      tl.to(sighFx.cloud, { x: 18, y: -12, scale: 1.3, opacity: 0, duration: 0.9, ease: 'power1.out' }, '<');
    }

    // ため息に合わせたわずかな上下脱力呼吸
    tl.to(container, { y: 8, duration: 0.5, ease: 'sine.inOut' })
      .to(container, { y: 5, duration: 0.5, ease: 'sine.inOut' });

    // 4. 元の姿勢へ力なく戻る
    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.5, ease: 'power2.out' });
    if (auraOverlay) tl.to(auraOverlay, { opacity: 0, duration: 0.4 }, '<');
  }
}






/**
 * 7. ご機嫌るんるんスキップ (Joyful Skipping)
 * 左右交互に軽快にピョンッピョンッと弾み、腕を前後に大きく振ってリズミカルにステップを踏む。
 */
export class JoyfulSkippingAnimation extends BaseRobotAnimation {
  id = 'joyful_skipping';
  seMarkers: AnimationSEMarker[] = [
    { time: 0.25, label: 'るんるん右足ホップ♪', type: 'spark' },
    { time: 0.45, label: '軽快ステップ着地', type: 'hit' },
    { time: 0.75, label: 'うきうき左足ホップ♫', type: 'spark' },
    { time: 0.95, label: 'スキップ着地', type: 'hit' }
  ];
  name = 'ご機嫌るんるんスキップ (Joyful Skipping)';
  category = RobotAnimationCategory.EMOTION;
  duration = 2.0;
  loop = true;
  description = '左右交互に軽快にホップ！腕を前後に大きくリズミカルに振り、音符を浮かべてご機嫌にスキップ。';
  technicalHighlights = [
    '左右脚部 (LegLeft/LegRight) のリズミカルな交互ニーアップ＆ホップ',
    '両腕 (ArmLeft/ArmRight) の前後逆位相ダイナミックスイング (Swing Amplitude: ±45deg)',
    'ふわふわ浮かぶポップな音符マーク (mountMusicNotesEffect)',
    '着地時のポヨンとした伸縮トランジション (ScaleY: 0.94 -> 1.08)'
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legLeft, legRight, fxContainer, sparkles } = refs;

    let notesFx: { wrapper: HTMLDivElement; note1: SVGGElement; note2: SVGGElement; note3: SVGGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      notesFx = mountMusicNotesEffect(fxContainer);
      tl.set(notesFx.wrapper, { opacity: 0 });
    }

    tl.eventCallback('onComplete', () => {
      notesFx?.cleanup();
    });

    if (sparkles) {
      tl.to(sparkles, { opacity: 0.8, duration: 0.3 });
    }

    // 音符エフェクト展開
    if (notesFx) {
      tl.to(notesFx.wrapper, { opacity: 1, duration: 0.3 });
      tl.to(notesFx.note1, { y: -18, rotation: 15, duration: 0.7, repeat: 2, yoyo: true, ease: 'sine.inOut' }, '<');
      tl.to(notesFx.note2, { y: -22, rotation: -15, duration: 0.8, repeat: 2, yoyo: true, ease: 'sine.inOut' }, '<0.1');
      tl.to(notesFx.note3, { y: -15, rotation: 10, duration: 0.6, repeat: 2, yoyo: true, ease: 'sine.inOut' }, '<0.2');
    }

    // スキップ・ステップ1: 右足でホップ！（左膝を高く上げる）
    tl.to(container, { y: -16, scaleY: 1.06, duration: 0.22, ease: 'power2.out' });
    if (head) tl.to(head, { rotation: 8, y: -4, duration: 0.22 }, '<');
    if (body) tl.to(body, { rotation: -3, duration: 0.22 }, '<');
    if (legLeft) tl.to(legLeft, { y: -12, scaleY: 0.85, rotation: -18, duration: 0.22, ease: 'back.out(1.5)' }, '<');
    if (legRight) tl.to(legRight, { y: 4, scaleY: 1.1, rotation: 6, duration: 0.22 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -42, y: -6, duration: 0.22, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 42, y: 6, duration: 0.22, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: -25, duration: 0.22 }, '<');

    // 着地（ポヨンと弾む）
    tl.to(container, { y: 2, scaleY: 0.94, duration: 0.14, ease: 'power2.in' });
    if (legLeft) tl.to(legLeft, { y: 0, scaleY: 1, rotation: 0, duration: 0.14 }, '<');
    if (legRight) tl.to(legRight, { y: 0, scaleY: 1, rotation: 0, duration: 0.14 }, '<');

    // スキップ・ステップ2: 左足でホップ！（右膝を高く上げる）
    tl.to(container, { y: -16, scaleY: 1.06, duration: 0.22, ease: 'power2.out' });
    if (head) tl.to(head, { rotation: -8, y: -4, duration: 0.22 }, '<');
    if (body) tl.to(body, { rotation: 3, duration: 0.22 }, '<');
    if (legRight) tl.to(legRight, { y: -12, scaleY: 0.85, rotation: 18, duration: 0.22, ease: 'back.out(1.5)' }, '<');
    if (legLeft) tl.to(legLeft, { y: 4, scaleY: 1.1, rotation: -6, duration: 0.22 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 42, y: 6, duration: 0.22, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: -42, y: -6, duration: 0.22, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 25, duration: 0.22 }, '<');

    // 着地
    tl.to(container, { y: 2, scaleY: 0.94, duration: 0.14, ease: 'power2.in' });
    if (legLeft) tl.to(legLeft, { y: 0, scaleY: 1, rotation: 0, duration: 0.14 }, '<');
    if (legRight) tl.to(legRight, { y: 0, scaleY: 1, rotation: 0, duration: 0.14 }, '<');

    // 基本姿勢へ復帰
    const all = [container, head, body, arms, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1, duration: 0.3, ease: 'power2.out' });
    if (sparkles) tl.to(sparkles, { opacity: 0, duration: 0.2 }, '<');
    if (notesFx) tl.to(notesFx.wrapper, { opacity: 0, duration: 0.2 }, '<');
  }
}






/**
 * ジェット飛行・垂直上昇 (Jetpack Ascent Flight)
 * 背部ジェットパックのツインバーニアをフル点火！垂直に空高く急上昇し、上空でホバリング制御しながら優雅に大地へ着地。
 */
export class JetpackAscentFlightAnimation extends BaseRobotAnimation {
  id = 'jetpack_ascent_flight';
  name = 'ジェット飛行・垂直上昇 (Jetpack Ascent Flight)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 2.6;
  loop = true;
  description = '脚部をボディにすっきりと格納！背部ツインバーニアから高出力プラズマを噴射して上空へ垂直急浮上し、ホバリングから着地する。';
  technicalHighlights = [
    'レッグパーツのボディ完全格納機構',
    'ツインバーニア高出力プラズマ噴射エフェクト (mountJetpackPlumeEffect)',
    '垂直急上昇 (Y: -72px) と上空ホバリング振動',
    'ダンパー脚部展開＆エアクッション着地'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: '屈伸・脚部格納チャージ', type: 'draw' },
    { time: 0.35, label: 'ツインバーニア点火！', type: 'flame' },
    { time: 0.45, label: 'ロケット垂直急上昇！', type: 'dash' },
    { time: 1.00, label: '上空ホバリング姿勢制御', type: 'spark' },
    { time: 1.70, label: '逆噴射エアクッション降下', type: 'draw' },
    { time: 2.10, label: '脚部展開・ダンパー接地', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let plumeFx: { wrapper: HTMLElement; flameL: SVGElement; flameR: SVGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      plumeFx = mountJetpackPlumeEffect(fxContainer, 'up');
      tl.set(plumeFx.wrapper, { opacity: 0 });
    }
    tl.eventCallback('onComplete', () => {
      plumeFx?.cleanup();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.5, scale: 1.15, duration: 0.35, ease: 'power2.out' }, 0.35);
    }

    // 1. 屈伸チャージ＆脚部をボディにしまい込み
    const legElements = [legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { y: 4, scaleY: 0.95, duration: 0.22, ease: 'power2.in' });
    tl.to(legElements, { scaleY: 0.05, y: -26, opacity: 0, duration: 0.22, ease: 'power2.in' }, '<');
    if (head) tl.to(head, { y: 2, rotation: -3, duration: 0.22 }, '<');

    // 2. ジェットバーニアフル点火！
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 1, duration: 0.1 }, '>');
      tl.to([plumeFx.flameL, plumeFx.flameR], {
        scaleY: 1.35, scaleX: 1.1, duration: 0.12, repeat: 5, yoyo: true, ease: 'none'
      }, '<');
    }

    // 3. 垂直急上昇ロケットスタート！(Y: -72px)
    tl.to(container, { y: -72, scaleY: 1.06, scaleX: 0.96, duration: 0.45, ease: 'power3.out' }, '>-0.05');
    if (head) tl.to(head, { rotation: 0, y: -2, duration: 0.35 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -38, x: -10, y: 4, duration: 0.35, ease: 'power2.out' }, '<');
    if (armRight) tl.to(armRight, { rotation: 38, x: 10, y: 4, duration: 0.35, ease: 'power2.out' }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { scaleX: 1.15, y: 4, duration: 0.35 }, '<');

    // 4. 上空ホバリング（微小な上下浮遊とジェット推力振動）
    tl.to(container, { y: -66, duration: 0.35, ease: 'sine.inOut' });
    tl.to(container, { y: -72, duration: 0.35, ease: 'sine.inOut' });
    tl.to(container, { x: '+=1.2', duration: 0.05, repeat: 10, yoyo: true, ease: 'none' }, '<-0.35');

    // 5. 逆噴射で徐々に降下
    tl.to(container, { y: -16, scaleY: 1.02, scaleX: 1, duration: 0.45, ease: 'power1.in' });
    if (plumeFx) {
      tl.to([plumeFx.flameL, plumeFx.flameR], { scaleY: 0.7, duration: 0.4 }, '<');
    }

    // 6. 脚部展開・ダンパー接地ランディング
    tl.to(container, { y: 0, scaleY: 0.92, scaleX: 1.05, duration: 0.2, ease: 'power2.out' });
    tl.to(legElements, { scaleY: 1, y: 0, opacity: 1, duration: 0.22, ease: 'back.out(2)' }, '<');
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 0, duration: 0.15 }, '<');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 1, duration: 0.25 }, '<');
    }

    // 7. 基本姿勢リセット
    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'back.out(1.8)'
    }, '>');
  }
}



/**
 * ジェット飛行・高速前進 (Jetpack Forward Flight)
 * 機体を水平に倒して背部ジェットパックを音速点火！風圧を切り裂いて前空を高速巡航滑空し、エアブレーキで華麗に着地。
 */
export class JetpackForwardFlightAnimation extends BaseRobotAnimation {
  id = 'jetpack_forward_flight';
  name = 'ジェット飛行・高速前進 (Jetpack Forward Flight)';
  category = RobotAnimationCategory.ACROBATIC;
  duration = 2.4;
  loop = true;
  description = '脚部をボディに格納し、機体を水平に倒して背部ジェットパックを音速点火！風圧を切り裂いて前空を高速巡航滑空し、脚部を展開してエアブレーキ着地。';
  technicalHighlights = [
    '脚部格納＆水平高速前進巡航姿勢 (SkewX: -24deg, Rotation: 16deg, X: +75px, Y: -36px)',
    '後方への連続プラズマバーニア炎噴射 (mountJetpackPlumeEffect)',
    '脚部再展開＆エアブレーキ減速着地'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.15, label: '脚部格納・前傾フライトフォーム', type: 'draw' },
    { time: 0.35, label: '音速ジェットアフターバーナー点火！', type: 'dash' },
    { time: 0.85, label: '高速巡航・空力滑空', type: 'slash' },
    { time: 1.45, label: '機体起こしエアブレーキ制動', type: 'charge' },
    { time: 2.05, label: '脚部展開・スライディング着地', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, arms, armLeft, armRight, legs, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let plumeFx: { wrapper: HTMLElement; flameL: SVGElement; flameR: SVGElement; cleanup: () => void } | null = null;
    if (fxContainer && typeof document !== 'undefined') {
      plumeFx = mountJetpackPlumeEffect(fxContainer, 'forward');
      tl.set(plumeFx.wrapper, { opacity: 0 });
    }
    tl.eventCallback('onComplete', () => {
      plumeFx?.cleanup();
    });

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.55, scale: 1.2, duration: 0.35, ease: 'power2.out' }, 0.35);
    }

    // 1. 脚部格納＆前傾フライトフォームへ移行
    const legElements = [legs, legLeft, legRight].filter(Boolean);
    tl.to(container, { x: -12, y: 3, skewX: 14, rotation: -6, duration: 0.22, ease: 'power2.in' });
    tl.to(legElements, { scaleY: 0.05, y: -26, opacity: 0, duration: 0.22, ease: 'power2.in' }, '<');
    if (head) tl.to(head, { rotation: 12, x: 4, duration: 0.22 }, '<');
    if (armRight) tl.to(armRight, { rotation: 65, x: 12, y: -4, duration: 0.22 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: -50, x: -10, y: 2, duration: 0.22 }, '<');
    if (!armLeft && !armRight && arms) tl.to(arms, { rotation: 35, x: 8, duration: 0.22 }, '<');

    // 2. ジェットアフターバーナー点火！
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 1, duration: 0.1 }, '>');
      tl.to([plumeFx.flameL, plumeFx.flameR], {
        scaleX: 1.4, scaleY: 1.15, duration: 0.1, repeat: 7, yoyo: true, ease: 'none'
      }, '<');
    }

    // 3. 超音速前進急加速！(X: +75px, Y: -36px, SkewX: -24deg, Rotation: 16deg)
    tl.to(container, {
      x: 75, y: -36, skewX: -24, rotation: 16, duration: 0.48, ease: 'power4.inOut'
    }, '>-0.05');
    if (head) tl.to(head, { rotation: 22, x: 8, y: -2, duration: 0.48 }, '<');

    // 4. 空中巡航バンク
    tl.to(container, { x: 78, y: -30, rotation: 12, duration: 0.32, ease: 'sine.inOut' });
    tl.to(container, { x: 70, y: -38, rotation: 18, duration: 0.32, ease: 'sine.inOut' });

    // 5. 機体を起こしてエアブレーキ制動＆脚部展開
    tl.to(container, {
      x: 25, y: -10, skewX: 20, rotation: -16, duration: 0.35, ease: 'power3.out'
    });
    if (head) tl.to(head, { rotation: -14, x: -2, duration: 0.35 }, '<');
    if (armLeft) tl.to(armLeft, { rotation: 45, x: 12, y: -8, duration: 0.35 }, '<');
    if (armRight) tl.to(armRight, { rotation: -45, x: -12, y: -8, duration: 0.35 }, '<');
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 0.3, duration: 0.25 }, '<');
    }

    // 6. 接地＆減速スライディング
    tl.to(container, { x: 0, y: 0, skewX: -6, rotation: 0, duration: 0.28, ease: 'power2.out' });
    tl.to(legElements, { scaleY: 1, y: 0, opacity: 1, duration: 0.25, ease: 'back.out(2)' }, '<');
    if (plumeFx) {
      tl.to(plumeFx.wrapper, { opacity: 0, duration: 0.15 }, '<');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 1, duration: 0.25 }, '<');
    }

    // 7. 基本姿勢リセット
    const all = [container, head, body, arms, armLeft, armRight, legs, legLeft, legRight].filter(Boolean);
    tl.to(all, {
      x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0,
      duration: 0.35,
      ease: 'back.out(1.8)'
    }, '>');
  }
}




/**
 * 精密スナイプ・両手持ちスコープ狙撃 (Precision Scope Snipe)
 * スコープに光学照準を密着させ、両手持ちヘビースナイパーライフルから超電導貫通弾を撃ち放つ！
 */


/**
 * ガトリング連撃・超速ラッシュ (Gatling Rapid Strike)
 * 敏捷な関節駆動で前方へ踏み込み、電光石火の超高速連続打撃を叩き込む！
 */


/**
 * 粉砕スマッシュ・重装甲強撃 (Armor Crushing Smash)
 * 渾身のパワーで装甲の脆い部分を叩き割る重厚な一撃！
 */


/**
 * 高周波EMPディスラプター (EMP Shockwave Disruptor)
 * 全方位EMPジェネレーターを展開し、電磁衝撃波で敵の電子回路を完全麻痺させる！
 */
export class EMPDisruptorAnimation extends BaseRobotAnimation {
  id = 'emp_disruptor';
  name = 'EMPディスラプター (EMP Shockwave)';
  category = RobotAnimationCategory.COMBAT;
  duration = 2.2;
  loop = true;
  description = '高周波電磁パルス衝撃波を全周囲に放射し、相手の行動回路・電子演算を完全リセット(-1000AP)する強力な電磁妨害兵器！';
  technicalHighlights = [
    '機体コアジェネレーターの過電圧励起（オーラ＆パルス発光）',
    '360度全方位EMP電磁リング衝撃波の拡散',
    '電磁放電スパークと電子回路リセットショック'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.2, label: 'EMPジェネレーター励起', type: 'charge' },
    { time: 0.7, label: '高周波電磁パルスチャージ', type: 'spark' },
    { time: 1.1, label: '全方位EMPディスラプター放射！', type: 'hyper' },
    { time: 1.4, label: '電子回路完全麻痺ショック', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let pulseFx: any = null;
    if (fxContainer && typeof document !== 'undefined') {
      pulseFx = mountIaidoSlashEffect(fxContainer);
    }
    tl.eventCallback('onComplete', () => {
      pulseFx?.cleanup?.();
    });

    // 1. 機体を浮かせて両腕を広げるチャージフォーム
    tl.to(container, { y: -18, scaleY: 1.08, duration: 0.45, ease: 'power2.out' });
    if (armLeft) tl.to(armLeft, { rotation: -65, x: -12, duration: 0.45 }, '<');
    if (armRight) tl.to(armRight, { rotation: 65, x: 12, duration: 0.45 }, '<');
    if (head) tl.to(head, { rotation: -8, y: -3, duration: 0.45 }, '<');

    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.9, scale: 1.4, duration: 0.45, ease: 'power2.out' }, '<');
    }

    // 2. EMPパルス過電圧スパーク振動
    tl.to(container, { x: '+=2', y: '+=2', duration: 0.03, repeat: 10, yoyo: true, ease: 'none' });

    // 3. EMPディスラプター全方位大放射！
    if (pulseFx) {
      tl.to(pulseFx.el, { opacity: 1, scale: 1.8, rotation: 180, duration: 0.15, ease: 'power4.out' }, '>');
      tl.to(pulseFx.el, { opacity: 0, scale: 2.4, duration: 0.35, ease: 'power2.out' }, '>');
    }
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, scale: 1.8, duration: 0.35 }, '<');
    }

    // 4. 接地復帰
    tl.to(container, { y: 0, duration: 0.3, ease: 'power2.inOut' });
    const all = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.3, ease: 'power2.out' }, '>');
  }
}

/**
 * 零距離プラズマ撃 (Point-Blank Plasma Burst)
 * 急接近して相手の装甲の隙間に零距離で圧縮高熱プラズマを全放射！
 */


/**
 * 【終焉奥義】アポカリプス・オメガバースト (Apocalypse Omega Burst)
 * 全出力ジェネレーターを臨界まで解放！すべてを塵に帰すオメガプラズマ奔流を放射する究極奥義！
 */
export class ApocalypseOmegaBurstAnimation extends BaseRobotAnimation {
  id = 'apocalypse_omega_strike';
  name = '【終焉奥義】アポカリプス (Apocalypse Burst)';
  category = RobotAnimationCategory.COMBAT;
  duration = 3.6;
  loop = true;
  description = '全出力ジェネレーターを臨界まで解放し、すべてを塵に帰すオメガプラズマ奔流を放射する究極奥義！';
  technicalHighlights = [
    'カットインバナー (mountDualSabers / mountDramaticCutinEffect)',
    '全画面オメガプラズマ奔流ストーム展開',
    '超絶画面ホワイトアウトフラッシュ＆臨界インパクト'
  ];
  seMarkers: AnimationSEMarker[] = [
    { time: 0.2, label: '【終焉奥義】カットイン発動！', type: 'cutin' },
    { time: 0.8, label: '臨界プラズマジェネレーター起動', type: 'charge' },
    { time: 1.5, label: 'オメガプラズマ奔流放射！', type: 'hyper' },
    { time: 2.0, label: '超壊滅アポカリプスインパクト！', type: 'hit' }
  ];

  build(refs: RobotDOMRefs, tl: gsap.core.Timeline): void {
    this.resetElements(refs, tl);
    const { container, head, body, armLeft, armRight, legLeft, legRight, fxContainer, auraOverlay } = refs;

    let banner: any = null;
    let slashFx: any = null;
    let iaidoFx: any = null;
    if (fxContainer && typeof document !== 'undefined') {
      banner = mountDualSabers(fxContainer, { title: '【終焉奥義】アポカリプス', subtitle: 'APOCALYPSE OMEGA BURST', themeColor: 'crimson' });
      slashFx = mountDualSlashEffect(fxContainer);
      iaidoFx = mountIaidoSlashEffect(fxContainer);
    }
    tl.eventCallback('onComplete', () => {
      banner?.cleanup?.();
      slashFx?.cleanup?.();
      iaidoFx?.cleanup?.();
    });

    // 1. 必殺カットイン演出
    if (banner) {
      tl.to(banner.flashEl, { opacity: 0.9, duration: 0.08 });
      tl.to(banner.flashEl, { opacity: 0, duration: 0.15 }, '>');
      tl.fromTo(banner.banner, { opacity: 0, x: -70, scaleY: 0.2 }, { opacity: 1, x: 0, scaleY: 1, duration: 0.25, ease: 'back.out(1.8)' }, '<');
      tl.to(banner.banner, { x: 10, duration: 0.55, ease: 'none' });
      tl.to(banner.banner, { opacity: 0, x: 70, scaleY: 0.2, duration: 0.2, ease: 'power3.in' }, '>');
    }

    // 2. 機体浮上＆全ジェネレーター臨界チャージ
    tl.to(container, { y: -25, scaleY: 1.12, duration: 0.55, ease: 'power2.out' }, '<-0.3');
    if (armLeft) tl.to(armLeft, { rotation: -70, x: -14, duration: 0.55 }, '<');
    if (armRight) tl.to(armRight, { rotation: 70, x: 14, duration: 0.55 }, '<');
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0.95, scale: 1.5, duration: 0.55 }, '<');
    }

    // 3. オメガプラズマ奔流放射！
    if (slashFx) {
      tl.to(slashFx.el, { opacity: 1, scale: 1.6, rotation: 180, duration: 0.2, ease: 'power4.out' }, '>');
      tl.to(slashFx.el, { opacity: 0, scale: 2.2, duration: 0.4 }, '>');
    }
    if (iaidoFx) {
      tl.to(iaidoFx.el, { opacity: 1, scale: 1.8, rotation: 0, duration: 0.15, ease: 'power4.out' }, '<');
      tl.to(iaidoFx.el, { opacity: 0, scale: 2.5, duration: 0.4 }, '>');
    }
    if (banner) {
      tl.to(banner.flashEl, { opacity: 1, duration: 0.05 }, '<');
      tl.to(banner.flashEl, { opacity: 0, duration: 0.35 }, '>');
    }
    tl.to(container, { x: '+=7', y: '+=7', duration: 0.03, repeat: 9, yoyo: true, ease: 'rough' });

    // 4. 接地復帰
    tl.to(container, { y: 0, duration: 0.35, ease: 'power2.inOut' });
    if (auraOverlay) {
      tl.to(auraOverlay, { opacity: 0, duration: 0.3 }, '<');
    }
    const all = [container, head, body, armLeft, armRight, legLeft, legRight].filter(Boolean);
    tl.to(all, { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.35, ease: 'power2.out' }, '>');
  }
}

export class GSAPRobotAnimationRegistry {
  private static instance: GSAPRobotAnimationRegistry;
  private patterns = new Map<string, RobotAnimationPattern>();

  private constructor() {
    this.registerDefaults();
  }

  static getInstance(): GSAPRobotAnimationRegistry {
    if (!GSAPRobotAnimationRegistry.instance) {
      GSAPRobotAnimationRegistry.instance = new GSAPRobotAnimationRegistry();
    }
    return GSAPRobotAnimationRegistry.instance;
  }

  private registerDefaults(): void {
    const list: RobotAnimationPattern[] = [
      // 1. 戦闘・攻撃 (Combat & Battle Exercises)
      new DualSlashComboAnimation(),
      new RocketPunchAnimation(),
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
      new JetDashAnimation(),

      // 2. 特殊・機能 (Acrobatics & Flight)
      new BreakdanceAnimation(),
      new ExplodedViewAnimation(),
      new MarchSprintAnimation(),
      new SpinTornadoAnimation(),
      new JetpackAscentFlightAnimation(),
      new JetpackForwardFlightAnimation(),
      new JoyfulSkippingAnimation(),

      // 3. 点検・動作 (Mechanical & Diagnostics)
      new BioBreathingAnimation(),
      new HoverFlightAnimation(),
      new FastRechargeAnimation(),
      new PrecisionScanAnimation(),
      new CalibrationAnimation(),
      new SleepStandbyAnimation(),

      // 4. 感情・仕草 (Emotions & Gestures)
      new PanicTroubledAnimation(),
      new PoliteBowAnimation(),
      new CuriousTiltAnimation(),
      new NodAgreeAnimation(),
      new BanzaiCheerAnimation(),
      new YayRejoiceAnimation(),
      new DisappointedSlumpAnimation(),
    ];
    list.forEach(p => this.patterns.set(p.id, p));
  }

  getPattern(id: string): RobotAnimationPattern | undefined {
    return this.patterns.get(id);
  }

  getAllPatterns(): RobotAnimationPattern[] {
    return Array.from(this.patterns.values());
  }

  getPatternsByCategory(category: RobotAnimationCategory): RobotAnimationPattern[] {
    return this.getAllPatterns().filter(p => p.category === category);
  }
}

export class GSAPRobotAnimationController {
  private timeline: gsap.core.Timeline | null = null;
  private currentPattern: RobotAnimationPattern | null = null;
  private refs: RobotDOMRefs | null = null;
  private timeScale = 1.0;
  private isLooping = true;
  private onProgressCallback?: (progress: number) => void;
  private onCompleteCallback?: () => void;

  playPattern(
    pattern: RobotAnimationPattern,
    refs: RobotDOMRefs,
    options: {
      timeScale?: number;
      loop?: boolean;
      onProgress?: (progress: number) => void;
      onComplete?: () => void;
    } = {}
  ): void {
    try {
      this.kill();
      this.currentPattern = pattern;
      this.refs = refs;
      this.timeScale = options.timeScale ?? this.timeScale;
      this.isLooping = options.loop ?? (pattern.loop ?? true);
      this.onProgressCallback = options.onProgress;
      this.onCompleteCallback = options.onComplete;

      this.timeline = gsap.timeline({
        repeat: this.isLooping ? -1 : 0,
        repeatDelay: 0.15,
        onUpdate: () => {
          if (this.timeline && this.onProgressCallback) {
            this.onProgressCallback(this.timeline.progress());
          }
        },
        onComplete: () => {
          if (this.onCompleteCallback) {
            this.onCompleteCallback();
          }
        }
      });

      this.timeline.timeScale(this.timeScale);
      pattern.build(refs, this.timeline);
    } catch (err) {
      console.error(`[GSAPRobotAnimationController] Failed to play pattern '${pattern?.id}':`, err);
    }
  }

  setTimeScale(scale: number): void {
    this.timeScale = scale;
    if (this.timeline) {
      this.timeline.timeScale(scale);
    }
  }

  setLoop(loop: boolean): void {
    this.isLooping = loop;
    if (this.timeline) {
      this.timeline.repeat(loop ? -1 : 0);
    }
  }

  pause(): void {
    this.timeline?.pause();
  }

  resume(): void {
    this.timeline?.resume();
  }

  restart(): void {
    this.timeline?.restart();
  }

  kill(): void {
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    if (this.refs?.fxContainer && typeof document !== 'undefined') {
      this.refs.fxContainer.innerHTML = '';
    }
    this.currentPattern = null;
  }

  getCurrentPattern(): RobotAnimationPattern | null {
    return this.currentPattern;
  }

  isActive(): boolean {
    return this.timeline !== null && this.timeline.isActive();
  }
}
