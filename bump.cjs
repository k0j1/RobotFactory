const fs = require('fs');
['src/screens/TitleScreen.tsx', 'src/components/ui/Layout.tsx', 'src/screens/LitepaperScreen.tsx'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/v1\.0\.49/g, 'v1.0.50');
  fs.writeFileSync(f, content);
});
