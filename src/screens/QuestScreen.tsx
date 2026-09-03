import * as Gi from "react-icons/gi";
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
import robotsWorkshopBg from '../assets/images/robots_workshop_bg_1788411232885.jpg';

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
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-800/90 backdrop-blur-sm`}>
          <Gi.GiHammerBreak className="absolute top-10 left-10 opacity-5 text-9xl text-amber-900 pointer-events-none z-0" />
          <Gi.GiGears className="absolute bottom-10 right-10 opacity-5 text-9xl text-amber-900 pointer-events-none z-0" />
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
                  <Gi.GiSprint className="inline text-stone-400" />
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
          <Badge className="bg-amber-600 text-white font-bold animate-pulse">遠征中</Badge>
        )}
      </div>
      <p className={theme.typography.body}>場所を指定して素材を集めます。時間経過で帰還します。</p>

      {/* Robot Selection (Compact Light Scouter Style with Workshop Background) */}
      <div 
        ref={topSelectionRef} 
        className={`p-3.5 bg-[#fbf5ed] ${theme.radius.md} border-2 border-amber-300 overflow-hidden relative shadow-xs mb-6`}
      >
        {/* 背景: ロボたちが並ぶ工房イラスト */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={robotsWorkshopBg}
            alt="Workshop with standby robots"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_30%] opacity-40 mix-blend-multiply scale-[1.02]"
          />
          {/* 明度と可読性を保つグラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf3]/85 via-[#fff7ec]/70 to-[#fcf3e6]/85" />
          {/* 優しい工房の温かみトーン */}
          <div className="absolute inset-0 bg-amber-900/5 mix-blend-overlay" />
        </div>

        <div className="flex justify-between items-center gap-2 mb-2 relative z-10">
          <div className="min-w-0">
            <h3 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs sm:text-sm truncate">
              <span className="text-amber-600 shrink-0">▶</span> 同行ロボ選択
              <span className="text-[10px] bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300/80 shadow-2xs">
                ↔ 横スライドで切替
              </span>
            </h3>
            <p className="text-[11px] text-stone-600 mt-0.5 truncate">
              同行ユニットを選択（左右に横スライド・スクロールして選択）。敏捷性が高いほど時間短縮。
            </p>
          </div>
          {selectedRobot && (
            <button
              type="button"
              onClick={() => setShowRadarChart(!showRadarChart)}
              className={`text-xs px-2.5 py-1 rounded border transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 font-bold shadow-2xs ${
                showRadarChart 
                  ? 'bg-amber-600 border-amber-700 text-white shadow-xs' 
                  : 'bg-white/90 backdrop-blur-xs border-stone-300 text-stone-700 hover:bg-white'
              }`}
            >
              <span><Gi.GiChart className="inline text-stone-500" /></span>
              <span>{showRadarChart ? 'レーダー閉' : 'レーダー'}</span>
            </button>
          )}
        </div>

        {/* 横スライド案内バー */}
        <div className="flex items-center justify-between text-[10px] text-stone-600 font-bold px-1.5 mb-1.5 bg-amber-100/70 backdrop-blur-xs py-0.5 rounded border border-amber-300/60 relative z-10 shadow-2xs">
          <span>◀ スライド</span>
          <span className="text-amber-900 font-extrabold flex items-center gap-1">
            <Gi.GiRobotAntennas size={13} className="text-amber-700" />
            <span>待機ロボ 全 {state.robots.length} 体</span>
          </span>
          <span>スライド ▶</span>
        </div>
        
        <div className="flex overflow-x-auto gap-2.5 pb-2 pt-1 snap-x scroll-smooth relative z-10 px-0.5">
          {/* ロボットなし */}
          <button 
            onClick={() => setSelectedRobotId(null)}
            className={`snap-start shrink-0 w-20 sm:w-24 h-26 sm:h-28 rounded-lg flex flex-col items-center justify-center transition-all relative border-2 cursor-pointer backdrop-blur-xs ${
              selectedRobotId === null 
                ? 'bg-amber-100/95 border-amber-500 ring-2 ring-amber-300 shadow-sm scale-102' 
                : 'bg-white/85 border-amber-200/80 hover:border-amber-400 hover:bg-white opacity-85 hover:opacity-100 shadow-2xs'
            }`}
          >
            <span className="text-2xl mb-1 flex items-center justify-center">
              <Gi.GiWalk size={26} className={selectedRobotId === null ? "text-amber-800" : "text-stone-600"} />
            </span>
            <span className={`font-bold text-[10px] truncate max-w-full px-1 ${selectedRobotId === null ? 'text-amber-900 font-black' : 'text-stone-600'}`}>同行なし</span>
            <span className={`text-[8px] mt-0.5 px-1 text-center leading-tight ${selectedRobotId === null ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>基本素材のみ</span>
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
                className={`snap-start shrink-0 w-22 sm:w-26 h-26 sm:h-28 rounded-lg flex flex-col items-center justify-center transition-all relative border-2 cursor-pointer backdrop-blur-xs ${
                  isSelected 
                    ? 'bg-amber-100/95 border-amber-500 ring-2 ring-amber-300 shadow-sm scale-102 z-10' 
                    : isAutoDispatched 
                    ? 'bg-stone-100/80 border-stone-200 opacity-40 cursor-not-allowed grayscale' 
                    : 'bg-white/85 border-amber-200/80 hover:border-amber-400 hover:bg-white hover:shadow-xs shadow-2xs'
                }`}
              >
                {isAutoDispatched && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-stone-100/90 backdrop-blur-[1px] rounded-lg">
                    <span className="bg-rose-100 text-rose-700 border border-rose-300 text-[8px] px-1.5 py-0.2 font-bold rounded">探索中</span>
                  </div>
                )}

                <div className="h-10 flex items-center justify-center relative z-10 my-0.5">
                  <RobotVisual robot={r} size={36} />
                </div>
                
                <div className="w-full px-1 text-center relative z-10">
                  <div className={`font-bold text-[10px] truncate ${isSelected ? 'text-amber-950' : 'text-stone-800'}`}>
                    {r.name}
                  </div>
                  <div className={`flex justify-center gap-1 mt-0.5 text-[8px] font-mono ${isSelected ? 'text-amber-800 font-bold' : 'text-stone-500'}`}>
                    <span>P:{r.stats.power}</span>
                    <span>A:{r.stats.agility}</span>
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
              className="overflow-hidden border-t border-amber-200 pt-3 mt-2 relative z-10"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                <div className="shrink-0 flex flex-col items-center">
                  <span className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1">
                    <span><Gi.GiRadarDish className="inline text-stone-500" /></span> {selectedRobot.name} の性能解析
                  </span>
                  <RobotRadarChart robot={selectedRobot} size={160} themeStyle="light" />
                </div>
                <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-mono">
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-rose-600 font-bold block">❤️ 耐久 (HP)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.hp}</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-amber-600 font-bold block"><Gi.GiBroadsword className="inline text-red-500" />️ 攻撃 (POW)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.power}</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-blue-600 font-bold block"><Gi.GiShield className="inline text-blue-500" />️ 防御 (DEF)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.defense}</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-yellow-600 font-bold block"><Gi.GiLightningTrio className="inline text-yellow-500" /> 速度 (AGI)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.agility}</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-emerald-600 font-bold block"><Gi.GiBullseye className="inline text-green-500" /> 探索 (DEX)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.dexterity}</span>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 p-1.5 rounded">
                    <span className="text-purple-600 font-bold block"><Gi.GiCrystalBall className="inline text-purple-500" /> 解析 (INT)</span>
                    <span className="text-sm font-bold text-stone-800">{selectedRobot.stats.intelligence}</span>
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
                  <p className={`${theme.typography.small} text-stone-200 bg-stone-800/80 px-2 py-0.5 rounded font-medium border border-stone-700/50`}>
                    所要時間: <span className={selectedRobot && agiReductionSec > 0 ? "line-through text-stone-400" : "font-mono font-bold text-white"}>{baseFinalSec}秒</span>
                  </p>
                  {selectedRobot && agiReductionSec > 0 && (
                    <span className="text-xs font-mono font-bold text-blue-300 bg-blue-900/60 px-2 py-0.5 rounded border border-blue-700/50 shadow-sm">
                      ➔ {finalSec}秒<Gi.GiLightningTrio className="inline text-yellow-500" />
                    </span>
                  )}
                </div>

                <p className="mb-2 text-sm text-stone-100 bg-stone-900/50 p-2 rounded border border-stone-700/50 drop-shadow">{loc.description}</p>
                
                {/* 天候情報の表示 */}
                <div className={`mb-4 flex items-center gap-3 text-sm p-2 rounded border drop-shadow ${weather.timeMultiplier > 1 ? 'bg-red-900/50 border-red-700/50 text-red-50' : 'bg-stone-700/50 border-stone-400/50 text-emerald-50'}`}>
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded bg-stone-800/80 shadow-inner">
                    <span className="text-xl">{weather.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <div className="font-bold text-[13px]">{weather.name}</div>
                    <div className="text-[11px] opacity-90">{weather.description}</div>
                  </div>
                  <div className="ml-auto font-mono font-bold text-lg bg-stone-800/80 px-2 py-1 rounded border border-stone-700/50 whitespace-nowrap">
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
                      <div className="p-2.5 bg-stone-100 border border-stone-300 rounded-lg shadow-inner">
                        <div className="text-[10px] text-stone-600 mb-1.5 font-bold">獲得可能な素材一覧</div>
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
                    className="w-full shadow-md bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 text-sm border border-amber-500 transition-colors" 
                    disabled={!!state.activeQuest}
                    onClick={() => handleStartQuest(loc.id)}
                  >
                    ここへ遠征する
                  </Button>
                ) : (
                  <div className="flex items-center justify-between bg-stone-100 p-2.5 rounded-lg border border-amber-400 shadow-inner">
                    <span className="font-bold text-amber-900">解放費用: {loc.unlockCostG} G</span>
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
            <div className="bg-white/95 border-2 border-amber-500 rounded-xl p-2.5 shadow-xl backdrop-blur-md text-stone-800 flex flex-col gap-2">
              {/* メインHUD行 */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* 機体切り替え ◀ ボタン */}
                  {selectableRobotIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleCycleRobot('prev')}
                      className="w-6 h-6 shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer"
                      title="前のロボットへ"
                    >
                      ◀
                    </button>
                  )}

                  {selectedRobot ? (
                    <div className="shrink-0 bg-stone-50 border border-amber-300 p-0.5 rounded-lg flex items-center justify-center">
                      <RobotVisual robot={selectedRobot} size={32} />
                    </div>
                  ) : (
                    <div className="shrink-0 w-8 h-8 bg-stone-100 border border-stone-300 rounded-lg flex items-center justify-center text-sm text-stone-700">
                      <Gi.GiWalk size={20} className="text-stone-700" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-amber-900 bg-amber-100 px-1 rounded border border-amber-300 whitespace-nowrap">
                        選択中
                      </span>
                      <span className="text-xs font-bold text-stone-900 truncate max-w-[90px] sm:max-w-[120px]">
                        {selectedRobot ? selectedRobot.name : '同行なし'}
                      </span>
                    </div>
                    {selectedRobot ? (
                      <div className="text-[10px] font-mono text-amber-800 flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                        <span><Gi.GiLightningTrio className="inline text-yellow-500" /> -{selectedRobot.stats.agility}s</span>
                        <span>❤️ {selectedRobot.currentHp}/{selectedRobot.stats.hp}</span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-stone-500 mt-0.5 truncate">
                        基本枠で遠征
                      </div>
                    )}
                  </div>

                  {/* 機体切り替え ▶ ボタン */}
                  {selectableRobotIds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleCycleRobot('next')}
                      className="w-6 h-6 shrink-0 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer"
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
                      className={`text-[11px] font-bold px-1.5 py-1 rounded border transition-all flex items-center gap-0.5 cursor-pointer whitespace-nowrap ${
                        showHudRadar
                          ? 'bg-amber-600 border-amber-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
                      }`}
                      title="性能レーダーチャートを表示"
                    >
                      <span><Gi.GiChart className="inline text-stone-500" /></span>
                      <span className="text-[10px]">{showHudRadar ? '閉' : ''}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={scrollToRobotSelection}
                    className="text-[11px] font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300 px-1.5 py-1 rounded transition-colors flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
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
                    className="overflow-hidden border-t border-stone-200 pt-2"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200">
                      <RobotRadarChart robot={selectedRobot} size={140} themeStyle="light" />
                      <div className="w-full grid grid-cols-3 gap-1 text-[9px] font-mono">
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-rose-600 font-bold block">❤️ HP {selectedRobot.stats.hp}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-amber-600 font-bold block"><Gi.GiBroadsword className="inline text-red-500" />️ POW {selectedRobot.stats.power}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-blue-600 font-bold block"><Gi.GiShield className="inline text-blue-500" />️ DEF {selectedRobot.stats.defense}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-yellow-600 font-bold block"><Gi.GiLightningTrio className="inline text-yellow-500" /> AGI {selectedRobot.stats.agility}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-emerald-600 font-bold block"><Gi.GiBullseye className="inline text-green-500" /> DEX {selectedRobot.stats.dexterity}</span>
                        </div>
                        <div className="bg-white p-1 rounded border border-stone-200 text-center">
                          <span className="text-purple-600 font-bold block"><Gi.GiCrystalBall className="inline text-purple-500" /> INT {selectedRobot.stats.intelligence}</span>
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


