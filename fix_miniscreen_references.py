import re

with open('src/screens/MinigameScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix handleFinish for piano
content = re.sub(
    r"\} else if \(selectedGame === 'piano'\) \{\s*\(engine as any\).addRepairKits\(activePianoDiff\.rewardKits\);\s*\}",
    "} else if (selectedGame === 'piano') {\n        (engine as any).addRepairKits(Math.max(1, Math.ceil(activePianoSong.level / 2)));\n      }",
    content
)

# Fix Result UI for piano
content = re.sub(
    r"<span>クリア報酬 \(\{activePianoDiff\.label\}\): 修理キット \+\{activePianoDiff\.rewardKits\}個<\/span>",
    "<span>クリア報酬 (Lv.{activePianoSong.level}): 修理キット +{Math.max(1, Math.ceil(activePianoSong.level / 2))}個</span>",
    content
)

with open('src/screens/MinigameScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed references in MinigameScreen.tsx")
