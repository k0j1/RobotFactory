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

export interface DefenseStage {
  id: string;
  name: string;
  level: number;
  desc: string;
  maxRobots: number;
  baseHp: number;
  totalEnemies: number;
  spawnRate: number; // spawns per second
  enemyStatsMult: number;
  rewardKits: number;
  rewardRegenHours: number;
  bossInfo: string;
}

export const DEFENSE_STAGES: DefenseStage[] = [
  {
    id: 'stage1',
    name: '難易度レベル1: 侵攻阻止戦',
    level: 1,
    desc: '敵数1000体の大部隊。ボス出現なし。基本戦術と配置の確認に適した初級ステージ。',
    maxRobots: 3,
    baseHp: 100,
    totalEnemies: 1000,
    spawnRate: 6.0,
    enemyStatsMult: 1.0,
    rewardKits: 1,
    rewardRegenHours: 3,
    bossInfo: 'ボスなし (通常敵のみ 1000体)',
  },
  {
    id: 'stage2',
    name: '難易度レベル2: 警戒前線防衛',
    level: 2,
    desc: '敵数2000体。1000体ごとに小ボス(HP10000)が出現。脚の早いスプリンターボットの急襲に警戒せよ。',
    maxRobots: 4,
    baseHp: 150,
    totalEnemies: 2000,
    spawnRate: 7.5,
    enemyStatsMult: 1.0,
    rewardKits: 2,
    rewardRegenHours: 6,
    bossInfo: '1000体ごとに小ボス(HP10,000)出現',
  },
  {
    id: 'stage3',
    name: '難易度レベル3: 要衝防衛作戦',
    level: 3,
    desc: '敵数3000体。1000体ごとに中ボス(HP20000)が出現し、ラストに大ボス(HP30000)が急襲！',
    maxRobots: 4,
    baseHp: 200,
    totalEnemies: 3000,
    spawnRate: 8.5,
    enemyStatsMult: 1.0,
    rewardKits: 3,
    rewardRegenHours: 9,
    bossInfo: '1000体毎に中ボス(HP2万)、最後に大ボス(HP3万)出現',
  },
  {
    id: 'stage4',
    name: '難易度レベル4: 激戦防衛ライン',
    level: 4,
    desc: '敵数4000体。1000体ごとに大ボス(HP30000)が出現し、ラストに巨大ボス(HP50000)が降臨！',
    maxRobots: 5,
    baseHp: 250,
    totalEnemies: 4000,
    spawnRate: 9.5,
    enemyStatsMult: 1.0,
    rewardKits: 4,
    rewardRegenHours: 12,
    bossInfo: '1000体毎に大ボス(HP3万)、最後に巨大ボス(HP5万)出現',
  },
  {
    id: 'stage5',
    name: '難易度レベル5: 終焉の防壁・頂上決戦',
    level: 5,
    desc: '敵数5000体。最初の2000体は全て小ボス、次1500体は中ボス、次1000体は大ボス、500体毎に巨大ボス、最後は超巨大ボス(HP100000)！',
    maxRobots: 6,
    baseHp: 300,
    totalEnemies: 5000,
    spawnRate: 11.0,
    enemyStatsMult: 1.0,
    rewardKits: 5,
    rewardRegenHours: 24,
    bossInfo: '全波ボス級ラッシュ＆最後は超巨大ボス(HP10万)',
  },
];

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
import { TURKISH_MARCH_RAW_NOTES } from './turkishMarchData';

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

export const TURKISH_MARCH_NOTES: PianoNoteData[] = TURKISH_MARCH_RAW_NOTES.map(n => {
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
  },
  { 
    id: 'turkish_march', 
    title: 'トルコ行進曲', 
    composer: 'モーツァルト', 
    level: 8, 
    songSpeed: 1.0,
    desc: 'ピアノソナタ第11番 イ長調 K. 331 第3楽章「トルコ行進曲」(Allegretto 2/4拍子)。pianoclassics.net (ID 55) / Mutopia 準拠。主部・中間部・コーダを網羅した全曲完全収録版。', 
    notes: TURKISH_MARCH_NOTES
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
  onTogglePause?: () => void;
  onSetSpeed?: (speed: number) => void;
}

/**
 * 拠点防衛戦 毎朝9:00リセットの判定情報
 */
export interface DefenseResetInfo {
  isCompletedToday: boolean;
  latestResetTime: number;
  nextResetTime: number;
  remainingMs: number;
  remainingHours: number;
  remainingMinutes: number;
}

/**
 * 毎朝9:00デイリーリセット計算ヘルパー
 * 指定時刻(now)における「直近の朝9時リセット時刻」と「次回の朝9時リセット時刻」を算出し、
 * 本日（直近朝9時以降）に防衛成功済みかどうかを厳密に判定します。
 */
export function getDefenseDailyResetInfo(lastVictoryTime?: number, now: number = Date.now()): DefenseResetInfo {
  const d = new Date(now);
  // 今日の午前9時0分0秒0ミリ秒 (ローカルタイム)
  const today9am = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0).getTime();

  let latestResetTime: number;
  let nextResetTime: number;

  if (now >= today9am) {
    latestResetTime = today9am;
    nextResetTime = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 9, 0, 0, 0).getTime();
  } else {
    latestResetTime = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 9, 0, 0, 0).getTime();
    nextResetTime = today9am;
  }

  const isCompletedToday = Boolean(lastVictoryTime && lastVictoryTime >= latestResetTime);
  const remainingMs = Math.max(0, nextResetTime - now);
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isCompletedToday,
    latestResetTime,
    nextResetTime,
    remainingMs,
    remainingHours,
    remainingMinutes,
  };
}

