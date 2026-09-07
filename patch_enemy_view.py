with open('src/components/minigames/defense/EnemyRobotView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the boss aura effects
import re
content = re.sub(
    r"\{\s*/\*\s*ボス用警戒オーラ\s*\*/\s*\}\s*\{isBoss\s*&&\s*\(\s*<div[^>]+animate-ping[^>]+/>\s*\)\s*\}\s*\{enemy\.type\s*===\s*'super_giant_boss'\s*&&\s*\(\s*<div[^>]+animate-spin[^>]+/>\s*\)\s*\}\s*\{enemy\.type\s*===\s*'sprinter'\s*&&\s*\(\s*<div[^>]+animate-pulse[^>]+/>\s*\)\s*\}",
    "",
    content,
    flags=re.MULTILINE
)

with open('src/components/minigames/defense/EnemyRobotView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("EnemyRobotView patched")
