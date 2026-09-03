import React, { useState } from 'react';
import * as Gi from 'react-icons/gi';
import { GameState, Robot } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { LOCATIONS, MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { RobotRadarChart } from '../components/robot/RobotRadarChart';
import { RepairAnimationModal } from '../components/effects/RepairAnimationModal';
import { GarageAmbience } from '../components/effects/GarageAmbience';

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h${m}m`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const Dashboard: React.FC<{ state: GameState, engine: GameEngine, onNavigate: (v: string) => void }> = ({ state, engine, onNavigate }) => {
  const [lootResult, setLootResult] = useState<{ title: string; subtitle?: string; drops: string[]; type: 'quest' | 'auto_dispatch' } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
  const [previewEmotions, setPreviewEmotions] = useState<{ [dispatchId: string]: 'auto' | 'happy' | 'troubled' | 'searching' }>({});
  const [repairingRobotState, setRepairingRobotState] = useState<{ robot: Robot; initialHp: number } | null>(null);

  const handleRepairRobot = (robot: Robot) => {
    try {
      const initialHp = robot.currentHp ?? 0;
      engine.useRepairKit(robot.id);
      setRepairingRobotState({ robot, initialHp });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const triggerConfetti = () => {
    // 初回の華やかなバースト
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
    if (result) {
      setLootResult({
        title: '遠征成功！',
        subtitle: '素材を獲得しました！',
        drops: result.drops,
        type: 'quest'
      });
      triggerConfetti();
    }
  };

  const handleClaimAutoDispatch = (dispatchId: string) => {
    try {
      const res = engine.claimAutoDispatch(dispatchId);
      if (res && res.drops.length > 0) {
        setLootResult({
          title: '素材回収！',
          subtitle: `${res.robotName} が ${res.locationName} で見つけた素材を獲得しました！`,
          drops: res.drops,
          type: 'auto_dispatch'
        });
        triggerConfetti();
      }
    } catch (e: any) {
      alert(e.message || '素材の回収に失敗しました');
    }
  };

  const handleClaimAllAutoDispatches = () => {
    try {
      const res = engine.claimAllAutoDispatches();
      if (res && res.drops.length > 0) {
        setLootResult({
          title: '一括回収完了！',
          subtitle: '探索素材を一括回収しました！',
          drops: res.drops,
          type: 'auto_dispatch'
        });
        triggerConfetti();
      }
    } catch (e: any) {
      alert(e.message || '素材の回収に失敗しました');
    }
  };

  const handleCancelAutoDispatch = (dispatchId: string) => {
    try {
      const res = engine.cancelAutoDispatch(dispatchId);
      if (res && res.drops.length > 0) {
        setLootResult({
          title: '帰還・素材回収！',
          subtitle: `${res.robotName} が帰還し、探索素材を獲得しました！`,
          drops: res.drops,
          type: 'auto_dispatch'
        });
        triggerConfetti();
      }
    } catch (e: any) {
      alert(e.message || '帰還に失敗しました');
    }
  };

  const handleCloseModal = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setLootResult(null);
    }, 2000);
  };

  const activeQuestLoc = state.activeQuest ? LOCATIONS.find(l => l.id === state.activeQuest?.locationId) : null;
  const questRobot = state.activeQuest?.dispatchedRobotId 
    ? state.robots.find(r => r.id === state.activeQuest?.dispatchedRobotId) 
    : null;
  const timeRemaining = state.activeQuest ? state.activeQuest.endTime - Date.now() : 0;
  const questDone = timeRemaining <= 0;
  const selectedModalRobot = state.robots.find(r => r.id === selectedRobotId);

  const totalAutoPendingDrops = state.autoDispatches?.reduce((acc, d) => acc + (d.pendingDrops?.length || 0), 0) || 0;
  const hasActiveMission = Boolean(state.activeQuest || (state.autoDispatches && state.autoDispatches.length > 0));

  return (
    <div className="space-y-4">
      {/* 統合ダッシュボードカード (Unified Workshop Dashboard - Warm Brick & Wood Theme) */}
      <Card className={theme.workshop.mainCard + " p-3.5"}>
        {/* 工房アンビエンス背景（木製梁・赤レンガ壁・石窯の薪火・アーチ棚スケッチ） */}
        <GarageAmbience />
        <div className="relative z-10">
        {/* 上部ステータスバー (工房の木製・真鍮プレート銘板デザイン & アイコン中央配置) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
          {/* GOLD */}
          <div className={theme.workshop.statCard}>
            <div className={`${theme.workshop.statIconBox} bg-amber-100/90 border-amber-300/80 text-amber-700`}>
              <Gi.GiCoins size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-amber-900/80 tracking-wider leading-none mb-1">所持金</div>
              <div className="text-sm font-black text-amber-700 font-mono truncate leading-none">
                {state.gold} <span className="text-[10px] font-bold font-sans text-amber-600/90">G</span>
              </div>
            </div>
          </div>

          {/* ROBOTS */}
          <div className={theme.workshop.statCard}>
            <div className={`${theme.workshop.statIconBox} bg-sky-100/90 border-sky-300/80 text-sky-700`}>
              <Gi.GiRobotAntennas size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-sky-950/80 tracking-wider leading-none mb-1">機体保管</div>
              <div className="text-sm font-black text-sky-800 font-mono truncate leading-none">
                {state.robots?.length} <span className="text-[10px] text-stone-500 font-normal">/ {state.storageSize}</span>
              </div>
            </div>
          </div>

          {/* DELIVERIES */}
          <div className={theme.workshop.statCard}>
            <div className={`${theme.workshop.statIconBox} bg-emerald-100/90 border-emerald-300/80 text-emerald-700`}>
              <Gi.GiTrophy size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-emerald-950/80 tracking-wider leading-none mb-1">納品実績</div>
              <div className="text-sm font-black text-emerald-800 font-mono truncate leading-none">
                {state.deliveredRobotsCount} <span className="text-[10px] text-stone-500 font-normal">件</span>
              </div>
            </div>
          </div>

          {/* REPAIRS */}
          <div className={theme.workshop.statCard}>
            <div className={`${theme.workshop.statIconBox} bg-purple-100/90 border-purple-300/80 text-purple-700`}>
              <Gi.GiSpanner size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold text-purple-950/80 tracking-wider leading-none mb-1">修理キット</div>
              <div className="text-sm font-black text-purple-800 font-mono truncate leading-none">
                {state.repairKits ?? 0} <span className="text-[10px] text-stone-500 font-normal">個</span>
              </div>
            </div>
          </div>
        </div>

        {/* まとめて回収バー (遠征の上に配置) */}
        {totalAutoPendingDrops > 0 && (
          <div className="border-t-2 border-[#d9c4b1] pt-3 pb-1 flex items-center justify-between bg-amber-50/95 border-2 border-amber-400/90 p-2.5 rounded-xl mb-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-amber-200/80 border border-amber-400 flex items-center justify-center text-amber-800 shrink-0">
                <Gi.GiCardboardBox size={18} />
              </div>
              <span className="text-xs font-bold text-amber-950">自動探索で獲得した素材があります</span>
            </div>
            <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="animate-bounce text-xs px-3 py-1 font-bold shadow-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
              <Gi.GiCardboardBox size={16} />
              <span>まとめて回収 ({totalAutoPendingDrops})</span>
            </Button>
          </div>
        )}

        {/* 通常遠征ヘッダー */}
        <div className={`${theme.workshop.sectionDivider} pt-3 mb-2.5 flex items-center justify-between flex-wrap gap-2`}>
          <div className="flex items-center gap-2">
            <div className={theme.workshop.sectionHeader}>
              <div className="w-6 h-6 rounded-md bg-[#eaddcf] border border-[#b89578] flex items-center justify-center text-[#734320]">
                <Gi.GiWalkingScout size={16} />
              </div>
              <span>通常遠征</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          {state.activeQuest ? (
            <div className={`p-3 rounded-xl border-2 transition-all shadow-2xs ${questDone ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200' : 'bg-[#fffdfa] border-[#dcc5b0]'}`}>
              <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1 bg-[#f7eee3] rounded-lg border border-[#dcc5b0] shrink-0">
                    {questRobot ? (
                      <RobotVisual robot={questRobot} size={36} />
                    ) : (
                      <div className="w-9 h-9 flex items-center justify-center text-amber-800">
                        <Gi.GiKnapsack size={22} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0 border border-amber-300">通常遠征</span>
                      <span className="font-bold text-xs sm:text-sm text-stone-800 truncate flex items-center gap-1">
                        <Gi.GiPin size={13} className="text-red-500 shrink-0" />
                        <span>{activeQuestLoc?.name}</span>
                      </span>
                      {questDone && (
                        <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-bounce shrink-0">
                          完了！
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 truncate mt-0.5">
                      同行: <span className="font-bold text-stone-800">{questRobot ? questRobot.name : 'なし'}</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 ml-auto sm:ml-0">
                  {questDone ? (
                    <Button size="sm" variant="success" onClick={handleCompleteQuest} className="animate-bounce shadow-xs font-bold text-xs px-3 py-1.5 flex items-center gap-1.5">
                      <Gi.GiPresent size={16} className="text-pink-300" />
                      <span>素材を受取る</span>
                    </Button>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 block font-mono">残り時間</span>
                      <span className="text-xs sm:text-sm font-bold font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center justify-end gap-1">
                        <Gi.GiHourglass className="text-amber-700 text-xs" />
                        <span>{formatTime(timeRemaining)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#fffdfa] rounded-xl border-2 border-[#dcc5b0] shadow-2xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0e4d7] border border-[#c4a485] flex items-center justify-center text-[#734320] shrink-0">
                  <Gi.GiWalkingScout size={18} />
                </div>
                <div>
                  <span className="text-xs text-[#5c3e28] font-bold block">通常遠征: 未出撃</span>
                  <span className="text-[11px] text-stone-500">素材集めへ出撃させましょう</span>
                </div>
              </div>
              <Button size="sm" onClick={() => onNavigate('quest')} className="text-xs px-3 py-1.5 bg-[#8e5e3a] hover:bg-[#784d2e] text-white font-bold shadow-xs border border-[#784d2e] flex items-center gap-1">
                <span>遠征へ向かう</span>
                <span>→</span>
              </Button>
            </div>
          )}
        </div>

        {/* 自動探索ヘッダー */}
        <div className={`${theme.workshop.sectionDivider} pt-3 mb-2.5 flex items-center justify-between flex-wrap gap-2`}>
          <div className="flex items-center gap-2">
            <div className={theme.workshop.sectionHeader}>
              <div className="w-6 h-6 rounded-md bg-[#eaddcf] border border-[#b89578] flex items-center justify-center text-[#734320]">
                <Gi.GiFactory size={16} />
              </div>
              <span>自動探索</span>
            </div>
            {(state.autoDispatches && state.autoDispatches.length > 0) && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-2.5 py-1 bg-[#8e5e3a] hover:bg-[#784d2e] text-white border border-[#784d2e] font-bold shadow-xs flex items-center gap-1.5">
              <Gi.GiWalkingScout size={14} />
              <span>派遣する</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {(!state.autoDispatches || state.autoDispatches.length === 0) && (
            <div className="p-4 bg-[#fffdfa] rounded-xl border-2 border-dashed border-[#d2b89f] text-center flex flex-col items-center justify-center gap-2 shadow-2xs">
              <Gi.GiSleepy className="text-3xl text-[#b89578]" />
              <p className="text-xs text-[#6e4e37] font-bold">現在、自動探索中のロボットはいません</p>
            </div>
          )}
          {/* 自動探索ロボット一覧 (Auto Dispatches) */}
          {state.autoDispatches?.map(d => {
              const dRobot = state.robots.find(r => r.id === d.robotId);
              const dLoc = LOCATIONS.find(l => l.id === d.locationId);
              const intervalMs = engine.getAutoDispatchIntervalMs(d.robotId, d.locationId);
              const nextTime = d.lastCollectedAt + intervalMs;
              const remain = Math.max(0, nextTime - Date.now());
              const pending = d.pendingDrops?.length || 0;
              const isResting = (dRobot?.currentHp ?? 12) <= 1;
              const selectedEmotion = isResting ? 'troubled' : (previewEmotions[d.id] || 'auto');
              const weather = dLoc ? engine.getLocationWeather(dLoc.id, Date.now()) : null;

              return (
                <div key={d.id} className={`p-3 rounded-xl border-2 shadow-2xs transition-all ${isResting ? 'bg-red-50/90 border-red-300 ring-1 ring-red-200' : pending > 0 ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-200' : 'bg-[#fffdfa] border-[#dcc5b0]'}`}>
                  {/* ロボット探索アニメーション（コンパクト） */}
                  {dRobot && (
                    <div className="w-full bg-stone-900 rounded-lg overflow-hidden border-2 border-[#b89578] relative mb-2 shadow-2xs">
                      <RobotVisual 
                        robot={dRobot} 
                        size={40} 
                        containerWidth="100%"
                        containerHeight={90}
                        animateExploration={!isResting} 
                        emotion={selectedEmotion}
                        hasPendingDrops={pending > 0 && !isResting}
                        locationId={d.locationId}
                        weatherType={weather?.type}
                        agility={dRobot.stats.agility}
                      />


                      {/* 表情テスト切替 */}
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-stone-900/85 p-0.5 rounded border border-stone-700/60 z-20">
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'auto' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors ${selectedEmotion === 'auto' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          自動
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'happy' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors flex items-center gap-0.5 ${selectedEmotion === 'happy' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          <Gi.GiSparkles className="text-amber-300 text-[10px]" />
                          <span>発見</span>
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'troubled' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors flex items-center gap-0.5 ${selectedEmotion === 'troubled' ? 'bg-blue-600 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          <Gi.GiWaterDrop className="text-blue-400 text-[10px]" />
                          <span>困り</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 font-bold px-1.5 py-0.2 rounded">自動探索</span>
                        <span className="font-bold text-xs sm:text-sm text-stone-800">{dRobot?.name || 'ロボット'}</span>
                        <span className="text-[11px] text-stone-500 inline-flex items-center gap-0.5">
                          <Gi.GiPin size={12} className="text-red-500" />
                          <span>{dLoc?.name}</span>
                        </span>
                        {weather && (
                          <span className="flex items-center gap-1 text-[10px] bg-sky-100 text-sky-800 border border-sky-200 px-1 rounded cursor-help" title={weather.description}>
                            {weather.name}
                            <span className={`px-0.5 rounded text-[8px] ${weather.timeMultiplier > 1 ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
                              x{weather.timeMultiplier.toFixed(1)}
                            </span>
                          </span>
                        )}
                        <span className="text-[10px] text-red-600 font-mono bg-red-50 border border-red-200 px-1 rounded inline-flex items-center gap-0.5">
                          <Gi.GiHeartPlus size={11} className="text-rose-500" />
                          <span>{dRobot?.currentHp ?? 12}/{dRobot?.maxHp ?? 12}</span>
                        </span>
                        {isResting && (
                          <span className="text-[10px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">
                            HP切れ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 font-mono">
                        {isResting ? (
                          <span className="text-rose-600 font-bold flex items-center gap-1">
                            <Gi.GiHazardSign size={13} className="text-amber-500" />
                            <span>HP切れのため探索中断中（帰還させて修理してください）</span>
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1">
                              <Gi.GiHourglass size={12} className="text-stone-500" />
                              <span>次回: {formatTime(remain)}</span>
                            </span>
                            {dRobot && dRobot.stats.agility > 0 && (
                              <span className="text-blue-600 bg-blue-50 px-1 rounded border border-blue-200 inline-flex items-center gap-0.5">
                                <Gi.GiLightningTrio size={11} className="text-yellow-500" />
                                <span>-{dRobot.stats.agility}s</span>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                      {pending > 0 ? (
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => handleClaimAutoDispatch(d.id)}
                          className="text-xs px-2.5 py-1 font-bold shadow-xs animate-pulse flex items-center gap-1.5"
                        >
                          <Gi.GiCardboardBox size={15} />
                          <span>回収 ({pending})</span>
                        </Button>
                      ) : isResting ? (
                        dRobot && state.repairKits && state.repairKits > 0 ? (
                          <Button 
                            size="sm" 
                            variant="success" 
                            onClick={() => handleRepairRobot(dRobot)}
                            className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs flex items-center gap-1.5 animate-bounce"
                            title="修理キットを使ってHPを全快にし探索を再開します"
                          >
                            <Gi.GiSpanner size={14} />
                            <span>修理して再開</span>
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="danger" 
                            disabled={true}
                            className="text-xs px-2 py-1 opacity-90 bg-rose-100 text-rose-700 border border-rose-300 font-bold flex items-center gap-1"
                          >
                            <Gi.GiBrokenHeart size={14} className="text-red-500" />
                            <span>HP切れ</span>
                          </Button>
                        )
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          disabled={true}
                          className="text-xs px-2 py-1 opacity-80 bg-stone-100 text-stone-600 border border-stone-300 font-bold flex items-center gap-1"
                        >
                          <Gi.GiTreasureMap size={14} />
                          <span>探索中</span>
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => handleCancelAutoDispatch(d.id)} className="text-xs px-2 py-1">
                        帰還
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Tutorial Banner */}
      {state.tutorialStep < 5 && (
        <Card className="bg-[#eff6ff] border-2 border-blue-300 text-blue-900 p-3 shadow-2xs">
          <h3 className="font-black text-xs sm:text-sm text-blue-900 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-amber-500 shrink-0">
              <Gi.GiLightBulb size={15} />
            </div>
            <span>チュートリアル進行中</span>
          </h3>
          <p className="mt-1 text-xs font-bold text-blue-800">
            {state.tutorialStep === 0 && '「遠征」へ向かい素材を集めよう。'}
            {state.tutorialStep === 1 && '遠征から帰還するのを待ち、素材を受け取ろう。'}
            {state.tutorialStep === 2 && '「製造」メニューでロボットを作ってみよう！'}
            {state.tutorialStep === 3 && '「依頼板」を見て、納品できそうな依頼を受けよう。'}
            {state.tutorialStep === 4 && '依頼詳細からロボットを「納品」しよう。'}
          </p>
        </Card>
      )}

      {/* Crafting in Progress Banner (if any) */}
      {(state.activePartCraft || state.activeRobotAssembly) && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-2xs p-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <span className="animate-spin inline-flex" style={{ animationDuration: '4s' }}>
                  <Gi.GiCog size={20} />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                    {state.activePartCraft && state.activeRobotAssembly 
                      ? 'パーツ製造 & ロボット組立中' 
                      : state.activePartCraft 
                        ? 'パーツ製造中' 
                        : 'ロボット組立中'}
                  </h4>
                  {(
                    (state.activePartCraft && state.activePartCraft.endTime <= Date.now()) ||
                    (state.activeRobotAssembly && state.activeRobotAssembly.endTime <= Date.now())
                  ) && (
                    <Badge className="bg-amber-500 text-white text-[10px] whitespace-nowrap animate-bounce leading-none flex items-center gap-1">
                      <Gi.GiPartyPopper size={12} />
                      <span>完成！</span>
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-stone-600 flex gap-3 mt-0.5">
                  {state.activePartCraft && (
                    <span className="whitespace-nowrap">
                      パーツ: {state.activePartCraft.endTime <= Date.now() ? <strong className="text-emerald-600">完成！</strong> : <span className="font-mono">{formatTime(Math.max(0, state.activePartCraft.endTime - Date.now()))}</span>}
                    </span>
                  )}
                  {state.activeRobotAssembly && (
                    <span className="whitespace-nowrap">
                      ロボット: {state.activeRobotAssembly.endTime <= Date.now() ? <strong className="text-emerald-600">完成！</strong> : <span className="font-mono">{formatTime(Math.max(0, state.activeRobotAssembly.endTime - Date.now()))}</span>}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button size="sm" onClick={() => onNavigate('craft')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs">
              製造画面へ →
            </Button>
          </div>
        </Card>
      )}

      {/* Current Request Banner */}
      {state.currentRequest && (
        <Card className="border-2 border-blue-200 bg-blue-50/50 p-3 shadow-2xs">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-black text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Gi.GiChecklist size={14} />
              </div>
              <span>受諾中の依頼: {state.currentRequest.clientName}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              +{state.currentRequest.rewardG} G
            </span>
          </div>
          <p className="text-xs text-stone-600 line-clamp-1 mb-2">{state.currentRequest.description}</p>
          <Button size="sm" className="w-full text-xs font-bold" onClick={() => onNavigate('requests')}>
            納品へ進む →
          </Button>
        </Card>
      )}

      {/* Shop & Material Trade Feature Card (商店・素材売買・交換所) */}
      <div 
        onClick={() => onNavigate('shop')}
        className="bg-gradient-to-r from-[#fcf7ee] via-[#f7eee2] to-[#f2e4d2] border-2 border-[#c29b77] hover:border-[#9c6a46] rounded-xl px-3.5 py-2.5 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#aa6e45] to-[#784824] text-white flex items-center justify-center text-lg shadow-2xs border border-[#c4936d] shrink-0 group-hover:scale-105 transition-transform">
            <Gi.GiShop size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xs sm:text-sm text-[#482b17] truncate">
                素材商店・交換所
              </h3>
              <span className="text-[10px] bg-[#ead9c8] text-[#6b3e1f] font-bold px-1.5 py-0.2 rounded border border-[#c9ab8d] hidden sm:inline whitespace-nowrap">
                素材売買・修理キット
              </span>
            </div>
            <p className="text-[11px] text-[#70523e] truncate mt-0.5">
              素材の購入/売却 ｜ 修理キット交換 ｜ 内装変更
            </p>
          </div>
        </div>
        <span className="text-[#a6866b] group-hover:text-[#784824] group-hover:translate-x-0.5 transition-all text-sm shrink-0 font-bold">
          ›
        </span>
      </div>

      {/* Information & Archive Utility Menu (図鑑・仕様書) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('encyclopedia')}
          className="flex items-center gap-2.5 p-2.5 bg-[#fffdfa] hover:bg-[#f5ede3] border-2 border-[#dcc5b0] hover:border-[#b89578] rounded-xl text-[#5c3e28] transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#f0e4d7] border border-[#c4a485] flex items-center justify-center text-[#734320] shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <Gi.GiBookCover size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#482b17]">
              図鑑・実績
            </div>
            <div className="text-[10px] text-[#856550] truncate">納品履歴 / パーツ詳細</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('litepaper')}
          className="flex items-center gap-2.5 p-2.5 bg-[#fffdfa] hover:bg-[#f5ede3] border-2 border-[#dcc5b0] hover:border-[#b89578] rounded-xl text-[#5c3e28] transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-[#f0e4d7] border border-[#c4a485] flex items-center justify-center text-[#734320] shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
            <Gi.GiScrollUnfurled size={18} />
          </span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#482b17]">
              工房仕様書
            </div>
            <div className="text-[10px] text-[#856550] truncate">工房ルール / ガイド</div>
          </div>
        </button>
      </div>

      {/* Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className={`fixed inset-0 bg-black/50 ${theme.zIndex.modalOverlay} flex items-center justify-center p-4`}>
          <Card className="w-full max-w-md bg-stone-50">
            <h3 className={`${theme.typography.h3} mb-4`}>自動探索へ派遣</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">派遣先</label>
              <select 
                className="w-full p-2 border border-stone-300 rounded bg-white"
                value={selectedLocationId}
                onChange={e => setSelectedLocationId(e.target.value)}
              >
                <option value="">選択してください</option>
                {state.unlockedLocations.map(locId => {
                  const l = LOCATIONS.find(x => x.id === locId);
                  return <option key={locId} value={locId}>{l?.name}</option>;
                })}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-1">派遣するロボット</label>
              <select 
                className="w-full p-2 border border-stone-300 rounded bg-white"
                value={selectedRobotId}
                onChange={e => setSelectedRobotId(e.target.value)}
              >
                <option value="">選択してください</option>
                {state.robots
                  .filter(r => !state.autoDispatches?.some(d => d.robotId === r.id))
                  .filter(r => state.activeQuest?.dispatchedRobotId !== r.id)
                  .map(r => (
                  <option key={r.id} value={r.id} disabled={(r.currentHp ?? 12) <= 1}>
                    {r.name} (HP: {r.currentHp ?? 12}/{r.maxHp ?? 12} | Agi: {r.stats.agility})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Robot Preview in Modal */}
            {selectedModalRobot && (
              <div className="mb-4 p-3 bg-stone-50 text-stone-800 rounded-lg border border-stone-300 shadow-xs">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-xs text-amber-900">{selectedModalRobot.name}</p>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      パワー: <span className="font-bold text-orange-600">{selectedModalRobot.stats.power}</span> / 速度: <span className="font-bold text-amber-600">{selectedModalRobot.stats.agility}</span>
                    </p>
                    <p className="text-[10px] text-amber-700 font-mono mt-0.5">
                      <Gi.GiLightningTrio className="inline mr-1 text-yellow-400" /> 敏捷補正: -{selectedModalRobot.stats.agility}秒短縮 (周期: {Math.round(engine.getAutoDispatchIntervalMs(selectedModalRobot.id) / 60000 * 10) / 10}分)
                    </p>
                  </div>
                  <div className="bg-white p-1 rounded border border-stone-200 shrink-0">
                    <RobotVisual 
                      robot={selectedModalRobot} 
                      size={48} 
                      locationId={selectedLocationId || 'loc1'}
                      agility={selectedModalRobot.stats.agility}
                      animateExploration={true}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-center">
                  <RobotRadarChart robot={selectedModalRobot} size={150} themeStyle="light" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="primary" 
                disabled={!selectedLocationId || !selectedRobotId}
                onClick={() => {
                  try {
                    engine.startAutoDispatch(selectedRobotId, selectedLocationId);
                    setIsDispatchModalOpen(false);
                    setSelectedLocationId('');
                    setSelectedRobotId('');
                  } catch (e: any) {
                    alert(e.message || '自動探索の派遣に失敗しました');
                  }
                }}
              >
                派遣する
              </Button>
              <Button className="flex-1" variant="secondary" onClick={() => setIsDispatchModalOpen(false)}>キャンセル</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Loot Result Modal (Quest & Auto Dispatch) */}
      <AnimatePresence>
      {lootResult && !isAnimating && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-black/80 ${theme.zIndex.modalOverlay} flex items-center justify-center p-4 backdrop-blur-sm`}
        >
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="w-full max-w-md"
          >
            <Card className="w-full bg-stone-50 text-center shadow-2xl border-4 border-emerald-400 overflow-hidden relative">
              
              {/* Shiny background effect */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(52,211,153,0.3)_360deg)] opacity-50 pointer-events-none"
              />

              <div className="relative z-10">
                <motion.h2 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`${theme.typography.h2} mb-2 text-emerald-600 drop-shadow-md text-2xl sm:text-3xl flex items-center justify-center gap-2`}
                  style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                >
                  <Gi.GiPartyPopper className="text-amber-500" />
                  <span>{lootResult.title}</span>
                </motion.h2>
                
                {lootResult.subtitle && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 font-bold text-xs sm:text-sm text-stone-700"
                  >
                    {lootResult.subtitle}
                  </motion.p>
                )}
                
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 max-h-64 overflow-y-auto p-4 bg-stone-100 rounded-lg shadow-inner">
                  {lootResult.drops.map((dropId, i) => {
                    const mat = MATERIALS.find(m => m.id === dropId);
                    const rarityStyle = mat ? theme.rarity[mat.rarity] : theme.rarity[1];
                    return (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + (i * 0.04), type: "spring", stiffness: 300 }}
                      >
                        <Badge className={`${rarityStyle.bg} ${rarityStyle.text} border-2 ${rarityStyle.border} ${rarityStyle.ring} p-2 text-xs sm:text-sm flex items-center gap-1.5 shadow-sm`}>
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
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button onClick={handleCloseModal} className="w-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow" size="lg" variant="success">
                    アイテムを倉庫へ格納する
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      
      {/* Particle Animation */}
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

      {/* ロボット修理演出モーダル */}
      {repairingRobotState && (
        <RepairAnimationModal
          robot={repairingRobotState.robot}
          initialHp={repairingRobotState.initialHp}
          onClose={() => setRepairingRobotState(null)}
        />
      )}
    </div>
  );
};
