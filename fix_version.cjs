const fs = require('fs');

function updateVersion(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/v1\.0\.48/g, 'v1.0.49');
  fs.writeFileSync(file, content);
}

updateVersion('src/screens/TitleScreen.tsx');
updateVersion('src/components/ui/Layout.tsx');
updateVersion('src/screens/LitepaperScreen.tsx');
