const fs = require('fs');
const lines = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8').split('\n');

const startIndex = lines.findIndex(l => l.includes('export const ArmsStar2_2SVG'));
let endIndex = startIndex;
while (endIndex < lines.length && lines[endIndex] !== '};') {
  endIndex++;
}

const componentLines = lines.splice(startIndex, endIndex - startIndex + 1);

const insertIndex = lines.findIndex(l => l.includes('export const SVG_ARMS'));
lines.splice(insertIndex, 0, ...componentLines, '');

fs.writeFileSync('src/components/robot/RobotSVGs.tsx', lines.join('\n'));
