const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/CombatGame.tsx', 'utf-8');

// Replace "ファイター詳細スペック・繰り出した技" with "ステータス詳細"
content = content.replace(
  '<span>ファイター詳細スペック・繰り出した技</span>',
  '<span>ステータス詳細</span>'
);

content = content.replace(
  '<span>技の解説・図鑑</span>',
  '<span>図鑑</span>'
);

content = content.replace(
  '{showDetailCards ? \'詳細をたたむ ▲\' : \'詳細をひらく ▼\'}',
  '{showDetailCards ? \'閉じる ▲\' : \'開く ▼\'}'
);

content = content.replace(
  '<span>繰り出した技！</span>',
  '<span>NEW SKILL!</span>'
);

content = content.replace(
  '<div className="text-[11px] text-stone-300 leading-tight">\n                  {learnedBanner.desc}\n                </div>',
  '<div className="text-[10px] text-stone-300 leading-tight">\n                  {learnedBanner.shortDesc || learnedBanner.desc}\n                </div>'
);

fs.writeFileSync('src/components/minigames/CombatGame.tsx', content);
