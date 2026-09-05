const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const ArmsStar2_4SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = \`arm4-armor-\${uid}\`;
  const silverGradId = \`arm4-silver-\${uid}\`;

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
        <path d="M86 45Q69 45 64 61L52 100Q48 115 61 125L91 148L113 120L84 99L99 68Q105 48 86 45Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <circle cx="77" cy="118" r="27" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="77" cy="118" r="10" fill={glowColor} stroke={darkStroke} strokeWidth="4"/>
        <path d="M91 139L116 128L143 171L132 210L99 203L86 164Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="104" y="181" width="44" height="42" rx="17" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8" transform="rotate(-8 126 202)"/>
        <circle cx="126" cy="202" r="8" fill={glowColor}/>
        <path d="M119 215Q126 207 136 212L157 225Q166 231 160 240L153 249Q148 255 140 250L112 235Q105 229 110 222Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="145" cy="231" r="5" fill={glowColor}/>

        {/* RIGHT ARM */}
        <path d="M334 45Q351 45 356 61L368 100Q372 115 359 125L329 148L307 120L336 99L321 68Q315 48 334 45Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <circle cx="343" cy="118" r="27" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="343" cy="118" r="10" fill={glowColor} stroke={darkStroke} strokeWidth="4"/>
        <path d="M329 139L304 128L277 171L288 210L321 203L334 164Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="272" y="181" width="44" height="42" rx="17" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8" transform="rotate(8 294 202)"/>
        <circle cx="294" cy="202" r="8" fill={glowColor}/>
        <path d="M301 215Q294 207 284 212L263 225Q254 231 260 240L267 249Q272 255 280 250L308 235Q315 229 310 222Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="275" cy="231" r="5" fill={glowColor}/>
      </g>
    </svg>
  );
};
`;

const lines = content.split('\n');
const insertIndex = lines.findIndex(l => l.includes('export const SVG_ARMS'));
lines.splice(insertIndex, 0, newComponent);

let newContent = lines.join('\n');
newContent = newContent.replace(
  '2: [ArmsStar2SVG, ArmsStar2_2SVG, ArmsStar2_3SVG],',
  '2: [ArmsStar2SVG, ArmsStar2_2SVG, ArmsStar2_3SVG, ArmsStar2_4SVG],'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', newContent);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ec = ec.replace(
  "{ id: 'a2_3', type: 'arms', rarity: 2, visualIndex: 3, name: 'ガトリングアーム' },",
  "{ id: 'a2_3', type: 'arms', rarity: 2, visualIndex: 3, name: 'バスターアーム', isNew: true },"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);

