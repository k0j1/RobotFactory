const fs = require('fs');
let content = fs.readFileSync('src/core/GameEngine.ts', 'utf-8');

const regex = /public craftPart\(type: PartType, mainMaterialId: string, subMaterialId: string\) \{([\s\S]*?)return newPart;\n  \}/;

content = content.replace(regex, (match, p1) => {
    // We will find the line: const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };
    // and replace everything after it with the new logic up to `this.state.parts.push(newPart);`
    
    return `public craftPart(type: PartType, mainMaterialId: string, subMaterialId: string) {
    if (!this.state.materials[mainMaterialId] || this.state.materials[mainMaterialId] < 3) {
      throw new Error("メイン素材が足りません（3個必要）");
    }
    if (!this.state.materials[subMaterialId] || this.state.materials[subMaterialId] < 2) {
      throw new Error("サブ素材が足りません（2個必要）");
    }
    
    this.state.materials[mainMaterialId] -= 3;
    this.state.materials[subMaterialId] -= 2;
    
    const mainMat = MATERIALS.find(m => m.id === mainMaterialId);
    const subMat = MATERIALS.find(m => m.id === subMaterialId);
    if (!mainMat || !subMat) throw new Error("不明な素材");

    const typeNames: Record<PartType, string> = { head: 'ヘッド', body: 'ボディ', arms: 'アーム', legs: 'レッグ' };

    const matchIdx = mainMat.id.match(/_([1-4])$/);
    const matIdx = matchIdx ? parseInt(matchIdx[1], 10) - 1 : 0; // 0 to 3

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
    };
    
    this.state.parts.push(newPart);
    if (this.state.tutorialStep === 2) this.advanceTutorial();
    this.saveState();
    return newPart;
  }`;
});
fs.writeFileSync('src/core/GameEngine.ts', content);
