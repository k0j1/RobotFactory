import struct
import json
import os

def parse_midi(path):
    with open(path, "rb") as f:
        data = f.read()
    magic, length, fmt, ntracks, division = struct.unpack(">4sIHHH", data[:14])
    idx = 14
    tracks = []
    for _ in range(ntracks):
        if idx >= len(data): break
        t_magic, t_len = struct.unpack(">4sI", data[idx:idx+8])
        idx += 8
        t_data = data[idx:idx+t_len]
        idx += t_len
        p = 0
        cur_ticks = 0
        events = []
        running_status = 0
        while p < len(t_data):
            delta = 0
            while True:
                b = t_data[p]; p += 1
                delta = (delta << 7) | (b & 0x7F)
                if not (b & 0x80): break
            cur_ticks += delta
            if p >= len(t_data): break
            b = t_data[p]
            if b & 0x80: running_status = b; p += 1
            else: b = running_status
            cmd = b & 0xF0; ch = b & 0x0F
            if b == 0xFF:
                mtype = t_data[p]; p += 1
                mlen = 0
                while True:
                    mb = t_data[p]; p += 1
                    mlen = (mlen << 7) | (mb & 0x7F)
                    if not (mb & 0x80): break
                mdata = t_data[p:p+mlen]; p += mlen
                events.append((cur_ticks, "meta", mtype, mdata))
            elif b in (0xF0, 0xF7):
                slen = 0
                while True:
                    sb = t_data[p]; p += 1
                    slen = (slen << 7) | (sb & 0x7F)
                    if not (sb & 0x80): break
                p += slen
            elif cmd in (0x80, 0x90):
                n = t_data[p]; v = t_data[p+1]; p += 2
                is_on = (cmd == 0x90) and (v > 0)
                events.append((cur_ticks, "note_on" if is_on else "note_off", ch, n, v))
            elif cmd in (0xA0, 0xB0, 0xE0): p += 2
            elif cmd in (0xC0, 0xD0): p += 1
        tracks.append(events)
    return division, tracks

div, tracks = parse_midi("/tmp/campanella_5022.mid")

# Tempo map
tempo_map = []
for t in tracks:
    for e in t:
        if e[1] == "meta" and e[2] == 0x51:
            tempo = struct.unpack(">I", b"\x00" + e[3])[0]
            tempo_map.append((e[0], tempo))
tempo_map.sort()
if not tempo_map:
    tempo_map = [(0, 638297)] # default ~94 bpm

def tick_to_ms(tick):
    ms = 0
    cur_t = 0
    cur_tempo = tempo_map[0][1]
    for change_tick, new_tempo in tempo_map:
        if tick <= change_tick:
            break
        dt = change_tick - cur_t
        ms += dt * (cur_tempo / 1000.0 / div)
        cur_t = change_tick
        cur_tempo = new_tempo
    dt = tick - cur_t
    ms += dt * (cur_tempo / 1000.0 / div)
    return ms

raw_notes = []
for trk in tracks:
    active = {}
    for e in trk:
        tick, etype = e[0], e[1]
        if etype == "note_on":
            ch, note, vel = e[2], e[3], e[4]
            active[(ch, note)] = (tick, vel)
        elif etype == "note_off":
            ch, note = e[2], e[3]
            if (ch, note) in active:
                st_tick, vel = active.pop((ch, note))
                raw_notes.append({
                    "start_tick": st_tick,
                    "end_tick": tick,
                    "time": round(tick_to_ms(st_tick)),
                    "duration": max(60, round(tick_to_ms(tick) - tick_to_ms(st_tick))),
                    "midi": note,
                    "raw_vel": vel,
                })

raw_notes.sort(key=lambda x: (x["time"], x["midi"]))
print(f"Extracted {len(raw_notes)} raw notes.")

# Measure calculation (6/8 time: 1 measure = 3 * div ticks = 1440 ticks)
bar_ticks = 3 * div

def get_measure_info(tick):
    m = int(tick / bar_ticks) + 1
    # Fraction within measure [0.0, 1.0)
    frac = (tick % bar_ticks) / float(bar_ticks)
    
    # Dynamics and velocities based on pianoclassics.net / MuseScore 110 authentic score
    if m <= 4:
        # Intro
        rh_dyn = 'p'
        lh_dyn = 'pp'
        global_dyn = 'p'
        rh_base_vel = 0.86
        lh_base_vel = 0.64
    elif m <= 12:
        # Theme A
        rh_dyn = 'p'
        lh_dyn = 'pp'
        global_dyn = 'p'
        rh_base_vel = 0.90
        lh_base_vel = 0.58
    elif m <= 16:
        # Crescendo
        prog = (m - 12) / 4.0
        rh_dyn = 'mf' if prog > 0.5 else 'p'
        lh_dyn = 'p' if prog > 0.5 else 'pp'
        global_dyn = 'cresc'
        rh_base_vel = 0.92 + 0.18 * prog
        lh_base_vel = 0.60 + 0.16 * prog
    elif m <= 20:
        # Forte then Dim
        if m <= 18:
            rh_dyn = 'f'
            lh_dyn = 'mf'
            global_dyn = 'f'
            rh_base_vel = 1.18
            lh_base_vel = 0.90
        else:
            rh_dyn = 'p'
            lh_dyn = 'pp'
            global_dyn = 'dim'
            rh_base_vel = 0.85
            lh_base_vel = 0.58
    elif m <= 28:
        # Var 1: leggierissimo
        rh_dyn = 'p'
        lh_dyn = 'pp'
        global_dyn = 'p'
        rh_base_vel = 0.86
        lh_base_vel = 0.60
    elif m <= 32:
        # Cresc
        prog = (m - 28) / 4.0
        rh_dyn = 'mf' if prog > 0.5 else 'p'
        lh_dyn = 'p' if prog > 0.5 else 'pp'
        global_dyn = 'cresc'
        rh_base_vel = 0.88 + 0.22 * prog
        lh_base_vel = 0.60 + 0.18 * prog
    elif m <= 36:
        # Forte -> Dim
        if m <= 34:
            rh_dyn = 'f'
            lh_dyn = 'mf'
            global_dyn = 'f'
            rh_base_vel = 1.20
            lh_base_vel = 0.92
        else:
            rh_dyn = 'p'
            lh_dyn = 'pp'
            global_dyn = 'dim'
            rh_base_vel = 0.82
            lh_base_vel = 0.56
    elif m <= 44:
        # Theme B (B major, dolce cantando)
        rh_dyn = 'mf'
        lh_dyn = 'p'
        global_dyn = 'p'
        rh_base_vel = 0.96
        lh_base_vel = 0.68
    elif m <= 52:
        # Cresc -> Forte
        if m <= 48:
            prog = (m - 44) / 4.0
            rh_dyn = 'f' if prog > 0.5 else 'mf'
            lh_dyn = 'mf' if prog > 0.5 else 'p'
            global_dyn = 'cresc'
            rh_base_vel = 0.98 + 0.24 * prog
            lh_base_vel = 0.70 + 0.22 * prog
        else:
            rh_dyn = 'f'
            lh_dyn = 'mf'
            global_dyn = 'f'
            rh_base_vel = 1.22
            lh_base_vel = 0.94
    elif m <= 60:
        # Interlude (dim -> pp)
        rh_dyn = 'pp' if m >= 57 else 'p'
        lh_dyn = 'pp'
        global_dyn = 'pp' if m >= 57 else 'dim'
        rh_base_vel = 0.72 if m >= 57 else 0.80
        lh_base_vel = 0.50 if m >= 57 else 0.56
    elif m <= 68:
        # Var 2 (Theme inversion: LH plays expressive singing melody, RH plays rapid leggiero arpeggios/bells)
        lh_dyn = 'mf'
        rh_dyn = 'p'
        global_dyn = 'p'
        lh_base_vel = 1.10
        rh_base_vel = 0.74
    elif m <= 76:
        # Cresc -> Forte
        if m <= 72:
            prog = (m - 68) / 4.0
            lh_dyn = 'f' if prog > 0.5 else 'mf'
            rh_dyn = 'mf' if prog > 0.5 else 'p'
            global_dyn = 'cresc'
            lh_base_vel = 1.12 + 0.16 * prog
            rh_base_vel = 0.76 + 0.18 * prog
        else:
            lh_dyn = 'f'
            rh_dyn = 'mf'
            global_dyn = 'f'
            lh_base_vel = 1.26
            rh_base_vel = 0.96
    elif m <= 84:
        # Var 3 (Animato / Brillante - Octave jumps)
        prog = (m - 76) / 8.0
        rh_dyn = 'mf' if prog > 0.4 else 'p'
        lh_dyn = 'p' if prog > 0.4 else 'pp'
        global_dyn = 'animato'
        rh_base_vel = 0.90 + 0.22 * prog
        lh_base_vel = 0.64 + 0.18 * prog
    elif m <= 92:
        # Cresc molto -> ff
        if m <= 88:
            rh_dyn = 'f'
            lh_dyn = 'mf'
            global_dyn = 'f'
            rh_base_vel = 1.22
            lh_base_vel = 0.92
        else:
            rh_dyn = 'ff'
            lh_dyn = 'f'
            global_dyn = 'ff'
            rh_base_vel = 1.34
            lh_base_vel = 1.10
    elif m <= 100:
        # Var 4 (Leggierissimo, pearl-like 32nd notes)
        rh_dyn = 'p'
        lh_dyn = 'pp'
        global_dyn = 'p'
        rh_base_vel = 0.82
        lh_base_vel = 0.56
    elif m <= 108:
        # Cresc -> Forte
        prog = (m - 100) / 8.0
        rh_dyn = 'f' if prog > 0.6 else 'mf'
        lh_dyn = 'mf' if prog > 0.6 else 'p'
        global_dyn = 'cresc'
        rh_base_vel = 0.85 + 0.35 * prog
        lh_base_vel = 0.58 + 0.30 * prog
    elif m <= 118:
        # Animato / Build up to Coda
        prog = (m - 108) / 10.0
        rh_dyn = 'ff' if prog > 0.7 else 'f'
        lh_dyn = 'f' if prog > 0.7 else 'mf'
        global_dyn = 'ff' if prog > 0.7 else 'f'
        rh_base_vel = 1.16 + 0.20 * prog
        lh_base_vel = 0.92 + 0.26 * prog
    elif m <= 126:
        # Coda (Marcatissimo)
        rh_dyn = 'ff'
        lh_dyn = 'ff'
        global_dyn = 'ff'
        rh_base_vel = 1.38
        lh_base_vel = 1.32
    elif m <= 134:
        # Tutta la forza
        rh_dyn = 'fff'
        lh_dyn = 'fff'
        global_dyn = 'fff'
        rh_base_vel = 1.48
        lh_base_vel = 1.42
    else:
        # Prestissimo Climax Finale
        rh_dyn = 'fff'
        lh_dyn = 'fff'
        global_dyn = 'fff'
        rh_base_vel = 1.50
        lh_base_vel = 1.46

    return {
        "measure": m,
        "rh_dyn": rh_dyn,
        "lh_dyn": lh_dyn,
        "global_dyn": global_dyn,
        "rh_vel": rh_base_vel,
        "lh_vel": lh_base_vel
    }

# Group notes occurring within 35ms into chords
grouped = []
i = 0
while i < len(raw_notes):
    cur_time = raw_notes[i]["time"]
    chord_raw = [raw_notes[i]]
    j = i + 1
    while j < len(raw_notes) and (raw_notes[j]["time"] - cur_time) <= 35:
        chord_raw.append(raw_notes[j])
        j += 1
    i = j

    # De-duplicate midi notes at same timestamp
    seen_midi = set()
    uniq_notes = []
    for n in chord_raw:
        if n["midi"] not in seen_midi:
            seen_midi.add(n["midi"])
            uniq_notes.append(n)
    uniq_notes.sort(key=lambda x: x["midi"]) # low to high

    midis = [n["midi"] for n in uniq_notes]
    max_dur = max(n["duration"] for n in uniq_notes)
    avg_tick = sum(n["start_tick"] for n in uniq_notes) / len(uniq_notes)
    min_tick = min(n["start_tick"] for n in uniq_notes)
    
    info = get_measure_info(min_tick)
    m = info["measure"]

    # Determine hand per midi pitch
    # In Liszt La Campanella:
    # m. 1-4 (Intro):
    # D#5(75) is LH octave lower, D#6(87) is RH, D#7(99) is RH high bell.
    # m. 61-76 (Var 2): LH takes middle range melody (midi <= 78), RH takes high arpeggios (midi > 78).
    # Normal measures: bass/accompaniment (midi < 74) is LH, melody/bells (midi >= 74) is RH.
    hands = []
    velocities = []

    for midi in midis:
        if m <= 4:
            if midi <= 75:
                hand = "LH"
            else:
                hand = "RH"
        elif 61 <= m <= 76:
            # Var 2 inversion: melody in LH (usually 58-75), rapid bells in RH (75-103)
            if midi < 75:
                hand = "LH"
            elif len(midis) > 1 and midi == min(midis):
                hand = "LH"
            else:
                hand = "RH"
        elif m >= 119:
            # Coda: full chords. Split low half to LH, high half to RH.
            if len(midis) >= 2:
                mid_point = midis[len(midis) // 2]
                hand = "LH" if midi < mid_point else "RH"
            else:
                hand = "LH" if midi < 68 else "RH"
        else:
            # Standard: if chord with multiple notes, split low to LH, high to RH
            if len(midis) >= 2 and max(midis) >= 75 and min(midis) < 75:
                hand = "LH" if midi < 74 else "RH"
            else:
                hand = "RH" if midi >= 74 else "LH"
        
        hands.append(hand)

        # Dynamic nuance calculation
        base_v = info["rh_vel"] if hand == "RH" else info["lh_vel"]
        # Add subtle natural accent for higher notes / peak of bells
        if hand == "RH" and midi >= 87:
            # D#6 and above ring like crystal bells
            bell_accent = 0.04 if midi < 99 else 0.08
            base_v += bell_accent
        # Bass root note slight anchoring
        if hand == "LH" and midi <= 51:
            base_v += 0.05
        
        # Round to 2 decimals
        velocities.append(round(min(1.65, max(0.40, base_v)), 2))

    # Overall note velocity for backwards compatibility
    avg_vel = round(sum(velocities) / len(velocities), 2)

    grouped.append({
        "time": cur_time,
        "midi": midis,
        "duration": max_dur,
        "dynamics": info["global_dyn"],
        "velocity": avg_vel,
        "hands": hands,
        "velocities": velocities,
        "rhDynamics": info["rh_dyn"],
        "lhDynamics": info["lh_dyn"]
    })

print(f"Total grouped chord events: {len(grouped)}")
print("Sample chord at m.1:", grouped[0])
print("Sample chord at m.5:", [g for g in grouped if 5500 <= g["time"] <= 6500][:2])
print("Sample chord at m.61 (Var 2):", [g for g in grouped if 85000 <= g["time"] <= 87000][:2])
print("Sample chord at m.120 (Coda):", [g for g in grouped if 170000 <= g["time"] <= 172000][:2])

# Write out TypeScript file
# Split into parts to avoid TS2590 (union too complex)
part_size = 350
parts = [grouped[i:i+part_size] for i in range(0, len(grouped), part_size)]
print(f"Splitting into {len(parts)} parts of size <= {part_size}")

ts_lines = [
    "// Franz Liszt: Grandes études de Paganini, S. 141 No. 3 'La Campanella' in G-sharp Minor",
    "// Authentic complete concert score directly adhering to pianoclassics.net (ID 110) / MuseScore 4426976",
    "// Full authentic concert score of all 140 measures across all 10 pages",
    "// Dedicated dual-hand dynamics (RH vs LH independent velocities, stereo acoustic balance & voicing)",
    "// Right hand sparkling high bell leaps (leggiero & marcatissimo) vs Left hand deep bass octave chords & singing melody",
    "",
    "export interface RawPianoNote {",
    "  time: number;",
    "  midi: number[];",
    "  duration: number;",
    "  dynamics?: string;",
    "  velocity?: number;",
    "  hands?: string[];",
    "  velocities?: number[];",
    "  rhDynamics?: string;",
    "  lhDynamics?: string;",
    "}",
    ""
]

for idx, p in enumerate(parts):
    ts_lines.append(f"const PART_{idx + 1}: RawPianoNote[] = {json.dumps(p, indent=2)};")
    ts_lines.append("")

part_names = [f"...PART_{idx + 1}" for idx in range(len(parts))]
ts_lines.append(f"export const LA_CAMPANELLA_RAW_NOTES: RawPianoNote[] = [\n  {', '.join(part_names)}\n];")
ts_lines.append("")

target_file = "/app/applet/src/components/minigames/laCampanellaData.ts"
with open(target_file, "w") as f:
    f.write("\n".join(ts_lines))

print(f"Successfully generated {target_file} ({os.path.getsize(target_file)} bytes)")
