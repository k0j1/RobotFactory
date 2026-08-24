import React from 'react';

export interface SVGProps { color: string; viewBox?: string; className?: string; }

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
  <svg width="100%" height="100%" viewBox={viewBox} className={className}>
    <circle cx="50" cy="55" r="22" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="55" r="12" fill="#fff" opacity="0.3" />
    <circle cx="50" cy="55" r="5" fill="#fff" stroke="#333" strokeWidth="2" />
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
    <rect x="46" y="70" width="8" height="12" fill={color} stroke="#333" strokeWidth="2" />
    <circle cx="50" cy="85" r="12" fill="#222" stroke="#444" strokeWidth="3" />
    <circle cx="50" cy="85" r="4" fill={color} stroke="#333" strokeWidth="2" />
    <line x1="50" y1="73" x2="50" y2="97" stroke="#555" strokeWidth="1" />
    <line x1="38" y1="85" x2="62" y2="85" stroke="#555" strokeWidth="1" />
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

export const SVG_HEADS = [
  HeadBasicSVG, HeadRoundSVG, HeadTVSVG, HeadHornSVG, 
  HeadCylinderSVG, HeadVisorSVG, HeadTriangleSVG, HeadDomeSVG
];
export const SVG_BODIES = [
  BodyBasicSVG, BodyRoundSVG, BodyHeavySVG, BodyBarrelSVG, 
  BodySlimSVG, BodyFurnaceSVG, BodyDiamondSVG, BodyEngineSVG
];
export const SVG_ARMS = [
  ArmsBasicSVG, ArmsClawSVG, ArmsCannonSVG, ArmsDrillSVG, 
  ArmsBladeSVG, ArmsWhipSVG, ArmsShieldSVG, ArmsMultiSVG
];
export const SVG_LEGS = [
  LegsBasicSVG, LegsTreadsSVG, LegsHoverSVG, LegsSpiderSVG, 
  LegsWheelSVG, LegsSpringSVG, LegsPegSVG, LegsJetSVG
];
