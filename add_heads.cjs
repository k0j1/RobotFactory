const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponents = `
export const HeadStar2_2SVG = ({ color, viewBox = "0 0 64 64", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* outer helmet base */}
      <path d="M20 10 L26 4 H38 L44 10 L48 20 V44 L42 52 H22 L16 44 V20 Z" fill={pal.out}/>
      <path d="M22 12 L27 7 H37 L42 12 L45 21 V42 L40 49 H24 L19 42 V21 Z" fill={pal.dark}/>
      
      {/* upper crown */}
      <path d="M22 12 L27 7 H37 L42 12 L44 18 H20 Z" fill={pal.base}/>
      <path d="M24 13 L28 9 H36 L40 13 V16 H24 Z" fill={pal.light}/>
      
      {/* Sensor Horn */}
      <path d="M30 2 L34 2 V8 H30 Z" fill={pal.out}/>
      <rect x="31" y="3" width="2" height="4" fill={pal.glow60}/>

      {/* Main Face Plate */}
      <path d="M19 22 H45 V34 H19 Z" fill={pal.base}/>
      <path d="M21 24 H43 V32 H21 Z" fill={pal.dark0}/>
      <path d="M23 25 H41 V31 H23 Z" fill={pal.dark100}/>
      
      {/* Cyclops Eye */}
      <rect x="29" y="26" width="6" height="4" fill={pal.glow100}/>
      <rect x="30" y="27" width="4" height="2" fill="#FFF"/>

      {/* Lower Jaw */}
      <path d="M19 36 H45 L40 45 H24 Z" fill={pal.light}/>
      <path d="M24 38 H40 L37 43 H27 Z" fill={pal.base}/>
      <rect x="29" y="40" width="6" height="2" fill={pal.dark100}/>

      {/* Left Ear/Cheek */}
      <path d="M10 24 L16 18 V46 L10 40 Z" fill={pal.out}/>
      <path d="M12 25 L15 22 V42 L12 39 Z" fill={pal.gray}/>
      <rect x="13" y="28" width="2" height="8" fill={pal.solidAccent}/>

      {/* Right Ear/Cheek */}
      <path d="M54 24 L48 18 V46 L54 40 Z" fill={pal.out}/>
      <path d="M52 25 L49 22 V42 L52 39 Z" fill={pal.gray}/>
      <rect x="49" y="28" width="2" height="8" fill={pal.solidAccent}/>
      
      {/* Scope / Radar Antenna on right */}
      <path d="M54 14 H60 V26 H54 Z" fill={pal.out}/>
      <rect x="55" y="16" width="4" height="8" fill={pal.dark0}/>
      <rect x="56" y="18" width="2" height="4" fill={pal.glow60}/>
    </svg>
  );
};

export const HeadStar2_3SVG = ({ color, viewBox = "0 0 64 64", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* outer helmet base */}
      <path d="M14 16 L22 8 H42 L50 16 V42 L42 50 H22 L14 42 Z" fill={pal.out}/>
      <path d="M17 18 L23 11 H41 L47 18 V40 L40 47 H24 L17 40 Z" fill={pal.dark}/>
      
      {/* upper head armor */}
      <path d="M17 18 L23 11 H41 L47 18 L44 26 H20 Z" fill={pal.base}/>
      <path d="M20 18 L24 14 H40 L44 18 V22 H20 Z" fill={pal.light}/>

      {/* Side Vents */}
      <path d="M8 26 L16 20 V46 L8 40 Z" fill={pal.out}/>
      <path d="M11 26 L15 23 V43 L11 38 Z" fill={pal.base}/>
      <rect x="12" y="28" width="2" height="8" fill={pal.gray}/>
      
      <path d="M56 26 L48 20 V46 L56 40 Z" fill={pal.out}/>
      <path d="M53 26 L49 23 V43 L53 38 Z" fill={pal.base}/>
      <rect x="50" y="28" width="2" height="8" fill={pal.gray}/>

      {/* Visor Area */}
      <path d="M18 28 L32 34 L46 28 V38 L32 44 L18 38 Z" fill={pal.out}/>
      <path d="M20 30 L32 35 L44 30 V37 L32 42 L20 37 Z" fill={pal.dark0}/>
      
      {/* Glowing Eyes inside Visor */}
      <polygon points="22,31 28,34 26,36 22,34" fill={pal.glow100}/>
      <polygon points="42,31 36,34 38,36 42,34" fill={pal.glow100}/>
      <rect x="23" y="32" width="2" height="2" fill="#FFF"/>
      <rect x="39" y="32" width="2" height="2" fill="#FFF"/>

      {/* Mouth Plate */}
      <path d="M26 40 L32 36 L38 40 L36 46 H28 Z" fill={pal.light}/>
      <path d="M28 41 L32 38 L36 41 V44 H28 Z" fill={pal.base}/>
      <rect x="29" y="42" width="2" height="2" fill={pal.dark100}/>
      <rect x="33" y="42" width="2" height="2" fill={pal.dark100}/>
      <path d="M30 45 H34 V48 H30 Z" fill={pal.out}/>

      {/* V-Fin */}
      <path d="M32 14 L12 2 L26 14 Z" fill={pal.out}/>
      <path d="M30 13 L15 5 L25 13 Z" fill={pal.solidAccent}/>
      <path d="M32 14 L52 2 L38 14 Z" fill={pal.out}/>
      <path d="M34 13 L49 5 L39 13 Z" fill={pal.solidAccent}/>
      <polygon points="29,7 35,7 32,13" fill={pal.glow100}/>
      <polygon points="30,8 34,8 32,11" fill="#FFF"/>

      {/* Bolts */}
      <rect x="18" y="20" width="2" height="2" fill={pal.gray}/>
      <rect x="44" y="20" width="2" height="2" fill={pal.gray}/>
    </svg>
  );
};
`;

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('export const SVG_HEADS:'));
lines.splice(insertIndex, 0, newComponents);

let newContent = lines.join('\n');
newContent = newContent.replace(
  '2: [HeadStar2SVG],',
  '2: [HeadStar2SVG, HeadStar2_2SVG, HeadStar2_3SVG],'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', newContent);
