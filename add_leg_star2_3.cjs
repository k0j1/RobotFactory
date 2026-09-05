const fs = require('fs');

let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newComponent = `
export const LegsStar2_3SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const armorGradId = \`leg3-armor-\${uid}\`;
  const silverGradId = \`leg3-silver-\${uid}\`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const armorColor0 = isBlueOrWater ? '#a2e1ff' : (pal.armor0 || '#a2e1ff');
  const armorColor100 = isBlueOrWater ? '#467bd2' : (pal.armor100 || '#467bd2');

  const silverColor0 = '#ffffff';
  const silverColor100 = isBlueOrWater ? '#b4c1ce' : (pal.white || '#b4c1ce');

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
      <g transform="translate(-60, 0)">
        {/* LEFT LEG */}
        <path d="M72 35Q72 25 83 25H137Q148 25 148 35V92Q148 103 137 108H83Q72 103 72 92Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="88" y="42" width="44" height="38" rx="13" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="6"/>
        <circle cx="110" cy="61" r="8" fill={glowColor}/>
        <path d="M84 106H136L145 129L133 147H87L75 129Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M87 143H133L141 214Q142 226 131 232H89Q78 226 79 214Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M96 154H124L129 203H91Z" fill={\`url(#\${armorGradId})\`}/>
        <path d="M78 211H132L151 230Q159 239 151 250L144 258H69Q59 253 64 242L72 220Q74 214 78 211Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M76 239H148L143 249H71Z" fill={glowColor}/>

        {/* RIGHT LEG */}
        <path d="M272 35Q272 25 283 25H337Q348 25 348 35V92Q348 103 337 108H283Q272 103 272 92Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <rect x="288" y="42" width="44" height="38" rx="13" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="6"/>
        <circle cx="310" cy="61" r="8" fill={glowColor}/>
        <path d="M284 106H336L345 129L333 147H287L275 129Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="8"/>
        <path d="M287 143H333L341 214Q342 226 331 232H289Q278 226 279 214Z" fill={\`url(#\${silverGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M296 154H324L329 203H291Z" fill={\`url(#\${armorGradId})\`}/>
        <path d="M278 211H332L348 220Q356 230 356 242Q361 253 351 258H276L269 250Q261 239 269 230Z" fill={\`url(#\${armorGradId})\`} stroke={outerStroke} strokeWidth="9"/>
        <path d="M272 249H348L344 258H277Z" fill={glowColor}/>

        <circle cx="110" cy="61" r="3" fill="#fff"/>
        <circle cx="310" cy="61" r="3" fill="#fff"/>
      </g>
    </svg>
  );
};
`;

content = content.replace(
  '2: [LegsStar2SVG, LegsStar2_2SVG],',
  '2: [LegsStar2SVG, LegsStar2_2SVG, LegsStar2_3SVG],'
);

// Insert the new component right before SVG_HEADS
content = content.replace(
  'export const SVG_HEADS',
  newComponent + '\nexport const SVG_HEADS'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);

let ency = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ency = ency.replace(
  "{ id: 'l2_1', type: 'legs', rarity: 2, visualIndex: 1, name: 'サイバーレッグ', isNew: true },",
  "{ id: 'l2_1', type: 'legs', rarity: 2, visualIndex: 1, name: 'サイバーレッグ' },\n  { id: 'l2_2', type: 'legs', rarity: 2, visualIndex: 2, name: 'スプリングガード', isNew: true },"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ency);
