const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const HeadStar2SVG = ({ color, viewBox = "0 0 64 64", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* outer helmet */}
      <path d="M12 17L17 9L24 5H40L47 9L52 17L57 23V43L51 49L45 53H19L13 49L7 43V23Z" fill={pal.out}/>
      <path d="M15 17L19 11L25 8H39L45 11L49 17L54 23V41L49 46L43 50H21L15 46L10 41V23Z" fill={pal.dark}/>

      {/* blue armor crown */}
      <path d="M18 17L21 12L26 10H38L43 12L46 17L50 22V30H14V22Z" fill={pal.base}/>
      <path d="M22 13L26 11H38L42 13L45 18H19Z" fill={pal.light}/>
      <rect x="27" y="8" width="10" height="4" fill={pal.dark0}/>
      <rect x="29" y="8" width="6" height="2" fill={pal.glow60}/>

      {/* side antenna / fins */}
      <path d="M10 19L4 14L5 25L11 29Z" fill={pal.out}/>
      <path d="M54 19L60 14L59 25L53 29Z" fill={pal.out}/>
      <rect x="6" y="16" width="3" height="6" fill={pal.light}/>
      <rect x="55" y="16" width="3" height="6" fill={pal.light}/>

      {/* face visor */}
      <path d="M13 27L18 22H46L51 27V42L46 47H18L13 42Z" fill={pal.out}/>
      <path d="M16 28L20 25H44L48 28V39L44 43H20L16 39Z" fill={pal.dark0}/>

      {/* glowing eyes / visor */}
      <path d="M19 30H29V38L26 41H19L17 38V32Z" fill={pal.dark100}/>
      <path d="M35 30H45L47 32V38L45 41H38L35 38Z" fill={pal.dark100}/>
      <rect x="20" y="32" width="7" height="5" fill={pal.glow100}/>
      <rect x="37" y="32" width="7" height="5" fill={pal.glow100}/>
      <rect x="22" y="33" width="4" height="2" fill="#D5F6FF"/>
      <rect x="38" y="33" width="4" height="2" fill="#D5F6FF"/>

      {/* central nose / sensor */}
      <path d="M29 28H35V41L32 44L29 41Z" fill={pal.dark}/>
      <rect x="30" y="31" width="4" height="6" fill={pal.glow60}/>
      <rect x="31" y="32" width="2" height="3" fill="#E3FAFF"/>

      {/* lower jaw armor */}
      <path d="M17 43H47L43 51L38 55H26L21 51Z" fill={pal.out}/>
      <path d="M21 45H43L40 50L36 52H28L24 50Z" fill={pal.base}/>
      <rect x="27" y="47" width="10" height="3" fill={pal.dark100}/>
      <rect x="29" y="47" width="6" height="2" fill={pal.glow60}/>

      {/* cheek armor */}
      <path d="M10 31L16 28V42L11 44L8 40V34Z" fill={pal.light}/>
      <path d="M54 31L48 28V42L53 44L56 40V34Z" fill={pal.light}/>
      <rect x="10" y="34" width="3" height="4" fill={pal.solidAccent}/>
      <rect x="51" y="34" width="3" height="4" fill={pal.solidAccent}/>

      {/* bolts */}
      <rect x="14" y="18" width="3" height="3" fill={pal.gray}/>
      <rect x="47" y="18" width="3" height="3" fill={pal.gray}/>
      <rect x="14" y="42" width="3" height="3" fill={pal.gray}/>
      <rect x="47" y="42" width="3" height="3" fill={pal.gray}/>

      {/* highlights */}
      <rect x="19" y="13" width="3" height="2" fill={pal.glow60}/>
      <rect x="42" y="13" width="2" height="2" fill={pal.dark0}/>
    </svg>
  );
};
`;

const startIndex = content.indexOf('export const HeadStar2SVG = ({');
const endIndex = content.indexOf('export const ArmsStar2SVG = ({');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newComponent + content.substring(endIndex);
  fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
} else {
  console.log("Could not find start or end index");
}
