
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
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold text-blue-600 rounded w-12 mx-auto">〇</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
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
