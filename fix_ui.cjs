const fs = require('fs');
let data = fs.readFileSync('src/screens/StorageScreen.tsx', 'utf8');

// StorageScreen
data = data.replace(/<span>Dex: \{r.stats.dexterity\}<\/span>/g, `<span>Dex: {r.stats.dexterity}</span>
                          <span>Int: {r.stats.intelligence}</span>`);
fs.writeFileSync('src/screens/StorageScreen.tsx', data);

// Dashboard? (Delivered logs)
if (fs.existsSync('src/screens/Dashboard.tsx')) {
  let dash = fs.readFileSync('src/screens/Dashboard.tsx', 'utf8');
  dash = dash.replace(/<span>Dex: \{log.stats.dexterity\}<\/span>/g, `<span>Dex: {log.stats.dexterity}</span>
                            <span>Int: {log.stats.intelligence}</span>`);
  fs.writeFileSync('src/screens/Dashboard.tsx', dash);
}

// QuestScreen? (Dispatched robot)
if (fs.existsSync('src/screens/QuestScreen.tsx')) {
  let q = fs.readFileSync('src/screens/QuestScreen.tsx', 'utf8');
  q = q.replace(/<span>Dex: \{r.stats.dexterity\}<\/span>/g, `<span>Dex: {r.stats.dexterity}</span>
                            <span>Int: {r.stats.intelligence}</span>`);
  fs.writeFileSync('src/screens/QuestScreen.tsx', q);
}

