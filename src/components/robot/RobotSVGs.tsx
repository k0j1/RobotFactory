import React from 'react';

// === HEAD SVGs (8 patterns) ===

export const HeadBasicSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M25 40 L75 40 L75 90 L25 90 Z" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="35" cy="65" r="8" fill="#fff" /><circle cx="35" cy="65" r="3" fill="#000" />
    <circle cx="65" cy="65" r="8" fill="#fff" /><circle cx="65" cy="65" r="3" fill="#000" />
    <rect x="45" y="10" width="10" height="30" fill="#999" stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="10" r="6" fill="#ef4444" />
  </svg>
);

export const HeadRoundSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <circle cx="50" cy="60" r="35" fill={color} stroke="#333" strokeWidth="4" />
    <rect x="25" y="45" width="50" height="20" rx="10" fill="#222" />
    <circle cx="50" cy="55" r="6" fill="#0ff" />
  </svg>
);

export const HeadTVSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="15" y="30" width="70" height="60" rx="10" fill={color} stroke="#333" strokeWidth="4" />
    <rect x="25" y="40" width="50" height="40" rx="5" fill="#e0f2fe" stroke="#333" strokeWidth="4" />
    <path d="M30 10 L50 30 L70 10" fill="none" stroke="#333" strokeWidth="4" />
    <circle cx="40" cy="60" r="4" fill="#0284c7" />
    <circle cx="60" cy="60" r="4" fill="#0284c7" />
    <path d="M45 70 Q 50 75 55 70" fill="none" stroke="#0284c7" strokeWidth="3" />
  </svg>
);

export const HeadHornSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 40 L70 40 L80 90 L20 90 Z" fill={color} stroke="#333" strokeWidth="4" />
    <path d="M20 50 Q 5 30 15 15 Q 25 30 30 40" fill="#facc15" stroke="#333" strokeWidth="3" />
    <path d="M80 50 Q 95 30 85 15 Q 75 30 70 40" fill="#facc15" stroke="#333" strokeWidth="3" />
    <line x1="35" y1="65" x2="65" y2="65" stroke="#333" strokeWidth="4" />
    <line x1="40" y1="75" x2="60" y2="75" stroke="#333" strokeWidth="4" />
  </svg>
);

export const HeadCylinderSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="30" y="20" width="40" height="70" rx="20" fill={color} stroke="#333" strokeWidth="4" />
    <rect x="35" y="40" width="30" height="15" fill="#fff" stroke="#333" strokeWidth="3" />
    <line x1="30" y1="70" x2="70" y2="70" stroke="#333" strokeWidth="4" />
    <line x1="30" y1="80" x2="70" y2="80" stroke="#333" strokeWidth="4" />
  </svg>
);

export const HeadVisorSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M20 30 L80 30 L90 80 L10 80 Z" fill={color} stroke="#333" strokeWidth="4" />
    <path d="M15 50 L85 50 L80 65 L20 65 Z" fill="#ef4444" stroke="#333" strokeWidth="3" />
  </svg>
);

export const HeadTriangleSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M50 20 L90 90 L10 90 Z" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="50" cy="65" r="12" fill="#fff" stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="65" r="4" fill="#000" />
  </svg>
);

export const HeadDomeSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M20 80 Q 20 20 50 20 Q 80 20 80 80 Z" fill="#e0f2fe" stroke="#333" strokeWidth="4" opacity="0.8" />
    <rect x="15" y="80" width="70" height="15" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="50" cy="60" r="15" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="60" r="5" fill="#facc15" />
  </svg>
);


// === BODY SVGs (8 patterns) ===

export const BodyBasicSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="20" y="10" width="60" height="80" rx="10" fill={color} stroke="#333" strokeWidth="4" />
    <rect x="35" y="25" width="30" height="20" fill="#fff" opacity="0.8" stroke="#333" strokeWidth="3" />
    <line x1="20" y1="60" x2="80" y2="60" stroke="#333" strokeWidth="4" />
  </svg>
);

export const BodyRoundSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="50" cy="50" r="25" fill="#fff" opacity="0.3" />
    <circle cx="50" cy="50" r="10" fill="#fff" stroke="#333" strokeWidth="3" />
  </svg>
);

export const BodyHeavySVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M25 10 L75 10 L95 90 L5 90 Z" fill={color} stroke="#333" strokeWidth="4" />
    <rect x="40" y="30" width="20" height="40" fill="#222" stroke="#333" strokeWidth="2" />
  </svg>
);

export const BodyBarrelSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="25" y="10" width="50" height="80" rx="20" fill={color} stroke="#333" strokeWidth="4" />
    <line x1="25" y1="30" x2="75" y2="30" stroke="#333" strokeWidth="4" />
    <line x1="25" y1="50" x2="75" y2="50" stroke="#333" strokeWidth="4" />
    <line x1="25" y1="70" x2="75" y2="70" stroke="#333" strokeWidth="4" />
  </svg>
);

export const BodySlimSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M20 10 L80 10 L60 50 L80 90 L20 90 L40 50 Z" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="50" cy="50" r="10" fill="#222" />
  </svg>
);

export const BodyFurnaceSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="15" y="15" width="70" height="70" rx="15" fill={color} stroke="#333" strokeWidth="4" />
    <path d="M30 50 Q 50 90 70 50 Q 50 30 30 50" fill="#f97316" stroke="#333" strokeWidth="3" />
    <path d="M40 55 Q 50 80 60 55 Q 50 45 40 55" fill="#fef08a" />
  </svg>
);

export const BodyDiamondSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M50 5 L90 50 L50 95 L10 50 Z" fill={color} stroke="#333" strokeWidth="4" />
    <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="#fff" opacity="0.5" stroke="#333" strokeWidth="2" />
  </svg>
);

export const BodyEngineSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="20" y="20" width="60" height="60" fill={color} stroke="#333" strokeWidth="4" />
    <circle cx="35" cy="35" r="10" fill="#64748b" stroke="#333" strokeWidth="3" />
    <circle cx="65" cy="35" r="10" fill="#64748b" stroke="#333" strokeWidth="3" />
    <circle cx="35" cy="65" r="10" fill="#64748b" stroke="#333" strokeWidth="3" />
    <circle cx="65" cy="65" r="10" fill="#64748b" stroke="#333" strokeWidth="3" />
  </svg>
);


// === ARMS SVGs (8 patterns) ===

export const ArmsBasicSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M25 20 L10 60 L20 65 L35 30 Z" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="15" cy="65" r="10" fill="#666" stroke="#333" strokeWidth="2" />
    <path d="M75 20 L90 60 L80 65 L65 30 Z" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="85" cy="65" r="10" fill="#666" stroke="#333" strokeWidth="2" />
  </svg>
);

export const ArmsClawSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 30 Q 15 50 20 75" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
    <path d="M70 30 Q 85 50 80 75" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
    <path d="M15 75 L 5 90 M 25 75 L 35 90" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    <path d="M85 75 L 95 90 M 75 75 L 65 90" stroke="#333" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const ArmsCannonSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="10" y="30" width="16" height="40" rx="4" fill={color} stroke="#333" strokeWidth="3" transform="rotate(15 18 50)" />
    <rect x="12" y="70" width="12" height="15" fill="#222" transform="rotate(15 18 50)" />
    <rect x="74" y="30" width="16" height="40" rx="4" fill={color} stroke="#333" strokeWidth="3" transform="rotate(-15 82 50)" />
    <rect x="76" y="70" width="12" height="15" fill="#222" transform="rotate(-15 82 50)" />
  </svg>
);

export const ArmsDrillSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M25 25 L15 50 L30 50 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M15 50 L22 90 L30 50 Z" fill="#94a3b8" stroke="#333" strokeWidth="3" />
    <path d="M75 25 L85 50 L70 50 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M85 50 L78 90 L70 50 Z" fill="#94a3b8" stroke="#333" strokeWidth="3" />
  </svg>
);

export const ArmsBladeSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 20 L20 40 L25 45 L35 25 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M20 40 L5 95 L25 45 Z" fill="#cbd5e1" stroke="#333" strokeWidth="3" />
    <path d="M70 20 L80 40 L75 45 L65 25 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M80 40 L95 95 L75 45 Z" fill="#cbd5e1" stroke="#333" strokeWidth="3" />
  </svg>
);

export const ArmsWhipSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 25 Q 5 40 20 60 T 5 90" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
    <path d="M70 25 Q 95 40 80 60 T 95 90" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const ArmsShieldSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 20 L15 35 L15 65 L30 80 L35 50 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M70 20 L85 35 L85 65 L70 80 L65 50 Z" fill={color} stroke="#333" strokeWidth="3" />
  </svg>
);

export const ArmsMultiSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 30 L10 40" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M30 50 L10 60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M70 30 L90 40" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    <path d="M70 50 L90 60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
  </svg>
);


// === LEGS SVGs (8 patterns) ===

export const LegsBasicSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="30" y="10" width="12" height="50" rx="4" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M20 60 L45 60 L40 80 L25 80 Z" fill="#555" stroke="#333" strokeWidth="3" />
    <rect x="58" y="10" width="12" height="50" rx="4" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M55 60 L80 60 L75 80 L60 80 Z" fill="#555" stroke="#333" strokeWidth="3" />
  </svg>
);

export const LegsTreadsSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="15" y="40" width="70" height="40" rx="20" fill="#444" stroke="#222" strokeWidth="4" />
    <circle cx="30" cy="60" r="10" fill={color} stroke="#222" strokeWidth="2" />
    <circle cx="50" cy="60" r="10" fill={color} stroke="#222" strokeWidth="2" />
    <circle cx="70" cy="60" r="10" fill={color} stroke="#222" strokeWidth="2" />
    <rect x="40" y="10" width="20" height="30" fill={color} stroke="#333" strokeWidth="3" />
  </svg>
);

export const LegsHoverSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M35 10 L65 10 L55 50 L45 50 Z" fill={color} stroke="#333" strokeWidth="4" />
    <ellipse cx="50" cy="60" rx="40" ry="15" fill="#333" stroke="#222" strokeWidth="4" />
    <ellipse cx="50" cy="65" rx="30" ry="8" fill="#0ff" opacity="0.7" />
  </svg>
);

export const LegsSpiderSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M40 20 L20 40 L10 80" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 20 L80 40 L90 80" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M45 20 L35 50 L30 90" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M55 20 L65 50 L70 90" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LegsWheelSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <rect x="45" y="10" width="10" height="40" fill={color} stroke="#333" strokeWidth="3" />
    <circle cx="50" cy="60" r="30" fill="#222" stroke="#444" strokeWidth="6" />
    <circle cx="50" cy="60" r="10" fill={color} stroke="#333" strokeWidth="3" />
    <line x1="50" y1="30" x2="50" y2="90" stroke="#555" strokeWidth="2" />
    <line x1="20" y1="60" x2="80" y2="60" stroke="#555" strokeWidth="2" />
  </svg>
);

export const LegsSpringSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M35 10 L25 30 L45 50 L25 70 L35 90" fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" />
    <path d="M65 10 L55 30 L75 50 L55 70 L65 90" fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" />
    <rect x="25" y="90" width="20" height="5" fill="#333" />
    <rect x="55" y="90" width="20" height="5" fill="#333" />
  </svg>
);

export const LegsPegSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M35 10 L40 40 L35 90 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M65 10 L60 40 L65 90 Z" fill={color} stroke="#333" strokeWidth="3" />
  </svg>
);

export const LegsJetSVG = ({ color }: { color: string }) => (
  <svg width="100%" height="100%" viewBox="0 0 100 100">
    <path d="M30 10 L70 10 L60 40 L40 40 Z" fill={color} stroke="#333" strokeWidth="3" />
    <path d="M45 40 L55 40 L60 80 L50 95 L40 80 Z" fill="#f97316" stroke="#fef08a" strokeWidth="2" />
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
