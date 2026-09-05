const fs = require('fs');
let content = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

// Also update RobotVisual's viewBox calculations to just pass undefined or default
const target = `            <ArmsComp color={armsColor} viewBox={armsR === 2 ? ((arms?.visualIndex || 0) > 0 ? "-150 -130 600 600" : "-6 3 77 77") : "0 0 100 100"} className="w-full h-full" />`;
const replacement = `            <ArmsComp color={armsColor} viewBox={armsR === 2 ? ((arms?.visualIndex || 0) > 0 ? "0 0 300 300" : "0 0 64 64") : "0 0 100 100"} className="w-full h-full" />`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/robot/RobotVisual.tsx', content);
