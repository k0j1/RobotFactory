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
import { SpaceShooterGame } from '../components/minigames/SpaceShooterGame';
import { DanmakuSurvivalGame } from '../components/minigames/DanmakuSurvivalGame';
import { RobotVisual } from '../components/robot/RobotVisual';
import { motion } from 'motion/react';

const CATEGORIES = [
  { id: 'puzzle', name: 'パズル' },
  { id: 'shooting', name: '射撃' }
];

const GAMES = [
  { id: 'othello', category: 'puzzle', name: 'オセロ', desc: '挟んで裏返す定番ボードゲーム', requiresOpponent: true },
  { id: 'gomoku', category: 'puzzle', name: '五目並べ', desc: '先に5つ並べたら勝ちのパズル', requiresOpponent: true },
  { id: 'chess', category: 'puzzle', name: 'チェス', desc: 'キャスリング無しの実力勝負', requiresOpponent: true },
  { id: 'tictactoe', category: 'puzzle', name: 'マルバツ', desc: '3つ並べたら勝ちの基本ゲーム', requiresOpponent: true },
  { id: 'space_shooter', category: 'shooting', name: 'シューティング', desc: '弾を避けながら10秒以内に撃破', requiresOpponent: false },
  { id: 'danmaku', category: 'shooting', name: '弾幕よけ', desc: '10秒間、敵の弾幕から生き残る', requiresOpponent: false }
];

interface MinigameScreenProps {
  state: GameState;
  engine: GameEngine;
}

export const MinigameScreen: React.FC<MinigameScreenProps> = ({ state, engine }) => {
  const [selectedCategory, setSelectedCategory] = useState('puzzle');
  const [selectedGame, setSelectedGame] = useState('othello');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const activeRobot = state.robots.find(r => r.id === selectedRobotId);
  const activeOpponent = OPPONENTS.find(o => o.id === selectedOpponentId);

  const selectedGameDef = GAMES.find(g => g.id === selectedGame);
  const requiresOpponent = selectedGameDef?.requiresOpponent ?? true;

  const handleFinish = (result: 'win' | 'lose' | 'draw') => {
    if (activeRobot) {
      (engine as any).recordBattleResult(activeRobot.id, result);
    }
    setBattleResult(result);
    if (result === 'win') {
      if (requiresOpponent && activeOpponent) {
        (engine as any).addGold(activeOpponent.reward);
        const kits = activeOpponent.id === 'op4' ? 5 : activeOpponent.id === 'op3' ? 3 : activeOpponent.id === 'op2' ? 2 : 1;
        (engine as any).addRepairKits(kits);
      } else if (!requiresOpponent) {
        // Flat reward for solo games
        (engine as any).addGold(50);
        (engine as any).addRepairKits(1);
      }
    }
  };

  const handleStartBattle = () => {
    if (!activeRobot) return;
    if (requiresOpponent && !activeOpponent) return;
    if ((activeRobot.currentHp ?? 12) < 1) {
      alert("HPが足りません。バトルに参加するにはHPが1必要です。");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const confirmBattleStart = () => {
    if (!activeRobot) return;
    if (requiresOpponent && !activeOpponent) return;
    (engine as any).consumeRobotHp(activeRobot.id, 1);
    setIsConfirmModalOpen(false);
    setIsBattleActive(true);
    setBattleResult(null);
    setIsPaused(false);
    setSpeed(1);
  };

  const renderGame = () => {
    if (!activeRobot) return null;
    if (requiresOpponent && !activeOpponent) return null;
    
    // We can pass a dummy opponent for games that don't need it but require the prop type, or just cast it
    const opponent = activeOpponent || OPPONENTS[0];

    switch (selectedGame) {
      case 'othello': return <OthelloGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'gomoku': return <GomokuGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'chess': return <ChessGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'tictactoe': return <TicTacToeGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'space_shooter': return <SpaceShooterGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'danmaku': return <DanmakuSurvivalGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 pb-24 space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className={theme.typography.h2}>ロボット・バトル</h2>
        <p className="text-stone-600 text-sm">様々な競技で企業のAIとオートバトル！<br/>種目に応じたステータス（Int/Agi/Dex）が高いほど有利になります。</p>
      </div>

      {!isBattleActive && !battleResult ? (
        <div className="space-y-4">
          <Card className="bg-white">
            <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>種目を選ぶ</h3>
            
            <div className="flex gap-2 mb-4 border-b border-stone-200 pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const firstGame = GAMES.find(g => g.category === cat.id);
                    if (firstGame) setSelectedGame(firstGame.id);
                  }}
                  className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors border-b-4 ${selectedCategory === cat.id ? 'border-primary text-primary bg-primary/10' : 'border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-800'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {GAMES.filter(g => g.category === selectedCategory).map(g => (
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

          <div className={`grid grid-cols-1 ${!requiresOpponent ? '' : 'md:grid-cols-2'} gap-4`}>
            <Card className="bg-white">
              <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>自機を選ぶ</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
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
                          <div className="flex gap-2 text-[10px] sm:text-xs text-stone-600 font-mono">
                            <span>HP: {r.currentHp ?? 12}/{r.maxHp ?? 12}</span>
                            <span className={selectedCategory === 'puzzle' ? 'font-black text-blue-600' : ''}>Int:{r.stats.intelligence}</span>
                            <span className={selectedGame === 'danmaku' ? 'font-black text-blue-600' : ''}>Agi:{r.stats.agility}</span>
                            <span className={selectedCategory === 'shooting' ? 'font-black text-blue-600' : ''}>Dex:{r.stats.dexterity}</span>
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

            {requiresOpponent && (
              <Card className="bg-white">
                <h3 className={`${theme.typography.h3} mb-4 text-stone-800 border-b pb-2`}>対戦相手を選ぶ</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {OPPONENTS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedOpponentId(o.id)}
                      className={`w-full text-left p-3 rounded border transition-colors flex justify-between items-center ${selectedOpponentId === o.id ? 'border-primary bg-primary/10' : 'border-stone-200 hover:bg-stone-50'}`}
                    >
                      <div>
                        <div className="font-bold">{o.name}</div>
                        <div className="flex gap-2 text-[10px] sm:text-xs text-stone-500 font-mono mt-0.5">
                          <span className={selectedCategory === 'puzzle' ? 'font-black text-blue-600' : ''}>Int:{o.int}</span>
                          <span>Agi:{o.agi}</span>
                          <span className={selectedCategory === 'shooting' ? 'font-black text-blue-600' : ''}>Dex:{o.dex}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">{o.org}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-amber-700 font-bold block">報酬: {o.reward} G</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="text-center pt-4">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedRobotId || (requiresOpponent && !selectedOpponentId)}
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
                      <span>{!requiresOpponent ? 'ガッツポーズ！ミッションクリア！' : 'ガッツポーズ！勝利の雄叫び！'}</span>
                      <span>✨</span>
                    </motion.div>

                    {/* Victorious Robot Visual */}
                    <div className="p-3 bg-gradient-to-b from-amber-100/80 to-yellow-50/80 rounded-2xl border-2 border-amber-300 shadow-lg">
                      <RobotVisual robot={activeRobot} size={140} animateVictory={true} emotion="normal" />
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
                        emotion="normal"
                      />
                    </div>
                    <div className="mt-1 font-bold text-stone-600 text-sm flex items-center gap-1">
                      <span>{activeRobot.name}</span>
                    </div>
                  </div>
                )}

                <div className="text-3xl font-black">
                  {battleResult === 'win' && <span className="text-emerald-600 drop-shadow-sm">{!requiresOpponent ? '🎉 MISSION CLEAR！' : '🎉 勝利！'}</span>}
                  {battleResult === 'lose' && <span className="text-red-500">💀 敗北...</span>}
                  {battleResult === 'draw' && <span className="text-stone-500">🤝 引き分け</span>}
                </div>

                {battleResult === 'win' && requiresOpponent && (
                  <div className="bg-amber-50 border border-amber-200 px-6 py-2.5 rounded-xl shadow-sm">
                    <p className="text-amber-800 font-bold text-lg flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>獲得報酬: +{activeOpponent?.reward} G</span>
                    </p>
                  </div>
                )}
                {battleResult === 'win' && !requiresOpponent && (
                  <div className="bg-amber-50 border border-amber-200 px-6 py-2.5 rounded-xl shadow-sm">
                    <p className="text-amber-800 font-bold text-lg flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>クリア報酬: +50 G</span>
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

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden"
          >
            <div className="bg-red-500 text-white p-4 font-bold text-lg text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>HP消費の確認</span>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-stone-700 font-bold">
                バトルに参加すると<br/>
                <span className="text-red-500 text-xl font-black">HPを1消費</span> します。
              </p>
              <div className="flex flex-col items-center bg-stone-100 rounded-lg p-3 border border-stone-200">
                <p className="text-xs text-stone-500 mb-1">現在のHP</p>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <span className="text-stone-700">{activeRobot?.currentHp ?? 12}</span>
                  <span className="text-stone-400">→</span>
                  <span className="text-red-600">{(activeRobot?.currentHp ?? 12) - 1}</span>
                </div>
              </div>
              <p className="text-sm text-stone-500">
                よろしいですか？
              </p>
            </div>
            <div className="flex bg-stone-100 border-t border-stone-200 p-2 gap-2">
              <Button 
                variant="outline" 
                className="flex-1 bg-white"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                キャンセル
              </Button>
              <Button 
                variant="danger" 
                className="flex-1"
                onClick={confirmBattleStart}
              >
                出撃する
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
