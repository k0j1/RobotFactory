const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

// Replace Arms
rv = rv.replace(
  /armsR === 2 \? \(\(robot\.arms\?\.visualIndex \|\| 0\) > 0 \? "[^"]+" : "[^"]+"\) : "0 0 100 100"/g,
  'armsR === 2 ? ((arms?.visualIndex || 0) > 0 ? "-150 -130 600 600" : "-6 3 77 77") : "0 0 100 100"'
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);
