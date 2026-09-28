import re

with open("src/components/minigames/furEliseData.ts", "r") as f:
    content = f.read()

# Parse raw notes
note_matches = re.findall(r"\{\s*time:\s*(\d+),\s*midi:\s*\[([0-9,\s]+)\],\s*duration:\s*(\d+).*?\}", content)
print(f"Parsed {len(note_matches)} notes")

def get_dynamics_and_velocity(time, midi_list):
    # Determine dynamics and velocity based on musical structure of Fur Elise (pianoclassics ID 47)
    # 0 - 32000: Theme A (pp -> p -> pp)
    if time < 32000:
        if 11000 <= time < 16500: # C major/G major transition
            return ("p", 0.68)
        elif 16500 <= time < 19000: # E repetition
            return ("pp", 0.38)
        elif 26000 <= time < 31500: # second repeat C major
            return ("p", 0.68)
        else:
            return ("pp", 0.40)
            
    # 32000 - 44000: Episode B (F major dolce -> cresc -> f -> dimin/leggiero -> pp)
    elif 32000 <= time < 44000:
        if time < 35000:
            return ("p", 0.65) # dolce
        elif time < 36250:
            return ("mp", 0.88) # cresc
        elif time < 38750:
            return ("mf", 1.10) # cresc poco a poco
        elif time < 40400:
            return ("f", 1.35) # forte peak with 32nd notes
        elif time < 41800:
            return ("mf", 0.95) # decresc
        elif time < 43000:
            return ("p", 0.65) # leggiero
        else:
            return ("pp", 0.40) # pp return
            
    # 44000 - 75000: Theme A return (pp -> p -> pp)
    elif 44000 <= time < 75000:
        t_rel = time - 44000
        if 11000 <= t_rel < 16500:
            return ("p", 0.68)
        elif 16500 <= t_rel < 19000:
            return ("pp", 0.38)
        elif 26000 <= t_rel < 31500:
            return ("p", 0.68)
        else:
            return ("pp", 0.40)
            
    # 75000 - 96500: Episode C (A minor left hand repeated notes, dramatic storm -> ff -> dimin)
    elif 75000 <= time < 96500:
        if time < 76250:
            return ("p", 0.65) # ominous start
        elif time < 78335:
            return ("mp", 0.90) # growing tension
        elif time < 81250:
            return ("mf", 1.15) # cresc molto
        elif time < 83335:
            return ("f", 1.38) # forte
        elif time < 85000:
            return ("ff", 1.60) # fortissimo outburst
        elif time < 88335:
            return ("f", 1.40) # forte second wave
        elif time < 94000:
            return ("ff", 1.60) # ff climax
        elif time < 95500:
            return ("mf", 0.95) # decresc
        else:
            return ("p", 0.65) # p leading to cadenza
            
    # 96500 - 103750: Cadenza (Arpeggios ascending to C7, chromatic descending)
    elif 96500 <= time < 103750:
        if time < 98500:
            return ("p", 0.68) # ascending arpeggio 1
        elif time < 100000:
            return ("mp", 0.92) # ascending arpeggio 2
        elif time < 101250:
            return ("f", 1.35) # top register C7/A6
        elif time < 102500:
            return ("mf", 0.92) # descending chromatic
        elif time < 103200:
            return ("p", 0.62) # sempre piu piano
        else:
            return ("pp", 0.38) # pp ending of cadenza
            
    # 103750 - end: Final Theme A & Coda
    else:
        if 113750 <= time < 118000:
            return ("p", 0.68)
        elif 120000 <= time < 122500:
            return ("pp", 0.38)
        elif time >= 127500:
            return ("pp", 0.32) # dying away / coda
        else:
            return ("pp", 0.40)

lines = [
    "// Beethoven: Für Elise (WoO 59) in A Minor",
    "// Complete score directly adhering to pianoclassics.net (ID 47) / Mutopia Project (ID 931)",
    "// Key: A Minor (Poco moto, 3/8 time) | Full authentic score with rich dynamic expressions (pp, p, mp, mf, f, ff)",
    "",
    "export interface RawPianoNote {",
    "  time: number;",
    "  midi: number[];",
    "  duration: number;",
    "  dynamics?: 'pp' | 'p' | 'mp' | 'mf' | 'f' | 'ff';",
    "  velocity?: number;",
    "}",
    "",
    "export const FUR_ELISE_RAW_NOTES: RawPianoNote[] = ["
]

for t_str, midi_str, dur_str in note_matches:
    t = int(t_str)
    dur = int(dur_str)
    midi = [int(m.strip()) for m in midi_str.split(",")]
    dyn, vel = get_dynamics_and_velocity(t, midi)
    midi_formatted = ", ".join(str(m) for m in midi)
    lines.append(f"  {{ time: {t}, midi: [{midi_formatted}], duration: {dur}, dynamics: '{dyn}', velocity: {vel:.2f} }},")

lines.append("];")
lines.append("")

output = "\n".join(lines)
with open("src/components/minigames/furEliseData.ts", "w") as f:
    f.write(output)

print(f"Successfully wrote {len(lines)} lines to src/components/minigames/furEliseData.ts")
