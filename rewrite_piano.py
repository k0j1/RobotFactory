import re

with open('src/components/minigames/PianoGame.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove PianoDifficulty imports
content = content.replace("MinigameProps, PianoDifficulty, PIANO_DIFFICULTIES, PIANO_SONGS", "MinigameProps, PIANO_SONGS")

# 2. Update Props
content = re.sub(r'difficulty: PianoDifficulty;\n', '', content)

# 3. Update component signature
content = content.replace("  difficulty,\n", "")
content = content.replace("difficulty={pianoDifficulty}", "") # wait, this is in MinigameScreen.tsx

# 4. Remove diffConfig and currentNotes definitions
content = re.sub(r"const diffConfig = PIANO_DIFFICULTIES.*?;\n", "", content)
content = re.sub(r"const currentNotes = difficulty === 'hard'.*?;\n", "const currentNotes = song.notes;\n", content)

# 5. Fix reqRatio and targetScore
content = re.sub(
    r"const reqRatio = diffConfig\.id === 'hard' \? 0\.75 : diffConfig\.id === 'normal' \? 0\.55 : 0\.40;",
    "const reqRatio = 0.5 + (song.level * 0.02);",
    content
)

# 6. Fix diffPenalty
content = re.sub(
    r"const diffPenalty = diffConfig\.id === 'hard' \? 40 : diffConfig\.id === 'normal' \? 20 : 0;",
    "const diffPenalty = song.level * 4;",
    content
)

# 7. Fix UI badge
content = re.sub(
    r"<div className=\{`text-xs font-bold px-2 py-1 rounded border inline-block mb-1 \$\{diffConfig\.badgeClass\}`\}>\s*\{diffConfig\.label\}\s*</div>",
    "<div className=\"text-xs font-bold px-2 py-1 rounded border inline-block mb-1 bg-amber-100 text-amber-800 border-amber-300\">\n            Lv.{song.level} {song.title}\n          </div>",
    content
)

# 8. Dependency arrays
content = content.replace("difficulty, song, maxTime", "song, maxTime")
content = content.replace("songId, difficulty, song", "songId, song")

with open('src/components/minigames/PianoGame.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated PianoGame.tsx")
