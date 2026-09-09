const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/combatSkills.ts', 'utf-8');
content = content.replace(
  "  const readySkills = attacker.learnedSkills.filter(s => (attacker.cooldowns[s.id] || 0) <= 0);",
  "  const readySkills = attacker.learnedSkills.filter(s => \n    (attacker.cooldowns[s.id] || 0) <= 0 && \n    (!s.reqEquipment || attacker.equipments?.[s.reqEquipment])\n  );"
);
fs.writeFileSync('src/components/minigames/combat/combatSkills.ts', content);
