const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const ArmsStar2SVG = ({ color, viewBox = "0 0 64 64", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={className} shapeRendering="crispEdges" width="100%" height="100%">
      {/* LEFT ARM */}
      <path d="M5 8H19L23 12V25L19 29V43L23 48V57L19 61H7L3 57V48L7 43V29L3 25V12Z" fill={pal.out}/>
      <path d="M8 11H17L20 14V24L16 28V44L20 49V55L17 58H9L6 55V49L10 44V28L6 24V14Z" fill={pal.dark}/>
      {/* upper armor */}
      <path d="M8 13H17L18 15V23L15 27H10L7 23V15Z" fill={pal.base}/>
      <path d="M10 14H16V22L14 24H11L9 22V16Z" fill={pal.light}/>
      <rect x="11" y="15" width="2" height="6" fill={pal.accent}/>
      {/* elbow */}
      <path d="M8 25L11 28H15L18 25V31L15 34H11L8 31Z" fill={pal.out}/>
      <rect x="10" y="28" width="6" height="3" fill={pal.glow60}/>
      {/* forearm */}
      <path d="M9 34H17L19 43L22 48V53H6V48L9 43Z" fill={pal.base}/>
      <path d="M11 35H15V43L18 48V50H10V47L12 42Z" fill={pal.light}/>
      <rect x="12" y="36" width="2" height="7" fill={pal.accent}/>
      {/* wrist */}
      <rect x="7" y="50" width="14" height="5" fill={pal.dark}/>
      <rect x="10" y="51" width="8" height="2" fill={pal.glow100}/>
      {/* hand */}
      <path d="M8 55H20L22 58L19 61H9L6 58Z" fill={pal.out}/>
      <path d="M10 56H18L20 58L18 59H10L8 58Z" fill={pal.dark}/>
      <rect x="11" y="56" width="6" height="2" fill={pal.light}/>

      {/* RIGHT ARM */}
      <path d="M45 8H59L61 12V25L57 29V43L61 48V57L57 61H45L41 57V48L45 43V29L41 25V12Z" fill={pal.out}/>
      <path d="M47 11H56L58 14V24L54 28V44L58 49V55L55 58H47L44 55V49L48 44V28L44 24V14Z" fill={pal.dark}/>
      {/* upper armor */}
      <path d="M47 13H56L57 15V23L54 27H49L46 23V15Z" fill={pal.base}/>
      <path d="M48 14H54V22L52 24H49L47 22V16Z" fill={pal.light}/>
      <rect x="51" y="15" width="2" height="6" fill={pal.accent}/>
      {/* elbow */}
      <path d="M46 25L49 28H53L56 25V31L53 34H49L46 31Z" fill={pal.out}/>
      <rect x="48" y="28" width="6" height="3" fill={pal.glow60}/>
      {/* forearm */}
      <path d="M47 34H55L58 43L61 48V53H45V48L48 43Z" fill={pal.base}/>
      <path d="M49 35H53V43L56 48V50H48V47L50 42Z" fill={pal.light}/>
      <rect x="50" y="36" width="2" height="7" fill={pal.accent}/>
      {/* wrist */}
      <rect x="43" y="50" width="14" height="5" fill={pal.dark}/>
      <rect x="46" y="51" width="8" height="2" fill={pal.glow100}/>
      {/* hand */}
      <path d="M44 55H56L59 58L56 61H46L42 58Z" fill={pal.out}/>
      <path d="M46 56H54L56 58L54 59H46L44 58Z" fill={pal.dark}/>
      <rect x="47" y="56" width="6" height="2" fill={pal.light}/>

      {/* bolts and energy lights */}
      <rect x="7" y="16" width="3" height="3" fill="#AFC0D2"/>
      <rect x="54" y="16" width="3" height="3" fill="#AFC0D2"/>
      <rect x="8" y="37" width="3" height="3" fill="#AFC0D2"/>
      <rect x="53" y="37" width="3" height="3" fill="#AFC0D2"/>
    </svg>
  );
};
`;

const startIndex = content.indexOf('export const ArmsStar2SVG = ({');
const endIndex = content.indexOf('export const BodyStar2SVG = ({');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newComponent + content.substring(endIndex);
  fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
} else {
  console.log("Could not find start or end index");
}
