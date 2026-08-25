const fs = require('fs');
let code = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');

code = code.replace(
  /const color = AttributeColors\[mat\.attribute\];\s*return \(/g,
  `const color = AttributeColors[mat.attribute];
            const visibleTypesCount = filterPartType === 'All' ? 4 : 1;
            const gridColsClass = visibleTypesCount === 4 ? 'grid-cols-4' : 'grid-cols-1';
            return (`
);

fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', code);
