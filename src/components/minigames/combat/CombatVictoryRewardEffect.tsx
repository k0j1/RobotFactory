import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Gi from 'react-icons/gi';

export interface CombatVictoryRewardEffectProps {
  isActive: boolean;
  rewardFame?: number;
  rewardElements?: number;
  rewardKits?: number;
  className?: string;
  mode?: 'arena' | 'result';
}

interface FlyingItem {
  id: string;
  type: 'fame' | 'element' | 'kit' | 'sparkle';
  icon: React.ReactNode;
  colorClass: string;
  glowClass: string;
  startLeftPct: number;
  startTopPct: number;
  targetX: number;
  targetY: number;
  controlY: number;
  scale: number;
  rotate: number;
  delay: number;
  duration: number;
}

export const CombatVictoryRewardEffect: React.FC<CombatVictoryRewardEffectProps> = ({
  isActive,
  rewardFame = 0,
  rewardElements = 0,
  rewardKits = 1,
  className = '',
  mode = 'arena',
}) => {
  // 飛来する報酬アイコン群を生成
  const flyingItems = useMemo<FlyingItem[]>(() => {
    if (!isActive) return [];

    const items: FlyingItem[] = [];
    let idx = 0;

    // 起点設定: arenaは敵機がいる右側(65%)から、resultは中央(50%)から
    const baseLeft = mode === 'arena' ? 65 : 50;
    const baseTop = mode === 'arena' ? 60 : 45;

    // 1. 名声トロフィー（名声獲得時、または勝利の栄光として）
    const fameCount = rewardFame > 0 ? Math.min(6, Math.max(3, Math.ceil(rewardFame / 10))) : 2;
    for (let i = 0; i < fameCount; i++) {
      // 飛び散る先の座標（アリーナなら左側・手前へ、リザルトなら全方位〜上へ）
      const spreadX = mode === 'arena'
        ? -80 - Math.random() * 150
        : (Math.random() - 0.5) * 220;
      const spreadY = -80 - Math.random() * 90;

      items.push({
        id: `fame_${idx++}`,
        type: 'fame',
        icon: <Gi.GiTrophyCup className="text-2xl sm:text-3xl" />,
        colorClass: 'text-amber-300',
        glowClass: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]',
        startLeftPct: baseLeft + (Math.random() - 0.5) * 12,
        startTopPct: baseTop + (Math.random() - 0.5) * 8,
        targetX: spreadX,
        targetY: spreadY,
        controlY: spreadY - 40 - Math.random() * 30,
        scale: 1.1 + Math.random() * 0.3,
        rotate: -35 + Math.random() * 70,
        delay: 0.15 + i * 0.12,
        duration: 1.5 + Math.random() * 0.3,
      });
    }

    // 2. エレメントクリスタル（エレメント獲得時、Lv.5〜）
    const elementCount = rewardElements > 0 ? Math.min(6, Math.max(3, Math.ceil(rewardElements / 15))) : (rewardFame === 0 && rewardKits > 0 ? 0 : 2);
    for (let i = 0; i < elementCount; i++) {
      const spreadX = mode === 'arena'
        ? -60 - Math.random() * 170
        : (Math.random() - 0.5) * 240;
      const spreadY = -90 - Math.random() * 100;

      items.push({
        id: `element_${idx++}`,
        type: 'element',
        icon: <Gi.GiCrystalBars className="text-2xl sm:text-3xl" />,
        colorClass: 'text-cyan-300',
        glowClass: 'drop-shadow-[0_0_14px_rgba(34,211,238,0.95)]',
        startLeftPct: baseLeft + (Math.random() - 0.5) * 12,
        startTopPct: baseTop + (Math.random() - 0.5) * 8,
        targetX: spreadX,
        targetY: spreadY,
        controlY: spreadY - 50 - Math.random() * 30,
        scale: 1.05 + Math.random() * 0.3,
        rotate: -50 + Math.random() * 100,
        delay: 0.28 + i * 0.11,
        duration: 1.55 + Math.random() * 0.3,
      });
    }

    // 3. 修理キットスパナ
    const kitCount = Math.max(1, Math.min(3, rewardKits));
    for (let i = 0; i < kitCount; i++) {
      const spreadX = mode === 'arena'
        ? -40 - Math.random() * 130
        : (Math.random() - 0.5) * 180;
      const spreadY = -60 - Math.random() * 70;

      items.push({
        id: `kit_${idx++}`,
        type: 'kit',
        icon: <Gi.GiSpanner className="text-xl sm:text-2xl" />,
        colorClass: 'text-amber-200',
        glowClass: 'drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]',
        startLeftPct: baseLeft + (Math.random() - 0.5) * 10,
        startTopPct: baseTop + (Math.random() - 0.5) * 6,
        targetX: spreadX,
        targetY: spreadY,
        controlY: spreadY - 35,
        scale: 1.0,
        rotate: -60 + Math.random() * 120,
        delay: 0.05 + i * 0.15,
        duration: 1.4,
      });
    }

    // 4. きらめきスパークル
    for (let i = 0; i < 8; i++) {
      const spreadX = mode === 'arena'
        ? -30 - Math.random() * 200
        : (Math.random() - 0.5) * 260;
      const spreadY = -40 - Math.random() * 120;

      items.push({
        id: `sparkle_${idx++}`,
        type: 'sparkle',
        icon: <Gi.GiSparkles className="text-lg sm:text-xl" />,
        colorClass: i % 2 === 0 ? 'text-yellow-200' : 'text-cyan-200',
        glowClass: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]',
        startLeftPct: baseLeft + (Math.random() - 0.5) * 16,
        startTopPct: baseTop + (Math.random() - 0.5) * 10,
        targetX: spreadX,
        targetY: spreadY,
        controlY: spreadY - 25,
        scale: 0.8 + Math.random() * 0.4,
        rotate: Math.random() * 180,
        delay: 0.1 + i * 0.08,
        duration: 1.3,
      });
    }

    return items;
  }, [isActive, rewardFame, rewardElements, rewardKits, mode]);

  if (!isActive) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-40 overflow-hidden ${className}`}>
      {/* 背景の勝利スパークバースト光輪 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: [0, 0.75, 0.4, 0], scale: [0.3, 1.4, 1.8] }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-radial from-amber-400/30 via-yellow-500/10 to-transparent blur-xl pointer-events-none"
      />

      {/* 飛来する報酬アイコンパーティクル群 */}
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.2,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0.9, 0],
              scale: [0.2, item.scale * 1.35, item.scale, item.scale * 0.9, 0.2],
              x: [0, item.targetX * 0.5, item.targetX],
              y: [0, item.controlY, item.targetY],
              rotate: [0, item.rotate * 0.5, item.rotate],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              ease: [0.22, 1, 0.36, 1], // 放物線イージング
            }}
            style={{
              left: `${item.startLeftPct}%`,
              top: `${item.startTopPct}%`,
            }}
            className={`absolute flex items-center justify-center ${item.colorClass} ${item.glowClass}`}
          >
            {item.icon}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 獲得報酬サマリーのポップアップバッジ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.15, 1, 0.9], y: [30, -10, -15, -25] }}
        transition={{ duration: 2.3, delay: 0.35, ease: 'easeOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-50"
      >
        <div className="bg-stone-950/90 border-2 border-amber-400/90 rounded-2xl px-4 py-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] backdrop-blur-md flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-300 font-black text-xs sm:text-sm drop-shadow-sm">
            <Gi.GiTrophyCup className="text-base text-amber-400 animate-bounce" />
            <span>名声 {rewardFame > 0 ? `+${rewardFame}` : 'GET!'}</span>
          </div>

          {rewardElements > 0 && (
            <div className="h-4 w-px bg-stone-700" />
          )}

          {rewardElements > 0 && (
            <div className="flex items-center gap-1 text-cyan-300 font-black text-xs sm:text-sm drop-shadow-sm">
              <Gi.GiCrystalBars className="text-base text-cyan-400 animate-pulse" />
              <span>エレメント +{rewardElements}</span>
            </div>
          )}

          {rewardKits > 0 && (
            <>
              <div className="h-4 w-px bg-stone-700" />
              <div className="flex items-center gap-1 text-stone-200 font-bold text-xs sm:text-sm">
                <Gi.GiSpanner className="text-sm text-stone-400" />
                <span>キット +{rewardKits}</span>
              </div>
            </>
          )}
        </div>

        {/* 光のリングエフェクト */}
        <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold bg-amber-950/80 border border-amber-500/60 px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
          <Gi.GiSparkles className="text-yellow-400" />
          <span>REWARD ACQUIRED</span>
          <Gi.GiSparkles className="text-yellow-400" />
        </span>
      </motion.div>
    </div>
  );
};
