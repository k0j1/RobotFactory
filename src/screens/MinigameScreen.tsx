
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
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>1. ゲームを選ぶ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGameId(g.id)}
                  className={`text-left p-3 rounded border transition-colors ${selectedGameId === g.id ? 'border-primary bg-primary/10 shadow-sm' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <div className="font-bold">{g.name}</div>
                  <div className="text-xs text-stone-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-white">
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>2. 参戦ロボットを選ぶ</h3>
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
                      className={`w-full text-left p-3 rounded border transition-colors ${selectedRobotId === r.id ? 'border-primary bg-primary/10' : 'border-stone-200'} ${isDispatched ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50'}`}
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
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>3. 対戦相手を選ぶ</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {OPPONENTS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOpponentId(o.id)}
                  className={`w-full text-left p-3 rounded border transition-colors flex justify-between items-center ${selectedOpponentId === o.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}`}
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
