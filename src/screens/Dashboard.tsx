import React, { useState } from 'react';
import { GameState } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual } from '../components/robot/RobotVisual';
import { theme } from '../styles/theme';
import { LOCATIONS, MATERIALS } from '../core/data';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

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
        title: '🎉 遠征成功！',
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
          title: '🤖 素材回収！',
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
          title: '🤖 一括回収完了！',
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
          title: '🤖 帰還・素材回収！',
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
      {/* 統合ダッシュボードカード (Unified Workshop Dashboard) */}
      <Card className="bg-white border-2 border-stone-200/90 shadow-sm p-3.5 sm:p-5">
        {/* 上部ステータスバー (アイコン中心・直感的デザイン) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-amber-100/90 rounded-lg shrink-0">💰</span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-800/80 uppercase tracking-wider block">所持金</span>
              <span className="text-base sm:text-lg font-black text-amber-700 font-mono truncate block leading-tight">{state.gold} G</span>
            </div>
          </div>

          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-blue-100/90 rounded-lg shrink-0">🤖</span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-blue-800/80 uppercase tracking-wider block">ロボット倉庫</span>
              <span className="text-base sm:text-lg font-black text-blue-900 font-mono truncate block leading-tight">
                {state.robots?.length} <span className="text-xs font-normal text-stone-500">/ {state.storageSize}</span>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-emerald-100/90 rounded-lg shrink-0">🏆</span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-emerald-800/80 uppercase tracking-wider block">納品実績</span>
              <span className="text-base sm:text-lg font-black text-emerald-800 font-mono truncate block leading-tight">{state.deliveredRobotsCount} 体</span>
            </div>
          </div>

          <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
            <span className="text-2xl p-1.5 bg-purple-100/90 rounded-lg shrink-0">🔧</span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-purple-800/80 uppercase tracking-wider block">修理キット</span>
              <span className="text-base sm:text-lg font-black text-purple-800 font-mono truncate block leading-tight">{state.repairKits ?? 0} 個</span>
            </div>
          </div>
        </div>

        {/* 出撃・探索ヘッダー */}
        <div className="border-t border-stone-200/80 pt-3.5 mb-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-black text-stone-800 text-sm sm:text-base">
              <span>📡</span>
              <span>出撃・探索状況</span>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {totalAutoPendingDrops > 0 && (
              <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="animate-pulse text-xs px-2.5 py-1 font-bold shadow-xs">
                📦 全回収 ({totalAutoPendingDrops})
              </Button>
            )}
            <Button size="sm" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white font-bold">
              ＋ 自動探索
            </Button>
          </div>
        </div>

        {/* 出撃中のアクティビティリスト */}
        {!hasActiveMission ? (
          <div className="p-4 bg-stone-50/80 rounded-xl border border-dashed border-stone-300 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🏕️</span>
            <p className="text-xs text-stone-500 font-bold">現在、出撃中のロボットはいません</p>
            <div className="flex gap-2 mt-1">
              <Button size="sm" onClick={() => onNavigate('quest')} className="text-xs px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white">
                🎒 遠征へ出発
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsDispatchModalOpen(true)} className="text-xs px-3 py-1">
                🤖 自動探索へ派遣
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* 通常遠征 (Quest) */}
            {state.activeQuest ? (
              <div className={`p-3 rounded-xl border transition-all ${questDone ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200' : 'bg-stone-50/90 border-amber-200'}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1 bg-amber-100/80 rounded-lg border border-amber-200 shrink-0">
                      {questRobot ? (
                        <RobotVisual robot={questRobot} size={36} />
                      ) : (
                        <span className="text-xl">🎒</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded shrink-0">通常遠征</span>
                        <span className="font-bold text-xs sm:text-sm text-stone-800 truncate">📍 {activeQuestLoc?.name}</span>
                        {questDone && (
                          <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full animate-bounce shrink-0">
                            完了！
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        同行: <span className="font-bold text-stone-700">{questRobot ? questRobot.name : 'なし'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 ml-auto sm:ml-0">
                    {questDone ? (
                      <Button size="sm" variant="success" onClick={handleCompleteQuest} className="animate-bounce shadow-xs font-bold text-xs px-3 py-1.5">
                        🎁 素材を受取る
                      </Button>
                    ) : (
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block font-mono">残り時間</span>
                        <span className="text-xs sm:text-sm font-bold font-mono text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
                          ⏳ {formatTime(timeRemaining)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-2.5 bg-stone-50/60 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎒</span>
                  <span className="text-xs text-stone-600 font-bold">通常遠征: 未出撃</span>
                </div>
                <Button size="sm" onClick={() => onNavigate('quest')} className="text-xs px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold">
                  遠征へ向かう →
                </Button>
              </div>
            )}

            {/* 自動探索ロボット一覧 (Auto Dispatches) */}
            {state.autoDispatches?.map(d => {
              const dRobot = state.robots.find(r => r.id === d.robotId);
              const dLoc = LOCATIONS.find(l => l.id === d.locationId);
              const intervalMs = engine.getAutoDispatchIntervalMs(d.robotId);
              const nextTime = d.lastCollectedAt + intervalMs;
              const remain = Math.max(0, nextTime - Date.now());
              const pending = d.pendingDrops?.length || 0;
              const isResting = (dRobot?.currentHp ?? 12) <= 1;
              const selectedEmotion = isResting ? 'troubled' : (previewEmotions[d.id] || 'auto');
              const weather = dLoc ? engine.getLocationWeather(dLoc.id, Date.now()) : null;

              return (
                <div key={d.id} className={`p-3 rounded-xl border transition-all ${isResting ? 'bg-red-50/50 border-red-300 ring-1 ring-red-200' : pending > 0 ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200' : 'bg-stone-50/90 border-stone-200'}`}>
                  {/* ロボット探索アニメーション（コンパクト） */}
                  {dRobot && (
                    <div className="w-full bg-stone-900 rounded-lg overflow-hidden border border-stone-300 relative mb-2">
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
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-stone-900/80 p-0.5 rounded border border-stone-700/60 z-20">
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'auto' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors ${selectedEmotion === 'auto' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          自動
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'happy' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors ${selectedEmotion === 'happy' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          ✨発見
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [d.id]: 'troubled' }))}
                          className={`text-[9px] px-1 py-0.2 rounded font-bold transition-colors ${selectedEmotion === 'troubled' ? 'bg-blue-600 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                        >
                          💦困り
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded">自動探索</span>
                        <span className="font-bold text-xs sm:text-sm text-stone-800">{dRobot?.name || 'ロボット'}</span>
                        <span className="text-[11px] text-stone-500">📍 {dLoc?.name}</span>
                        {weather && (
                          <span className="flex items-center gap-1 text-[10px] bg-sky-100 text-sky-800 border border-sky-200 px-1 rounded cursor-help" title={weather.description}>
                            {weather.name}
                            <span className={`px-0.5 rounded text-[8px] ${weather.timeMultiplier > 1 ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'}`}>
                              x{weather.timeMultiplier.toFixed(1)}
                            </span>
                          </span>
                        )}
                        <span className="text-[10px] text-red-600 font-mono bg-red-50 border border-red-200 px-1 rounded">
                          ❤️ {dRobot?.currentHp ?? 12}/{dRobot?.maxHp ?? 12}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 font-mono">
                        <span>⏳ 次回: {formatTime(remain)}</span>
                        {dRobot && dRobot.stats.agility > 0 && (
                          <span className="text-blue-600 bg-blue-50 px-1 rounded border border-blue-200">
                            ⚡ -{dRobot.stats.agility}s
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                      {pending > 0 ? (
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => handleClaimAutoDispatch(d.id)}
                          className="text-xs px-2.5 py-1 font-bold shadow-xs animate-pulse"
                        >
                          📦 回収 ({pending})
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          disabled={true}
                          className="text-xs px-2 py-1 opacity-60"
                        >
                          待機中
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
        )}
      </Card>

      {/* Tutorial Banner */}
      {state.tutorialStep < 5 && (
        <Card className="bg-blue-50 border-2 border-blue-300 text-blue-900 p-3">
          <h3 className="font-black text-xs sm:text-sm text-blue-900 flex items-center gap-1.5">
            <span>💡</span>
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
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-xs p-3">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
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
                    <Badge className="bg-emerald-500 text-white text-[10px] whitespace-nowrap animate-bounce leading-none">
                      🎉 完成！
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
        <Card className="border-2 border-blue-200 bg-blue-50/50 p-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-black text-xs sm:text-sm text-stone-800 flex items-center gap-1">
              <span>📋</span>
              <span>受諾中の依頼: {state.currentRequest.clientName}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
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
        className="bg-gradient-to-r from-amber-50 via-orange-50/90 to-amber-100/80 border-2 border-amber-400 hover:border-amber-500 rounded-xl px-3.5 py-2.5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-lg shadow-xs border border-amber-300 shrink-0 group-hover:scale-105 transition-transform">
            🏪
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xs sm:text-sm text-amber-950 truncate">
                素材商店・交換所
              </h3>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded border border-amber-300 hidden sm:inline whitespace-nowrap">
                素材売買・修理キット
              </span>
            </div>
            <p className="text-[11px] text-stone-600 truncate mt-0.5">
              素材の購入/売却 ｜ 修理キット交換 ｜ 内装変更
            </p>
          </div>
        </div>
        <span className="text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all text-sm shrink-0 font-bold">
          ›
        </span>
      </div>

      {/* Information & Archive Utility Menu (図鑑・仕様書) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('encyclopedia')}
          className="flex items-center gap-2 p-2.5 bg-stone-100/90 hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="text-xl p-1 bg-white rounded-md border border-stone-200 shadow-2xs group-hover:scale-110 transition-transform">📖</span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-stone-800">
              図鑑・実績
            </div>
            <div className="text-[10px] text-stone-500 truncate">納品履歴 / パーツ詳細</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('litepaper')}
          className="flex items-center gap-2 p-2.5 bg-stone-100/90 hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="text-xl p-1 bg-white rounded-md border border-stone-200 shadow-2xs group-hover:scale-110 transition-transform">📜</span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-stone-800">
              仕様書
            </div>
            <div className="text-[10px] text-stone-500 truncate">工房ルール / ガイド</div>
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
              <div className="mb-4 p-2.5 bg-white rounded border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-stone-800">{selectedModalRobot.name}</p>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    パワー: <span className="font-bold">{selectedModalRobot.stats.power}</span> / 敏捷: <span className="font-bold text-blue-600">{selectedModalRobot.stats.agility}</span>
                  </p>
                  <p className="text-[10px] text-blue-600 font-mono mt-1">
                    ⚡ 敏捷補正: -{selectedModalRobot.stats.agility}秒短縮 (周期: {Math.round(engine.getAutoDispatchIntervalMs(selectedModalRobot.id) / 60000 * 10) / 10}分)
                  </p>
                </div>
                <div className="bg-stone-900 p-1 rounded border border-stone-200 overflow-hidden">
                  <RobotVisual 
                    robot={selectedModalRobot} 
                    size={48} 
                    locationId={selectedLocationId || 'loc1'}
                    agility={selectedModalRobot.stats.agility}
                    animateExploration={true}
                  />
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
                  className={`${theme.typography.h2} mb-2 text-emerald-600 drop-shadow-md text-2xl sm:text-3xl`}
                  style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
                >
                  {lootResult.title}
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
    </div>
  );
};
