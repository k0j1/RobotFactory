import re

with open('src/components/minigames/BattleChestRewardService.ts', 'r') as f:
    content = f.read()

# Remove repairKits logic
content = re.sub(r'if \(checkRate\(\d+\)\) repairKits \+= [^;]+;\s*', '', content)
content = re.sub(r'repairKits \+= [^;]+;\s*', '', content)

# Fix empty chest fallback
content = re.sub(r'if \(level <= 4 && repairKits === 0 && gold === 0 && materials.length === 0\) \{\s*repairKits = 0;\s*\}', 
                 'if (level <= 4 && gold === 0 && materials.length === 0) { gold = randomInt(5, 10); }', content)

# Fix missing initializations that might have been lost or we can just leave `let repairKits = 0;` alone and it will always be 0.
content = re.sub(r'let repairKits = 1;', 'let repairKits = 0;', content)
content = re.sub(r'repairKits = [1-9];', 'repairKits = 0;', content)

with open('src/components/minigames/BattleChestRewardService.ts', 'w') as f:
    f.write(content)
