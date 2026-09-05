import * as Gi from 'react-icons/gi';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RobotVisual } from '../../robot/RobotVisual';
import { LocationEnvironment } from '../../robot/LocationEnvironment';
import { LOCATIONS } from '../../../core/data';
import { Opponent } from '../Shared';
import { CombatFighter, CombatPopup, CombatActionEvent, SkillDef } from './combatTypes';
import { getOpponentRobotModel, OPPONENT_DEFAULT_STAGES } from './opponentRobotData';
import { ALL_COMBAT_SKILLS } from './combatSkills';

interface CombatArenaProps {
  player: CombatFighter;
  opponent: CombatFighter;
  activeOpponent: Opponent;
  lastActionEvent: CombatActionEvent | null;
  lastLearnedSkill: { fighterId: string; fighterName: string; skill: SkillDef } | null;
  popups: CombatPopup[];
  speed: number;
  isPaused: boolean;
  isFinished: boolean;
  winner: 'player' | 'opponent' | 'draw' | null;
  onTogglePause?: () => void;
  onSetSpeed?: (speed: number) => void;
  onOpenSkillModal?: (skill?: SkillDef) => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  player,
  opponent,
  activeOpponent,
  lastActionEvent,
  lastLearnedSkill,
  popups,
  speed,
  isPaused,
  isFinished,
  winner,
  onTogglePause,
  onSetSpeed,
  onOpenSkillModal,
}) => {
  // 対戦相手に応じたデフォルト遠征ステージ、またはユーザー選択ステージ
  const defaultStage = OPPONENT_DEFAULT_STAGES[activeOpponent.id]?.locId || 'loc1';
  const [selectedLocationId, setSelectedLocationId] = useState<string>(defaultStage);
  const [showStageMenu, setShowStageMenu] = useState<boolean>(false);

  // 相手ロボットモデルのキャッシュ・生成
  const opponentRobotModel = React.useMemo(() => {
    return getOpponentRobotModel(activeOpponent);
  }, [activeOpponent]);

  // アニメーション状態
  const [playerAnimState, setPlayerAnimState] = useState<'idle' | 'attack' | 'skill' | 'hit' | 'dodge' | 'victory' | 'defeat'>('idle');
  const [opponentAnimState, setOpponentAnimState] = useState<'idle' | 'attack' | 'skill' | 'hit' | 'dodge' | 'victory' | 'defeat'>('idle');
  
  // ヒットエフェクト
  const [hitEffect, setHitEffect] = useState<{
    target: 'player' | 'opponent';
    type: 'slash' | 'critical' | 'explosion' | 'dodge' | 'heal';
    id: number;
  } | null>(null);

  // 技発動コール演出
  const [skillBanner, setSkillBanner] = useState<{
    actorName: string;
    skillName: string;
    isPlayer: boolean;
  } | null>(null);

  // 決着時のアニメーション同期
  useEffect(() => {
    if (isFinished) {
      if (winner === 'player') {
        setPlayerAnimState('victory');
        setOpponentAnimState('defeat');
      } else if (winner === 'opponent') {
        setPlayerAnimState('defeat');
        setOpponentAnimState('victory');
      } else {
        setPlayerAnimState('defeat');
        setOpponentAnimState('defeat');
      }
    }
  }, [isFinished, winner]);

  // 攻撃アクションイベントの受信・アニメーション反映
  useEffect(() => {
    if (!lastActionEvent || isFinished) return;

    const { attackerId, defenderId, type, skill, isDodge, isCritical, isHeal } = lastActionEvent;
    const isPlayerAttacking = attackerId === 'player';

    // 技名コールの表示
    if (skill) {
      setSkillBanner({
        actorName: isPlayerAttacking ? player.name : opponent.name,
        skillName: skill.name,
        isPlayer: isPlayerAttacking,
      });
      setTimeout(() => {
        setSkillBanner(null);
      }, 1200);
    }

    // 攻撃側のモーション発動
    if (isPlayerAttacking) {
      setPlayerAnimState(type === 'skill' ? 'skill' : 'attack');
    } else {
      setOpponentAnimState(type === 'skill' ? 'skill' : 'attack');
    }

    // 攻撃の到達タイミング（突進から約100〜140ms後）で被弾・回避・エフェクトを発火
    const hitTimer = setTimeout(() => {
      if (isDodge) {
        // 回避モーション
        if (isPlayerAttacking) {
          setOpponentAnimState('dodge');
        } else {
          setPlayerAnimState('dodge');
        }
        setHitEffect({
          target: isPlayerAttacking ? 'opponent' : 'player',
          type: 'dodge',
          id: Date.now(),
        });
      } else if (isHeal) {
        // 回復エフェクト
        setHitEffect({
          target: isPlayerAttacking ? 'player' : 'opponent',
          type: 'heal',
          id: Date.now(),
        });
      } else {
        // 被弾モーション & エフェクト
        if (isPlayerAttacking) {
          setOpponentAnimState('hit');
        } else {
          setPlayerAnimState('hit');
        }
        setHitEffect({
          target: isPlayerAttacking ? 'opponent' : 'player',
          type: isCritical ? 'critical' : type === 'skill' ? 'explosion' : 'slash',
          id: Date.now(),
        });
      }

      // エフェクト消去
      setTimeout(() => {
        setHitEffect(null);
      }, 400);

      // モーションをアイドルへ復帰
      setTimeout(() => {
        if (!isFinished) {
          setPlayerAnimState('idle');
          setOpponentAnimState('idle');
        }
      }, 300);
    }, 120);

    return () => clearTimeout(hitTimer);
  }, [lastActionEvent, isFinished, player.name, opponent.name]);

  // 現在選択中のロケーション情報
  const currentLocation = LOCATIONS.find(l => l.id === selectedLocationId) || LOCATIONS[0];

  // HPバーのパーセンテージ計算
  const playerHpPct = Math.max(0, Math.min(100, (player.currentDurability / player.maxDurability) * 100));
  const opponentHpPct = Math.max(0, Math.min(100, (opponent.currentDurability / opponent.maxDurability) * 100));

  // APバーのパーセンテージ計算 (0〜1000)
  const playerApPct = Math.max(0, Math.min(100, (player.actionPoints / 1000) * 100));
  const opponentApPct = Math.max(0, Math.min(100, (opponent.actionPoints / 1000) * 100));

  return (
    <div className="relative rounded-2xl overflow-hidden border-2 border-stone-800 shadow-xl bg-stone-950 select-none">
      {/* 遠征ステージ背景環境 */}
      <div className="absolute inset-0 z-0">
        <LocationEnvironment 
          locationId={selectedLocationId}
          speedMultiplier={0.3}
          animateScroll={true}
        />
        {/* ステージ全体のライティングとシャドウグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />
      </div>

      {/* アリーナ上部HUD: ステージ切替 & 一時停止・速度倍速操作 & 各種ヘルス・行動値ゲージ */}
      <div className="relative z-20 p-3 sm:p-4 space-y-2.5">
        {/* 上段: ステージ切替ドロップダウン & 一時停止・速度コントロールボタン */}
        <div className="flex items-center justify-between gap-2">
          {/* 左側: ステージ選択（「遠征戦場」テキストは削除しステージ名のみ表示） */}
          <div className="relative">
            <button
              onClick={() => setShowStageMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/80 border border-stone-600 text-stone-200 text-xs font-bold transition-colors backdrop-blur-xs cursor-pointer"
              title="ステージ背景を変更"
            >
              <Gi.GiTreasureMap className="text-amber-400 text-sm" />
              <span>{currentLocation.name}</span>
              <Gi.GiPerspectiveDiceSixFacesRandom className="text-stone-400 text-xs ml-0.5" />
            </button>

            {/* ステージ選択ドロップダウンメニュー */}
            <AnimatePresence>
              {showStageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  className="absolute top-full left-0 mt-1.5 w-52 bg-stone-900/95 border border-stone-700 rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-md"
                >
                  <div className="text-[10px] text-stone-400 font-bold px-2 py-1 border-b border-stone-800 mb-1">
                    ステージを選択
                  </div>
                  {LOCATIONS.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocationId(loc.id);
                        setShowStageMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                        selectedLocationId === loc.id 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : 'text-stone-300 hover:bg-stone-800'
                      }`}
                    >
                      <span>{loc.name}</span>
                      {selectedLocationId === loc.id && (
                        <span className="text-[10px] text-amber-400">選択中</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 右側: 技説明ボタン & 一時停止/再開 & 速度倍速ボタン */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* 繰り出した技の解説・図鑑ボタン */}
            {onOpenSkillModal && (
              <button
                onClick={() => onOpenSkillModal()}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-500/50 shadow-xs cursor-pointer backdrop-blur-xs"
                title="繰り出した技の説明・図鑑を開く"
              >
                <Gi.GiInspiration className="text-amber-400 text-xs" />
                <span className="hidden sm:inline">技説明</span>
                <span className="sm:hidden">技</span>
                <span className="text-[10px] bg-amber-400/20 px-1 py-0.2 rounded text-amber-200 font-mono">
                  {player.learnedSkills.length + opponent.learnedSkills.length}
                </span>
              </button>
            )}

            {/* 一時停止 / 再開ボタン */}
            {onTogglePause && !isFinished && (
              <button
                onClick={onTogglePause}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer backdrop-blur-xs ${
                  isPaused 
                    ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 ring-2 ring-amber-300' 
                    : 'bg-black/60 hover:bg-black/80 text-stone-200 border border-stone-600'
                }`}
                title={isPaused ? "演習を再開" : "演習を一時停止"}
              >
                {isPaused ? (
                  <>
                    <Gi.GiPlayButton className="text-stone-950 text-xs" />
                    <span>再開</span>
                  </>
                ) : (
                  <>
                    <Gi.GiPauseButton className="text-amber-400 text-xs" />
                    <span>一時停止</span>
                  </>
                )}
              </button>
            )}

            {/* 速度倍速ボタン (1x, 2x, 3x) */}
            {onSetSpeed && (
              <div className="flex items-center gap-0.5 bg-black/60 p-0.5 rounded-lg border border-stone-600 backdrop-blur-xs font-mono">
                {[1, 2, 3].map(s => (
                  <button
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      speed === s 
                        ? 'bg-amber-400 text-stone-950 ring-1 ring-amber-300 font-black shadow-xs' 
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                    title={`速度 ${s}倍速`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 中段: 対戦両機のHPバー & APバー (VS レイアウト) */}
        <div className="grid grid-cols-11 gap-2 items-center bg-stone-900/80 p-2.5 rounded-xl border border-stone-700/70 backdrop-blur-md shadow-inner">
          {/* 左側: プレイヤー情報バー */}
          <div className="col-span-5 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-amber-300 truncate max-w-[120px] sm:max-w-[160px] flex items-center gap-1">
                <Gi.GiRobotGolem className="text-amber-400 text-sm" />
                {player.name}
              </span>
              <span className="font-mono text-[11px] text-stone-300 font-bold">
                {player.currentDurability.toLocaleString()} <span className="text-[9px] text-stone-400 font-normal">/ {player.maxDurability.toLocaleString()}</span>
              </span>
            </div>
            {/* HPゲージ */}
            <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-700">
              <motion.div 
                className={`h-full rounded-full transition-all duration-150 ${
                  playerHpPct > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                  playerHpPct > 20 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                  'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                }`}
                style={{ width: `${playerHpPct}%` }}
              />
            </div>
            {/* AP (行動値) ゲージ */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-cyan-400 font-bold font-mono">AP</span>
              <div className="h-1.5 flex-1 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className={`h-full transition-all duration-100 ${
                    playerApPct >= 95 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-cyan-600'
                  }`}
                  style={{ width: `${playerApPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 中央 VS バッジ */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <span className="font-black text-stone-400 text-xs sm:text-sm font-mono tracking-widest text-shadow-sm">
              VS
            </span>
          </div>

          {/* 右側: 相手情報バー */}
          <div className="col-span-5 space-y-1 text-right">
            <div className="flex items-center justify-between text-xs flex-row-reverse">
              <span className="font-black text-red-400 truncate max-w-[120px] sm:max-w-[160px] flex items-center gap-1 flex-row-reverse">
                <Gi.GiRobotAntennas className="text-red-400 text-sm" />
                {opponent.name}
              </span>
              <span className="font-mono text-[11px] text-stone-300 font-bold">
                {opponent.currentDurability.toLocaleString()} <span className="text-[9px] text-stone-400 font-normal">/ {opponent.maxDurability.toLocaleString()}</span>
              </span>
            </div>
            {/* HPゲージ (右から左へ) */}
            <div className="h-2.5 w-full bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-700 flex justify-end">
              <motion.div 
                className={`h-full rounded-full transition-all duration-150 ${
                  opponentHpPct > 50 ? 'bg-gradient-to-l from-emerald-500 to-green-400' :
                  opponentHpPct > 20 ? 'bg-gradient-to-l from-amber-500 to-yellow-400' :
                  'bg-gradient-to-l from-red-600 to-rose-400 animate-pulse'
                }`}
                style={{ width: `${opponentHpPct}%` }}
              />
            </div>
            {/* AP (行動値) ゲージ */}
            <div className="flex items-center gap-1 justify-end">
              <div className="h-1.5 flex-1 bg-stone-950 rounded-full overflow-hidden border border-stone-800 flex justify-end">
                <div 
                  className={`h-full transition-all duration-100 ${
                    opponentApPct >= 95 ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-amber-600'
                  }`}
                  style={{ width: `${opponentApPct}%` }}
                />
              </div>
              <span className="text-[9px] text-amber-400 font-bold font-mono">AP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 技名コールカットインオーバーレイ（タップで説明表示） */}
      <AnimatePresence>
        {skillBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            onClick={() => {
              if (onOpenSkillModal) {
                const found = ALL_COMBAT_SKILLS.find(s => s.name === skillBanner.skillName);
                onOpenSkillModal(found);
              }
            }}
            className={`absolute top-24 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full border-2 shadow-2xl font-black text-sm tracking-wider flex items-center gap-2 backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
              skillBanner.isPlayer
                ? 'bg-amber-500/90 text-stone-950 border-amber-300 ring-4 ring-amber-500/30'
                : 'bg-red-600/90 text-white border-red-300 ring-4 ring-red-600/30'
            }`}
            title="タップして技の詳細説明を見る"
          >
            <Gi.GiLightningBow className="text-lg animate-bounce" />
            <span>繰り出した技: 【{skillBanner.skillName}】</span>
            <Gi.GiLightningBow className="text-lg animate-bounce" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 繰り出した技（ピコーン！）頭上演出（タップで説明表示） */}
      <AnimatePresence>
        {lastLearnedSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: -30, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              if (onOpenSkillModal) {
                onOpenSkillModal(lastLearnedSkill.skill);
              }
            }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-50 text-center cursor-pointer"
            title="タップして技の詳細説明を見る"
          >
            <div className="bg-yellow-400 text-stone-950 font-black px-3 py-1 rounded-xl shadow-2xl border-2 border-white flex items-center gap-1 text-xs hover:scale-105 active:scale-95 transition-transform">
              <Gi.GiInspiration className="text-xl text-amber-900 animate-spin" />
              <span>繰り出した技！【{lastLearnedSkill.skill.name}】</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 中央バトルステージエリア: 自機と相手ロボットが向き合う！ */}
      <div className="relative z-10 h-64 sm:h-72 w-full flex items-end justify-between px-6 sm:px-14 pb-8">
        
        {/* 立体バトルアリーナグラウンド (遠近法パースペクティブ地面) */}
        <div 
          className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(to top, rgba(30, 27, 24, 0.95), transparent)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />

        {/* -------------------- 自機ロボット（左側） -------------------- */}
        <div className="relative flex flex-col items-center">
          {/* プレイヤーのポップアップ数字 */}
          <div className="absolute -top-12 inset-x-0 flex flex-col items-center pointer-events-none z-30">
            <AnimatePresence>
              {popups.filter(p => p.targetId === 'player').slice(-2).map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className={`font-black font-mono tracking-wider drop-shadow-md ${
                    p.type === 'dodge' ? 'text-sky-300 text-base' :
                    p.type === 'heal' ? 'text-emerald-300 text-lg' :
                    p.type === 'critical' ? 'text-yellow-400 text-xl' :
                    p.type === 'learn' ? 'text-amber-300 text-sm' :
                    'text-red-400 text-base'
                  }`}
                >
                  {p.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ロボット本体コンテナ & アニメーション */}
          <motion.div
            className="relative"
            animate={
              playerAnimState === 'attack'
                ? {
                    // 右側の敵に向かって勢いよくステップイン！
                    x: [0, 85, 90, 0],
                    y: [0, -8, 2, 0],
                    rotate: [0, 8, 12, 0],
                    scale: [1, 1.1, 1.12, 1],
                  }
                : playerAnimState === 'skill'
                ? {
                    // 技発動: 溜めてからの強烈な超突進！
                    x: [-15, 110, 115, 0],
                    y: [0, -18, 4, 0],
                    rotate: [-5, 15, 18, 0],
                    scale: [1, 1.2, 1.25, 1],
                  }
                : playerAnimState === 'hit'
                ? {
                    // 被弾: 後退ノックバック ＋ 激しいシェイク
                    x: [0, -30, -20, 0],
                    rotate: [0, -12, 8, -6, 0],
                    filter: ['brightness(1)', 'brightness(2.5) contrast(1.5)', 'brightness(1)'],
                  }
                : playerAnimState === 'dodge'
                ? {
                    // 回避: 上空へ軽快にバックステップジャンプ！
                    y: [0, -45, -20, 0],
                    x: [0, -25, -10, 0],
                    rotate: [0, -20, -10, 0],
                  }
                : playerAnimState === 'victory'
                ? {
                    y: [0, -15, 0, -10, 0],
                    scale: [1, 1.08, 1, 1.08, 1],
                  }
                : playerAnimState === 'defeat'
                ? {
                    y: [0, 15, 15],
                    rotate: [0, -25, -30],
                    opacity: 0.6,
                  }
                : {
                    // アイドル待機モーション (呼吸のような浮遊)
                    y: [0, -5, 0],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            transition={
              playerAnimState === 'idle'
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: playerAnimState === 'skill' ? 0.35 : 0.25, ease: 'easeOut' }
            }
          >
            {/* ロボットビジュアル (右向き) */}
            <div className="relative">
              <RobotVisual
                robot={player.robotRef}
                size={110}
                hideBackground={true}
                hideBubble={true}
                animateVictory={playerAnimState === 'victory'}
                isTroubled={playerAnimState === 'defeat' || (playerHpPct < 25 && playerAnimState === 'idle')}
              />

              {/* 攻撃時のスラッシュ光刃 / 突進エフェクト */}
              {(playerAnimState === 'attack' || playerAnimState === 'skill') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 0 }}
                  animate={{ opacity: 1, scale: 1.4, x: 50 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 -right-6 -translate-y-1/2 pointer-events-none text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]"
                >
                  <Gi.GiSwordClash className="text-4xl animate-pulse" />
                </motion.div>
              )}

              {/* 自機が被弾した瞬間のヒットスパーク */}
              {hitEffect && hitEffect.target === 'player' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <div className="relative">
                    <Gi.GiExplosionRays className="text-6xl text-red-500 drop-shadow-[0_0_16px_rgba(239,68,68,1)] animate-spin" />
                    <Gi.GiSparkles className="absolute inset-0 text-5xl text-yellow-300 animate-ping" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* 足元の楕円シャドウ */}
          <div className="w-24 h-4 bg-black/60 rounded-full blur-xs mt-1 pointer-events-none" />

          {/* ロボット名バッジ */}
          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-sm flex items-center gap-1">
            <span>自機</span>
            <span className="font-normal text-stone-400">Pow:{player.power}</span>
          </div>
        </div>

        {/* -------------------- 相手ロボット（右側） -------------------- */}
        <div className="relative flex flex-col items-center">
          {/* 相手のポップアップ数字 */}
          <div className="absolute -top-12 inset-x-0 flex flex-col items-center pointer-events-none z-30">
            <AnimatePresence>
              {popups.filter(p => p.targetId === 'opponent').slice(-2).map(p => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 1, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0, y: -45, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className={`font-black font-mono tracking-wider drop-shadow-md ${
                    p.type === 'dodge' ? 'text-sky-300 text-base' :
                    p.type === 'heal' ? 'text-emerald-300 text-lg' :
                    p.type === 'critical' ? 'text-yellow-400 text-xl' :
                    p.type === 'learn' ? 'text-amber-300 text-sm' :
                    'text-red-400 text-base'
                  }`}
                >
                  {p.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ロボット本体コンテナ & アニメーション */}
          <motion.div
            className="relative"
            animate={
              opponentAnimState === 'attack'
                ? {
                    // 左側の自機に向かって勢いよくステップイン！
                    x: [0, -85, -90, 0],
                    y: [0, -8, 2, 0],
                    rotate: [0, -8, -12, 0],
                    scale: [1, 1.1, 1.12, 1],
                  }
                : opponentAnimState === 'skill'
                ? {
                    // 技発動: 溜めてからの強烈な超突進！
                    x: [15, -110, -115, 0],
                    y: [0, -18, 4, 0],
                    rotate: [5, -15, -18, 0],
                    scale: [1, 1.2, 1.25, 1],
                  }
                : opponentAnimState === 'hit'
                ? {
                    // 被弾: 後退ノックバック ＋ 激しいシェイク
                    x: [0, 30, 20, 0],
                    rotate: [0, 12, -8, 6, 0],
                    filter: ['brightness(1)', 'brightness(2.5) contrast(1.5)', 'brightness(1)'],
                  }
                : opponentAnimState === 'dodge'
                ? {
                    // 回避: 上空へ軽快にバックステップジャンプ！
                    y: [0, -45, -20, 0],
                    x: [0, 25, 10, 0],
                    rotate: [0, 20, 10, 0],
                  }
                : opponentAnimState === 'victory'
                ? {
                    y: [0, -15, 0, -10, 0],
                    scale: [1, 1.08, 1, 1.08, 1],
                  }
                : opponentAnimState === 'defeat'
                ? {
                    y: [0, 15, 15],
                    rotate: [0, 25, 30],
                    opacity: 0.6,
                  }
                : {
                    // アイドル待機モーション (呼吸のような浮遊)
                    y: [0, -5, 0],
                    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            transition={
              opponentAnimState === 'idle'
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                : { duration: opponentAnimState === 'skill' ? 0.35 : 0.25, ease: 'easeOut' }
            }
          >
            {/* 相手ロボットビジュアル (左向きにするため水平反転 scale-x-[-1] を適用し、互いに向き合う！) */}
            <div className="relative transform scale-x-[-1]">
              <RobotVisual
                robot={opponentRobotModel}
                size={110}
                hideBackground={true}
                hideBubble={true}
                animateVictory={opponentAnimState === 'victory'}
                isTroubled={opponentAnimState === 'defeat' || (opponentHpPct < 25 && opponentAnimState === 'idle')}
              />

              {/* 相手攻撃時のスラッシュ光刃 / 突進エフェクト */}
              {(opponentAnimState === 'attack' || opponentAnimState === 'skill') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 0 }}
                  animate={{ opacity: 1, scale: 1.4, x: 50 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-1/2 -right-6 -translate-y-1/2 pointer-events-none text-red-400 drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
                >
                  <Gi.GiLaserSparks className="text-4xl animate-pulse" />
                </motion.div>
              )}

              {/* 相手が被弾した瞬間のヒットスパーク */}
              {hitEffect && hitEffect.target === 'opponent' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <div className="relative">
                    <Gi.GiExplosionRays className="text-6xl text-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,1)] animate-spin" />
                    <Gi.GiSparkles className="absolute inset-0 text-5xl text-white animate-ping" />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* 足元の楕円シャドウ */}
          <div className="w-24 h-4 bg-black/60 rounded-full blur-xs mt-1 pointer-events-none" />

          {/* 敵機名バッジ */}
          <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-stone-900/90 border border-red-500/40 text-[10px] font-bold text-red-300 shadow-sm flex items-center gap-1">
            <span>敵機</span>
            <span className="font-normal text-stone-400">Pow:{opponent.power}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
