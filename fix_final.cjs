const fs = require('fs');

let engine = fs.readFileSync('src/core/GameEngine.ts', 'utf8');
engine = engine.replace(/intelligence:1, intelligence:1/g, 'intelligence:1');
fs.writeFileSync('src/core/GameEngine.ts', engine);

let screen = fs.readFileSync('src/screens/MinigameScreen.tsx', 'utf8');
screen = screen.replace(/..\/components\/ui/g, '../components/ui/core');
fs.writeFileSync('src/screens/MinigameScreen.tsx', screen);

