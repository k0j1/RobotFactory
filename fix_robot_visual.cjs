const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

// Fix Legs
rv = rv.replace(
  /legsR === 2\s*\?\s*"-170 -336 640 640"/g,
  'legsR === 2 ? "-170 -336 640 640"'
);

// Fix Body
rv = rv.replace(
  /bodyR === 2 \? "-100 -150 500 500" : "0 0 100 100"/g,
  'bodyR === 2 ? "-100 -150 500 500" : "0 0 100 100"'
);

// Fix Arms
rv = rv.replace(
  /armsR === 2 \? \(\(robot\.arms\?\.visualIndex \|\| 0\) > 0 \? "-100 -150 500 500" : "0 0 64 64"\) : "0 0 100 100"/g,
  'armsR === 2 ? ((robot.arms?.visualIndex || 0) > 0 ? "-100 -150 500 500" : "0 0 64 64") : "0 0 100 100"'
);

// Fix Head
rv = rv.replace(
  /headR === 3 \? "-122 -30 500 500" : headR === 2 \? "-43 35 150 150" : "0 0 100 100"/g,
  'headR === 3 ? "-122 -30 500 500" : headR === 2 ? "-48 -10 160 160" : "0 0 100 100"'
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);
