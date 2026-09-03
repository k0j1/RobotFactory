import re

with open('src/screens/MinigameScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove imports related to PianoDifficulty
content = content.replace("PianoDifficulty, PIANO_DIFFICULTIES,", "")
content = content.replace("PianoDifficulty, ", "")

# Remove pianoDifficulty state
content = re.sub(r"const \[pianoDifficulty.*?;\n", "", content)

# Remove activePianoDiff
content = re.sub(r"const activePianoDiff = .*?;\n", "", content)

# Update PianoGame rendering (remove difficulty={pianoDifficulty})
content = content.replace("difficulty={pianoDifficulty} ", "")

# In the piano settings panel, there is a section rendering PIANO_DIFFICULTIES.
# Let's replace the whole difficulty selection div block.
# I will use a regex to remove the <h3 className="font-bold text-stone-200 mb-4">難易度</h3> and the following diff map.
pattern_diff_ui = re.compile(
    r'<div className="bg-stone-800/50 p-6 rounded-xl border border-stone-700/50 flex flex-col">\s*<h3 className="font-bold text-stone-200 mb-4">難易度</h3>.*?</div>\s*</div>',
    re.DOTALL
)

# wait, actually, the piano settings might be a 2 column grid. Let's see how it looks by reading the file.
