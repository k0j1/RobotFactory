const fs = require('fs');
let code = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf8');

const targetStr = "<li><strong>パーツ製造:</strong> 手持ちの素材から<strong>「メイン素材(3個)」</strong>と<strong>「サブ素材(2個)」</strong>を選んでパーツを合成します。<strong>Game-Icons.net</strong>を採用したアイコン主体で直感的なUI（コンパクトグリッド表示）でスムーズに選択できます。</li>";
const newStr = targetStr + "\n              <li><strong>クラフト（工場UI）:</strong> 画面全体をロボット工場（プラント）風のダークテーマ・金属質デザインに刷新。パーツの部位別製造状況を1行の横スクロールバーでコンパクトかつ直感的に把握できるよう改善しました。また素材選択時には、背景色とラベルで属性が視覚的にわかりやすくなりました。</li>";

code = code.replace(targetStr, newStr);

const targetStr2 = "<li><strong>素材一覧の可視化とゲームアイコン（Game-Icons）:</strong>";
const newStr2 = "<li><strong>全画面Game-Icons化とUI統一:</strong> アプリケーション内のすべてのアイコン（素材、メニュー、装飾など）を <strong>Game-Icons.net</strong> に統一し、世界観の没入感を向上させました。</li>\n              <li><strong>素材一覧の可視化:</strong>";
code = code.replace(targetStr2, newStr2);

fs.writeFileSync('src/screens/LitepaperScreen.tsx', code);
