import React, { useState, useEffect } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';

const SIZE = 9;
type Player = 1 | 2;
type BoardState = number[][];
const INITIAL_BOARD: BoardState = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));

export const GomokuGame: React.FC<MinigameProps> = ({ activeRobot, activeOpponent, onFinish, speed, isPaused, isFinished }) => {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<{r: number, c: number} | null>(null);

  const checkWin = (b: BoardState, p: Player) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] !== p) continue;
        if (c <= SIZE - 5 && b[r][c+1]===p && b[r][c+2]===p && b[r][c+3]===p && b[r][c+4]===p) return true;
        if (r <= SIZE - 5 && b[r+1][c]===p && b[r+2][c]===p && b[r+3][c]===p && b[r+4][c]===p) return true;
        if (r <= SIZE - 5 && c <= SIZE - 5 && b[r+1][c+1]===p && b[r+2][c+2]===p && b[r+3][c+3]===p && b[r+4][c+4]===p) return true;
        if (r <= SIZE - 5 && c >= 4 && b[r+1][c-1]===p && b[r+2][c-2]===p && b[r+3][c-3]===p && b[r+4][c-4]===p) return true;
      }
    }
    return false;
  };

  const getEmpty = (b: BoardState) => {
    let empty = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (b[r][c] === 0) empty.push({r, c});
      }
    }
    return empty;
  };

  const scoreLine = (cells: number[], p: Player) => {
    const opp = p === 1 ? 2 : 1;
    let pCount = 0, oppCount = 0;
    for (let i = 0; i < 5; i++) {
      if (cells[i] === p) pCount++;
      else if (cells[i] === opp) oppCount++;
    }
    if (pCount > 0 && oppCount > 0) return 0;
    if (pCount === 5) return 100000;
    if (oppCount === 5) return -100000;
    if (pCount === 4) return 1000;
    if (oppCount === 4) return -1500;
    if (pCount === 3) return 100;
    if (oppCount === 3) return -150;
    if (pCount === 2) return 10;
    if (oppCount === 2) return -15;
    if (pCount === 1) return 1;
    if (oppCount === 1) return -1;
    return 0;
  };

  const evaluate = (b: BoardState, p: Player) => {
    let score = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (c <= SIZE - 5) score += scoreLine([b[r][c], b[r][c+1], b[r][c+2], b[r][c+3], b[r][c+4]], p);
        if (r <= SIZE - 5) score += scoreLine([b[r][c], b[r+1][c], b[r+2][c], b[r+3][c], b[r+4][c]], p);
        if (r <= SIZE - 5 && c <= SIZE - 5) score += scoreLine([b[r][c], b[r+1][c+1], b[r+2][c+2], b[r+3][c+3], b[r+4][c+4]], p);
        if (r <= SIZE - 5 && c >= 4) score += scoreLine([b[r][c], b[r+1][c-1], b[r+2][c-2], b[r+3][c-3], b[r+4][c-4]], p);
      }
    }
    return score;
  };

  const chooseMove = (b: BoardState, p: Player, int: number) => {
    const empty = getEmpty(b);
    if (empty.length === 0) return null;
    if (int < 10) return empty[Math.floor(Math.random() * empty.length)];

    let candidates = empty.filter(cell => {
      for(let dr=-1; dr<=1; dr++){
        for(let dc=-1; dc<=1; dc++){
          if (dr===0 && dc===0) continue;
          let cr = cell.r+dr, cc = cell.c+dc;
          if (cr>=0 && cr<SIZE && cc>=0 && cc<SIZE && b[cr][cc] !== 0) return true;
        }
      }
      return false;
    });

    if (candidates.length === 0) return {r: Math.floor(SIZE/2), c: Math.floor(SIZE/2)};

    let bestMove = candidates[0];
    let maxEval = -Infinity;

    for (const m of candidates) {
      const nb = b.map(row => [...row]);
      nb[m.r][m.c] = p;
      let ev = evaluate(nb, p);
      const centerDist = Math.abs(m.r - Math.floor(SIZE/2)) + Math.abs(m.c - Math.floor(SIZE/2));
      ev -= centerDist * 0.1;
      
      if (ev > maxEval) {
        maxEval = ev;
        bestMove = m;
      }
    }
    return bestMove;
  };

  useEffect(() => {
    if (isFinished || isPaused) return;
    const timer = setTimeout(() => {
      const empty = getEmpty(board);
      if (empty.length === 0) {
        onFinish('draw');
        return;
      }
      const currentInt = turn === 1 ? activeRobot.stats.intelligence : activeOpponent.int;
      const move = chooseMove(board, turn, currentInt);
      if (move) {
        const nb = board.map(row => [...row]);
        nb[move.r][move.c] = turn;
        setBoard(nb);
        setLastMove(move);
        if (checkWin(nb, turn)) onFinish(turn === 1 ? 'win' : 'lose');
        else setTurn(turn === 1 ? 2 : 1);
      }
    }, Math.floor(800 / speed));
    return () => clearTimeout(timer);
  }, [board, turn, isPaused, isFinished, speed]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold text-stone-900">⚫</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AI: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold text-white shadow-sm drop-shadow-md">⚪</div>
        </div>
      </div>
      <div className="mx-auto w-fit p-3 bg-amber-600 rounded-sm shadow-xl border-b-8 border-amber-800 relative">
        <div className="grid grid-cols-9 gap-0 relative z-10">
          {board.map((row, r) => row.map((cell, c) => (
            <div key={`${r}-${c}`} className="w-7 h-7 sm:w-10 sm:h-10 border border-amber-800/50 flex items-center justify-center relative">
              <div className="absolute inset-0 m-auto w-full h-[1px] bg-amber-900/40 z-0"></div>
              <div className="absolute inset-0 m-auto w-[1px] h-full bg-amber-900/40 z-0"></div>
              {cell === 1 && <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-stone-900 shadow-md relative z-10"></div>}
              {cell === 2 && <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-stone-50 shadow-md relative z-10 border border-stone-300"></div>}
              {lastMove?.r === r && lastMove?.c === c && <div className="absolute w-2 h-2 bg-red-500 rounded-full z-20"></div>}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
