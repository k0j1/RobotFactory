const fs = require('fs');

let content = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

const regex = /const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };\n    const name = `\$\{mainMat\.name\}の\$\{typeNames\[type\]\}`;\n\n    const newPart: RobotPart = \{\n      id: `part_\$\{Date\.now\(\)\}_\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\}`,\n      type,\n      name,\n      attribute: mainMat\.attribute, \/\/ Main material decides attribute\n      rarity: Math\.max\(mainMat\.rarity, subMat\.rarity\),\n      stats: \{\n        hp: mainMat\.baseStats\.hp \+ Math\.floor\(subMat\.baseStats\.hp \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n        power: mainMat\.baseStats\.power \+ Math\.floor\(subMat\.baseStats\.power \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n        defense: mainMat\.baseStats\.defense \+ Math\.floor\(subMat\.baseStats\.defense \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n        agility: mainMat\.baseStats\.agility \+ Math\.floor\(subMat\.baseStats\.agility \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n        dexterity: mainMat\.baseStats\.dexterity \+ Math\.floor\(subMat\.baseStats\.dexterity \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n        intelligence: mainMat\.baseStats\.intelligence \+ Math\.floor\(subMat\.baseStats\.intelligence \* 0\.5\) \+ Math\.floor\(Math\.random\(\) \* 5\),\n      \},\n      visualIndex: Math\.floor\(Math\.random\(\) \* 24\),\n    \};/m;

const replacement = `const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };

    const match = mainMat.id.match(/_([1-4])$/);
    const matIdx = match ? parseInt(match[1], 10) - 1 : 0; // 0 to 3

    let possibleCrafts = [];
    if (mainMat.rarity === 1) {
      possibleCrafts.push({ rarity: 1, visualIndex: matIdx * 2 });
      possibleCrafts.push({ rarity: 1, visualIndex: matIdx * 2 + 1 });
    } else if (mainMat.rarity === 2) {
      possibleCrafts.push({ rarity: 1, visualIndex: matIdx * 2 });
      possibleCrafts.push({ rarity: 1, visualIndex: matIdx * 2 + 1 });
      possibleCrafts.push({ rarity: 2, visualIndex: matIdx });
    } else if (mainMat.rarity === 3) {
      possibleCrafts.push({ rarity: 2, visualIndex: matIdx * 2 });
      possibleCrafts.push({ rarity: 2, visualIndex: matIdx * 2 + 1 });
      possibleCrafts.push({ rarity: 3, visualIndex: matIdx });
    }
    
    const chosenCraft = possibleCrafts[Math.floor(Math.random() * possibleCrafts.length)];
    const craftRarity = chosenCraft.rarity;
    
    const name = \`\${mainMat.name}の\${typeNames[type]}\`;

    const newPart: RobotPart = {
      id: \`part_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`,
      type,
      name,
      attribute: mainMat.attribute, // Main material decides attribute
      rarity: craftRarity as 1 | 2 | 3,
      stats: {
        hp: mainMat.baseStats.hp + Math.floor(subMat.baseStats.hp * 0.5) + Math.floor(Math.random() * 5),
        power: mainMat.baseStats.power + Math.floor(subMat.baseStats.power * 0.5) + Math.floor(Math.random() * 5),
        defense: mainMat.baseStats.defense + Math.floor(subMat.baseStats.defense * 0.5) + Math.floor(Math.random() * 5),
        agility: mainMat.baseStats.agility + Math.floor(subMat.baseStats.agility * 0.5) + Math.floor(Math.random() * 5),
        dexterity: mainMat.baseStats.dexterity + Math.floor(subMat.baseStats.dexterity * 0.5) + Math.floor(Math.random() * 5),
        intelligence: mainMat.baseStats.intelligence + Math.floor(subMat.baseStats.intelligence * 0.5) + Math.floor(Math.random() * 5),
      },
      visualIndex: chosenCraft.visualIndex,
    };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/core/GameEngine.ts', content);
