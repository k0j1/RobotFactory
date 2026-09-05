const fs = require('fs');
for (const file of ['src/screens/TitleScreen.tsx', 'src/screens/LitepaperScreen.tsx']) {
  let c = fs.readFileSync(file, 'utf-8');
  c = c.replace(/v1\.0\.185/g, 'v1.0.186');
  fs.writeFileSync(file, c);
}

let litepaper = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf-8');
litepaper = litepaper.replace(
  'レッグ（脚部）には「サイバーツインレッグ」「サイバーレッグ」「スプリングガード」の計3種類が☆2ランクとして配備され、',
  'レッグ（脚部）には「サイバーツインレッグ」「サイバーレッグ」「スプリングガード」「シリンダーレッグ」の計4種類が☆2ランクとして配備され、'
);
fs.writeFileSync('src/screens/LitepaperScreen.tsx', litepaper);

