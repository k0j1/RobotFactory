import re

with open('src/components/minigames/Shared.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import { FUR_ELISE_RAW_NOTES } from './furEliseData';", "import { FUR_ELISE_RAW_NOTES } from './furEliseData';\nimport { LA_CAMPANELLA_RAW_NOTES } from './laCampanellaData';")

# Add processing map
map_code = """
export const LA_CAMPANELLA_NOTES: PianoNoteData[] = LA_CAMPANELLA_RAW_NOTES.map(n => {
  const keyInfos = n.midi.map(m => midiToKeyInfo(m));
  return {
    time: n.time,
    midi: n.midi,
    lanes: keyInfos.map(k => k.lanePos),
    pitches: keyInfos.map(k => k.name),
    duration: n.duration
  };
});
"""
content = content.replace("export const PIANO_SONGS: PianoSong[] = [", map_code + "\nexport const PIANO_SONGS: PianoSong[] = [")

# Add to PIANO_SONGS
campanella_song = """
  { 
    id: 'la_campanella', 
    title: 'ラ・カンパネラ', 
    composer: 'リスト', 
    level: 10, 
    songSpeed: 1.0,
    desc: 'パガニーニ大練習曲 第3番 嬰ト短調。pianoclassics.net (ID 110) 準拠。特徴的な跳躍と高音の鐘の音を再現したテーマ部。', 
    notes: LA_CAMPANELLA_NOTES
  },
"""
content = content.replace("export const PIANO_SONGS: PianoSong[] = [", "export const PIANO_SONGS: PianoSong[] = [" + campanella_song)

with open('src/components/minigames/Shared.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Shared.ts patched with La Campanella.")
