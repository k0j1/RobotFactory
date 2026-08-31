import React, { useState, useRef, useEffect } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { LOCATIONS, MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { LocationEnvironment } from '../components/robot/LocationEnvironment';
import { theme } from '../styles/theme';
import { TutorialPopup } from '../components/ui/TutorialPopup';
import { motion, AnimatePresence } from 'motion/react';
import { RobotRadarChart } from '../components/robot/RobotRadarChart';

export const QuestScreen: React.FC<{ state: GameState, engine: GameEngine, onNavigate?: (v: string) => void }> = ({ state, engine, onNavigate }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [showDropsForLoc, setShowDropsForLoc] = useState<string | null>(null);
  const [showRadarChart, setShowRadarChart] = useState<boolean>(false);
  const [showHudRadar, setShowHudRadar] = useState<boolean>(false);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState<boolean>(false);
  const [departingState, setDepartingState] = useState<{ isDeparting: boolean, locId: string | null }>({ isDeparting: false, locId: null });
  const topSelectionRef = useRef<HTMLDivElement>(null);

  // スクロール位置を監視して上部ロボット選択部を通り過ぎたかを判定
  useEffect(() => {
    const handleScroll = () => {
      if (!topSelectionRef.current) return;
      const rect = topSelectionRef.current.getBoundingClientRect();
      // 上部のロボット選択カードの底面が画面上部（ヘッダー付近）を通り過ぎたら右上HUDを表示
      setIsScrolledPastTop(rect.bottom < 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初期判定
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartQuest = (locId: string) => {
    // 進行中のクエストがあるかチェック（二重送信防止）
    if (state.activeQuest) return;
    
    try {
      if (!selectedRobotId) {
        // ロボットが選択されていない場合はアニメーションなしで即時出発
        engine.startQuest(locId, undefined);
        if (onNavigate) {
          onNavigate('dashboard');
        }
        return;
      }

      setDepartingState({ isDeparting: true, locId });
      
      setTimeout(() => {
        try {
          engine.startQuest(locId, selectedRobotId);
          if (onNavigate) {
            onNavigate('dashboard');
          }
        } catch (e: any) {
          alert(e.message || '遠征の開始に失敗しました');
          setDepartingState({ isDeparting: false, locId: null });
        }
      }, 1500); // 1.5秒のアニメーション
    } catch (e: any) {
      alert(e.message || '遠征の開始に失敗しました');
    }
  };

  const selectedRobot = state.robots.find(r => r.id === selectedRobotId);

  // 選択可能なロボットリスト（HP>0 かつ 自動探索中でないもの ＋ 同伴なし）
  const selectableRobotIds: (string | null)[] = [
    null,
    ...state.robots
      .filter(r => r.currentHp > 0 && !state.autoDispatches?.some(d => d.robotId === r.id))
      .map(r => r.id)
  ];

  const handleCycleRobot = (direction: 'prev' | 'next') => {
    if (selectableRobotIds.length <= 1) return;
    const currentIndex = selectableRobotIds.indexOf(selectedRobotId);
    let newIndex = 0;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + selectableRobotIds.length) % selectableRobotIds.length;
    } else {
      newIndex = (currentIndex + 1) % selectableRobotIds.length;
    }
    setSelectedRobotId(selectableRobotIds[newIndex]);
  };

  const scrollToRobotSelection = () => {
    topSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-6 relative">
      {departingState.isDeparting && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/60 backdrop-blur-sm`}>
          <motion.div
            initial={{ x: -50, y: 0, scale: 1.5, opacity: 0 }}
            animate={{ x: [-50, 100, 400], y: [0, -20, -50], scale: [1.5, 1, 0.2], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeIn" }}
            className="flex flex-col items-center justify-center drop-shadow-2xl"
          >
            {selectedRobot && (
              <div className="relative">
                <RobotVisual robot={selectedRobot} size={120} hideBackground={true} animateExploration={true} />
                <motion.div 
                  animate={{ x: [-20, -40, -60], opacity: [0.8, 0.4, 0], scale: [1, 1.5, 2] }}
                  transition={{ repeat: Infinity, duration: 0.3 }}
                  className="absolute bottom-2 -left-8 text-2xl"
                >
                  💨
                </motion.div>
              </div>
            )}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="mt-8 text-2xl font-bold text-white drop-shadow-md"
          >
            出発！
          </motion.h2>
        </div>
      )}


      <TutorialPopup 
        tutorialId="quest_first_visit" 
        state={state} 
        engine={engine} 
        title="遠征（探索）について" 
        description={"ここではロボットを連れて行って素材を集めることができます。\n・好きな場所を選んで「ここへ遠征する」を押すと、一定時間後に素材を持ち帰ります。\n・ロボットを連れて行くとアイテムドロップ枠が増え、さらに素早さ(Agi)に応じて遠征時間が短縮されます！"} 
      />
  
      <div className="flex items-center justify-between border-b-2 border-stone-300 pb-2">
        <h2 className={theme.typography.h2}>遠征先を選ぶ</h2>
        {state.activeQuest && (
          <Badge className="bg-emerald-500 text-white font-bold animate-pulse">遠征中</Badge>
        )}
      </div>
      <p className={theme.typography.body}>場所を指定して素材を集めます。時間経過で帰還します。</p>

      {/* Robot Selection (Scouter Style) */}
      <div ref={topSelectionRef} className={`p-4 bg-stone-950 ${theme.radius.md} border border-emerald-800/50 overflow-hidden relative shadow-inner mb-6`}>
        {/* Scouter background grid / scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        <div className="flex justify-between items-center gap-2 mb-3 relative z-10">
          <div className="min-w-0">
            <h3 className="font-bold text-emerald-400 font-mono tracking-wider flex items-center gap-2 text-xs sm:text-sm truncate">
              <span className="animate-pulse shrink-0">▶</span> TARGET SELECTION
            </h3>
            <p className="text-[10px] text-emerald-600/80 font-mono mt-0.5 uppercase truncate">
              Select unit. Agility reduces quest time.
            </p>
          </div>
          {selectedRobot && (
            <button
              type="button"
              onClick={() => setShowRadarChart(!showRadarChart)}
              className={`text-xs font-mono px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                showRadarChart 
                  ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                  : 'bg-stone-900 border-emerald-800/60 text-emerald-500 hover:border-emerald-500 hover:text-emerald-400'
              }`}
            >
              <span>📊</span>
              <span>{showRadarChart ? 'レーダー閉' : 'レーダー'}</span>
            </button>
          )}
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* ロボットなし */}
          <button 
            onClick={() => setSelectedRobotId(null)}
            className={`snap-center shrink-0 w-32 h-44 flex flex-col items-center justify-center transition-all relative ${selectedRobotId === null ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
          >
            {selectedRobotId === null && (
              <>
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
              </>
            )}
            <div className={`absolute inset-0 border border-emerald-800/30 ${selectedRobotId === null ? 'bg-emerald-950/40' : 'bg-stone-900/40'}`} />
            
            <span className="text-4xl mb-2 relative z-10 opacity-50 grayscale">🚶</span>
            <span className={`font-bold text-xs font-mono relative z-10 ${selectedRobotId === null ? 'text-emerald-300' : 'text-emerald-700'}`}>NO UNIT</span>
            <span className={`text-[9px] font-mono mt-1 relative z-10 ${selectedRobotId === null ? 'text-emerald-500' : 'text-emerald-800/50'}`}>BASE MATERIAL ONLY</span>
          </button>
          
          {/* ロボット一覧 */}
          {state.robots.map(r => {
            const isAutoDispatched = state.autoDispatches?.some(d => d.robotId === r.id);
            const isSelected = selectedRobotId === r.id;
            
            return (
              <button 
                key={r.id}
                onClick={() => !isAutoDispatched && setSelectedRobotId(r.id)}
                disabled={isAutoDispatched}
                className={`snap-center shrink-0 w-40 h-44 flex flex-col items-center justify-center transition-all relative ${isSelected ? 'scale-105' : ''} ${isAutoDispatched ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:brightness-125'}`}
              >
                {/* ターゲット枠 (選択時) */}
                {isSelected && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400 z-20" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400 z-20" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400 z-20" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400 z-20" />
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none z-10" />
                  </>
                )}
                
                {/* ベース背景 */}
                <div className={`absolute inset-0 border z-0 ${isSelected ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-emerald-900/30 bg-stone-900/60'}`} />
                
                {isAutoDispatched && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-stone-900/60 backdrop-blur-[1px] rounded">
                    <span className="bg-red-950/90 text-red-400 border border-red-800 text-[10px] px-2 py-0.5 font-bold mb-1">選択不可</span>
                    <span className="text-[9px] text-red-300 font-mono text-center leading-tight">自動探索中<br/>(AUTO)</span>
                  </div>
                )}
                
                {/* スキャンライン (選択時) */}
                {isSelected && (
                  <motion.div 
                    className="absolute left-0 right-0 h-[1px] bg-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.8)] z-20"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}

                <div className="mb-1 scale-75 h-20 flex items-center justify-center relative z-10 brightness-110 contrast-125">
                  <RobotVisual robot={r} size={80} />
                </div>
                
                <div className="w-full px-2 mt-1 relative z-10">
                  <div className={`font-bold text-xs truncate text-center ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    {r.name}
                  </div>
                  <div className={`flex justify-center gap-2 mt-1 text-[9px] font-mono ${isSelected ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    <span>PWR:{r.stats.power}</span>
                    <span>AGI:{r.stats.agility}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 選択中ロボットのレーダーチャート詳細パネル */}
        <AnimatePresence>
          {showRadarChart && selectedRobot && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-emerald-900/60 pt-3 mt-1 relative z-10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-stone-900/80 p-3 rounded-lg border border-emerald-800/40">
                <div className="shrink-0 flex flex-col items-center">
                  <span className="text-xs font-mono font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <span>📡</span> {selectedRobot.name} の性能解析
                  </span>
                  <RobotRadarChart robot={selectedRobot} size={180} themeStyle="cyber" />
                </div>
                <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">❤️ 耐久 (HP)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.hp}</span>
                    <span className="text-[9px] text-stone-500 block">タフネス</span>
                  </div>
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">⚔️ 攻撃 (POW)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.power}</span>
                    <span className="text-[9px] text-stone-500 block">素材枠増加</span>
                  </div>
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">🛡️ 防御 (DEF)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.defense}</span>
                    <span className="text-[9px] text-stone-500 block">ダメージ軽減</span>
                  </div>
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">⚡ 速度 (AGI)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.agility}</span>
                    <span className="text-[9px] text-stone-500 block">所要時間短縮</span>
                  </div>
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">🎯 探索 (DEX)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.dexterity}</span>
                    <span className="text-[9px] text-stone-500 block">発見精度向上</span>
                  </div>
                  <div className="bg-stone-950/70 border border-emerald-900/50 p-2 rounded">
                    <span className="text-emerald-500 font-bold block">🔮 解析 (INT)</span>
                    <span className="text-sm font-bold text-emerald-300">{selectedRobot.stats.intelligence}</span>
                    <span className="text-[9px] text-stone-500 block">幸運・属性適性</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map(loc => {
          const isUnlocked = state.unlockedLocations.includes(loc.id);
          const canUnlock = !isUnlocked && state.gold >= loc.unlockCostG;

          // Agilityによる短縮計算
          const baseSec = loc.baseTimeMs / 1000;
          // 気候・天候タグの取得
          const weather = engine.getLocationWeather(loc.id, Date.now());
          
          const agiReductionSec = selectedRobot ? Math.min(baseSec * 0.8, selectedRobot.stats.agility) : 0;
          // ベースの時間に敏捷性短縮を反映したあと、天候のペナルティ倍率をかける
          const finalSec = Math.floor(Math.max(3, baseSec - agiReductionSec) * weather.timeMultiplier);
          const baseFinalSec = Math.floor(baseSec * weather.timeMultiplier);

          return (
            <Card key={loc.id} className={`relative overflow-hidden ${!isUnlocked ? 'opacity-75' : ''}`}>
              {/* 自動探索時の背景を背面に表示 */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <LocationEnvironment locationId={loc.id} animateScroll={true} speedMultiplier={0.2} />
              </div>
              {/* 薄い暗幕をかけて文字を読みやすくする */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-stone-900/40 backdrop-blur-[2px]"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{loc.name}</h3>
                  <button 
                    onClick={() => setShowDropsForLoc(showDropsForLoc === loc.id ? null : loc.id)}
                    className="text-[11px] bg-stone-900/80 hover:bg-stone-800 text-stone-100 px-2.5 py-1 rounded-full font-bold border border-stone-600 shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-[10px] text-stone-400">{showDropsForLoc === loc.id ? '▲ 閉じる' : '▼ 報酬を見る'}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <p className={`${theme.typography.small} text-stone-200 bg-stone-900/60 px-2 py-0.5 rounded font-medium border border-stone-700/50`}>
                    所要時間: <span className={selectedRobot && agiReductionSec > 0 ? "line-through text-stone-400" : "font-mono font-bold text-white"}>{baseFinalSec}秒</span>
                  </p>
                  {selectedRobot && agiReductionSec > 0 && (
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50 shadow-sm">
                      ➔ {finalSec}秒⚡
                    </span>
                  )}
                </div>

                <p className="mb-2 text-sm text-stone-100 bg-stone-900/50 p-2 rounded border border-stone-700/50 drop-shadow">{loc.description}</p>
                
                {/* 天候情報の表示 */}
                <div className={`mb-4 flex items-center gap-3 text-sm p-2 rounded border drop-shadow ${weather.timeMultiplier > 1 ? 'bg-red-900/50 border-red-700/50 text-red-50' : 'bg-emerald-900/50 border-emerald-700/50 text-emerald-50'}`}>
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded bg-stone-900/60 shadow-inner">
                    <span className="text-xl">{weather.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="font-bold text-[13px]">{weather.name}</div>
                    <div className="text-[11px] opacity-90">{weather.description}</div>
                  </div>
                  <div className="ml-auto font-mono font-bold text-lg bg-stone-900/60 px-2 py-1 rounded border border-stone-700/50 whitespace-nowrap">
                    x{weather.timeMultiplier.toFixed(1)}
                  </div>
                </div>

                <AnimatePresence>
                  {showDropsForLoc === loc.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4"
                    >
                      <div className="p-2.5 bg-stone-900/80 border border-stone-600/80 rounded-lg shadow-inner">
                        <div className="text-[10px] text-stone-400 mb-1.5 font-bold">獲得可能な素材一覧</div>
                        <div className="flex flex-wrap gap-1.5">
                          {loc.drops.map((dropId, i) => {
                            const mat = MATERIALS.find(m => m.id === dropId);
                            if (!mat) return null;
                            const rarityStyle = theme.rarity[mat.rarity] || theme.rarity[1];
                            return (
                              <Badge key={`${dropId}-${i}`} className={`${rarityStyle.bg} ${rarityStyle.text} border ${rarityStyle.border} px-1.5 py-0.5 text-[10px] flex items-center gap-1 shadow-xs`}>
                                <MaterialIcon materialId={mat.id} size={12} />
                                <span>{mat.name}</span>
                                <span className={rarityStyle.starColor}>{rarityStyle.stars}</span>
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isUnlocked ? (
                  <Button 
                    className="w-full shadow-lg border border-stone-700/50 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm" 
                    disabled={!!state.activeQuest}
                    onClick={() => handleStartQuest(loc.id)}
                  >
                    ここへ遠征する
                  </Button>
                ) : (
                  <div className="flex items-center justify-between bg-stone-900/80 p-2.5 rounded-lg border border-amber-500/50 shadow-inner">
                    <span className="font-bold text-amber-400">解放費用: {loc.unlockCostG} G</span>
                    <Button 
                      variant="secondary" 
                      disabled={!canUnlock}
                      onClick={() => engine.unlockLocation(loc.id)}
                      className="bg-amber-600 hover:bg-amber-500 text-white border-none"
                    >
                      解放する
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* スクロール閲覧時：画面上部右側に固定表示される選択中ロボットHUD */}
      <AnimatePresence>
        {isScrolledPastTop && (
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 sm:top-16 right-2 sm:right-4 z-40 max-w-[calc(100vw-1rem)] sm:max-w-xs"
          >
            <div className="bg-stone-950/95 border-2 border-emerald-500/80 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-stone-100 flex flex-col gap-2">
              {/* メインHUD行 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* 機体切り替え ◀ ボタン */}
                  {selectableRobotIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleCycleRobot('prev')}
                      className="w-6 h-6 shrink-0 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer"
                      title="前のロボットへ"
                    >
                      ◀
                    </button>
                  )}

                  {selectedRobot ? (
                    <div className="shrink-0 bg-stone-900 border border-emerald-500/40 p-0.5 rounded-lg flex items-center justify-center">
                      <RobotVisual robot={selectedRobot} size={32} />
                    </div>
                  ) : (
                    <div className="shrink-0 w-8 h-8 bg-stone-900 border border-stone-700 rounded-lg flex items-center justify-center text-sm grayscale opacity-60">
                      🚶
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/90 px-1 rounded border border-emerald-800/60 whitespace-nowrap">
                        選択中
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[90px] sm:max-w-[120px]">
                        {selectedRobot ? selectedRobot.name : '同伴なし'}
                      </span>
                    </div>
                    {selectedRobot ? (
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                        <span>⚡ -{selectedRobot.stats.agility}s</span>
                        <span>❤️ {selectedRobot.currentHp}/{selectedRobot.stats.hp}</span>
                      </div>
                    ) : (
                      <div className="text-[9px] font-mono text-stone-400 mt-0.5 truncate">
                        基本枠で遠征
                      </div>
                    )}
                  </div>

                  {/* 機体切り替え ▶ ボタン */}
                  {selectableRobotIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleCycleRobot('next')}
                      className="w-6 h-6 shrink-0 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer"
                      title="次のロボットへ"
                    >
                      ▶
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {selectedRobot && (
                    <button
                      type="button"
                      onClick={() => setShowHudRadar(!showHudRadar)}
                      className={`text-[11px] font-mono font-bold px-1.5 py-1 rounded border transition-all flex items-center gap-0.5 cursor-pointer whitespace-nowrap ${
                        showHudRadar
                          ? 'bg-emerald-900/90 border-emerald-400 text-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.3)]'
                          : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border-emerald-600/60'
                      }`}
                      title="性能レーダーチャートを表示"
                    >
                      <span>📊</span>
                      <span className="text-[10px]">{showHudRadar ? '閉' : ''}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={scrollToRobotSelection}
                    className="text-[11px] font-mono font-bold bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white border border-stone-600 px-1.5 py-1 rounded transition-colors flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                    title="上部の機体選択へスクロール"
                  >
                    <span>▲</span>
                  </button>
                </div>
              </div>

              {/* インプレース・レーダーチャート（HUD直下ドロップダウン展開） */}
              <AnimatePresence>
                {showHudRadar && selectedRobot && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-emerald-900/60 pt-2"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 bg-stone-900/90 p-2 rounded-lg border border-emerald-800/50">
                      <RobotRadarChart robot={selectedRobot} size={140} themeStyle="cyber" />
                      <div className="w-full grid grid-cols-3 gap-1 text-[9px] font-mono">
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-rose-400 font-bold block">❤️ HP {selectedRobot.stats.hp}</span>
                        </div>
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-orange-400 font-bold block">⚔️ POW {selectedRobot.stats.power}</span>
                        </div>
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-yellow-400 font-bold block">⚡ AGI {selectedRobot.stats.agility}</span>
                        </div>
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-blue-400 font-bold block">🛡️ DEF {selectedRobot.stats.defense}</span>
                        </div>
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-emerald-400 font-bold block">🎯 DEX {selectedRobot.stats.dexterity}</span>
                        </div>
                        <div className="bg-stone-950/80 p-1 rounded border border-emerald-900/50 text-center">
                          <span className="text-purple-400 font-bold block">🔮 INT {selectedRobot.stats.intelligence}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


