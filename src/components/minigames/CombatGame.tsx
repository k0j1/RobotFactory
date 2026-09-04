import React, { useState, useEffect, useRef } from 'react';
import { MinigameProps } from './Shared';
import { CombatEngine, CombatEngineSnapshot } from './combat/CombatEngine';
import { CombatArena } from './combat/CombatArena';
import { CombatFighterCard } from './combat/CombatFighterCard';
import { CombatLogView } from './combat/CombatLogView';
import { Card, Button, Badge } from '../ui/core';
import { theme } from '../../styles/theme';
import * as Gi from 'react-icons/gi';
import { motion, AnimatePresence } from 'motion/react';

export const CombatGame: React.FC<MinigameProps> = ({
  activeRobot,
  activeOpponent,
  onFinish,
  speed,
  isPaused,
  isFinished: parentFinished,
  battleResult: parentResult
}) => {
  const engineRef = useRef<CombatEngine | null>(null);
  const [snapshot, setSnapshot] = useState<CombatEngineSnapshot | null>(null);
  const [attackingFighterId, setAttackingFighterId] = useState<string | null>(null);
  const [hitFighterId, setHitFighterId] = useState<string | null>(null);
  const [learnedBanner, setLearnedBanner] = useState<{ name: string; desc: string; fighterName: string } | null>(null);
  const [showDetailCards, setShowDetailCards] = useState<boolean>(true);
  const lastAttackCountRef = useRef({ player: 0, opponent: 0 });
  const hasFinishedReportedRef = useRef(false);

  // エンジンの初期化
  useEffect(() => {
    const engine = new CombatEngine(activeRobot, activeOpponent);
    engineRef.current = engine;
    setSnapshot(engine.getSnapshot());
    hasFinishedReportedRef.current = false;
    lastAttackCountRef.current = { player: 0, opponent: 0 };
  }, [activeRobot, activeOpponent]);

  // 戦闘ループ（100msごとにTick）
  useEffect(() => {
    if (!engineRef.current || parentFinished || isPaused) return;

    // 0.1秒ごとのTick間隔（speed倍速に応じてタイマー頻度またはデルタを調整）
    const intervalMs = Math.max(25, Math.floor(100 / speed));
    const deltaSeconds = 0.1;

    const timer = setInterval(() => {
      if (!engineRef.current) return;
      const engine = engineRef.current;

      engine.update(deltaSeconds);
      const nextSnap = engine.getSnapshot();
      setSnapshot(nextSnap);

      // 攻撃アニメーションの検知
      if (nextSnap.player.attacksCount > lastAttackCountRef.current.player) {
        lastAttackCountRef.current.player = nextSnap.player.attacksCount;
        setAttackingFighterId('player');
        setHitFighterId('opponent');
        setTimeout(() => {
          setAttackingFighterId(null);
          setHitFighterId(null);
        }, 180);
      } else if (nextSnap.opponent.attacksCount > lastAttackCountRef.current.opponent) {
        lastAttackCountRef.current.opponent = nextSnap.opponent.attacksCount;
        setAttackingFighterId('opponent');
        setHitFighterId('player');
        setTimeout(() => {
          setAttackingFighterId(null);
          setHitFighterId(null);
        }, 180);
      }

      // 閃きバナー演出
      if (nextSnap.lastLearnedSkill) {
        setLearnedBanner({
          name: nextSnap.lastLearnedSkill.skill.name,
          desc: nextSnap.lastLearnedSkill.skill.desc,
          fighterName: nextSnap.lastLearnedSkill.fighterName
        });
        engine.clearLastLearnedSkill();
        setTimeout(() => {
          setLearnedBanner(null);
        }, 2200);
      }

      // 終了判定
      if (nextSnap.isFinished && !hasFinishedReportedRef.current) {
        hasFinishedReportedRef.current = true;
        clearInterval(timer);
        if (nextSnap.winner === 'player') {
          onFinish('win');
        } else if (nextSnap.winner === 'opponent') {
          onFinish('lose');
        } else {
          onFinish('draw');
        }
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [speed, isPaused, parentFinished, onFinish]);

  if (!snapshot) {
    return (
      <div className="p-8 text-center text-stone-500 font-bold">
        戦闘準備中...
      </div>
    );
  }

  const { player, opponent, isFinished, winner, logs, popups, lastActionEvent, lastLearnedSkill } = snapshot;
  const playerPopups = popups.filter(p => p.targetId === 'player');
  const opponentPopups = popups.filter(p => p.targetId === 'opponent');

  return (
    <div className="space-y-3.5 relative">
      {/* 閃き（ひらめき）カットイン演出オーバーレイ */}
      <AnimatePresence>
        {learnedBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none w-11/12 max-w-md"
          >
            <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-1 rounded-2xl shadow-2xl border-2 border-white">
              <div className="bg-stone-900 text-white p-3 rounded-xl text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-yellow-300 font-black text-sm tracking-wider animate-bounce">
                  <Gi.GiInspiration className="text-xl" />
                  <span>ピコーン！技を閃いた！</span>
                  <Gi.GiInspiration className="text-xl" />
                </div>
                <div className="text-xs text-amber-200 font-bold">{learnedBanner.fighterName}</div>
                <div className="text-lg font-black text-white tracking-widest text-shadow-sm">
                  【{learnedBanner.name}】
                </div>
                <div className="text-[11px] text-stone-300 leading-tight">
                  {learnedBanner.desc}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 遠征ステージ背景 & 自機・相手ロボットが向き合うバトルアリーナ */}
      <CombatArena
        player={player}
        opponent={opponent}
        activeOpponent={activeOpponent}
        lastActionEvent={lastActionEvent}
        lastLearnedSkill={lastLearnedSkill}
        popups={popups}
        speed={speed}
        isPaused={isPaused}
        isFinished={isFinished}
        winner={winner}
      />

      {/* ステータスカード展開切り替え */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
          <Gi.GiBrain className="text-amber-600" />
          <span>ファイター詳細スペック・習得技</span>
        </span>
        <button
          onClick={() => setShowDetailCards(prev => !prev)}
          className="text-[11px] text-stone-600 hover:text-stone-900 font-bold underline cursor-pointer"
        >
          {showDetailCards ? '詳細をたたむ ▲' : '詳細をひらく ▼'}
        </button>
      </div>

      {/* 左右ファイターカード（能力値・習得技・バフ詳細） */}
      {showDetailCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CombatFighterCard
            fighter={player}
            popups={playerPopups}
            isAttacking={attackingFighterId === 'player'}
            isHit={hitFighterId === 'player'}
          />
          <CombatFighterCard
            fighter={opponent}
            popups={opponentPopups}
            isAttacking={attackingFighterId === 'opponent'}
            isHit={hitFighterId === 'opponent'}
          />
        </div>
      )}

      {/* 戦闘ログビュー */}
      <CombatLogView logs={logs} />

      {/* 戦闘終了リザルト表示 */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border-2 text-center shadow-md space-y-3 ${
            winner === 'player' 
              ? 'bg-amber-50 border-amber-400 text-amber-950' 
              : winner === 'opponent' 
                ? 'bg-stone-100 border-stone-400 text-stone-900' 
                : 'bg-stone-100 border-stone-300 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {winner === 'player' ? (
              <>
                <Gi.GiTrophy className="text-amber-500 text-3xl animate-bounce" />
                <h3 className="text-lg sm:text-xl font-black text-amber-900 tracking-wider">
                  演習クリア！完全勝利！
                </h3>
              </>
            ) : winner === 'opponent' ? (
              <>
                <Gi.GiHazardSign className="text-red-500 text-2xl" />
                <h3 className="text-lg sm:text-xl font-black text-stone-800 tracking-wider">
                  演習終了（敗北）
                </h3>
              </>
            ) : (
              <h3 className="text-lg sm:text-xl font-black text-stone-800 tracking-wider">
                演習終了（引き分け）
              </h3>
            )}
          </div>

          <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
            {winner === 'player' 
              ? `お見事！${activeOpponent.name}の耐久力を削り切りました！報酬として修理キット × ${activeOpponent.rewardKits} 個を獲得しました。` 
              : winner === 'opponent' 
                ? `${activeOpponent.name}の猛攻により耐久限界に達しました。工房でロボットのステータス強化やパーツ換装を行い再挑戦しましょう！` 
                : '両機が同時に耐久限界を迎えました。激戦の記録が残されました。'}
          </p>

          {/* 戦闘スタッツまとめ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left text-xs bg-white/90 p-2.5 rounded-xl border border-stone-300 max-w-xl mx-auto">
            <div>
              <div className="text-[10px] text-stone-500">自機与ダメージ</div>
              <div className="font-mono font-bold text-stone-800 text-sm">{player.damageDealt.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-500">回避回数 (Dex)</div>
              <div className="font-mono font-bold text-sky-700 text-sm">{player.dodgesCount} 回</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-500">閃いた新技 (Int)</div>
              <div className="font-mono font-bold text-amber-700 text-sm">{player.skillsLearnedCount} 個</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-500">交戦時間</div>
              <div className="font-mono font-bold text-stone-800 text-sm">{snapshot.elapsedSeconds.toFixed(1)} 秒</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

