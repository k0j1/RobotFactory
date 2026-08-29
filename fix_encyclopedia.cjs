const fs = require('fs');
let content = fs.readFileSync('src/screens/EncyclopediaScreen.tsx', 'utf-8');

content = content.replace(
  /\{SVG_HEADS\.map\(\(Comp, idx\) => <SinglePart key=\{idx\} Comp=\{Comp\} color=\{color\} type="head" rarityLabel=\{1\} \/>\)\}/g,
  `{Object.entries(SVG_HEADS).map(([r, svgs]) => svgs.map((Comp, idx) => <SinglePart key={\`\${r}-\${idx}\`} Comp={Comp} color={color} type="head" rarityLabel={Number(r)} />))}`
);
content = content.replace(
  /\{SVG_BODIES\.map\(\(Comp, idx\) => <SinglePart key=\{idx\} Comp=\{Comp\} color=\{color\} type="body" rarityLabel=\{1\} \/>\)\}/g,
  `{Object.entries(SVG_BODIES).map(([r, svgs]) => svgs.map((Comp, idx) => <SinglePart key={\`\${r}-\${idx}\`} Comp={Comp} color={color} type="body" rarityLabel={Number(r)} />))}`
);
content = content.replace(
  /\{SVG_ARMS\.map\(\(Comp, idx\) => <SinglePart key=\{idx\} Comp=\{Comp\} color=\{color\} type="arms" rarityLabel=\{1\} \/>\)\}/g,
  `{Object.entries(SVG_ARMS).map(([r, svgs]) => svgs.map((Comp, idx) => <SinglePart key={\`\${r}-\${idx}\`} Comp={Comp} color={color} type="arms" rarityLabel={Number(r)} />))}`
);
content = content.replace(
  /\{SVG_LEGS\.map\(\(Comp, idx\) => <SinglePart key=\{idx\} Comp=\{Comp\} color=\{color\} type="legs" rarityLabel=\{1\} \/>\)\}/g,
  `{Object.entries(SVG_LEGS).map(([r, svgs]) => svgs.map((Comp, idx) => <SinglePart key={\`\${r}-\${idx}\`} Comp={Comp} color={color} type="legs" rarityLabel={Number(r)} />))}`
);

fs.writeFileSync('src/screens/EncyclopediaScreen.tsx', content);
