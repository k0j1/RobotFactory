const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/combatTypes.ts', 'utf-8');
content = content.replace(
  "  reqStat?: {",
  "  reqEquipment?: 'beamSaber' | 'beamShield';\n  reqStat?: {"
);
fs.writeFileSync('src/components/minigames/combat/combatTypes.ts', content);
