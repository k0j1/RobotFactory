import { Robot } from '../../core/models';
import { CombatEquipmentRank } from '../../core/combatEquipmentData';

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
  rewardFame: number;
}

export type DanmakuDifficulty = 
  | 'lvl1' | 'lvl2' | 'lvl3' | 'lvl4' | 'lvl5' 
  | 'lvl6' | 'lvl7' | 'lvl8' | 'lvl9' | 'lvl10'
  | 'easy' | 'normal' | 'hard';

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
  rewardFame: number;
  rewardElements: number;
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
    rewardFame: 0,
    rewardElements: 0,
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
    rewardKits: 1,
    rewardRegenHours: 6,
    rewardFame: 0,
    rewardElements: 0,
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
    rewardKits: 1,
    rewardRegenHours: 9,
    rewardFame: 5,
    rewardElements: 5,
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
    rewardKits: 1,
    rewardRegenHours: 12,
    rewardFame: 10,
    rewardElements: 10,
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
    rewardKits: 1,
    rewardRegenHours: 24,
    rewardFame: 15,
    rewardElements: 15,
    bossInfo: '全波ボス級ラッシュ＆最後は超巨大ボス(HP100万)',
  },
];

export interface DanmakuDifficultyConfig {
  id: DanmakuDifficulty;
  level: number;
  name: string;
  label: string;
  subLabel: string;
  desc: string;
  bulletSpeedMult: number;
  ringCount: number;
  rewardKits: number;
  rewardFame: number;
  rewardElements: number;
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
  rewardFame: number;
  rewardElements: number;
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
    id: 'fur_elise', 
    title: 'エリーゼのために', 
    composer: 'ベートーヴェン', 
    level: 5, 
    songSpeed: 1.0,
    desc: 'バガテル「エリーゼのために」WoO 59 (イ短調 3/8拍子)。pianoclassics.net (ID 47) 準拠。主部と全エピソードを網羅した全曲完全収録版。', 
    rewardFame: 10,
    rewardElements: 10,
    notes: FUR_ELISE_NOTES
  },
  { 
    id: 'turkish_march', 
    title: 'トルコ行進曲', 
    composer: 'モーツァルト', 
    level: 8, 
    songSpeed: 1.0,
    desc: 'ピアノソナタ第11番 イ長調 K. 331 第3楽章「トルコ行進曲」(Allegretto 2/4拍子)。pianoclassics.net (ID 55) / Mutopia 準拠。主部・中間部・コーダを網羅した全曲完全収録版。', 
    rewardFame: 20,
    rewardElements: 20,
    notes: TURKISH_MARCH_NOTES
  },
  { 
    id: 'la_campanella', 
    title: 'ラ・カンパネラ', 
    composer: 'リスト', 
    level: 10, 
    songSpeed: 1.0,
    desc: 'パガニーニ大練習曲 第3番 嬰ト短調。pianoclassics.net (ID 110) 準拠。特徴的な跳躍と高音の鐘の音を再現したテーマ部。', 
    rewardFame: 35,
    rewardElements: 35,
    notes: LA_CAMPANELLA_NOTES
  }
];

export const DANMAKU_DIFFICULTIES: DanmakuDifficultyConfig[] = [
  {
    id: 'lvl1',
    level: 1,
    name: 'レベル1 (入門)',
    label: 'Lv.1 入門',
    subLabel: '弾速0.6x・訓練',
    desc: '弾幕の速度が非常に緩やかで基本操作を確認できる初級モード。',
    bulletSpeedMult: 0.60,
    ringCount: 4,
    rewardKits: 1,
    rewardFame: 0,
    rewardElements: 0,
    badgeClass: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    id: 'lvl2',
    level: 2,
    name: 'レベル2 (基礎)',
    label: 'Lv.2 基礎',
    subLabel: '弾速0.7x・初級',
    desc: '標準的な低速弾幕。初心者ロボットでも隙間を抜けやすい。',
    bulletSpeedMult: 0.70,
    ringCount: 5,
    rewardKits: 1,
    rewardFame: 0,
    rewardElements: 0,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'lvl3',
    level: 3,
    name: 'レベル3 (応用)',
    label: 'Lv.3 応用',
    subLabel: '弾速0.8x・軽快',
    desc: '徐々に密度が増すステップアップステージ。',
    bulletSpeedMult: 0.80,
    ringCount: 6,
    rewardKits: 1,
    rewardFame: 0,
    rewardElements: 0,
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  {
    id: 'lvl4',
    level: 4,
    name: 'レベル4 (中級)',
    label: 'Lv.4 中級',
    subLabel: '弾速0.9x・名声+1/E+1',
    desc: '本格的な弾幕展開。ここから工房名声とエレメントが獲得可能！',
    bulletSpeedMult: 0.90,
    ringCount: 7,
    rewardKits: 1,
    rewardFame: 1,
    rewardElements: 1,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'lvl5',
    level: 5,
    name: 'レベル5 (標準)',
    label: 'Lv.5 標準',
    subLabel: '弾速1.0x・名声+3/E+3',
    desc: '標準的な高密度弾幕サバイバル。適切なAgiとDexが求められる。',
    bulletSpeedMult: 1.00,
    ringCount: 8,
    rewardKits: 1,
    rewardFame: 3,
    rewardElements: 3,
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    id: 'lvl6',
    level: 6,
    name: 'レベル6 (精鋭)',
    label: 'Lv.6 精鋭',
    subLabel: '弾速1.1x・名声+6/E+6',
    desc: '高速かつ多角的なリング弾が迫る精鋭ステージ。',
    bulletSpeedMult: 1.10,
    ringCount: 9,
    rewardKits: 1,
    rewardFame: 6,
    rewardElements: 6,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'lvl7',
    level: 7,
    name: 'レベル7 (上級)',
    label: 'Lv.7 上級',
    subLabel: '弾速1.2x・名声+10/E+10',
    desc: '超高速に降り注ぐ上位弾幕。鍛え抜かれた敏捷性が必要。',
    bulletSpeedMult: 1.20,
    ringCount: 10,
    rewardKits: 2,
    rewardFame: 10,
    rewardElements: 10,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'lvl8',
    level: 8,
    name: 'レベル8 (極限)',
    label: 'Lv.8 極限',
    subLabel: '弾速1.3x・名声+20/E+20',
    desc: '隙間のない弾幕の雨が襲う極限サバイバル。',
    bulletSpeedMult: 1.30,
    ringCount: 11,
    rewardKits: 2,
    rewardFame: 20,
    rewardElements: 20,
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  {
    id: 'lvl9',
    level: 9,
    name: 'レベル9 (達人)',
    label: 'Lv.9 達人',
    subLabel: '弾速1.45x・名声+50/E+50',
    desc: '達人級の高速弾幕。回避判断の猶予はコンマ数秒。',
    bulletSpeedMult: 1.45,
    ringCount: 12,
    rewardKits: 2,
    rewardFame: 50,
    rewardElements: 50,
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'lvl10',
    level: 10,
    name: 'レベル10 (悪夢)',
    label: 'Lv.10 悪夢',
    subLabel: '弾速1.6x・名声+100/E+100',
    desc: '全方位から高速で包囲する最高峰の悪夢弾幕空間。',
    bulletSpeedMult: 1.60,
    ringCount: 14,
    rewardKits: 3,
    rewardFame: 100,
    rewardElements: 100,
    badgeClass: 'bg-red-100 text-red-900 border-red-400',
  },
];

export const OPPONENTS: Opponent[] = [
  { id: 'op1', level: 1, name: 'ポンコツ試作機', org: '町の発明家', int: 16, agi: 14, dex: 16, hp: 25, power: 22, defense: 15, rewardKits: 1, rewardElements: 0, rewardFame: 0 },
  { id: 'op2', level: 2, name: 'ジャンク・スカベンジャー', org: '廃品回収ギルド', int: 26, agi: 22, dex: 24, hp: 42, power: 36, defense: 26, rewardKits: 1, rewardElements: 0, rewardFame: 0 },
  { id: 'op3', level: 3, name: '汎用作業ボット', org: 'アポロ重工', int: 38, agi: 31, dex: 34, hp: 65, power: 55, defense: 40, rewardKits: 1, rewardElements: 0, rewardFame: 0 },
  { id: 'op4', level: 4, name: '警邏パトロールボット', org: 'シティ警察機構', int: 47, agi: 38, dex: 41, hp: 82, power: 70, defense: 51, rewardKits: 1, rewardElements: 1, rewardFame: 1 },
  { id: 'op5', level: 5, name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 56, agi: 44, dex: 48, hp: 98, power: 84, defense: 62, rewardKits: 1, rewardElements: 3, rewardFame: 3 },
  { id: 'op6', level: 6, name: '重装機甲ストライカー', org: 'ネオ・ミリタリー', int: 72, agi: 56, dex: 62, hp: 135, power: 115, defense: 85, rewardKits: 1, rewardElements: 6, rewardFame: 6 },
  { id: 'op7', level: 7, name: '高機動ファントム', org: 'シャドウ・ラボラトリー', int: 92, agi: 70, dex: 78, hp: 180, power: 150, defense: 110, rewardKits: 1, rewardElements: 10, rewardFame: 10 },
  { id: 'op8', level: 8, name: '要塞ガーディアン', org: '古代防衛システム', int: 140, agi: 115, dex: 120, hp: 280, power: 230, defense: 170, rewardKits: 1, rewardElements: 20, rewardFame: 20 },
  { id: 'op9', level: 9, name: 'サイバネティクス・カイザー', org: '帝国兵器工廠', int: 190, agi: 160, dex: 165, hp: 400, power: 330, defense: 250, rewardKits: 1, rewardElements: 50, rewardFame: 50 },
  { id: 'op10', level: 10, name: 'オメガ・マスター', org: '世界AI協会', int: 260, agi: 220, dex: 230, hp: 600, power: 480, defense: 360, rewardKits: 1, rewardElements: 100, rewardFame: 100 },
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
  combatEquipmentRanks?: { beamSaber?: CombatEquipmentRank; beamShield?: CombatEquipmentRank };
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

/**
 * 毎朝9:00基準のデイリーキー（YYYY-MM-DD）を取得
 * 9:00前は前日扱い、9:00以降は当日扱いとなり、朝9:00にリセットされます
 */
export function getDailyResetDateKey(now: number = Date.now()): string {
  const d = new Date(now);
  const today9am = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0, 0, 0).getTime();
  const resetBaseDate = now >= today9am ? d : new Date(now - 24 * 60 * 60 * 1000);
  const y = resetBaseDate.getFullYear();
  const m = String(resetBaseDate.getMonth() + 1).padStart(2, '0');
  const day = String(resetBaseDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

