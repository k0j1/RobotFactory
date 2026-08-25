const fs = require('fs');
let data = fs.readFileSync('src/core/models.ts', 'utf8');

data = data.replace(/agility: number; dexterity: number;/g, 'agility: number; dexterity: number; intelligence: number;');
data = data.replace(/agility: number; dexterity: number; \}/g, 'agility: number; dexterity: number; intelligence: number; }');
data = data.replace(/'hp' \| 'power' \| 'defense' \| 'agility' \| 'dexterity'/g, "'hp' | 'power' | 'defense' | 'agility' | 'dexterity' | 'intelligence'");

fs.writeFileSync('src/core/models.ts', data);
