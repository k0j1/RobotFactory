import { Robot } from '../../core/models';

export interface Opponent {
  id: string;
  name: string;
  org: string;
  level: number;
  int: number;
  agi: number;
  dex: number;
  hp: number;
  power: number;
  defense: number;
  rewardKits: number;
  rewardElements: number;
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
    desc: '敵数100体の大部隊。ボス出現なし。基本戦術と配置の確認に適した初級ステージ。',
    maxRobots: 3,
    baseHp: 50,
    totalEnemies: 100,
    spawnRate: 3.0,
    enemyStatsMult: 1.0,
    rewardKits: 1,
    rewardRegenHours: 3,
    bossInfo: 'ボスなし (通常敵のみ 100体)',
  },
  {
    id: 'stage2',
    name: '難易度レベル2: 警戒前線防衛',
    level: 2,
    desc: '敵数200体。100体ごとに小ボス(HP50000)が出現。脚の早いスプリンターボットの急襲に警戒せよ。',
    maxRobots: 4,
    baseHp: 75,
    totalEnemies: 200,
    spawnRate: 3.75,
    enemyStatsMult: 1.0,
    rewardKits: 2,
    rewardRegenHours: 6,
    bossInfo: '100体ごとに小ボス(HP50,000)出現',
  },
  {
    id: 'stage3',
    name: '難易度レベル3: 要衝防衛作戦',
    level: 3,
    desc: '敵数300体。100体ごとに中ボス(HP100000)が出現し、ラストに大ボス(HP150000)が急襲！',
    maxRobots: 4,
    baseHp: 100,
    totalEnemies: 300,
    spawnRate: 4.25,
    enemyStatsMult: 1.0,
    rewardKits: 3,
    rewardRegenHours: 9,
    bossInfo: '100体毎に中ボス(HP10万)、最後に大ボス(HP15万)出現',
  },
  {
    id: 'stage4',
    name: '難易度レベル4: 激戦防衛ライン',
    level: 4,
    desc: '敵数400体。最後の99体は全て小ボス、そしてラストに巨大ボス(HP250000)が降臨！',
    maxRobots: 5,
    baseHp: 125,
    totalEnemies: 400,
    spawnRate: 4.75,
    enemyStatsMult: 1.0,
    rewardKits: 4,
    rewardRegenHours: 12,
    bossInfo: '最後の99体は小ボス、ラストに巨大ボス(HP25万)',
  },
  {
    id: 'stage5',
    name: '難易度レベル5: 終焉の防壁・頂上決戦',
    level: 5,
    desc: '敵数500体。最初の200体は全て小ボス、次150体は中ボス、次100体は大ボス、50体毎に巨大ボス、最後は超巨大ボス(HP500000)！',
    maxRobots: 6,
    baseHp: 150,
    totalEnemies: 500,
    spawnRate: 5.5,
    enemyStatsMult: 1.0,
    rewardKits: 5,
    rewardRegenHours: 24,
    bossInfo: '全波ボス級ラッシュ＆最後は超巨大ボス(HP100万)',
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
import { LA_CAMPANELLA_RAW_NOTES } from './laCampanellaData';
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

// MIDI 21 (A0) to MIDI 108 (C8) -> 52 white keys total
export const midiToKeyInfo = (midi: number): { name: string; isBlack: boolean; lanePos: number; whiteIndex: number } => {
  const octave = Math.floor(midi / 12) - 1;
  const pitchClass = midi % 12;
  const name = `${NOTE_NAMES[pitchClass]}${octave}`;
  const isBlack = [1, 3, 6, 8, 10].includes(pitchClass);

  let whiteKeysBelow = 0;
  for (let m = 21; m < midi; m++) {
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

export const PIANO_SONGS: PianoSong[] = [
  { 
    id: 'la_campanella', 
    title: 'ラ・カンパネラ', 
    composer: 'リスト', 
    level: 10, 
    songSpeed: 1.0,
    desc: 'パガニーニ大練習曲 第3番 嬰ト短調。pianoclassics.net (ID 110) 準拠。特徴的な跳躍と高音の鐘の音を再現したテーマ部。', 
    notes: LA_CAMPANELLA_NOTES
  },

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
  { id: 'op1', level: 1, name: 'ポンコツ試作機', org: '町の発明家', int: 4, agi: 8, dex: 6, hp: 10, power: 10, defense: 4, rewardKits: 1, rewardElements: 10 },
  { id: 'op2', level: 2, name: 'ジャンク・スカベンジャー', org: '廃品回収ギルド', int: 8, agi: 12, dex: 10, hp: 16, power: 16, defense: 8, rewardKits: 1, rewardElements: 15 },
  { id: 'op3', level: 3, name: '汎用作業ボット', org: 'アポロ重工', int: 14, agi: 16, dex: 14, hp: 25, power: 24, defense: 14, rewardKits: 1, rewardElements: 20 },
  { id: 'op4', level: 4, name: '警邏パトロールボット', org: 'シティ警察機構', int: 20, agi: 22, dex: 18, hp: 35, power: 32, defense: 20, rewardKits: 1, rewardElements: 25 },
  { id: 'op5', level: 5, name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 28, agi: 28, dex: 24, hp: 48, power: 42, defense: 28, rewardKits: 1, rewardElements: 35 },
  { id: 'op6', level: 6, name: '重装機甲ストライカー', org: 'ネオ・ミリタリー', int: 36, agi: 34, dex: 30, hp: 62, power: 54, defense: 38, rewardKits: 1, rewardElements: 50 },
  { id: 'op7', level: 7, name: '高機動ファントム', org: 'シャドウ・ラボラトリー', int: 46, agi: 52, dex: 40, hp: 78, power: 68, defense: 46, rewardKits: 1, rewardElements: 65 },
  { id: 'op8', level: 8, name: '要塞ガーディアン', org: '古代防衛システム', int: 56, agi: 44, dex: 48, hp: 98, power: 84, defense: 62, rewardKits: 1, rewardElements: 80 },
  { id: 'op9', level: 9, name: 'サイバネティクス・カイザー', org: '帝国兵器工廠', int: 72, agi: 64, dex: 60, hp: 125, power: 106, defense: 78, rewardKits: 1, rewardElements: 100 },
  { id: 'op10', level: 10, name: 'オメガ・マスター', org: '世界AI協会', int: 92, agi: 86, dex: 80, hp: 160, power: 135, defense: 98, rewardKits: 1, rewardElements: 150 },
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
  activeCombatEquipments?: { beamSaber?: boolean; beamShield?: boolean };
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

