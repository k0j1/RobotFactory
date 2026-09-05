const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const head4 = `
export const HeadStar2_4SVG = ({ color, viewBox = "0 0 64 64", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* Heavy helmet */}
      <path d="M10 16 L20 8 H44 L54 16 V50 H46 V54 H18 V50 H10 Z" fill={pal.out}/>
      <path d="M12 18 L21 10 H43 L52 18 V48 H44 V52 H20 V48 H12 Z" fill={pal.dark}/>
      
      {/* Top crown armor */}
      <path d="M16 18 L24 12 H40 L48 18 V28 H16 Z" fill={pal.base}/>
      <path d="M20 18 L26 14 H38 L44 18 V22 H20 Z" fill={pal.light}/>

      {/* Heavy Face Mask */}
      <path d="M14 30 H50 V46 L42 50 H22 L14 46 Z" fill={pal.out}/>
      <path d="M16 32 H48 V44 L41 48 H23 L16 44 Z" fill={pal.base}/>
      
      {/* Visor Area */}
      <path d="M16 26 H48 V34 H16 Z" fill={pal.out}/>
      <path d="M18 28 H46 V32 H18 Z" fill={pal.dark0}/>
      <path d="M20 28 L24 32 H40 L44 28 Z" fill={pal.dark100}/>
      <rect x="26" y="29" width="12" height="2" fill={pal.glow100}/>

      {/* Respirator / Glowing Grille */}
      <rect x="26" y="38" width="12" height="8" fill={pal.dark0}/>
      <rect x="28" y="40" width="2" height="4" fill={pal.glow60}/>
      <rect x="34" y="40" width="2" height="4" fill={pal.glow60}/>

      {/* Side Armor */}
      <rect x="6" y="24" width="8" height="16" fill={pal.out}/>
      <rect x="8" y="26" width="4" height="12" fill={pal.solidAccent}/>
      <rect x="50" y="24" width="8" height="16" fill={pal.out}/>
      <rect x="52" y="26" width="4" height="12" fill={pal.solidAccent}/>

      {/* Bolts */}
      <rect x="18" y="22" width="2" height="2" fill={pal.gray}/>
      <rect x="44" y="22" width="2" height="2" fill={pal.gray}/>
    </svg>
  );
};
`;

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('export const SVG_HEADS:'));
lines.splice(insertIndex, 0, head4);

let newContent = lines.join('\n');
newContent = newContent.replace(
  '2: [HeadStar2SVG, HeadStar2_2SVG, HeadStar2_3SVG],',
  '2: [HeadStar2SVG, HeadStar2_2SVG, HeadStar2_3SVG, HeadStar2_4SVG],'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', newContent);

let ency = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ency = ency.replace(
  "{ id: 'h2_1', type: 'head', rarity: 2, visualIndex: 1, name: 'バイザーIIヘッド' },",
  "{ id: 'h2_1', type: 'head', rarity: 2, visualIndex: 1, name: 'センサーヘッド', isNew: true },"
);
ency = ency.replace(
  "{ id: 'h2_2', type: 'head', rarity: 2, visualIndex: 2, name: 'アンテナヘッド' },",
  "{ id: 'h2_2', type: 'head', rarity: 2, visualIndex: 2, name: 'コマンドヘッド', isNew: true },"
);
ency = ency.replace(
  "{ id: 'h2_3', type: 'head', rarity: 2, visualIndex: 3, name: 'バトルヘッド' },",
  "{ id: 'h2_3', type: 'head', rarity: 2, visualIndex: 3, name: 'バトルヘッド', isNew: true },"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ency);
