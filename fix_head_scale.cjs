const fs = require('fs');
let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');
rv = rv.replace(
  /headR === 3 \? "-122 -30 500 500" : headR === 2 \? "0 0 64 64" : "0 0 100 100"/,
  'headR === 3 ? "-122 -30 500 500" : headR === 2 ? "-48 -10 160 160" : "0 0 100 100"'
);
fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);
