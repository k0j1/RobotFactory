import re

with open('src/components/minigames/Shared.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of PianoDifficulty
match = re.search(r'export type PianoDifficulty = .*?;', content)
if not match:
    print("Could not find PianoDifficulty")
    exit(1)

head = content[:match.start()]

# Find DANMAKU_DIFFICULTIES
match_tail = re.search(r'export const DANMAKU_DIFFICULTIES:', content)
if not match_tail:
    print("Could not find DANMAKU_DIFFICULTIES")
    exit(1)

tail = content[match_tail.start():]

new_piano_code = """
export interface PianoNoteData {
  time: number;
  lanes: number[];
  duration?: number;
}

export interface PianoSong {
  id: string;
  title: string;
  composer: string;
  level: number;
  songSpeed: number;
  bgmUrl?: string;
  desc: string;
  notes: PianoNoteData[];
}

const t = (time: number, lanes: number[], duration: number = 300) => ({ time, lanes: lanes.map(l => l + 7), duration });

const generateLoop = (baseNotes: PianoNoteData[], targetDurationMs: number): PianoNoteData[] => {
  const result: PianoNoteData[] = [];
  if (baseNotes.length === 0) return result;
  const loopDuration = baseNotes[baseNotes.length - 1].time + 1000;
  let currentTime = 1000;
  
  while (currentTime < targetDurationMs) {
    for (const note of baseNotes) {
      if (currentTime + note.time >= targetDurationMs) break;
      result.push({
        time: currentTime + note.time,
        lanes: note.lanes,
        duration: note.duration
      });
    }
    currentTime += loopDuration;
  }
  return result;
};

// -- Original 3 Songs --
const elegyBass = [
  t(0, [9], 1900), t(2000, [8], 1900), t(4000, [6], 1900), t(6000, [4], 1900),
  t(8000, [2], 1900), t(10000, [4], 1900), t(12000, [6], 1900), t(14000, [8], 1900)
];
const elegyMelody = [
  t(0, [16, 20], 800), t(1000, [15, 19], 800), t(2000, [14, 18], 1800),
  t(4000, [13, 17], 800), t(5000, [12, 16], 800), t(6000, [11, 15], 1800),
  t(8000, [9, 13], 800), t(9000, [11, 15], 800), t(10000, [13, 17], 1800),
  t(12000, [14, 18], 800), t(13000, [15, 19], 800), t(14000, [16, 20], 1800)
];
const elegyOriginal = [...elegyBass, ...elegyMelody].sort((a, b) => a.time - b.time);

const yumeBass = [
  t(0, [9], 1900), t(2000, [11], 1900), t(4000, [13], 1900), t(6000, [14], 1900),
  t(8000, [16], 1900), t(10000, [14], 1900), t(12000, [13], 1900), t(14000, [11], 1900)
];
const yumeMelody = [
  t(0, [16, 20, 23], 1800), t(2000, [18, 22, 25], 1800), t(4000, [20, 24, 27], 1800), t(6000, [21, 25, 28], 1800),
  t(8000, [23, 27, 30], 1800), t(10000, [21, 25, 28], 1800), t(12000, [20, 24, 27], 1800), t(14000, [18, 22, 25], 1800)
];
const yumeOriginal = [...yumeBass, ...yumeMelody].sort((a, b) => a.time - b.time);

const kiriBass = [
  t(0, [9], 1900), t(2000, [7], 1900), t(4000, [6], 1900), t(6000, [4], 1900),
  t(8000, [2], 1900), t(10000, [5], 1900), t(12000, [9], 1900), t(14000, [7], 1900)
];
const kiriMelody = [
  t(0, [16, 20], 180), t(200, [13], 180), t(400, [16], 180), t(600, [13], 180), t(800, [16], 180), t(1000, [15, 19], 180), t(1200, [12], 180), t(1400, [15], 180), t(1600, [12], 180), t(1800, [15], 180),
  t(2000, [14, 18], 180), t(2200, [11], 180), t(2400, [14], 180), t(2600, [11], 180), t(2800, [14], 180), t(3000, [15, 19], 180), t(3200, [12], 180), t(3400, [15], 180), t(3600, [12], 180), t(3800, [15], 180),
  t(4000, [13, 17], 180), t(4200, [10], 180), t(4400, [13], 180), t(4600, [10], 180), t(4800, [13], 180), t(5000, [12, 16], 180), t(5200, [9], 180), t(5400, [12], 180), t(5600, [9], 180), t(5800, [12], 180),
  t(6000, [11, 15], 180), t(6200, [8], 180), t(6400, [11], 180), t(6600, [8], 180), t(6800, [11], 180), t(7000, [12, 16], 180), t(7200, [9], 180), t(7400, [12], 180), t(7600, [9], 180), t(7800, [12], 180),
  t(8000, [9, 13], 180), t(8200, [6], 180), t(8400, [9], 180), t(8600, [6], 180), t(8800, [9], 180), t(9000, [11, 15], 180), t(9200, [8], 180), t(9400, [11], 180), t(9600, [8], 180), t(9800, [11], 180),
  t(10000, [12, 16], 180), t(10200, [9], 180), t(10400, [12], 180), t(10600, [9], 180), t(10800, [12], 180), t(11000, [14, 18], 180), t(11200, [11], 180), t(11400, [14], 180), t(11600, [11], 180), t(11800, [14], 180),
  t(12000, [16, 20], 180), t(12200, [13], 180), t(12400, [16], 180), t(12600, [13], 180), t(12800, [16], 180), t(13000, [15, 19], 180), t(13200, [12], 180), t(13400, [15], 180), t(13600, [12], 180), t(13800, [15], 180),
  t(14000, [14, 18], 180), t(14200, [11], 180), t(14400, [14], 180), t(14600, [11], 180), t(14800, [14], 180), t(15000, [12, 16], 180), t(15200, [9], 180), t(15400, [12], 180), t(15600, [9], 180), t(15800, [12], 180)
];
const kiriOriginal = [...kiriBass, ...kiriMelody].sort((a, b) => a.time - b.time);

// Helper for generating new classical songs
const gM = (chords: number[][], stepMs: number, reps: number): PianoNoteData[] => {
  const res: PianoNoteData[] = [];
  let tCounter = 0;
  for (let r = 0; r < reps; r++) {
    for (const c of chords) {
      for (const note of c) {
        res.push(t(tCounter, [note], stepMs - 20));
        tCounter += stepMs;
      }
    }
  }
  return res;
};
const gC = (chords: number[][], stepMs: number, reps: number): PianoNoteData[] => {
  const res: PianoNoteData[] = [];
  let tCounter = 0;
  for (let r = 0; r < reps; r++) {
    for (const c of chords) {
      res.push(t(tCounter, c, stepMs - 20));
      tCounter += stepMs;
    }
  }
  return res;
};

// --- Song 4: Ode to Joy (Level 1) ---
const odeMelody = gC([
  [16], [16], [17], [18], [18], [17], [16], [15], [14], [14], [15], [16], [16], [15], [15], [15],
  [16], [16], [17], [18], [18], [17], [16], [15], [14], [14], [15], [16], [15], [14], [14], [14]
], 500, 1);
const odeBass = gC([
  [9, 11], [9, 11], [9, 11], [9, 11], [11, 13], [11, 13], [11, 13], [11, 13]
], 2000, 1);
const odeOriginal = [...odeBass, ...odeMelody].sort((a, b) => a.time - b.time);

// --- Song 5: Twinkle Twinkle (Level 1) ---
const twinkleMelody = gC([
  [14], [14], [18], [18], [19], [19], [18], [18],
  [17], [17], [16], [16], [15], [15], [14], [14]
], 500, 1);
const twinkleBass = gC([
  [7], [7], [9], [9], [11], [11], [9], [9],
  [11], [11], [9], [9], [7], [7], [7], [7]
], 500, 1);
const twinkleOriginal = [...twinkleBass, ...twinkleMelody].sort((a, b) => a.time - b.time);

// --- Song 6: Canon in D (Level 5) ---
const canonChords = [
  [14, 16, 18], [13, 15, 17], [11, 13, 15], [10, 12, 14],
  [9, 11, 13], [7, 9, 11], [9, 11, 13], [13, 15, 17]
];
const canonMelody = gC(canonChords, 1000, 2);
const canonBass = gM([
  [2, 9, 14, 9], [1, 8, 13, 8], [-1, 6, 11, 6], [-2, 5, 10, 5],
  [-3, 4, 9, 4], [-5, 2, 7, 2], [-3, 4, 9, 4], [1, 8, 13, 8]
], 250, 2);
const canonOriginal = [...canonBass, ...canonMelody].sort((a, b) => a.time - b.time);

// --- Song 7: Turkish March (Level 6) ---
const turkishMelody = gM([
  [18, 17, 18, 19, 18, 17, 18, 20], [18, 17, 18, 19, 18, 17, 18, 20],
  [21, 20, 21, 22, 21, 20, 21, 23], [21, 20, 21, 22, 21, 20, 21, 23]
], 150, 2);
const turkishBass = gC([
  [9, 13], [9, 13], [11, 14], [11, 14], [9, 13], [9, 13], [11, 14], [11, 14]
], 600, 2);
const turkishOriginal = [...turkishBass, ...turkishMelody].sort((a, b) => a.time - b.time);

// --- Song 8: Fantaisie-Impromptu (Level 8) ---
// Right hand 16th notes vs Left hand triplet arpeggios
const fiMelody = gM([
  [23, 22, 23, 24, 23, 22, 23, 25, 24, 23, 24, 26, 25, 24, 25, 27]
], 100, 2);
const fiBass = gM([
  [9, 16, 21, 16, 21, 16], [9, 15, 20, 15, 20, 15],
  [8, 15, 20, 15, 20, 15], [8, 14, 19, 14, 19, 14]
], 133.33, 2); // 4 notes in right vs 3 notes in left approx
const fiOriginal = [...fiBass, ...fiMelody].sort((a, b) => a.time - b.time);

// --- Song 9: Revolutionary Etude (Level 9) ---
const revMelody = gC([
  [16, 20, 23], [15, 19, 22], [14, 18, 21], [13, 17, 20]
], 800, 4);
const revBass = gM([
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6],
  [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
], 50, 4); // Very fast downward/upward sweeps
const revOriginal = [...revBass, ...revMelody].sort((a, b) => a.time - b.time);

// --- Song 10: Moonlight Sonata 3rd Mvt (Level 10) ---
const moonMelody = gC([
  [20, 23], [20, 23], [20, 23], [21, 24], [21, 24], [21, 24], [23, 26], [23, 26]
], 400, 4);
const moonBass = gM([
  [2, 4, 6, 9, 11, 14, 16, 18], [2, 4, 6, 9, 11, 14, 16, 18],
  [1, 4, 6, 8, 11, 13, 16, 18], [1, 4, 6, 8, 11, 13, 16, 18]
], 100, 4); // Presto agitato arpeggios
const moonOriginal = [...moonBass, ...moonMelody].sort((a, b) => a.time - b.time);


export const PIANO_SONGS: PianoSong[] = [
  { 
    id: 'ode_to_joy', title: '歓喜の歌', composer: 'ベートーヴェン', level: 1, songSpeed: 1.0,
    desc: 'もっとも易しい入門曲。ゆったりとしたテンポで基本の和音とメロディを学びます。', 
    notes: generateLoop(odeOriginal, 30000)
  },
  { 
    id: 'twinkle_star', title: 'きらきら星', composer: 'フランス民謡', level: 1, songSpeed: 1.0,
    desc: '誰もが知る優しいメロディ。基本的なリズム感覚を養うための楽曲です。', 
    notes: generateLoop(twinkleOriginal, 30000)
  },
  { 
    id: 'elegy', title: 'エレジー', composer: '甘茶の音楽工房', level: 2, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/elegy.mp3',
    desc: '悲哀に満ちた美しいピアノ曲。伴奏とメロディの絡み合いが楽しめます。', 
    notes: generateLoop(elegyOriginal, 30000)
  },
  { 
    id: 'yume', title: '夢', composer: '甘茶の音楽工房', level: 3, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/yume.mp3',
    desc: '穏やかで幻想的なピアノ曲。和音の響きを意識した演奏が求められます。', 
    notes: generateLoop(yumeOriginal, 30000)
  },
  { 
    id: 'natsunokiri', title: '夏の霧', composer: '甘茶の音楽工房', level: 4, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/natsunokiri.mp3',
    desc: '静かで少しテンポの速い、霧のように繊細なピアノ曲。16分音符の細かな動きが含まれます。', 
    notes: generateLoop(kiriOriginal, 30000)
  },
  { 
    id: 'canon_in_d', title: 'カノン', composer: 'パッヘルベル', level: 5, songSpeed: 1.0,
    desc: '世界でもっとも有名なコード進行。左手の幅広いアルペジオと美しい旋律が特徴。', 
    notes: generateLoop(canonOriginal, 30000)
  },
  { 
    id: 'turkish_march', title: 'トルコ行進曲', composer: 'モーツァルト', level: 6, songSpeed: 1.0,
    desc: '軽快でリズミカルな楽曲。高速の装飾音符とスタッカートの弾き分けが鍵になります。', 
    notes: generateLoop(turkishOriginal, 30000)
  },
  { 
    id: 'fantaisie_impromptu', title: '幻想即興曲', composer: 'ショパン', level: 8, songSpeed: 1.0,
    desc: '右手の16分音符と左手の3連符が交錯するポリリズムの難曲。極めて高い技巧を要します。', 
    notes: generateLoop(fiOriginal, 30000)
  },
  { 
    id: 'revolutionary_etude', title: '革命のエチュード', composer: 'ショパン', level: 9, songSpeed: 1.0,
    desc: '左手の超絶的な高速パッセージと右手の力強い和音が炸裂するピアノ曲の最高峰の1つ。', 
    notes: generateLoop(revOriginal, 30000)
  },
  { 
    id: 'moonlight_3rd', title: '月光第3楽章', composer: 'ベートーヴェン', level: 10, songSpeed: 1.0,
    desc: '嵐のような激情の分散和音。並外れた指の回転と力強さが求められる極限のボス曲。', 
    notes: generateLoop(moonOriginal, 30000)
  }
];

"""

with open('src/components/minigames/Shared.ts', 'w', encoding='utf-8') as f:
    f.write(head + new_piano_code + tail)

print("Updated Shared.ts")
