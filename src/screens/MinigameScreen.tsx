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
import { RobotVisual } from '../components/robot/RobotVisual';
import { motion } from 'motion/react';

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
      const kits = activeOpponent.id === 'op4' ? 5 : activeOpponent.id === 'op3' ? 3 : activeOpponent.id === 'op2' ? 2 : 1;
      (engine as any).addRepairKits(kits);
    }
  };

  const handleStartBattle = () => {
    if (!activeRobot || !activeOpponent) return;
    if ((activeRobot.currentHp ?? 12) < 1) {
      alert("HPが足りません。バトルに参加するにはHPが1必要です。");
      return;
    }
    (engine as any).consumeRobotHp(activeRobot.id, 1);
    setIsBattleActive(true);
    setBattleResult(null);
    setIsPaused(false);
    setSpeed(1);
  };

  const renderGame = () => {
    if (!activeRobot || !activeOpponent) return null;
    switch (selectedGame) {
      case 'othello': return <OthelloGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'gomoku': return <GomokuGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'chess': return <ChessGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'tictactoe': return <TicTacToeGame activeRobot={activeRobot} activeOpponent={activeOpponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
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
                        onClick={() => !isDispatched && (r.currentHp ?? 12) >= 1 && setSelectedRobotId(r.id)}
                        disabled={isDispatched || (r.currentHp ?? 12) < 1}
                        className={`w-full text-left p-3 rounded border transition-colors ${selectedRobotId === r.id ? 'border-primary bg-primary/10' : 'border-stone-200'} ${isDispatched || (r.currentHp ?? 12) < 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-stone-50'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{r.name}</span>
                          <div className="flex gap-3 text-xs text-stone-600">
                            <span>HP: {r.currentHp ?? 12}/{r.maxHp ?? 12}</span>
                            <span>Int: {r.stats.intelligence}</span>
                          </div>
                        </div>
                        {isDispatched && <span className="text-[10px] text-red-500">※出撃中</span>}
                        {!isDispatched && (r.currentHp ?? 12) < 1 && <span className="text-[10px] text-red-500">※HP不足</span>}
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
              <div className="space-y-5 flex flex-col items-center">
                {battleResult === 'win' && activeRobot && (
                  <motion.div 
                    className="relative flex flex-col items-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                  >
                    {/* Victory Banner / Speech Bubble */}
                    <motion.div 
                      className="mb-3 px-4 py-1.5 bg-amber-500 text-white font-bold text-sm rounded-full shadow-md flex items-center gap-1.5"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span>🏆</span>
                      <span>ガッツポーズ！勝利の雄叫び！</span>
                      <span>✨</span>
                    </motion.div>

                    {/* Victorious Robot Visual */}
                    <div className="p-3 bg-gradient-to-b from-amber-100/80 to-yellow-50/80 rounded-2xl border-2 border-amber-300 shadow-lg">
                      <RobotVisual robot={activeRobot} size={140} animateVictory={true} />
                    </div>

                    <div className="mt-2 font-bold text-stone-800 text-base flex items-center gap-1">
                      <span>{activeRobot.name}</span>
                      <span className="text-amber-500 text-xs px-2 py-0.5 bg-amber-100 rounded-full border border-amber-300">VICTORY</span>
                    </div>
                  </motion.div>
                )}

                {battleResult !== 'win' && activeRobot && (
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-stone-200/60 rounded-xl border border-stone-300">
                      <RobotVisual 
                        robot={activeRobot} 
                        size={100} 
                        emotion={battleResult === 'lose' ? 'troubled' : 'normal'}
                      />
                    </div>
                    <div className="mt-1 font-bold text-stone-600 text-sm flex items-center gap-1">
                      <span>{activeRobot.name}</span>
                      {battleResult === 'lose' && (
                        <span className="text-blue-500 text-xs px-1.5 py-0.2 bg-blue-50 rounded border border-blue-200 font-bold">
                          💦 困惑中
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-3xl font-black">
                  {battleResult === 'win' && <span className="text-emerald-600 drop-shadow-sm">🎉 勝利！</span>}
                  {battleResult === 'lose' && <span className="text-red-500">💀 敗北...</span>}
                  {battleResult === 'draw' && <span className="text-stone-500">🤝 引き分け</span>}
                </div>

                {battleResult === 'win' && (
                  <div className="bg-amber-50 border border-amber-200 px-6 py-2.5 rounded-xl shadow-sm">
                    <p className="text-amber-800 font-bold text-lg flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>獲得報酬: +{activeOpponent?.reward} G</span>
                    </p>
                  </div>
                )}

                <Button 
                  onClick={() => { setIsBattleActive(false); setBattleResult(null); }}
                  className="px-8 py-2.5 text-base shadow-md"
                >
                  結果を確認して戻る
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
