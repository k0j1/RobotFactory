const fs = require('fs');
for (const file of ['src/screens/TitleScreen.tsx', 'src/screens/LitepaperScreen.tsx']) {
  let c = fs.readFileSync(file, 'utf-8');
  c = c.replace(/v1\.0\.191/g, 'v1.0.192');
  fs.writeFileSync(file, c);
}

let litepaper = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf-8');
litepaper = litepaper.replace(
  '☆2ランクレッグ（サイバーレッグ等）や☆2ランクアーム（サイバーアーム、ヘビーアーム、バスターアーム等）の高精細パーツ',
  '☆2ランクレッグ（サイバーレッグ等）や☆2ランクアーム（サイバーアーム等）、☆2ランクヘッド（センサーヘッド等）の高精細パーツ'
);
fs.writeFileSync('src/screens/LitepaperScreen.tsx', litepaper);
