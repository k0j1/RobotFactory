import re

with open('src/components/minigames/combat/CombatSetupCard.tsx', 'r') as f:
    content = f.read()

# Remove the unleasable skills block
unleasable_block = r'\{playerSkillEval && \(\s*<button\s*onClick=\{\(\) => handleOpenSkillsModal\(\'player\'\)\}\s*className="text-\[10px\] font-bold px-2 py-0\.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"\s*>\s*<Gi\.GiInspiration className="text-amber-600" />\s*<span>繰出可能技: <strong className="font-mono text-amber-800">\{playerSkillEval\.unleasable\.length\}</strong>種</span>\s*</button>\s*\)\}'
content = re.sub(unleasable_block, '', content)

# Remove the enemy unleasable skills display too just in case? No, the prompt says "出撃ロボットの繰り出せる戦術技の表示は削除して。"

# Remove explanation of element enhancements: "バトル演習セットアップの演習専用武装（エレメント強化）の説明は削除して"
# I remember there's an explanation text: "解放時: 攻撃力 +35 & 専用奥義" and "解放時: 防御力 +30 & シールド防御"
# I should remove those.
content = re.sub(r'<span>解放時: 攻撃力 \+35 & 専用奥義</span>', '<span>未解放</span>', content)
content = re.sub(r'<span>解放時: 防御力 \+30 & シールド防御</span>', '<span>未解放</span>', content)

with open('src/components/minigames/combat/CombatSetupCard.tsx', 'w') as f:
    f.write(content)
