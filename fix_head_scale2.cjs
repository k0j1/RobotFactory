const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');
rv = rv.replace(
  /headR === 3 \? "-122 -30 500 500" : headR === 2 \? "-48 -10 160 160" : "0 0 100 100"/,
  'headR === 3 ? "-122 -30 500 500" : headR === 2 ? "-43 35 150 150" : "0 0 100 100"'
);
fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');
ec = ec.replace(
  /type === 'head' \? '0 0 64 64' : type === 'arms'/,
  "type === 'head' ? '-10 -5 80 80' : type === 'arms'"
);
fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);
