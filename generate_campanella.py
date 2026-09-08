import json

notes = []
current_time = 0
duration = 200 # approx 16th note

def add_note(midi_num, dur):
    global current_time
    notes.append({"time": current_time, "midi": [midi_num], "duration": dur})
    current_time += dur

def add_chord(midi_nums, dur):
    global current_time
    notes.append({"time": current_time, "midi": midi_nums, "duration": dur})
    current_time += dur

# Intro
for i in range(2):
    add_note(87, duration) # D#6
    add_note(75, duration) # D#5
    add_note(87, duration)
    add_note(75, duration)
    add_note(87, duration)
    add_note(87, duration)

# Theme 1
# D#6, D#5, D#6, D#5, D#6, C#6
add_note(87, duration)
add_note(75, duration)
add_note(87, duration)
add_note(75, duration)
add_note(87, duration)
add_note(85, duration) # C#6

# B5, A#5, G#5, Fx5(G5) -> G#5
add_note(83, duration) # B5
add_note(82, duration) # A#5
add_note(80, duration) # G#5
add_note(75, duration) # D#5
add_note(80, duration) # G#5
add_note(80, duration) # G#5

# Theme 2
# C#6, C#5, C#6, C#5, C#6, B5
add_note(85, duration)
add_note(73, duration)
add_note(85, duration)
add_note(73, duration)
add_note(85, duration)
add_note(83, duration) # B5

# A#5, G#5, Fx5(G5), D#5 -> G#5
add_note(82, duration) # A#5
add_note(80, duration) # G#5
add_note(79, duration) # G5 (Fx)
add_note(75, duration) # D#5
add_note(80, duration) # G#5
add_note(80, duration) # G#5

# Second part of theme (octaves/jumps)
# It's recognizable enough with this length. Let's make it a bit longer.
# Let's repeat the theme slightly differently as in the score.

# Intro again
for i in range(2):
    add_note(87, duration)
    add_note(75, duration)
    add_note(87, duration)
    add_note(75, duration)
    add_note(87, duration)
    add_note(87, duration)

ts_content = f"""// Liszt: La Campanella (Paganini Etude No. 3)
// Simplified Main Theme

export interface RawPianoNote {{
  time: number;
  midi: number[];
  duration: number;
}}

export const LA_CAMPANELLA_RAW_NOTES: RawPianoNote[] = {json.dumps(notes, indent=2)};
"""

with open('src/components/minigames/laCampanellaData.ts', 'w') as f:
    f.write(ts_content)

print("laCampanellaData.ts generated.")
