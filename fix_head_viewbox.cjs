const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');
rv = rv.replace(
  /headR === 3 \? "-122 -30 500 500" : headR === 2 \? "-24 -4 80 80" : "0 0 100 100"/,
  'headR === 3 ? "-122 -30 500 500" : headR === 2 ? "0 0 64 64" : "0 0 100 100"'
);
fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ec = ec.replace(
  /type === 'head' \? '0 -2 32 36' : type === 'arms'/,
  "type === 'head' ? '0 0 64 64' : type === 'arms'"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);
