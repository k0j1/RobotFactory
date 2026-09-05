const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

const newSvg = `
export const LegsStar2_2SVG = ({ color, viewBox = "0 0 300 300", className }: SVGProps) => {
  const pal = getAttributePalette(color);
  const uid = React.useId().replace(/:/g, '');

  const legGradId = \`leg-grad-\${uid}\`;
  const footGradId = \`foot-grad-\${uid}\`;
  const jointGradId = \`joint-grad-\${uid}\`;
  const cyanGlowId = \`cyan-glow-\${uid}\`;

  const isBlueOrWater = !color || color === '#2563eb' || color === '#38bdf8' || color === '#0284c7' || color.toLowerCase().includes('blue');

  const legColor0 = isBlueOrWater ? '#6bb3f8' : (pal.armor0 || '#6bb3f8');
  const legColor100 = isBlueOrWater ? '#3b81eb' : (pal.armor100 || '#3b81eb');

  const glowColor0 = isBlueOrWater ? '#73f7ff' : (pal.glow0 || '#73f7ff');
  const glowColor100 = isBlueOrWater ? '#2bd3f7' : (pal.glow100 || '#2bd3f7');

  const outerStroke = isBlueOrWater ? '#121e36' : (pal.stroke || '#121e36');

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} width="100%" height="100%" className={className}>
      <defs>
        {/* 脚部装甲グラデーション (青) */}
        <linearGradient id={legGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={legColor0} />
          <stop offset="100%" stopColor={legColor100} />
        </linearGradient>

        {/* 足元シューズグラデーション (シルバー) */}
        <linearGradient id={footGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cadcf0" />
        </linearGradient>

        {/* 膝ジョイントグラデーション (ライトグレー) */}
        <linearGradient id={jointGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eaf3fc" />
          <stop offset="100%" stopColor="#b8cee6" />
        </linearGradient>

        {/* 発光部グラデーション (シアン) */}
        <linearGradient id={cyanGlowId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={glowColor0} />
          <stop offset="100%" stopColor={glowColor100} />
        </linearGradient>
      </defs>

      {/* 全体太ストローク・グループ */}
      <g stroke={outerStroke} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">

        {/* ================= 左脚 (LEFT LEG) ================= */}
        {/* 太もも (上部装甲) */}
        <path d="M 60,35 H 120 V 120 H 60 Z" fill={\`url(#\${legGradId})\`} />

        {/* すね (下部台形装甲) */}
        <path d="M 68,140 L 112,140 L 120,230 H 60 Z" fill={\`url(#\${legGradId})\`} />

        {/* 膝関節 (丸型ジョイント) */}
        <circle cx="90" cy="130" r="22" fill={\`url(#\${jointGradId})\`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="90" cy="130" r="10" fill="#ffffff" stroke={outerStroke} strokeWidth="4" />
        <circle cx="90" cy="130" r="5" fill={\`url(#\${cyanGlowId})\`} stroke="none" />

        {/* 足元 (シューズ/フットパーツ) */}
        <path d="M 52,240 L 110,240 C 128,240 135,255 125,270 L 120,278 H 52 C 45,278 45,270 52,260 Z" fill={\`url(#\${footGradId})\`} />
        {/* 足元ライン / 発光インジケーター */}
        <path d="M 68,252 H 110 L 115,266 H 68 Z" fill={\`url(#\${cyanGlowId})\`} stroke="none" />


        {/* ================= 右脚 (RIGHT LEG) ================= */}
        {/* 太もも (上部装甲) */}
        <path d="M 180,35 H 240 V 120 H 180 Z" fill={\`url(#\${legGradId})\`} />

        {/* すね (下部台形装甲) */}
        <path d="M 188,140 L 232,140 L 240,230 H 180 Z" fill={\`url(#\${legGradId})\`} />

        {/* 膝関節 (丸型ジョイント) */}
        <circle cx="210" cy="130" r="22" fill={\`url(#\${jointGradId})\`} stroke={outerStroke} strokeWidth="10" />
        <circle cx="210" cy="130" r="10" fill="#ffffff" stroke={outerStroke} strokeWidth="4" />
        <circle cx="210" cy="130" r="5" fill={\`url(#\${cyanGlowId})\`} stroke="none" />

        {/* 足元 (シューズ/フットパーツ) */}
        <path d="M 180,240 L 238,240 C 255,240 255,248 248,260 L 248,278 H 180 C 165,278 165,265 170,255 Z" fill={\`url(#\${footGradId})\`} />
        {/* 足元ライン / 発光インジケーター */}
        <path d="M 190,252 H 232 L 232,266 H 195 Z" fill={\`url(#\${cyanGlowId})\`} stroke="none" />

      </g>
    </svg>
  );
};
`;

content = content.replace(
  '2: [LegsStar2SVG, LegsStar2PixelSVG],',
  '2: [LegsStar2SVG, LegsStar2_2SVG],'
);

// Insert the new component right before SVG_HEADS
content = content.replace(
  'export const SVG_HEADS',
  newSvg + '\nexport const SVG_HEADS'
);

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', content);
