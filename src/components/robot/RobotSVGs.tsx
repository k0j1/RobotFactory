import React from 'react';

export interface SVGProps { color: string; viewBox?: string; className?: string; }

export const getAttributePalette = (color: string) => {
  const c = (color || '').toLowerCase();
  // Fire (#ef4444)
  if (c.includes('ef4444') || c === '#ef4444' || c === 'fire') {
    return {
      base: '#dc2626',
      light: '#f87171',
      white: '#fee2e2',
      dark: '#2a1a1f',
      out: '#1a1014',
      gray: '#9ca3af',
      // ☆3 Gradient palette
      glow0: '#ff8a72',
      glow60: '#ef4444',
      glow100: '#b91c1c',
      armor0: '#f87171',
      armor100: '#dc2626',
      solidAccent: '#b91c1c',
      dark0: '#381e22',
      dark100: '#1f1013',
      stroke: '#1a0a0d'
    };
  }
  // Wind (#10b981)
  if (c.includes('10b981') || c === '#10b981' || c === 'wind') {
    return {
      base: '#059669',
      light: '#34d399',
      white: '#d1fae5',
      dark: '#1a2923',
      out: '#0f1c16',
      gray: '#9ca3af',
      // ☆3 Gradient palette
      glow0: '#a7f3d0',
      glow60: '#34d399',
      glow100: '#059669',
      armor0: '#34d399',
      armor100: '#059669',
      solidAccent: '#047857',
      dark0: '#1e332a',
      dark100: '#111f19',
      stroke: '#0a1410'
    };
  }
  // Earth (#d97706)
  if (c.includes('d97706') || c === '#d97706' || c === 'earth') {
    return {
      base: '#b45309',
      light: '#f59e0b',
      white: '#fef3c7',
      dark: '#2d251d',
      out: '#1c1712',
      gray: '#a8a29e',
      // ☆3 Gradient palette
      glow0: '#fef08a',
      glow60: '#f59e0b',
      glow100: '#b45309',
      armor0: '#f59e0b',
      armor100: '#b45309',
      solidAccent: '#92400e',
      dark0: '#3b2e23',
      dark100: '#211811',
      stroke: '#17110c'
    };
  }
  // Light (#eab308)
  if (c.includes('eab308') || c === '#eab308' || c === 'light') {
    return {
      base: '#ca8a04',
      light: '#facc15',
      white: '#fef9c3',
      dark: '#29261a',
      out: '#19180f',
      gray: '#9ca3af',
      // ☆3 Gradient palette
      glow0: '#ffffff',
      glow60: '#fde047',
      glow100: '#eab308',
      armor0: '#fde047',
      armor100: '#ca8a04',
      solidAccent: '#a16207',
      dark0: '#383522',
      dark100: '#211f11',
      stroke: '#17160c'
    };
  }
  // Dark (#8b5cf6)
  if (c.includes('8b5cf6') || c === '#8b5cf6' || c === 'dark') {
    return {
      base: '#7c3aed',
      light: '#a78bfa',
      white: '#ede9fe',
      dark: '#231e33',
      out: '#151221',
      gray: '#9ca3af',
      // ☆3 Gradient palette
      glow0: '#f3e8ff',
      glow60: '#c084fc',
      glow100: '#7e22ce',
      armor0: '#a855f7',
      armor100: '#6b21a8',
      solidAccent: '#581c87',
      dark0: '#2d213f',
      dark100: '#191124',
      stroke: '#120a1c'
    };
  }
  // Water (#3b82f6) / Default
  return {
    base: color || '#1d61d1',
    light: '#388eff',
    white: '#e8f4ff',
    dark: '#2b303a',
    out: '#1a1d24',
    gray: '#a0aab8',
    // ☆3 Gradient palette
    glow0: '#72f5ff',
    glow60: '#00c8ff',
    glow100: '#0088cc',
    armor0: '#2b82ff',
    armor100: '#004cd6',
    solidAccent: '#0055ff',
    dark0: '#2d3748',
    dark100: '#1a202c',
    stroke: '#0e1726'
  };
};

// === HEAD SVGs (y: 5~40, x: 25~75) ===
export const HeadBasicSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M35 15 L65 15 L65 40 L35 40 Z" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="42" cy="25" r="4" fill="#fff" /><circle cx="42" cy="25" r="1.5" fill="#000" />
    <circle cx="58" cy="25" r="4" fill="#fff" /><circle cx="58" cy="25" r="1.5" fill="#000" />
    <rect x="47" y="5" width="6" height="10" fill="#999" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="5" r="4" fill="#ef4444" />
  </svg>
);

export const HeadRoundSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <circle cx="50" cy="25" r="18" fill={color} stroke="#333" strokeWidth="3" />
    <rect x="38" y="18" width="24" height="10" rx="4" fill="#222" />
    <circle cx="50" cy="23" r="3" fill="#0ff" />
  </svg>
);

export const HeadTVSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="30" y="12" width="40" height="28" rx="4" fill={color} stroke="#333" strokeWidth="3" />
    <rect x="35" y="16" width="30" height="18" rx="2" fill="#e0f2fe" stroke="#333" strokeWidth="2" />
    <path d="M40 4 L50 12 L60 4" fill="none" stroke="#333" strokeWidth="2" />
  </svg>
);

export const HeadHornSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M35 20 L65 20 L70 40 L30 40 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M30 25 Q 20 15 25 5 Q 30 15 35 20" fill="#facc15" stroke="#333" strokeWidth="2" />
    <path d="M70 25 Q 80 15 75 5 Q 70 15 65 20" fill="#facc15" stroke="#333" strokeWidth="2" />
    <line x1="40" y1="30" x2="60" y2="30" stroke="#333" strokeWidth="2" />
    <line x1="42" y1="35" x2="58" y2="35" stroke="#333" strokeWidth="2" />
  </svg>
);

export const HeadCylinderSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="38" y="10" width="24" height="30" rx="8" fill={color} stroke="#333" strokeWidth="3" />
    <rect x="40" y="20" width="20" height="8" fill="#fff" stroke="#333" strokeWidth="2" />
    <line x1="38" y1="32" x2="62" y2="32" stroke="#333" strokeWidth="2" />
  </svg>
);

export const HeadVisorSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M35 15 L65 15 L70 40 L30 40 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M33 22 L67 22 L65 30 L35 30 Z" fill="#ef4444" stroke="#333" strokeWidth="2" />
  </svg>
);

export const HeadTriangleSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M50 5 L70 40 L30 40 Z" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="28" r="6" fill="#fff" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="28" r="2" fill="#000" />
  </svg>
);

export const HeadDomeSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 35 Q 30 10 50 10 Q 70 10 70 35 Z" fill="#e0f2fe" stroke="#333" strokeWidth="3" opacity="0.8" />
    <rect x="28" y="35" width="44" height="6" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="25" r="7" fill={color} stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="25" r="2" fill="#facc15" />
  </svg>
);

// === BODY SVGs (y: 35~75, x: 25~75) ===
export const BodyBasicSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="30" y="38" width="40" height="34" rx="4" fill={color} stroke="#333" strokeWidth="3" />
    <rect x="40" y="45" width="20" height="10" fill="#fff" opacity="0.8" stroke="#333" strokeWidth="2" />
    <line x1="30" y1="65" x2="70" y2="65" stroke="#333" strokeWidth="3" />
  </svg>
);

export const BodyRoundSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className} shapeRendering="crispEdges">
    <g transform="translate(30.8, 35.8) scale(1.6)">
      {/* 外枠角丸ベース */}
      <rect x="2" y="0" width="20" height="24" fill="#1a1d24" rx="2" />
      <rect x="0" y="2" width="24" height="20" fill="#1a1d24" rx="2" />

      {/* 内側ダークベース */}
      <rect x="2" y="1" width="20" height="22" fill="#0f1626" />
      <rect x="1" y="2" width="22" height="20" fill="#0f1626" />

      {/* メインブルー背景 */}
      <rect x="2" y="2" width="20" height="20" fill={color || "#1d61d1"} />

      {/* 四隅のダークドット */}
      <rect x="2" y="2" width="2" height="2" fill="#0f1626" />
      <rect x="20" y="2" width="2" height="2" fill="#0f1626" />
      <rect x="2" y="20" width="2" height="2" fill="#0f1626" />
      <rect x="20" y="20" width="2" height="2" fill="#0f1626" />

      {/* 外周フレームハイライト / 影 */}
      <path d="M 4 2 L 20 2 M 2 4 L 2 20" stroke={color || "#1d61d1"} strokeWidth="1" />
      <path d="M 4 22 L 20 22 M 22 4 L 22 20" stroke="#0f1626" strokeWidth="1" />

      {/* 上部メイン画面の外枠 */}
      <rect x="4" y="4" width="16" height="11" fill="#10418c" />
      
      {/* 上部メイン画面のフレーム */}
      <rect x="5" y="5" width="14" height="9" fill="#0f1626" />
      <rect x="6" y="6" width="12" height="7" fill="#10418c" />

      {/* 上部画面のディスプレイ表示 (白/水色) */}
      <rect x="7" y="7" width="10" height="5" fill="#388eff" />
      <rect x="8" y="8" width="8" height="3" fill="#e8f4ff" />

      {/* 中央のグレーのスリット/ライン */}
      <rect x="3" y="15" width="18" height="2" fill="#48505e" />

      {/* 下部ボタン・インターフェース領域 */}
      <rect x="4" y="18" width="16" height="4" fill="#10418c" />
      <rect x="7" y="19" width="10" height="2" fill="#0f1626" />
      <rect x="8" y="19" width="8" height="2" fill="#388eff" />
      <rect x="9" y="19" width="6" height="1" fill="#e8f4ff" />

      {/* コーナーアクセント */}
      <rect x="3" y="3" width="1" height="1" fill="#388eff" />
      <rect x="3" y="18" width="1" height="1" fill="#388eff" />
      <rect x="20" y="18" width="1" height="1" fill="#388eff" />
    </g>
  </svg>
);

export const BodyHeavySVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 35 L70 35 L80 75 L20 75 Z" fill={color} stroke="#333" strokeWidth="3" />
    <rect x="42" y="45" width="16" height="20" fill="#222" stroke="#333" strokeWidth="2" />
  </svg>
);

export const BodyBarrelSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="35" y="35" width="30" height="40" rx="8" fill={color} stroke="#333" strokeWidth="3" />
    <line x1="35" y1="45" x2="65" y2="45" stroke="#333" strokeWidth="2" />
    <line x1="35" y1="55" x2="65" y2="55" stroke="#333" strokeWidth="2" />
    <line x1="35" y1="65" x2="65" y2="65" stroke="#333" strokeWidth="2" />
  </svg>
);

export const BodySlimSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M35 35 L65 35 L55 55 L65 75 L35 75 L45 55 Z" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="55" r="5" fill="#222" />
  </svg>
);

export const BodyFurnaceSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="30" y="35" width="40" height="40" rx="6" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M38 50 Q 50 75 62 50 Q 50 40 38 50" fill="#f97316" stroke="#333" strokeWidth="2" />
    <path d="M44 53 Q 50 68 56 53 Q 50 45 44 53" fill="#fef08a" />
  </svg>
);

export const BodyDiamondSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M50 32 L75 55 L50 78 L25 55 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M50 42 L63 55 L50 68 L37 55 Z" fill="#fff" opacity="0.5" stroke="#333" strokeWidth="2" />
  </svg>
);

export const BodyEngineSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="32" y="38" width="36" height="34" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="40" cy="46" r="5" fill="#64748b" stroke="#333" strokeWidth="2" />
    <circle cx="60" cy="46" r="5" fill="#64748b" stroke="#333" strokeWidth="2" />
    <circle cx="40" cy="64" r="5" fill="#64748b" stroke="#333" strokeWidth="2" />
    <circle cx="60" cy="64" r="5" fill="#64748b" stroke="#333" strokeWidth="2" />
  </svg>
);

// === ARMS SVGs (Left: 5~35, Right: 65~95, y: 40~80) ===
export const ArmsBasicSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 42 L15 60 L20 65 L35 45 Z" fill={color} stroke="#333" strokeWidth="2" />
    <circle cx="18" cy="64" r="6" fill="#666" stroke="#333" strokeWidth="2" />
    <path d="M70 42 L85 60 L80 65 L65 45 Z" fill={color} stroke="#333" strokeWidth="2" />
    <circle cx="82" cy="64" r="6" fill="#666" stroke="#333" strokeWidth="2" />
  </svg>
);

export const ArmsClawSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 45 Q 15 55 18 75" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M70 45 Q 85 55 82 75" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M15 75 L 8 85 M 21 75 L 28 85" stroke="#333" strokeWidth="3" strokeLinecap="round" />
    <path d="M85 75 L 92 85 M 79 75 L 72 85" stroke="#333" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const ArmsCannonSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="15" y="45" width="10" height="25" rx="2" fill={color} stroke="#333" strokeWidth="2" transform="rotate(15 20 55)" />
    <rect x="16" y="70" width="8" height="8" fill="#222" transform="rotate(15 20 55)" />
    <rect x="75" y="45" width="10" height="25" rx="2" fill={color} stroke="#333" strokeWidth="2" transform="rotate(-15 80 55)" />
    <rect x="76" y="70" width="8" height="8" fill="#222" transform="rotate(-15 80 55)" />
  </svg>
);

export const ArmsDrillSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M32 45 L22 60 L35 60 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M22 60 L28 80 L35 60 Z" fill="#94a3b8" stroke="#333" strokeWidth="2" />
    <path d="M68 45 L78 60 L65 60 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M78 60 L72 80 L65 60 Z" fill="#94a3b8" stroke="#333" strokeWidth="2" />
  </svg>
);

export const ArmsBladeSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 42 L22 55 L26 58 L34 45 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M22 55 L10 85 L26 58 Z" fill="#cbd5e1" stroke="#333" strokeWidth="2" />
    <path d="M70 42 L78 55 L74 58 L66 45 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M78 55 L90 85 L74 58 Z" fill="#cbd5e1" stroke="#333" strokeWidth="2" />
  </svg>
);

export const ArmsWhipSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 45 Q 10 55 20 70 T 5 90" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <path d="M70 45 Q 90 55 80 70 T 95 90" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const ArmsShieldSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M30 40 L18 50 L18 70 L30 80 L33 60 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M70 40 L82 50 L82 70 L70 80 L67 60 Z" fill={color} stroke="#333" strokeWidth="2" />
  </svg>
);

export const ArmsMultiSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M32 45 L15 52" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M30 55 L12 62" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M68 45 L85 52" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    <path d="M70 55 L88 62" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// === LEGS SVGs (y: 70~95, x: 25~75) ===
export const LegsBasicSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="36" y="70" width="8" height="15" rx="2" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M32 85 L44 85 L42 95 L34 95 Z" fill="#555" stroke="#333" strokeWidth="2" />
    <rect x="56" y="70" width="8" height="15" rx="2" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M52 85 L64 85 L62 95 L54 95 Z" fill="#555" stroke="#333" strokeWidth="2" />
  </svg>
);

export const LegsTreadsSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <rect x="25" y="78" width="50" height="16" rx="8" fill="#444" stroke="#222" strokeWidth="3" />
    <circle cx="33" cy="86" r="5" fill={color} stroke="#222" strokeWidth="1" />
    <circle cx="50" cy="86" r="5" fill={color} stroke="#222" strokeWidth="1" />
    <circle cx="67" cy="86" r="5" fill={color} stroke="#222" strokeWidth="1" />
    <rect x="42" y="70" width="16" height="12" fill={color} stroke="#333" strokeWidth="2" />
  </svg>
);

export const LegsHoverSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M40 70 L60 70 L55 82 L45 82 Z" fill={color} stroke="#333" strokeWidth="2" />
    <ellipse cx="50" cy="86" rx="25" ry="8" fill="#333" stroke="#222" strokeWidth="2" />
    <ellipse cx="50" cy="88" rx="18" ry="4" fill="#0ff" opacity="0.7" />
  </svg>
);

export const LegsSpiderSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M42 70 L30 80 L20 95" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M58 70 L70 80 L80 95" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M46 70 L38 82 L35 95" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M54 70 L62 82 L65 95" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LegsWheelSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className} shapeRendering="crispEdges">
    <g transform="translate(34.8, 69) scale(0.95)">
      {/* 左脚 (Left Leg) */}
      {/* 外枠 */}
      <path fill="#1a1d24" d="M 4,3 h 8 v 1 h 2 v 13 h -1 v 11 h 1 v 1 h -10 v -1 h 1 v -11 h -1 v -13 h 2 Z" />
      {/* ダークグレー装甲 */}
      <path fill="#2b303a" d="M 5,4 h 6 v 12 h -1 v 11 h -4 v -11 h -1 Z" />
      {/* 青色アーマー（太もも〜膝） */}
      <path fill={color || "#1d61d1"} d="M 6,5 h 4 v 1 h 1 v 8 h -1 v 2 h -4 v -2 h -1 v -8 h 1 Z" />
      {/* 青色アーマー（すね） */}
      <path fill={color || "#1d61d1"} d="M 6,20 h 4 v 6 h -4 Z" />
      <path fill={color || "#1d61d1"} d="M 5,27 h 6 v 1 h -6 Z" />
      {/* 水色・白色ハイライト */}
      <rect x="5" y="5" width="1" height="1" fill="#e8f4ff" />
      <rect x="7" y="7" width="2" height="5" fill="#388eff" />
      <rect x="7" y="17" width="2" height="1" fill="#e8f4ff" />
      <rect x="7" y="21" width="2" height="3" fill="#388eff" />
      <rect x="4" y="23" width="1" height="1" fill="#e8f4ff" />

      {/* 右脚 (Right Leg) */}
      {/* 外枠 */}
      <path fill="#1a1d24" d="M 18,3 h 8 v 1 h 2 v 13 h -1 v 11 h 1 v 1 h -10 v -1 h 1 v -11 h -1 v -13 h 2 Z" />
      {/* ダークグレー装甲 */}
      <path fill="#2b303a" d="M 19,4 h 6 v 12 h -1 v 11 h -4 v -11 h -1 Z" />
      {/* 青色アーマー（太もも〜膝） */}
      <path fill={color || "#1d61d1"} d="M 20,5 h 4 v 1 h 1 v 8 h -1 v 2 h -4 v -2 h -1 v -8 h 1 Z" />
      {/* 青色アーマー（すね） */}
      <path fill={color || "#1d61d1"} d="M 20,20 h 4 v 6 h -4 Z" />
      <path fill={color || "#1d61d1"} d="M 19,27 h 6 v 1 h -6 Z" />
      {/* 水色・白色ハイライト */}
      <rect x="25" y="5" width="1" height="1" fill="#e8f4ff" />
      <rect x="21" y="7" width="2" height="5" fill="#388eff" />
      <rect x="21" y="17" width="2" height="1" fill="#e8f4ff" />
      <rect x="21" y="21" width="2" height="3" fill="#388eff" />
      <rect x="26" y="23" width="1" height="1" fill="#e8f4ff" />
    </g>
  </svg>
);

export const LegsSpringSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M40 70 L34 76 L44 82 L34 88 L40 94" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    <path d="M60 70 L54 76 L64 82 L54 88 L60 94" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" />
    <rect x="34" y="94" width="12" height="3" fill="#333" />
    <rect x="54" y="94" width="12" height="3" fill="#333" />
  </svg>
);

export const LegsPegSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M42 70 L44 85 L40 85 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M58 70 L56 85 L60 85 Z" fill={color} stroke="#333" strokeWidth="2" />
  </svg>
);

export const LegsJetSVG = ({ color, viewBox="0 0 100 100", className }: SVGProps) => (
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M38 70 L62 70 L56 80 L44 80 Z" fill={color} stroke="#333" strokeWidth="2" />
    <path d="M46 80 L54 80 L58 92 L50 98 L42 92 Z" fill="#f97316" stroke="#fef08a" strokeWidth="1" />
  </svg>
);






export const HeadStar2SVG = ({ color, viewBox = "0 -2 32 36", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      <path fill={pal.out} d="M 11,2 h 10 v 1 h 3 v 1 h 2 v 2 h 1 v 1 h -1 v 3 h 2 v 1 h 1 v 5 h -1 v 1 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -8 v -1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -1 h -1 v -5 h 1 v -1 h 2 v -3 h -1 v -1 h 1 v -2 h 2 v -1 h 3 Z" />
      <path fill={pal.dark} d="M 12,3 h 8 v 1 h 3 v 1 h 2 v 2 h 1 v 1 h -2 v 3 h 1 v 6 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -6 v -1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -6 h 1 v -3 h -2 v -1 h 1 v -2 h 2 v -1 h 3 Z" />
      <path fill={pal.base} d="M 12,4 h 8 v 1 h 3 v 1 h 2 v 2 h -1 v 1 h -18 v -1 h -1 v -2 h 2 v -1 h 3 Z" />
      <rect x="14" y="3" width="4" height="1" fill={pal.light} />
      <rect x="9" y="6" width="2" height="1" fill={pal.white} />
      <path fill={pal.light} d="M 3,6 h 1 v 2 h -1 Z M 28,6 h 1 v 2 h -1 Z" />
      <path fill={pal.light} d="M 4,14 h 4 v 6 h -4 Z M 24,14 h 4 v 6 h -4 Z" />
      <rect x="6" y="16" width="1" height="2" fill={pal.white} />
      <rect x="25" y="16" width="1" height="2" fill={pal.white} />
      <rect x="7" y="9" width="2" height="1" fill={pal.gray} />
      <rect x="23" y="9" width="2" height="1" fill={pal.gray} />
      <rect x="7" y="21" width="2" height="1" fill={pal.gray} />
      <rect x="23" y="21" width="2" height="1" fill={pal.gray} />
      <path fill={pal.dark} d="M 8,12 h 16 v 8 h -16 Z" />
      <rect x="9" y="15" width="4" height="3" fill={pal.base} />
      <rect x="10" y="16" width="2" height="1" fill={pal.white} />
      <rect x="19" y="15" width="4" height="3" fill={pal.base} />
      <rect x="20" y="16" width="2" height="1" fill={pal.white} />
      <rect x="15" y="14" width="2" height="4" fill={pal.base} />
      <rect x="15" y="15" width="2" height="2" fill={pal.white} />
      <path fill={pal.base} d="M 10,22 h 12 v 1 h -1 v 1 h -1 v 1 h -8 v -1 h -1 v -1 h -1 Z" />
      <rect x="13" y="23" width="6" height="1" fill={pal.light} />
    </svg>
  );
};

export const ArmsStar2SVG = ({ color, viewBox = "0 0 32 32", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* 左腕 (Left Arm) */}
      {/* 外枠 */}
      <path fill={pal.out} d="M 4,4 h 6 v 1 h 2 v 6 h -1 v 2 h 1 v 10 h 1 v 1 h -2 v 3 h -1 v 1 h -6 v -1 h -1 v -3 h -2 v -1 h 1 v -10 h 1 v -2 h -1 v -6 h 2 Z" />
      {/* ダークグレー骨格・ベース */}
      <path fill={pal.dark} d="M 5,5 h 4 v 5 h -1 v 2 h 1 v 10 h -1 v 3 h -2 v -3 h -1 v -10 h 1 v -2 h -1 Z" />
      {/* 肩アーマー (属性メインカラー) */}
      <path fill={pal.base} d="M 5,5 h 4 v 5 h -4 Z" />
      <rect x="5" y="6" width="1" height="1" fill={pal.white} />
      {/* 関節 (関節・肘部分) */}
      <rect x="6" y="11" width="2" height="1" fill={pal.light} />
      {/* 前腕アーマー (属性メインカラー) */}
      <path fill={pal.base} d="M 5,14 h 4 v 8 h -2 v -2 h -1 v -5 h -1 Z" />
      <rect x="4" y="15" width="1" height="1" fill={pal.gray} />
      {/* マニピュレータ/手 (ダーク & 属性ライトカラー) */}
      <path fill={pal.dark} d="M 4,23 h 6 v 3 h -6 Z" />
      <rect x="5" y="24" width="4" height="1" fill={pal.light} />
      <rect x="5" y="27" width="4" height="1" fill={pal.light} />

      {/* 右腕 (Right Arm) */}
      {/* 外枠 */}
      <path fill={pal.out} d="M 20,4 h 6 v 1 h 2 v 6 h -1 v 2 h 1 v 10 h 1 v 1 h -2 v 3 h -1 v 1 h -6 v -1 h -1 v -3 h -2 v -1 h 1 v -10 h 1 v -2 h -1 v -6 h 2 Z" />
      {/* ダークグレー骨格・ベース */}
      <path fill={pal.dark} d="M 21,5 h 4 v 5 h -1 v 2 h 1 v 10 h -1 v 3 h -2 v -3 h -1 v -10 h 1 v -2 h -1 Z" />
      {/* 肩アーマー (属性メインカラー) */}
      <path fill={pal.base} d="M 21,5 h 4 v 5 h -4 Z" />
      <rect x="24" y="6" width="1" height="1" fill={pal.white} />
      {/* 関節 (関節・肘部分) */}
      <rect x="22" y="11" width="2" height="1" fill={pal.light} />
      {/* 前腕アーマー (属性メインカラー) */}
      <path fill={pal.base} d="M 21,14 h 4 v 5 h -1 v 2 h -2 v -8 Z" />
      <rect x="25" y="15" width="1" height="1" fill={pal.gray} />
      {/* マニピュレータ/手 (ダーク & 属性ライトカラー) */}
      <path fill={pal.dark} d="M 20,23 h 6 v 3 h -6 Z" />
      <rect x="21" y="24" width="4" height="1" fill={pal.light} />
      <rect x="21" y="27" width="4" height="1" fill={pal.light} />
    </svg>
  );
};

export const HeadStar3SVG = ({ color, viewBox = "0 0 256 256", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const glowId = `glow-${uid}`;
  const armorId = `armor-${uid}`;
  const silverPlateId = `silver-plate-${uid}`;
  const darkMetalId = `dark-metal-${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} width="100%" height="100%">
      <defs>
        {/* グラデーション定義（属性カラー対応） */}
        <linearGradient id={glowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.glow0 || '#72f5ff'} />
          <stop offset="60%" stopColor={pal.glow60 || '#00c8ff'} />
          <stop offset="100%" stopColor={pal.glow100 || '#0088cc'} />
        </linearGradient>

        <linearGradient id={armorId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.armor0 || '#2b82ff'} />
          <stop offset="100%" stopColor={pal.armor100 || '#004cd6'} />
        </linearGradient>

        <linearGradient id={silverPlateId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <linearGradient id={darkMetalId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.dark0 || '#2d3748'} />
          <stop offset="100%" stopColor={pal.dark100 || '#1a202c'} />
        </linearGradient>
      </defs>

      {/* 外側ストローク用グラフィックグループ */}
      <g stroke={pal.stroke || '#0e1726'} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* 背面ツノ・ウィング（左右・中央） */}
        <path d="M 128,10 L 142,32 L 128,38 L 114,32 Z" fill={pal.solidAccent || '#0055ff'} />
        <path d="M 32,12 L 68,54 L 52,82 L 20,40 Z" fill={`url(#${armorId})`} />
        <path d="M 224,12 L 236,40 L 204,82 L 188,54 Z" fill={`url(#${armorId})`} />

        {/* 耳アーマー（左右の丸型イヤーユニット） */}
        <circle cx="50" cy="120" r="28" fill={`url(#${darkMetalId})`} />
        <circle cx="50" cy="120" r="20" fill={pal.solidAccent || '#0066ff'} />
        <circle cx="50" cy="120" r="12" fill={`url(#${glowId})`} />

        <circle cx="206" cy="120" r="28" fill={`url(#${darkMetalId})`} />
        <circle cx="206" cy="120" r="20" fill={pal.solidAccent || '#0066ff'} />
        <circle cx="206" cy="120" r="12" fill={`url(#${glowId})`} />

        {/* 後頭部・メインヘルメットベース */}
        <path d="M 68,50 Q 128,25 188,50 L 182,90 L 74,90 Z" fill={`url(#${armorId})`} />

        {/* 頭頂部シルバープレート */}
        <path d="M 100,40 L 128,30 L 156,40 L 150,88 L 106,88 Z" fill={`url(#${silverPlateId})`} />
        <path d="M 108,38 L 128,88 L 148,38 Z" fill="#cbd5e1" />

        {/* 額中央のトサカ・額結晶ユニット */}
        <path d="M 116,60 L 128,40 L 140,60 L 136,110 L 128,118 L 120,110 Z" fill={`url(#${darkMetalId})`} />
        <path d="M 122,64 L 128,48 L 134,64 L 132,106 L 128,110 L 124,106 Z" fill={`url(#${glowId})`} />
        <polygon points="128,100 134,106 132,116 124,116 122,106" fill="none" stroke={`url(#${silverPlateId})`} strokeWidth="3" />

        {/* バイザー枠・ひさし（シルバーアーマー） */}
        <path d="M 56,98 L 102,90 L 128,102 L 154,90 L 200,98 L 184,138 L 158,112 L 128,122 L 98,112 L 72,138 Z" fill={`url(#${silverPlateId})`} />

        {/* 顔面メインバイザー (発光) */}
        <path d="M 68,108 L 104,102 L 128,114 L 152,102 L 188,108 L 172,148 L 128,162 L 84,148 Z" fill={`url(#${glowId})`} />

        {/* バイザー内反射・ハイライト */}
        <path d="M 72,112 L 102,106 L 128,118 L 154,106 L 184,112 L 176,128 Q 128,110 80,128 Z" fill="#ffffff" opacity="0.5" stroke="none" />

        {/* 頬・下顎サイドアーマー */}
        <path d="M 60,146 L 80,140 L 90,182 L 68,190 L 58,168 Z" fill={`url(#${armorId})`} />
        <rect x="70" y="156" width="8" height="12" fill={`url(#${glowId})`} rx="1" />

        <path d="M 196,146 L 176,140 L 166,182 L 188,190 L 198,168 Z" fill={`url(#${armorId})`} />
        <rect x="178" y="156" width="8" height="12" fill={`url(#${glowId})`} rx="1" />

        {/* 口元フェイスガード (ダークグレー & シルバーダクト) */}
        <path d="M 84,148 L 128,162 L 172,148 L 162,192 L 128,210 L 94,192 Z" fill={`url(#${darkMetalId})`} />
        
        {/* 口元ダクト（スリット状インテーク） */}
        <path d="M 104,166 L 152,166 L 148,188 L 108,188 Z" fill={`url(#${silverPlateId})`} />
        <line x1="120" y1="170" x2="120" y2="184" stroke={pal.stroke || '#1a202c'} strokeWidth="4" />
        <line x1="128" y1="170" x2="128" y2="184" stroke={pal.stroke || '#1a202c'} strokeWidth="4" />
        <line x1="136" y1="170" x2="136" y2="184" stroke={pal.stroke || '#1a202c'} strokeWidth="4" />

        {/* 顎先端アーマー */}
        <path d="M 106,192 L 150,192 L 142,220 L 114,220 Z" fill={`url(#${darkMetalId})`} />
        <path d="M 110,196 L 146,196 L 138,216 L 118,216 Z" fill={`url(#${armorId})`} />
        <polygon points="120,200 136,200 132,212 124,212" fill={`url(#${glowId})`} stroke="none" />
      </g>
    </svg>
  );
};

export const HeadStar3_2SVG = ({ color, viewBox = "0 0 256 256", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const glowId = `cyan-glow-${uid}`;
  const armorId = `blue-armor-${uid}`;
  const silverPlateId = `silver-plate-${uid}`;
  const darkMetalId = `dark-metal-${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} width="100%" height="100%">
      <defs>
        {/* グラデーション定義 */}
        <linearGradient id={glowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.glow0 || '#80f5ff'} />
          <stop offset="50%" stopColor={pal.glow60 || '#00d0ff'} />
          <stop offset="100%" stopColor={pal.glow100 || '#0088cc'} />
        </linearGradient>

        <linearGradient id={armorId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.armor0 || '#2b82ff'} />
          <stop offset="100%" stopColor={pal.armor100 || '#004cd6'} />
        </linearGradient>

        <linearGradient id={silverPlateId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        <linearGradient id={darkMetalId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.dark0 || '#2d3748'} />
          <stop offset="100%" stopColor={pal.dark100 || '#111827'} />
        </linearGradient>
      </defs>

      {/* 全体太ストロークグループ */}
      <g stroke={pal.stroke || '#0f172a'} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* 最上部カメラ/センサーユニット */}
        <path d="M 96,36 L 112,18 L 144,18 L 160,36 L 152,60 L 104,60 Z" fill={`url(#${armorId})`} />
        <path d="M 108,26 L 148,26 L 144,52 L 112,52 Z" fill={`url(#${darkMetalId})`} />
        <rect x="114" y="30" width="28" height="16" rx="2" fill={`url(#${glowId})`} />
        <rect x="118" y="32" width="12" height="3" fill="#ffffff" stroke="none" />

        {/* 後頭部・ショルダーベース (シルバー/ブルー) */}
        <path d="M 56,76 L 80,56 L 176,56 L 200,76 L 204,150 L 52,150 Z" fill={`url(#${silverPlateId})`} />
        <path d="M 64,68 L 192,68 L 184,124 L 72,124 Z" fill={`url(#${armorId})`} />

        {/* メインフレーム（ダークメタルインナー） */}
        <path d="M 72,74 L 184,74 L 180,126 L 76,126 Z" fill={`url(#${darkMetalId})`} />

        {/* 額中央センサー/カメラ */}
        <path d="M 112,78 L 144,78 L 144,122 L 112,122 Z" fill={`url(#${armorId})`} />
        <rect x="120" y="84" width="16" height="12" fill={`url(#${glowId})`} />
        <rect x="122" y="102" width="12" height="16" fill={`url(#${glowId})`} />
        <rect x="124" y="104" width="4" height="8" fill="#ffffff" stroke="none" />

        {/* ゴーグル/バイザー（V字発光） */}
        <path d="M 68,124 L 128,142 L 188,124 L 184,136 L 128,154 L 72,136 Z" fill={`url(#${glowId})`} />
        <path d="M 74,127 L 128,143 L 182,127" stroke="#ffffff" strokeWidth="3" fill="none" />

        {/* 頬・下部サイドアーマー (シルバー/ブルー) */}
        {/* 左頬 */}
        <path d="M 52,132 L 88,132 L 96,176 L 68,188 L 52,170 Z" fill={`url(#${silverPlateId})`} />
        <rect x="64" y="146" width="16" height="18" fill={`url(#${armorId})`} />
        <rect x="68" y="152" width="8" height="6" fill={`url(#${glowId})`} />

        {/* 右頬 */}
        <path d="M 204,132 L 168,132 L 160,176 L 188,188 L 204,170 Z" fill={`url(#${silverPlateId})`} />
        <rect x="176" y="146" width="16" height="18" fill={`url(#${armorId})`} />
        <rect x="180" y="152" width="8" height="6" fill={`url(#${glowId})`} />

        {/* 口元・フェースマスク (ダークグレー) */}
        <path d="M 64,170 L 192,170 L 176,230 L 128,242 L 80,230 Z" fill={`url(#${darkMetalId})`} />

        {/* マスク部金属ボルト/リベット */}
        <rect x="88" y="180" width="6" height="6" fill="#ffffff" stroke="none" />
        <rect x="162" y="180" width="6" height="6" fill="#ffffff" stroke="none" />

        {/* 口元スリット・インテーク (シルバー) */}
        <rect x="96" y="190" width="64" height="22" rx="2" fill={`url(#${silverPlateId})`} />
        <line x1="112" y1="194" x2="112" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="122" y1="194" x2="122" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="134" y1="194" x2="134" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="144" y1="194" x2="144" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />

        {/* 顎部（青色アーマー） */}
        <path d="M 104,220 L 152,220 L 144,236 L 112,236 Z" fill={`url(#${armorId})`} />
        <rect x="112" y="224" width="32" height="8" fill={`url(#${glowId})`} />
      </g>
    </svg>
  );
};

export const HeadStar3_3SVG = ({ color, viewBox = "0 0 256 256", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const glowId = `cyan-glow-${uid}`;
  const armorId = `blue-armor-${uid}`;
  const silverPlateId = `silver-plate-${uid}`;
  const darkMetalId = `dark-metal-${uid}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} width="100%" height="100%">
      <defs>
        {/* グラデーション定義 */}
        <linearGradient id={glowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.glow0 || '#80f5ff'} />
          <stop offset="50%" stopColor={pal.glow60 || '#00d0ff'} />
          <stop offset="100%" stopColor={pal.glow100 || '#0088cc'} />
        </linearGradient>

        <linearGradient id={armorId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.armor0 || '#2b82ff'} />
          <stop offset="100%" stopColor={pal.armor100 || '#004cd6'} />
        </linearGradient>

        <linearGradient id={silverPlateId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        <linearGradient id={darkMetalId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={pal.dark0 || '#2d3748'} />
          <stop offset="100%" stopColor={pal.dark100 || '#111827'} />
        </linearGradient>
      </defs>

      {/* 全体太ストロークグループ */}
      <g stroke={pal.stroke || '#0f172a'} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* 頭上フローティングセンサーユニット */}
        <rect x="104" y="12" width="48" height="24" rx="6" fill={`url(#${armorId})`} />
        <rect x="114" y="18" width="28" height="12" rx="2" fill={`url(#${glowId})`} />
        <rect x="118" y="20" width="12" height="3" fill="#ffffff" stroke="none" />

        {/* 後頭部・ショルダーベース (シルバー/ブルー) */}
        <path d="M 56,66 L 80,48 L 176,48 L 200,66 L 204,140 L 52,140 Z" fill={`url(#${silverPlateId})`} />
        <path d="M 64,58 L 192,58 L 184,114 L 72,114 Z" fill={`url(#${armorId})`} />

        {/* メインフレーム（ダークメタルインナー） */}
        <path d="M 72,64 L 184,64 L 180,116 L 76,116 Z" fill={`url(#${darkMetalId})`} />

        {/* 額中央スクエアカメラ / センサー */}
        <rect x="100" y="70" width="56" height="42" rx="6" fill={`url(#${armorId})`} />
        <rect x="108" y="76" width="40" height="30" rx="3" fill={`url(#${darkMetalId})`} />
        <rect x="116" y="82" width="24" height="18" rx="2" fill={`url(#${glowId})`} />
        <rect x="120" y="84" width="10" height="3" fill="#ffffff" stroke="none" />

        {/* 左右側面サイドダクト / センサー */}
        <rect x="52" y="84" width="16" height="36" fill={`url(#${darkMetalId})`} />
        <rect x="56" y="88" width="8" height="28" fill={`url(#${armorId})`} />
        <rect x="58" y="94" width="4" height="16" fill={`url(#${glowId})`} />

        <rect x="188" y="84" width="16" height="36" fill={`url(#${darkMetalId})`} />
        <rect x="192" y="88" width="8" height="28" fill={`url(#${armorId})`} />
        <rect x="194" y="94" width="4" height="16" fill={`url(#${glowId})`} />

        {/* 大型バイザー（V字発光・スクエアフレーム） */}
        <path d="M 48,118 L 208,118 L 196,168 L 60,168 Z" fill={`url(#${darkMetalId})`} />
        <path d="M 58,124 L 198,124 L 188,160 L 68,160 Z" fill={`url(#${glowId})`} />
        
        {/* バイザー内インナーフレーム＆V字ライン */}
        <path d="M 72,128 L 184,128 L 176,156 L 80,156 Z" fill={`url(#${armorId})`} />
        <path d="M 92,134 L 128,150 L 164,134" stroke="#ffffff" strokeWidth="4" fill="none" />
        <path d="M 92,142 L 128,158 L 164,142" stroke="#ffffff" strokeWidth="4" fill="none" />

        {/* 口元・フェースマスク (ダークグレー) */}
        <path d="M 60,168 L 196,168 L 180,228 L 128,240 L 76,228 Z" fill={`url(#${darkMetalId})`} />

        {/* マスク部金属ボルト/リベット */}
        <rect x="74" y="178" width="6" height="6" fill="#ffffff" stroke="none" />
        <rect x="176" y="178" width="6" height="6" fill="#ffffff" stroke="none" />

        {/* 口元スリット・インテーク (シルバー) */}
        <rect x="84" y="188" width="88" height="24" rx="2" fill={`url(#${silverPlateId})`} />
        <line x1="100" y1="192" x2="100" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="114" y1="192" x2="114" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="128" y1="192" x2="128" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="142" y1="192" x2="142" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />
        <line x1="156" y1="192" x2="156" y2="208" stroke={pal.stroke || '#111827'} strokeWidth="4" />

        {/* 顎部（青色アーマー） */}
        <path d="M 100,222 L 156,222 L 148,240 L 108,240 Z" fill={`url(#${armorId})`} />
        <rect x="110" y="226" width="36" height="8" fill={`url(#${glowId})`} />
      </g>
    </svg>
  );
};

export const SVG_HEADS: Record<number, React.FC<SVGProps>[]> = {
  1: [HeadBasicSVG, HeadRoundSVG, HeadTVSVG, HeadHornSVG, HeadCylinderSVG, HeadVisorSVG, HeadTriangleSVG, HeadDomeSVG],
  2: [HeadStar2SVG],
  3: [HeadStar3SVG, HeadStar3_2SVG, HeadStar3_3SVG]
};
export const SVG_BODIES: Record<number, React.FC<SVGProps>[]> = {
  1: [BodyBasicSVG, BodyRoundSVG, BodyHeavySVG, BodyBarrelSVG, BodySlimSVG, BodyFurnaceSVG, BodyDiamondSVG, BodyEngineSVG],
  2: [],
  3: []
};
export const SVG_ARMS: Record<number, React.FC<SVGProps>[]> = {
  1: [ArmsBasicSVG, ArmsClawSVG, ArmsCannonSVG, ArmsDrillSVG, ArmsBladeSVG, ArmsWhipSVG, ArmsShieldSVG, ArmsMultiSVG],
  2: [ArmsStar2SVG],
  3: []
};
export const SVG_LEGS: Record<number, React.FC<SVGProps>[]> = {
  1: [LegsBasicSVG, LegsTreadsSVG, LegsHoverSVG, LegsSpiderSVG, LegsWheelSVG, LegsSpringSVG, LegsPegSVG, LegsJetSVG],
  2: [],
  3: []
};
