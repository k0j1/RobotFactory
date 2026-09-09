const fs = require('fs');

let content = fs.readFileSync('src/components/robot/GSAPRobotCanvas.tsx', 'utf-8');

if (!content.includes('const fxContainerRef = useRef<HTMLDivElement>(null);')) {
  content = content.replace(
    'const sparklesRef = useRef<HTMLDivElement>(null);',
    'const sparklesRef = useRef<HTMLDivElement>(null);\n  const fxContainerRef = useRef<HTMLDivElement>(null);'
  );

  content = content.replace(
    'sparkles: sparklesRef.current,',
    'sparkles: sparklesRef.current,\n          fxContainer: fxContainerRef.current,'
  );

  content = content.replace(
    '{/* ロボット本体（各部位を独立したレイヤーとして保持） */}',
    '{/* 武器や動的エフェクトを表示するレイヤー (z: 5) */}\n      <div\n        ref={fxContainerRef}\n        className="absolute inset-0 pointer-events-none z-[5]"\n      />\n\n      {/* ロボット本体（各部位を独立したレイヤーとして保持） */}'
  );

  fs.writeFileSync('src/components/robot/GSAPRobotCanvas.tsx', content);
}
