const fs = require('fs');
let content = fs.readFileSync('src/screens/MinigameScreen.tsx', 'utf-8');
content = content.replace(
  "    setBattleResult(result);",
  "    (engine as any).recordMinigameResult(selectedGame, result);\n    setBattleResult(result);"
);
fs.writeFileSync('src/screens/MinigameScreen.tsx', content);
