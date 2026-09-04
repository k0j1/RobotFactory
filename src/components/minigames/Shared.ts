import { Robot } from '../../core/models';

export interface Opponent {
  id: string;
  name: string;
  org: string;
  int: number;
  agi: number;
  dex: number;
  hp: number;
  power: number;
  defense: number;
  rewardKits: number;
}

export type DanmakuDifficulty = 'easy' | 'normal' | 'hard';

export interface DanmakuDifficultyConfig {
  id: DanmakuDifficulty;
  name: string;
  label: string;
  subLabel: string;
  desc: string;
  bulletSpeedMult: number;
  ringCount: number;
  rewardKits: number;
  badgeClass: string;
}


import { FUR_ELISE_RAW_NOTES } from './furEliseData';

export interface PianoNoteData {
  time: number;
  lanes: number[];
  midi: number[];
  pitches: string[];
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

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// MIDI 33 (A1) to MIDI 100 (E7) -> 40 white keys total (index 0 to 39)
export const midiToKeyInfo = (midi: number): { name: string; isBlack: boolean; lanePos: number; whiteIndex: number } => {
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = midi % 12;
  const name = `${NOTE_NAMES[pitchClass]}${octave}`;
  const isBlack = [1, 3, 6, 8, 10].includes(pitchClass);

  let whiteKeysBelow = 0;
  for (let m = 33; m < midi; m++) {
    const pc = m % 12;
    if (![1, 3, 6, 8, 10].includes(pc)) {
      whiteKeysBelow++;
    }
  }

  const lanePos = isBlack ? whiteKeysBelow - 0.5 : whiteKeysBelow;
  return {
    name,
    isBlack,
    lanePos,
    whiteIndex: whiteKeysBelow
  };
};

export const FUR_ELISE_NOTES: PianoNoteData[] = FUR_ELISE_RAW_NOTES.map(n => {
  const keyInfos = n.midi.map(m => midiToKeyInfo(m));
  return {
    time: n.time,
    midi: n.midi,
    lanes: keyInfos.map(k => k.lanePos),
    pitches: keyInfos.map(k => k.name),
    duration: n.duration
  };
});

export const PIANO_SONGS: PianoSong[] = [
  { 
    id: 'fur_elise', 
    title: 'エリーゼのために', 
    composer: 'ベートーヴェン', 
    level: 5, 
    songSpeed: 1.0,
    desc: 'バガテル「エリーゼのために」WoO 59 (イ短調 3/8拍子)。pianoclassics.net (ID 47) 準拠。主部と全エピソードを網羅した全曲完全収録版。', 
    notes: FUR_ELISE_NOTES
  }
];

export const DANMAKU_DIFFICULTIES: DanmakuDifficultyConfig[] = [
  {
    id: 'easy',
    name: '初級',
    label: '初級 (EASY)',
    subLabel: '弾速0.75x・入門向け',
    desc: '弾幕の速度が控えめで、初心者ロボットでも隙間を抜けやすい入門モード。',
    bulletSpeedMult: 0.75,
    ringCount: 6,
    rewardKits: 1,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'normal',
    name: '中級',
    label: '中級 (NORMAL)',
    subLabel: '標準弾幕・バランス',
    desc: '標準的な高密度弾幕サバイバル。適切なAgiとDexが求められる。',
    bulletSpeedMult: 1.0,
    ringCount: 8,
    rewardKits: 1,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'hard',
    name: '上級',
    label: '上級 (HARD)',
    subLabel: '弾速1.25x・極限弾幕',
    desc: '超高速かつ高密度に降り注ぐ極限の弾幕。鍛え抜かれたAgiとDexが必要。',
    bulletSpeedMult: 1.25,
    ringCount: 10,
    rewardKits: 2,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
  },
];

export const OPPONENTS: Opponent[] = [
  { id: 'op1', name: 'ポンコツ試作機', org: '町の発明家', int: 4, agi: 8, dex: 6, hp: 10, power: 10, defense: 4, rewardKits: 1 },
  { id: 'op2', name: '汎用作業ボット', org: 'アポロ工業', int: 12, agi: 16, dex: 14, hp: 25, power: 22, defense: 12, rewardKits: 2 },
  { id: 'op3', name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 32, agi: 32, dex: 28, hp: 50, power: 45, defense: 28, rewardKits: 3 },
  { id: 'op4', name: 'オメガ・マスター', org: '世界AI協会', int: 65, agi: 55, dex: 50, hp: 85, power: 75, defense: 48, rewardKits: 5 },
];

export interface MinigameProps {
  activeRobot: Robot;
  activeOpponent: Opponent;
  onFinish: (result: 'win' | 'lose' | 'draw') => void;
  speed: number;
  isPaused: boolean;
  isFinished: boolean;
  battleResult?: 'win' | 'lose' | 'draw' | null;
}
