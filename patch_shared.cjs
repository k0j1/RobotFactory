const fs = require('fs');

let content = fs.readFileSync('src/components/minigames/Shared.ts', 'utf-8');

content = content.replace(
  "import { FUR_ELISE_RAW_NOTES } from './furEliseData';",
  "import { FUR_ELISE_RAW_NOTES } from './furEliseData';\nimport { TURKISH_MARCH_RAW_NOTES } from './turkishMarchData';"
);

content = content.replace(
  "export const PIANO_SONGS: PianoSong[] = [",
  `export const TURKISH_MARCH_NOTES: PianoNoteData[] = TURKISH_MARCH_RAW_NOTES.map(n => {
  const keyInfos = n.midi.map(m => midiToKeyInfo(m));
  return {
    time: n.time,
    midi: n.midi,
    lanes: keyInfos.map(k => k.lanePos),
    pitches: keyInfos.map(k => k.name),
    duration: n.duration
  };
});

export const PIANO_SONGS: PianoSong[] = [`
);

content = content.replace(
  "    notes: FUR_ELISE_NOTES\n  }\n];",
  `    notes: FUR_ELISE_NOTES
  },
  { 
    id: 'turkish_march', 
    title: 'トルコ行進曲', 
    composer: 'モーツァルト', 
    level: 8, 
    songSpeed: 1.25,
    desc: 'ピアノソナタ第11番 イ長調 K. 331 第3楽章「トルコ行進曲」。非常に高速な運指と和音の正確性が求められる超難関演習。', 
    notes: TURKISH_MARCH_NOTES
  }
];`
);

fs.writeFileSync('src/components/minigames/Shared.ts', content);
