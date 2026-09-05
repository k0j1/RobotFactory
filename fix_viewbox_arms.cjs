const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

rv = rv.replace(
  /armsR === 2 \? \(\(robot\.arms\?\.visualIndex \|\| 0\) > 0 \? "-100 -150 500 500" : "-8 -10 48 48"\) : "0 0 100 100"/,
  'armsR === 2 ? ((robot.arms?.visualIndex || 0) > 0 ? "-100 -150 500 500" : "0 0 64 64") : "0 0 100 100"'
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');

ec = ec.replace(
  /type === 'arms' \? \(visualIndex > 0 \? '0 0 300 300' : '0 2 32 28'\) : type === 'body'/,
  "type === 'arms' ? (visualIndex > 0 ? '0 0 300 300' : '0 0 64 64') : type === 'body'"
);

fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);
