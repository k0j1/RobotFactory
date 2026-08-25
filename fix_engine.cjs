const fs = require('fs');
let code = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

code = code.replace(/if \(loc\.element === '火'[\s\S]*?drops \+= 2;/g, "");
code = code.replace(/loc\.materials/g, "loc.drops");

fs.writeFileSync('src/core/GameEngine.ts', code);
