const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');
rv = rv.replace(
  /part\.type === 'legs' \? \(part\.visualIndex % 2 === 1 \? '0 0 32 32' : '0 0 300 300'\) : '0 0 32 32'/,
  "part.type === 'legs' ? '0 0 300 300' : '0 0 32 32'"
);
rv = rv.replace(
  /legsR === 2\s*\n\s*\? \(\(robot\.legs\?\.visualIndex \|\| 0\) % 2 === 1 \? "-8 -12 48 48" : "-170 -336 640 640"\)/m,
  'legsR === 2 \n                  ? "-170 -336 640 640"'
);
fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ec = ec.replace(
  /type === 'legs' \? \(visualIndex % 2 === 1 \? '0 0 32 32' : '0 0 300 300'\) : '0 0 32 32'/,
  "type === 'legs' ? '0 0 300 300' : '0 0 32 32'"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);
