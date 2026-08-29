const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newHead = `
export const HeadStar2SVG = ({ color, viewBox="0 0 32 32", className }: SVGProps) => (
<svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges">
  <path fill="#1a1d24" d="M 11,2 h 10 v 1 h 3 v 1 h 2 v 2 h 1 v 1 h -1 v 3 h 2 v 1 h 1 v 5 h -1 v 1 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -8 v -1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -1 h -1 v -5 h 1 v -1 h 2 v -3 h -1 v -1 h 1 v -2 h 2 v -1 h 3 Z" />
  <path fill="#101520" d="M 12,3 h 8 v 1 h 3 v 1 h 2 v 2 h 1 v 1 h -2 v 3 h 1 v 6 h -1 v 2 h -1 v 2 h -1 v 1 h -1 v 1 h -1 v 1 h -1 v 1 h -6 v -1 h -1 v -1 h -1 v -1 h -1 v -1 h -1 v -2 h -1 v -2 h -1 v -6 h 1 v -3 h -2 v -1 h 1 v -2 h 2 v -1 h 3 Z" />
  <path fill="#1d61d1" d="M 12,4 h 8 v 1 h 3 v 1 h 2 v 2 h -1 v 1 h -18 v -1 h -1 v -2 h 2 v -1 h 3 Z" />
  <rect x="14" y="3" width="4" height="1" fill="#388eff" />
  <rect x="9" y="6" width="2" height="1" fill="#e8f4ff" />
  <path fill="#388eff" d="M 3,6 h 1 v 2 h -1 Z M 28,6 h 1 v 2 h -1 Z" />
  <path fill="#388eff" d="M 4,14 h 4 v 6 h -4 Z M 24,14 h 4 v 6 h -4 Z" />
  <rect x="6" y="16" width="1" height="2" fill="#e8f4ff" />
  <rect x="25" y="16" width="1" height="2" fill="#e8f4ff" />
  <rect x="7" y="9" width="2" height="1" fill="#8a96a8" />
  <rect x="23" y="9" width="2" height="1" fill="#8a96a8" />
  <rect x="7" y="21" width="2" height="1" fill="#8a96a8" />
  <rect x="23" y="21" width="2" height="1" fill="#8a96a8" />
  <path fill="#101520" d="M 8,12 h 16 v 8 h -16 Z" />
  <rect x="9" y="15" width="4" height="3" fill="#1d61d1" />
  <rect x="10" y="16" width="2" height="1" fill="#e8f4ff" />
  <rect x="19" y="15" width="4" height="3" fill="#1d61d1" />
  <rect x="20" y="16" width="2" height="1" fill="#e8f4ff" />
  <rect x="15" y="14" width="2" height="4" fill="#1d61d1" />
  <rect x="15" y="15" width="2" height="2" fill="#e8f4ff" />
  <path fill="#1d61d1" d="M 10,22 h 12 v 1 h -1 v 1 h -1 v 1 h -8 v -1 h -1 v -1 h -1 Z" />
  <rect x="13" y="23" width="6" height="1" fill="#388eff" />
</svg>
);
`;

content = content.replace(/export const SVG_HEADS = \[\s*HeadBasicSVG[^\]]+\];/, '');
content = content.replace(/export const SVG_BODIES = \[\s*BodyBasicSVG[^\]]+\];/, '');
content = content.replace(/export const SVG_ARMS = \[\s*ArmsBasicSVG[^\]]+\];/, '');
content = content.replace(/export const SVG_LEGS = \[\s*LegsBasicSVG[^\]]+\];/, '');

content += newHead;

content += `
export const SVG_HEADS: Record<number, React.FC<SVGProps>[]> = {
  1: [HeadBasicSVG, HeadRoundSVG, HeadTVSVG, HeadHornSVG, HeadCylinderSVG, HeadVisorSVG, HeadTriangleSVG, HeadDomeSVG],
  2: [HeadStar2SVG],
  3: []
};
export const SVG_BODIES: Record<number, React.FC<SVGProps>[]> = {
  1: [BodyBasicSVG, BodyRoundSVG, BodyHeavySVG, BodyBarrelSVG, BodySlimSVG, BodyFurnaceSVG, BodyDiamondSVG, BodyEngineSVG],
  2: [],
  3: []
};
export const SVG_ARMS: Record<number, React.FC<SVGProps>[]> = {
  1: [ArmsBasicSVG, ArmsClawSVG, ArmsCannonSVG, ArmsDrillSVG, ArmsBladeSVG, ArmsWhipSVG, ArmsShieldSVG, ArmsMultiSVG],
  2: [],
  3: []
};
export const SVG_LEGS: Record<number, React.FC<SVGProps>[]> = {
  1: [LegsBasicSVG, LegsTreadsSVG, LegsHoverSVG, LegsSpiderSVG, LegsWheelSVG, LegsSpringSVG, LegsPegSVG, LegsJetSVG],
  2: [],
  3: []
};
`;

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
