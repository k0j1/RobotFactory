const fs = require('fs');
let rv = fs.readFileSync('src/components/robot/RobotVisual.tsx', 'utf-8');
rv = rv.replace(/legsR === 2\s*\?\s*"-170 -336 640 640"\s*:\s*"0 0 100 100"/g, 'legsR === 2 ? "-150 -295 600 600" : "0 0 100 100"');
fs.writeFileSync('src/components/robot/RobotVisual.tsx', rv);
