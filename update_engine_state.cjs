const fs = require('fs');
let code = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

code = code.replace(/currentInterior: 'default',\n\};/, "currentInterior: 'default',\n  autoDispatches: [],\n};");

code = code.replace(/if \(parsed\.deliveredLogs\) \{/, `if (!parsed.autoDispatches) {
          parsed.autoDispatches = [];
        }
        
        if (parsed.deliveredLogs) {`);

fs.writeFileSync('src/core/GameEngine.ts', code);
