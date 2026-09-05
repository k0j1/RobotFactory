const fs = require('fs');
let c = fs.readFileSync('src/components/robot/RobotSVGs.tsx', 'utf-8');

// Find ArmsStar2_2SVG definition
const match = c.match(/export const ArmsStar2_2SVG = \(\{[\s\S]*?\}\);\n/);
if (match) {
  c = c.replace(match[0], ''); // remove from current location
  // Insert it before SVG_BODIES or SVG_ARMS
  c = c.replace('export const SVG_BODIES', match[0] + '\nexport const SVG_BODIES');
  fs.writeFileSync('src/components/robot/RobotSVGs.tsx', c);
  console.log('Fixed block-scoping issue.');
} else {
  console.log('Could not find ArmsStar2_2SVG');
}
