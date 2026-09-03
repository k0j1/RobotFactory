import re

with open('src/screens/MinigameScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("activePianoSong.label", "activePianoSong.title")

with open('src/screens/MinigameScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed label error")
