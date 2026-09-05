const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

// Replace Legs
rv = rv.replace(
  /legsR === 2 \? "[^"]+" : "0 0 100 100"/g,
  'legsR === 2 ? "-150 -295 600 600" : "0 0 100 100"'
);

// Replace Body
rv = rv.replace(
  /bodyR === 2 \? "[^"]+" : "0 0 100 100"/g,
  'bodyR === 2 ? "-150 -130 600 600" : "0 0 100 100"'
);

// Replace Arms
rv = rv.replace(
  /armsR === 2 \? \(\(robot\.arms\?\.visualIndex \|\| 0\) > 0 \? "[^"]+" : "[^"]+"\) : "0 0 100 100"/g,
  'armsR === 2 ? ((robot.arms?.visualIndex || 0) > 0 ? "-150 -130 600 600" : "-6 3 77 77") : "0 0 100 100"'
);

// Replace Head
rv = rv.replace(
  /headR === 3 \? "[^"]+" : headR === 2 \? "[^"]+" : "0 0 100 100"/g,
  'headR === 3 ? "-122 -30 500 500" : headR === 2 ? "-64 -3 192 192" : "0 0 100 100"'
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);
