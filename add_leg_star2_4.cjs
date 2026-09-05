const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const LegsStar2_4SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = \`leg4-armor-\${uid}\`;
  const silverGradId = \`leg4-silver-\${uid}\`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#b0e7ff' : (pal.armor0 || '#b0e7ff');
  const armorColor100 = isBlueOrWater ? '#4779cf' : (pal.armor100 || '#4779cf');

  const silverColor0 = '#ffffff';
  const silverColor100 = isBlueOrWater ? '#b9c6d3' : (pal.white || '#b9c6d3');

  const glowColor = isBlueOrWater ? '#67eaff' : (pal.glow60 || '#67eaff');
  const outerStroke = isBlueOrWater ? '#172840' : (pal.stroke || '#172840');
  const darkBgColor = isBlueOrWater ? '#17304f' : (pal.dark || '#17304f');
  const accentColor = isBlueOrWater ? '#4779cf' : (pal.armor100 || '#4779cf');

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
      <g transform="translate(-60, 0)">
        {/* LEFT LEG */}
        <path d="M72 32Q72 22 82 22H138Q148 22 148 32V105Q148 116 137 120H83Q72 116 72 105Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M84 45H136V96Q136 105 128 108H92Q84 105 84 96Z" fill={darkBgColor} stroke={outerStroke} strokeWidth="6"/>
        <rect x="98" y="57" width="24" height="26" rx="8" fill={glowColor}/>

        {/* left knee */}
        <path d="M78 119H142L150 139L137 157H83L70 139Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="110" cy="138" r="9" fill={glowColor}/>

        {/* left shin */}
        <path d="M84 154H136L131 222Q130 232 120 236H100Q90 232 89 222Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M98 164H122L119 210H101Z" fill={glowColor}/>

        {/* left flat foot */}
        <path d="M83 218H126L153 235Q161 242 155 251Q151 258 141 258H67Q58 253 64 243L74 224Q77 219 83 218Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="78" y="239" width="64" height="9" rx="4" fill={accentColor}/>

        {/* RIGHT LEG */}
        <path d="M272 32Q272 22 282 22H338Q348 22 348 32V105Q348 116 337 120H283Q272 116 272 105Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M284 45H336V96Q336 105 328 108H292Q284 105 284 96Z" fill={darkBgColor} stroke={outerStroke} strokeWidth="6"/>
        <rect x="298" y="57" width="24" height="26" rx="8" fill={glowColor}/>

        {/* right knee */}
        <path d="M278 119H342L350 139L337 157H283L270 139Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <circle cx="310" cy="138" r="9" fill={glowColor}/>

        {/* right shin */}
        <path d="M284 154H336L331 222Q330 232 320 236H300Q290 232 289 222Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M298 164H322L319 210H301Z" fill={glowColor}/>

        {/* right flat foot */}
        <path d="M294 218H337Q343 219 346 224L356 243Q362 253 353 258H279Q269 258 265 251Q259 242 267 235L294 218Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="278" y="239" width="64" height="9" rx="4" fill={accentColor}/>
      </g>
    </svg>
  );
};
`;

content = content.replace(
  '2: [LegsStar2SVG, LegsStar2_2SVG, LegsStar2_3SVG],',
  '2: [LegsStar2SVG, LegsStar2_2SVG, LegsStar2_3SVG, LegsStar2_4SVG],'
);

// Insert the new component right before SVG_HEADS
content = content.replace(
  'export const SVG_HEADS',
  newComponent + '\nexport const SVG_HEADS'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);

let ency = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ency = ency.replace(
  "{ id: 'l2_2', type: 'legs', rarity: 2, visualIndex: 2, name: 'スプリングガード', isNew: true },",
  "{ id: 'l2_2', type: 'legs', rarity: 2, visualIndex: 2, name: 'スプリングガード' },\n  { id: 'l2_3', type: 'legs', rarity: 2, visualIndex: 3, name: 'シリンダーレッグ', isNew: true },"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ency);
