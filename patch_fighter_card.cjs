const fs = require('fs');
let content = fs.readFileSync('src/components/minigames/combat/CombatFighterCard.tsx', 'utf-8');

// Replace stat names with icons
content = content.replace(
  '<div className="text-[9px] text-stone-500 font-sans">Pow</div>',
  '<div className="text-[12px] text-red-600 flex justify-center"><Gi.GiBroadsword /></div>'
);
content = content.replace(
  '<div className="text-[9px] text-stone-500 font-sans">Def</div>',
  '<div className="text-[12px] text-blue-600 flex justify-center"><Gi.GiShield /></div>'
);
content = content.replace(
  '<div className="text-[9px] text-stone-500 font-sans">Agi</div>',
  '<div className="text-[12px] text-amber-600 flex justify-center"><Gi.GiSprint /></div>'
);
content = content.replace(
  '<div className="text-[9px] text-stone-500 font-sans">Dex</div>',
  '<div className="text-[12px] text-emerald-600 flex justify-center"><Gi.GiTargetAimed /></div>'
);
content = content.replace(
  '<div className="text-[9px] text-stone-500 font-sans">Int</div>',
  '<div className="text-[12px] text-purple-600 flex justify-center"><Gi.GiBrain /></div>'
);

content = content.replace(
  '<span>必要知性: Int {s.reqInt}以上</span>',
  '<span className="flex items-center gap-1"><Gi.GiBrain /> {s.reqInt}+</span>'
);

content = content.replace(
  '<span>再使用CD: {s.cooldownSeconds}秒 {cd > 0 ? `(待機: ${Math.ceil(cd)}s)` : \'（即時発動可）\'}</span>',
  '<span className="flex items-center gap-1"><Gi.GiHourglass /> {s.cooldownSeconds}s {cd > 0 ? `(${Math.ceil(cd)}s)` : \'OK\'}</span>'
);

content = content.replace(
  '<span>行動時に知性で発動</span>',
  '<span>自動発動</span>'
);
content = content.replace(
  'タップで説明表示',
  'タップで詳細'
);

fs.writeFileSync('src/components/minigames/combat/CombatFighterCard.tsx', content);
