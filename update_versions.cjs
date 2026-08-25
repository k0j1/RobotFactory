const fs = require('fs');

function updateVersion(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/v1\.0\.49/g, 'v1.0.50');
  fs.writeFileSync(file, content);
}

updateVersion('src/screens/TitleScreen.tsx');
updateVersion('src/components/ui/Layout.tsx');
updateVersion('src/screens/LitepaperScreen.tsx');

let lp = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf8');
lp = lp.replace(/オートバトル\(オセロ\)/g, 'オートバトル(各種ミニゲーム)');
lp = lp.replace(/<li><strong>バトル\(オセロ\):<\/strong> 組み立てたロボットのInt値を元に、様々な相手とオートでオセロ対戦が行えます。勝利で報酬を獲得できます。<\/li>/g, '<li><strong>バトル(各種ミニゲーム):</strong> 組み立てたロボットのInt値を元に、様々な相手とオートでオセロ・三目並べ・石取りゲームの対戦が行えます。勝利で報酬を獲得できます。</li>');
fs.writeFileSync('src/screens/LitepaperScreen.tsx', lp);
