const fs = require('fs');
let data = fs.readFileSync('src/core/GameEngine.ts', 'utf8');

// loadState: add intelligence: 1 if it doesn't exist
data = data.replace(/dexterity:0\}/g, 'dexterity:0, intelligence:1}');
data = data.replace(/hp:0, power:0, defense:0, agility:0, dexterity:0/g, 'hp:0, power:0, defense:0, agility:0, dexterity:0, intelligence:1');

// old parts compatibility
data = data.replace(/if \(!r.parts && r.visuals\) \{/g, `
            if (r.stats && r.stats.intelligence === undefined) {
              r.stats.intelligence = 1;
              if (r.parts) {
                if (r.parts.head) r.parts.head.stats.intelligence = 1;
                if (r.parts.body) r.parts.body.stats.intelligence = 1;
                if (r.parts.arms) r.parts.arms.stats.intelligence = 1;
                if (r.parts.legs) r.parts.legs.stats.intelligence = 1;
              }
            }
            if (!r.parts && r.visuals) {`);

// old logs compatibility
data = data.replace(/if \(\!l.parts && l.visuals\) \{/g, `
            if (l.stats && l.stats.intelligence === undefined) {
              l.stats.intelligence = 1;
            }
            if (!l.parts && l.visuals) {`);

// parts migration
data = data.replace(/if \(!parsed.parts\) \{/g, `
        if (parsed.parts) {
          parsed.parts.forEach(p => {
            if (p.stats && p.stats.intelligence === undefined) {
              p.stats.intelligence = 1;
            }
          });
        }
        if (!parsed.parts) {`);

// craftPart: add intelligence
data = data.replace(/dexterity: mainMat.baseStats.dexterity \+ Math.floor\(subMat.baseStats.dexterity \* 0.5\) \+ Math.floor\(Math.random\(\) \* 5\),/g, `dexterity: mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5) + Math.floor(Math.random() * 5),
        intelligence: mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5) + Math.floor(Math.random() * 5),`);

// assembleRobot: sum intelligence
data = data.replace(/const totalDex = head.stats.dexterity \+ body.stats.dexterity \+ arms.stats.dexterity \+ legs.stats.dexterity;/g, `const totalDex = head.stats.dexterity + body.stats.dexterity + arms.stats.dexterity + legs.stats.dexterity;
    const totalInt = head.stats.intelligence + body.stats.intelligence + arms.stats.intelligence + legs.stats.intelligence;`);

data = data.replace(/hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex/g, `hp: totalHp, power: totalPow, defense: totalDef, agility: totalAgi, dexterity: totalDex, intelligence: totalInt`);

// createRandomRequest: add intelligence to stats
data = data.replace(/const stats = \['hp', 'power', 'defense', 'agility', 'dexterity'\] as const;/g, `const stats = ['hp', 'power', 'defense', 'agility', 'dexterity', 'intelligence'] as const;`);
data = data.replace(/const statLabels: Record<string, string> = \{ hp: '体力', power: 'パワー', defense: 'ディフェンス', agility: 'アジリティ', dexterity: '器用さ' \};/g, `const statLabels: Record<string, string> = { hp: '体力', power: 'パワー', defense: 'ディフェンス', agility: 'アジリティ', dexterity: '器用さ', intelligence: '賢さ' };`);

fs.writeFileSync('src/core/GameEngine.ts', data);
