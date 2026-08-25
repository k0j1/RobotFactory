
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

export const GAMES = [
  { id: 'othello', name: 'オセロ', desc: '8x8の盤面で挟んで裏返す定番ゲーム。' },
  { id: 'tictactoe', name: '三目並べ', desc: '3x3のマスで先に3つ並べた方が勝ち。' },
  { id: 'nim', name: '石取りゲーム', desc: '21個の石から交互に1〜3個取り、最後の1個を取ったら負け。' },
];
