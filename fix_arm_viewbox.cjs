const fs = require('fs');

let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');

rv = rv.replace(
  /armsR === 2 \? "-8 -10 48 48" : "0 0 100 100"/,
  'armsR === 2 ? ((robot.arms?.visualIndex || 0) % 2 === 1 ? "-100 -150 500 500" : "-8 -10 48 48") : "0 0 100 100"'
);

rv = rv.replace(
  /part\.type === 'arms' \? '0 2 32 28' : part\.type === 'body'/,
  "part.type === 'arms' ? (part.visualIndex % 2 === 1 ? '0 0 300 300' : '0 2 32 28') : part.type === 'body'"
);

fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);

let ec = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');

ec = ec.replace(
  /type === 'arms' \? '0 2 32 28' : type === 'body'/,
  "type === 'arms' ? (visualIndex % 2 === 1 ? '0 0 300 300' : '0 2 32 28') : type === 'body'"
);

ec = ec.replace(
  /{ id: 'a2_1', type: 'arms', rarity: 2, visualIndex: 1, name: 'ビームアーム' },/,
  "{ id: 'a2_1', type: 'arms', rarity: 2, visualIndex: 1, name: 'サイバーアーム', isNew: true },"
);

fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', ec);

