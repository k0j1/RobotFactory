const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes("import { MinigameScreen }")) {
  app = app.replace("import { StorageScreen } from './screens/StorageScreen';", "import { StorageScreen } from './screens/StorageScreen';\nimport { MinigameScreen } from './screens/MinigameScreen';");
}

app = app.replace(/\{view === 'storage' && <StorageScreen state=\{state\} engine=\{engine\} \/>\}/g, `{view === 'storage' && <StorageScreen state={state} engine={engine} />}
      {view === 'minigame' && <MinigameScreen state={state} engine={engine} />}`);
      
fs.writeFileSync('src/App.tsx', app);
