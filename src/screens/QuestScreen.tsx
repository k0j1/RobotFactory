import * as Gi from "react-icons/gi";
import React, { useState, useRef, useEffect } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { GSAPRobotCanvas } from '../components/robot/GSAPRobotCanvas';
import { LOCATIONS, MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { LocationEnvironment } from '../components/robot/LocationEnvironment';
import { theme } from '../styles/theme';
import { TutorialPopup } from '../components/ui/TutorialPopup';
import { motion, AnimatePresence } from 'motion/react';
import { RobotRadarChart } from '../components/robot/RobotRadarChart';
import confetti from 'canvas-confetti';
import { ScreenHeader } from '../components/ui/ScreenHeader';

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h${m}m`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const QuestScreen: React.FC<{ state: GameState, engine: GameEngine, onNavigate?: (v: string) => void }> = ({ state, engine, onNavigate }) => {
  const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);
  const [showDropsForLoc, setShowDropsForLoc] = useState<string | null>(null);
  const [showRadarChart, setShowRadarChart] = useState<boolean>(false);
  const [showHudRadar, setShowHudRadar] = useState<boolean>(false);
  const [isScrolledPastTop, setIsScrolledPastTop] = useState<boolean>(false);
  const [departingState, setDepartingState] = useState<{ isDeparting: boolean, locId: string | null }>({ isDeparting: false, locId: null });
  const [lootResult, setLootResult] = useState<{ title: string; subtitle?: string; drops: string[] } | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [now, setNow] = useState<number>(Date.now());
  const topSelectionRef = useRef<HTMLDivElement>(null);

  // リアルタイム秒針タイマー
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => clearInterval(timer);
  }, []);

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

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
      zIndex: 9999,
      disableForReducedMotion: true
    });

    let burstCount = 0;
    const maxBursts = 8;
    
    const interval = setInterval(() => {
      burstCount++;
      if (burstCount >= maxBursts) {
        clearInterval(interval);
        return;
      }
      
      confetti({
        particleCount: 10,
        spread: 60,
        startVelocity: 25,
        origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() * 0.2 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
        zIndex: 9999,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 10,
        spread: 60,
        startVelocity: 25,
        origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() * 0.2 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
        zIndex: 9999,
        disableForReducedMotion: true
      });
    }, 250);
  };

  const handleCompleteQuest = () => {
    const result = engine.completeQuest();
    if (result && result.drops) {
      setLootResult({
        title: '遠征成功！',
        subtitle: `${questRobot ? questRobot.name : '探索員'} が無事に素材を持ち帰りました！`,
        drops: result.drops
      });
      triggerConfetti();
    }
  };

  const handleCloseModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setLootResult(null);
    }, 2000);
  };

  const handleStartQuest = (locId: string) => {
    // 進行中のクエストがあるかチェック（二重送信防止）
    if (state.activeQuest) return;
    
    try {
      if (!selectedRobotId) {
        // ロボットが選択されていない場合は即時出発
        engine.startQuest(locId, undefined);
        return;
      }

      setDepartingState({ isDeparting: true, locId });
      
      setTimeout(() => {
        try {
          engine.startQuest(locId, selectedRobotId);
          setDepartingState({ isDeparting: false, locId: null });
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

  const activeQuest = state.activeQuest;
  const activeQuestLoc = activeQuest ? LOCATIONS.find(l => l.id === activeQuest.locationId) : null;
  const questRobot = activeQuest?.dispatchedRobotId 
    ? state.robots.find(r => r.id === activeQuest.dispatchedRobotId) 
    : null;
  const timeRemaining = activeQuest ? Math.max(0, activeQuest.endTime - now) : 0;
  const questDone = Boolean(activeQuest && timeRemaining <= 0);
  const totalQuestDuration = activeQuest ? Math.max(1, activeQuest.endTime - activeQuest.startTime) : 1;
  const elapsedQuestTime = activeQuest ? Math.max(0, now - activeQuest.startTime) : 0;
  const questProgressPercent = activeQuest 
    ? Math.min(100, Math.max(0, Math.round((elapsedQuestTime / totalQuestDuration) * 100))) 
    : 0;
  const questWeather = activeQuestLoc ? engine.getLocationWeather(activeQuestLoc.id, now) : null;

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
        description={"ここではロボットを連れて行って素材を集めることができます。\n・好きな場所を選んで「ここへ遠征する」を押すと、一定時間後に素材を持ち帰ります。\n・遠征が完了すると、この画面の上部や該当エリアから直接「素材を受け取る」ことができます！\n・ロボットを連れて行くとアイテムドロップ枠が増え、さらに素早さ(Agi)に応じて遠征時間が短縮されます！"} 
      />

      {/* 工房画面タイトルと完全統一されたScreenHeader */}
      <ScreenHeader
        icon={<Gi.GiCompass size={16} />}
        title="素材探索・遠征"
        badge={
          questDone ? (
            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full animate-bounce shadow-2xs">
              ★ 遠征完了・受取可能！
            </span>
          ) : activeQuest ? (
            <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse shadow-2xs">
              遠征中 ({formatTime(timeRemaining)})
            </span>
          ) : (
            <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-full shadow-2xs font-mono">
              待機中
            </span>
          )
        }
      />

      {/* ========================================================================= */}
      {/* 遠征中・完了ステータスカード（工房風・明るいデザイン） */}
      {/* ========================================================================= */}
      {activeQuest && activeQuestLoc && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 shadow-md relative overflow-hidden transition-all ${
            questDone 
              ? 'bg-gradient-to-br from-[#f2fdf6] via-[#fbfefc] to-[#e6fbf1] border-emerald-500 ring-2 ring-emerald-200 text-stone-800' 
              : 'bg-gradient-to-br from-[#fdfaf5] via-[#faf5ee] to-[#f4ebe0] border-[#cfae8e] text-stone-800'
          }`}
        >
          {/* 四隅の真鍮リベット */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#e6cfb8] border border-[#a8825c] shadow-2xs pointer-events-none" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#e6cfb8] border border-[#a8825c] shadow-2xs pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#e6cfb8] border border-[#a8825c] shadow-2xs pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#e6cfb8] border border-[#a8825c] shadow-2xs pointer-events-none" />

          {/* 背景の環境アニメーション（薄く表示） */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <LocationEnvironment locationId={activeQuest.locationId} animateScroll={!questDone} speedMultiplier={0.15} />
          </div>
          <div className="absolute inset-0 z-0 pointer-events-none bg-white/40 backdrop-blur-[0.5px]" />

          <div className="relative z-10">
            {questDone ? (
              /* ========================================================================= */
              /* 遠征結果表示ダッシュボード: 遠征場所・ロボット・素材を回収ボタンのみのシンプル設計 */
              /* ========================================================================= */
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap py-1">
                {/* ロボットと遠征場所 */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* ロボット表示（バンザイ大歓喜アニメーション） */}
                  {questRobot ? (
                    <div className="w-14 h-14 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center justify-center p-1 shrink-0 shadow-sm overflow-visible">
                      <GSAPRobotCanvas
                        robot={questRobot}
                        size={52}
                        patternId="banzai_cheer"
                        loop={true}
                        speed={1.0}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-stone-100 rounded-xl border border-stone-300 flex items-center justify-center shrink-0 text-stone-500 shadow-sm">
                      <Gi.GiWalk size={28} />
                    </div>
                  )}

                  {/* 遠征場所とロボット名 */}
                  <div className="min-w-0">
                    <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mb-0.5">
                      <Gi.GiCompass className="text-emerald-600" size={13} />
                      <span>遠征場所</span>
                    </div>
                    <h3 className="font-black text-base sm:text-lg text-stone-900 truncate">
                      {activeQuestLoc.name}
                    </h3>
                    {questRobot && (
                      <p className="text-xs text-stone-600 font-medium truncate mt-0.5">
                        {questRobot.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* 素材を回収ボタン */}
                <div className="ml-auto shrink-0">
                  <button
                    onClick={handleCompleteQuest}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black px-5 py-3 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg border-2 border-emerald-300 animate-bounce flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Gi.GiPartyPopper size={20} className="text-amber-200 shrink-0" />
                    <span className="whitespace-nowrap font-bold">素材を回収</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* 遠征中の進行状況ダッシュボード（残り時間・進行バー・詳細情報） */
              /* ========================================================================= */
              <>
                {/* 上部ヘッダー */}
                <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm border bg-amber-100 text-amber-900 border-amber-300">
                      <Gi.GiWalkingScout size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold shadow-2xs bg-amber-600 text-white">
                          遠征中
                        </span>
                        <h3 className="font-black text-sm sm:text-base text-stone-900">
                          {activeQuestLoc.name} へ遠征中
                        </h3>
                        {questWeather && (
                          <span className="text-[10px] bg-white/90 text-stone-700 border border-stone-300 px-1.5 py-0.2 rounded font-medium shadow-2xs">
                            {questWeather.name}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        現在素材を探索中です。時間経過で帰還します。
                      </p>
                    </div>
                  </div>

                  {/* 右側：残り時間 */}
                  <div className="flex items-center gap-2 ml-auto sm:ml-0">
                    <div className="flex items-center gap-2 bg-white/90 border border-amber-300 px-3 py-1.5 rounded-xl shadow-xs">
                      <Gi.GiHourglass size={18} className="text-amber-600 animate-spin" />
                      <div className="text-right">
                        <div className="text-[9px] text-stone-500 font-bold leading-none">残り時間</div>
                        <div className="text-sm sm:text-base font-black font-mono text-amber-800 leading-tight">
                          {formatTime(timeRemaining)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ロボット同行状況 & リアルタイム進行度バー */}
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#dfcfbd] flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {questRobot ? (
                      <div className="w-12 h-12 bg-amber-50/80 rounded-lg border border-amber-200 flex items-center justify-center p-0.5 shrink-0 shadow-2xs overflow-visible">
                        <RobotVisual
                          robot={questRobot}
                          size={40}
                          emotion="auto"
                          animateExploration={true}
                          hideBackground={true}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-stone-100 rounded-lg border border-stone-300 flex items-center justify-center shrink-0 text-stone-500 shadow-2xs">
                        <Gi.GiWalk size={26} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-stone-900 truncate">
                          {questRobot ? questRobot.name : '同行なし（基本部隊）'}
                        </span>
                        {questRobot && (
                          <span className="text-[9px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded font-bold">
                            敏捷短縮: -{questRobot.stats.agility}s
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-600 mt-0.5 truncate">
                        {questRobot 
                          ? `パワー: ${questRobot.stats.power} (ドロップ追加) / HP: ${questRobot.currentHp ?? questRobot.stats.hp}/${questRobot.maxHp ?? questRobot.stats.hp}` 
                          : '基本ドロップ枠で素材を収集'}
                      </div>
                    </div>
                  </div>

                  {/* 進行度バー */}
                  <div className="w-full sm:w-56 shrink-0 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-stone-700">
                      <span className="flex items-center gap-1">
                        <Gi.GiGears size={12} className="text-amber-700 animate-spin" />
                        <span className="font-bold">進捗度</span>
                      </span>
                      <span className="text-amber-800 font-bold">
                        {questProgressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden border border-stone-300 p-0.5">
                      <div
                        className="h-full transition-all duration-300 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                        style={{ width: `${questProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
  
      {/* 遠征先を選ぶ ヘッダー */}
      <div className="flex items-center justify-between border-b border-stone-300 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-800">遠征先を選ぶ</h2>
          <span className="text-xs text-stone-500 font-medium">場所を指定して素材を集めます</span>
        </div>
        {state.activeQuest && (
          <Badge className={`${questDone ? 'bg-emerald-600 animate-bounce' : 'bg-amber-600 animate-pulse'} text-white font-bold`}>
            {questDone ? '遠征完了・受取可' : '遠征中'}
          </Badge>
        )}
      </div>

      {/* Robot Selection: 遠征中は同行ロボ選択画面は表示しない */}
      {!activeQuest && (
        <div 
          ref={topSelectionRef} 
          className={`p-3.5 bg-[#fcf8f2] backdrop-blur-xs ${theme.radius.md} border-2 border-[#d6c4b2] overflow-hidden relative shadow-xs mb-4`}
        >
        <div className="flex justify-between items-center gap-2 mb-2">
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
            const isQuestDispatched = state.activeQuest?.dispatchedRobotId === r.id;
            const isSelected = selectedRobotId === r.id;
            const isDisabled = isAutoDispatched || isQuestDispatched;
            
            return (
              <button 
                key={r.id}
                onClick={() => !isDisabled && setSelectedRobotId(r.id)}
                disabled={isDisabled}
                className={`snap-start shrink-0 w-22 sm:w-26 h-26 sm:h-28 rounded-lg flex flex-col items-center justify-center transition-all relative border-2 cursor-pointer backdrop-blur-xs ${
                  isSelected 
                    ? 'bg-amber-100/95 border-amber-500 ring-2 ring-amber-300 shadow-sm scale-102 z-10' 
                    : isDisabled 
                    ? 'bg-stone-100/80 border-stone-200 opacity-40 cursor-not-allowed grayscale' 
                    : 'bg-white/85 border-amber-200/80 hover:border-amber-400 hover:bg-white hover:shadow-xs shadow-2xs'
                }`}
              >
                {isAutoDispatched && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-stone-100/90 backdrop-blur-[1px] rounded-lg">
                    <span className="bg-purple-100 text-purple-700 border border-purple-300 text-[8px] px-1.5 py-0.2 font-bold rounded">自動探索中</span>
                  </div>
                )}
                {isQuestDispatched && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-stone-100/90 backdrop-blur-[1px] rounded-lg">
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[8px] px-1.5 py-0.2 font-bold rounded">遠征中</span>
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LOCATIONS.map(loc => {
          const isUnlocked = state.unlockedLocations.includes(loc.id);
          const canUnlock = !isUnlocked && state.gold >= loc.unlockCostG;
          const isCurrentQuestLoc = state.activeQuest?.locationId === loc.id;

          // Agilityによる短縮計算
          const baseSec = loc.baseTimeMs / 1000;
          // 気候・天候タグの取得
          const weather = engine.getLocationWeather(loc.id, now);
          
          const agiReductionSec = selectedRobot ? Math.min(baseSec * 0.8, selectedRobot.stats.agility) : 0;
          // ベースの時間に敏捷性短縮を反映したあと、天候のペナルティ倍率をかける
          const finalSec = Math.floor(Math.max(3, baseSec - agiReductionSec) * weather.timeMultiplier);
          const baseFinalSec = Math.floor(baseSec * weather.timeMultiplier);

          return (
            <Card key={loc.id} className={`relative overflow-hidden ${!isUnlocked ? 'opacity-75' : ''} ${isCurrentQuestLoc ? 'ring-2 ring-amber-400' : ''}`}>
              {/* 自動探索時の背景を背面に表示 */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <LocationEnvironment locationId={loc.id} animateScroll={true} speedMultiplier={0.2} />
              </div>
              {/* 薄い暗幕をかけて文字を読みやすくする */}
              <div className="absolute inset-0 z-0 pointer-events-none bg-stone-900/40 backdrop-blur-[2px]"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{loc.name}</h3>
                    {isCurrentQuestLoc && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                        questDone ? 'bg-emerald-400 text-emerald-950 animate-bounce' : 'bg-amber-400 text-amber-950 animate-pulse'
                      }`}>
                        {questDone ? '受取可能' : '遠征中'}
                      </span>
                    )}
                  </div>
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
                  isCurrentQuestLoc ? (
                    questDone ? (
                      <Button 
                        className="w-full shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-sm border-2 border-emerald-400 transition-colors animate-bounce flex items-center justify-center gap-1.5 cursor-pointer" 
                        onClick={handleCompleteQuest}
                      >
                        <Gi.GiPartyPopper size={18} />
                        <span>素材を回収</span>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full shadow-md bg-stone-700/90 text-amber-300 font-bold py-2.5 text-sm border border-stone-600 cursor-not-allowed opacity-95 flex items-center justify-center gap-1.5" 
                        disabled={true}
                      >
                        <Gi.GiHourglass className="animate-spin" size={16} />
                        <span>ここへ遠征中... ({formatTime(timeRemaining)})</span>
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full shadow-md bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 text-sm border border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={!!state.activeQuest}
                      onClick={() => handleStartQuest(loc.id)}
                    >
                      {state.activeQuest ? '他の場所へ遠征中' : 'ここへ遠征する'}
                    </Button>
                  )
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

      {/* スクロール閲覧時：画面上部右側に固定表示される選択中ロボットHUD（遠征中は非表示） */}
      <AnimatePresence>
        {isScrolledPastTop && !activeQuest && (
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

      {/* ========================================================================= */}
      {/* 遠征獲得素材 結果モーダル (工房風・明るいデザイン) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lootResult && !isAnimating && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-stone-900/40 ${theme.zIndex.modalOverlay} flex items-center justify-center p-4 backdrop-blur-xs`}
          >
            <motion.div
              initial={{ scale: 0.85, y: 25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 220 }}
              className="w-full max-w-md"
            >
              {/* 工房風木製掲示板・真鍮アクセントの明るいダイアログ */}
              <div className="w-full bg-[#fdfaf5] border-3 border-[#cfae8e] rounded-2xl shadow-2xl p-4 sm:p-5 text-stone-800 overflow-hidden relative">
                
                {/* 四隅の真鍮リベット金具 */}
                <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-45" />
                </div>
                <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-0.5 bg-[#7a5530] -rotate-12" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-12" />
                </div>
                <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-gradient-to-br from-[#edd5bc] to-[#cfae8e] border border-[#a8825c] shadow-xs flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-0.5 bg-[#7a5530] rotate-75" />
                </div>

                {/* 上部真鍮銘板プレート */}
                <div className="flex justify-center mb-2">
                  <div className="px-3 py-0.5 rounded bg-gradient-to-r from-[#eedcc8] to-[#e4ceb6] border border-[#c5a786] text-[#5e3814] font-bold text-[10px] sm:text-xs tracking-wider shadow-2xs font-mono flex items-center gap-1.5">
                    <span className="text-amber-700 font-black">⚙</span>
                    <span>EXPEDITION REPORT // 遠征素材受取</span>
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <motion.h2 
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl sm:text-2xl font-black text-amber-950 flex items-center justify-center gap-2 mb-1"
                  >
                    <Gi.GiPartyPopper className="text-amber-600" />
                    <span>{lootResult.title}</span>
                  </motion.h2>
                  
                  {lootResult.subtitle && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="font-bold text-xs text-stone-600 mb-2"
                    >
                      {lootResult.subtitle}
                    </motion.p>
                  )}

                  {/* 素材獲得を大歓喜するロボット演出（モーションスタジオのバンザイ大歓喜） */}
                  <div className="flex justify-center items-center my-1.5 h-24 overflow-visible">
                    <GSAPRobotCanvas
                      robot={questRobot || state.robots[0]}
                      size={80}
                      patternId="banzai_cheer"
                      loop={true}
                      speed={1.0}
                    />
                  </div>

                  {/* 工房木製トレイ風・獲得素材一覧コンテナ */}
                  <div className="my-3 bg-[#f5ebd8] border border-[#dfcfbd] rounded-xl p-3 shadow-inner max-h-56 overflow-y-auto">
                    <div className="text-[10px] font-mono font-bold text-[#8b6540] mb-2 flex items-center justify-center gap-1">
                      <Gi.GiCardboardBox size={13} />
                      <span>獲得した素材一覧</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {lootResult.drops.map((dropId, i) => {
                        const mat = MATERIALS.find(m => m.id === dropId);
                        const rarityStyle = mat ? theme.rarity[mat.rarity] : theme.rarity[1];
                        return (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.35 + (i * 0.04), type: "spring", stiffness: 300 }}
                          >
                            <Badge className={`${rarityStyle.bg} ${rarityStyle.text} border-2 ${rarityStyle.border} ${rarityStyle.ring} p-2 text-xs sm:text-sm flex items-center gap-1.5 shadow-xs`}>
                              <MaterialIcon materialId={mat?.id || ''} />
                              <span className="font-bold">{mat?.name}</span>
                              <span className={`text-[10px] font-bold ${rarityStyle.starColor}`}>
                                {rarityStyle.stars}
                              </span>
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={handleCloseModal}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-black text-sm sm:text-base text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 border-2 border-amber-400 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Gi.GiCardboardBox size={20} className="text-amber-200" />
                      <span>アイテムを倉庫へ格納する</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 倉庫格納パーティクルアニメーション */}
      <AnimatePresence>
        {isAnimating && lootResult && (
          <div className={`fixed inset-0 pointer-events-none ${theme.zIndex.confetti} overflow-hidden`}>
            {lootResult.drops.map((dropId, i) => {
              const mat = MATERIALS.find(m => m.id === dropId);
              const angle = Math.random() * Math.PI * 2;
              const radius = Math.random() * 80 + 20;
              const initialX = Math.cos(angle) * radius;
              const initialY = Math.sin(angle) * radius - 50;
              
              const targetX = window.innerWidth / 2 + Math.min(window.innerWidth / 2, 448) * 0.8;
              const targetY = window.innerHeight - 30;

              return (
                <motion.div
                  key={i}
                  initial={{ x: window.innerWidth / 2 + initialX, y: window.innerHeight / 2 + initialY, scale: 0, opacity: 0 }}
                  animate={{ 
                    x: [window.innerWidth / 2 + initialX, window.innerWidth / 2 + initialX + (Math.random() * 100 - 50), targetX], 
                    y: [window.innerHeight / 2 + initialY, window.innerHeight / 2 + initialY - (Math.random() * 100 + 50), targetY],
                    scale: [0, 1.2, 0.5],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.2 + Math.random() * 0.5, 
                    delay: i * 0.03,
                    ease: "easeInOut",
                    times: [0, 0.4, 1]
                  }}
                  className="absolute shadow-lg bg-amber-100 rounded-full p-2 border-2 border-amber-400 flex items-center justify-center"
                  style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
                >
                  <MaterialIcon materialId={mat?.id || ''} size={20} />
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};



