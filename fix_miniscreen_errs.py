import re

with open('src/screens/MinigameScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("baseDifficulty", "level")

content = re.sub(
    r"activePianoDiff\.",
    "activePianoSong.",
    content
)

content = re.sub(
    r"\{activePianoDiff\?\.rewardKits\}",
    "{Math.max(1, Math.ceil(activePianoSong.level / 2))}",
    content
)

with open('src/screens/MinigameScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed more references")
