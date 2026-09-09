const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/combatSkills.ts', 'utf-8');
content = content.replace(
  "    if (fighter.intelligence < skill.reqInt) return false;",
  "    if (fighter.intelligence < skill.reqInt) return false;\n    if (skill.reqEquipment && !fighter.equipments?.[skill.reqEquipment]) return false;"
);
fs.writeFileSync('src/components/minigames/combat/combatSkills.ts', content);
