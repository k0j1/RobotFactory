import React, { useState, useEffect } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';

const SIZE = 8;
type Player = 1 | 2;
type BoardState = number[][];

const INITIAL_BOARD: BoardState = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
INITIAL_BOARD[3][3] = 2; INITIAL_BOARD[3][4] = 1;
INITIAL_BOARD[4][3] = 1; INITIAL_BOARD[4][4] = 2;

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

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

export const OthelloGame: React.FC<MinigameProps> = ({ activeRobot, activeOpponent, onFinish, speed, isPaused, isFinished }) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<{r: number, c: number} | null>(null);

  const isValidPos = (r: number, c: number) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const getFlippable = (b: BoardState, r: number, c: number, p: Player) => {
    if (b[r][c] !== 0) return [];
    let flippable: {r: number, c: number}[] = [];
    const opp = p === 1 ? 2 : 1;
    for (const [dr, dc] of DIRECTIONS) {
      let cr = r + dr, cc = c + dc, temp = [];
      while (isValidPos(cr, cc) && b[cr][cc] === opp) {
        temp.push({r: cr, c: cc});
        cr += dr; cc += dc;
      }
      if (temp.length > 0 && isValidPos(cr, cc) && b[cr][cc] === p) flippable.push(...temp);
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
    const nb = b.map(row => [...row]);
    nb[r][c] = p;
    for (const f of flips) nb[f.r][f.c] = p;
    return nb;
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

  const evaluate = (b: BoardState, p: Player) => {
    let s = 0; const opp = p === 1 ? 2 : 1;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (b[i][j] === p) s += WEIGHTS[i][j];
        else if (b[i][j] === opp) s -= WEIGHTS[i][j];
      }
    }
    return s + getValidMoves(b, p).length * 5 - getValidMoves(b, opp).length * 5;
  };

  const chooseMove = (b: BoardState, p: Player, int: number) => {
    const moves = getValidMoves(b, p);
    if (moves.length === 0) return null;
    if (int < 10) return moves[Math.floor(Math.random() * moves.length)];
    let best = moves[0], maxEval = -Infinity;
    for (const m of moves) {
      const nb = applyMove(b, m.r, m.c, p);
      let ev = 0;
      if (int < 30) ev = getFlippable(b, m.r, m.c, p).length;
      else ev = evaluate(nb, p);
      if (ev > maxEval) { maxEval = ev; best = m; }
    }
    return best;
  };

  useEffect(() => {
    if (isFinished || isPaused) return;
    const timer = setTimeout(() => {
      const moves = getValidMoves(board, turn);
      if (moves.length === 0) {
        const oppMoves = getValidMoves(board, turn === 1 ? 2 : 1);
        if (oppMoves.length === 0) {
          const scores = getScore(board);
          if (scores[1] > scores[2]) onFinish('win');
          else if (scores[1] < scores[2]) onFinish('lose');
          else onFinish('draw');
        } else setTurn(turn === 1 ? 2 : 1);
        return;
      }
      const currentInt = turn === 1 ? activeRobot.stats.intelligence : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move) {
        setBoard(applyMove(board, move.r, move.c, turn));
        setLastMove(move);
        setTurn(turn === 1 ? 2 : 1);
      }
    }, Math.floor(800 / speed));
    return () => clearTimeout(timer);
  }, [board, turn, isPaused, isFinished, speed]);

  const scores = getScore(board);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold bg-stone-900 text-white rounded w-12 mx-auto">{scores[1]}</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AI: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold bg-white text-stone-900 border border-stone-300 rounded w-12 mx-auto">{scores[2]}</div>
        </div>
      </div>
      <div className="mx-auto w-fit p-2 bg-emerald-700 rounded-lg shadow-inner">
        <div className="grid grid-cols-8 gap-0.5 bg-emerald-900 border-2 border-emerald-900">
          {board.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 flex items-center justify-center relative">
              {cell === 1 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-stone-900 shadow-md"></div>}
              {cell === 2 && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white shadow-md"></div>}
              {lastMove?.r === r && lastMove?.c === c && <div className="absolute w-2 h-2 bg-red-500 rounded-full"></div>}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
