const fs = require('fs');
let content = fs.readFileSync('src/screens/LitepaperScreen.tsx', 'utf-8');

content = content.replace(
  '<li><strong>音楽（ピアノ演奏）:</strong> 演奏曲をベートーヴェンの世界的名曲<strong>「エリーゼのために」</strong>（バガテル WoO 59、pianoclassics.net ID 47準拠、全662ノーツ）に一新。一曲すべてを弾き切る本格的なピアノ演奏演習です。ロボットの<strong>「賢さ (Int)」</strong>（楽曲・譜面理解・リズム把握）と<strong>「器用さ (Dex)」</strong>（運指・正確な鍵盤打鍵）の値が高いほど正確なタイミングで鍵盤が叩かれ、より高い評価（EXCELLENTなど）を獲得しやすくなります。',
  '<li><strong>音楽（ピアノ演奏）:</strong> 演奏曲にベートーヴェンの<strong>「エリーゼのために」</strong>に加え、超難関曲であるモーツァルトの<strong>「トルコ行進曲」</strong>（イ長調 K. 331 第3楽章）を追加。ロボットの<strong>「賢さ (Int)」</strong>（楽曲・譜面理解・リズム把握）と<strong>「器用さ (Dex)」</strong>（運指・正確な鍵盤打鍵）の値が高いほど正確なタイミングで鍵盤が叩かれます。'
);

content = content.replace(
  '<li><strong>シューティング（弾幕回避）:</strong>',
  '<li><strong>バトル演習UIの改善:</strong> バトル中のステータスカードをアイコン中心に変更し、能力値や技の詳細を視覚的に把握しやすく改善しました。</li>\n              <li><strong>シューティング（弾幕回避）:</strong>'
);

fs.writeFileSync('src/screens/LitepaperScreen.tsx', content);
