import React, { useState, useEffect, useRef } from 'react';
import { GameState, Material, PartType, RobotPart, Robot } from '../core/models';
import { GameEngine } from '../core/GameEngine';
import { MATERIALS } from '../core/data';
import { Card, Button, Badge } from '../components/ui/core';
import { RobotVisual, PartVisual } from '../components/robot/RobotVisual';
import { AttributeEffects } from '../components/effects/AttributeEffects';
import { theme } from '../styles/theme';
import { TutorialPopup } from '../components/ui/TutorialPopup';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

const formatSeconds = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatRemainingSecondsText = (ms: number) => {
  if (ms <= 0) return '完成！';
  const totalSec = Math.ceil(ms / 1000);
  return `あと ${totalSec} 秒で完成`;
};

const formatDurationLabel = (ms: number) => {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0 && s > 0) return `${m}分${s}秒`;
  if (m > 0) return `${m}分`;
  return `${s}秒`;
};

export const CraftScreen: React.FC<{ state: GameState, engine: GameEngine }> = ({ state, engine }) => {
  const [tab, setTab] = useState<'part' | 'robot'>('part');
  const [, setTick] = useState<number>(Date.now());
  const craftingStatusRef = useRef<HTMLDivElement>(null);

  // Part Crafting State
  const [selectedMainMat, setSelectedMainMat] = useState<string | null>(null);
  const [selectedSubMat, setSelectedSubMat] = useState<string | null>(null);
  const [selectedPartType, setSelectedPartType] = useState<PartType>('head');
  const [lastCraftedPart, setLastCraftedPart] = useState<RobotPart | null>(null);

  // Robot Assembly State
  const [selectedHead, setSelectedHead] = useState<string>('');
  const [selectedBody, setSelectedBody] = useState<string>('');
  const [selectedArms, setSelectedArms] = useState<string>('');
  const [selectedLegs, setSelectedLegs] = useState<string>('');
  const [lastCraftedRobot, setLastCraftedRobot] = useState<Robot | null>(null);

  // Animation & Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'],
      zIndex: 9999,
      disableForReducedMotion: true
    });
  };

  const availableMainMats = MATERIALS.filter(m => (state.materials[m.id] || 0) >= 3);
  const availableSubMats = MATERIALS.filter(m => (state.materials[m.id] || 0) >= 2);
  
  const heads = state.parts.filter(p => p.type === 'head');
  const bodies = state.parts.filter(p => p.type === 'body');
  const arms = state.parts.filter(p => p.type === 'arms');
  const legs = state.parts.filter(p => p.type === 'legs');

  // Part crafting duration estimate
  const estimatedPartDuration = selectedMainMat ? engine.getPartCraftDuration(selectedMainMat, selectedSubMat || undefined) : 10000;
  
  // Robot assemble duration estimate
  const hasSelectedAllParts = !!(selectedHead && selectedBody && selectedArms && selectedLegs);
  const estimatedRobotDuration = hasSelectedAllParts ? engine.getRobotAssembleDuration(selectedHead, selectedBody, selectedArms, selectedLegs) : 60000;

  // Active Craft Statuses
  const activePart = state.activePartCraft;
  const isPartCrafting = !!activePart;
  const partRemainingMs = activePart ? Math.max(0, activePart.endTime - Date.now()) : 0;
  const partRemainingSec = Math.ceil(partRemainingMs / 1000);
  const isPartReady = isPartCrafting && partRemainingMs <= 0;
  const partProgress = activePart ? Math.min(100, Math.max(0, ((Date.now() - activePart.startTime) / activePart.durationMs) * 100)) : 0;

  const activeRobot = state.activeRobotAssembly;
  const isRobotAssembling = !!activeRobot;
  const robotRemainingMs = activeRobot ? Math.max(0, activeRobot.endTime - Date.now()) : 0;
  const robotRemainingSec = Math.ceil(robotRemainingMs / 1000);
  const isRobotReady = isRobotAssembling && robotRemainingMs <= 0;
  const robotProgress = activeRobot ? Math.min(100, Math.max(0, ((Date.now() - activeRobot.startTime) / activeRobot.durationMs) * 100)) : 0;

  const handleStartCraftPart = () => {
    if (!selectedMainMat) {
      alert("メイン素材を選んでください");
      return;
    }
    if (!selectedSubMat) {
      alert("サブ素材を選んでください");
      return;
    }
    try {
      engine.startCraftPart(selectedPartType, selectedMainMat, selectedSubMat);
      setSelectedMainMat(null);
      setSelectedSubMat(null);
      // 残り時間表示部分へスムーズスクロール
      setTimeout(() => {
        craftingStatusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleClaimPart = () => {
    try {
      const part = engine.claimCraftedPart();
      setLastCraftedPart(part);
      triggerConfetti();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleStartAssemble = () => {
    if (!selectedHead || !selectedBody || !selectedArms || !selectedLegs) {
      alert("すべてのパーツを選んでください");
      return;
    }
    try {
      engine.startAssembleRobot(selectedHead, selectedBody, selectedArms, selectedLegs);
      setSelectedHead('');
      setSelectedBody('');
      setSelectedArms('');
      setSelectedLegs('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleClaimRobot = () => {
    try {
      const robot = engine.claimAssembledRobot();
      setLastCraftedRobot(robot);
      triggerConfetti();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const partTypes: {id: PartType, label: string}[] = [
    {id: 'head', label: 'ヘッド'},
    {id: 'body', label: 'ボディ'},
    {id: 'arms', label: 'アーム'},
    {id: 'legs', label: 'レッグ'}
  ];

  return (
    <div className="space-y-6">

      <TutorialPopup 
        tutorialId="craft_first_visit" 
        state={state} 
        engine={engine} 
        title="製造（クラフト）について" 
        description={"ここでは集めた素材を組み合わせてパーツやロボットを作ります。\n・パーツ製造は素材のレア度に応じて約10秒〜20秒で完成します。\n・ロボット組立はパーツ性能に応じて約1分〜1分半で組み立てられます。\n・製造中も他の画面で探索や依頼を進めることができます！"} 
      />
  
      {/* タブ切り替え */}
      <div className="flex gap-2">
        <button 
          className={`flex-1 py-2.5 font-bold rounded-t-md border-b-4 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${tab === 'part' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('part')}
        >
          <span>パーツ製造</span>
          {isPartReady ? (
            <Badge className="bg-amber-500 text-white text-[10px] sm:text-xs animate-bounce px-1.5 py-0.5 leading-none">受取可！</Badge>
          ) : isPartCrafting ? (
            <Badge className="bg-blue-600 text-white text-[10px] sm:text-[11px] font-mono animate-pulse px-1.5 py-0.5 leading-none">
              あと{partRemainingSec}秒
            </Badge>
          ) : null}
        </button>
        <button 
          className={`flex-1 py-2.5 font-bold rounded-t-md border-b-4 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${tab === 'robot' ? 'border-amber-500 text-amber-700 bg-amber-50' : 'border-transparent text-stone-500 hover:bg-stone-100'}`}
          onClick={() => setTab('robot')}
        >
          <span>ロボット組立</span>
          {isRobotReady ? (
            <Badge className="bg-amber-500 text-white text-[10px] sm:text-xs animate-bounce px-1.5 py-0.5 leading-none">受取可！</Badge>
          ) : isRobotAssembling ? (
            <Badge className="bg-blue-600 text-white text-[10px] sm:text-[11px] font-mono animate-pulse px-1.5 py-0.5 leading-none">
              あと{robotRemainingSec}秒
            </Badge>
          ) : null}
        </button>
      </div>

      {/* ================= パーツ完成結果ダイアログ / カード ================= */}
      {tab === 'part' && lastCraftedPart && (
        <Card className="text-center bg-amber-50 border-2 border-amber-300 shadow-md animate-fade-in">
          <Badge className="bg-emerald-600 text-white mb-2 px-3 py-1 font-bold text-sm">✨ パーツ完成 ✨</Badge>
          <h3 className={`${theme.typography.h3} text-amber-900 mb-2`}>パーツが完成しました！</h3>
          <div className="flex justify-center my-4">
            <PartVisual part={lastCraftedPart} size={100} />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <h4 className={theme.typography.h2}>{lastCraftedPart.name}</h4>
            <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-sm border border-amber-300">
              {'★'.repeat(lastCraftedPart.rarity || 1)}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-600">属性: <span className="font-bold">{lastCraftedPart.attribute}</span></p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 bg-white/80 p-2.5 rounded-md border border-amber-200 text-xs">
            <div><span className="text-stone-500">HP:</span> <strong className="text-stone-800">{lastCraftedPart.stats.hp}</strong></div>
            <div><span className="text-stone-500">Pow:</span> <strong className="text-stone-800">{lastCraftedPart.stats.power}</strong></div>
            <div><span className="text-stone-500">Def:</span> <strong className="text-stone-800">{lastCraftedPart.stats.defense}</strong></div>
            <div><span className="text-stone-500">Agi:</span> <strong className="text-stone-800">{lastCraftedPart.stats.agility}</strong></div>
            <div><span className="text-stone-500">Dex:</span> <strong className="text-stone-800">{lastCraftedPart.stats.dexterity}</strong></div>
            <div><span className="text-stone-500">Int:</span> <strong className="text-stone-800">{lastCraftedPart.stats.intelligence}</strong></div>
          </div>
          <Button className="mt-5" size="lg" onClick={() => setLastCraftedPart(null)}>続けて製造する</Button>
        </Card>
      )}

      {/* ================= ロボット完成結果ダイアログ / カード ================= */}
      {tab === 'robot' && lastCraftedRobot && (
        <Card className="text-center bg-amber-50 border-2 border-amber-300 shadow-md animate-fade-in">
          <Badge className="bg-emerald-600 text-white mb-2 px-3 py-1 font-bold text-sm">🎉 ロボット完成 🎉</Badge>
          <h3 className={`${theme.typography.h3} text-amber-900 mb-2`}>組み立てが完了しました！</h3>
          <div className="flex justify-center my-3">
            <RobotVisual robot={lastCraftedRobot} size={150} animateCrafting={true} />
          </div>
          <h4 className={`${theme.typography.h2} mt-2`}>{lastCraftedRobot.name}</h4>
          <p className="text-xs text-stone-500 mt-0.5">評価額: {lastCraftedRobot.value} G</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 bg-white/80 p-2.5 rounded-md border border-amber-200 text-xs">
            <div><span className="text-stone-500">HP:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.hp}</strong></div>
            <div><span className="text-stone-500">Pow:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.power}</strong></div>
            <div><span className="text-stone-500">Def:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.defense}</strong></div>
            <div><span className="text-stone-500">Agi:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.agility}</strong></div>
            <div><span className="text-stone-500">Dex:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.dexterity}</strong></div>
            <div><span className="text-stone-500">Int:</span> <strong className="text-stone-800">{lastCraftedRobot.stats.intelligence}</strong></div>
          </div>
          <Button className="mt-5" size="lg" onClick={() => setLastCraftedRobot(null)}>続けて組み立てる</Button>
        </Card>
      )}

      {/* ================= パーツ製造タブの内容 ================= */}
      {tab === 'part' && !lastCraftedPart && (
        <div ref={craftingStatusRef} className="space-y-5">
          {/* 各パーツ製造項目のステータス＆部位選択バー */}
          <div className="bg-stone-50 border-2 border-stone-200 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-xs text-stone-700">パーツ部位別ステータス &amp; リアルタイム状況</h4>
              {isPartCrafting && (
                <span className="text-[11px] font-bold text-blue-700 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ⏱️ {isPartReady ? '完成受取待ち' : `製造中: あと ${partRemainingSec} 秒`}
                </span>
              )}
            </div>

            {/* 4部位のリアルタイムステータスボタン一覧 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {partTypes.map(pt => {
                const isSelected = selectedPartType === pt.id;
                const isThisPartCrafting = activePart?.partType === pt.id;
                const isThisPartReady = isThisPartCrafting && isPartReady;

                return (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedPartType(pt.id)}
                    className={`relative p-2.5 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <span className="font-bold text-sm text-stone-800 whitespace-nowrap">{pt.label}</span>
                      {isThisPartReady ? (
                        <Badge className="bg-emerald-600 text-white text-[9px] sm:text-[10px] animate-bounce px-1.5 py-0.5 leading-none shrink-0">
                          完成！
                        </Badge>
                      ) : isThisPartCrafting ? (
                        <Badge className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 flex items-center gap-1 shadow-[0_0_8px_rgba(37,99,235,0.6)] leading-none shrink-0 whitespace-nowrap">
                          <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="inline-block text-[9px]">⚙️</motion.span>
                          <span>あと{partRemainingSec}秒</span>
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-stone-400 whitespace-nowrap leading-none">待機中</span>
                      )}
                    </div>

                    {/* 部位ごとのリアルタイムタイマー表示 */}
                    <div className="mt-1 text-[11px]">
                      {isThisPartReady ? (
                        <span className="text-emerald-700 font-bold">✨ 受取可能</span>
                      ) : isThisPartCrafting ? (
                        <div className="space-y-1">
                          <span className="text-blue-700 font-bold font-mono">
                            あと {partRemainingSec} 秒で完成
                          </span>
                          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden relative">
                            <div 
                              className="bg-blue-600 h-full transition-all duration-200 relative overflow-hidden"
                              style={{ width: `${partProgress}%` }}
                            >
                              <motion.div
                                animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-500 text-[10px]">
                          目安: 約10秒〜
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 製造中カード（進行中または完成受け取り待ち） */}
          {activePart && (
            <Card className="bg-stone-900 border-2 border-stone-800 text-white p-5 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={isPartReady ? "bg-emerald-500 text-white text-xs px-2.5 py-0.5" : "bg-blue-600 text-white text-xs px-2.5 py-0.5"}>
                      {isPartReady ? "製造完了" : "パーツ製造中..."}
                    </Badge>
                    <span className="text-xs text-amber-300 font-bold font-mono">
                      {partTypes.find(p => p.id === activePart.partType)?.label}パーツ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-100 mt-1.5">
                    {activePart.resultPart.name} を加工中
                  </h3>
                </div>

                {/* リアルタイムタイマー表示 (秒数カウントダウン) */}
                <div className="text-right">
                  <div className="text-xs text-amber-400 font-bold font-mono">
                    {isPartReady ? '✨ 完成！' : formatRemainingSecondsText(partRemainingMs)}
                  </div>
                  <span className="text-2xl font-mono font-bold text-amber-400">
                    {isPartReady ? '00:00' : formatSeconds(partRemainingMs)}
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full bg-stone-800 rounded-full h-3 mb-4 overflow-hidden border border-stone-700 relative">
                <div 
                  className={`h-full transition-all duration-200 relative overflow-hidden ${isPartReady ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                  style={{ width: `${partProgress}%` }}
                >
                  {!isPartReady && (
                    <motion.div
                      animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"
                    />
                  )}
                </div>
              </div>

              {/* ビジュアル演出 */}
              <div className="flex items-center justify-between bg-stone-800/60 p-3 rounded-lg border border-stone-700/80">
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ rotate: isPartReady ? 0 : [0, 360], scale: isPartReady ? [1, 1.08, 1] : 1 }}
                    transition={{ duration: isPartReady ? 1.5 : 8, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center shadow-inner"
                  >
                    <MaterialIcon materialId={activePart.mainMaterialId} size={28} />
                  </motion.div>
                  <div>
                    <div className="text-xs text-stone-300">
                      メイン素材: <span className="font-bold text-amber-300">{MATERIALS.find(m => m.id === activePart.mainMaterialId)?.name}</span> <span className="text-amber-400 font-bold ml-1">{'★'.repeat(MATERIALS.find(m => m.id === activePart.mainMaterialId)?.rarity || 1)}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      所要時間: {formatDurationLabel(activePart.durationMs)}
                    </div>
                  </div>
                </div>

                {!isPartReady ? (
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded text-amber-300 font-mono font-bold text-xs animate-pulse">
                      あと {partRemainingSec} 秒
                    </span>
                  </div>
                ) : (
                  <Button 
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs shadow-lg animate-pulse"
                    onClick={handleClaimPart}
                  >
                    🎉 受け取る
                  </Button>
                )}
              </div>

              {/* フル幅受取ボタン */}
              {isPartReady && (
                <div className="mt-3">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-sm shadow-lg animate-pulse"
                    onClick={handleClaimPart}
                  >
                    🎉 完成したパーツを受け取る！
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* 製造フォーム（製造中でも素材確認・次期選択が可能） */}
          <div className={`space-y-4 ${activePart ? 'opacity-60 pointer-events-none' : ''}`}>
            {activePart && (
              <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs px-3 py-1.5 rounded-md font-bold text-center">
                ※ 現在パーツを製造中です。完成後に受け取ると次の製造を行えます。
              </div>
            )}
            
            <p className={theme.typography.body}>作成するパーツの素材を選んでください。</p>

            <div className="space-y-4">
              {/* メイン素材選択 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-stone-700 text-sm">メイン素材 (3個消費) - 属性・レア度・製造時間を決定</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableMainMats?.length === 0 && <p className="text-stone-500 col-span-full text-xs">3個以上ある素材がありません。</p>}
                  
                  {availableMainMats.map(mat => {
                    const count = state.materials[mat.id] || 0;
                    const isSelected = selectedMainMat === mat.id;
                    const rStyle = theme.rarity[mat.rarity];
                    const singleDuration = engine.getPartCraftDuration(mat.id);
                    return (
                      <button 
                        key={`main-${mat.id}`}
                        onClick={() => setSelectedMainMat(mat.id)}
                        className={`text-left p-3 border-2 ${theme.radius.md} transition-all ${isSelected ? 'border-amber-500 bg-amber-100/90 ring-2 ring-amber-400 shadow-sm' : `${rStyle.border} ${rStyle.bg} hover:border-stone-400`}`}
                      >
                        <div className="flex justify-between items-center mb-1 gap-1">
                          <span className={`font-bold text-sm flex items-center gap-1.5 truncate ${rStyle.text}`}>
                            <MaterialIcon materialId={mat.id} />
                            <span className="truncate">{mat.name}</span>
                          </span>
                          <Badge className="bg-stone-900 text-white font-bold text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[2rem] text-center leading-none shrink-0 font-mono">x{count}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-xs">
                          <span className="text-stone-500 whitespace-nowrap">属性: {mat.attribute}</span>
                          <span className={`font-bold text-[10px] px-1.5 py-0.2 rounded border whitespace-nowrap leading-none ${rStyle.badge}`}>
                            {rStyle.stars}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-600 font-mono bg-white/60 px-1.5 py-0.5 rounded border border-stone-200">
                          <span className="whitespace-nowrap">⏱️ 製造時間:</span>
                          <strong className="text-amber-800 whitespace-nowrap">{formatDurationLabel(singleDuration)}</strong>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* サブ素材選択 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-stone-700 text-sm">サブ素材 (2個消費) - 追加性能を決定</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSubMats?.length === 0 && <p className="text-stone-500 col-span-full text-xs">2個以上ある素材がありません。</p>}
                  
                  {availableSubMats.map(mat => {
                    // Ignore if it's the main mat and we don't have enough to use both
                    const count = state.materials[mat.id] || 0;
                    if (selectedMainMat === mat.id && count < 5) return null;

                    const isSelected = selectedSubMat === mat.id;
                    const rStyle = theme.rarity[mat.rarity];
                    return (
                      <button 
                        key={`sub-${mat.id}`}
                        onClick={() => setSelectedSubMat(mat.id)}
                        className={`text-left p-3 border-2 ${theme.radius.md} transition-all ${isSelected ? 'border-blue-500 bg-blue-100/90 ring-2 ring-blue-400 shadow-sm' : `${rStyle.border} ${rStyle.bg} hover:border-stone-400`}`}
                      >
                        <div className="flex justify-between items-center mb-1 gap-1">
                          <span className={`font-bold text-sm flex items-center gap-1.5 truncate ${rStyle.text}`}>
                            <MaterialIcon materialId={mat.id} />
                            <span className="truncate">{mat.name}</span>
                          </span>
                          <Badge className="bg-stone-900 text-white font-bold text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[2rem] text-center leading-none shrink-0 font-mono">x{count}</Badge>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-xs">
                          <span className="text-stone-500 whitespace-nowrap">属性: {mat.attribute}</span>
                          <span className={`font-bold text-[10px] px-1.5 py-0.2 rounded border whitespace-nowrap leading-none ${rStyle.badge}`}>
                            {rStyle.stars}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 製造概要 & 開始ボタン */}
            <Card className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-stone-100 gap-3">
              <div>
                <p className="font-bold text-sm text-stone-800">
                  製造部位: <span className="text-amber-700">{partTypes.find(p => p.id === selectedPartType)?.label}</span>
                </p>
                <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-1.5">
                  ⏱️ 製造所要時間: <strong className="text-stone-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-mono text-sm">{formatDurationLabel(estimatedPartDuration)}</strong>
                  {selectedMainMat && (
                    <span className="text-stone-500 text-[11px]">
                      ({'★'.repeat(MATERIALS.find(m => m.id === selectedMainMat)?.rarity || 1)}素材補正)
                    </span>
                  )}
                </p>
              </div>
              <Button 
                size="lg" 
                disabled={!selectedMainMat || !selectedSubMat || !!activePart} 
                onClick={handleStartCraftPart}
              >
                パーツ製造開始
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* ================= ロボット組立タブの内容 ================= */}
      {tab === 'robot' && !lastCraftedRobot && (
        <div className="space-y-5">
          {/* 組立中カード（進行中または完成受け取り待ち） */}
          {activeRobot ? (
            <Card className="bg-stone-900 border-2 border-stone-800 text-white p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Badge className={isRobotReady ? "bg-emerald-500 text-white text-xs px-2.5 py-1" : "bg-blue-600 text-white text-xs px-2.5 py-1"}>
                    {isRobotReady ? "組立完了" : "ロボット組立中..."}
                  </Badge>
                  <h3 className="text-lg font-bold text-stone-100 mt-2">
                    「{activeRobot.resultRobot.name}」を組立中
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    パーツ性能に応じた組立時間（所要時間: {formatDurationLabel(activeRobot.durationMs)}）
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-amber-400 font-bold font-mono">
                    {isRobotReady ? '✨ 完成！' : formatRemainingSecondsText(robotRemainingMs)}
                  </div>
                  <span className="text-2xl font-mono font-bold text-amber-400">
                    {isRobotReady ? '00:00' : formatSeconds(robotRemainingMs)}
                  </span>
                </div>
              </div>

              {/* プログレスバー */}
              <div className="w-full bg-stone-800 rounded-full h-3.5 mb-6 overflow-hidden border border-stone-700 relative">
                <div 
                  className={`h-full transition-all duration-200 relative overflow-hidden ${isRobotReady ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                  style={{ width: `${robotProgress}%` }}
                >
                  {!isRobotReady && (
                    <motion.div
                      animate={{ backgroundPosition: ['0px 0px', '20px 0px'] }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"
                    />
                  )}
                </div>
              </div>

              {/* ビジュアル演出 */}
              <div className="flex flex-col items-center justify-center py-4 relative overflow-hidden rounded-xl bg-stone-800/30">
                {/* 稼働中エフェクト（背景ギア） */}
                {!isRobotReady && (
                  <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute -left-6 text-7xl opacity-20 filter grayscale">⚙️</motion.div>
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute -right-6 text-8xl opacity-10 filter grayscale">⚙️</motion.div>
                  </div>
                )}
                
                <motion.div
                  animate={{ scale: isRobotReady ? [1, 1.05, 1] : [0.98, 1.02, 0.98] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="opacity-90 filter drop-shadow-md relative"
                >
                  <RobotVisual robot={activeRobot.resultRobot} size={130} />
                  
                  {/* スキャンライン / 構築ラインエフェクト */}
                  {!isRobotReady && (
                    <motion.div
                      animate={{ top: ['-10%', '110%', '-10%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-[-20%] right-[-20%] h-1 bg-cyan-400/80 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)] z-10 rounded-full"
                    />
                  )}
                </motion.div>

                {!isRobotReady ? (
                  <div className="mt-3 font-bold text-xs tracking-wider text-amber-300/90 animate-pulse font-mono bg-stone-800/80 px-3 py-1 rounded-full border border-stone-700 relative z-20">
                    🔧 接合・動作テスト中... あと {robotRemainingSec} 秒
                  </div>
                ) : null}
              </div>

              {/* アクションボタン */}
              <div className="mt-4 flex gap-3">
                {isRobotReady ? (
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 text-base shadow-lg animate-pulse"
                    onClick={handleClaimRobot}
                  >
                    🎉 完成したロボットを受け取る！
                  </Button>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-stone-400">
                    完了するまでしばらくお待ちください（他の画面に移動しても進行します）
                  </div>
                )}
              </div>
            </Card>
          ) : (
            /* 組立フォーム */
            <div className="space-y-4">
              <p className={theme.typography.body}>各部位のパーツを組み合わせてロボットを組み立てます。</p>
              
              {/* プレビューカード */}
              <Card className="flex flex-col items-center justify-center p-4 bg-stone-100 border-2 border-stone-300 border-dashed relative overflow-hidden">
                <h3 className="font-bold text-stone-500 mb-2 z-10 text-xs">プレビュー</h3>
                
                <AttributeEffects 
                  attributes={Array.from(new Set([
                    heads.find(p => p.id === selectedHead)?.attribute,
                    bodies.find(p => p.id === selectedBody)?.attribute,
                    arms.find(p => p.id === selectedArms)?.attribute,
                    legs.find(p => p.id === selectedLegs)?.attribute
                  ].filter(Boolean) as any))} 
                />

                <div className="z-10 relative">
                  <RobotVisual 
                    robot={{
                      parts: {
                        head: heads.find(p => p.id === selectedHead),
                        body: bodies.find(p => p.id === selectedBody),
                        arms: arms.find(p => p.id === selectedArms),
                        legs: legs.find(p => p.id === selectedLegs)
                      }
                    }} 
                    size={120} 
                  />
                </div>
              </Card>

              {/* パーツ選択ドロップダウン */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stone-700">ヘッド</label>
                  <select 
                    className="p-2 border border-stone-300 rounded-md bg-white text-xs"
                    value={selectedHead}
                    onChange={e => setSelectedHead(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {heads.map((p, idx) => (
                      <option key={`${p.id}-${idx}`} value={p.id}>
                        {p.name} ({'★'.repeat(p.rarity || 1)} HP:{p.stats.hp} 属性:{p.attribute})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stone-700">ボディ</label>
                  <select 
                    className="p-2 border border-stone-300 rounded-md bg-white text-xs"
                    value={selectedBody}
                    onChange={e => setSelectedBody(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {bodies.map((p, idx) => (
                      <option key={`${p.id}-${idx}`} value={p.id}>
                        {p.name} ({'★'.repeat(p.rarity || 1)} HP:{p.stats.hp} 属性:{p.attribute})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stone-700">アーム</label>
                  <select 
                    className="p-2 border border-stone-300 rounded-md bg-white text-xs"
                    value={selectedArms}
                    onChange={e => setSelectedArms(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {arms.map((p, idx) => (
                      <option key={`${p.id}-${idx}`} value={p.id}>
                        {p.name} ({'★'.repeat(p.rarity || 1)} HP:{p.stats.hp} 属性:{p.attribute})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-stone-700">レッグ</label>
                  <select 
                    className="p-2 border border-stone-300 rounded-md bg-white text-xs"
                    value={selectedLegs}
                    onChange={e => setSelectedLegs(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {legs.map((p, idx) => (
                      <option key={`${p.id}-${idx}`} value={p.id}>
                        {p.name} ({'★'.repeat(p.rarity || 1)} HP:{p.stats.hp} 属性:{p.attribute})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 組立概要 & 開始ボタン */}
              <Card className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-stone-100 gap-3">
                <div>
                  <p className="text-xs text-stone-600 flex items-center gap-1.5">
                    ⏱️ 組立所要時間: <strong className="text-stone-900 text-sm bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-mono">{formatDurationLabel(estimatedRobotDuration)}</strong>
                    {hasSelectedAllParts && (
                      <span className="text-stone-500 text-[11px]">
                        (パーツ性能補正適用)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    基本1分（高性能・高レアパーツを組み込むほど入念な組み立てになります）
                  </p>
                </div>
                <Button 
                  size="lg" 
                  disabled={!hasSelectedAllParts} 
                  onClick={handleStartAssemble}
                >
                  組立開始
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
