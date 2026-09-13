import { BattleChestRewardService } from '../components/minigames/BattleChestRewardService';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GameState, AttributeColors, AttributeNames, Robot } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { MATERIALS, STORAGE_UPGRADE_COST, MAX_STORAGE_LEVELS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { RobotRadarChart, STAT_CONFIGS } from '../components/robot/RobotRadarChart';
import { RepairAnimationModal } from '../components/effects/RepairAnimationModal';
import { PartBaselineModal } from '../components/part/PartBaselineModal';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { RobotPart } from '../core/models';
import * as Gi from 'react-icons/gi';

export const StorageScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [tab, setTab] = useState<'robots'|'parts'|'materials'>('robots');
  const [confirmRobotId, setConfirmRobotId] = useState<string | null>(null);
  const [confirmPartId, setConfirmPartId] = useState<string | null>(null);
  const [activeTooltipRobotId, setActiveTooltipRobotId] = useState<string | null>(null);
  const [expandedRadarRobotId, setExpandedRadarRobotId] = useState<string | null>(null);
  const [repairingRobotState, setRepairingRobotState] = useState<{ robot: Robot; initialHp: number } | null>(null);
  const [recentlyRepairedRobotId, setRecentlyRepairedRobotId] = useState<string | null>(null);
  const [selectedBaselinePart, setSelectedBaselinePart] = useState<RobotPart | null>(null);
  const [now, setNow] = useState(Date.now());

  const [openingChest, setOpeningChest] = useState<string | null>(null);
  const [openedChestResult, setOpenedChestResult] = useState<any | null>(null);

  const handleOpenChest = (chestTier: string) => {
    if (engine.removeChest(chestTier, 1)) {
      setOpeningChest(chestTier);
      // Simulate opening delay
      setTimeout(() => {
        let result;
        // Depending on chestTier, roll something generic or combat
        // For simplicity, we just use rollCombatChest with different levels
        const level = chestTier === 'bronze' ? 2 : chestTier === 'silver' ? 4 : chestTier === 'gold' ? 6 : 8;
        result = BattleChestRewardService.rollCombatChest(level, '宝箱開封', 0);
        
        // Add items to engine
        if (result.gold > 0) engine.addGold(result.gold);
        if (result.elements > 0) engine.addBattleElements(result.elements);
        for (const mat of result.materials) {
          engine.addMaterial(mat.material.id, mat.count);
        }
        
        setOpeningChest(null);
        setOpenedChestResult(result);
      }, 1500);
    }
  };

  
  const disassemblyRef = useRef<HTMLDivElement>(null);
  const recycleRef = useRef<HTMLDivElement>(null);

  // Materials tab filtering
  const [matRarityFilter, setMatRarityFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [matAttributeFilter, setMatAttributeFilter] = useState<string>('All');
  const [matSearchQuery, setMatSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, []);

  const activeDisassembly = state.activeRobotDisassembly;
  const isDisassemblyDone = activeDisassembly ? activeDisassembly.endTime <= now : false;

  const activeRecycle = state.activePartRecycle;
  const isRecycleDone = activeRecycle ? activeRecycle.endTime <= now : false;

  const handleDisassembleRobot = (robotId: string) => {
    try {
      engine.disassembleRobot(robotId);
      setConfirmRobotId(null);
      setTimeout(() => {
        disassemblyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch(e: any) {
      alert(e.message);
    }
  };

  const handleRecyclePart = (partId: string) => {
    try {
      engine.recyclePart(partId);
      setConfirmPartId(null);
      setTimeout(() => {
        recycleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch(e: any) {
      alert(e.message);
    }
  };

  const handleRepairRobot = (robot: Robot) => {
    try {
      const initialHp = robot.currentHp ?? 0;
      engine.useRepairKit(robot.id);
      setRepairingRobotState({ robot, initialHp });
      setRecentlyRepairedRobotId(robot.id);
      setTimeout(() => {
        setRecentlyRepairedRobotId(prev => prev === robot.id ? null : prev);
      }, 2500);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const currentSizeIndex = MAX_STORAGE_LEVELS.indexOf(state.storageSize);
  const nextSize = MAX_STORAGE_LEVELS[currentSizeIndex + 1];
  const upgradeCost = STORAGE_UPGRADE_COST[currentSizeIndex + 1];

  const handleShare = (robotName: string) => {
    const text = `私が作ったポンコツロボット「${robotName}」を見てくれ！ #ポンコツロボット工房`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const ownedMaterialsList = useMemo(() => {
    return MATERIALS.filter(mat => {
      const count = state.materials[mat.id] || 0;
      if (count === 0) return false;
      if (matRarityFilter !== 'all' && mat.rarity !== matRarityFilter) return false;
      if (matAttributeFilter !== 'All' && mat.attribute !== matAttributeFilter) return false;
      if (matSearchQuery && !mat.name.toLowerCase().includes(matSearchQuery.toLowerCase())) return false;
      return true;
    });
  }, [state.materials, matRarityFilter, matAttributeFilter, matSearchQuery]);

  const totalMaterialsCount = useMemo(() => {
    return Object.values(state.materials || {}).reduce<number>((sum, count) => sum + (Number(count) || 0), 0);
  }, [state.materials]);

  const totalDistinctMaterials = useMemo(() => {
    return Object.values(state.materials || {}).filter(count => (Number(count) || 0) > 0).length;
  }, [state.materials]);

  return (
    <div className="space-y-4">
      <ScreenHeader
        icon={<Gi.GiCardboardBox size={16} />}
        title="工房倉庫・保管庫"
        rightElement={
          tab === 'robots' ? (
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              機体容量: <span className="text-amber-800 font-mono font-bold">{state.robots?.length}</span> / {state.storageSize}
            </span>
          ) : tab === 'materials' ? (
            <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              全素材: <span className="text-amber-800 font-mono font-bold">{totalMaterialsCount}</span>個
            </span>
          ) : undefined
        }
      />

      <div className="flex gap-2">
        <Button 
          variant={tab === 'robots' ? 'primary' : 'secondary'} 
          className="flex-1 relative" 
          onClick={() => setTab('robots')}
        >
          ロボット
          {activeDisassembly && (
            <span className={`absolute -top-1 -right-1 flex h-3 w-3 ${isDisassemblyDone ? 'animate-bounce' : 'animate-pulse'}`}>
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isDisassemblyDone ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isDisassemblyDone ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            </span>
          )}
        </Button>
        <Button 
          variant={tab === 'parts' ? 'primary' : 'secondary'} 
          className="flex-1 relative" 
          onClick={() => setTab('parts')}
        >
          パーツ
          {activeRecycle && (
            <span className={`absolute -top-1 -right-1 flex h-3 w-3 ${isRecycleDone ? 'animate-bounce' : 'animate-pulse'}`}>
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isRecycleDone ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isRecycleDone ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            </span>
          )}
        </Button>
        <Button 
          variant={tab === 'materials' ? 'primary' : 'secondary'} 
          className="flex-1" 
          onClick={() => setTab('materials')}
        >
          素材
        </Button>
      </div>

      {tab === 'robots' && (
        <>
          <div className="flex justify-between items-center mb-2 px-1 flex-wrap gap-2">
            <span className="font-bold text-stone-600">所有ロボット</span>
            <span className="font-bold text-green-700 bg-green-100 px-3 py-1 rounded border border-green-300 shadow-sm text-xs sm:text-sm whitespace-nowrap leading-none inline-flex items-center">
              <Gi.GiSpanner className="inline text-stone-500" /> 修理キット: {state.repairKits || 0} 個
            </span>
          </div>

          {activeDisassembly && (
            <div ref={disassemblyRef} className="scroll-mt-14">
              <Card className="bg-stone-50 border-2 border-rose-300 mb-4 p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700"><Gi.GiCog className="inline text-stone-500" />️ ロボット解体中...</span>
                    <span className="text-sm font-bold text-rose-600">{activeDisassembly.robotClone.name}</span>
                  </div>
                  {isDisassemblyDone ? (
                    <Badge className="bg-emerald-500 text-white animate-bounce text-xs px-2.5 py-1 leading-none font-bold">解体完了！</Badge>
                  ) : (
                    <Badge className="bg-blue-600 text-white font-mono text-xs px-2.5 py-1 leading-none font-bold">
                      あと {Math.ceil(Math.max(0, activeDisassembly.endTime - now) / 1000)}秒
                    </Badge>
                  )}
                </div>
                
                {!isDisassemblyDone ? (
                  <div className="space-y-2 mb-1">
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden relative z-10">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-100"
                        style={{ width: `${Math.min(100, Math.max(0, 100 - ((activeDisassembly.endTime - now) / activeDisassembly.durationMs * 100)))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 text-right font-mono">
                      解体中: 頭部・胴体・腕部・脚部パーツに分解しています...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mt-3 pt-3 border-t border-rose-100">
                    <div className="text-xs font-bold text-stone-700">獲得パーツ（全4パーツ）：</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeDisassembly.resultParts.map((p, i) => {
                        const typeLabels: Record<string, string> = {
                          head: '頭部',
                          body: '胴体',
                          arms: '腕部',
                          legs: '脚部',
                        };
                        return (
                          <div key={i} className="flex items-center gap-2 bg-stone-100/90 p-2 rounded-lg border border-stone-200 shadow-xs">
                            <div className="shrink-0 bg-white p-1 rounded border border-stone-200 flex items-center justify-center">
                              <PartVisual part={p} size={36} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded leading-none">
                                  {typeLabels[p.type] || p.type}
                                </span>
                                <span className="text-[10px] font-bold" style={{ color: AttributeColors[p.attribute] }}>
                                  {AttributeNames[p.attribute]}
                                </span>
                              </div>
                              <div className="text-xs font-bold text-stone-800 break-words leading-tight">
                                {p.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button 
                        size="sm" 
                        variant="success" 
                        onClick={() => {
                          try {
                            engine.claimRobotDisassembly();
                          } catch(e: any) {
                            alert(e.message);
                          }
                        }}
                      >
                        パーツを受け取る
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {nextSize && (
            <Card className="flex justify-between items-center bg-stone-100">
              <div>
                <p className="font-bold">倉庫を拡張する</p>
                <p className="text-sm text-stone-600">最大容量: {nextSize}</p>
              </div>
              <Button 
                size="sm" 
                disabled={state.gold < upgradeCost}
                onClick={() => {
                  try { engine.upgradeStorage(upgradeCost, nextSize); } 
                  catch(e: any) { alert(e.message); }
                }}
              >
                {upgradeCost} G
              </Button>
            </Card>
          )}

          {state.robots?.length === 0 ? (
            <p className="text-center text-stone-500 py-8">ロボットがいません</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.robots.map((r, idx) => {
                const isAutoDispatched = state.autoDispatches?.some(d => d.robotId === r.id);
                const isQuesting = state.activeQuest?.dispatchedRobotId === r.id;
                const isRadarExpanded = expandedRadarRobotId === r.id;

                const isRecentlyRepaired = recentlyRepairedRobotId === r.id;
                const isRegenActive = !!(r.defenseRegen && r.defenseRegen.expiresAt > now);
                const hpPercent = Math.max(0, Math.min(100, ((r.currentHp ?? 12) / (r.maxHp ?? 12)) * 100));
                const isHpLow = (r.currentHp ?? 12) <= 1;

                return (
                  <Card 
                    key={`${r.id}-${idx}`} 
                    className={`relative p-4 transition-all duration-300 ${
                      activeTooltipRobotId === r.id ? 'z-40' : 'z-10'
                    } ${
                      isRecentlyRepaired 
                        ? 'ring-2 ring-emerald-400 bg-emerald-50/40 shadow-lg' 
                        : isHpLow 
                        ? 'border-rose-300 bg-rose-50/30' 
                        : ''
                    }`}
                  >
                    {/* 最近修理された場合のエフェクトオーバーレイ */}
                    {isRecentlyRepaired && (
                      <div className="absolute top-2 right-2 pointer-events-none z-10 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-bounce">
                        <span>✨</span>
                        <span>HP MAX 回復!</span>
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className={theme.typography.h3}>{r.name}</h3>
                          {isQuesting && (
                            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                              遠征中
                            </span>
                          )}
                          {isAutoDispatched && (
                            <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold border border-purple-200">
                              自動探索中
                            </span>
                          )}
                          {isHpLow && !isRecentlyRepaired && (
                            <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                              HP切れ
                            </span>
                          )}
                          {r.defenseRegen && r.defenseRegen.expiresAt > now && (
                            <span 
                              className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300 flex items-center gap-1 shadow-xs"
                              title="防衛戦勝利ボーナス: 12時間の間、1時間毎にHPが1ずつ自然回復します"
                            >
                              <Gi.GiHealing className="text-emerald-600 animate-pulse text-xs" />
                              <span>リジェネ中 ({Math.max(1, Math.ceil((r.defenseRegen.expiresAt - now) / (60 * 60 * 1000)))}h)</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-stone-700 flex items-center gap-1">
                              <span>残HP:</span>
                              <span className={isHpLow ? 'text-rose-600 font-bold' : isRecentlyRepaired ? 'text-emerald-600 font-bold' : 'text-stone-800'}>
                                {r.currentHp ?? 12}/{r.maxHp ?? 12}
                              </span>
                            </span>
                            {state.repairKits && state.repairKits > 0 ? (
                              <button
                                onClick={() => handleRepairRobot(r)}
                                disabled={(r.currentHp ?? 12) >= (r.maxHp ?? 12)}
                                className={`text-[10px] px-2 py-0.8 rounded border font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                  (r.currentHp ?? 12) < (r.maxHp ?? 12)
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs active:scale-95'
                                    : 'bg-stone-100 text-stone-400 border-stone-300'
                                }`}
                                title="修理キットを使ってHPを全快にします"
                              >
                                <span><Gi.GiSpanner className="inline text-stone-500" /></span>
                                <span>修理キット使用</span>
                              </button>
                            ) : (
                              (r.currentHp ?? 12) < (r.maxHp ?? 12) && (
                                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  修理キット不足
                                </span>
                              )
                            )}
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                isRecentlyRepaired
                                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                                  : isHpLow
                                  ? 'bg-rose-500'
                                  : isRegenActive
                                  ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                  : 'bg-green-500'
                              }`} 
                              style={{ width: `${hpPercent}%` }} 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 text-xs text-stone-600 font-mono">
                          <span>Vit: {r.stats.hp}</span>
                          <span>Pow: {r.stats.power}</span>
                          <span>Def: {r.stats.defense}</span>
                          <span>Agi: {r.stats.agility}</span>
                          <span>Dex: {r.stats.dexterity}</span>
                          <span>Int: {r.stats.intelligence}</span>
                        </div>
                        {r.battleStats && r.battleStats.matches > 0 && (
                          <div className="mt-2 text-[10px] font-bold text-stone-600 bg-stone-100 p-1.5 rounded border border-stone-200">
                            戦績: {r.battleStats.matches}戦 {r.battleStats.wins}勝 {r.battleStats.losses}敗 {r.battleStats.draws}分 
                            (勝率: {Math.round(r.battleStats.wins / r.battleStats.matches * 100)}%)
                          </div>
                        )}

                        {/* アクションボタン群 */}
                        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setExpandedRadarRobotId(isRadarExpanded ? null : r.id)}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded border transition cursor-pointer ${
                              isRadarExpanded
                                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                            }`}
                          >
                            <span><Gi.GiChart className="inline text-stone-500" /></span>
                            <span>{isRadarExpanded ? 'レーダー閉じる' : 'レーダー'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShare(r.name)}
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded border border-stone-300 transition cursor-pointer"
                          >
                            <span>𝕏</span>
                            <span>シェア</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-shrink-0 relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltipRobotId(activeTooltipRobotId === r.id ? null : r.id);
                          }}
                          className={`block bg-stone-50 p-1.5 rounded-lg border-2 transition text-left cursor-pointer group relative ${
                            activeTooltipRobotId === r.id 
                              ? 'border-sky-500 shadow-md ring-2 ring-sky-200' 
                              : 'border-stone-200 hover:border-amber-400 hover:shadow-sm'
                          }`}
                          title="タップして構成パーツと分解展開図を確認"
                        >
                          <RobotVisual robot={r} size={84} />
                          <div className="absolute bottom-1 right-1 bg-stone-900/80 text-[9px] text-white px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 shadow-xs group-hover:bg-amber-600 transition-colors">
                            <span><Gi.GiMagnifyingGlass className="inline text-stone-500" /></span>
                            <span className="hidden sm:inline">パーツ</span>
                          </div>
                        </button>

                        {/* 構成パーツ & 属性ツールチップ (Bright Theme) */}
                        {activeTooltipRobotId === r.id && (
                          <div 
                            className="absolute right-0 top-full mt-2 w-76 sm:w-88 bg-white text-stone-800 p-3 rounded-xl shadow-2xl border-2 border-sky-300 z-30 animate-in fade-in zoom-in-95 duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* 吹き出しの三角矢印 */}
                            <div className="absolute -top-2 right-6 w-3 h-3 bg-white border-t-2 border-l-2 border-sky-300 transform rotate-45" />

                            <div className="flex justify-between items-center border-b border-stone-200 pb-1.5 mb-2 relative z-10">
                              <span className="font-bold text-xs text-sky-950 flex items-center gap-1">
                                <Gi.GiPuzzle className="text-sky-600 inline" />
                                <span>構成パーツ分解展開図</span>
                              </span>
                              <button 
                                onClick={() => setActiveTooltipRobotId(null)}
                                className="text-stone-400 hover:text-stone-700 font-bold text-xs p-1 leading-none rounded hover:bg-stone-100 transition"
                              >
                                ✕
                              </button>
                            </div>

                            {/* 分解展開図プレビュー (大きく見切れずにゆったり表示) */}
                            <div className="flex justify-center items-center py-4 mb-2.5 bg-gradient-to-b from-sky-50/90 to-blue-50/50 rounded-xl border-2 border-sky-200 shadow-inner relative overflow-visible">
                              <RobotVisual 
                                robot={r} 
                                size={135} 
                                containerWidth={240} 
                                containerHeight={175} 
                                isExplodedView={true} 
                                hideBubble={true} 
                              />
                            </div>

                            <div className="space-y-2 relative z-10">
                              {[
                                { key: 'head', label: '頭部', part: r.parts.head },
                                { key: 'body', label: '胴体', part: r.parts.body },
                                { key: 'arms', label: '腕部', part: r.parts.arms },
                                { key: 'legs', label: '脚部', part: r.parts.legs },
                              ].map(({ key, label, part }) => {
                                if (!part) return null;
                                const attrColor = AttributeColors[part.attribute];
                                const attrName = AttributeNames[part.attribute];
                                return (
                                  <div 
                                    key={key} 
                                    className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200 shadow-2xs"
                                  >
                                    <div className="shrink-0 bg-stone-100 p-1 rounded border border-stone-200 flex items-center justify-center">
                                      <PartVisual part={part} size={36} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <span className="text-[10px] font-bold text-stone-600 bg-stone-200 px-1.5 py-0.2 rounded">
                                          {label}
                                        </span>
                                        <span 
                                          className="text-[10px] px-1.5 py-0.2 rounded font-bold text-white leading-none shadow-2xs"
                                          style={{ backgroundColor: attrColor }}
                                        >
                                          {attrName}属性
                                        </span>
                                      </div>
                                      <div className="text-xs font-bold text-stone-800 truncate">
                                        {part.name}
                                      </div>
                                      <div className="text-[10px] text-stone-500 font-mono mt-0.5 flex flex-wrap gap-x-2 gap-y-1">
                                        <span>HP:{part.stats.hp}</span>
                                        <span>Pow:{part.stats.power}</span>
                                        <span>Def:{part.stats.defense}</span>
                                        <span>Agi:{part.stats.agility}</span>
                                        <span>Dex:{part.stats.dexterity}</span>
                                        <span>Int:{part.stats.intelligence}</span>
                                      </div>
                                      <div className="flex items-center justify-end mt-1 pt-1 border-t border-stone-200">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedBaselinePart(part);
                                          }}
                                          className="text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-0.5 transition-colors cursor-pointer"
                                        >
                                          <Gi.GiChart className="text-amber-600" /> 差分グラフ
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="mt-2.5 pt-1.5 border-t border-stone-200 text-[10px] text-stone-500 text-center relative z-10">
                              ※画像を再タップまたは✕で閉じます
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* レーダーチャート展開表示 (Bright Theme) */}
                    {isRadarExpanded && (
                      <div className="mt-3 pt-3 border-t border-stone-200 bg-stone-50 text-stone-800 p-3 rounded-lg border border-stone-200 animate-in fade-in zoom-in-95 duration-150 shadow-inner">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                            <span><Gi.GiChart className="inline text-stone-500" /></span> {r.name} のステータス特性
                          </span>
                          <button
                            onClick={() => setExpandedRadarRobotId(null)}
                            className="text-stone-400 hover:text-stone-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-stone-200"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                          <RobotRadarChart robot={r} size={160} themeStyle="light" />
                          <div className="w-full grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-rose-600 font-bold block">❤️ HP: {r.stats.hp}</span>
                              <span className="text-stone-500 text-[9px]">耐久力</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-orange-600 font-bold block"><Gi.GiBroadsword className="inline text-red-500" />️ POW: {r.stats.power}</span>
                              <span className="text-stone-500 text-[9px]">攻撃力(ドロップ枠)</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-blue-600 font-bold block"><Gi.GiShield className="inline text-blue-500" />️ DEF: {r.stats.defense}</span>
                              <span className="text-stone-500 text-[9px]">防御力</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-yellow-600 font-bold block"><Gi.GiLightningTrio className="inline text-yellow-500" /> AGI: {r.stats.agility}</span>
                              <span className="text-stone-500 text-[9px]">速度(時間短縮)</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-emerald-600 font-bold block"><Gi.GiBullseye className="inline text-green-500" /> DEX: {r.stats.dexterity}</span>
                              <span className="text-stone-500 text-[9px]">探索力(レア発見)</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-stone-200">
                              <span className="text-purple-600 font-bold block"><Gi.GiCrystalBall className="inline text-purple-500" /> INT: {r.stats.intelligence}</span>
                              <span className="text-stone-500 text-[9px]">解析力(幸運値)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-stone-200 flex flex-col gap-2">
                      {confirmRobotId === r.id ? (
                        <>
                          <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded border border-rose-200">
                            ※解体すると頭・胴・腕・脚の4パーツに分解されます（所要時間：30秒）
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setConfirmRobotId(null)}>キャンセル</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDisassembleRobot(r.id)}>解体実行</Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant="danger" 
                            disabled={isQuesting || isAutoDispatched || !!activeDisassembly}
                            onClick={() => setConfirmRobotId(r.id)}
                          >
                            {isQuesting || isAutoDispatched ? '出撃中のため解体不可' : activeDisassembly ? '解体進行中のため不可' : '解体する'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'parts' && (
        <>
          {activeRecycle && (
            <div ref={recycleRef} className="scroll-mt-14">
              <Card className="bg-stone-50 border-2 border-amber-300 mb-4 p-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-700"><Gi.GiRecycle className="inline text-emerald-500" />️ パーツ還元中...</span>
                    <span className="text-sm font-bold text-amber-700">{activeRecycle.partClone.name}</span>
                  </div>
                  {isRecycleDone ? (
                    <Badge className="bg-emerald-500 text-white animate-bounce text-xs px-2.5 py-1 leading-none font-bold">還元完了！</Badge>
                  ) : (
                    <Badge className="bg-blue-600 text-white font-mono text-xs px-2.5 py-1 leading-none font-bold">
                      あと {Math.ceil(Math.max(0, activeRecycle.endTime - now) / 1000)}秒
                    </Badge>
                  )}
                </div>
                
                {!isRecycleDone ? (
                  <div className="space-y-2 mb-1">
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden relative z-10">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-100"
                        style={{ width: `${Math.min(100, Math.max(0, 100 - ((activeRecycle.endTime - now) / activeRecycle.durationMs * 100)))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 text-right font-mono">
                      素材抽出中: メイン素材2個に還元しています...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mt-3 pt-3 border-t border-amber-100">
                    <div className="text-xs font-bold text-stone-700">獲得素材：</div>
                    <div className="flex flex-wrap gap-2">
                      {activeRecycle.resultMaterials.map((m, i) => {
                        const matDef = MATERIALS.find(def => def.id === m.materialId);
                        return (
                          <div key={i} className="flex items-center gap-2 bg-stone-100 p-2 rounded-lg border border-stone-300 shadow-xs">
                            {matDef ? <MaterialIcon materialId={matDef.id} /> : null}
                            <span className="text-xs font-bold text-stone-800">{matDef ? matDef.name : '素材'}</span>
                            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              x{m.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button 
                        size="sm" 
                        variant="success" 
                        onClick={() => {
                          try {
                            engine.claimPartRecycle();
                          } catch(e: any) {
                            alert(e.message);
                          }
                        }}
                      >
                        素材を受け取る
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {state.parts?.length === 0 ? (
              <p className="text-stone-500 col-span-full">パーツがありません</p>
            ) : (
            state.parts.map((p, idx) => (
              <Card key={`${p.id}-${idx}`} className="p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] text-stone-500">属性: {p.attribute}</p>
                    <div className="mt-1 text-[10px] text-stone-600 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>HP: {p.stats.hp}</span>
                      <span>Pow: {p.stats.power}</span>
                      <span>Def: {p.stats.defense}</span>
                      <span>Agi: {p.stats.agility}</span>
                      <span>Dex: {p.stats.dexterity}</span>
                      <span>Int: {p.stats.intelligence}</span>
                    </div>
                  </div>
                  <div className="bg-stone-100 rounded-md p-1 border border-stone-200">
                    <PartVisual part={p} size={48} />
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {confirmPartId === p.id ? (
                    <>
                      <div className="text-[10px] sm:text-xs text-rose-600 font-bold bg-rose-50 p-1.5 sm:p-2 rounded border border-rose-200 leading-tight">
                        ※還元するとメイン素材2個に戻ります（所要時間：10秒）
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setConfirmPartId(null)}>やめる</Button>
                        <Button size="sm" variant="danger" onClick={() => handleRecyclePart(p.id)}>還元する</Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center gap-1.5 flex-wrap pt-1 border-t border-stone-200/80">
                      <button
                        onClick={() => setSelectedBaselinePart(p)}
                        className="text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md border border-amber-200 flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                        title="基準値との差分グラフを確認"
                      >
                        <Gi.GiChart className="text-amber-600 text-xs" />
                        <span>基準値比較</span>
                      </button>
                      <Button size="sm" variant="danger" disabled={!!activeRecycle} onClick={() => setConfirmPartId(p.id)}>
                        {activeRecycle ? '還元中' : '素材に戻す'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
        </>
      )}

      
      {tab === 'materials' && (
        <div className="space-y-4">
          {/* Unopened Chests Section */}
          {state.unopenedChests && Object.keys(state.unopenedChests).some(k => (state.unopenedChests![k] || 0) > 0) && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                <Gi.GiChest className="mr-2 text-xl" />
                未開封の宝箱
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(state.unopenedChests).filter(([_, count]) => Number(count) > 0).map(([tier, count]) => (
                  <Card key={tier} className="p-3 flex flex-col items-center justify-center text-center bg-white">
                    <Gi.GiChest className={`text-4xl mb-2 ${tier === 'mythic' ? 'text-purple-500' : tier === 'gold' ? 'text-yellow-500' : tier === 'silver' ? 'text-gray-400' : 'text-amber-700'}`} />
                    <span className="text-xs font-bold text-stone-700 mb-1">
                      {tier === 'mythic' ? '神話の宝箱' : tier === 'gold' ? '金の宝箱' : tier === 'silver' ? '銀の宝箱' : '銅の宝箱'}
                    </span>
                    <Badge variant="secondary" className="mb-2">所持: {count}</Badge>
                    <Button size="sm" onClick={() => handleOpenChest(tier)} disabled={!!openingChest}>
                      開封する
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Summary & Filters Header */}
          <div className="bg-stone-100 p-3 rounded-lg border border-stone-300 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="font-bold text-xs sm:text-sm text-stone-700">
                所持素材: <strong className="text-amber-700">{totalMaterialsCount}</strong> 個 ({totalDistinctMaterials} 種類)
              </span>
              
              {/* Rarity filter tabs */}
              <div className="flex gap-1 items-center">
                <span className="text-xs text-stone-500 font-bold mr-1">レア度:</span>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 'all' ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter('all')}
                  className="px-2 py-1 text-xs"
                >
                  すべて
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 1 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(1)}
                  className="px-2 py-1 text-xs"
                >
                  ★1
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 2 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(2)}
                  className="px-2 py-1 text-xs"
                >
                  ★2
                </Button>
                <Button 
                  size="sm" 
                  variant={matRarityFilter === 3 ? 'primary' : 'secondary'} 
                  onClick={() => setMatRarityFilter(3)}
                  className="px-2 py-1 text-xs"
                >
                  ★3
                </Button>
              </div>
            </div>

            {/* Attribute & Search */}
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between pt-2 border-t border-stone-200">
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-xs text-stone-500 font-bold mr-1">属性:</span>
                <button
                  onClick={() => setMatAttributeFilter('All')}
                  className={`px-2 py-0.5 text-xs rounded border ${matAttributeFilter === 'All' ? 'bg-stone-800 text-white border-stone-800 font-bold' : 'bg-white text-stone-700 border-stone-300'}`}
                >
                  すべて
                </button>
                {Object.keys(AttributeNames).map(attr => {
                  const isSelected = matAttributeFilter === attr;
                  return (
                    <button
                      key={attr}
                      onClick={() => setMatAttributeFilter(attr)}
                      className={`px-2 py-0.5 text-xs rounded border transition-colors ${isSelected ? 'font-bold text-white shadow-xs' : 'bg-white text-stone-700 border-stone-300'}`}
                      style={isSelected ? { backgroundColor: AttributeColors[attr as keyof typeof AttributeColors], borderColor: AttributeColors[attr as keyof typeof AttributeColors] } : {}}
                    >
                      {AttributeNames[attr as keyof typeof AttributeNames]}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="素材名で絞り込み..."
                value={matSearchQuery}
                onChange={e => setMatSearchQuery(e.target.value)}
                className="p-1.5 text-xs border border-stone-300 rounded bg-white w-full sm:w-44"
              />
            </div>
          </div>

          {/* Materials Grid */}
          {ownedMaterialsList.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-lg border border-stone-200 text-stone-500">
              <p className="font-bold text-sm">該当する所持素材がありません</p>
              <p className="text-xs mt-1 text-stone-400">「遠征」や「自動探索」で素材を集めましょう！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {ownedMaterialsList.map(mat => {
                const count = state.materials[mat.id] || 0;
                const rarityStyle = theme.rarity[mat.rarity];
                const attrColor = AttributeColors[mat.attribute];
                const attrName = AttributeNames[mat.attribute];

                return (
                  <div 
                    key={mat.id} 
                    className={`relative p-2 flex flex-col items-center justify-between rounded-lg border-2 ${rarityStyle.border} ${rarityStyle.bg} transition-shadow hover:shadow-md overflow-hidden hover:-translate-y-0.5 transform duration-200`}
                  >
                    <div className="absolute top-1.5 left-1.5 text-[9px] leading-none drop-shadow-sm">{rarityStyle.stars}</div>
                    <Badge className="absolute top-1.5 right-1.5 bg-stone-900/90 text-white font-bold text-[9px] px-1 py-0.5 leading-none font-mono z-10 shadow-sm border border-stone-600">x{count}</Badge>

                    <div className={`mt-3 mb-1 drop-shadow-md`} style={{ color: attrColor }}>
                      <MaterialIcon materialId={mat.id} size={36} />
                    </div>
                    
                    <span className={`text-[10px] font-bold text-center leading-tight w-full truncate ${rarityStyle.text}`}>
                      {mat.name}
                    </span>
                    <span className="text-[8px] font-bold mt-0.5 mb-1 px-1 rounded shadow-2xs" style={{ backgroundColor: attrColor, color: '#fff' }}>
                      {attrName}
                    </span>

                    <div className="w-full mt-1 pt-1 border-t border-stone-200/50 grid grid-cols-2 gap-x-1 gap-y-0.5 text-[8px] sm:text-[9px] text-stone-600 font-mono text-center leading-none">
                      <span>HP +{mat.baseStats.hp}</span>
                      <span>PW +{mat.baseStats.power}</span>
                      <span>DF +{mat.baseStats.defense}</span>
                      <span>AG +{mat.baseStats.agility}</span>
                      <span>DX +{mat.baseStats.dexterity}</span>
                      <span>IN +{mat.baseStats.intelligence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* ロボット修理演出モーダル */}
      {repairingRobotState && (
        <RepairAnimationModal
          robot={repairingRobotState.robot}
          initialHp={repairingRobotState.initialHp}
          onClose={() => setRepairingRobotState(null)}
        />
      )}
      {/* パーツ基準値比較グラフモーダル */}

      {/* Chest Opening Modal */}
      {(openingChest || openedChestResult) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-stone-50 border-4 border-stone-300 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300 shadow-2xl relative overflow-hidden">
            {openingChest ? (
              <div className="flex flex-col items-center py-8">
                <Gi.GiChest className="text-6xl text-amber-500 animate-bounce mb-4" />
                <h3 className="text-xl font-bold text-stone-800">宝箱を開封中...</h3>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-transparent opacity-50 pointer-events-none"></div>
                <Gi.GiOpenTreasureChest className="text-7xl text-amber-500 mb-2 drop-shadow-lg" />
                <h3 className="text-2xl font-bold text-amber-700 mb-6 relative z-10 drop-shadow-sm">開封結果</h3>
                <div className="w-full space-y-3 relative z-10 mb-6">
                  {openedChestResult.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center p-3 rounded-xl bg-white border border-stone-200 shadow-sm gap-4 transform transition-all hover:scale-105">
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg">
                        {item.type === 'gold' && <Gi.GiCoins className="text-3xl text-yellow-500" />}
                        {item.type === 'element' && <Gi.GiCrystalGrowth className="text-3xl text-cyan-500" />}
                        {item.type === 'material' && <MaterialIcon attribute={item.material?.attribute || 'Earth'} className="text-3xl" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-stone-500">{item.desc}</p>
                        <p className="text-sm font-bold text-stone-800">{item.name}</p>
                      </div>
                      <div className="text-lg font-bold text-amber-600">
                        x{item.count}
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => setOpenedChestResult(null)} className="w-full font-bold shadow-md relative z-10">
                  閉じる
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedBaselinePart && (
        <PartBaselineModal
          part={selectedBaselinePart}
          onClose={() => setSelectedBaselinePart(null)}
        />
      )}
    </div>
  );
};
