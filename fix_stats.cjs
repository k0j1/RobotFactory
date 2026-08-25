const fs = require('fs');
let data = fs.readFileSync('src/core/data.ts', 'utf8');

// Add intelligence to baseStats in data.ts
data = data.replace(/"dexterity": (\d+)\n\s*\}/g, (match, dex) => {
  return `"dexterity": ${dex},\n      "intelligence": ${Math.floor(Math.random() * 5) + 1}\n    }`;
});

fs.writeFileSync('src/core/data.ts', data);
console.log('Fixed data.ts');
