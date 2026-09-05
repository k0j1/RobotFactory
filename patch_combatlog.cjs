const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/CombatLogView.tsx', 'utf-8');

// Update header
content = content.replace(
  '戦闘解析ログ',
  'ログ'
);

fs.writeFileSync('src/components/minigames/combat/CombatLogView.tsx', content);
