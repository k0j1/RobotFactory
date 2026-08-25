const fs = require('fs');

if (fs.existsSync('src/screens/QuestScreen.tsx')) {
  let q = fs.readFileSync('src/screens/QuestScreen.tsx', 'utf8');
  q = q.replace(/<span>Dex: \{selectedRobot.stats.dexterity\}<\/span>/g, `<span>Dex: {selectedRobot.stats.dexterity}</span>
                <span>Int: {selectedRobot.stats.intelligence}</span>`);
  fs.writeFileSync('src/screens/QuestScreen.tsx', q);
}

