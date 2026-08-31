import React, { useState } from 'react';
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

export const QuestScreen: React.FC<{ state: GameState, engine: GameEngine, onNavigate?: (v: string) => void }> = ({ state, engine, onNavigate }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [showDropsForLoc, setShowDropsForLoc] = useState<string | null>(null);
  const [departingState, setDepartingState] = useState<{ isDeparting: boolean, locId: string | null }>({ isDeparting: false, locId: null });

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

  return (
    <div className="space-y-6 relative">
      {departingState.isDeparting && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/60 backdrop-blur-sm`}>
          <motion.div
            initial={{ y: 200, scale: 0.5, opacity: 0 }}
            animate={{ y: -500, scale: 1.5, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center drop-shadow-2xl"
          >
            {selectedRobot && (
              <div className="relative">
                <RobotVisual robot={selectedRobot} size={120} hideBackground={true} />
                <motion.div 
                  animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-4xl"
                >
                  🔥
                </motion.div>
              </div>
            )}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
  
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>遠征先を選ぶ</h2>
      <p className={theme.typography.body}>場所を指定して素材を集めます。時間経過で帰還します。</p>

      {state.activeQuest && (
        <Card className="bg-red-100 border-2 border-red-400 text-red-900 font-bold mb-6">
          すでに遠征中です。「工房」タブで状況を確認してください。
        </Card>
      )}

      {/* Robot Selection */}
      <div className={`p-4 bg-stone-100 ${theme.radius.md} border border-stone-300`}>
        <h3 className="font-bold mb-1 text-stone-800">連れて行くロボット（任意）</h3>
        <p className="text-xs text-stone-600 mb-3">
          ロボットを連れて行くと素材量が増えたり、素早さ(Agi)に応じて遠征時間が短縮されます。
        </p>
        
        <select 
          className="w-full p-2 border border-stone-300 rounded bg-white font-sans text-sm" 
          value={selectedRobotId || ''} 
          onChange={e => setSelectedRobotId(e.target.value || null)}
        >
          <option value="">ロボットなし (基本素材のみ)</option>
          {state.robots.map((r, idx) => {
            const isAutoDispatched = state.autoDispatches?.some(d => d.robotId === r.id);
            return (
              <option 
                key={`${r.id}-${idx}`} 
                value={r.id}
                disabled={isAutoDispatched}
              >
                {r.name} (Pow: {r.stats.power} Agi: {r.stats.agility}) {isAutoDispatched ? '【自動探索中のため不可】' : ''}
              </option>
            );
          })}
        </select>

        {/* Selected Robot Visual & Stats */}
        {selectedRobot && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-stone-300 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-800">{selectedRobot.name}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  同行設定中
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1.5 text-xs text-stone-600 font-mono">
                <span>HP: {selectedRobot.stats.hp}</span>
                <span>Pow: {selectedRobot.stats.power}</span>
                <span>Def: {selectedRobot.stats.defense}</span>
                <span>Agi: {selectedRobot.stats.agility}</span>
                <span>Dex: {selectedRobot.stats.dexterity}</span>
                <span>Int: {selectedRobot.stats.intelligence}</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-stone-50 p-1 rounded-md border border-stone-200">
              <RobotVisual robot={selectedRobot} size={64} />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map(loc => {
          const isUnlocked = state.unlockedLocations.includes(loc.id);
          const canUnlock = !isUnlocked && state.gold >= loc.unlockCostG;

          // Agilityによる短縮計算
          const baseSec = loc.baseTimeMs / 1000;
          const agiReductionSec = selectedRobot ? Math.min(baseSec * 0.8, selectedRobot.stats.agility) : 0;
          const finalSec = Math.max(3, Math.round(baseSec - agiReductionSec));

          // 気候・天候タグの取得
          const weather = engine.getLocationWeather(loc.id, Date.now());

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
                    <span title={weather.description} className="flex items-center gap-1">
                      {weather.name}
                      <span className={`px-1 rounded text-[9px] ${weather.timeMultiplier > 1 ? 'bg-red-900/80 text-red-200' : 'bg-emerald-900/80 text-emerald-200'}`}>
                        x{weather.timeMultiplier.toFixed(1)}
                      </span>
                    </span>
                    <span className="text-[10px] text-stone-400">{showDropsForLoc === loc.id ? '▲ 閉じる' : '▼ 報酬'}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <p className={`${theme.typography.small} text-stone-200 bg-stone-900/60 px-2 py-0.5 rounded font-medium border border-stone-700/50`}>
                    所要時間: <span className={selectedRobot && agiReductionSec > 0 ? "line-through text-stone-400" : "font-mono font-bold text-white"}>{baseSec}秒</span>
                  </p>
                  {selectedRobot && agiReductionSec > 0 && (
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50 shadow-sm">
                      ➔ {finalSec}秒 (-{Math.round(agiReductionSec)}秒短縮⚡)
                    </span>
                  )}
                </div>

                <p className="mb-4 text-sm text-stone-100 bg-stone-900/50 p-2 rounded border border-stone-700/50 drop-shadow">{loc.description}</p>

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
    </div>
  );
};

