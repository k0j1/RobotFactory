import { Robot } from '../../core/models';

export interface Opponent {
  id: string;
  name: string;
  org: string;
  int: number;
  reward: number;
}

export const OPPONENTS: Opponent[] = [
  { id: 'op1', name: 'ポンコツ試作機', org: '町の発明家', int: 1, reward: 50 },
  { id: 'op2', name: '汎用作業ボット', org: 'アポロ工業', int: 10, reward: 150 },
  { id: 'op3', name: '戦術演算ユニット', org: 'ゼニス・コーポレーション', int: 30, reward: 500 },
  { id: 'op4', name: 'オメガ・マスター', org: '世界AI協会', int: 60, reward: 2000 },
];

export interface MinigameProps {
  activeRobot: Robot;
  activeOpponent: Opponent;
  onFinish: (result: 'win' | 'lose' | 'draw') => void;
  speed: number;
  isPaused: boolean;
  isFinished: boolean;
}
