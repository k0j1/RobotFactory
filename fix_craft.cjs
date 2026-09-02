const fs = require('fs');
let code = fs.readFileSync('src/screens/CraftScreen.tsx', 'utf8');

// Revert </div> to </Card> where the opening is <Card
code = code.replace(/<Card([\s\S]*?)<\/div>/g, '<Card$1</Card>');

// Since that's hard to do right, let's just replace all <Card> to <div className="rounded-xl..."> and handle it
code = code.replace(/<Card/g, '<div');
code = code.replace(/<\/Card>/g, '<\/div>'); // just in case

// Fix the syntax error
code = code.replace(
  'WARNING: INSUFFICIENT MATERIALS</p>3個以上ある素材がありません。</p>}',
  'WARNING: INSUFFICIENT MATERIALS</p>}'
);
code = code.replace(
  'WARNING: INSUFFICIENT MATERIALS</p>2個以上ある素材がありません。</p>}',
  'WARNING: INSUFFICIENT MATERIALS</p>}'
);


fs.writeFileSync('src/screens/CraftScreen.tsx', code);
