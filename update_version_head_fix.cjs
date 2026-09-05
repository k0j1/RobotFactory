const fs = require('fs');
for (const file of ['src/screens/TitleScreen.tsx', 'src/screens/LitepaperScreen.tsx']) {
  let c = fs.readFileSync(file, 'utf-8');
  c = c.replace(/v1\.0\.192/g, 'v1.0.193');
  fs.writeFileSync(file, c);
}
