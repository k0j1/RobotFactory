import React, { useState } from 'react';
import { GameState, AttributeNames } from '../core/models';
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
  if (h > 0) return `${h}時間${m}分`;
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
    // 初回の華やかなバースト（軽量化のため数を調整）
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
      zIndex: 9999,
      disableForReducedMotion: true
    });

    // レンダリングの遅延により途中で時間切れになるのを防ぐため、回数ベースで実行
    let burstCount = 0;
    const maxBursts = 10;
    
    const interval = setInterval(() => {
      burstCount++;
      if (burstCount >= maxBursts) {
        clearInterval(interval);
        return;
      }
      
      // 左右から少しずつ降らせる（負荷軽減のため数と設定を調整）
      confetti({
        particleCount: 12,
        spread: 60,
        startVelocity: 25,
        origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() * 0.2 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
        zIndex: 9999,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 12,
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
        title: '🎉 遠征成功！ 🎉',
        subtitle: '以下の素材を獲得しました！',
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
          title: '🤖 自動探索 素材回収！',
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
          title: '🤖 自動探索 一括回収！',
          subtitle: '派遣中のロボットたちが探索した素材を一括回収しました！',
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
          title: '🤖 自動探索 帰還・素材回収！',
          subtitle: `${res.robotName} が ${res.locationName} から帰還し、探索で見つけた素材を獲得しました！`,
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

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className={`flex gap-4 p-4 ${theme.colors.surface} ${theme.radius.md} ${theme.shadow.sm}`}>
        <div className="flex-1">
          <p className={theme.typography.small}>所持金</p>
          <p className={`${theme.typography.h2} text-amber-600`}>{state.gold} G</p>
        </div>
        <div className="flex-1">
          <p className={theme.typography.small}>ロボット倉庫</p>
          <p className={theme.typography.h2}>{state.robots?.length} / {state.storageSize}</p>
        </div>
        <div className="flex-1">
          <p className={theme.typography.small}>納品実績</p>
          <p className={theme.typography.h2}>{state.deliveredRobotsCount}体</p>
        </div>
      </div>

      {/* Tutorial Banner */}
      {state.tutorialStep < 5 && (
        <Card className="bg-blue-100 border-2 border-blue-400 text-blue-900">
          <h3 className={`${theme.typography.h3} text-blue-800`}>チュートリアル進行中！</h3>
          <p className="mt-2 font-bold font-sans">
            {state.tutorialStep === 0 && 'まずは下のメニューから「遠征」に行き、素材を集めてこよう。'}
            {state.tutorialStep === 1 && '遠征から帰還するのを待って、素材を受け取ろう。'}
            {state.tutorialStep === 2 && '素材が集まったら「製造」メニューでロボットを作ってみよう！'}
            {state.tutorialStep === 3 && 'ロボットが完成！「依頼板」を見て、納品できそうな依頼を受けよう。'}
            {state.tutorialStep === 4 && '依頼を受けたら、依頼詳細からロボットを「納品」しよう。'}
          </p>
        </Card>
      )}

      {/* Information & Archive Utility Menu (図鑑・仕様書) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('encyclopedia')}
          className="flex items-center gap-2 p-2.5 bg-stone-100/90 hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="text-xl p-1 bg-white rounded-md border border-stone-200 shadow-2xs group-hover:scale-110 transition-transform">📖</span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1">
              <span>図鑑・実績</span>
            </div>
            <div className="text-[10px] text-stone-500 truncate">納品履歴 / パーツ・素材詳細</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('litepaper')}
          className="flex items-center gap-2 p-2.5 bg-stone-100/90 hover:bg-stone-200 border border-stone-300 rounded-lg text-stone-700 transition shadow-2xs group text-left cursor-pointer"
        >
          <span className="text-xl p-1 bg-white rounded-md border border-stone-200 shadow-2xs group-hover:scale-110 transition-transform">📜</span>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1">
              <span>仕様書</span>
            </div>
            <div className="text-[10px] text-stone-500 truncate">工房ルール / ガイド確認</div>
          </div>
        </button>
      </div>

      {/* Shop & Material Trade Feature Card (商店・素材売買・交換所) */}
      <div 
        onClick={() => onNavigate('shop')}
        className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50/90 to-amber-100/80 border-2 border-amber-400 hover:border-amber-500 rounded-xl px-3.5 py-2 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-lg shadow-xs border border-amber-300 shrink-0 group-hover:scale-105 transition-transform">
            🏪
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base text-amber-950 truncate">
                素材商店・交換所
              </h3>
              <span className="text-[10px] bg-amber-200/90 text-amber-900 font-bold px-1.5 py-0.2 rounded border border-amber-300 hidden sm:inline whitespace-nowrap">
                素材の売買 &amp; キット交換
              </span>
            </div>
            <p className="text-[11px] text-stone-600 truncate mt-0.5">
              素材の購入・売却 ｜ 修理キット交換 ｜ 工房の内装変更
            </p>
          </div>
        </div>
        <span className="text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all text-sm shrink-0 font-bold">
          ›
        </span>
      </div>

      {/* Crafting in Progress Banner (if any) */}
      {(state.activePartCraft || state.activeRobotAssembly) && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 shadow-sm">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-900 text-sm">
                    {state.activePartCraft && state.activeRobotAssembly 
                      ? 'パーツ製造 & ロボット組立中' 
                      : state.activePartCraft 
                        ? 'パーツ製造進行中' 
                        : 'ロボット組立進行中'}
                  </h4>
                  {(
                    (state.activePartCraft && state.activePartCraft.endTime <= Date.now()) ||
                    (state.activeRobotAssembly && state.activeRobotAssembly.endTime <= Date.now())
                  ) && (
                    <Badge className="bg-emerald-500 text-white text-[10px] whitespace-nowrap animate-bounce leading-none">
                      🎉 完成受取可能！
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-stone-600 flex gap-4 mt-0.5">
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
            <Button size="sm" onClick={() => onNavigate('craft')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm">
              製造画面へ →
            </Button>
          </div>
        </Card>
      )}

      {/* Dispatch Status & Quick Log Panel */}
      <Card className="bg-stone-50 border-2 border-stone-300">
        <div className="flex justify-between items-center mb-3 border-b border-stone-200 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📡</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={theme.typography.h3}>出撃状況・探索ログパネル</h3>
                {(questDone || totalAutoPendingDrops > 0) && (
                  <span className="bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow whitespace-nowrap leading-none shrink-0 inline-flex items-center">
                    {questDone && totalAutoPendingDrops > 0 ? '🎉 遠征完了 & 素材受取可能！' : questDone ? '🎉 遠征帰還！' : `📦 素材受取可能 (${totalAutoPendingDrops}個)`}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">遠征および自動探索中のロボットの現在ステータスとログ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalAutoPendingDrops > 0 && (
              <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="animate-pulse shadow-sm text-xs px-2.5 py-1.5">
                自動探索を一括回収 ({totalAutoPendingDrops}個)
              </Button>
            )}
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* List of all active dispatches & quest */}
        {!state.activeQuest && (!state.autoDispatches || state.autoDispatches.length === 0) ? (
          <div className="text-center py-4 bg-white rounded-lg border border-dashed border-stone-300">
            <p className="text-stone-500 text-sm">現在、出撃中のロボットはいません。</p>
            <p className="text-xs text-stone-400 mt-1">「遠征」へ出発するか、下の「自動探索」でロボットを派遣してみましょう。</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active Quest Quick Row */}
            {state.activeQuest && (
              <div className={`bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between gap-3 ${questDone ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-amber-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-amber-50 rounded border border-amber-200 flex-shrink-0">
                    {questRobot ? (
                      <RobotVisual robot={questRobot} size={40} />
                    ) : (
                      <span className="text-2xl">🎒</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                        通常遠征
                      </span>
                      <span className="font-bold text-sm text-stone-800">{activeQuestLoc?.name}</span>
                      {questDone && (
                        <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                          受取可能
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      同行: {questRobot ? questRobot.name : 'なし'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {questDone ? (
                    <Button size="sm" variant="success" onClick={handleCompleteQuest} className="shadow animate-bounce">
                      素材を受け取る
                    </Button>
                  ) : (
                    <div>
                      <span className="text-xs text-stone-500 block">残り時間</span>
                      <span className="text-sm font-bold font-mono text-amber-700">{formatTime(timeRemaining)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Auto Dispatches Quick Rows */}
            {state.autoDispatches?.map(d => {
              const dRobot = state.robots.find(r => r.id === d.robotId);
              const dLoc = LOCATIONS.find(l => l.id === d.locationId);
              const nextTime = d.lastCollectedAt + 60 * 60 * 1000;
              const remain = Math.max(0, nextTime - Date.now());
              const pending = d.pendingDrops?.length || 0;
              const latestLog = d.logs && d.logs.length > 0 ? d.logs[d.logs.length - 1] : '探索開始しました';

              return (
                <div key={`quick-auto-${d.id}`} className={`bg-white p-3 rounded-lg border shadow-sm space-y-2 ${pending > 0 ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-stone-200'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-purple-50 rounded border border-purple-200 flex-shrink-0">
                        {dRobot ? <RobotVisual robot={dRobot} size={40} /> : <span className="text-2xl">🤖</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-purple-100 text-purple-900 px-1.5 py-0.5 rounded border border-purple-200">
                            自動探索
                          </span>
                          <span className="font-bold text-sm text-stone-800">{dRobot?.name || 'ロボット'}</span>
                          {pending > 0 && (
                            <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                              受取可
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          探索場所: <span className="font-bold text-stone-700">{dLoc?.name}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {pending > 0 ? (
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => handleClaimAutoDispatch(d.id)}
                          className="shadow-sm font-bold text-xs px-2 py-1"
                        >
                          回収 ({pending}個)
                        </Button>
                      ) : (
                        <div>
                          <span className="text-[10px] text-stone-400 block whitespace-nowrap">次回素材発見</span>
                          <span className="text-xs font-bold font-mono text-purple-700 whitespace-nowrap">{formatTime(remain)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Latest Log Snippet */}
                  <div className="bg-stone-50 px-2.5 py-1.5 rounded text-[11px] font-mono text-stone-600 border border-stone-200 flex items-center justify-between">
                    <span className="truncate flex-1">📝 最新ログ: {latestLog}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Active Quest */}
      <h2 className={`${theme.typography.h2} border-b-2 ${theme.colors.border} pb-2`}>現在の状況</h2>
      
      {state.activeQuest ? (
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className={theme.typography.h3}>遠征中: {activeQuestLoc?.name}</h3>
            {questDone ? (
              <Badge className="bg-emerald-100 text-emerald-800">帰還完了</Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800">探索中...</Badge>
            )}
          </div>

          {/* 連れて行っているロボットのビジュアル表示 */}
          {questRobot ? (
            <div className="flex items-center justify-between bg-stone-50 p-3 rounded-lg border border-stone-200 my-3">
              <div>
                <p className="text-xs text-stone-500 font-bold">連れて行っているロボット</p>
                <p className="font-bold text-stone-800 text-sm mt-0.5">{questRobot.name}</p>
                <div className="flex gap-2 mt-1 text-xs text-stone-600 font-mono">
                  <span>Pow: {questRobot.stats.power}</span>
                  <span>Agi: {questRobot.stats.agility}</span>
                </div>
                {questDone ? (
                  <span className="inline-block mt-1 text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-300">
                    🎁 素材発見！大喜び中
                  </span>
                ) : (
                  <span className="inline-block mt-1 text-[11px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                    遠征中...
                  </span>
                )}
              </div>
              <div className="bg-stone-900 p-1 rounded border border-stone-200 overflow-hidden">
                <RobotVisual 
                  robot={questRobot} 
                  size={60} 
                  animateExploration={!questDone}
                  animateVictory={false}
                  hasPendingDrops={questDone}
                  locationId={state.activeQuest?.locationId}
                  agility={questRobot.stats.agility}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 my-2 italic">※ロボット同行なし</p>
          )}

          {!questDone && <p className="text-2xl text-center my-4 font-mono">{formatTime(timeRemaining)}</p>}
          <Button 
            className="w-full mt-4" 
            variant={questDone ? 'success' : 'secondary'} 
            disabled={!questDone}
            onClick={handleCompleteQuest}
          >
            {questDone ? '素材を回収する' : '探索を待つ'}
          </Button>
        </Card>
      ) : (
        <Card className="text-center p-8 bg-stone-100 border-dashed border-2 border-stone-300">
          <p className="mb-4 text-stone-500">現在、遠征中のチームはありません。</p>
          <Button onClick={() => onNavigate('quest')}>遠征へ向かう</Button>
        </Card>
      )}

      {/* Current Request */}
      {state.currentRequest && (
        <Card>
          <div className="flex justify-between items-center mb-2">
            <h3 className={theme.typography.h3}>受諾中の依頼</h3>
            <Badge className="bg-blue-100 text-blue-800">{state.currentRequest.clientName}</Badge>
          </div>
          <p className="mb-4">{state.currentRequest.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-600">報酬: {state.currentRequest.rewardG} G</span>
            <span className={theme.typography.small}>
              期限: {formatTime(state.currentRequest.deadline - Date.now())}
            </span>
          </div>
          <Button className="w-full mt-4" onClick={() => onNavigate('requests')}>納品へ進む</Button>
        </Card>
      )}

      {/* Auto Dispatches */}
      <Card className="bg-stone-50 border-2 border-stone-200">
        <div className="flex justify-between items-center mb-4 border-b border-stone-300 pb-2 flex-wrap gap-2">
          <div>
            <h3 className={theme.typography.h3}>自動探索ロボット</h3>
            <p className="text-xs text-stone-500">1時間ごとに1つの素材を発見・蓄積します（要回収）</p>
          </div>
          <div className="flex items-center gap-2">
            {totalAutoPendingDrops > 0 && (
              <Button size="sm" variant="success" onClick={handleClaimAllAutoDispatches} className="text-xs px-2.5 py-1.5">
                全回収 ({totalAutoPendingDrops}個)
              </Button>
            )}
            <Button size="sm" onClick={() => setIsDispatchModalOpen(true)}>派遣する</Button>
          </div>
        </div>
        {(!state.autoDispatches || state.autoDispatches?.length === 0) ? (
          <p className="text-sm text-stone-500 text-center py-4">現在、自動探索中のロボットはいません。</p>
        ) : (
          <div className="space-y-4">
            {state.autoDispatches.map(dispatch => {
              const loc = LOCATIONS.find(l => l.id === dispatch.locationId);
              const robot = state.robots.find(r => r.id === dispatch.robotId);
              const pendingCount = dispatch.pendingDrops?.length || 0;
              
              // Agilityに応じたインターバル計算（Agility 1につき1秒短縮）
              const intervalMs = engine.getAutoDispatchIntervalMs(dispatch.robotId);
              const nextTime = dispatch.lastCollectedAt + intervalMs;
              const remainToNext = Math.max(0, nextTime - Date.now());

              const selectedEmotion = previewEmotions[dispatch.id] || 'auto';

              return (
                <div key={dispatch.id} className="bg-white border border-stone-200 rounded-md shadow-sm overflow-hidden mb-4">
                  {/* ロボット探索アニメーション (フルウィズ・高さ3倍) */}
                  {robot && (
                    <div className="w-full bg-stone-900 border-b border-stone-300 relative">
                      <RobotVisual 
                        robot={robot} 
                        size={52} 
                        containerWidth="100%"
                        containerHeight={52 * 3}
                        animateExploration={true} 
                        emotion={selectedEmotion}
                        hasPendingDrops={pendingCount > 0}
                        locationId={dispatch.locationId}
                        agility={robot.stats.agility}
                      />

                      {/* 表情テスト切替コントロール（控えめに右上に配置） */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-stone-900/80 p-1 rounded border border-stone-700/60 z-20">
                        <span className="text-[10px] text-stone-400 mr-0.5 whitespace-nowrap">表情:</span>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [dispatch.id]: 'auto' }))}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap transition-colors ${selectedEmotion === 'auto' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                          title="自動（素材発見時: 喜ぶ / 探索中: 歩行）"
                        >
                          自動
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [dispatch.id]: 'happy' }))}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap transition-colors ${selectedEmotion === 'happy' ? 'bg-amber-500 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                          title="素材発見（喜ぶ表情・バンザイ）"
                        >
                          ✨発見
                        </button>
                        <button 
                          onClick={() => setPreviewEmotions(prev => ({ ...prev, [dispatch.id]: 'troubled' }))}
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap transition-colors ${selectedEmotion === 'troubled' ? 'bg-blue-600 text-white' : 'text-stone-300 hover:bg-stone-800'}`}
                          title="探索難航・失敗（困る表情・オロオロ）"
                        >
                          💦困り
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-stone-800 text-sm">
                              {robot?.name || '不明なロボット'}
                            </p>
                            {pendingCount > 0 ? (
                              <span className="text-[10px] sm:text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300 animate-pulse flex items-center gap-1 whitespace-nowrap leading-none shrink-0">
                                <span>🎁 未回収: {pendingCount}個 (大喜び中！)</span>
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 whitespace-nowrap leading-none shrink-0">
                                <span>🔍 探索中 (敏捷 {robot?.stats.agility || 0})</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            探索場所: <span className="font-bold text-stone-700">{loc?.name}</span> / HP: {robot?.currentHp ?? 12}/{robot?.maxHp ?? 12}
                          </p>
                          {(robot?.currentHp ?? 12) <= 1 && (
                            <p className="text-[11px] text-red-600 font-bold mt-1 bg-red-50 p-1 rounded border border-red-200">
                              ⚠️ HPが残りわずかのため探索を中断しています。帰還して修理してください。
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <p className="text-[11px] text-stone-500 font-mono whitespace-nowrap">
                              次回到着まで: {formatTime(remainToNext)}
                            </p>
                            {robot && (robot.stats.agility > 0) && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded border border-blue-200 font-mono whitespace-nowrap leading-none">
                                敏捷短縮: -{robot.stats.agility}秒 (周期: {Math.round(intervalMs / 60000 * 10) / 10}分)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="danger" onClick={() => handleCancelAutoDispatch(dispatch.id)}>帰還</Button>
                    </div>

                  {/* 回収アクションエリア */}
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-xs text-stone-600 font-sans whitespace-nowrap">
                      {pendingCount > 0 ? `📦 ${pendingCount}個の素材が回収可能です！` : '⏳ 素材の発見を待機中...'}
                    </span>
                    <Button
                      size="sm"
                      variant={pendingCount > 0 ? 'success' : 'secondary'}
                      disabled={pendingCount === 0}
                      onClick={() => handleClaimAutoDispatch(dispatch.id)}
                      className="text-xs px-2.5 py-1"
                    >
                      {pendingCount > 0 ? `素材を回収する (${pendingCount}個)` : '素材なし'}
                    </Button>
                  </div>

                  {dispatch.logs?.length > 0 ? (
                    <div className="bg-stone-100 p-2 rounded text-xs text-stone-600 font-mono space-y-1 mt-2">
                      {dispatch.logs.map((log, idx) => (
                        <p key={idx}>- {log}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic mt-2">
                      まだ素材を回収していません（敏捷 {robot?.stats.agility || 0} により {Math.round(intervalMs / 60000 * 10) / 10} 分ごとに発見）...
                    </p>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

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
                    delay: i * 0.03, // Slight stagger
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
