import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Gi from 'react-icons/gi';
import { Robot } from '../../../core/models';
import { 
  CombatEquipmentType, 
  CombatEquipmentRank, 
  COMBAT_EQUIPMENT_RANKS, 
  RANK_ORDER, 
  getEquipmentBonus 
} from '../../../core/combatEquipmentData';
import { GSAPRobotCanvas } from '../../robot/GSAPRobotCanvas';
import { RobotSEAudioEngine } from '../../../core/audio/RobotSEAudioEngine';
import { Button } from '../../ui/core';

export interface CombatEquipmentDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: CombatEquipmentType;
  prevRank: CombatEquipmentRank | null;
  currentRank: CombatEquipmentRank;
  robot: Robot | undefined;
  isInitialPurchase?: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number; // 0 - 100%
  y: number; // initial y offset
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'ribbon';
  rotation: number;
  rotationSpeed: number;
  duration: number;
  delay: number;
  swayAmount: number;
}

const CONFETTI_COLORS = [
  '#f59e0b', // Gold / Amber
  '#fbbf24', // Warm Yellow
  '#00e5ff', // Cyan
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red / Crimson
  '#ffffff', // White Sparkle
];

/**
 * 紙吹雪（コンフェッティ）演出コンポーネント
 */
const ConfettiOverlay: React.FC = () => {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const list: ConfettiPiece[] = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: -(Math.random() * 25 + 5),
        size: Math.random() * 9 + 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'ribbon' : 'rect',
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720,
        duration: Math.random() * 2.8 + 2.4,
        delay: Math.random() * 1.5,
        swayAmount: (Math.random() - 0.5) * 60,
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            opacity: 1,
            rotate: p.rotation,
            scale: 0.8,
          }}
          animate={{
            top: ['0%', '110%'],
            left: [`${p.x}%`, `${p.x + p.swayAmount * 0.4}%`, `${p.x - p.swayAmount * 0.3}%`, `${p.x + p.swayAmount * 0.5}%`],
            rotate: [p.rotation, p.rotation + p.rotationSpeed],
            opacity: [1, 1, 0.8, 0],
            scale: [1, 1.1, 0.9, 0.7],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: p.shape === 'ribbon' ? p.size * 1.8 : p.size,
            height: p.shape === 'ribbon' ? p.size * 0.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'ribbon' ? '2px' : '1px',
            boxShadow: `0 0 6px ${p.color}aa`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * 戦闘専用武装（ビームサーベル・ビームシールド）解放・ランクアップ必殺技祝賀モーダル
 * 自機ロボットが新武装・新ランクカラーの光刃/防壁を放ちながら必殺技を披露し、紙吹雪で祝福
 */
export const CombatEquipmentDemoModal: React.FC<CombatEquipmentDemoModalProps> = ({
  isOpen,
  onClose,
  equipment,
  prevRank,
  currentRank,
  robot,
  isInitialPurchase = false,
}) => {
  const isSaber = equipment === 'beamSaber';
  const currentDef = COMBAT_EQUIPMENT_RANKS[currentRank];
  const prevDef = prevRank ? COMBAT_EQUIPMENT_RANKS[prevRank] : null;

  const currentBonus = getEquipmentBonus(equipment, currentRank);
  const prevBonus = prevRank ? getEquipmentBonus(equipment, prevRank) : 0;
  const bonusDiff = currentBonus - prevBonus;

  // 必殺技パターン定義
  const saberPatterns = useMemo(() => [
    { id: 'ultimate_omega_cross_slash', name: '【必殺奥義】星断オメガクロス', desc: '空間両断X字クロス極大斬撃' },
    { id: 'beam_saber_judgement', name: '【断空斬】正面一刀両断', desc: '腕を正面へ伸ばし一刀両断' },
    { id: 'dual_saber_mirage_dance', name: '【双剣幻影】神速4連舞', desc: '左右二刀流の高速連撃フィニッシュ' },
  ], []);

  const shieldPatterns = useMemo(() => [
    { id: 'shield_barrier', name: '【光波障壁】幾何学ATフィールド', desc: '全周八角形エネルギー防壁展開' },
    { id: 'shield_block_item', name: '【要塞防壁】ナノマテリアル力場', desc: '全方位衝撃波吸収反発ガード' },
  ], []);

  const defaultPattern = isSaber ? 'ultimate_omega_cross_slash' : 'shield_barrier';
  const [selectedPattern, setSelectedPattern] = useState<string>(defaultPattern);
  const [animTriggerKey, setAnimTriggerKey] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // モーダル表示時の祝賀ファンファーレ＆SE再生
  useEffect(() => {
    if (isOpen) {
      setSelectedPattern(defaultPattern);
      setAnimTriggerKey(Date.now());

      try {
        const audio = RobotSEAudioEngine.getInstance();
        audio.playSE('cutin');
        const timer1 = setTimeout(() => {
          audio.playSE('charge');
        }, 250);
        const timer2 = setTimeout(() => {
          if (isSaber) {
            audio.playSE('hyper');
          } else {
            audio.playSE('spark');
          }
        }, 700);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      } catch (e) {
        console.warn('[CelebrationModal] Audio error:', e);
      }
    }
  }, [isOpen, equipment, currentRank, defaultPattern, isSaber]);

  if (!isOpen) return null;

  // 必殺技の再生・切り替え
  const handleSelectPattern = (patId: string) => {
    setSelectedPattern(patId);
    setAnimTriggerKey(Date.now());
    try {
      const audio = RobotSEAudioEngine.getInstance();
      if (isSaber) {
        audio.playSE('slash');
      } else {
        audio.playSE('charge');
      }
    } catch {}
  };

  const currentPatternObj = (isSaber ? saberPatterns : shieldPatterns).find(p => p.id === selectedPattern);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`w-full max-w-3xl flex flex-col rounded-3xl border-2 ${
          isSaber
            ? 'border-amber-400/90 bg-stone-900 shadow-[0_0_60px_rgba(245,158,11,0.35)]'
            : 'border-blue-400/90 bg-stone-900 shadow-[0_0_60px_rgba(59,130,246,0.35)]'
        } text-stone-100 overflow-hidden relative`}
      >
        {/* 紙吹雪（コンフェッティ）エフェクト */}
        <ConfettiOverlay />

        {/* 背景の祝賀放射グロー */}
        <div 
          className={`absolute -top-36 -left-36 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 ${
            isSaber ? 'bg-amber-400' : 'bg-blue-400'
          }`} 
        />
        <div 
          className={`absolute -bottom-36 -right-36 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 ${
            isSaber ? 'bg-yellow-400' : 'bg-cyan-400'
          }`} 
        />

        {/* 1. 祝賀モーダルヘッダー */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 relative z-30 ${
          isSaber 
            ? 'bg-linear-to-r from-amber-950/90 via-stone-900 to-amber-950/70 border-amber-500/40' 
            : 'bg-linear-to-r from-blue-950/90 via-stone-900 to-blue-950/70 border-blue-500/40'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl border shrink-0 shadow-lg ${
              isSaber 
                ? 'bg-amber-500/25 text-amber-300 border-amber-400/70 shadow-amber-500/30 ring-2 ring-amber-400/30' 
                : 'bg-blue-500/25 text-blue-300 border-blue-400/70 shadow-blue-500/30 ring-2 ring-blue-400/30'
            }`}>
              {isSaber ? <Gi.GiBroadsword className="animate-pulse" /> : <Gi.GiShield className="animate-pulse" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border shadow-sm flex items-center gap-1 ${
                  isInitialPurchase 
                    ? 'bg-amber-400 text-amber-950 border-amber-300' 
                    : 'bg-emerald-500 text-stone-950 border-emerald-300'
                }`}>
                  <Gi.GiSparkles />
                  <span>{isInitialPurchase ? 'NEW 武装初解放！' : 'RANK UP! 昇格達成！'}</span>
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border shadow-xs ${currentDef.badgeClass}`}>
                  {currentDef.label}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-wide text-white flex items-center gap-2 mt-1">
                <span>{isSaber ? 'ビームサーベル' : 'ビームシールド'}</span>
                <span className="text-xs sm:text-sm font-bold opacity-90 text-amber-200">
                  {isInitialPurchase ? '新装備解放おめでとうございます！' : `${currentDef.label} へランクアップ！`}
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800/80 transition-colors cursor-pointer text-xl"
            title="閉じる"
          >
            ✕
          </button>
        </div>

        {/* 2. メイン祝賀ボディ */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 relative z-30">
          {/* A. ランク進行度 & ステータス上昇バナー */}
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3 sm:p-4 backdrop-blur-xs shadow-inner">
            {/* 5段階ランクステップ */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {RANK_ORDER.map((r, idx) => {
                const rDef = COMBAT_EQUIPMENT_RANKS[r];
                const isReached = RANK_ORDER.indexOf(currentRank) >= idx;
                const isCurrent = currentRank === r;
                return (
                  <div 
                    key={r}
                    className={`rounded-xl p-1.5 sm:p-2 border text-center transition-all flex flex-col justify-between ${
                      isCurrent
                        ? isSaber
                          ? 'border-amber-400 bg-amber-500/25 shadow-[0_0_16px_rgba(245,158,11,0.5)] ring-2 ring-amber-300'
                          : 'border-blue-400 bg-blue-500/25 shadow-[0_0_16px_rgba(59,130,246,0.5)] ring-2 ring-blue-300'
                        : isReached
                        ? 'border-stone-600 bg-stone-800/80 text-stone-300'
                        : 'border-stone-800 bg-stone-900/50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5 text-[10px] sm:text-xs">
                      {Array.from({ length: idx + 1 }).map((_, i) => (
                        <span key={i} className={isReached ? (isSaber ? 'text-amber-400' : 'text-blue-400') : 'text-stone-700'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-bold mt-0.5 truncate ${
                      isCurrent ? 'text-white font-black' : isReached ? 'text-stone-300' : 'text-stone-600'
                    }`}>
                      {rDef.label}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-stone-400 mt-0.5">
                      {isSaber ? `+${rDef.saberPowerBonus} POW` : `+${rDef.shieldDefenseBonus} DEF`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ステータス上昇ハイライト */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-stone-700/60">
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-400 font-bold shrink-0">補正ステータス:</span>
                <div className="flex items-center gap-2 font-mono">
                  {prevRank && (
                    <span className="text-xs text-stone-400 line-through">
                      {isSaber ? `POW +${prevBonus}` : `DEF +${prevBonus}`}
                    </span>
                  )}
                  <span className={`text-base sm:text-lg font-black flex items-center gap-1.5 ${
                    isSaber ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    <span>{isSaber ? `POW +${currentBonus}` : `DEF +${currentBonus}`}</span>
                    {bonusDiff > 0 && (
                      <span className="text-xs bg-emerald-500/25 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-400/40 animate-pulse">
                        (+{bonusDiff} UP!)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="text-xs text-stone-300 leading-relaxed sm:text-right">
                {currentDef.desc}
              </div>
            </div>
          </div>

          {/* B. ロボット必殺技披露ステージ */}
          <div className="relative rounded-2xl overflow-hidden border-2 bg-stone-950 flex flex-col items-center justify-center p-3 sm:p-4 shadow-2xl">
            {/* ホログラフィック背景グリッド */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:28px_28px] opacity-30 pointer-events-none" />
            <div className={`absolute inset-0 bg-radial from-transparent via-stone-950/70 to-stone-950 pointer-events-none`} />

            {/* 必殺技名タイトルバー */}
            <div className="w-full flex items-center justify-between mb-2 relative z-20">
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-black flex items-center gap-1.5 px-3 py-1 rounded-xl border shadow-sm ${
                  isSaber
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                    : 'bg-blue-950/80 text-blue-300 border-blue-500/60'
                }`}>
                  <Gi.GiCrossedSwords className="text-sm" />
                  <span>{currentPatternObj?.name}</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                  {currentPatternObj?.desc}
                </span>
              </div>

              {/* 音声切替 */}
              <button
                onClick={() => {
                  const audio = RobotSEAudioEngine.getInstance();
                  const next = audio.toggleMute();
                  setIsMuted(next);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-red-950/40 text-red-300 border-red-800' 
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                }`}
              >
                {isMuted ? '🔇 消音' : '🔊 音声ON'}
              </button>
            </div>

            {/* ロボットキャンバス */}
            <div className="relative z-10 w-full h-[260px] sm:h-[300px] flex items-center justify-center">
              <GSAPRobotCanvas
                key={`${selectedPattern}_${animTriggerKey}`}
                robot={robot}
                size={230}
                patternId={selectedPattern}
                speed={1.0}
                loop={true}
                stageTheme="dark"
                hideStageDecorations={false}
                saberRank={isSaber ? currentRank : undefined}
                shieldRank={!isSaber ? currentRank : undefined}
                combatEquipmentRanks={{
                  beamSaber: isSaber ? currentRank : undefined,
                  beamShield: !isSaber ? currentRank : undefined,
                }}
              />
            </div>

            {/* 必殺技切り替えボタン */}
            <div className="w-full mt-3 pt-3 border-t border-stone-800/90 flex items-center justify-center gap-2 flex-wrap relative z-20">
              <span className="text-[11px] text-stone-400 font-bold mr-1">必殺技モーション:</span>
              {(isSaber ? saberPatterns : shieldPatterns).map(pat => (
                <button
                  key={pat.id}
                  onClick={() => handleSelectPattern(pat.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedPattern === pat.id
                      ? isSaber
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-blue-500 text-white border-blue-300 shadow-md ring-2 ring-blue-400/40'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
                  }`}
                >
                  <Gi.GiPlayButton className="text-[10px]" />
                  <span>{pat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. モーダルフッター */}
        <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between shrink-0 relative z-30">
          <div className="text-xs text-stone-400 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>武装ランクカラーがバトル演習に即座に反映されます</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectPattern(selectedPattern)}
              className="text-xs px-3.5 py-2 rounded-xl border border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700 font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Gi.GiCycle className="text-sm" />
              <span>もう一度見る</span>
            </button>
            <button
              onClick={onClose}
              className={`text-xs px-5 py-2 rounded-xl font-black text-stone-950 transition-all cursor-pointer shadow-md flex items-center gap-1 ${
                isSaber
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 ring-2 ring-amber-400/50'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 ring-2 ring-blue-400/50'
              }`}
            >
              <Gi.GiCheckMark />
              <span>完了して戻る</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
