const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const ArmsStar2_3SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = \`arm3-armor-\${uid}\`;
  const silverGradId = \`arm3-silver-\${uid}\`;

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
        <rect x="38" y="48" width="54" height="48" rx="20" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="65" cy="72" r="10" fill={glowColor}/>
        <path d="M55 92H86L105 145L76 155L51 112Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="91" cy="151" r="20" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="151" r="7" fill={glowColor}/>
        <path d="M97 168L124 159L145 199L123 213L101 193Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M122 197L143 196L153 207L139 219L119 211Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>

        {/* RIGHT ARM */}
        <rect x="268" y="48" width="54" height="48" rx="20" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="295" cy="72" r="10" fill={glowColor}/>
        <path d="M305 92H274L255 145L284 155L309 112Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="269" cy="151" r="20" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="151" r="7" fill={glowColor}/>
        <path d="M263 168L236 159L215 199L237 213L259 193Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M238 197L217 196L207 207L221 219L241 211Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
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
  '2: [ArmsStar2SVG, ArmsStar2_2SVG],',
  '2: [ArmsStar2SVG, ArmsStar2_2SVG, ArmsStar2_3SVG],'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', newContent);

