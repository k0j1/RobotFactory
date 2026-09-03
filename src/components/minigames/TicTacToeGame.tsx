import * as Gi from 'react-icons/gi';
import React, { useState, useEffect } from 'react';
import { MinigameProps } from './Shared';
import { RobotVisual } from '../robot/RobotVisual';

type Player = 1 | 2;
type BoardState = number[];

const WIN_PATTERNS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diags
];

export const TicTacToeGame: React.FC<MinigameProps> = ({ activeRobot, activeOpponent, onFinish, speed, isPaused, isFinished, battleResult }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(0));
  const [turn, setTurn] = useState<Player>(1);
  const [lastMove, setLastMove] = useState<number | null>(null);

  const getEmpty = (b: BoardState) => b.map((v, i) => v === 0 ? i : -1).filter(v => v !== -1);
  const checkWin = (b: BoardState, p: Player) => WIN_PATTERNS.some(pat => pat.every(i => b[i] === p));

  const evaluate = (b: BoardState, p: Player) => {
    if (checkWin(b, p)) return 10;
    const opp = p === 1 ? 2 : 1;
    if (checkWin(b, opp)) return -10;
    return 0;
  };

  const chooseMove = (b: BoardState, p: Player, int: number) => {
    const empty = getEmpty(b);
    if (empty.length === 0) return null;
    if (int < 10) return empty[Math.floor(Math.random() * empty.length)];

    let bestMove = empty[0], maxEval = -Infinity;
    const opp = p === 1 ? 2 : 1;

    for (const i of empty) {
      const nb = [...b]; nb[i] = p;
      let ev = evaluate(nb, p);
      if (ev < 10 && int >= 20) {
         const oppWin = empty.some(oi => {
           if(oi===i) return false;
           const ob = [...b]; ob[oi] = opp;
           return checkWin(ob, opp);
         });
         if (oppWin) {
            const blockNb = [...b]; blockNb[i] = p;
            const oppWinAfterBlock = empty.some(oi => {
               if(oi===i) return false;
               const ob = [...blockNb]; ob[oi] = opp;
               return checkWin(ob, opp);
            });
            if (!oppWinAfterBlock) ev += 5;
            else ev -= 5;
         }
      }
      if (i === 4 && ev === 0) ev += 1; // Center preference
      
      if (ev > maxEval) { maxEval = ev; bestMove = i; }
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
      if (move !== null) {
        const nb = [...board]; nb[move] = turn;
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
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''} ${battleResult === 'win' ? 'ring-2 ring-amber-400 bg-amber-50' : ''}`}>
          <div className="flex justify-center mb-2">
            <RobotVisual robot={activeRobot} size={48} animateVictory={battleResult === 'win'} />
          </div>
          <div className="font-bold flex items-center justify-center gap-1">
            {activeRobot.name}
            {battleResult === 'win' && <span className="text-amber-500 text-xs"><Gi.GiCrown className="inline text-yellow-500" /></span>}
          </div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xl font-bold text-blue-500">⭕</div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">
            <Gi.GiRobotAntennas className="text-stone-700" />
          </div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AI: {activeOpponent.int}</div>
          <div className="mt-2 text-xl font-bold text-red-500">❌</div>
        </div>
      </div>
      <div className="mx-auto w-fit p-2 bg-stone-800 rounded-lg shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => (
            <div key={i} className={`w-16 h-16 sm:w-24 sm:h-24 bg-stone-100 rounded-md flex items-center justify-center text-4xl sm:text-6xl ${lastMove === i ? 'ring-4 ring-yellow-400' : ''}`}>
              {cell === 1 && <span className="text-blue-500">⭕</span>}
              {cell === 2 && <span className="text-red-500">❌</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
