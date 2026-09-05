const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/CombatFighterCard.tsx', 'utf-8');

content = content.replace(
  '<Gi.GiTargetAimed />',
  '<Gi.GiCrosshair />'
);

fs.writeFileSync('src/components/minigames/combat/CombatFighterCard.tsx', content);
