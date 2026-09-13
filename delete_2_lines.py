import re

with open('src/components/minigames/MinigameDashboard.tsx', 'r') as f:
    content = f.read()

# Compact mode deletions
content = re.sub(r'<span className="text-\[10px\] text-amber-900 font-mono font-bold">総合演習階級</span>', '', content)
content = re.sub(r'<div className="text-xs font-bold text-stone-700 mt-0\.5">\s*全競技マスターステータス\s*</div>', '', content)

# Detailed mode deletions
content = re.sub(r'<span className="text-\[10px\] font-mono text-stone-500 font-bold">\s*OVERALL EVALUATION\s*</span>', '', content)
content = re.sub(r'<h3 className="text-lg sm:text-xl font-black text-amber-950 tracking-wide font-mono">\s*総合演習戦績マスター\s*</h3>', '', content)

with open('src/components/minigames/MinigameDashboard.tsx', 'w') as f:
    f.write(content)
