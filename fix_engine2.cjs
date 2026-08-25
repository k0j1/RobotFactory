const fs = require('fs');
let data = fs.readFileSync('src/core/GameEngine.ts', 'utf8');

data = data.replace(/intelligence:1, intelligence:1/g, 'intelligence:1');

fs.writeFileSync('src/core/GameEngine.ts', data);

let screen = fs.readFileSync('src/screens/MinigameScreen.tsx', 'utf8');
screen = screen.replace(/..\/components\/visuals\/RobotVisual/g, '../components/robot/RobotVisual');
fs.writeFileSync('src/screens/MinigameScreen.tsx', screen);
