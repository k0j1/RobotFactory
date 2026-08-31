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
