
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
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 1 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2"><RobotVisual robot={activeRobot} size={48} /></div>
          <div className="font-bold">{activeRobot.name}</div>
          <div className="text-xs text-stone-600">Int: {activeRobot.stats.intelligence}</div>
          <div className="mt-2 text-xs font-bold text-stone-500 rounded mx-auto min-h-[1.5rem]">
            {turn === 2 && lastTake && `前回: ${lastTake}個取得`}
          </div>
        </div>
        <div className="px-4 font-black text-3xl text-stone-300">VS</div>
        <div className={`text-center p-3 rounded-lg flex-1 ${turn === 2 ? 'bg-stone-200 shadow-inner' : ''}`}>
          <div className="flex justify-center mb-2 h-12 items-center text-4xl">🤖</div>
          <div className="font-bold">{activeOpponent.name}</div>
          <div className="text-xs text-stone-600">AIレベル: {activeOpponent.int}</div>
          <div className="mt-2 text-xs font-bold text-stone-500 rounded mx-auto min-h-[1.5rem]">
             {turn === 1 && lastTake && `前回: ${lastTake}個取得`}
          </div>
        </div>
      </div>
      <div className="mx-auto w-fit p-6 bg-stone-100 rounded-lg shadow-inner text-center min-h-[180px]">
        <div className="mb-4 text-xl font-bold text-stone-800">残り <span className="text-3xl text-primary">{stones}</span> 個</div>
        <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
          {Array.from({length: Math.max(0, stones)}).map((_, i) => (
            <div key={i} className="text-3xl animate-bounce" style={{animationDelay: `${i * 0.05}s`}}>
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
