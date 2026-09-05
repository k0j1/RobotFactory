const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const ArmsStar2_2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = \`arm2-armor-\${uid}\`;
  const silverGradId = \`arm2-silver-\${uid}\`;

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
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="79" cy="112" r="25" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="79" cy="112" r="9" fill={glowColor}/>
        <path d="M64 130L91 137L106 176L78 187L57 148Z"
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="181" r="21" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="91" cy="181" r="7" fill={glowColor}/>
        <path d="M97 196L123 188L145 211L128 218L103 214Z"
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <path d="M125 204L143 207L151 215L137 218L122 214Z"
              fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="6"/>

        {/* RIGHT ARM */}
        <path d="M268 48Q284 42 292 56L306 91Q311 105 298 116L269 140L249 116L274 94L259 67Q253 53 268 48Z"
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="281" cy="112" r="25" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="281" cy="112" r="9" fill={glowColor}/>
        <path d="M296 130L269 137L254 176L282 187L303 148Z"
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="181" r="21" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <circle cx="269" cy="181" r="7" fill={glowColor}/>
        <path d="M263 196L237 188L215 211L232 218L257 214Z"
              fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="7"/>
        <path d="M235 204L217 207L209 215L223 218L238 214Z"
              fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="6"/>
      </g>
    </svg>
  );
};
`;

content = content.replace(
  '2: [ArmsStar2SVG],',
  '2: [ArmsStar2SVG, ArmsStar2_2SVG],'
);

// Insert the new component right before SVG_LEGS
content = content.replace(
  'export const SVG_LEGS',
  newComponent + '\nexport const SVG_LEGS'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);

