import re

content = open("src/components/minigames/PianoGame.tsx", "r").read()

# Add currentNotes
content = re.sub(
    r"const maxTime = song\.notes\[song\.notes\.length - 1\]\.time \+ 1000;",
    """const currentNotes = difficulty === 'hard' ? song.notesHard : difficulty === 'easy' ? song.notesEasy : song.notesNormal;
  const maxTime = currentNotes[currentNotes.length - 1].time + 1000;""",
    content
)

content = re.sub(
    r"const maxPossibleScore = song\.notes\.reduce",
    "const maxPossibleScore = currentNotes.reduce",
    content
)

content = re.sub(
    r"const tempoMultiplier = diffConfig\.id === 'hard' \? 3\.0 : diffConfig\.id === 'normal' \? 2\.0 : 1\.0;",
    "const tempoMultiplier = 1.0;",
    content
)

content = re.sub(
    r"const note = song\.notes\[nextNoteIdx\.current\];",
    "const note = currentNotes[nextNoteIdx.current];",
    content
)

content = re.sub(
    r"song\.notes\[nextNoteIdx\.current\]\.time",
    "currentNotes[nextNoteIdx.current].time",
    content
)

content = re.sub(
    r"\{song\.notes\.map\(\(note, idx\) => \{",
    "{currentNotes.map((note, idx) => {",
    content
)

with open("src/components/minigames/PianoGame.tsx", "w") as f:
    f.write(content)

