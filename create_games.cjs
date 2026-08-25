const fs = require('fs');

fs.mkdirSync('src/screens/minigames', { recursive: true });

// constants.ts
const constantsTs = `
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
`;
fs.writeFileSync('src/screens/minigames/constants.ts', constantsTs);

// OthelloGame.tsx
const othelloGameTs = `
import React, { useState, useEffect } from 'react';
import { Robot } from '../../core/models';
import { RobotVisual } from '../../components/robot/RobotVisual';
import { Opponent } from './constants';

const SIZE = 8;
type Player = 1 | 2;
type BoardState = number[][];

const INITIAL_BOARD: BoardState = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
INITIAL_BOARD[3][3] = 2;
INITIAL_BOARD[3][4] = 1;
INITIAL_BOARD[4][3] = 1;
INITIAL_BOARD[4][4] = 2;

const DIRECTIONS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const WEIGHTS = [
  [100, -20, 10, 5, 5, 10, -20, 100],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [5, -2, -1, -1, -1, -1, -2, 5],
  [10, -2, -1, -1, -1, -1, -2, 10],
  [-20, -50, -2, -2, -2, -2, -50, -20],
  [100, -20, 10, 5, 5, 10, -20, 100],
];

interface Props {
  activeRobot: Robot;
  activeOpponent: Opponent;
  onFinish: (result: 'win' | 'lose' | 'draw') => void;
}

export const OthelloGame: React.FC<Props> = ({ activeRobot, activeOpponent, onFinish }) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<{r: number, c: number} | null>(null);

  const isValidPos = (r: number, c: number) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const getFlippable = (b: BoardState, r: number, c: number, p: Player) => {
    if (b[r][c] !== 0) return [];
    let flippable: {r: number, c: number}[] = [];
    const opponent = p === 1 ? 2 : 1;
    for (const [dr, dc] of DIRECTIONS) {
      let cr = r + dr;
      let cc = c + dc;
      let temp: {r: number, c: number}[] = [];
      while (isValidPos(cr, cc) && b[cr][cc] === opponent) {
        temp.push({r: cr, c: cc});
        cr += dr;
        cc += dc;
      }
      if (temp.length > 0 && isValidPos(cr, cc) && b[cr][cc] === p) {
        flippable.push(...temp);
      }
    }
    return flippable;
  };

  const getValidMoves = (b: BoardState, p: Player) => {
    let moves = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (getFlippable(b, i, j, p).length > 0) moves.push({r: i, c: j});
      }
    }
    return moves;
  };

  const applyMove = (b: BoardState, r: number, c: number, p: Player) => {
    const flips = getFlippable(b, r, c, p);
    if (flips.length === 0) return b;
    const newBoard = b.map(row => [...row]);
    newBoard[r][c] = p;
    for (const f of flips) newBoard[f.r][f.c] = p;
    return newBoard;
  };

  const evaluateBoard = (b: BoardState, p: Player) => {
    let score = 0;
    const opponent = p === 1 ? 2 : 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === p) score += WEIGHTS[i][j];
        else if (b[i][j] === opponent) score -= WEIGHTS[i][j];
      }
    }
    score += getValidMoves(b, p).length * 5;
    score -= getValidMoves(b, opponent).length * 5;
    return score;
  };

  const chooseMove = (b: BoardState, p: Player, int: number) => {
    const moves = getValidMoves(b, p);
    if (moves.length === 0) return null;
    if (int < 10) return moves[Math.floor(Math.random() * moves.length)];
    if (int < 30) {
      let bestMove = moves[0];
      let maxFlips = -1;
      for (const m of moves) {
        const flips = getFlippable(b, m.r, m.c, p).length;
        if (flips > maxFlips) { maxFlips = flips; bestMove = m; }
      }
      return bestMove;
    }
    let bestMove = moves[0];
    let maxEval = -Infinity;
    for (const m of moves) {
      const nb = applyMove(b, m.r, m.c, p);
      const ev = evaluateBoard(nb, p);
      if (ev > maxEval) { maxEval = ev; bestMove = m; }
    }
    return bestMove;
  };

  const getScore = (b: BoardState) => {
    let s1 = 0, s2 = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === 1) s1++;
        if (b[i][j] === 2) s2++;
      }
    }
    return { 1: s1, 2: s2 };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentPlayerMoves = getValidMoves(board, turn);
      if (currentPlayerMoves.length === 0) {
        const opp = turn === 1 ? 2 : 1;
        if (getValidMoves(board, opp).length === 0) {
          const scores = getScore(board);
          if (scores[1] > scores[2]) onFinish('win');
          else if (scores[1] < scores[2]) onFinish('lose');
          else onFinish('draw');
          return;
        }
        setTurn(opp);
        return;
      }
      const currentInt = turn === 1 ? (activeRobot.stats.intelligence || 1) : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move) {
        setBoard(applyMove(board, move.r, move.c, turn));
        setLastMove(move);
        setTurn(turn === 1 ? 2 : 1);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [board, turn]);

  const scores = getScore(board);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold bg-stone-900 text-white rounded w-12 mx-auto">{scores[1]}</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AIレベル: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold bg-white text-stone-900 border border-stone-300 rounded w-12 mx-auto">{scores[2]}</div>
        </div>
      </div>
      <div className="mx-auto w-fit p-2 bg-emerald-700 rounded-lg shadow-inner">
        <div className="grid grid-cols-8 gap-0.5 bg-emerald-900 border-2 border-emerald-900">
          {board.map((row, r) => row.map((cell, c) => (
            <div key={\`\${r}-\${c}\`} className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 flex items-center justify-center relative">
              {cell === 1 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-900 shadow-md"></div>}
              {cell === 2 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md"></div>}
              {lastMove?.r === r && lastMove?.c === c && <div className="absolute w-2 h-2 bg-red-500 rounded-full"></div>}
            </div>
          )))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-stone-700 animate-pulse">
          {turn === 1 ? '⬛ 自機ロボットの思考中...' : '⬜ 相手の思考中...'}
        </p>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/screens/minigames/OthelloGame.tsx', othelloGameTs);

// TicTacToeGame.tsx
const ticTacToeGameTs = `
import React, { useState, useEffect } from 'react';
import { Robot } from '../../core/models';
import { RobotVisual } from '../../components/robot/RobotVisual';
import { Opponent } from './constants';

type Player = 1 | 2;

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

interface Props {
  activeRobot: Robot;
  activeOpponent: Opponent;
  onFinish: (result: 'win' | 'lose' | 'draw') => void;
}

export const TicTacToeGame: React.FC<Props> = ({ activeRobot, activeOpponent, onFinish }) => {
  const [board, setBoard] = useState<(1|2|0)[]>(Array(9).fill(0));
  const [turn, setTurn] = useState<Player>(1);

  const checkWin = (b: (1|2|0)[], p: Player) => {
    return WIN_PATTERNS.some(pat => pat.every(i => b[i] === p));
  };

  const chooseMove = (b: (1|2|0)[], p: Player, int: number): number | null => {
    const empty = b.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) return null;
    if (int < 10) return empty[Math.floor(Math.random() * empty.length)];

    const opp = p === 1 ? 2 : 1;
    const winMove = empty.find(i => { const nb = [...b]; nb[i] = p; return checkWin(nb, p); });
    if (winMove !== undefined) return winMove;
    const blockMove = empty.find(i => { const nb = [...b]; nb[i] = opp; return checkWin(nb, opp); });
    if (blockMove !== undefined) return blockMove;

    if (int < 30) return empty[Math.floor(Math.random() * empty.length)];

    const minimax = (tempB: (1|2|0)[], isMax: boolean, depth: number): number => {
      if (checkWin(tempB, p)) return 10 - depth;
      if (checkWin(tempB, opp)) return depth - 10;
      if (!tempB.includes(0)) return 0;
      let best = isMax ? -Infinity : Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempB[i] === 0) {
          tempB[i] = isMax ? p : opp;
          const score = minimax(tempB, !isMax, depth + 1);
          tempB[i] = 0;
          best = isMax ? Math.max(best, score) : Math.min(best, score);
        }
      }
      return best;
    };

    let bestScore = -Infinity;
    let move = empty[0];
    for (const i of empty) {
      b[i] = p;
      const score = minimax(b, false, 0);
      b[i] = 0;
      if (score > bestScore) { bestScore = score; move = i; }
    }
    return move;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentInt = turn === 1 ? (activeRobot.stats.intelligence || 1) : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move !== null) {
        const nb = [...board];
        nb[move] = turn;
        setBoard(nb);
        if (checkWin(nb, turn)) {
          setTimeout(() => onFinish(turn === 1 ? 'win' : 'lose'), 800);
        } else if (!nb.includes(0)) {
          setTimeout(() => onFinish('draw'), 800);
        } else {
          setTurn(turn === 1 ? 2 : 1);
        }
      } else if (!board.includes(0)) {
        setTimeout(() => onFinish('draw'), 800);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [board, turn]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold text-blue-600 rounded w-12 mx-auto">〇</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AIレベル: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold text-red-500 rounded w-12 mx-auto">×</div>
        </div>
      </div>
      <div className="mx-auto w-fit p-4 bg-stone-100 rounded-lg shadow-inner">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <div key={i} className="w-16 h-16 sm:w-24 sm:h-24 bg-white shadow flex items-center justify-center text-4xl sm:text-6xl font-black rounded-lg border-2 border-stone-200 transition-colors">
              {cell === 1 && <span className="text-blue-500 animate-pulse">〇</span>}
              {cell === 2 && <span className="text-red-500 animate-pulse">×</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-stone-700 animate-pulse">
          {turn === 1 ? '自機ロボットの思考中...' : '相手の思考中...'}
        </p>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/screens/minigames/TicTacToeGame.tsx', ticTacToeGameTs);

// NimGame.tsx
const nimGameTs = `
import React, { useState, useEffect } from 'react';
import { Robot } from '../../core/models';
import { RobotVisual } from '../../components/robot/RobotVisual';
import { Opponent } from './constants';

interface Props {
  activeRobot: Robot;
  activeOpponent: Opponent;
  onFinish: (result: 'win' | 'lose' | 'draw') => void;
}

export const NimGame: React.FC<Props> = ({ activeRobot, activeOpponent, onFinish }) => {
  const [stones, setStones] = useState(21);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [lastTake, setLastTake] = useState<number | null>(null);

  const chooseTake = (currentStones: number, int: number) => {
    const max = Math.min(3, currentStones);
    if (max === 1) return 1;
    if (int < 10) return Math.floor(Math.random() * max) + 1;
    if (int < 30) {
      if (currentStones <= 4) return currentStones - 1 === 0 ? 1 : currentStones - 1;
      return Math.floor(Math.random() * max) + 1;
    }
    const target = (currentStones - 1) % 4;
    if (target > 0 && target <= max) return target;
    return 1;
  };

  useEffect(() => {
    if (stones <= 0) return;
    const timer = setTimeout(() => {
      const currentInt = turn === 1 ? (activeRobot.stats.intelligence || 1) : activeOpponent.int;
      const take = chooseTake(stones, currentInt);
      const remaining = stones - take;
      setLastTake(take);
      setStones(remaining);

      if (remaining === 0) {
        // Last one to take loses
        setTimeout(() => onFinish(turn === 1 ? 'lose' : 'win'), 1000);
      } else {
        setTurn(turn === 1 ? 2 : 1);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [stones, turn]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xs font-bold text-stone-500 rounded mx-auto min-h-[1.5rem]">
            {turn === 2 && lastTake && \`前回: \${lastTake}個取得\`}
          </div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={\`text-center p-3 rounded-lg flex-1 \${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}\`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AIレベル: {activeOpponent.int}</div>
          <div className="mt-2 text-xs font-bold text-stone-500 rounded mx-auto min-h-[1.5rem]">
             {turn === 1 && lastTake && \`前回: \${lastTake}個取得\`}
          </div>
        </div>
      </div>
      <div className="mx-auto w-fit p-6 bg-stone-100 rounded-lg shadow-inner text-center min-h-[180px]">
        <div className="mb-4 text-xl font-bold text-stone-800">残り <span className="text-3xl text-primary">{stones}</span> 個</div>
        <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
          {Array.from({length: Math.max(0, stones)}).map((_, i) => (
            <div key={i} className="text-3xl animate-bounce" style={{animationDelay: \`\${i * 0.05}s\`}}>
              🪨
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-stone-700 animate-pulse">
          {turn === 1 ? '自機ロボットの思考中...' : '相手の思考中...'}
        </p>
        <p className="text-xs text-stone-500 mt-2">1〜3個の石を取り、最後の1個を取った方が負け</p>
      </div>
    </div>
  );
};
`;
fs.writeFileSync('src/screens/minigames/NimGame.tsx', nimGameTs);

// index.ts to export all
const indexTs = `
export * from './OthelloGame';
export * from './TicTacToeGame';
export * from './NimGame';
export * from './constants';
`;
fs.writeFileSync('src/screens/minigames/index.ts', indexTs);

// Rewrite MinigameScreen.tsx
const minigameScreenTs = `
import React, { useState, useEffect } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { theme } from '../styles/theme';
import { Card, Button } from '../components/ui/core';
import { OPPONENTS, GAMES } from './minigames/constants';
import { OthelloGame, TicTacToeGame, NimGame } from './minigames';

interface MinigameScreenProps {
  state: GameState;
  engine: GameEngine;
}

export const MinigameScreen: React.FC<MinigameScreenProps> = ({ state, engine }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>('othello');
  
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);

  const activeRobot = state.robots.find(r => r.id === selectedRobotId);
  const activeOpponent = OPPONENTS.find(o => o.id === selectedOpponentId);

  useEffect(() => {
    if (battleResult === 'win' && activeOpponent) {
      (engine as any).addGold(activeOpponent.reward);
    }
  }, [battleResult]);

  const handleStartBattle = () => {
    if (!activeRobot || !activeOpponent || !selectedGameId) return;
    setIsBattleActive(true);
    setBattleResult(null);
  };

  const renderGame = () => {
    if (!activeRobot || !activeOpponent) return null;
    const props = { activeRobot, activeOpponent, onFinish: setBattleResult };
    
    switch (selectedGameId) {
      case 'othello': return <OthelloGame {...props} />;
      case 'tictactoe': return <TicTacToeGame {...props} />;
      case 'nim': return <NimGame {...props} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className={theme.typography.h2}>ロボット・バトル</h2>
        <p className="text-stone-600 text-sm">自慢のロボットを派遣して、企業のAIとオートバトル！<br/>賢さ(Int)が高いほど、ロボットはより良い手を選びます。</p>
      </div>

      {!isBattleActive && !battleResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white md:col-span-2">
            <h3 className={\`\${theme.typography.h3} mb-4 text-stone-800 border-b pb-2\`}>1. ゲームを選ぶ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={\`text-left p-3 rounded border transition-colors \${selectedGameId === g.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-stone-200 hover:bg-stone-50'}\`}
                >
                  <div className="font-bold">{g.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-white">
            <h3 className={\`\${theme.typography.h3} mb-4 text-stone-800 border-b pb-2\`}>2. 参戦ロボットを選ぶ</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.robots.length === 0 ? (
                <p className="text-stone-500 text-sm">ロボットがいません。製造してください。</p>
              ) : (
                state.robots.map(r => {
                  const isDispatched = engine.isRobotAutoDispatched(r.id) || state.activeQuest?.dispatchedRobotId === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => !isDispatched && setSelectedRobotId(r.id)}
                      disabled={isDispatched}
                      className={\`w-full text-left p-3 rounded border transition-colors \${selectedRobotId === r.id ? 'border-primary bg-primary/10' : 'border-stone-200'} \${isDispatched ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50'}\`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{r.name}</span>
                        <div className="flex gap-3 text-xs text-stone-600">
                          <span>Int: {r.stats.intelligence}</span>
                        </div>
                      </div>
                      {isDispatched && <span className="text-[10px] text-red-500">※出撃中</span>}
                    </button>
                  )
                })
              )}
            </div>
          </Card>

          <Card className="bg-white">
            <h3 className={\`\${theme.typography.h3} mb-4 text-stone-800 border-b pb-2\`}>3. 対戦相手を選ぶ</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {OPPONENTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpponentId(o.id)}
                  className={\`w-full text-left p-3 rounded border transition-colors flex justify-between items-center \${selectedOpponentId === o.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}\`}
                >
                  <div>
                    <div className="font-bold">{o.name}</div>
                    <div className="text-xs text-stone-500">{o.org} / AIレベル: {o.int}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-700 font-bold block">報酬: {o.reward} G</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="md:col-span-2 mt-4 text-center">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedRobotId || !selectedOpponentId}
              className="w-full md:w-1/2 py-4 text-lg shadow-md"
            >
              バトル開始！
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-stone-50 border-2 border-stone-200 relative">
          {!battleResult ? renderGame() : (
            <div className="text-center py-8 space-y-6">
              <div className="text-4xl font-black mb-4">
                {battleResult === 'win' && <span className="text-emerald-500 animate-bounce block">🎉 勝利！</span>}
                {battleResult === 'lose' && <span className="text-red-500">💀 敗北...</span>}
                {battleResult === 'draw' && <span className="text-stone-500">🤝 引き分け</span>}
              </div>
              {battleResult === 'win' && (
                <p className="text-amber-700 font-bold text-xl bg-amber-50 inline-block px-4 py-2 rounded-full border border-amber-200">
                  報酬: {activeOpponent?.reward} G を獲得しました！
                </p>
              )}
              <div className="mt-8">
                <Button onClick={() => { setIsBattleActive(false); setBattleResult(null); }} className="px-8 py-3">
                  戻る
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
`;
fs.writeFileSync('src/screens/MinigameScreen.tsx', minigameScreenTs);
