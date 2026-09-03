import re

with open('src/screens/MinigameScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove imports
content = re.sub(r'PianoDifficulty(Config)?,\s*', '', content)
content = content.replace("PIANO_DIFFICULTIES, ", "")

# Remove pianoDifficulty state
content = re.sub(r"const \[pianoDifficulty.*?;\n", "", content)

# Remove activePianoDiff
content = re.sub(r"const activePianoDiff = .*?;\n", "", content)

# Modify getEstimatedPianoWinRate
content = re.sub(
    r"const getEstimatedPianoWinRate = \(songId: string, diffId: string, robot: any\) => \{.*?\n\s*const song = PIANO_SONGS\.find\(s => s\.id === songId\).*?\n.*?let rate = 0;.*?\n\s*return Math\.max\(1, Math\.min\(99, Math\.floor\(rate\)\)\);\n\s*\};",
    """const getEstimatedPianoWinRate = (songId: string, robot: any) => {
    if (!robot) return '--';
    const song = PIANO_SONGS.find(s => s.id === songId) || PIANO_SONGS[0];
    const score = (robot.stats.agility * 1.5 + robot.stats.dexterity * 1.5) / 2;
    let rate = score * 1.2 - (song.level * 8);
    return Math.max(1, Math.min(99, Math.floor(rate)));
  };""",
    content,
    flags=re.DOTALL
)

# Update the renderGame call (remove difficulty={pianoDifficulty})
content = content.replace("difficulty={pianoDifficulty} ", "")

# In the song map, update "難易度: {song.baseDifficulty}" to "Lv.{song.level}"
content = content.replace("難易度: {song.baseDifficulty}", "Lv.{song.level}")

# Remove the "テンポ・難易度" card
card_pattern = r'\{\/\* 難易度選択 \*\/\}.*?<\/Card>'
content = re.sub(card_pattern, '', content, flags=re.DOTALL)

with open('src/screens/MinigameScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated MinigameScreen.tsx")
