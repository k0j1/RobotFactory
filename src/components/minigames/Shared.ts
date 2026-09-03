import { Robot } from '../../core/models';

export interface Opponent {
  id: string;
  name: string;
  org: string;
  int: number;
  agi: number;
  dex: number;
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

export type PianoDifficulty = 'easy' | 'normal' | 'hard';

export interface PianoDifficultyConfig {
  id: PianoDifficulty;
  name: string;
  label: string;
  subLabel: string;
  desc: string;
  multiplier: number;
  rewardKits: number;
  badgeClass: string;
}

export const PIANO_DIFFICULTIES: PianoDifficultyConfig[] = [
  {
    id: 'easy',
    name: '簡単',
    label: '簡単 (EASY)',
    subLabel: '原曲に忠実なアレンジ',
    desc: '選択した曲の音源とほぼ同じ音を奏でる、原曲を再現した美しいアレンジです。',
    multiplier: 1.0,
    rewardKits: 1,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'normal',
    name: '普通',
    label: '普通 (NORMAL)',
    subLabel: '人間が弾ける限界',
    desc: '超絶技巧が連続する、人間が弾くことができる限界レベルのアレンジです。極めて高い能力が必要です。',
    multiplier: 1.5,
    rewardKits: 2,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'hard',
    name: '難しい',
    label: '難しい (HARD)',
    subLabel: '超絶技巧連弾 (4-Hands)',
    desc: '音源を損なわずに、人2人がピアノを連弾しているレベルで元音源をアレンジした最高峰の超絶譜面です。',
    multiplier: 3.0,
    rewardKits: 5,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
  },
];

export interface PianoNoteData {
  time: number; // ミリ秒単位の再生タイミング (0からの相対時間)
  lanes: number[]; // 同時に押す鍵盤のレーン番号 (0〜34)
  duration?: number; // 鍵盤を押す長さ (ミリ秒)
}

export interface PianoSong {
  id: string;
  title: string;
  composer: string;
  baseDifficulty: number; // 0-100 (higher means harder)
  songSpeed: number; // 楽曲固有の再生速度 (例: 0.6=ゆっくり, 1.0=普通, 1.5=速い, 2.0=とても速い)
  bgmUrl?: string; // 任意で背景に流すBGM
  desc: string;
  notesEasy: PianoNoteData[];
  notesNormal: PianoNoteData[];
  notesHard: PianoNoteData[];
}

const t = (time: number, lanes: number[], duration: number = 300) => ({ time, lanes: lanes.map(l => l + 7), duration });

const generateLoop = (baseNotes: PianoNoteData[], targetDurationMs: number): PianoNoteData[] => {
  const result: PianoNoteData[] = [];
  const loopDuration = baseNotes[baseNotes.length - 1].time + 1000;
  let currentTime = 1000; // 最初のディレイ
  
  while (currentTime < targetDurationMs) {
    for (const note of baseNotes) {
      if (currentTime + note.time > targetDurationMs) break;
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


const elegyBass = [
  t(0, [2], 1800), t(2000, [4], 1800), t(4000, [7], 1800), t(6000, [9], 1800),
  t(8000, [2], 1800), t(10000, [5], 1800), t(12000, [3], 1800), t(14000, [0], 1800)
];
const elegyMelody = [
  t(0, [12, 16], 400), t(500, [15], 400), t(1000, [15, 12], 400), t(1500, [14], 400), 
  t(2000, [14, 9], 400), t(2500, [12], 400), t(3000, [13, 10], 400), t(3500, [11], 400),
  t(4000, [12, 7, 16], 400), t(4500, [15], 400), t(5000, [13, 10], 400), t(5500, [12], 400),
  t(6000, [14, 9, 17], 400), t(6500, [16], 400), t(7000, [16, 12], 400), t(7500, [15], 400),
  t(8000, [12, 17], 400), t(8500, [16], 400), t(9000, [16, 13], 400), t(9500, [15], 400),
  t(10000, [15, 10, 19], 400), t(10500, [18], 400), t(11000, [14, 11], 400), t(11500, [13], 400),
  t(12000, [13, 8, 17], 400), t(12500, [16], 400), t(13000, [14, 11], 400), t(13500, [13], 400),
  t(14000, [12, 5, 16], 400), t(14500, [15], 400), t(15000, [9, 12, 16], 900)
];
const elegyOriginal = [...elegyBass, ...elegyMelody].sort((a, b) => a.time - b.time);

const yumeBass = [
  t(0, [7], 1900), t(2000, [4], 1900), t(4000, [2], 1900), t(6000, [4], 1900),
  t(8000, [7], 1900), t(10000, [11], 1900), t(12000, [9], 1900), t(14000, [4], 1900)
];
const yumeMelody = [
  t(0, [14, 18], 200), t(250, [11], 200), t(500, [14], 200), t(750, [11], 200), t(1000, [12, 16], 200), t(1250, [9], 200), t(1500, [12], 200), t(1750, [9], 200),
  t(2000, [11, 15], 200), t(2250, [7], 200), t(2500, [11], 200), t(2750, [7], 200), t(3000, [12, 16], 200), t(3250, [9], 200), t(3500, [12], 200), t(3750, [9], 200),
  t(4000, [9, 13], 200), t(4250, [5], 200), t(4500, [9], 200), t(4750, [5], 200), t(5000, [7, 11], 200), t(5250, [4], 200), t(5500, [7], 200), t(5750, [4], 200),
  t(6000, [9, 13], 200), t(6250, [7], 200), t(6500, [9], 200), t(6750, [7], 200), t(7000, [11, 14], 200), t(7250, [7], 200), t(7500, [11], 200), t(7750, [7], 200),
  t(8000, [14, 18], 200), t(8250, [11], 200), t(8500, [14], 200), t(8750, [11], 200), t(9000, [16, 19], 200), t(9250, [13], 200), t(9500, [16], 200), t(9750, [13], 200),
  t(10000, [15, 18], 200), t(10250, [14], 200), t(10500, [15], 200), t(10750, [14], 200), t(11000, [14, 17], 200), t(11250, [11], 200), t(11500, [14], 200), t(11750, [11], 200),
  t(12000, [12, 16], 200), t(12250, [5], 200), t(12500, [9], 200), t(12750, [5], 200), t(13000, [11, 14], 200), t(13250, [7], 200), t(13500, [11], 200), t(13750, [7], 200),
  t(14000, [9, 13], 200), t(14250, [7], 200), t(14500, [9], 200), t(14750, [7], 200), t(15000, [11, 15], 200), t(15250, [7], 200), t(15500, [11], 200), t(15750, [7], 200)
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

const generateHumanLimit = (baseNotes: PianoNoteData[]): PianoNoteData[] => {
  const result: PianoNoteData[] = [];
  let lastTime = 0;
  baseNotes.forEach(note => {
    // 主旋律に加えて、低いオクターブでベース音（左手）を追加
    const bassLanes = note.lanes.map(l => l - 7).filter(l => l >= 0);
    const combinedLanes = [...note.lanes, ...bassLanes].filter((v, i, a) => a.indexOf(v) === i);
    result.push({ time: note.time, lanes: combinedLanes, duration: note.duration || 400 });
    
    const diff = note.time - lastTime;
    const step = 125; // 人間がギリギリ弾ける超高速連符 (8 notes/sec)
    if (diff > step) {
      let current = lastTime + step;
      let phase = 0;
      while (current < note.time) {
        const baseLane = note.lanes[0] !== undefined ? note.lanes[0] : 14;
        const arpLanes = [
          Math.max(0, Math.min(34, baseLane - 7 + (phase % 5))),
          Math.max(0, Math.min(34, baseLane + 4 + (phase % 4)))
        ];
        result.push({ time: current, lanes: arpLanes.filter((v, i, a) => a.indexOf(v) === i), duration: 100 });
        current += step;
        phase++;
      }
    }
    lastTime = note.time;
  });
  return result.sort((a, b) => a.time - b.time);
};

const generateDuetLimit = (baseNotes: PianoNoteData[]): PianoNoteData[] => {
  const result: PianoNoteData[] = [];
  let lastTime = 0;
  baseNotes.forEach(note => {
    // 2人連弾（4-Hands）用の極厚の和音（原音＋低音2オクターブ＋高音オクターブの分散）
    const thickChords = [
      ...note.lanes, 
      ...note.lanes.map(l => l - 7), // 伴奏者（右）
      ...note.lanes.map(l => l - 14), // 伴奏者（左）
      ...note.lanes.map(l => l + 7)  // 旋律者（高音装飾）
    ].filter(l => l >= 0 && l <= 34).filter((v, i, a) => a.indexOf(v) === i);
    result.push({ time: note.time, lanes: thickChords, duration: note.duration || 500 });
    
    const diff = note.time - lastTime;
    const step = 62.5; // 連弾による激しい16分音符のパッセージ (16 notes/sec)
    if (diff > step) {
      let current = lastTime + step;
      let phase = 0;
      while (current < note.time) {
        // 伴奏者の激しい低音アルペジオと、旋律者の高音装飾フレーズの交差
        const baseLane = note.lanes[0] !== undefined ? note.lanes[0] : 17;
        const duetLanes = [
          Math.max(0, Math.min(34, baseLane - 14 + (phase % 7))), // 左端の重低音
          Math.max(0, Math.min(34, baseLane - 7 + ((phase + 2) % 5))), // 中低音
          Math.max(0, Math.min(34, baseLane + 7 + (phase % 4))), // 高音のきらめき
          Math.max(0, Math.min(34, baseLane + 12 - (phase % 3))) // さらに高音
        ];
        
        result.push({ time: current, lanes: duetLanes.filter((v, i, a) => a.indexOf(v) === i), duration: 80 });
        current += step;
        phase++;
      }
    }
    lastTime = note.time;
  });
  return result.sort((a, b) => a.time - b.time);
};

export const PIANO_SONGS: PianoSong[] = [
  { 
    id: 'elegy', title: 'エレジー', composer: '甘茶の音楽工房', baseDifficulty: 40, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/elegy.mp3',
    desc: '悲哀に満ちた美しいピアノ曲。', 
    notesEasy: generateLoop(elegyOriginal, 30000),
    notesNormal: generateHumanLimit(generateLoop(elegyOriginal, 30000)),
    notesHard: generateDuetLimit(generateLoop(elegyOriginal, 30000))
  },
  { 
    id: 'yume', title: '夢', composer: '甘茶の音楽工房', baseDifficulty: 60, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/yume.mp3',
    desc: '穏やかで幻想的なピアノ曲。', 
    notesEasy: generateLoop(yumeOriginal, 30000),
    notesNormal: generateHumanLimit(generateLoop(yumeOriginal, 30000)),
    notesHard: generateDuetLimit(generateLoop(yumeOriginal, 30000))
  },
  { 
    id: 'natsunokiri', title: '夏の霧', composer: '甘茶の音楽工房', baseDifficulty: 80, songSpeed: 1.0,
    bgmUrl: 'https://amachamusic.chagasi.com/mp3/natsunokiri.mp3',
    desc: '静かで少しテンポの速い、霧のように繊細なピアノ曲。', 
    notesEasy: generateLoop(kiriOriginal, 30000),
    notesNormal: generateHumanLimit(generateLoop(kiriOriginal, 30000)),
    notesHard: generateDuetLimit(generateLoop(kiriOriginal, 30000))
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
  { id: 'op1', name: 'ポンコツ試作機', org: '町の発明家', int: 1, agi: 1, dex: 1, rewardKits: 1 },
  { id: 'op2', name: '汎用作業ボット', org: 'アポロ工業', int: 10, agi: 10, dex: 10, rewardKits: 2 },
  { id: 'op3', name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 30, agi: 30, dex: 30, rewardKits: 3 },
  { id: 'op4', name: 'オメガ・マスター', org: '世界AI協会', int: 60, agi: 60, dex: 60, rewardKits: 5 },
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
