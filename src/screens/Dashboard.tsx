import React, { useState } from 'react';
import * as Gi from 'react-icons/gi';
import { GameState, Robot, getFameRank } from '../core/models';
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
  const [displayMode, setDisplayMode] = useState<'detailed' | 'compact'>(() => {
    try {
      return (localStorage.getItem('workshop_dashboard_mode') as 'detailed' | 'compact') || 'detailed';
    } catch {
      return 'detailed';
    }
  });

  const handleToggleMode = (mode: 'detailed' | 'compact') => {
    setDisplayMode(mode);
    try {
      localStorage.setItem('workshop_dashboard_mode', mode);
    } catch {
      // ignore
    }
  };

  const [lootResult, setLootResult] = useState<{ title: string; subtitle?: string; drops: string[]; type: 'quest' | 'auto_dispatch' } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedRobotId, setSelectedRobotId] = useState<string>('');
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
  const questDone = Boolean(state.activeQuest && timeRemaining <= 0);
  const selectedModalRobot = state.robots.find(r => r.id === selectedRobotId);

  const totalAutoPendingDrops = state.autoDispatches?.reduce((acc, d) => acc + (d.pendingDrops?.length || 0), 0) || 0;
  
  // 各種作業の進捗状況
  const isCraftPartActive = Boolean(state.activePartCraft);
  const isCraftPartDone = state.activePartCraft ? state.activePartCraft.endTime <= Date.now() : false;
  const isCraftRobotActive = Boolean(state.activeRobotAssembly);
  const isCraftRobotDone = state.activeRobotAssembly ? state.activeRobotAssembly.endTime <= Date.now() : false;
  const isDisassemblyActive = Boolean(state.activeRobotDisassembly);
  const isDisassemblyDone = state.activeRobotDisassembly ? state.activeRobotDisassembly.endTime <= Date.now() : false;
  const isRecycleActive = Boolean(state.activePartRecycle);
  const isRecycleDone = state.activePartRecycle ? state.activePartRecycle.endTime <= Date.now() : false;

  const hasAnyActiveWork = Boolean(
    state.activeQuest || 
    (state.autoDispatches && state.autoDispatches.length > 0) || 
    isCraftPartActive || 
    isCraftRobotActive || 
    isDisassemblyActive || 
    isRecycleActive || 
    state.currentRequest ||
    totalAutoPendingDrops > 0
  );

  return (
    <div className="space-y-4">
      {/* 表示モード切り替えスイッチバー */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-stone-700 font-bold">
          <Gi.GiFactory className="text-amber-800" size={16} />
          <span>工房ダッシュボード</span>
        </div>
        <div className="flex items-center bg-[#eae0d5] p-0.5 rounded-lg border border-[#cbb197] shadow-2xs">
          <button
            onClick={() => handleToggleMode('detailed')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              displayMode === 'detailed'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Gi.GiEyeTarget size={13} />
            <span>詳細</span>
          </button>
          <button
            onClick={() => handleToggleMode('compact')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              displayMode === 'compact'
                ? 'bg-amber-700 text-white shadow-2xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Gi.GiLightningBow size={13} />
            <span>コンパクト</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. コンパクトモード (Compact Mode: Icons, Badges & Minimal Essential Stats) */}
      {/* ========================================================================= */}
      {displayMode === 'compact' ? (
        <div className="space-y-3">
          {/* コンパクトステータス・名声バー */}
          {(() => {
            const currentFame = state.fame || 0;
            const fameRank = getFameRank(currentFame);
            const nextRankFame = fameRank.nextFame;
            const prevRankFame = fameRank.minFame;
            const progressPercent = nextRankFame
              ? Math.min(100, Math.max(0, Math.round(((currentFame - prevRankFame) / (nextRankFame - prevRankFame)) * 100)))
              : 100;

            return (
              <Card className="bg-[#fcf8f2] border-2 border-[#c29b77] p-2.5 shadow-2xs">
                {/* 1行目: 名声ランク & 所持金 */}
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-md bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                      <Gi.GiTrophyCup size={14} />
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${fameRank.badgeBg} ${fameRank.badgeBorder} ${fameRank.textColor}`}>
                      Rank {fameRank.level} : {fameRank.title}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 font-bold">
                      ({currentFame} 名声)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                    <Gi.GiCoins className="text-amber-600" size={14} />
                    <span className="text-xs font-black font-mono text-amber-800">{state.gold} G</span>
                  </div>
                </div>

                {/* 名声ミニプログレスバー */}
                <div className="mb-2">
                  <div className="w-full bg-stone-200/80 rounded-full h-1.5 overflow-hidden border border-stone-300/80">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-stone-500 font-mono mt-0.5">
                    <span>Rank {fameRank.level} ({prevRankFame})</span>
                    <span className="font-bold text-amber-800">{progressPercent}%</span>
                    <span>{nextRankFame ? `Rank ${fameRank.level + 1} (${nextRankFame})` : 'MAX'}</span>
                  </div>
                </div>

                {/* 2行目: 機体数・納品・修理キットミニチップ */}
                <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#e2cfbd] text-center">
                  <div className="bg-[#fffdfa] border border-[#dcc5b0] rounded py-1 px-1.5 flex items-center justify-center gap-1">
                    <Gi.GiRobotAntennas size={13} className="text-sky-700" />
                    <span className="text-[10px] text-stone-600 font-bold">機体</span>
                    <span className="text-[11px] font-black font-mono text-sky-800">{state.robots?.length}/{state.storageSize}</span>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#dcc5b0] rounded py-1 px-1.5 flex items-center justify-center gap-1">
                    <Gi.GiTrophy size={13} className="text-emerald-700" />
                    <span className="text-[10px] text-stone-600 font-bold">納品</span>
                    <span className="text-[11px] font-black font-mono text-emerald-800">{state.deliveredRobotsCount}件</span>
                  </div>
                  <div className="bg-[#fffdfa] border border-[#dcc5b0] rounded py-1 px-1.5 flex items-center justify-center gap-1">
                    <Gi.GiSpanner size={13} className="text-purple-700" />
                    <span className="text-[10px] text-stone-600 font-bold">修理</span>
                    <span className="text-[11px] font-black font-mono text-purple-800">{state.repairKits ?? 0}個</span>
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* 稼働状況クイックグリッド (4タイル) */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. 遠征 */}
            <div 
              onClick={() => {
                if (state.activeQuest && questDone) {
                  handleCompleteQuest();
                } else {
                  onNavigate('quest');
                }
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                state.activeQuest 
                  ? (questDone ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300 animate-pulse' : 'bg-amber-50 border-amber-300') 
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-amber-600'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  state.activeQuest ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiWalkingScout size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate">遠征</div>
                  <div className="text-[10px] truncate">
                    {state.activeQuest ? (
                      questDone ? (
                        <span className="text-emerald-700 font-bold">受取可！</span>
                      ) : (
                        <span className="text-amber-800 font-mono font-bold">{formatTime(timeRemaining)}</span>
                      )
                    ) : (
                      <span className="text-stone-400">未出撃</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-bold">›</span>
            </div>

            {/* 2. 製造 */}
            <div 
              onClick={() => onNavigate('craft')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                (isCraftPartActive || isCraftRobotActive)
                  ? ((isCraftPartDone || isCraftRobotDone) ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300 animate-pulse' : 'bg-amber-50 border-amber-300')
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-amber-600'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  (isCraftPartActive || isCraftRobotActive) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiAnvil size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate">製造・組立</div>
                  <div className="text-[10px] truncate">
                    {(isCraftPartActive || isCraftRobotActive) ? (
                      (isCraftPartDone || isCraftRobotDone) ? (
                        <span className="text-emerald-700 font-bold">完成！</span>
                      ) : (
                        <span className="text-amber-800 font-mono font-bold">
                          {formatTime(Math.max(0, (state.activePartCraft?.endTime || state.activeRobotAssembly?.endTime || 0) - Date.now()))}
                        </span>
                      )
                    ) : (
                      <span className="text-stone-400">空き</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-bold">›</span>
            </div>

            {/* 3. 倉庫 */}
            <div 
              onClick={() => onNavigate('storage')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                (isDisassemblyActive || isRecycleActive)
                  ? ((isDisassemblyDone || isRecycleDone) ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300 animate-pulse' : 'bg-amber-50 border-amber-300')
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-amber-600'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  (isDisassemblyActive || isRecycleActive) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiRecycle size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate">倉庫・解体</div>
                  <div className="text-[10px] truncate">
                    {(isDisassemblyActive || isRecycleActive) ? (
                      (isDisassemblyDone || isRecycleDone) ? (
                        <span className="text-emerald-700 font-bold">完了！</span>
                      ) : (
                        <span className="text-amber-800 font-mono font-bold">作業中</span>
                      )
                    ) : (
                      <span className="text-stone-500">{state.robots?.length}機体 保管中</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-bold">›</span>
            </div>

            {/* 4. 依頼 */}
            <div 
              onClick={() => onNavigate('requests')}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs ${
                state.currentRequest 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-amber-600'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  state.currentRequest ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiChecklist size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate">依頼案件</div>
                  <div className="text-[10px] truncate">
                    {state.currentRequest ? (
                      <span className="text-blue-800 font-bold truncate">受諾中 (+{state.currentRequest.rewardG}G)</span>
                    ) : (
                      <span className="text-stone-400">依頼なし</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 font-bold">›</span>
            </div>
          </div>

          {/* 自動探索コンパクトセクション */}
          <Card className="bg-[#fcf8f2] border-2 border-[#c29b77] p-2.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Gi.GiFactory size={15} className="text-amber-800" />
                <span className="text-xs font-bold text-amber-950">自動探索 ({state.autoDispatches?.length || 0})</span>
              </div>
              <div className="flex items-center gap-1.5">
                {totalAutoPendingDrops > 0 && (
                  <button
                    onClick={handleClaimAllAutoDispatches}
                    className="text-[10px] px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold shadow-2xs flex items-center gap-1 animate-pulse cursor-pointer"
                  >
                    <Gi.GiCardboardBox size={12} />
                    <span>一括回収 ({totalAutoPendingDrops})</span>
                  </button>
                )}
                <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-[10px] px-2 py-0.5 bg-[#8e5e3a] hover:bg-[#784d2e] text-white font-bold">
                  + 派遣
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              {(!state.autoDispatches || state.autoDispatches.length === 0) ? (
                <div className="p-2.5 bg-[#fffdfa] rounded-lg border border-dashed border-[#d2b89f] text-center text-[11px] text-stone-500 font-bold">
                  自動探索中の機体はいません
                </div>
              ) : (
                state.autoDispatches.map(d => {
                  const dRobot = state.robots.find(r => r.id === d.robotId);
                  const dLoc = LOCATIONS.find(l => l.id === d.locationId);
                  const intervalMs = engine.getAutoDispatchIntervalMs(d.robotId, d.locationId);
                  const nextTime = d.lastCollectedAt + intervalMs;
                  const remain = Math.max(0, nextTime - Date.now());
                  const pending = d.pendingDrops?.length || 0;
                  const isResting = (dRobot?.currentHp ?? 12) <= 1;

                  return (
                    <div 
                      key={d.id} 
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                        isResting ? 'bg-red-50 border-red-300' : pending > 0 ? 'bg-emerald-50 border-emerald-400' : 'bg-[#fffdfa] border-[#dcc5b0]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-stone-200 border border-stone-300 flex items-center justify-center shrink-0">
                          <Gi.GiRobotAntennas size={13} className="text-stone-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 truncate">
                            <span className="font-bold text-stone-800 text-[11px] truncate">{dRobot?.name}</span>
                            <span className="text-[10px] text-stone-500 truncate">({dLoc?.name})</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-500">
                            <span className="text-red-600 font-bold">HP {dRobot?.currentHp}/{dRobot?.maxHp}</span>
                            <span>次回: {formatTime(remain)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {pending > 0 ? (
                          <button
                            onClick={() => handleClaimAutoDispatch(d.id)}
                            className="text-[10px] px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold shadow-2xs flex items-center gap-1 animate-pulse cursor-pointer"
                          >
                            <Gi.GiCardboardBox size={11} />
                            <span>回収 ({pending})</span>
                          </button>
                        ) : isResting ? (
                          dRobot && state.repairKits && state.repairKits > 0 ? (
                            <button
                              onClick={() => handleRepairRobot(dRobot)}
                              className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Gi.GiSpanner size={11} />
                              <span>修理</span>
                            </button>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded font-bold">
                              HP切れ
                            </span>
                          )
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-600 border border-stone-300 rounded font-bold">
                            探索中
                          </span>
                        )}
                        <button
                          onClick={() => handleCancelAutoDispatch(d.id)}
                          className="text-[10px] px-1.5 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 rounded font-bold cursor-pointer"
                        >
                          帰還
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* クイックリンクバー (商店・図鑑・仕様書) */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onNavigate('shop')}
              className="flex items-center justify-center gap-1.5 p-2 bg-[#fffdfa] hover:bg-[#f5ede3] border border-[#dcc5b0] rounded-lg text-xs font-bold text-[#482b17] shadow-2xs cursor-pointer"
            >
              <Gi.GiShop size={15} className="text-amber-700" />
              <span>素材商店</span>
            </button>
            <button
              onClick={() => onNavigate('encyclopedia')}
              className="flex items-center justify-center gap-1.5 p-2 bg-[#fffdfa] hover:bg-[#f5ede3] border border-[#dcc5b0] rounded-lg text-xs font-bold text-[#482b17] shadow-2xs cursor-pointer"
            >
              <Gi.GiBookCover size={15} className="text-amber-700" />
              <span>図鑑・実績</span>
            </button>
            <button
              onClick={() => onNavigate('litepaper')}
              className="flex items-center justify-center gap-1.5 p-2 bg-[#fffdfa] hover:bg-[#f5ede3] border border-[#dcc5b0] rounded-lg text-xs font-bold text-[#482b17] shadow-2xs cursor-pointer"
            >
              <Gi.GiScrollUnfurled size={15} className="text-amber-700" />
              <span>工房仕様書</span>
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. 詳細モード (Detailed Mode: Rich Visuals, Progress Meters, & Full Info)   */
        /* ========================================================================= */
        <>
          {/* 統合ダッシュボードカード (Unified Workshop Dashboard - Warm Brick & Wood Theme) */}
          <Card className={theme.workshop.mainCard + " p-3.5"}>
            <div className="relative z-10">
        
        {/* 上部ステータスバー (工房の木製・真鍮プレート銘板デザイン) */}
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

        {/* 工房名声・ランクバナー (Fame & Workshop Rank Banner) */}
        {(() => {
          const currentFame = state.fame || 0;
          const fameRank = getFameRank(currentFame);
          const nextRankFame = fameRank.nextFame;
          const prevRankFame = fameRank.minFame;
          const progressPercent = nextRankFame
            ? Math.min(100, Math.max(0, Math.round(((currentFame - prevRankFame) / (nextRankFame - prevRankFame)) * 100)))
            : 100;

          return (
            <div className={`${theme.workshop.fameCard} mb-3.5`}>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/90 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
                    <Gi.GiTrophyCup size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-950 tracking-wider">工房名声</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${fameRank.badgeBg} ${fameRank.badgeBorder} ${fameRank.textColor} shadow-2xs`}>
                        Rank {fameRank.level} : {fameRank.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {fameRank.desc}
                    </div>
                  </div>
                </div>

                <div className="text-right ml-auto sm:ml-0">
                  <div className="text-base sm:text-lg font-black font-mono text-amber-800 leading-none">
                    {currentFame.toLocaleString()} <span className="text-xs font-sans text-stone-500 font-normal">名声</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 mt-0.5">
                    {nextRankFame ? (
                      <span>次ランクまで <span className="font-bold text-amber-900 font-mono">{(nextRankFame - currentFame).toLocaleString()}</span></span>
                    ) : (
                      <span className="text-amber-800 font-bold">★最高名声ランク到達！</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 名声進行度プログレスバー */}
              <div className="space-y-1">
                <div className={theme.workshop.fameProgressBg}>
                  <div 
                    className={theme.workshop.fameProgressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-stone-500 font-mono">
                  <span>Rank {fameRank.level} ({prevRankFame} 名声)</span>
                  <span className="font-bold text-amber-900">{progressPercent}%</span>
                  <span>{nextRankFame ? `Rank ${fameRank.level + 1} (${nextRankFame} 名声)` : 'MAX'}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* リアルタイム作業進捗ハブ (Active Operations Overview) */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 text-xs">
                <Gi.GiGears size={13} />
              </div>
              <span className="text-xs font-bold text-amber-950">現在の作業・稼働状況</span>
            </div>
            {totalAutoPendingDrops > 0 && (
              <button
                onClick={handleClaimAllAutoDispatches}
                className="text-[11px] px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold shadow-2xs flex items-center gap-1 animate-bounce cursor-pointer"
              >
                <Gi.GiCardboardBox size={13} />
                <span>素材一括回収 ({totalAutoPendingDrops})</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* 1. 通常遠征の状況 */}
            <div 
              onClick={() => {
                if (state.activeQuest && questDone) {
                  handleCompleteQuest();
                } else {
                  onNavigate('quest');
                }
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2 ${
                state.activeQuest 
                  ? (questDone ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs ring-1 ring-emerald-300' : 'bg-amber-50/70 border-amber-300/80 hover:bg-amber-100/70') 
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-[#b89578]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  state.activeQuest ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiWalkingScout size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate flex items-center gap-1">
                    <span>通常遠征</span>
                    {questDone && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded font-bold">完了</span>}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {state.activeQuest 
                      ? `${activeQuestLoc?.name || '遠征中'} (${questDone ? '素材受取可' : formatTime(timeRemaining)})` 
                      : '未出撃 (素材探索へ)'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all font-bold">›</span>
            </div>

            {/* 2. 製造（パーツ・ロボット組立）の状況 */}
            <div 
              onClick={() => onNavigate('craft')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2 ${
                (isCraftPartActive || isCraftRobotActive)
                  ? ((isCraftPartDone || isCraftRobotDone) ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs ring-1 ring-emerald-300' : 'bg-amber-50/70 border-amber-300/80 hover:bg-amber-100/70')
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-[#b89578]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  (isCraftPartActive || isCraftRobotActive) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiAnvil size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate flex items-center gap-1">
                    <span>製造・組立</span>
                    {(isCraftPartDone || isCraftRobotDone) && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded font-bold">完成！</span>}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {isCraftPartActive && state.activePartCraft
                      ? `パーツ製造中 (${isCraftPartDone ? '完成' : formatTime(Math.max(0, state.activePartCraft.endTime - Date.now()))})`
                      : isCraftRobotActive && state.activeRobotAssembly
                        ? `ロボット組立中 (${isCraftRobotDone ? '完成' : formatTime(Math.max(0, state.activeRobotAssembly.endTime - Date.now()))})`
                        : '設備空き (パーツ製造/組立)'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all font-bold">›</span>
            </div>

            {/* 3. 倉庫作業（解体・リサイクル）の状況 */}
            <div 
              onClick={() => onNavigate('storage')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2 ${
                (isDisassemblyActive || isRecycleActive)
                  ? ((isDisassemblyDone || isRecycleDone) ? 'bg-emerald-50/90 border-emerald-400 shadow-2xs ring-1 ring-emerald-300' : 'bg-amber-50/70 border-amber-300/80 hover:bg-amber-100/70')
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-[#b89578]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  (isDisassemblyActive || isRecycleActive) ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiRecycle size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate flex items-center gap-1">
                    <span>倉庫・解体</span>
                    {(isDisassemblyDone || isRecycleDone) && <span className="text-[9px] bg-emerald-600 text-white px-1 rounded font-bold">完了</span>}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {isDisassemblyActive && state.activeRobotDisassembly
                      ? `機体解体中 (${isDisassemblyDone ? '完了' : formatTime(Math.max(0, state.activeRobotDisassembly.endTime - Date.now()))})`
                      : isRecycleActive && state.activePartRecycle
                        ? `パーツリサイクル中 (${isRecycleDone ? '完了' : formatTime(Math.max(0, state.activePartRecycle.endTime - Date.now()))})`
                        : `機体 ${state.robots?.length}/${state.storageSize} 体保管中`}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all font-bold">›</span>
            </div>

            {/* 4. 受諾中の依頼 */}
            <div 
              onClick={() => onNavigate('requests')}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex items-center justify-between gap-2 ${
                state.currentRequest 
                  ? 'bg-blue-50/80 border-blue-300 shadow-2xs hover:bg-blue-100/80' 
                  : 'bg-[#fffdfa] border-[#dcc5b0] hover:border-[#b89578]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                  state.currentRequest ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}>
                  <Gi.GiChecklist size={16} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-stone-800 truncate flex items-center gap-1">
                    <span>依頼案件</span>
                    {state.currentRequest && <span className="text-[9px] bg-amber-500 text-white px-1 rounded font-bold">+{state.currentRequest.rewardG}G</span>}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {state.currentRequest 
                      ? `${state.currentRequest.clientName} (${state.currentRequest.description})`
                      : '受諾中の依頼なし (依頼板へ)'}
                  </div>
                </div>
              </div>
              <span className="text-xs text-stone-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all font-bold">›</span>
            </div>
          </div>
        </div>

        {/* 自動探索セクション */}
        <div className={`${theme.workshop.sectionDivider} pt-3 mb-2.5 flex items-center justify-between flex-wrap gap-2`}>
          <div className="flex items-center gap-2">
            <div className={theme.workshop.sectionHeader}>
              <div className="w-6 h-6 rounded-md bg-[#eaddcf] border border-[#b89578] flex items-center justify-center text-[#734320]">
                <Gi.GiFactory size={16} />
              </div>
              <span>自動探索 稼働状況</span>
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
              <span>ロボットを派遣</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {(!state.autoDispatches || state.autoDispatches.length === 0) && (
            <div className="p-4 bg-[#fffdfa] rounded-xl border-2 border-dashed border-[#d2b89f] text-center flex flex-col items-center justify-center gap-2 shadow-2xs">
              <Gi.GiSleepy className="text-3xl text-[#b89578]" />
              <p className="text-xs text-[#6e4e37] font-bold">現在、自動探索中のロボットはいません</p>
              <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-3 py-1 bg-amber-700 hover:bg-amber-600 text-white font-bold">
                機体を派遣する
              </Button>
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
              const selectedEmotion = isResting ? 'troubled' : pending > 0 ? 'happy' : 'auto';
              const weather = dLoc ? engine.getLocationWeather(dLoc.id, Date.now()) : null;

              return (
                <div key={d.id} className={`p-3 rounded-xl border-2 shadow-2xs transition-all ${isResting ? 'bg-red-50/90 border-red-300 ring-1 ring-red-200' : pending > 0 ? 'bg-emerald-50/90 border-emerald-400 ring-1 ring-emerald-200' : 'bg-[#fffdfa] border-[#dcc5b0]'}`}>
                  {/* ロボット探索アニメーション */}
                  {dRobot && (
                    <div className="w-full bg-stone-900 rounded-lg overflow-hidden border-2 border-[#b89578] relative mb-2 shadow-2xs">
                      <RobotVisual 
                        robot={dRobot} 
                        size={40} 
                        containerWidth="100%"
                        containerHeight={90}
                        animateExploration={!isResting && pending === 0} 
                        emotion={selectedEmotion}
                        happyVariant="banzai"
                        hasPendingDrops={pending > 0 && !isResting}
                        locationId={d.locationId}
                        weatherType={weather?.type}
                        agility={dRobot.stats.agility}
                      />
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
                        {dRobot?.defenseRegen && dRobot.defenseRegen.expiresAt > Date.now() && (
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-300 px-1 rounded inline-flex items-center gap-0.5 font-bold" title="防衛リジェネ効果中: 1時間毎にHPが1回復">
                            <Gi.GiHealing size={11} className="text-emerald-600 animate-pulse" />
                            <span>リジェネ中({Math.max(1, Math.ceil((dRobot.defenseRegen.expiresAt - Date.now()) / (60 * 60 * 1000)))}h)</span>
                          </span>
                        )}
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
      </>
    )}

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
                      パワー: <span className="font-bold text-orange-600">{selectedModalRobot.stats.power}</span> / 速度: <span className="font-bold text-amber-600">{selectedModalRobot.stats.agility}</span> / 重量: <span className="font-bold text-stone-700">{selectedModalRobot.weight || 0}</span>
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
                    className="mb-2 font-bold text-xs sm:text-sm text-stone-700"
                  >
                    {lootResult.subtitle}
                  </motion.p>
                )}

                {/* 素材獲得を大歓喜するロボット演出 */}
                <div className="flex justify-center my-2">
                  <RobotVisual
                    robot={questRobot || state.robots[0]}
                    size={68}
                    emotion="happy"
                    happyVariant="banzai"
                    hasPendingDrops={true}
                    hideBackground={true}
                  />
                </div>
                
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
