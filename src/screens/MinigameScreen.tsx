import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { theme } from '../styles/theme';
import { Card, Button } from '../components/ui/core';
import { OPPONENTS } from '../components/minigames/Shared';
import { OthelloGame } from '../components/minigames/OthelloGame';
import { GomokuGame } from '../components/minigames/GomokuGame';
import { ChessGame } from '../components/minigames/ChessGame';
import { TicTacToeGame } from '../components/minigames/TicTacToeGame';

const GAMES = [
  { id: 'othello', name: 'オセロ', desc: '挟んで裏返す定番ボードゲーム' },
  { id: 'gomoku', name: '五目並べ', desc: '先に5つ並べたら勝ちのパズル' },
  { id: 'chess', name: 'チェス', desc: 'キャスリング無しの実力勝負' },
  { id: 'tictactoe', name: 'マルバツ', desc: '3つ並べたら勝ちの基本ゲーム' }
];

interface MinigameScreenProps {
  state: GameState;
  engine: GameEngine;
}

export const MinigameScreen: React.FC<MinigameScreenProps> = ({ state, engine }) => {
  const [selectedGame, setSelectedGame] = useState('othello');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const activeRobot = state.robots.find(r => r.id === selectedRobotId);
  const activeOpponent = OPPONENTS.find(o => o.id === selectedOpponentId);

  const handleFinish = (result: 'win' | 'lose' | 'draw') => {
    if (activeRobot) {
      (engine as any).recordBattleResult(activeRobot.id, result);
    }
    setBattleResult(result);
    if (result === 'win' && activeOpponent) {
      (engine as any).addGold(activeOpponent.reward);
    }
  };

  const handleStartBattle = () => {
    if (!activeRobot || !activeOpponent) return;
    setIsBattleActive(true);
    setBattleResult(null);
    setIsPaused(false);
    setSpeed(1);
  };

  const renderGame = () => {
    if (!activeRobot || !activeOpponent) return null;
    switch (selectedGame) {
      case 'othello': return <OthelloGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} />;
      case 'gomoku': return <GomokuGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} />;
      case 'chess': return <ChessGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} />;
      case 'tictactoe': return <TicTacToeGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className={theme.typography.h2}>ロボット・バトル</h2>
        <p className="text-stone-600 text-sm">様々なボードゲームで企業のAIとオートバトル！<br/>賢さ(Int)が高いほど、ロボットはより良い手を選びます。</p>
      </div>

      {!isBattleActive && !battleResult ? (
        <div className="space-y-4">
          <Card className="bg-white">
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>種目を選ぶ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGame(g.id)}
                  className={`p-3 rounded border text-left transition-colors ${selectedGame === g.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}`}
                >
                  <div className="font-bold">{g.name}</div>
                  <div className="text-[10px] text-stone-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white">
              <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>自機を選ぶ</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {state.robots.length === 0 ? (
                  <p className="text-stone-500 text-sm">ロボットがいません。</p>
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
              <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>対戦相手を選ぶ</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {OPPONENTS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOpponentId(o.id)}
                    className={`w-full text-left p-3 rounded border transition-colors flex justify-between items-center ${selectedOpponentId === o.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}`}
                  >
                    <div>
                      <div className="font-bold">{o.name}</div>
                      <div className="text-xs text-stone-500">{o.org} / AI: {o.int}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-700 font-bold block">報酬: {o.reward} G</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedRobotId || !selectedOpponentId}
              className="w-full md:w-1/2 py-4 text-lg"
            >
              バトル開始！
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-stone-50 border-2 border-stone-200">
          <div className="mb-6">
            {renderGame()}
          </div>
          
          {isBattleActive && !battleResult && (
            <div className="flex justify-center gap-2 mt-4 mb-4">
              <Button onClick={() => setIsPaused(!isPaused)} className="w-32 text-sm">
                {isPaused ? '▶ 再開' : '⏸ 一時停止'}
              </Button>
              <Button onClick={() => setSpeed(1)} className={`w-14 ${speed === 1 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}`}>1x</Button>
              <Button onClick={() => setSpeed(2)} className={`w-14 ${speed === 2 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}`}>2x</Button>
              <Button onClick={() => setSpeed(3)} className={`w-14 ${speed === 3 ? 'ring-2 ring-primary' : 'opacity-70 bg-stone-300 text-stone-700'}`}>3x</Button>
            </div>
          )}

          <div className="text-center mt-6">
            {!battleResult ? (
              <p className="text-lg font-bold text-stone-700 animate-pulse">
                バトル進行中...
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-3xl font-black">
                  {battleResult === 'win' && <span className="text-emerald-500">🎉 勝利！</span>}
                  {battleResult === 'lose' && <span className="text-red-500">💀 敗北...</span>}
                  {battleResult === 'draw' && <span className="text-stone-500">🤝 引き分け</span>}
                </div>
                {battleResult === 'win' && (
                  <p className="text-amber-700 font-bold text-lg">報酬: {activeOpponent?.reward} G を獲得しました！</p>
                )}
                <Button onClick={() => { setIsBattleActive(false); setBattleResult(null); }}>
                  戻る
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
