const fs = require('fs');
let layout = fs.readFileSync('src/components/ui/Layout.tsx', 'utf8');
layout = layout.replace(/\{ id: 'storage', label: '倉庫' \},/g, `{ id: 'storage', label: '倉庫' },\n    { id: 'minigame', label: 'バトル' },`);
fs.writeFileSync('src/components/ui/Layout.tsx', layout);
