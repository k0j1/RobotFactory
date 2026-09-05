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
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <path d="M47 70 L53 70 L53 80 L47 80 Z" fill="#666" stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="86" r="11" fill="#333" stroke="#222" strokeWidth="2" />
    <circle cx="50" cy="86" r="6" fill={color} stroke="#111" strokeWidth="1.5" />
    <circle cx="50" cy="86" r="2" fill="#fff" />
  </svg>
);

export const LegsStar2PixelSVG = ({ color, viewBox = "0 0 32 32", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* 左脚 (Left Leg) */}
      {/* 外枠 */}
      <path fill={pal.out} d="M 4,3 h 8 v 1 h 2 v 13 h -1 v 11 h 1 v 1 h -10 v -1 h 1 v -11 h -1 v -13 h 2 Z" />
      {/* ダークグレー装甲 */}
      <path fill={pal.dark} d="M 5,4 h 6 v 12 h -1 v 11 h -4 v -11 h -1 Z" />
      {/* 属性メインカラー（太もも〜膝） */}
      <path fill={pal.base} d="M 6,5 h 4 v 1 h 1 v 8 h -1 v 2 h -4 v -2 h -1 v -8 h 1 Z" />
      {/* 属性メインカラー（すね） */}
      <path fill={pal.base} d="M 6,20 h 4 v 6 h -4 Z" />
      <path fill={pal.base} d="M 5,27 h 6 v 1 h -6 Z" />
      {/* 水色・白色ハイライト */}
      <rect x="5" y="5" width="1" height="1" fill={pal.white} />
      <rect x="7" y="7" width="2" height="5" fill={pal.light} />
      <rect x="7" y="17" width="2" height="1" fill={pal.white} />
      <rect x="7" y="21" width="2" height="3" fill={pal.light} />
      <rect x="4" y="23" width="1" height="1" fill={pal.white} />

      {/* 右脚 (Right Leg) */}
      {/* 外枠 */}
      <path fill={pal.out} d="M 18,3 h 8 v 1 h 2 v 13 h -1 v 11 h 1 v 1 h -10 v -1 h 1 v -11 h -1 v -13 h 2 Z" />
      {/* ダークグレー装甲 */}
      <path fill={pal.dark} d="M 19,4 h 6 v 12 h -1 v 11 h -4 v -11 h -1 Z" />
      {/* 属性メインカラー（太もも〜膝） */}
      <path fill={pal.base} d="M 20,5 h 4 v 1 h 1 v 8 h -1 v 2 h -4 v -2 h -1 v -8 h 1 Z" />
      {/* 属性メインカラー（すね） */}
      <path fill={pal.base} d="M 20,20 h 4 v 6 h -4 Z" />
      <path fill={pal.base} d="M 19,27 h 6 v 1 h -6 Z" />
      {/* 水色・白色ハイライト */}
      <rect x="25" y="5" width="1" height="1" fill={pal.white} />
      <rect x="21" y="7" width="2" height="5" fill={pal.light} />
      <rect x="21" y="17" width="2" height="1" fill={pal.white} />
      <rect x="21" y="21" width="2" height="3" fill={pal.light} />
      <rect x="26" y="23" width="1" height="1" fill={pal.white} />
    </svg>
  );
};

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

export const BodyStar2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const bodyGradId = `body-grad-${uid}`;
  const panelGradId = `panel-grad-${uid}`;
  const screenGradId = `screen-grad-${uid}`;
  const coreGradId = `core-grad-${uid}`;

  // 水属性または指定なし/青系の場合はユーザー指定のブルーパレットを完全適用
  const isBlueOrWater = !color || color.toLowerCase().includes('3b82f6') || color.toLowerCase().includes('water') || color.toLowerCase().includes('1d61d1');

  const bodyColor0 = isBlueOrWater ? '#73c0ff' : (pal.armor0 || pal.light);
  const bodyColor100 = isBlueOrWater ? '#3b81eb' : (pal.armor100 || pal.base);

  const panelColor0 = '#ffffff';
  const panelColor100 = isBlueOrWater ? '#cbe0f5' : (pal.white || '#f1f5f9');

  const screenColor0 = isBlueOrWater ? '#468df2' : (pal.armor0 || pal.light);
  const screenColor100 = isBlueOrWater ? '#2259c3' : (pal.armor100 || pal.base);

  const screenStroke = isBlueOrWater ? '#26e3ff' : (pal.glow60 || pal.light);
  const screenHighlight = isBlueOrWater ? '#a4f2ff' : (pal.glow0 || '#ffffff');

  const coreColor0 = isBlueOrWater ? '#7bf8ff' : (pal.glow0 || '#ffffff');
  const coreColor100 = isBlueOrWater ? '#2cd4f7' : (pal.glow60 || pal.light);

  const jointColor = isBlueOrWater ? '#c3dbf5' : (pal.white || '#cbd5e1');
  const outerStroke = isBlueOrWater ? '#121e36' : (pal.stroke || '#121e36');
  const darkFrame = isBlueOrWater ? '#111c30' : (pal.dark0 || '#111c30');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        {/* メインボディ用グラデーション (青系) */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyColor0} />
          <stop offset="100%" stopColor={bodyColor100} />
        </linearGradient>

        {/* インナーパネル用グラデーション (ライトグレー) */}
        <linearGradient id={panelGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={panelColor0} />
          <stop offset="100%" stopColor={panelColor100} />
        </linearGradient>

        {/* 中央液晶画面グラデーション (ディープブルー) */}
        <linearGradient id={screenGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={screenColor0} />
          <stop offset="100%" stopColor={screenColor100} />
        </linearGradient>

        {/* 下部コア（丸レンズ）グラデーション (シアン発光) */}
        <linearGradient id={coreGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={coreColor0} />
          <stop offset="100%" stopColor={coreColor100} />
        </linearGradient>
      </defs>

      {/* 外枠線＆全体のベース構造 (太いダークブルー枠) */}
      <g stroke={outerStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        {/* 1. 外装メインボディ */}
        <path d="M 80,35 H 220 A 30,30 0 0 1 250,65 V 235 A 30,30 0 0 1 220,265 H 80 A 30,30 0 0 1 50,235 V 65 A 30,30 0 0 1 80,35 Z" fill={`url(#${bodyGradId})`} />

        {/* 2. 上部インナーパネル (画面奥の凹み) */}
        <path d="M 82,58 H 218 A 12,12 0 0 1 230,70 V 122 A 12,12 0 0 1 218,134 H 82 A 12,12 0 0 1 70,122 V 70 A 12,12 0 0 1 82,58 Z" fill={`url(#${panelGradId})`} />

        {/* 3. 下部インナーパネル */}
        <path d="M 82,168 H 218 A 12,12 0 0 1 230,180 V 238 A 12,12 0 0 1 218,250 H 82 A 12,12 0 0 1 70,238 V 180 A 12,12 0 0 1 82,168 Z" fill={`url(#${panelGradId})`} />

        {/* 4. 中央モニター枠 (黒縁) */}
        <rect x="92" y="90" width="116" height="72" rx="20" ry="20" fill={darkFrame} stroke={outerStroke} strokeWidth="10" />

        {/* 5. 中央モニター発光画面 (青液晶) */}
        <rect x="108" y="104" width="84" height="44" rx="10" ry="10" fill={`url(#${screenGradId})`} stroke={screenStroke} strokeWidth="4" />

        {/* 6. 液晶画面中央の光点 (ハイライト) */}
        <circle cx="150" cy="123" r="8" fill={screenHighlight} stroke="none" />

        {/* 7. 左右のボルト / 接続ジョイント (丸パーツ) */}
        <circle cx="72" cy="150" r="9" fill={jointColor} stroke={outerStroke} strokeWidth="6" />
        <circle cx="228" cy="150" r="9" fill={jointColor} stroke={outerStroke} strokeWidth="6" />

        {/* 8. 下部コア（円形レンズ枠） */}
        <circle cx="150" cy="204" r="28" fill={darkFrame} stroke={outerStroke} strokeWidth="10" />

        {/* 9. コア発光レンズ */}
        <circle cx="150" cy="204" r="16" fill={`url(#${coreGradId})`} stroke="none" />
      </g>
    </svg>
  );
};

export const BodyStar2_2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const bodyGradId = `body-grad-2-${uid}`;
  const panelGradId = `panel-grad-2-${uid}`;
  const screenGradId = `screen-grad-2-${uid}`;
  const coreGradId = `core-grad-2-${uid}`;
  const glowGradId = `glow-grad-2-${uid}`;

  // 水属性または指定なし/青系の場合はユーザー指定のブルーパレットを完全適用
  const isBlueOrWater = !color || color.toLowerCase().includes('3b82f6') || color.toLowerCase().includes('water') || color.toLowerCase().includes('1d61d1');

  const bodyColor0 = isBlueOrWater ? '#73c0ff' : (pal.armor0 || pal.light);
  const bodyColor100 = isBlueOrWater ? '#3b81eb' : (pal.armor100 || pal.base);

  const panelColor0 = '#ffffff';
  const panelColor100 = isBlueOrWater ? '#cbe0f5' : (pal.white || '#f1f5f9');

  const screenColor0 = isBlueOrWater ? '#64f3ff' : (pal.glow0 || '#ffffff');
  const screenColor100 = isBlueOrWater ? '#24d1f7' : (pal.glow60 || pal.light);

  const coreColor0 = isBlueOrWater ? '#6df5ff' : (pal.glow0 || '#ffffff');
  const coreColor100 = isBlueOrWater ? '#1bc8f5' : (pal.glow60 || pal.light);

  const glowColor0 = isBlueOrWater ? '#80f7ff' : (pal.glow0 || '#ffffff');
  const glowColor100 = isBlueOrWater ? '#33d8f7' : (pal.glow60 || pal.light);

  const outerStroke = isBlueOrWater ? '#121e36' : (pal.stroke || '#121e36');
  const darkFrame = isBlueOrWater ? '#111c30' : (pal.dark0 || '#111c30');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        {/* 外装ボディ用グラデーション (青系) */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyColor0} />
          <stop offset="100%" stopColor={bodyColor100} />
        </linearGradient>

        {/* インナーパネル用グラデーション (シルバー/ライトグレー) */}
        <linearGradient id={panelGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={panelColor0} />
          <stop offset="100%" stopColor={panelColor100} />
        </linearGradient>

        {/* メインバイザー画面グラデーション (シアン発光) */}
        <linearGradient id={screenGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={screenColor0} />
          <stop offset="100%" stopColor={screenColor100} />
        </linearGradient>

        {/* 下部丸型コアグラデーション (シアン発光) */}
        <linearGradient id={coreGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={coreColor0} />
          <stop offset="100%" stopColor={coreColor100} />
        </linearGradient>

        {/* 小ボタン/中央インジケーターグラデーション */}
        <linearGradient id={glowGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={glowColor0} />
          <stop offset="100%" stopColor={glowColor100} />
        </linearGradient>
      </defs>

      {/* 全体太ストローク・グループ */}
      <g stroke={outerStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
        {/* 1. 外装ボディベース（上部フチ付き） */}
        <path d="M 85,32 H 215 A 25,25 0 0 1 240,57 V 238 A 25,25 0 0 1 215,263 H 85 A 25,25 0 0 1 60,238 V 57 A 25,25 0 0 1 85,32 Z" fill={`url(#${bodyGradId})`} />

        {/* 上部ヘルメットフチ線 (二重アーチ構造) */}
        <path d="M 80,50 H 220" fill="none" stroke={outerStroke} strokeWidth="10" />

        {/* 2. 上部インナーパネル */}
        <path d="M 80,62 H 220 A 12,12 0 0 1 232,74 V 116 A 12,12 0 0 1 220,128 H 80 A 12,12 0 0 1 68,116 V 74 A 12,12 0 0 1 80,62 Z" fill={`url(#${panelGradId})`} />

        {/* 3. 下部インナーパネル */}
        <path d="M 80,160 H 220 A 12,12 0 0 1 232,172 V 232 A 12,12 0 0 1 220,244 H 80 A 12,12 0 0 1 68,232 V 172 A 12,12 0 0 1 80,160 Z" fill={`url(#${panelGradId})`} />

        {/* 4. メインモニター外枠 (黒フレーム) */}
        <rect x="88" y="80" width="124" height="68" rx="24" ry="24" fill={darkFrame} stroke={outerStroke} strokeWidth="10" />

        {/* 5. メイン画面 (シアンV字型バイザー) */}
        <rect x="108" y="96" width="84" height="36" rx="14" ry="14" fill={`url(#${screenGradId})`} stroke="none" />

        {/* バイザー内反射・光沢ハイライト */}
        <path d="M 118,103 H 146 A 4,4 0 0 1 150,107 V 107 A 4,4 0 0 1 146,111 H 118 A 4,4 0 0 1 114,107 V 107 A 4,4 0 0 1 118,103 Z" fill="#ffffff" stroke="none" opacity="0.8" />

        {/* 6. 中央小さな接続スリット・ライト */}
        <rect x="126" y="145" width="48" height="16" rx="6" ry="6" fill="#ffffff" stroke={outerStroke} strokeWidth="6" />
        <circle cx="150" cy="153" r="4" fill={`url(#${glowGradId})`} stroke="none" />

        {/* 7. 左右の丸型発光ボタン/リベット */}
        <circle cx="72" cy="148" r="8" fill={`url(#${glowGradId})`} stroke={outerStroke} strokeWidth="6" />
        <circle cx="228" cy="148" r="8" fill={`url(#${glowGradId})`} stroke={outerStroke} strokeWidth="6" />

        {/* 8. 下部コア（丸型枠） */}
        <rect x="118" y="176" width="64" height="42" rx="21" ry="21" fill={darkFrame} stroke={outerStroke} strokeWidth="10" />

        {/* 9. 下部コア発光レンズ */}
        <circle cx="150" cy="197" r="12" fill={`url(#${coreGradId})`} stroke="none" />
        {/* レンズ内ハイライト */}
        <circle cx="147" cy="194" r="3" fill="#ffffff" stroke="none" />
      </g>
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

export const LegsStar2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const legGradId = `leg-grad-${uid}`;
  const footGradId = `foot-grad-${uid}`;
  const jointGradId = `joint-grad-${uid}`;
  const cyanGlowId = `cyan-glow-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const legColor0 = isBlueOrWater ? '#6bb3f8' : (pal.armor0 || '#6bb3f8');
  const legColor100 = isBlueOrWater ? '#3b81eb' : (pal.armor100 || '#3b81eb');

  const glowColor0 = isBlueOrWater ? '#73f7ff' : (pal.glow0 || '#73f7ff');
  const glowColor100 = isBlueOrWater ? '#2bd3f7' : (pal.glow100 || '#2bd3f7');

  const outerStroke = isBlueOrWater ? '#121e36' : (pal.stroke || '#121e36');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        {/* 脚部装甲グラデーション (青) */}
        <linearGradient id={legGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={legColor0} />
          <stop offset="100%" stopColor={legColor100} />
        </linearGradient>

        {/* 足元シューズグラデーション (シルバー) */}
        <linearGradient id={footGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cadcf0" />
        </linearGradient>

        {/* 膝ジョイントグラデーション (ライトグレー) */}
        <linearGradient id={jointGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eaf3fc" />
          <stop offset="100%" stopColor="#b8cee6" />
        </linearGradient>

        {/* 発光部グラデーション (シアン) */}
        <linearGradient id={cyanGlowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={glowColor0} />
          <stop offset="100%" stopColor={glowColor100} />
        </linearGradient>
      </defs>

      {/* 全体太ストローク・グループ */}
      <g stroke={outerStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">

        {/* ================= 左脚 (LEFT LEG) ================= */}
        {/* 太もも (上部・やや丸みを帯びたストレート装甲) */}
        <path d="M 68,28 H 112 A 8,8 0 0 1 120,36 V 110 A 12,12 0 0 1 108,122 H 72 A 12,12 0 0 1 60,110 V 36 A 8,8 0 0 1 68,28 Z" fill={`url(#${legGradId})`} />

        {/* すね (中間・しなりを持つスリム装甲) */}
        <path d="M 68,140 C 65,160 68,180 72,220 L 118,225 C 112,185 108,160 102,140 Z" fill={`url(#${legGradId})`} />

        {/* 膝関節 (横長カプセル型ジョイント) */}
        <rect x="68" y="112" width="44" height="28" rx="14" ry="14" fill={`url(#${jointGradId})`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="90" cy="126" r="6" fill="#ffffff" stroke={outerStroke} strokeWidth="3" />
        <circle cx="90" cy="126" r="3" fill={`url(#${cyanGlowId})`} stroke="none" />

        {/* 足元 (台形シューズ/フットパーツ) */}
        <path d="M 58,225 L 118,235 C 128,237 132,250 126,265 L 122,272 H 52 C 45,272 44,258 50,242 Z" fill={`url(#${footGradId})`} />
        {/* 底面発光インジケーター */}
        <path d="M 58,260 H 118 V 265 H 58 Z" fill={`url(#${cyanGlowId})`} stroke="none" />


        {/* ================= 右脚 (RIGHT LEG) ================= */}
        {/* 太もも (上部・やや丸みを帯びたストレート装甲) */}
        <path d="M 188,28 H 232 A 8,8 0 0 1 240,36 V 110 A 12,12 0 0 1 228,122 H 192 A 12,12 0 0 1 180,110 V 36 A 8,8 0 0 1 188,28 Z" fill={`url(#${legGradId})`} />

        {/* すね (中間・しなりを持つスリム装甲) */}
        <path d="M 188,140 C 182,160 178,185 172,225 L 218,220 C 222,180 225,160 222,140 Z" fill={`url(#${legGradId})`} />

        {/* 膝関節 (横長カプセル型ジョイント) */}
        <rect x="188" y="112" width="44" height="28" rx="14" ry="14" fill={`url(#${jointGradId})`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="210" cy="126" r="6" fill="#ffffff" stroke={outerStroke} strokeWidth="3" />
        <circle cx="210" cy="126" r="3" fill={`url(#${cyanGlowId})`} stroke="none" />

        {/* 足元 (丸みのある台形シューズ) */}
        <path d="M 172,220 L 232,225 C 238,226 242,238 245,250 L 248,272 H 178 C 168,272 162,260 164,248 Z" fill={`url(#${footGradId})`} />
        {/* 底面発光インジケーター */}
        <path d="M 172,265 H 242 V 268 H 172 Z" fill={`url(#${cyanGlowId})`} stroke="none" />

      </g>
    </svg>
  );
};


export const LegsStar2_2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const legGradId = `leg-grad-${uid}`;
  const footGradId = `foot-grad-${uid}`;
  const jointGradId = `joint-grad-${uid}`;
  const cyanGlowId = `cyan-glow-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const legColor0 = isBlueOrWater ? '#6bb3f8' : (pal.armor0 || '#6bb3f8');
  const legColor100 = isBlueOrWater ? '#3b81eb' : (pal.armor100 || '#3b81eb');

  const glowColor0 = isBlueOrWater ? '#73f7ff' : (pal.glow0 || '#73f7ff');
  const glowColor100 = isBlueOrWater ? '#2bd3f7' : (pal.glow100 || '#2bd3f7');

  const outerStroke = isBlueOrWater ? '#121e36' : (pal.stroke || '#121e36');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        {/* 脚部装甲グラデーション (青) */}
        <linearGradient id={legGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={legColor0} />
          <stop offset="100%" stopColor={legColor100} />
        </linearGradient>

        {/* 足元シューズグラデーション (シルバー) */}
        <linearGradient id={footGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cadcf0" />
        </linearGradient>

        {/* 膝ジョイントグラデーション (ライトグレー) */}
        <linearGradient id={jointGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eaf3fc" />
          <stop offset="100%" stopColor="#b8cee6" />
        </linearGradient>

        {/* 発光部グラデーション (シアン) */}
        <linearGradient id={cyanGlowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={glowColor0} />
          <stop offset="100%" stopColor={glowColor100} />
        </linearGradient>
      </defs>

      {/* 全体太ストローク・グループ */}
      <g stroke={outerStroke} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">

        {/* ================= 左脚 (LEFT LEG) ================= */}
        {/* 太もも (上部装甲) */}
        <path d="M 60,35 H 120 V 120 H 60 Z" fill={`url(#${legGradId})`} />

        {/* すね (下部台形装甲) */}
        <path d="M 68,140 L 112,140 L 120,230 H 60 Z" fill={`url(#${legGradId})`} />

        {/* 膝関節 (丸型ジョイント) */}
        <circle cx="90" cy="130" r="22" fill={`url(#${jointGradId})`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="90" cy="130" r="10" fill="#ffffff" stroke={outerStroke} strokeWidth="4" />
        <circle cx="90" cy="130" r="5" fill={`url(#${cyanGlowId})`} stroke="none" />

        {/* 足元 (シューズ/フットパーツ) */}
        <path d="M 52,240 L 110,240 C 128,240 135,255 125,270 L 120,278 H 52 C 45,278 45,270 52,260 Z" fill={`url(#${footGradId})`} />
        {/* 足元ライン / 発光インジケーター */}
        <path d="M 68,252 H 110 L 115,266 H 68 Z" fill={`url(#${cyanGlowId})`} stroke="none" />


        {/* ================= 右脚 (RIGHT LEG) ================= */}
        {/* 太もも (上部装甲) */}
        <path d="M 180,35 H 240 V 120 H 180 Z" fill={`url(#${legGradId})`} />

        {/* すね (下部台形装甲) */}
        <path d="M 188,140 L 232,140 L 240,230 H 180 Z" fill={`url(#${legGradId})`} />

        {/* 膝関節 (丸型ジョイント) */}
        <circle cx="210" cy="130" r="22" fill={`url(#${jointGradId})`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="210" cy="130" r="10" fill="#ffffff" stroke={outerStroke} strokeWidth="4" />
        <circle cx="210" cy="130" r="5" fill={`url(#${cyanGlowId})`} stroke="none" />

        {/* 足元 (シューズ/フットパーツ) */}
        <path d="M 180,240 L 238,240 C 255,240 255,248 248,260 L 248,278 H 180 C 165,278 165,265 170,255 Z" fill={`url(#${footGradId})`} />
        {/* 足元ライン / 発光インジケーター */}
        <path d="M 190,252 H 232 L 232,266 H 195 Z" fill={`url(#${cyanGlowId})`} stroke="none" />

      </g>
    </svg>
  );
};


export const LegsStar2_3SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = `leg3-armor-${uid}`;
  const silverGradId = `leg3-silver-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#a2e1ff' : (pal.armor0 || '#a2e1ff');
  const armorColor100 = isBlueOrWater ? '#467bd2' : (pal.armor100 || '#467bd2');

  const silverColor0 = '#ffffff';
  const silverColor100 = isBlueOrWater ? '#b4c1ce' : (pal.white || '#b4c1ce');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        <linearGradient id={armorGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={armorColor0} />
          <stop offset="1" stopColor={armorColor100} />
        </linearGradient>
        <linearGradient id={silverGradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={silverColor0} />
          <stop offset="1" stopColor={silverColor100} />
        </linearGradient>
      </defs>
      <g transform="translate(-60, 0)">
        {/* LEFT LEG */}
        <path d="M72 35Q72 25 83 25H137Q148 25 148 35V92Q148 103 137 108H83Q72 103 72 92Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="88" y="42" width="44" height="38" rx="13" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="6"/>
        <circle cx="110" cy="61" r="8" fill={glowColor}/>
        <path d="M84 106H136L145 129L133 147H87L75 129Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M87 143H133L141 214Q142 226 131 232H89Q78 226 79 214Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M96 154H124L129 203H91Z" fill={`url(#${armorGradId})`}/>
        <path d="M78 211H132L151 230Q159 239 151 250L144 258H69Q59 253 64 242L72 220Q74 214 78 211Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M76 239H148L143 249H71Z" fill={glowColor}/>

        {/* RIGHT LEG */}
        <path d="M272 35Q272 25 283 25H337Q348 25 348 35V92Q348 103 337 108H283Q272 103 272 92Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="288" y="42" width="44" height="38" rx="13" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="6"/>
        <circle cx="310" cy="61" r="8" fill={glowColor}/>
        <path d="M284 106H336L345 129L333 147H287L275 129Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M287 143H333L341 214Q342 226 331 232H289Q278 226 279 214Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M296 154H324L329 203H291Z" fill={`url(#${armorGradId})`}/>
        <path d="M278 211H332L348 220Q356 230 356 242Q361 253 351 258H276L269 250Q261 239 269 230Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M272 249H348L344 258H277Z" fill={glowColor}/>

        <circle cx="110" cy="61" r="3" fill="#fff"/>
        <circle cx="310" cy="61" r="3" fill="#fff"/>
      </g>
    </svg>
  );
};


export const LegsStar2_4SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = `leg4-armor-${uid}`;
  const silverGradId = `leg4-silver-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#b0e7ff' : (pal.armor0 || '#b0e7ff');
  const armorColor100 = isBlueOrWater ? '#4779cf' : (pal.armor100 || '#4779cf');

  const silverColor0 = '#ffffff';
  const silverColor100 = isBlueOrWater ? '#b9c6d3' : (pal.white || '#b9c6d3');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');
  const darkBgColor = isBlueOrWater ? '#17304f' : (pal.dark || '#17304f');
  const accentColor = isBlueOrWater ? '#4779cf' : (pal.armor100 || '#4779cf');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        <linearGradient id={armorGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={armorColor0} />
          <stop offset="1" stopColor={armorColor100} />
        </linearGradient>
        <linearGradient id={silverGradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={silverColor0} />
          <stop offset="1" stopColor={silverColor100} />
        </linearGradient>
      </defs>
      <g transform="translate(-60, 0)">
        {/* LEFT LEG */}
        <path d="M72 32Q72 22 82 22H138Q148 22 148 32V105Q148 116 137 120H83Q72 116 72 105Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M84 45H136V96Q136 105 128 108H92Q84 105 84 96Z" fill={darkBgColor} stroke={outerStroke} strokeWidth="6"/>
        <rect x="98" y="57" width="24" height="26" rx="8" fill={glowColor}/>

        {/* left knee */}
        <path d="M78 119H142L150 139L137 157H83L70 139Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="110" cy="138" r="9" fill={glowColor}/>

        {/* left shin */}
        <path d="M84 154H136L131 222Q130 232 120 236H100Q90 232 89 222Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M98 164H122L119 210H101Z" fill={glowColor}/>

        {/* left flat foot */}
        <path d="M83 218H126L153 235Q161 242 155 251Q151 258 141 258H67Q58 253 64 243L74 224Q77 219 83 218Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="78" y="239" width="64" height="9" rx="4" fill={accentColor}/>

        {/* RIGHT LEG */}
        <path d="M272 32Q272 22 282 22H338Q348 22 348 32V105Q348 116 337 120H283Q272 116 272 105Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M284 45H336V96Q336 105 328 108H292Q284 105 284 96Z" fill={darkBgColor} stroke={outerStroke} strokeWidth="6"/>
        <rect x="298" y="57" width="24" height="26" rx="8" fill={glowColor}/>

        {/* right knee */}
        <path d="M278 119H342L350 139L337 157H283L270 139Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="310" cy="138" r="9" fill={glowColor}/>

        {/* right shin */}
        <path d="M284 154H336L331 222Q330 232 320 236H300Q290 232 289 222Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M298 164H322L319 210H301Z" fill={glowColor}/>

        {/* right flat foot */}
        <path d="M294 218H337Q343 219 346 224L356 243Q362 253 353 258H279Q269 258 265 251Q259 242 267 235L294 218Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="278" y="239" width="64" height="9" rx="4" fill={accentColor}/>
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
  2: [BodyStar2SVG, BodyStar2_2SVG],
  3: []
};
export const ArmsStar2_2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = `arm2-armor-${uid}`;
  const silverGradId = `arm2-silver-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#83ceff' : (pal.armor0 || '#83ceff');
  const armorColor100 = isBlueOrWater ? '#3974d0' : (pal.armor100 || '#3974d0');

  const silverColor0 = '#f4f8fc';
  const silverColor100 = isBlueOrWater ? '#aebdcd' : (pal.white || '#aebdcd');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        <linearGradient id={armorGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={armorColor0} />
          <stop offset="1" stopColor={armorColor100} />
        </linearGradient>
        <linearGradient id={silverGradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={silverColor0} />
          <stop offset="1" stopColor={silverColor100} />
        </linearGradient>
      </defs>
      <g transform="translate(-30, 10)">
        {/* LEFT ARM */}
        <path d="M92 48Q76 42 68 56L54 91Q49 105 62 116L91 140L111 116L86 94L101 67Q107 53 92 48Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="79" cy="112" r="25" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="79" cy="112" r="9" fill={glowColor}/>
        <path d="M64 130L91 137L106 176L78 187L57 148Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="181" r="21" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="181" r="7" fill={glowColor}/>
        <path d="M97 196L123 188L145 211L128 218L103 214Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <path d="M125 204L143 207L151 215L137 218L122 214Z"
              fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="6"/>

        {/* RIGHT ARM */}
        <path d="M268 48Q284 42 292 56L306 91Q311 105 298 116L269 140L249 116L274 94L259 67Q253 53 268 48Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="281" cy="112" r="25" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="281" cy="112" r="9" fill={glowColor}/>
        <path d="M296 130L269 137L254 176L282 187L303 148Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="181" r="21" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="181" r="7" fill={glowColor}/>
        <path d="M263 196L237 188L215 211L232 218L257 214Z"
              fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <path d="M235 204L217 207L209 215L223 218L238 214Z"
              fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="6"/>
      </g>
    </svg>
  );
};


export const ArmsStar2_3SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = `arm3-armor-${uid}`;
  const silverGradId = `arm3-silver-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#8ed5ff' : (pal.armor0 || '#8ed5ff');
  const armorColor100 = isBlueOrWater ? '#4a82d8' : (pal.armor100 || '#4a82d8');

  const silverColor0 = '#f5f9fc';
  const silverColor100 = isBlueOrWater ? '#b7c5d3' : (pal.white || '#b7c5d3');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        <linearGradient id={armorGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={armorColor0} />
          <stop offset="1" stopColor={armorColor100} />
        </linearGradient>
        <linearGradient id={silverGradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={silverColor0} />
          <stop offset="1" stopColor={silverColor100} />
        </linearGradient>
      </defs>
      <g transform="translate(-30, 10)">
        {/* LEFT ARM */}
        <rect x="38" y="48" width="54" height="48" rx="20" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="65" cy="72" r="10" fill={glowColor}/>
        <path d="M55 92H86L105 145L76 155L51 112Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="91" cy="151" r="20" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="151" r="7" fill={glowColor}/>
        <path d="M97 168L124 159L145 199L123 213L101 193Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M122 197L143 196L153 207L139 219L119 211Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>

        {/* RIGHT ARM */}
        <rect x="268" y="48" width="54" height="48" rx="20" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="295" cy="72" r="10" fill={glowColor}/>
        <path d="M305 92H274L255 145L284 155L309 112Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="269" cy="151" r="20" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="151" r="7" fill={glowColor}/>
        <path d="M263 168L236 159L215 199L237 213L259 193Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M238 197L217 196L207 207L221 219L241 211Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="7"/>
      </g>
    </svg>
  );
};


export const ArmsStar2_4SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = `arm4-armor-${uid}`;
  const silverGradId = `arm4-silver-${uid}`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#9adfff' : (pal.armor0 || '#9adfff');
  const armorColor100 = isBlueOrWater ? '#3f78d0' : (pal.armor100 || '#3f78d0');

  const silverColor0 = '#ffffff';
  const silverColor100 = isBlueOrWater ? '#aab9c9' : (pal.white || '#aab9c9');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');
  const darkStroke = isBlueOrWater ? '#31557e' : (pal.dark || '#31557e');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        <linearGradient id={armorGradId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={armorColor0} />
          <stop offset="1" stopColor={armorColor100} />
        </linearGradient>
        <linearGradient id={silverGradId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={silverColor0} />
          <stop offset="1" stopColor={silverColor100} />
        </linearGradient>
      </defs>
      <g transform="translate(-60, 20)">
        {/* LEFT ARM */}
        <path d="M86 45Q69 45 64 61L52 100Q48 115 61 125L91 148L113 120L84 99L99 68Q105 48 86 45Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <circle cx="77" cy="118" r="27" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="77" cy="118" r="10" fill={glowColor} stroke={darkStroke} strokeWidth="4"/>
        <path d="M91 139L116 128L143 171L132 210L99 203L86 164Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="104" y="181" width="44" height="42" rx="17" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8" transform="rotate(-8 126 202)"/>
        <circle cx="126" cy="202" r="8" fill={glowColor}/>
        <path d="M119 215Q126 207 136 212L157 225Q166 231 160 240L153 249Q148 255 140 250L112 235Q105 229 110 222Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="145" cy="231" r="5" fill={glowColor}/>

        {/* RIGHT ARM */}
        <path d="M334 45Q351 45 356 61L368 100Q372 115 359 125L329 148L307 120L336 99L321 68Q315 48 334 45Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <circle cx="343" cy="118" r="27" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="343" cy="118" r="10" fill={glowColor} stroke={darkStroke} strokeWidth="4"/>
        <path d="M329 139L304 128L277 171L288 210L321 203L334 164Z" fill={`url(#${armorGradId})`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="272" y="181" width="44" height="42" rx="17" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8" transform="rotate(8 294 202)"/>
        <circle cx="294" cy="202" r="8" fill={glowColor}/>
        <path d="M301 215Q294 207 284 212L263 225Q254 231 260 240L267 249Q272 255 280 250L308 235Q315 229 310 222Z" fill={`url(#${silverGradId})`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="275" cy="231" r="5" fill={glowColor}/>
      </g>
    </svg>
  );
};

export const SVG_ARMS: Record<number, React.FC<SVGProps>[]> = {
  1: [ArmsBasicSVG, ArmsClawSVG, ArmsCannonSVG, ArmsDrillSVG, ArmsBladeSVG, ArmsWhipSVG, ArmsShieldSVG, ArmsMultiSVG],
  2: [ArmsStar2SVG, ArmsStar2_2SVG, ArmsStar2_3SVG, ArmsStar2_4SVG],
  3: []
};


export const SVG_LEGS: Record<number, React.FC<SVGProps>[]> = {
  1: [LegsBasicSVG, LegsTreadsSVG, LegsHoverSVG, LegsSpiderSVG, LegsWheelSVG, LegsSpringSVG, LegsPegSVG, LegsJetSVG],
  2: [LegsStar2SVG, LegsStar2_2SVG, LegsStar2_3SVG, LegsStar2_4SVG],
  3: []
};
