import re

with open('src/components/minigames/PianoGame.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace accuracy logic
content = content.replace("精度 80%", "精度 90%")
content = content.replace("精度80.0%以上", "精度90.0%以上")
content = content.replace("accuracyPercent >= 80", "accuracyPercent >= 90")
content = content.replace("left-[80%]", "left-[90%]")

with open('src/components/minigames/PianoGame.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
