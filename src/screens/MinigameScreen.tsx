import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { theme } from '../styles/theme';
import { Card, Button, Badge } from '../components/ui/core';
import { OPPONENTS, DanmakuDifficulty, DANMAKU_DIFFICULTIES, PianoSong, PIANO_SONGS } from '../components/minigames/Shared';
import { getPianoBestScores, PianoBestScore } from '../core/pianoScoreManager';
import { OthelloGame } from '../components/minigames/OthelloGame';
import { ChessGame } from '../components/minigames/ChessGame';
import { DanmakuSurvivalGame } from '../components/minigames/DanmakuSurvivalGame';
import { PianoGame } from '../components/minigames/PianoGame';
import { CombatGame } from '../components/minigames/CombatGame';
import { RobotVisual } from '../components/robot/RobotVisual';
import { motion } from 'motion/react';
import * as Gi from 'react-icons/gi';

interface CategoryDef {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface GameDef {
  id: string;
  category: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  requiresOpponent: boolean;
}

const CATEGORIES: CategoryDef[] = [
  { id: 'battle', name: '戦闘・対戦', icon: <Gi.GiCrossedSwords className="inline text-red-600" /> },
  { id: 'puzzle', name: 'パズル・頭脳戦', icon: <Gi.GiChessPawn className="inline text-stone-600" /> },
  { id: 'shooting', name: '射撃・機動演習', icon: <Gi.GiLightningTrio className="inline text-amber-500" /> },
  { id: 'music', name: '音楽・演奏会', icon: <Gi.GiMusicalNotes className="inline text-blue-500" /> }
];

const GAMES: GameDef[] = [
  { 
    id: 'combat', 
    category: 'battle', 
    name: 'バトル演習', 
    desc: '時間経過で攻撃・閃きと戦術を競う本格リアルタイムバトル（全能力値重視）', 
    icon: <Gi.GiCrossedSwords className="inline text-red-600" />, 
    requiresOpponent: true 
  },
  { id: 'othello', category: 'puzzle', name: 'オセロ演習', desc: '挟んで裏返す定番ボードゲーム（Int重視）', icon: <Gi.GiCheckeredFlag className="inline text-stone-700" />, requiresOpponent: true },
  { id: 'chess', category: 'puzzle', name: 'チェス演習', desc: 'キャスリング無しの頭脳勝負（Int重視）', icon: <Gi.GiChessKing className="inline text-stone-800" />, requiresOpponent: true },
  { id: 'danmaku', category: 'shooting', name: '弾幕よけ試験', desc: '10秒間、弾幕から生き残る（Agi/Dex重視）', icon: <Gi.GiBullseye className="inline text-emerald-600" />, requiresOpponent: false },
  { id: 'piano', category: 'music', name: 'ピアノ演奏', desc: '指定された楽曲を演奏する（Int/Dex重視）', icon: <Gi.GiPianoKeys className="inline text-stone-700" />, requiresOpponent: false }
];

interface MinigameScreenProps {
  state: GameState;
  engine: GameEngine;
}

export const MinigameScreen: React.FC<MinigameScreenProps> = ({ state, engine }) => {
  const [selectedCategory, setSelectedCategory] = useState('battle');
  const [selectedGame, setSelectedGame] = useState('combat');
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string | null>(null);
  const [danmakuDifficulty, setDanmakuDifficulty] = useState<DanmakuDifficulty>('normal');
  const [pianoSongId, setPianoSongId] = useState<string>(PIANO_SONGS[0]?.id || 'fur_elise');
  const [pianoBestScores, setPianoBestScores] = useState<Record<string, PianoBestScore>>(() => getPianoBestScores());
  const [isBattleActive, setIsBattleActive] = useState(false);
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const activeRobot = state.robots.find(r => r.id === selectedRobotId);
  const activeOpponent = OPPONENTS.find(o => o.id === selectedOpponentId);
  const activeDanmakuDiff = DANMAKU_DIFFICULTIES.find(d => d.id === danmakuDifficulty) || DANMAKU_DIFFICULTIES[1];
  const activePianoSong = PIANO_SONGS.find(s => s.id === pianoSongId) || PIANO_SONGS[0];
  
  const getEstimatedWinRate = (difficultyId: string, robot: any) => {
    if (!robot) return '--';
    const agi = robot.stats.agility || 10;
    const dex = robot.stats.dexterity || 10;
    const score = (agi * 1.2 + dex * 0.8) / 2;

    let rate = 0;
    if (difficultyId === 'easy') {
      rate = score * 1.0 + 30;
    } else if (difficultyId === 'normal') {
      rate = score * 1.0 - 10;
    } else if (difficultyId === 'hard') {
      rate = score * 0.8 - 40;
    }
    return Math.max(1, Math.min(99, Math.floor(rate)));
  };

  const getEstimatedPianoWinRate = (songId: string, robot: any) => {
    if (!robot) return '--';
    const int = robot.stats.intelligence || 10;
    const dex = robot.stats.dexterity || 10;
    
    // Int（楽譜理解・リズム把握）と Dex（運指・鍵盤打鍵精度）による演奏総合力
    const statBonus = (dex * 1.5) + (int * 1.5);
    const song = PIANO_SONGS.find(s => s.id === songId) || PIANO_SONGS[0];
    const diffPenalty = song.level * 4;
    
    // クリア条件「演奏精度80.0%以上」を達成できる推定確率
    const expectedRoll = 50 + statBonus - diffPenalty;
    const rate = Math.round((expectedRoll - 55) * 1.6);
    
    return Math.max(5, Math.min(99, rate));
  };

  const selectedGameDef = GAMES.find(g => g.id === selectedGame);
  const requiresOpponent = selectedGameDef?.requiresOpponent ?? true;

  const handleFinish = (result: 'win' | 'lose' | 'draw') => {
    if (activeRobot) {
      (engine as any).recordBattleResult(activeRobot.id, result);
    }
    setBattleResult(result);
    // ピアノ演奏のベストスコアを再読み込みして最新化
    if (selectedGame === 'piano') {
      setPianoBestScores(getPianoBestScores());
    }
    if (result === 'win') {
      if (requiresOpponent && activeOpponent) {
        (engine as any).addRepairKits(activeOpponent.rewardKits);
      } else if (selectedGame === 'danmaku') {
        // Difficulty-based reward for danmaku survival (repair kits only)
        (engine as any).addRepairKits(activeDanmakuDiff.rewardKits);
      } else if (selectedGame === 'piano') {
        (engine as any).addRepairKits(Math.max(1, Math.ceil(activePianoSong.level / 2)));
      } else if (!requiresOpponent) {
        // Flat reward for solo games (repair kits only)
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

    // Initialize global AudioContext during user gesture to prevent suspension in browsers
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      if (!(window as any).globalAudioCtx) {
        (window as any).globalAudioCtx = new AudioContextClass();
      } else if ((window as any).globalAudioCtx.state === 'suspended') {
        (window as any).globalAudioCtx.resume();
      }
    }

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
      case 'combat': return <CombatGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'othello': return <OthelloGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'chess': return <ChessGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} />;
      case 'danmaku': return <DanmakuSurvivalGame activeRobot={activeRobot} activeOpponent={opponent} onFinish={handleFinish} speed={speed} isPaused={isPaused} isFinished={battleResult !== null} battleResult={battleResult} difficulty={danmakuDifficulty} />;
      case 'piano': return (
        <PianoGame 
          activeRobot={activeRobot} 
          onFinish={handleFinish} 
          speed={speed} 
          isPaused={isPaused} 
          isFinished={battleResult !== null} 
          battleResult={battleResult} 
          songId={pianoSongId}
          onExit={() => {
            setIsBattleActive(false);
            setBattleResult(null);
            setPianoBestScores(getPianoBestScores());
          }}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* 工房演習アリーナ・ヘッダー */}
      <div className="flex justify-between items-end border-b-2 border-stone-300 pb-2 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Gi.GiCrossedSwords className="text-amber-600 text-2xl" />
            <h2 className={theme.typography.h2}>工房演習アリーナ</h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
            自慢のロボットを競技に出場させ、企業のAIと性能テスト！勝利で修理キットを獲得できます。
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-300 shadow-2xs">
          <span><Gi.GiSpanner className="inline text-stone-500" /> 所持キット:</span>
          <span className="font-mono text-amber-700 text-sm">{state.repairKits || 0} 個</span>
        </div>
      </div>

      {!isBattleActive && !battleResult ? (
        <div className="space-y-5">
          {/* 種目選択カード */}
          <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Gi.GiAnvil className="text-stone-600 text-lg" />
              <h3 className={`${theme.typography.h3} text-stone-800`}>演習種目を選ぶ</h3>
            </div>
            
            {/* カテゴリタブ */}
            <div className="flex gap-2 mb-3 bg-stone-200/80 p-1 rounded-xl border border-stone-300">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const firstGame = GAMES.find(g => g.category === cat.id);
                    if (firstGame) setSelectedGame(firstGame.id);
                  }}
                  className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    selectedCategory === cat.id 
                      ? 'bg-amber-600 text-white shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* 種目ボタン一覧 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GAMES.filter(g => g.category === selectedCategory).map(g => {
                const isSelected = selectedGame === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGame(g.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-300/80 shadow-xs' 
                        : 'border-stone-300 bg-white hover:border-amber-400 hover:bg-stone-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{g.icon}</span>
                        <span className="font-bold text-stone-900 text-sm">{g.name}</span>
                      </div>
                      {isSelected && (
                        <Badge className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 font-bold">
                          選択中
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 pl-7 leading-tight">{g.desc}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 自機選択 & 対戦相手/難易度選択の2カラム */}
          <div className={`grid grid-cols-1 ${requiresOpponent || selectedGame === 'danmaku' || selectedGame === 'piano' ? 'md:grid-cols-2' : ''} gap-4`}>
            {/* 自機選択 */}
            <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
                <div className="flex items-center gap-2">
                  <Gi.GiBattleMech className="text-stone-700 text-lg" />
                  <h3 className={`${theme.typography.h3} text-stone-800`}>出撃ロボット（自機）</h3>
                </div>
                <span className="text-xs text-stone-500 font-mono">
                  {state.robots.length} 体保有
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {state.robots.length === 0 ? (
                  <div className="p-6 text-center text-stone-400 text-xs bg-stone-100/60 rounded-xl border border-stone-200">
                    ロボットがいません。「制作」タブでロボットを組み立ててください。
                  </div>
                ) : (
                  state.robots.map(r => {
                    const isDispatched = engine.isRobotAutoDispatched(r.id) || state.activeQuest?.dispatchedRobotId === r.id;
                    const hp = r.currentHp ?? 12;
                    const maxHp = r.maxHp ?? 12;
                    const isHpLow = hp < 1;
                    const isSelected = selectedRobotId === r.id;

                    return (
                      <button
                        key={r.id}
                        onClick={() => !isDispatched && !isHpLow && setSelectedRobotId(r.id)}
                        disabled={isDispatched || isHpLow}
                        className={`w-full text-left p-2.5 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-300 shadow-xs' 
                            : 'border-stone-300 bg-white'
                        } ${isDispatched || isHpLow ? 'opacity-50 cursor-not-allowed bg-stone-100' : 'hover:border-stone-400 hover:bg-stone-50'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="shrink-0 bg-stone-100 p-1 rounded-lg border border-stone-300">
                            <RobotVisual robot={r} size={36} hideBackground={true} hideBubble={true} />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="font-bold text-xs sm:text-sm text-stone-900 truncate">{r.name}</span>
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                hp <= 0 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-stone-100 text-stone-700 border border-stone-200'
                              }`}>
                                HP {hp}/{maxHp}
                              </span>
                            </div>

                            {selectedGame === 'combat' ? (
                              <div className="space-y-1">
                                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                                  <span className="font-bold text-red-700 bg-red-50 px-1 rounded border border-red-200">Pow:{r.stats.power}</span>
                                  <span className="font-bold text-blue-700 bg-blue-50 px-1 rounded border border-blue-200">Def:{r.stats.defense}</span>
                                  <span className="font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200">Agi:{r.stats.agility}</span>
                                </div>
                                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">Dex:{r.stats.dexterity}</span>
                                  <span className="font-bold text-purple-700 bg-purple-50 px-1 rounded border border-purple-200">Int:{r.stats.intelligence}</span>
                                  <span className="font-bold text-stone-700 bg-stone-100 px-1 rounded border border-stone-200">耐久:{(r.stats.hp || 10) * 1000}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                                <span className={selectedCategory === 'puzzle' || selectedGame === 'piano' ? 'font-black text-blue-700 bg-blue-50 px-1 rounded' : ''}>
                                  Int:{r.stats.intelligence}
                                </span>
                                <span className={selectedGame === 'danmaku' ? 'font-black text-amber-700 bg-amber-50 px-1 rounded' : ''}>
                                  Agi:{r.stats.agility}
                                </span>
                                <span className={selectedCategory === 'shooting' || selectedGame === 'piano' ? 'font-black text-emerald-700 bg-emerald-50 px-1 rounded' : ''}>
                                  Dex:{r.stats.dexterity}
                                </span>
                              </div>
                            )}
                            
                            {isDispatched && (
                              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                                <Gi.GiHazardSign className="inline text-amber-500" /> 遠征または探索に出撃中
                              </span>
                            )}
                            {!isDispatched && isHpLow && (
                              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                                <Gi.GiHazardSign className="inline text-amber-500" /> 耐久力(HP)不足（要修理）
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            {/* 弾幕よけの難易度選択カード */}
            {selectedGame === 'danmaku' && (
              <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Gi.GiShield className="text-stone-700 text-lg" />
                      <h3 className={`${theme.typography.h3} text-stone-800`}>演習難易度</h3>
                    </div>
                    <span className="text-xs text-stone-500">弾速・密度が変化</span>
                  </div>

                  <div className="space-y-2">
                    {DANMAKU_DIFFICULTIES.map(diff => {
                      const isSelected = danmakuDifficulty === diff.id;
                      return (
                        <button
                          key={diff.id}
                          onClick={() => setDanmakuDifficulty(diff.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50/90 shadow-xs ring-2 ring-amber-300' 
                              : 'border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900">{diff.label}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${diff.badgeClass}`}>
                                {diff.subLabel}
                              </span>
                            </div>
                            <div className="text-right font-mono text-xs text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                              <Gi.GiSpanner className="inline text-stone-500" /> キット×{diff.rewardKits}
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 leading-tight">
                            {diff.desc}
                          </div>
                          <div className="text-[11px] font-bold mt-2 pt-1 border-t border-stone-200 flex justify-between items-center">
                            <span className="text-stone-600">予想生還率:</span>
                            <span className={activeRobot ? (getEstimatedWinRate(diff.id, activeRobot) !== '--' && (getEstimatedWinRate(diff.id, activeRobot) as number) >= 50 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold') : 'text-stone-400'}>
                              {activeRobot ? `約 ${getEstimatedWinRate(diff.id, activeRobot)}%` : '--%'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}

            {/* ピアノ演奏の曲・難易度選択 */}
            {selectedGame === 'piano' && (
              <div className="flex flex-col gap-4">
                {/* 曲選択 */}
                <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-2 border-b border-stone-200 pb-2 flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <Gi.GiMusicalNotes className="text-stone-700 text-lg" />
                      <h3 className={`${theme.typography.h3} text-stone-800`}>演奏曲を選ぶ</h3>
                    </div>
                    <span className="text-[11px] text-amber-800 font-bold bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                      クリア条件: 演奏精度 80.0% 以上
                    </span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {PIANO_SONGS.map(song => {
                      const isSelected = pianoSongId === song.id;
                      const best = pianoBestScores[song.id];

                      return (
                        <button
                          key={song.id}
                          onClick={() => setPianoSongId(song.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50/90 shadow-xs ring-2 ring-amber-300' 
                              : 'border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-sm text-stone-900 truncate">{song.title}</span>
                              {best?.cleared && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold font-mono px-1.5 py-0.2 rounded shrink-0">
                                  CLEAR済
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 text-stone-600 font-mono shrink-0">
                              Lv.{song.level}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500">{song.composer}</div>
                          <div className="text-[11px] text-stone-600 mt-1">{song.desc}</div>

                          {/* ベストスコア & 予想クリア率 */}
                          <div className="mt-2 pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                            <div className="bg-stone-100/90 p-1.5 rounded-lg border border-stone-200 flex items-center justify-between">
                              <span className="text-stone-500 font-bold">自己ベスト:</span>
                              {best ? (
                                <span className="font-mono font-bold text-stone-800">
                                  {best.bestScore.toLocaleString()} pts / {best.bestAccuracy}% ({best.bestRank})
                                </span>
                              ) : (
                                <span className="text-stone-400 font-sans">未挑戦</span>
                              )}
                            </div>
                            <div className="bg-stone-100/90 p-1.5 rounded-lg border border-stone-200 flex items-center justify-between">
                              <span className="text-stone-500 font-bold">予想クリア率(精度80%~):</span>
                              <span className="font-bold font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                                約{getEstimatedPianoWinRate(song.id, activeRobot)}%
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* 対戦相手選択カード（オセロ・チェス） */}
            {requiresOpponent && (
              <Card className="bg-stone-50 border-2 border-stone-300 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Gi.GiCrossedSwords className="text-stone-700 text-lg" />
                      <h3 className={`${theme.typography.h3} text-stone-800`}>対戦相手を選ぶ</h3>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">企業・ライバルAI</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {OPPONENTS.map(o => {
                      const isSelected = selectedOpponentId === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => setSelectedOpponentId(o.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center ${
                            isSelected 
                              ? 'border-amber-500 bg-amber-50/90 shadow-xs ring-2 ring-amber-300' 
                              : 'border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-stone-900 text-sm">{o.name}</div>
                            {selectedGame === 'combat' ? (
                              <div className="space-y-0.5 mt-0.5">
                                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                                  <span className="font-bold text-red-700 bg-red-50 px-1 rounded">Pow:{o.power}</span>
                                  <span className="font-bold text-blue-700 bg-blue-50 px-1 rounded">Def:{o.defense}</span>
                                  <span className="font-bold text-amber-700 bg-amber-50 px-1 rounded">Agi:{o.agi}</span>
                                </div>
                                <div className="flex gap-2 text-[10px] text-stone-600 font-mono">
                                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">Dex:{o.dex}</span>
                                  <span className="font-bold text-purple-700 bg-purple-50 px-1 rounded">Int:{o.int}</span>
                                  <span className="font-bold text-stone-700 bg-stone-100 px-1 rounded">耐久:{(o.hp || 10) * 1000}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2 text-[10px] text-stone-600 font-mono mt-0.5">
                                <span className={selectedCategory === 'puzzle' ? 'font-black text-blue-700 bg-blue-50 px-1 rounded' : ''}>
                                  Int:{o.int}
                                </span>
                                <span>Agi:{o.agi}</span>
                                <span className={selectedCategory === 'shooting' ? 'font-black text-emerald-700 bg-emerald-50 px-1 rounded' : ''}>
                                  Dex:{o.dex}
                                </span>
                              </div>
                            )}
                            <div className="text-[10px] text-stone-400 mt-0.5">{o.org}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-amber-800 font-bold bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-300 block shadow-2xs font-mono">
                              <Gi.GiSpanner className="inline text-stone-500" />×{o.rewardKits}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* バトル演習時の能力値ルールガイド */}
          {selectedGame === 'combat' && (
            <Card className="bg-stone-50 border-2 border-amber-300/80 p-3.5 sm:p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200">
                <Gi.GiCrossedSwords className="text-red-600 text-lg" />
                <h4 className="font-bold text-xs sm:text-sm text-stone-800">
                  バトル演習の機体能力値仕様
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px] text-stone-700">
                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-red-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiHeartShield className="text-sm text-rose-500" /> Vitality（耐久力）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    機体の基本耐久力。<span className="font-bold font-mono text-stone-900">値 × 1000</span> が戦闘中の実耐久値（HP）となります。
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-amber-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiBroadsword className="text-sm text-amber-600" /> Power（攻撃力）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    <span className="font-bold font-mono text-stone-900">自分Pow × 80~120 − 相手Def × 50</span> が1回の基礎ダメージとなります。
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-blue-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiShield className="text-sm text-blue-600" /> Defense（防御力）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    相手から受ける攻撃を軽減。高いほど相手の通常攻撃・技ダメージを大幅に相殺します。
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-amber-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiSpeedometer className="text-sm text-amber-500" /> Agility（敏捷性）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    0.1秒ごとに行動値が蓄積。<span className="font-bold font-mono text-stone-900">1000を超えると攻撃</span>し、行動値はゼロにリセットされます。
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-emerald-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiSprint className="text-sm text-emerald-600" /> Dexterity（回避力）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    <span className="font-bold font-mono text-stone-900">相手とのDex差</span> がある分だけ相手の攻撃を回避（DODGE）する確率が上昇します。
                  </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                  <div className="font-bold text-purple-700 flex items-center gap-1 mb-0.5">
                    <Gi.GiInspiration className="text-sm text-purple-600" /> Intelligence（閃き・戦術）
                  </div>
                  <div className="text-stone-600 leading-snug">
                    知性と他能力値を基に<span className="font-bold text-purple-900">技を閃く（習得）</span>！一度閃けば戦略に組み込み多彩な効果の技を繰り出します。
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 出撃ボタン */}
          <div className="text-center pt-2">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedRobotId || (requiresOpponent && !selectedOpponentId)}
              className="w-full sm:w-2/3 md:w-1/2 py-3.5 text-base font-bold shadow-md mx-auto"
            >
              {selectedGame === 'danmaku' ? `演習開始！ (${activeDanmakuDiff.label})` : selectedGame === 'piano' ? `演奏開始！ (${activePianoSong.title})` : 'バトル演習開始！'}
            </Button>
          </div>
        </div>
      ) : (
        /* バトル実行中・結果表示カード（工房テストモニター風） */
        <Card className="bg-stone-100 border-2 border-stone-300 p-4 sm:p-6 shadow-md rounded-2xl relative overflow-hidden">
          <div className="mb-4">
            {renderGame()}
          </div>
          
          {isBattleActive && !battleResult && selectedGame !== 'danmaku' && (
            <div className="flex justify-center items-center gap-2 mt-4 mb-4 bg-stone-200/70 p-2 rounded-xl border border-stone-300 max-w-sm mx-auto shadow-inner">
              <Button onClick={() => setIsPaused(!isPaused)} size="sm" className="w-28 text-xs font-bold flex items-center justify-center gap-1">
                {isPaused ? (
                  <>
                    <Gi.GiPlayButton className="inline text-xs" /> 再開
                  </>
                ) : (
                  <>
                    <Gi.GiPauseButton className="inline text-xs" /> 一時停止
                  </>
                )}
              </Button>
              <div className="flex gap-1">
                <Button onClick={() => setSpeed(1)} size="sm" className={`w-11 text-xs font-mono font-bold ${speed === 1 ? 'ring-2 ring-amber-400' : 'opacity-70 bg-stone-300 text-stone-700'}`}>1x</Button>
                <Button onClick={() => setSpeed(2)} size="sm" className={`w-11 text-xs font-mono font-bold ${speed === 2 ? 'ring-2 ring-amber-400' : 'opacity-70 bg-stone-300 text-stone-700'}`}>2x</Button>
                <Button onClick={() => setSpeed(3)} size="sm" className={`w-11 text-xs font-mono font-bold ${speed === 3 ? 'ring-2 ring-amber-400' : 'opacity-70 bg-stone-300 text-stone-700'}`}>3x</Button>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            {!battleResult ? (
              <p className="text-base font-bold text-stone-700 animate-pulse flex items-center justify-center gap-2">
                <Gi.GiSpanner className="animate-spin text-amber-600" />
                <span>{selectedGame === 'danmaku' ? '演習シミュレーション進行中...' : selectedGame === 'piano' ? 'ピアノ演奏演習進行中...' : '演習バトル進行中...'}</span>
              </p>
            ) : selectedGame === 'piano' ? null : (
              <div className="space-y-4 flex flex-col items-center">
                {battleResult === 'win' && activeRobot && (
                  <motion.div 
                    className="relative flex flex-col items-center"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                  >
                    {/* 勝利バナー */}
                    <motion.div 
                      className="mb-3 px-4 py-1 bg-amber-500 text-white font-black text-sm rounded-full shadow-md flex items-center gap-1.5 border border-amber-300"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Gi.GiTrophyCup className="text-amber-200 text-base" />
                      <span>{!requiresOpponent ? '演習クリア！完全生還！' : '勝利！テスト完了！'}</span>
                      <Gi.GiSparkles className="text-amber-200 text-sm" />
                    </motion.div>

                    {/* ロボットビジュアル */}
                    <div className="p-3 bg-stone-50 rounded-2xl border-2 border-amber-400 shadow-md">
                      <RobotVisual robot={activeRobot} size={130} animateVictory={true} emotion="happy" hideBubble={true} />
                    </div>

                    <div className="mt-2 font-bold text-stone-800 text-sm sm:text-base flex items-center gap-1.5">
                      <span>{activeRobot.name}</span>
                      <span className="text-amber-600 text-xs px-2 py-0.5 bg-amber-100 rounded-full border border-amber-300 font-mono font-bold">VICTORY</span>
                    </div>
                  </motion.div>
                )}

                {battleResult !== 'win' && activeRobot && (
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-stone-200/80 rounded-xl border border-stone-300 shadow-inner">
                      <RobotVisual 
                        robot={activeRobot} 
                        size={96} 
                        emotion="normal"
                        hideBubble={true}
                      />
                    </div>
                    <div className="mt-1.5 font-bold text-stone-700 text-sm flex items-center gap-1">
                      <span>{activeRobot.name}</span>
                    </div>
                  </div>
                )}

                <div className="text-2xl sm:text-3xl font-black">
                  {battleResult === 'win' && (
                    <span className="text-emerald-700 drop-shadow-sm flex items-center justify-center gap-1.5">
                      <Gi.GiPartyPopper className="inline text-amber-500" />
                      <span>{!requiresOpponent ? 'MISSION CLEAR！' : '演習勝利！'}</span>
                    </span>
                  )}
                  {battleResult === 'lose' && (
                    <span className="text-rose-600 flex items-center justify-center gap-1.5">
                      <Gi.GiCrossedBones className="inline text-stone-500" />
                      <span>演習失敗...（敗北）</span>
                    </span>
                  )}
                  {battleResult === 'draw' && (
                    <span className="text-stone-600 flex items-center justify-center gap-1.5">
                      <Gi.GiScales className="inline text-stone-500" />
                      <span>引き分け</span>
                    </span>
                  )}
                </div>

                {battleResult === 'win' && requiresOpponent && (
                  <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2.5 rounded-xl shadow-xs">
                    <p className="text-amber-900 font-bold text-base sm:text-lg flex items-center justify-center gap-2">
                      <span className="text-xl"><Gi.GiSpanner className="inline text-stone-500" /></span>
                      <span>獲得報酬: 修理キット +{activeOpponent?.rewardKits}個</span>
                    </p>
                  </div>
                )}
                {battleResult === 'win' && !requiresOpponent && selectedGame === 'danmaku' && (
                  <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2.5 rounded-xl shadow-xs text-center">
                    <p className="text-amber-900 font-bold text-base sm:text-lg flex items-center justify-center gap-2">
                      <span className="text-xl"><Gi.GiSpanner className="inline text-stone-500" /></span>
                      <span>クリア報酬 ({activeDanmakuDiff.label}): 修理キット +{activeDanmakuDiff.rewardKits}個</span>
                    </p>
                  </div>
                )}
                {battleResult === 'win' && !requiresOpponent && selectedGame !== 'danmaku' && selectedGame !== 'piano' && (
                  <div className="bg-amber-50 border-2 border-amber-300 px-6 py-2.5 rounded-xl shadow-xs">
                    <p className="text-amber-900 font-bold text-base sm:text-lg flex items-center justify-center gap-2">
                      <span className="text-xl"><Gi.GiSpanner className="inline text-stone-500" /></span>
                      <span>クリア報酬: 修理キット +1個</span>
                    </p>
                  </div>
                )}

                <Button 
                  onClick={() => { setIsBattleActive(false); setBattleResult(null); }}
                  className="px-8 py-2.5 text-sm sm:text-base shadow-md font-bold"
                >
                  結果を確認して戻る
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 出撃確認モーダル（工房アラート風） */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-stone-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-stone-900 border-2 border-stone-700 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-stone-100"
          >
            <div className="bg-amber-600/90 text-white p-3.5 font-bold text-base text-center flex items-center justify-center gap-2 border-b border-amber-500">
              <span><Gi.GiHazardSign className="inline text-yellow-500" />️</span>
              <span>耐久力(HP)消費の確認</span>
            </div>
            <div className="p-5 text-center space-y-3.5">
              <p className="text-stone-300 text-sm">
                演習バトルに出撃すると、機体の<br/>
                <span className="text-amber-400 text-base font-black">HPを1消費</span> します。
              </p>
              
              <div className="flex flex-col items-center bg-stone-950/80 rounded-xl p-3 border border-stone-800">
                <p className="text-xs text-stone-400 mb-1 font-bold">出撃後の耐久力 (HP)</p>
                <div className="flex items-center gap-3 font-mono font-bold text-lg">
                  <span className="text-stone-300">{activeRobot?.currentHp ?? 12}</span>
                  <span className="text-amber-400">→</span>
                  <span className="text-rose-400 font-black">{(activeRobot?.currentHp ?? 12) - 1}</span>
                </div>
              </div>
              
              <p className="text-xs text-stone-400">
                出撃してもよろしいですか？
              </p>
            </div>
            <div className="flex bg-stone-950 border-t border-stone-800 p-2.5 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 font-bold text-xs"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                キャンセル
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 font-bold text-xs"
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
